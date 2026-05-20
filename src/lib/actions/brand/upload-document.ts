"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadFileToR2 } from "@/lib/r2";
import { extractPdfText } from "@/lib/extractors/pdf";
import { extractDocxText } from "@/lib/extractors/docx";
import { extractMarkdownText } from "@/lib/extractors/markdown";
import { extractBrandFromText } from "./extract-brand";
import { saveBrandProfile } from "./save-profile";

type UploadResult =
  | { success: true }
  | { success: false; error: string };

const MIME_PDF = "application/pdf";
const MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (file.type === MIME_PDF) return extractPdfText(buffer);
  if (file.type === MIME_DOCX) return extractDocxText(buffer);
  // Markdown / plain text
  return extractMarkdownText(buffer);
}

/**
 * Server action for the Path A upload flow.
 * Chains: R2 upload → text extraction (per MIME type) → Claude brand extraction → DB save
 */
export async function uploadAndExtract(formData: FormData): Promise<UploadResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return { success: false, error: "No files provided" };
  }

  try {
    // 1. Upload each file to R2 in parallel
    await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadFileToR2(buffer, file.name, file.type, session.user.id);
      })
    );

    // 2. Extract text from each file using the correct extractor, then combine
    const textChunks = await Promise.all(files.map(extractTextFromFile));
    const combinedText = textChunks.join("\n\n---\n\n");

    // 3. Call Claude to extract the structured brand profile
    const brandProfile = await extractBrandFromText(combinedText);

    // 4. Persist to the database as a FULL profile
    const saveResult = await saveBrandProfile(brandProfile, "FULL");
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "";
    console.error("Document extraction failed:", err);
    if (errorMessage.includes("R2 environment variables are missing")) {
      return {
        success: false,
        error: "Cloud storage is currently unconfigured (R2 credentials missing). Please try the Questionnaire path.",
      };
    }
    return {
      success: false,
      error: errorMessage.includes("API key")
        ? "AI extraction is currently unavailable (API key missing). Please try the Questionnaire path."
        : "Failed to extract brand data from your documents.",
    };
  }
}

'use client';

import { useState, useRef, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadAndExtract } from '@/lib/actions/brand/upload-document';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
];
const MAX_FILES = 7;
const MAX_SIZE_MB = 10;

type FileEntry = { file: File; id: string };

export default function UploadPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const toAdd = Array.from(incoming).filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) return false;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    setFiles((prev) => {
      const merged = [...prev, ...toAdd.map((f) => ({ file: f, id: crypto.randomUUID() }))];
      return merged.slice(0, MAX_FILES);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleSubmit = () => {
    if (files.length === 0) return;
    setError(null);

    const formData = new FormData();
    files.forEach(({ file }) => formData.append('files', file));

    startTransition(async () => {
      const result = await uploadAndExtract(formData);
      if (result.success) {
        router.push('/onboarding/review');
      } else {
        setError(result.error);
      }
    });
  };

  const isProcessing = isPending;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs text-[#4d4d4d] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Path A — Document Upload
        </div>
        <h1 className="text-2xl font-semibold text-[#171717] tracking-tight -tracking-[0.96px]">Upload your brand documents</h1>
        <p className="text-[#4d4d4d] text-sm">PDF, DOCX, or Markdown · Max 10 MB each · Up to 7 files</p>
      </div>

      {/* Drop zone */}
      <div
        id="drop-zone"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl bg-white border-2 border-dashed border-[#ebebeb] hover:border-blue-500/50 hover:bg-[#fafafa]/50 transition-all duration-200 cursor-pointer group"
      >
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.md,.txt" className="hidden" onChange={onInputChange} />
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-blue-600">
          📎
        </div>
        <div className="text-center">
          <p className="text-[#171717] font-medium text-sm">Drop files here or click to browse</p>
          <p className="text-[#808080] text-xs mt-1">{files.length}/{MAX_FILES} files added</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(({ file, id }) => (
            <li key={id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-base">📄</span>
              <span className="text-[#171717] text-sm flex-1 truncate">{file.name}</span>
              <span className="text-[#808080] text-xs">{(file.size / 1024).toFixed(0)} KB</span>
              <button id={`remove-${id}`} onClick={(e) => { e.stopPropagation(); removeFile(id); }} className="text-[#808080] hover:text-[#171717] transition-colors text-sm ml-1">✕</button>
            </li>
          ))}
        </ul>
      )}

      {isProcessing && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-[#0068d6]">
          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <p>Uploading and extracting brand data with Claude… this may take a moment.</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          id="back-btn"
          onClick={() => router.push('/onboarding')}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#4d4d4d] bg-white border border-[#ebebeb] hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors"
        >
          ← Back
        </button>
        <button
          id="upload-submit-btn"
          onClick={handleSubmit}
          disabled={files.length === 0 || isProcessing}
          className="flex-1 px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#171717]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors"
        >
          {isProcessing ? 'Processing…' : 'Extract Brand Profile →'}
        </button>
      </div>
    </div>
  );
}

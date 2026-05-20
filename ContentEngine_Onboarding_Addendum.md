# ContentEngine — Onboarding Addendum
## Supersedes Section 6.11 of the PRD

**Date:** May 2026
**Status:** Final — Implement in place of original Section 6.11

---

## Context

The original onboarding flow assumed all users would have a brand document to upload. This addendum introduces a second path for users who have no brand assets yet, without building a full brand system builder inside ContentEngine. Both paths produce the same output: a stored brand profile that informs every generation.

---

## Updated Onboarding Flow

There are now two onboarding paths. The user chooses their path on the first screen after account creation.

### Path A — I Have Brand Documents

For users who already have a brand guide, voice and tone document, or any document that describes their brand.

- User uploads up to seven documents in any supported format: PDF, DOCX, or Markdown (.md). Max 10MB per file.
- Multiple files are accepted in a single upload step — user can drag and drop all of them at once.
- Claude reads all uploaded documents and extracts structured brand data across all of them, synthesising into a single unified brand profile.
- If conflicting information is found across documents (e.g. one document says formal tone, another says conversational), Claude flags the specific conflict and asks the user to clarify before saving.
- User is shown a formatted summary of what was extracted and merged.
- User reviews each field, edits anything that is incorrect or incomplete, and confirms.
- Brand profile is saved to their account.
- If BYOK mode: user adds their Anthropic and WaveSpeed API keys before proceeding.
- User lands on the generation dashboard.

---

### Path B — I Am Starting From Scratch

For users who have no brand document and have not yet defined their brand formally.

- User is shown a short guided questionnaire — five to seven questions maximum.
- Estimated completion time shown upfront: "This takes about 90 seconds."
- Claude uses their answers to generate a lightweight content profile.
- User reviews the generated profile, edits anything, and confirms.
- Brand profile is saved to their account marked as "Basic Profile" to distinguish it from a full extracted profile.
- A subtle prompt appears on their profile page: "Want a fuller brand system? See below." — more on this in the nudge section.
- If BYOK mode: user adds their API keys before proceeding.
- User lands on the generation dashboard.

---

## The Five to Seven Onboarding Questions (Path B)

Each question specifies its format: multiple choice (MC) or free text (FT).

**Question 1 — What do you create content about?** `FT`
> Free text. One to two sentences. This becomes their niche and content pillar field.
> Placeholder: "e.g. I teach developers how to build and ship products using AI"

**Question 2 — Who is your audience?** `FT`
> Free text. One sentence. This becomes their audience description field.
> Placeholder: "e.g. Early-career developers and self-taught programmers who want to build real things"

**Question 3 — How do you want to sound?** `MC — pick up to 3`
> Options: Educational, Inspirational, Direct, Conversational, Bold, Humorous, Authoritative, Vulnerable
> This becomes their tone of voice field.

**Question 4 — Which platforms are you active on?** `MC — pick all that apply`
> Options: LinkedIn, Instagram, X (Twitter), TikTok, YouTube
> This populates their platform handles field with a flag to fill in handles later.

**Question 5 — What is one thing your content should never do or say?** `FT`
> Free text. One sentence. Optional but encouraged.
> Placeholder: "e.g. Never sound preachy or use corporate jargon"
> This becomes their avoid phrases field.

**Question 6 — Do you have a brand name or handle you go by?** `FT`
> Free text. Short answer.
> Placeholder: "e.g. Oladipupo Ishola or @olaishola"
> This becomes their brand name and handle field.

**Question 7 — Anything else you want your content to reflect?** `FT — optional`
> Open free text field. No placeholder. Completely optional.
> Anything entered here is appended to the brand profile as additional context.

---

## What Claude Does With the Answers

After the user submits their answers, Claude receives all seven responses in a single prompt and generates a structured brand profile JSON in the same format as the document extraction output. The same brand_profile schema is used regardless of which path the user took.

The system prompt for this step should be stored in `lib/prompts/brand-profile-from-answers.ts`.

```
You are a brand profile builder. The user has answered a short questionnaire about their content brand. Using only their answers, generate a structured brand profile. Return ONLY a valid JSON object with these fields: brand_name, tagline (null if not provided), niche, audience, tone_of_voice, content_pillars (array — infer from their niche answer), key_phrases (array — infer 3 to 5 phrases from their answers), avoid_phrases (array — use their answer to question 5 if provided), platform_handles (object with linkedin/instagram/x/tiktok/youtube — mark selected platforms as "active" and unselected as null), cta_style (infer from tone), brand_values (array — infer 2 to 3 values from their answers), unique_positioning (infer from niche and audience answers), primary_color (null), font (null). Never invent information not implied by their answers. Return only raw JSON. No preamble. No markdown fences.
```

---

## Updating Brand Profile From Settings

Users can update their brand profile at any time from the Settings page. The same rules apply as onboarding.

- Path A users can upload up to seven new or replacement documents. Claude re-extracts and regenerates the full brand profile from the new set of documents. The previous profile is overwritten after the user confirms the new one.
- Path B users can either answer the questionnaire again with updated answers, or graduate to Path A by uploading brand documents they have since created.
- Any user can manually edit individual fields in their brand profile directly from the settings page without re-uploading or re-answering questions.
- Profile type updates automatically from Basic to Full if a Path B user uploads brand documents in settings.

---

This is a passive, non-intrusive nudge. It never appears during onboarding. It appears after the user has generated content at least twice so they have already experienced the value of having a brand profile.

### Where It Appears

- On the Profile page, below the brand profile summary, for Path B users only
- As a subtle inline prompt on the generation dashboard after the second generation session

### What It Says

On the Profile page:

> **Your content profile is a starting point.**
> A full brand system gives you a complete identity — logo, colour system, typography, positioning, and messaging — that makes every piece of content you create instantly recognisable. We are building Brand System Builder for exactly this.
> [Join the waitlist →]

On the generation dashboard (after second session, dismissable):

> Want your content to feel even more distinctly yours? A full brand system is coming.
> [Learn more →]

### What the Link Does

In V1 and early V2: links to a simple waitlist page or a coming soon page for Brand System Builder. Captures email. That is it.

When Brand System Builder launches: links directly to Brand System Builder with a pre-filled context note that the user is coming from ContentEngine.

### Rules for the Nudge

- Never shown to Path A users — they already have a brand document and the message is less relevant
- Never shown during onboarding or on first session — user must generate content at least twice first
- Dismissable permanently — if the user closes it, it never appears again
- Never blocks any action — it is always passive, never a gate

---

## Profile Page Distinction

Users who completed Path B have their profile marked visually as "Basic Profile" with a completion indicator. Something like:

> **Brand Profile — Basic**
> Built from your onboarding answers. Upload a brand document anytime to upgrade your profile automatically.

Users who completed Path A have their profile marked as "Full Profile."

Both profiles work identically for content generation. The distinction is purely informational and motivational — it gives Path B users a clear reason to upgrade their profile over time without making them feel their current setup is inadequate.

---

## Summary of Changes From Original Section 6.11

| Original | Updated |
|---|---|
| Single onboarding path: document upload only | Two paths: document upload or guided questionnaire |
| Single document upload only | Up to seven documents accepted in a single upload |
| Skip option applied generic voice | No generic voice — both paths produce a real brand profile |
| No conflict resolution | Claude flags conflicting brand information across documents and asks user to clarify |
| No brand builder nudge | Passive Brand System Builder nudge after second generation session |
| Profile page showed extracted brand details | Profile page now shows profile type (Basic or Full) with upgrade prompt for Basic users |
| No way to update brand profile with multiple documents | Settings page allows up to seven document uploads to regenerate brand profile at any time |

---

*ContentEngine Onboarding Addendum — Oladipupo Ishola — May 2026*
*This document supersedes Section 6.11 of ContentEngine PRD v2.0*

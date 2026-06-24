<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:workflow-rules -->
# Strict Workflow Enforcement (Token-Optimized Edition)

Any AI agent operating in this repository MUST follow the procedures defined in `WORKFLOW.md` with strict boundaries between code generation (AI) and task execution (User).

1. **No Cowboy Coding:** Never write code directly from a PRD or phase document.
2. **Planning Phase:** You MUST use the process in `agents/agent-plan.md` to break a phase plan into concrete, ordered atomic tasks BEFORE starting implementation.
3. **Execution Phase (TDD - Target-Isolated):** 
   - Write the failing test file first (Red). 
   - Implement the feature file to pass the test (Green).
   - **DO NOT run global test suites or execute `./hooks/pre-commit` inside the agent environment.** 
   - Explicitly instruct the user to run the specific test file locally (e.g., `npx vitest run path/to/file.test.ts`) and wait for their pass/fail confirmation.
4. **Quality Gate (Phase 4 - AI Assist Only):** 
   - **DO NOT execute `./hooks/phase4` inside the agent environment.** 
   - Perform your single-pass review textually within the prompt history covering: code smells (Clean Code + GoF), senior engineer review, and JSDoc for new functions. 
   - Once the textual review passes, declare the task complete and stop. 
   - **The user will manually handle local linting, local git commits, and the local `./hooks/phase4 --sign-off` on their machine.**
<!-- END:workflow-rules -->

<!-- BEGIN:integration-test-rules -->
# Strict Integration & Routing Rules

1. **Verify Connections, Not Just Units:** If a task implements middleware, layouts, or custom route-gating (e.g., `resolveOnboardingGate`), you MUST write an integration test that asserts the page-level navigation/redirect behavior (e.g., checking that `/dashboard` actually redirects un-onboarded users).
2. **No Dead Ends:** Ensure buttons, links, and forms added in new layouts are actually wired to their respective destination routes.
<!-- END:integration-test-rules -->

<!-- BEGIN:context-curation-rules -->
# Context Curation & Token Optimization

1. **Active State Tracker:** Use the `task.md` file at the root of the project as the single source of truth for the current phase's tasks and progress. Do not scan git history, PR logs, or large markdown plans unless specifically directed.
2. **Curated Reading:** Do not read entire PRD or plan files at the start of a session. Instead, ask the user to specify the segment of code/documentation needed, or read files lazily on a task-by-task basis.
3. **Proactive Compacting:** Remind the user to run the `/compact` command immediately after every successful "Green" task transition to clear out old test logs and maintain maximum reasoning capacity under 128,000 tokens.
<!-- END:context-curation-rules -->

<!-- BEGIN:deterministic-split-rules -->
# Latent vs. Deterministic Space Split

1. **LLM Work (Latent):** Use LLM inference for judgment, content formatting, creativity, and voice-and-tone styling.
2. **Code Work (Deterministic):** If a task involves structured parsing, data conversions, arithmetic, JSON mapping, or API validations where same-input-same-output applies, write a script or a helper function and test it rather than handling it in the generation prompts.
<!-- END:deterministic-split-rules -->

<!-- BEGIN:design-system-rules -->
# Design System
- For all frontend styling, component sizing, colors, and layouts, consult: resources/design/vercel.md
<!-- END:design-system-rules -->

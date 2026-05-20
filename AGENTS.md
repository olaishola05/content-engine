<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:workflow-rules -->
# Strict Workflow Enforcement

Any AI agent operating in this repository MUST follow the procedures defined in `WORKFLOW.md`. 

1. **No Cowboy Coding:** Never write code directly from a PRD or phase document.
2. **Planning Phase:** You MUST use the process in `agents/agent-plan.md` to break a phase plan into concrete, ordered atomic tasks BEFORE starting implementation.
3. **Execution Phase (TDD):** When implementing a task, you MUST follow `agents/agent-tdd.md`. Write failing tests first (Red), implement the feature to pass the test (Green), and run `./hooks/pre-commit` to validate.
<!-- END:workflow-rules -->

<!-- BEGIN:integration-test-rules -->
# Strict Integration & Routing Rules

1. **Verify Connections, Not Just Units:** If a task implements middleware, layouts, or custom route-gating (e.g., `resolveOnboardingGate`), you MUST write an integration test that asserts the page-level navigation/redirect behavior (e.g., checking that `/dashboard` actually redirects un-onboarded users).
2. **No Dead Ends:** Ensure buttons, links, and forms added in new layouts are actually wired to their respective destination routes.
<!-- END:integration-test-rules -->

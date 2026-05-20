## 🎯 Goal & Overview

This PR implements the onboarding experience, a multi-step brand profile questionnaire wizard, robust gating logic, and a clean minimalist design theme for the dashboard and onboarding flows. 

These changes ensure that new users cannot bypass the onboarding steps, their draft progress is saved automatically to the database for cross-device sync, and any missing API key issues are handled gracefully in the UI.

---

## 🛠 Proposed Changes

### 1. Onboarding Path Selection Screen
* Replaced temporary emojis with clean, custom SVG graphics.
* Added interactive micro-visual previews inside the selection cards.
* Structured layouts to transition cards and apply dynamic accent colors (Interactive Pink and Develop Blue).

### 2. Multi-Step Questionnaire Wizard
* Abstracted the questionnaire questions config to clean up the page structure.
* Implemented a paginated client-side wizard to break the questions down.
* Integrated background draft auto-saving with database persistence on step transitions.
* Enforced a minimum answer threshold (at least 3 answered questions) before submission is enabled.

### 3. Onboarding Gating & Layouts
* Integrated routing gates checking if a user has completed their brand profile.
* Ensured incomplete draft profiles remain inside onboarding.
* Added a header with a legible user email display (`text-sm` and `font-medium`) and a Sign-Out action inside the onboarding layout.

### 4. Robust Error Handling & Boundaries
* Wrapped AI generation and extraction actions in clean error boundaries.
* Automatically catches missing API keys (e.g. `ANTHROPIC_API_KEY`) and returns a helpful user-facing error message in the UI instead of crash pages.

---

## 🧪 Verification & Testing

* **Unit Tests:** All unit test suites passed successfully (covering gating, save actions, and processing logic).
* **Build Check:** Full production build typecheck (`next build` and `tsc --noEmit`) succeeded without any linting or compilation boundary violations.

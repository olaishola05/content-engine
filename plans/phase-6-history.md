# Phase 6: Content History and Library

## Goal
Nothing is ever lost. Every piece of text, every blog post, and every visual asset generated is stored and fully searchable.

**Demo at end of phase**: Founder clicks "Library" in the navigation, sees a list of past generations with previews, clicks one from last week, sees all three text variations originally generated, and clicks "Regenerate" to run it again with a different tone.

---

## Acceptance Criteria

- [ ] History listing page (`/dashboard/library`) displaying paginated past generations
- [ ] List items show: Date, Input Type (icon), Input preview (truncated), Platforms generated (badges)
- [ ] Detail page (`/dashboard/library/[id]`) showing the full generation
- [ ] Detail page displays all outputs across all platforms, including the 3 variations per platform
- [ ] Generated visual assets (carousels, impact cards) visible in the detail view
- [ ] User can re-edit any saved text output inline
- [ ] User can click "Regenerate" to rerun the exact same input through the pipeline with updated settings (e.g., new tone, updated brand profile)
- [ ] Global search bar: search by keyword across all saved `input_content` and `generation_outputs`
- [ ] Soft delete functionality: mark a generation as deleted without removing the database row

---

## Architecture Decisions

- **Drizzle queries**: Use relational queries for the history listing to fetch `generations` + their associated `generation_outputs` efficiently.
- **Search**: For V1, use a simple `ilike` SQL query in Drizzle. Do not add Postgres full-text search (tsvector) or an external service like Algolia unless performance dictates it.
- **Regeneration**: When a user clicks regenerate, it does NOT mutate the old record. It creates a completely new `generations` record using the same input.

---

## Key Files to Create

```
app/
  (dashboard)/
    library/
      page.tsx                        ← Paginated list + search
      [id]/page.tsx                   ← Detail view of past generation

actions/
  history/
    list.ts                           ← Fetch paginated history
    get.ts                            ← Fetch single generation + outputs
    search.ts                         ← Keyword search action
    delete.ts                         ← Soft delete action

components/
  library/
    history-list.tsx
    history-card.tsx                  ← Single row/card in the list
    search-bar.tsx
    generation-detail.tsx             ← View all outputs
    regenerate-options.tsx            ← Dialog to change tone before regenerating
```

---

## Dependencies

- Phase 3, 4, and 5 complete (requires the `generations` and `generation_outputs` tables to have real data populated)

---

## Testing Checklist (agent-tdd targets)

- History list action returns only generations belonging to the authenticated user
- Detail view action returns 404 for a generation ID belonging to another user
- Search action returns matching results based on input content or generated output
- Soft delete action sets `deleted_at` timestamp and hides record from list
- Detail view renders all 3 variations, not just the recommended one

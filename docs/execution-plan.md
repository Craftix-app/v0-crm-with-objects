Summary: Below is a refactored 10-step Replit plan with Design Shell first, then docs, then progressively tighter system slices. Each step includes an exact Replit prompt + acceptance criteria.

CraftX — Replit 10-Step Build Plan (Prompts + Checkpoints)
Global Rules (apply to every step)
If a step is UI-only, use Replit Design Mode.
If a step touches data/schema/validation/renderer, do not use Design Mode.
Keep changes strictly within the step scope.
End each step with a runnable state.

CHECKPOINT 0 — Design Shell (UI Skeleton Only)
Goal: Create a stable shell Replit can build on.
Includes
Sidebar + topbar
Placeholder routes/pages: Contacts, Companies, Tasks, Documents, “Registry”, “Generate”
Replit Prompt
Create a Next.js app with a premium-feeling internal tool shell.

Use Design Mode.

Requirements:
- Left sidebar navigation with items:
  Dashboard, Contacts, Companies, Tasks, Documents, Registry, Generate
- Top bar with page title and a right-side placeholder (e.g. profile/avatar button)
- Create routes/pages for each nav item with placeholder PageShell content.
- Consistent spacing, calm empty states, no secondary sidebars.

Rules:
- UI only, no database, no auth, no AI, no CRUD.
- Keep components reusable (PageShell, Panel, EmptyState can be placeholders for now).

Acceptance criteria:
- App runs.
- Navigation works between pages.
- Each page shows a title and placeholder content in the same layout system.

CHECKPOINT 1 — Add MVP Contract Docs (Source of Truth)
Goal: Anchor the build to a written contract.
Replit Prompt
Add documentation files to the repo.

Task:
1) Create /docs/mvp-contract.md and paste in the current MVP contract text exactly as provided.
2) Create /docs/replit-execution-plan.md and paste in the current 10-step plan (this document).
3) Update README.md with a section "MVP Contract" that says:
   "All system behavior must comply with /docs/mvp-contract.md."

Rules:
- Do not change UI.
- Do not modify contract wording.
- No functional code changes.

Acceptance criteria:
- Files exist at correct paths.
- README references /docs/mvp-contract.md.

CHECKPOINT 2 — Lock Design Tokens + Base Primitives
Goal: Create the primitives that everything uses.
Build
PageShell
Section
Stack / Grid
Panel
EmptyState
Button/Input baseline wrappers (if needed)
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: primitives only (no blocks, no CRUD, no DB).

Task:
Implement these reusable primitives and refactor placeholder pages to use them:
- PageShell (title, actions slot, content area)
- Section (header + optional description)
- Stack and Grid helpers (spacing + layout)
- Panel (card container)
- EmptyState (title, description, action slot)

Rules:
- No object-specific code.
- No data model.
- Keep styling consistent with the shell.

Acceptance criteria:
- All pages still render.
- Primitives are used across all placeholder pages.

CHECKPOINT 3 — Build Block Library (Data-Aware UI, Still Mocked)
Goal: The blocks the AI will compose later.
Blocks
QueryBar
DataViewBlock (table + cards)
DetailPanelBlock
StatSummaryRow
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: block components only with mock data (no DB).

Task:
Create reusable blocks:
- QueryBar (search input + filter button + sort button placeholders)
- DataViewBlock supporting:
  - table mode (columns + rows from props)
  - cards mode (cards from props)
- DetailPanelBlock (shows selected record fields from props)
- StatSummaryRow (2–4 stats)

Also: implement /registry page to showcase primitives + blocks with mock data.

Rules:
- No fetching, no DB.
- Blocks accept config via props.
- No AI.

Acceptance criteria:
- /registry renders all blocks.
- Blocks are visually consistent and reusable.

CHECKPOINT 4 — Define MVP Objects + Relationships (Schema Only)
Goal: Define the enabled object schemas without building full CRUD yet.
Enabled
Contacts
Companies
Tasks
Documents
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: data definitions only.

Task:
Define minimal schemas/types for:
- Contact
- Company
- Task
- Document

Define allowed relationships:
- Task may relate to Contact or Company
- Document may relate to Contact or Company
(Keep relationships minimal in v1.)

Rules:
- Do not build UI CRUD flows yet.
- Do not add AI or generation logic.

Acceptance criteria:
- Schemas exist in a clear location (e.g. /lib/schema or /src/schema).
- Relationships are explicitly represented in the types.

CHECKPOINT 5 — Implement Persistence (DB + Basic Data Access Layer)
Goal: Real storage + a simple DAL, without full UI flows.
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: persistence + data access layer only.

Task:
1) Implement persistence for Contacts, Companies, Tasks, Documents.
2) Create a minimal data access layer (DAL) with functions like:
   createX, updateX, listX, getX
3) Seed a small amount of sample data for each object type.

Rules:
- Do not build full UI CRUD yet.
- No AI.
- Keep the DAL consistent across objects.

Acceptance criteria:
- You can run the app and verify the seed exists (via simple dev-only logging or a basic debug read on pages).

CHECKPOINT 6 — CRUD UI: List + Create (No Edit Yet)
Goal: Make it usable fast with minimal flows.
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: UI CRUD for list + create only.

Task:
For each enabled object (Contacts, Companies, Tasks, Documents):
- Implement list view on its page using DataViewBlock (table mode).
- Add a simple "New" action that opens a modal or inline form to create a record.

Rules:
- No edit/delete yet.
- Use the primitives and blocks from /registry.
- Keep forms minimal.

Acceptance criteria:
- User can create and see new records in the list for all 4 objects.

CHECKPOINT 7 — CRUD UI: Detail + Edit (Minimal)
Goal: Add detail pages and minimal edit.
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: detail + edit.

Task:
- Add a detail view for each object (either separate route or right-side DetailPanel).
- Allow editing key fields and saving changes.
- Add ability to associate:
  - Task -> Company or Contact
  - Document -> Company or Contact

Rules:
- No complex relationships.
- No AI.

Acceptance criteria:
- Each object has a detail view.
- Edits persist.
- Associations persist and display.

CHECKPOINT 8 — Page Schema + Renderer (No AI)
Goal: Deterministic generation from JSON config.
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: schema + renderer only (no AI).

Task:
1) Define a strict JSON schema for a "Generated Page":
   - template
   - blocks
   - datasource
   - fields
   - filters/sort/group
2) Implement a renderer that reads a local JSON config file and renders it using your blocks.
3) Add validation: invalid config fails safely.

Rules:
- Renderer must only use approved blocks.
- No natural-language parsing.

Acceptance criteria:
- /generate can load a sample JSON config and render a page.
- Invalid config does not crash the app.

CHECKPOINT 9 — AI Generation v1 (Prompt → JSON → Validate → Render)
Goal: Add AI last, safely.
Replit Prompt
Follow /docs/mvp-contract.md exactly.

Scope: AI generation only.

Task:
1) Add a prompt input on /generate.
2) AI must output JSON config only, matching the schema.
3) Validate output; if invalid, regenerate once; if still invalid, refuse with explanation.
4) Render the validated config.

Rules:
- AI cannot invent objects, relationships, templates, or blocks.
- Only enabled objects (Contacts, Companies, Tasks, Documents).
- Only approved templates and blocks.

Acceptance criteria:
- At least 3 different prompts generate valid pages.
- Unsupported requests are refused safely.

How to “Check In” Each Step (do this every time)
After each checkpoint, you verify:
App runs
No console errors
The step’s acceptance criteria are met
No extra “bonus” features slipped in

If you want, I can also produce:
A single “master prompt header” you prepend to every prompt (to reduce drift)
A default JSON example for Checkpoint 8 so the renderer is immediately testable

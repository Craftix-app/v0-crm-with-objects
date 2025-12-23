Summary: Below is a clean, rewritten MVP document that incorporates all the new context, resolves the CRM vs builder tension, and gives you a stable foundation you can actually build against without restarting.
This is written as a product + system contract, not a brainstorm.

CraftX MVP — Product Definition & Build Contract (v1)
1. Product Definition (Locked)
CraftX is a structured data workspace with opinionated presets and safe AI composition.
Users define and store structured data once, then generate useful internal pages and workflows using AI—starting from trusted presets (like CRM), not blank canvases.
CraftX is not:
a general-purpose app builder
a coding environment
a Notion/Replit replacement
CraftX is:
structured
opinionated
extensible through controlled abstraction

2. System Architecture (Three-Layer Model)
Layer 1 — Object Types (System Foundation)
Object Types are conceptual primitives.
They define what kinds of data exist in the system.
All Object Types are defined up front, but only a subset are enabled in MVP.
Object Type Taxonomy (Defined)
Entities
Persistent nouns (people, places, things)
Occurrences
Repeatable records related to entities
Events
Time-specific, single-instance occurrences
Activities
Logged actions taken by users or systems
Tasks
To-do items with lifecycle and hierarchy
Documents
Authored written content
Files
Binary assets from uploads or integrations
Metrics
Quantitative measurements (time-series friendly)
Relationships
Explicit links between objects (ownership, association, parent/child)
Important:
Object Types are not features.
They are the vocabulary the AI and system are allowed to use.

Layer 2 — Presets (User-Facing Starting Points)
Presets are opinionated bundles of:
enabled object types
predefined objects
default pages/views
default AI prompts
Presets make the system immediately useful without AI.
MVP Preset: CRM
Enabled Objects
Contacts (Entity)
Companies (Entity)
Tasks (Task)
Documents (Document)
Defined but Disabled
Deals, Events, Activities, Files, Metrics (exist conceptually, not exposed)
Default Pages
Contacts list + detail
Companies list + detail
My Tasks
Documents
Value without AI
Clean CRM-style storage
Structured relationships
Immediate utility

Layer 3 — Generation & Customization (AI-Assisted)
AI is a composer, not a designer.
The AI:
selects from predefined templates
places approved blocks
fills validated configuration schemas
The AI cannot:
invent object types
invent components or layouts
create arbitrary logic or joins
Customization expands gradually:
rename objects
add new objects using existing object types
generate new pages/views
unlock additional presets later

3. AI Guardrails (Non-Negotiable)
AI Output Rules
AI outputs validated JSON, not UI code
JSON describes:
page template
blocks
data sources
filters / sorts / groupings
Renderer turns schema into UI
Invalid schema → regenerate or refuse
AI Scope in MVP
AI can:
generate pages/views
configure filters and layouts
summarize what was generated
AI cannot:
generate “apps”
define new data models
perform arbitrary calculations
bypass enabled object rules

4. Page Generation Model (MVP)
Allowed Page Templates
List Page
Detail Page
Simple Dashboard
Allowed Blocks
Query Bar
Data View (table/cards)
Detail Panel
Stat Summary
Empty State
Every generated page must be:
Template + Blocks + Data Config

5. MVP Build Stages (Figma + AI Tools)
Stage 0 — Contract Lock
Goal: Eliminate ambiguity
Finalize object types
Finalize enabled MVP objects
Define AI refusal rules
Design:
“Generate Page” modal
Page shell layout (Figma)

Stage 1 — Library & Renderer
Goal: Deterministic UI composition
Build layout primitives
Build block components
Implement JSON → UI renderer
Add schema validation

Stage 2 — Data Model
Goal: Reliable structured storage
Implement Entities, Tasks, Documents
Define allowed relationships
Ensure manual UI can do everything AI can

Stage 3 — CRM Preset
Goal: Immediate value without AI
Ship Contacts, Companies, Tasks, Documents
Ship default views
Confirm system is useful standalone

Stage 4 — AI Generation v1
Goal: Safe AI-assisted page creation
Intent classification
Template selection
Config generation
Guardrail enforcement
User-facing explanation of results

6. Tooling Decision (Locked)
Primary Build Tool: Replit
Owns runtime, schema, renderer, persistence
Required for correctness and iteration
Supporting Tool: V0
Used for generating UI scaffolds only
Never the source of truth
No system logic built in V0
Rule:
If it affects data, validation, or AI behavior → Replit only.

7. What Success Looks Like for MVP
The MVP is successful if:
Users can use CraftX as a clean CRM without AI
AI can generate useful internal pages without breaking structure
The system can expand beyond CRM without rewriting core logic
You can explain the product in under 60 seconds

8. Final Product Promise (Internal)
“CraftX lets you define structured data once, then safely generate useful internal pages and workflows—starting from opinionated presets like CRM.”
If a feature doesn’t reinforce that promise, it’s out.

If you want next, I recommend we lock one of these immediately:
Exact MVP object schemas (fields + relationships)
The JSON schema for AI page generation
The CRM preset spec (views + default prompts)
Pick one and we move forward—no more restarts.

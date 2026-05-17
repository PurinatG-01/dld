<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-conventions -->

# UI conventions — read before touching any component

## Component library: shadcn (radix-vega style)

shadcn is the **primary UI library**. Always prefer it over raw HTML elements or custom components.

- Components live in `components/ui/` — check there before building from scratch
- To add a new component: `npx shadcn@latest add @shadcn/<name>`
- Icon library is **lucide-react** (bundled with shadcn)

## Theming

All colours and radius values come from CSS variables defined in `app/globals.css`.

- **Edit `:root`** to retheme shadcn components globally (e.g. `--primary` is DLD indigo-600)
- **`@theme inline`** bridges those CSS vars to Tailwind utility classes (`bg-primary`, `text-muted-foreground`, etc.)
- Do **not** use hardcoded Tailwind colour classes like `bg-indigo-600`, `text-slate-400`, or `border-rose-100` in new code — use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-destructive/20`)

## Edge functions

Edge functions live in a **separate repo** (`dld-edge-functions/`), not in this repo. The `supabase/` directory is gitignored here. Do not create or commit Supabase edge function files in this repo.

<!-- END:ui-conventions -->

<!-- BEGIN:session-bootstrap -->

# Session bootstrap — do this before writing any code

## 1. Load project context from Notion

Search Notion for **"Dental Logistics"** and open the **⚙️ Tech** sub-page (id `NOTION_TECH_PAGE_ID_REDACTED`).
From there, also read:

- **🏗️ Architecture** (`NOTION_ARCH_PAGE_ID_REDACTED`) — schema, data flow, movement types
- **Migration 001 — Initial Schema** (`NOTION_MIGRATION_001_PAGE_ID_REDACTED`) — canonical table definitions

## 2. Verify backend / database via Supabase MCP

Project ref: **`SUPABASE_PROJECT_REF_REDACTED`** · region `ap-south-1` · project name `dld`

<!-- END:session-bootstrap -->

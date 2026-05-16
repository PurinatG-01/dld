<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

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

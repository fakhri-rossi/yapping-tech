<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- ARCHITECTURE GUARD REFERENCE -->
## Architecture & Folder Guards

ALWAYS adhere to the rules defined in `GUARD.md`:
1. NEVER create loose files directly inside `components/`. Place them into appropriate subfolders: `ui/`, `landing/`, `templates/`, `experiences/`, `cms/`, `komose/`, or `plivin/`.
2. NEVER use `@/` path aliases. Strictly use:
   - `@components/*`
   - `@config/*`
   - `@lib/*`
   - `@context/*`
   - `@type/*` (never `@types/*`)
   - `@app/*`
3. Always verify changes with `npx tsc --noEmit`.

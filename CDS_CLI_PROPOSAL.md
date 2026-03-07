# CDS CLI Proposal (Shadcn-Inspired)

## Purpose

This document proposes a `cds` CLI inspired by shadcn's workflow, focused first on search and discovery across icons, illustrations, and components, then expanding into install and migration workflows.

It is intentionally designed to coexist with MCP:

- MCP is excellent for AI-assisted, contextual workflows inside editors.
- CLI is excellent for direct human usage, scripting, CI, and predictable automation.
- The best long-term model is one shared core engine exposed through both CLI and MCP.

---

## What Shadcn CLI Does Today

Shadcn provides a command-oriented developer workflow with a few simple verbs:

- `init` (alias: `create`) to bootstrap config/dependencies.
- `add` to install one or more components.
- `view` to inspect an item before adding.
- `search` (alias: `list`) to discover registry items.
- `build` to generate registry JSON.
- `docs` to fetch docs/API references.
- `info` to inspect project setup.
- `migrate` for codemods and structured upgrades (`icons`, `radix`, `rtl`).

Key ideas worth copying:

- Small set of memorable verbs.
- Built-in inspection before installation (`view`, `search`).
- Automation-friendly flags (`--json`, `--dry-run`, `--yes`, `--cwd`).
- Migration commands as first-class operations.
- One tool for both local and registry-backed workflows.

Reference:

- [Shadcn skills repository](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn)
- [Shadcn CLI docs](https://ui.shadcn.com/docs/cli)

---

## Existing CDS Foundations We Can Reuse

CDS already has most of the raw data needed for strong search:

- Icon keyword mapping: `packages/icons/src/descriptionMap.ts`
- Icon metadata source: `packages/icons/manifest.json`
- Illustration keyword mappings:
  - `packages/illustrations/src/__generated__/heroSquare/data/descriptionMap.ts`
  - `packages/illustrations/src/__generated__/spotSquare/data/descriptionMap.ts`
  - `packages/illustrations/src/__generated__/spotRectangle/data/descriptionMap.ts`
  - `packages/illustrations/src/__generated__/spotIcon/data/descriptionMap.ts`
  - `packages/illustrations/src/__generated__/pictogram/data/descriptionMap.ts`
- Illustration metadata source: `packages/illustrations/manifest.json`
- Existing docs behavior already combines:
  - name substring matching
  - description keyword matching
- Component metadata that can seed component search:
  - `apps/docs/docs/components/**/webMetadata.json`
  - `apps/docs/docs/components/**/mobileMetadata.json`
  - `apps/docs/sidebars.ts` for canonical labels/categories/doc routes

This means we can ship search quickly without inventing new data pipelines first.

### Is component search from docs possible?

Yes. We can index components from docs metadata and sidebar structure in v1:

- Component name/label from `apps/docs/sidebars.ts`
- Description/import/source links from `webMetadata.json` and `mobileMetadata.json`
- Route/category/platform tags from sidebar + metadata path

This is enough for a high-quality first-pass component search, even before deeper source-code introspection.

---

## Should CDS Build CLI If We Already Have MCP?

Yes, but as a shared-core architecture.

### Why CLI still matters

- Works for all developers (not only AI-assisted sessions).
- Easy CI and shell scripting integration.
- Stable textual/JSON output for automation.
- Discoverability via `--help`.
- Lower friction for quick lookup tasks (for example: finding an illustration by concept).

### Why MCP still matters

- Rich contextual workflows for AI agents.
- Better for multi-step editor-aware tasks.
- Can return structured data directly into coding sessions.

### Recommended architecture

- Build a shared search core (for ranking, normalization, indexing).
- Expose that core through:
  - `cds` CLI (human + CI interface)
  - MCP server tools (agent interface)

---

## Proposed CDS CLI Command Surface

Start with search-first discovery. Add install/migrate later.

### Phase-1 command set (high confidence)

- `cds search <resource> <query>`
  - Search by resource type: `icon`, `illustration`, `component`, or `all`.
  - Returns concise results by default; `--details` expands metadata in-line.
  - Supports JSON output for scripts.
- `cds search-icon <query>` / `cds search-illustration <query>` / `cds search-component <query>`
  - Convenience aliases for the resource-scoped search command.
- `cds info`
  - Show CLI version, index version/timestamp, workspace status.

### Phase-2 command set (adoption + maintenance)

- `cds add <component-or-pattern>`
  - Add/install CDS components, snippets, or wrappers.
- `cds docs <component-or-asset>`
  - Open or print docs references.
- `cds migrate <migration>`
  - Structured upgrades/codemods (imports, naming, API changes).
- `cds build-index`
  - Build or refresh local search index artifacts.

### Example UX

```bash
# Discover assets
cds search icon "payments card"
cds search illustration "wallet send" --family heroSquare
cds search component "tray overlay"
cds search all "security shield button"

# Alias shortcuts
cds search-icon "shield"
cds search-illustration "yield chart"
cds search-component "text input"

# Automation
cds search component "text input" --json --details --limit 10
```

---

## Search Design for Icons, Illustrations, and Components

## Data model

Each searchable record should include:

- `id` (asset/component identifier)
- `kind` (`icon` | `illustration` | `component`)
- `family` (for illustrations: `heroSquare`, `spotSquare`, `spotRectangle`, `spotIcon`, `pictogram`)
- `category` (for components, ex: `inputs`, `overlay`, `charts`)
- `platform` (`web`, `mobile`, `both`, when available)
- `route` (docs route for component results)
- `tokens` (normalized description keywords)
- `aliases` (optional curated synonyms)
- `metadata` (size variants, import snippets, source links, etc., where relevant)

## Matching strategy (recommended)

Use a hybrid ranker:

1. Exact name match (highest score)
2. Prefix name match
3. Substring name match
4. Exact token match from description maps
5. Fuse.js score across name + tokens + description fields
6. Multi-token intersection score and stable tie-breakers

## Normalization

- lowercase
- trim
- split by whitespace, punctuation, emoji separators, and commas
- dedupe tokens
- optional light stemming only if needed later

---

## Fuse.js Plan (V1)

Short answer: yes, include it in v1.

### Recommendation

- V1 uses a hybrid approach by default: deterministic exact/prefix/token scoring + Fuse.js ranking.
- Add `--no-fuzzy` to force deterministic-only results when needed for debugging or strict scripts.

### Why this balance works

- Deterministic matching is easier to reason about and test.
- Fuzzy matching helps with typos and imperfect wording.
- Combining both in v1 improves relevance without waiting for later milestones.

### Suggested Fuse config (starting point)

- Weighted keys:
  - `id` / component `label` (high)
  - `tokens` (medium)
  - `description` (medium)
  - `aliases` (medium)
  - `category` (low)
- `threshold` around `0.25` to `0.35`
- `ignoreLocation: true`
- `minMatchCharLength: 2`

---

## Roadmap

## Milestone 0: Discovery and spec (1 week)

- Finalize command names and flags.
- Define search result schema (human and JSON output).
- Decide package location (for example `packages/cds-cli` + shared `packages/asset-search`).
- Document ownership and release process.

## Milestone 1: Search MVP (1-2 weeks)

- Implement:
  - `cds search <resource> <query>` (resources: `icon`, `illustration`, `component`, `all`)
  - `cds search-icon`, `cds search-illustration`, and `cds search-component` aliases
  - `cds info`
- Read icon/illustration data from existing generated maps/manifests.
- Read component data from docs metadata + sidebar routes.
- Enable Fuse.js hybrid ranking in v1.
- Add output modes: table and `--json` with optional `--details`.
- Add tests for ranking and normalization.

Success criteria:

- Developers can find relevant icon/illustration/component in under 10 seconds.
- Search output is stable enough for CI scripts.

## Milestone 2: Fuzzy + quality improvements (1 week)

- Tune Fuse.js weights/thresholds using real query samples.
- Add `--family`, `--platform`, `--limit`, `--exact`, `--no-fuzzy`.
- Add "why this matched" explanation in verbose mode.
- Add benchmark tests to prevent performance regressions.
- Add curated component aliases and deprecation-aware ranking boosts.

## Milestone 3: MCP parity (1 week)

- Expose search core via MCP tools:
  - `search-resources`
  - `get-resource` (optional convenience wrapper for a single id)
- Keep CLI and MCP outputs structurally aligned.
- Ensure a shared ranking engine is used by both.

## Milestone 4: Add/install workflows (2-4 weeks)

- Add `cds add` for component and usage scaffolding.
- Optionally add codemod-backed `cds migrate` commands.
- Add `cds docs` shortcuts to canonical CDS docs pages.

---

## Suggested Initial Flags

- Positional `<resource>` values (phase 1): `icon`, `illustration`, `component`, `all`
- `--family <heroSquare|spotSquare|spotRectangle|spotIcon|pictogram>`
- `--platform <web|mobile|both>`
- `--limit <n>`
- `--json`
- `--details`
- `--exact`
- `--no-fuzzy`
- `--verbose`
- `--cwd <path>`

---

## Risks and Mitigations

- Risk: rankings feel "off" to users.
  - Mitigation: deterministic baseline first, then iterative fuzzy tuning.
- Risk: index staleness.
  - Mitigation: include index timestamp in `cds info`; add `cds build-index`/refresh hooks.
- Risk: duplicated logic across MCP and CLI.
  - Mitigation: shared core library, thin adapters.
- Risk: command sprawl.
  - Mitigation: keep phase-1 surface minimal (`search`, aliases, `info`).

---

## Open Questions

- Naming: `cds` vs `cds-ui` vs `@coinbase/cds-cli` binary alias.
- Distribution: internal-only first, or public package from day one.
- Should `search component` index only docs metadata in v1, or also include source-level symbol extraction.
- Should fuzzy be on by default after confidence improves.
- Should `cds search` support interactive TUI mode in phase 2.

---

## Bottom Line

A CDS CLI is worth building even with MCP already in place, especially for search and scripting. The fastest path is to ship a focused search MVP on top of existing icon/illustration metadata plus docs-derived component metadata, with Fuse.js hybrid ranking in v1, then expand to MCP parity and install/migrate workflows.

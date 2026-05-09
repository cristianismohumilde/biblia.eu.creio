# Collaboration Guide

[Leia em português](CONTRIBUTING.pt-BR.md)

Thanks for contributing to this open source project.

This repository prioritizes static publishing stability, cross-language consistency, and interlinear data quality. The main goal of this guide is to prevent seemingly small changes from breaking the production site.

## Principles

- Preserve production site stability.
- Do not break public routes or files required by static deploy.
- Keep PT and EN behavior aligned when changing UI.
- Handle biblical data with rigor and source traceability.
- **Data Sources:** When adding new manuscript data (e.g., Greek LXX, Hebrew, Aramaic), use only open academic sources (like CATSS, OpenScriptures) and document the provenance in `SOURCES-LICENSES.md`.

## Recommended workflow

1. Create a branch from main.
2. Keep changes small and focused.
3. Validate locally with the required checklist.
4. Open a Pull Request with clear scope and validation evidence.

## Required checklist before opening a Pull Request

### 1) Site must not break

- Start a local static server at repository root.
- Validate loading for:
  - /
  - /pt/
  - /en/
- Confirm core pages load without blank screens.

Suggested local server:

- python -m http.server 8080

### 2) Navigation and Bible reference flow

- Test Book, Chapter, and Verse selection in PT and EN.
- Confirm content updates correctly when switching references.
- Verify quick-nav links point to the correct sections.

### 3) Visual regression (desktop and mobile)

- Test desktop (for example, 1366px or larger).
- Test mobile (around 360px width).
- Verify especially:
  - Select reference block
  - Literal verse translation block
  - Literal translations by original language
  - Word-by-word by language section

### 4) Console and network

- Open browser DevTools.
- Ensure no Console errors.
- Ensure no 404s for JSON, CSS, and JS in Network.

### 5) JSON data

- If you changed files in data/, validate JSON syntax for each modified file.
- Do not change schema without documenting it in the PR.
- Keep stable IDs for book/chapter/verse/token whenever possible.

JSON validation example (Python):

- python -m json.tool data/verses/gen.1.1.json > nul

Repeat for each changed JSON file.

### 6) Multilingual consistency

- UI change in PT must be checked in EN (and vice versa).
- Labels, anchors, and behavior should remain equivalent.

### 7) Licenses and sources

- Do not add textual content without license verification.
- Check LICENSE-DATA and SOURCES-LICENSES.md before adding new sources.

## How to write a good Pull Request

Include in PR description:

- Objective summary of what changed
- Why this change is needed
- Main files touched
- Manual validation steps executed
- Known risks and mitigation
- Required checklist status

Suggested PR template fields:

- Summary:
- Motivation:
- Changed files:
- Validation steps executed:
- Evidence (screenshots/log snippets):
- Risks and rollback:

## Quality rules for frontend changes

- Avoid global style changes unless necessary.
- Prefer small, incremental CSS/JS updates.
- Do not remove IDs/elements used by scripts without impact analysis.
- Check basic accessibility (labels, focus, readable contrast).

## Quality rules for biblical data changes

- Keep literal coherence between source text and translations.
- Avoid paraphrastic wording in literal fields.
- If textual uncertainty exists, explain it in the PR and propose alternatives.

## When NOT to open a PR yet

Delay the PR if any of these still apply:

- unresolved console error
- broken route or invalid anchor link
- invalid JSON
- mobile layout breakage
- inconsistent PT/EN text or behavior

## Questions

If architectural impact is unclear, open a short issue first with:

- problem
- proposal
- risks
- affected files

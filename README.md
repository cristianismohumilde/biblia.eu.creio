# Biblia.Creio.EU

[Leia em portugues](README.pt-BR.md)

[![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-149ECA)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

An open source interlinear Bible platform built with a static-first architecture.
The project combines manuscript fidelity, token-level linguistic analysis, and fast global delivery via GitHub Pages.

## Why This Project

- Preserve access to ancient textual witnesses in a clean modern UI.
- Provide verse-level and token-level literal translation.
- Enable language comparison across major traditions.
- Keep infrastructure lightweight while scaling by roadmap.

## Core Capabilities

- Interlinear reading by token (surface, transliteration, lemma, morphology, lexical references).
- Manuscript/witness comparison per verse.
- Book -> chapter -> verse navigation with dynamic routes.
- Real-time filtering for interlinear token tables.
- Bilingual product surface (PT/EN).
- Static export optimized for low-cost hosting.

## Technology

| Layer | Stack |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) App Router |
| UI | Vanilla CSS + custom design system |
| Runtime | React 19 |
| Delivery | GitHub Pages static hosting |
| Data | Pre-generated JSON in public/data |

## Architecture Roadmap

### Phase 1 (current)
Static export with pre-generated JSON datasets.

- Build-time page generation.
- Dynamic route templates for interlinear pages.
- Browser-language redirect from / to /pt or /en.
- Data served from static files in public/data.

### Phase 2
Lightweight API/search layer without breaking static URL contracts.

### Phase 3
Full backend on VPS for advanced search, processing jobs, and user accounts.

## Project Layout

```text
src/app/                # App Router pages and layouts
public/data/            # books, chapters, verses datasets
public/assets/          # static CSS/JS and media assets
next.config.mjs         # static export configuration
```

## Quick Start

Requirements:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build static output:

```bash
npm run build
```

Local URL: http://localhost:3000

## Data Model (high level)

```text
public/data/books.json
public/data/books/{book}/chapters/{chapter}.json
public/data/verses/{book}.{chapter}.{verse}.json
```

Each verse JSON can include:

- canonical reference
- source texts by language
- witness metadata
- literal translations
- token array with lexical/morphological fields

## Deployment

- CI builds with GitHub Actions.
- npm run build generates the static out directory.
- out is published to gh-pages.
- Expected public URL: https://cristianismohumilde.github.io/biblia.eu.creio/

## Contributing

Before opening PRs, read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

## License

Code and textual data have different licensing constraints.

- Code license: [LICENSE](LICENSE)
- Data policy: [LICENSE-DATA](LICENSE-DATA)
- Source licensing status: [SOURCES-LICENSES.md](SOURCES-LICENSES.md)

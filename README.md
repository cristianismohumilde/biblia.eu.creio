# Biblia.Creio.EU

[Leia em português](README.pt-BR.md)

![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)

Open source interlinear Bible study project focused on static publishing first (GitHub Pages), utilizing Next.js for high-performance static generation and dynamic routing.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Vanilla CSS (custom premium design system)
- **Hosting:** GitHub Pages (via Static Export)
- **Data:** Structured JSON files

## Contributing

To keep the project stable and avoid production regressions, please follow the collaboration guide:

- see [CONTRIBUTING.md](CONTRIBUTING.md)
- Portuguese version: [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

## Initial Goal (MVP)

Deliver a website with:

- ancient manuscript texts (Greek, Hebrew, Aramaic, and Latin)
- verse-level literal translation
- word-by-word literal translation
- lexical/morphological explanation per token
- comparison across key witnesses: Hebrew, Aramaic, Greek, Latin, Ge'ez, Syriac, Coptic, and Armenian

## Phased Architecture

### Phase 1 (Current): Next.js Static Export + Pre-generated JSON

Target platform:

- GitHub Pages (Static Hosting)

Decisions:

- **Static Generation:** Pages are generated at build time using Next.js.
- **Dynamic Routing:** A single template handles all interlinear views based on URL parameters.
- **Client-side Redirect:** Root (/) detects browser language and redirects to `/pt/` or `/en/`.
- **Data:** Data is generated offline and served as static JSON files from the `public/data/` directory.

Technical scope:

- Modern interlinear UI per verse.
- Book > chapter > verse dynamic navigation.
- Real-time filtering in interlinear tables.
- Multilingual support (PT/EN) from the same codebase.

### Phase 2: Lightweight Backend or External Service

Goal:

- add basic API/search without breaking the Phase 1 public structure.

### Phase 3: VPS + Full Backend

Goal:

- scale to advanced search, processing jobs, and user accounts.

## Project Structure

- `src/app/`: Next.js App Router (pages and layouts).
- `public/data/`: Structured JSON data for books, chapters, and verses.
- `public/assets/`: Static assets (CSS, JS, images).
- `next.config.mjs`: Configured for `output: 'export'`.

## Run Locally

Ensure you have Node.js installed.

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000.

## Publishing

### GitHub Pages

- The project uses GitHub Actions to build and deploy.
- The build process runs `npm run build`, generating a static `out/` folder.
- The `out/` folder is automatically published to the `gh-pages` branch.
- Expected site URL: https://cristianismohumilde.github.io/biblia.eu.creio/

## Recommended Data Structure

- public/data/books.json
- public/data/books/{book}/chapters/{chapter}.json
- public/data/verses/{book}.{chapter}.{verse}.json

## Licensing Note

This project is open source. Code uses MIT license, but textual datasets must follow each source license.

- code license: see [LICENSE](LICENSE)
- data licensing policy: see [LICENSE-DATA](LICENSE-DATA)
- source licensing/risk status: see [SOURCES-LICENSES.md](SOURCES-LICENSES.md)

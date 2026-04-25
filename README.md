# Biblia.Creio.EU

[Leia em português](README.pt-BR.md)

[![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-149ECA)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

High-level open source interlinear Bible study project, utilizing Next.js for high-performance static generation and dynamic routing. The focus is to provide a free academic and spiritual tool for deep analysis of original manuscripts.

## Project Objectives

Biblia.Creio.EU provides a complete interlinear study experience:

- **Ancient Manuscript Texts:** Hebrew, Aramaic, Greek, Latin, Ge'ez, Syriac, Coptic, and Armenian.
- **Curation-based Literal Translation:** Verse-level and word-by-word literal translations developed by the team.
- **Academic Toolset:** Lexical explanations, morphology, and Strong's numbers per token.
- **Multi-traditional Comparison:** Simultaneous analysis across key linguistic witnesses of biblical history.

## Legal Compliance & Transparency

This project is built on the pillar of **Open Data**. To ensure the legal safety of all contributors and users:

- **Public Domain:** All linguistic databases (lemmas, Strong, morphology, and base dictionaries) use exclusively public domain works (e.g., Jastrow, Dillmann, LSJ, L&S).
- **Fair Use:** Any specific references to modern lexicons are restricted to academic and comparative contexts, supported by the right of citation and fair use, without redistribution of protected databases.
- **Original Production:** Literal translations and data organization are the property of the Biblia.Creio.EU team and are openly licensed.

For full details and a list of works, see [SOURCES-LICENSES.md](SOURCES-LICENSES.md).

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

## Architecture

### Static Export + JSON
Pages are generated at build time using Next.js, ensuring maximum speed and optimized SEO. Dynamic routing allows for instant navigation between books, chapters, and verses.

### Data Structure
Data is served as static files from `public/data/`, allowing the project to be hosted on any static file server without the need for an active database.

## Project Structure

- `src/app/`: Next.js App Router (view logic).
- `public/data/`: Structured JSON database.
- `public/assets/`: Static assets and global styles.
- `next.config.mjs`: Static export configuration.

## Run Locally

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build static output: `npm run build`
4. Open `http://localhost:3000`

## Deployment

- CI builds with GitHub Actions.
- `npm run build` generates the static `out` directory.
- `out` is published to `gh-pages`.
- Expected public URL: https://cristianismohumilde.github.io/biblia.eu.creio/

## Contributing

Before opening PRs, read:
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

## Licensing

- **Code:** MIT License (see [LICENSE](LICENSE)).
- **Data:** Free use policy for study and redistribution (see [LICENSE-DATA](LICENSE-DATA) and [SOURCES-LICENSES.md](SOURCES-LICENSES.md)).

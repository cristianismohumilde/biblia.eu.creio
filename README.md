# Biblia.Creio.EU

[Leia em português](README.pt-BR.md)

![Deploy static site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)

Open source interlinear Bible study project focused on static publishing first (GitHub Pages and shared hosting), prepared to evolve into backend phases without rework.

## Contributing

To keep the project stable and avoid production regressions, please follow the collaboration guide:

- see [CONTRIBUTING.md](CONTRIBUTING.md)
- Portuguese version: [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

Before opening a Pull Request, complete the required validation checklist (desktop, mobile, language routes, data, links, console/network).

## Initial Goal (MVP)

Deliver a website with:

- ancient manuscript texts (Greek, Hebrew, Aramaic, and Latin)
- verse-level literal translation
- word-by-word literal translation
- lexical/morphological explanation per token
- comparison across key witnesses: Hebrew, Aramaic, Greek, Latin, Ge'ez, Syriac, Coptic, and Armenian

## Phased Architecture

### Phase 1 (Current): Static Frontend + Pre-generated JSON

Target platform:

- GitHub Pages
- shared hosting without persistent Node runtime

Decisions:

- no runtime backend
- data generated offline and published as JSON files
- static pages by book/chapter/verse

Technical scope:

- interlinear UI per verse
- book > chapter > verse navigation
- chunked JSON loading
- simple local search (optional at first)

Success criteria:

- static build successfully published
- fast page loading on desktop/mobile
- data structure ready for future evolution

### Phase 2: Lightweight Backend or External Service

Goal:

- add basic API/search without breaking the Phase 1 public structure

Technical scope:

- read API for verses/interlinear data
- basic search by word/lemma/Strong
- simple caching for frequent queries

Success criteria:

- keep Phase 1 URLs/public structure intact
- reduce client payload for wide queries

### Phase 3: VPS + Full Backend

Goal:

- scale to advanced search, processing jobs, and user accounts

Technical scope:

- automated ingest/reprocessing pipeline
- robust cache
- advanced search (concordance, relevance, filters)
- auth and user features (notes, favorites, history)

Success criteria:

- observability (logs, metrics, alerts)
- stable performance under high traffic

## No-Rework Migration Checklist

### Data and contracts

- define a versioned JSON schema (for example: schemaVersion)
- keep stable IDs for book/chapter/verse/token
- separate textual content from lexical/morphological metadata
- document source licenses in dedicated files

### Frontend

- isolate data access through a single adapter layer
- avoid coupling components directly to raw JSON shape
- preserve canonical URLs for SEO in all phases

### Search

- start with a simple local index (Phase 1)
- evolve to a search endpoint with the same frontend interface
- guarantee graceful fallback when advanced search is unavailable

### Operations

- automate data generation (reproducible scripts)
- validate JSON consistency in CI
- publish data/schema changelog

## Recommended Data Structure (Phase 1)

Suggested organization:

- data/books.json
- data/books/{book}/chapters/{chapter}.json
- data/verses/{book}.{chapter}.{verse}.json
- data/lexicon/{language}/{id}.json

Interlinear verse sample:

```json
{
  "schemaVersion": "1.0.0",
  "ref": {
    "book": "gen",
    "chapter": 1,
    "verse": 1
  },
  "sourceTexts": {
    "hebrew": "...",
    "greek": "...",
    "aramaic": null,
    "latin": "..."
  },
  "ptLiteralVerse": "No princípio...",
  "tokens": [
    {
      "id": "gen.1.1.t1",
      "lang": "hebrew",
      "surface": "...",
      "transliteration": "...",
      "lemma": "...",
      "strong": "H7225",
      "morph": "...",
      "ptLiteralWord": "princípio",
      "explanation": "Substantivo..."
    }
  ]
}
```

## Continuity Rules (Developers and AI Agents)

- do not change data contracts without updating schemaVersion
- never break already indexed public URLs
- prioritize frontend backward compatibility
- record architectural decisions in README before major changes

## Current Status

- architectural planning documented
- static frontend implemented (HTML/CSS/JS)
- first functional interlinear page with sample JSON (Genesis 1:1)
- English version available in en/
- Portuguese version available in pt/
- root (/) uses language redirect with fallback
- Genesis available up to chapter 5 with multilingual interlinear structure
- currently curated demo verses: gen.1.1, gen.2.1, gen.3.1, gen.4.1, gen.5.1
- explanatory language pages:
  - pt/idiomas-biblicos.html
  - en/biblical-languages.html

## Run Locally

Since the project is static, serve it with any simple HTTP server.

Python example:

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Publishing

### GitHub Pages

- publish repository root as static site
- ensure index.html, assets/, and data/ are versioned
- automatic workflow included at .github/workflows/deploy-pages.yml
- on GitHub, open Settings > Pages > Build and deployment > Source and choose GitHub Actions
- after that, every push to main publishes automatically
- expected site URL: https://cristianismohumilde.github.io/biblia.eu.creio/
- Portuguese URL: https://cristianismohumilde.github.io/biblia.eu.creio/pt/
- English URL: https://cristianismohumilde.github.io/biblia.eu.creio/en/

Recommended language strategy in this project:

- keep language by subfolder (pt/, en/, and future languages)
- use root (/) only as language router based on browser preference
- share common data structure and add language-specific fields only when needed
- maintain international SEO with canonical, hreflang (pt-BR, en), and x-default

Quick post-activation checklist:

- verify workflow run under Actions
- confirm successful deployment to github-pages environment
- open public URL and validate index/data loading
- validate health file at data/health.json
- validate sitemap.xml and robots.txt

Static health-check:

- file: data/health.json
- purpose: monitor published version, schema, and generated package timestamp
- generatedAt updates automatically in deploy based on latest commit

Additional SEO notes:

- sitemap.xml with multilingual URLs and alternates (pt-BR, en, x-default)
- robots.txt allowing crawling and pointing to sitemap
- sitemap lastmod updates automatically in deploy from latest commit

### Shared Hosting

- upload the same files to public directory (for example: public_html)
- no Node.js runtime or backend required for MVP

## Recommended Next Steps

- expand data/books.json, chapter files, and verse files
- add offline scripts to generate JSON in batches from licensed sources
- complete remaining verses for Genesis 1-5 following the same multilingual schema

## Licensing Note

This project should remain open source. Code can use MIT license, but textual datasets must follow each source license. Do not publish content without rights verification.

- code license: see [LICENSE](LICENSE)
- data licensing policy: see [LICENSE-DATA](LICENSE-DATA)
- source licensing/risk status: see [SOURCES-LICENSES.md](SOURCES-LICENSES.md)

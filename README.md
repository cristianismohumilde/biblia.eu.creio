# 📜 Biblia.Creio.EU

[Leia em português 🇧🇷](README.pt-BR.md)

<div align="center">
  <h3>🏛️ Ancient Manuscripts | 🔍 Interlinear Study | 🚀 Static-First Architecture</h3>

  [![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
  ![License: MIT](https://img.shields.io/badge/license-MIT-green)
</div>

---

**Biblia.Creio.EU** is a high-level open-source interlinear Bible study platform. Built with **Next.js** for high-performance static generation, it provides a professional tool for deep analysis of original manuscripts across multiple linguistic traditions.

## 🎯 Project Objectives

Biblia.Creio.EU provides a complete, academia-grade interlinear experience:

- **💎 Ancient Manuscript Witnesses:** Hebrew, Aramaic, Greek, Latin, Ge'ez, Syriac, Coptic, and Armenian.
- **✍️ Curation-based Literal Translation:** Word-for-word literal translations developed for structural fidelity.
- **📚 Multi-Language Lexicons:** Comprehensive support for **Strong (Hebrew/Greek)**, **Jastrow (Aramaic)**, **Dillmann (Ge'ez)**, **LSJ**, **L&S**, and more.
- **⚖️ Multi-traditional Comparison:** Simultaneous analysis across key linguistic witnesses of biblical history.

## 🛡️ Legal Compliance & Transparency

This project is a pillar of **Open Data**. We ensure absolute legal safety for contributors and users:

- **🔓 Public Domain:** All linguistic databases (lemmas, morphology, and base dictionaries) use exclusively public domain works.
- **🔍 Fair Use:** Specific references to modern scholarship are restricted to academic comparative contexts (Right of Citation).
- **🎨 Original Production:** All literal translations and data structures are original productions of the team, openly licensed.

> [!IMPORTANT]
> For full details and a list of works, see [SOURCES-LICENSES.md](SOURCES-LICENSES.md) and the [Sources Page](https://cristianismohumilde.github.io/biblia.eu.creio/en/fontes).

## ⚡ Core Capabilities

- **📖 Token-Level Interlinear:** Surface text, transliteration, lemma, morphology, and lexical references.
- **🔊 High-Quality Cloud Audio:** Hear original manuscripts and literal translations via advanced Cloud TTS (Google engine).
- **🔄 Witness Comparison:** Compare different manuscripts (Leningradensis, LXX, Vulgate, etc.) per verse.
- **📍 Dynamic Navigation:** Instant verse-by-verse navigation with cached data loading.
- **🔍 Real-time Filtering:** Search and filter tokens in interlinear tables instantly.
- **🌓 Theme Support:** Premium Dark and Light modes for long study sessions.


## 🛠️ Technology Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) App Router |
| **UI/UX** | Vanilla CSS + Premium Design System |
| **Runtime** | React 19 |
| **Hosting** | GitHub Pages (Static Export) |
| **Data** | Pre-generated JSON-LD ready Datasets |

## 🏗️ Architecture

- **🚀 Static Export:** Pages are pre-generated at build time for maximum speed and SEO.
- **📦 Data Structure:** Served as static files from `public/data/`, requiring no active database.
- **🗺️ Dynamic Routing:** Instant navigation powered by Next.js client-side routing.

## ⚙️ Master Data Pipeline (For Other Apps & Developers)

The core of **Biblia.Creio.EU** is its interlinear JSON data structure. If you are developing **another application** and wish to reuse this same architecture (e.g., a mobile app or another study platform), you should not create the database manually.

Instead, you should use a **Master Data Pipeline** script to import open academic data (like OSIS or the OpenScriptures repository) and convert them into `.json` files consumable by your application.

### Pipeline Example (Unpointed Hebrew / No Niqqud)
Many developers prefer working with **Consonantal Hebrew** (only the original consonants, without the vowels/Niqqud introduced by the Masoretes). To apply this pipeline in your own app and remove the vowels, your Node.js or Python script must apply a simple regular expression during data import:

```javascript
// Example of how an import script cleans Hebrew text
function removeNiqqud(hebrewText) {
    // The regex [\u0591-\u05C7] matches all masoretic and cantillation marks
    return hebrewText.replace(/[\u0591-\u05C7]/g, '');
}

// Example:
// Input: "בְּרֵאשִׁית" (bereshit with niqqud)
// Output: "בראשית" (bereshit consonants only)
```

**How to adapt it for your App:**
1. Download a raw database (e.g., Westminster Leningrad Codex XML).
2. Write a script (Node.js/Python) that iterates through all chapters and verses.
3. For each word, apply `removeNiqqud()` to the surface text property.
4. Save the result as a large array of objects (or multiple JSON files) inside your new application's data folder.

## 💻 Run Locally

1. **Clone & Install:**
   ```bash
   npm install
   ```
2. **Launch Dev:**
   ```bash
   npm run dev
   ```
3. **Build Static:**
   ```bash
   npm run build
   ```

## 🤝 Contributing

We welcome scholars and developers! Before opening PRs, please read:
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

## 📄 Licensing

- **Code:** [MIT License](LICENSE)
- **Data:** Open data policy for study and redistribution (see [LICENSE-DATA](LICENSE-DATA)).

---
<div align="center">
  Developed with ❤️ by the Biblia.Creio.EU Team
</div>

# 🏭 The Master Data Pipeline Architecture

This document explains the architectural strategy used by **Biblia.Creio.EU** to generate hundreds of thousands of interlinear JSON files across different linguistic traditions without manual data entry.

If you plan to add a new language (e.g., Greek New Testament, Aramaic Targums, Syriac Peshitta) or a new manuscript, **you must replicate this exact pipeline pattern**.

## 🧩 The Two-Piece Strategy

Do not attempt to use AI to generate verse translations or morphological tagging out of thin air. AI hallucinates and destroys academic rigor. Instead, the pipeline relies on the intersection of two distinct databases:

### 1. The Linguistic Database (The Skeleton)
This is an academic, open-source dataset containing the original text, parsed token-by-token.
- **What it provides**: `surface` (the word), `lemma` (the root), `morph` (the grammatical tagging), and a universal identifier like a **Strong's Number** (e.g., H430, G2316).
- **Where to get it**: 
  - *Hebrew*: OpenScriptures MorphHB (OSIS XML)
  - *Greek*: SBLGNT, STEPBible Data, Tyndale House
  - *Format*: Usually XML or SQL.

### 2. The Lexical Dictionary (The Flesh)
This is a single, large JSON file mapping every Strong's number to its respective literal translations and dictionary explanations.
- **What it provides**: `ptLiteralWord`, `enLiteralWord`, `explanation`, `bdb`/`lsj`.
- **How to build it**: You can use existing English Strong's JSON dictionaries. For Portuguese or Spanish, you can use AI to safely translate the *dictionary file* (which contains ~8000 entries) rather than translating the *entire Bible* (which contains ~1.5 million words).

---

## ⚙️ The Pipeline Workflow

The Master Script (`scripts/pipeline/generator.js`) performs the following steps:

1. **Ingest the Skeleton**: Parses the raw XML/JSON of the biblical text.
2. **Iterate Tokens**: Loops through every book, chapter, verse, and word.
3. **Dictionary Lookup**: For each word, it reads the Strong's number (e.g., `H430`) and queries the **Lexical Dictionary**.
4. **Merge & Hydrate**: It injects the translation, BDB definition, and explanation from the dictionary into the word token.
5. **JSON Export**: It writes the final object to `public/data/verses/[book].[chapter].[verse].json`.

### 🛠️ Adding a New Language (Example: Greek)

To add Greek to the pipeline:
1. Obtain the **SBL Greek New Testament** with morphological tags and Strong's numbers.
2. Obtain a **Greek Strong's Dictionary** in JSON format.
3. Create a `greek_pipeline.js` that reads the SBLGNT, maps the `G...` Strong numbers to your dictionary, and outputs the tokens with `"lang": "greek"`.

## ⚠️ Important Considerations
- **Unpointed Texts**: If your target application requires unpointed text (e.g., Hebrew without Niqqud or Greek without accents), strip them out using Regex *during* step 2 of the pipeline.
- **Data Deduplication**: Keep your dictionaries centralized. If a translation for a specific Strong's number needs fixing, fix it in the master dictionary JSON and re-run the pipeline to update all thousands of verses automatically.

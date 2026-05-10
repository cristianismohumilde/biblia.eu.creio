# SOURCES-LICENSES

[Leia em português](SOURCES-LICENSES.md)

Status verification of textual data sources and licenses for the project.

Date of last revision: 2026-04-25

## Project Status

This project has ceased to be a technical MVP and is now the full version in expansion. The database follows strict licensing criteria to guarantee the open source nature and legal security.

## Detailed Sources and Licenses

The project uses a combination of public domain data and original curation. Below, the breakdown by component of the interlinear tables:

### 1. Source Texts (Manuscripts)

#### Hebrew
- **Codex Leningradensis (B19A).** Digital source: TanakhML (OSIS XML Project) - Public Domain.

#### Greek - Septuaginta (LXX)
- **Primary Source:** CATSS (Computer Assisted Tools for Septuagint Studies) / Penn State University
- **Dataset:** GreekResources LXX Lemmas
- **Location:** `scripts/pipeline/raw_data/GreekResources-master/`
- **URL:** https://github.com/CATSS
- **License:** Academic/Open Source (permitted for research and open source projects)
- **Content:** Greek text, lemmas, morphological parsing for the entire Septuaginta including deuterocanonicals
- **Base Manuscripts:** Codex Vaticanus (B), Sinaiticus (א), Alexandrinus (A)

#### Greek - New Testament
- **Byzantine Text** and **SBLGNT** (Society of Biblical Literature Greek New Testament)

#### Other Languages
- **Vulgate (Latin),** Peshitta (Syriac), Coptic, Armenian, and Ge'ez.

#### General Status
- **Public Domain.** The digital transcriptions used are based on open sources (such as *Open Scriptures*, *CATSS*, and free access academic projects).
  - *Historical Note:* The B19A is used for its integrity. Comparative research demonstrates that it is practically identical to the Aleppo Codex and the Dead Sea Scrolls (DSS), confirming an extremely faithful textual preservation over more than a thousand years.

### 2. Technical Linguistic Data
- **Lemmas and Roots:** Language facts (not copyrightable).
- **Strong's Numbers:** **Public Domain** (James Strong, 1890).
- **Morphology:** Universal grammatical categories (Noun, Verb, etc.), without use of proprietary encoding systems.
- **Transliterations:** Functional phonetic representation to aid study.

### 3. Lexicons and Dictionaries
- The `lexicon` field in JSON data is used only to point to the lemma or base form of the word.
- The project is based on classic **Public Domain** lexicons, such as:
    - **Latin:** Lewis & Short (*A Latin Dictionary*, 1879) - **Public Domain.**
    - **Greek:** Liddell-Scott-Jones (*LSJ*, Ed. 1940 or earlier) and Thayer - **Public Domain.**
    - **Hebrew:** Brown-Driver-Briggs (BDB) and Strong's Concordance - **Public Domain.**
    - **Aramaic:** Marcus Jastrow (*A Dictionary of the Targumim...*, 1903) - **Public Domain.**
    - **Ge'ez:** August Dillmann (*Lexicon Linguae Aethiopicae*, 1865) - **Public Domain.**
    - **Syriac:** Payne Smith (*A Compendious Syriac Dictionary*, 1903) - **Public Domain.**
    - **Coptic:** W.E. Crum (*A Coptic Dictionary*, 1939) - **Public Domain.**
    - **Armenian:** Matthias Bedrossian (1875) - **Public Domain.**

## Fair Use Policy and Transition

The Biblia.Creio.EU project is in a constant process of auditing.
1. **Redistribution Sources:** The main database available for download and fork is based exclusively on the **Public Domain** works listed above.
2. **Use of Modern Works:** References to modern lexicons (such as CAL or CDG) may have been used in initial phases only for lemma verification or small comparative samples. This use is strictly limited, of academic and non-commercial character, supported by **Fair Use** clauses and Right of Quotation (Art. 46, VIII of Law 9.610/98), not constituting copying or redistribution of protected databases.
3. **Curation:** All glosses and translations in Portuguese/English are original productions of the team, licensed as Open Data.

### 4. Literal Translations (Glosses)
- The word-for-word translations (`ptLiteralWord`, `enLiteralWord`) are the result of **original curation by the Biblia.Creio.EU Team**.
- This is an academic literal translation aimed at interlinear study, not infringing rights of protected commercial translations.

## Current Legal Risk

- **Low / Safe.**
- The project is based exclusively on public domain data and own production.
- Redistribution is permitted under the terms of our [LICENSE-DATA](LICENSE-DATA).

## Next Actions
- Maintain the provenance manifest for each new language dataset added.
- Always prioritize sources with Creative Commons or equivalent licenses.

---

## 🤖 AI-Assisted Translations

### Methodology
Starting May 2026, part of the literal translations in Portuguese (`ptLiteralVerse`, `ptLiteralWord`) were generated with the assistance of Artificial Intelligence, specifically:

- **Model**: OpenAI `o4-mini` via Microsoft Azure OpenAI Service
- **Pipeline**: `scripts/pipeline/ai_translate_azure.js`
- **Reference source**: English literal texts (`enLiteralVerse`, `enLiteralWord`) as input base

### Legal Situation
- **Source texts** (Hebrew, Greek, Aramaic): Public Domain. No restrictions.
- **Model output**: The [Microsoft Azure Terms of Service](https://azure.microsoft.com/support/legal/) permit commercial and non-commercial use of generated outputs.
- **Copyright of Output**: According to the legislation of most jurisdictions (including Brazil and USA), content generated purely by AI **without substantial human creativity** is not protected by copyright and may be considered public domain.
- **Project Position**: We treat AI-assisted translations as **original team production** (editorially supervised) and license them as **Open Data (CC0 / Open Data)**.

### Transparency and Audit
- JSON files contain the fields `ptLiteralVerse` and `ptLiteralWord` generated by this process.
- The process is **reproducible**: anyone can re-run the pipeline with the same input and verify the output.
- Human editorial review is **recommended** before use in formal academic publications.

### Legal Risk
- **Low / Safe** for use in the context of this open-source biblical study project.

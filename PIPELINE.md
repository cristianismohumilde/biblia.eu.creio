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

The pipeline supports multiple Greek textual traditions:

#### **Option A: Septuaginta (LXX) - Old Testament Greek**
1. **Source:** CATSS (Computer Assisted Tools for Septuagint Studies) / Penn State University
   - Repository: https://github.com/CATSS
   - Dataset: GreekResources LXX Lemmas
   - License: Open Source academic (free for research)
2. **Pipeline:** Use `generator_lxx.js` (already implemented)
   - Location: `scripts/pipeline/generator_lxx.js`
   - Input: `raw_data/GreekResources-master/GreekResources-master/LxxLemmas/*.js`
   - Output: Tokens with `"lang": "greek"` for OT books including deuterocanonicals

#### **Option B: SBL Greek New Testament**
1. Obtain the **SBLGNT** with morphological tags and Strong's numbers.
2. Obtain a **Greek Strong's Dictionary** in JSON format.
3. Create a `greek_pipeline.js` that reads the SBLGNT, maps the `G...` Strong numbers to your dictionary, and outputs the tokens with `"lang": "greek"`.

---

## 🤖 AI-Assisted Localization Engines

For high-volume translation of literal verses and individual word tokens, the pipeline supports two primary AI engines. Choosing the right one depends on your needs for speed vs. volume.

### 1. 🚀 Groq Engine (`ai_translate_pipeline.js`)
**Best for**: Speed and low latency on small to medium books.
- **Model**: `llama-3.1-8b-instant`
- **Strategy**: Small batches (3-5 verses) to stay under Free Tier rate limits.
- **Usage**:
  ```bash
  node scripts/pipeline/ai_translate_pipeline.js [bookCode] [lang]
  ```

### 2. ✨ Google Gemini Engine (`ai_translate_gemini.js`)
**Best for**: Massive volume and large context windows.
- **Model**: `gemini-flash-latest` (1.5/2.5/3.1 depending on availability).
- **Strategy**: Large batches (10-30 verses) leveraging the **2 million Tokens Per Minute (TPM)** limit of the Google AI Studio free tier.
- **Usage**:
  ```bash
  node scripts/pipeline/ai_translate_gemini.js [bookCode] [lang]
  ```

### 3. 🔵 Azure OpenAI Engine (`ai_translate_azure.js`) ⭐ RECOMENDADO
**Melhor para**: Tradução em massa de alta qualidade com custo mínimo. Ideal para quem tem créditos Azure for Students.
- **Modelo**: `gpt-4o-mini` (melhor custo-benefício de todos)
- **Custo estimado**: ~$0.15/1M tokens → **a Bíblia toda por menos de $2**
- **Estratégia**: Lotes de 20 versos. Sem os rate limits agressivos do Groq/Gemini gratuito.
- **Pré-requisitos**: Adicionar ao `.env.local`:
  ```env
  AZURE_OPENAI_ENDPOINT=https://SEU-RECURSO.openai.azure.com
  AZURE_OPENAI_KEY=sua_chave_aqui
  AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
  ```
- **Uso**:
  ```bash
  node scripts/pipeline/ai_translate_azure.js [bookCode] [lang]
  ```

---

## 🧬 Intelligent Batch Processing

Both scripts utilize a **Batching Strategy** to maximize API efficiency:
1. **Filtering**: The script scans the target book and filters out verses that already have a translation (skipping manual work or previous runs).
2. **Batching**: It groups the remaining verses into chunks (e.g., 10 verses).
3. **Contextual Prompting**: It sends the original Hebrew/Greek tokens and the English literal reference to the AI, asking for a structured JSON response.
4. **Hydration**: It injects the AI's response back into the correct JSON fields (`ptLiteralVerse`, `ptLiteralWord`).

### 🛡️ Error Handling & Resilience
- **Rate Limits (429)**: The scripts include automatic exponential backoff.
- **Service Overload (503)**: Specifically tuned for Gemini, the script will wait up to 20 seconds and retry up to 5 times if the server is busy.
- **Schema Safety**: The AI is forced to return JSON via `response_format`, preventing hallucinations from breaking the file structure.

---

## 🛠️ Summary of Commands

| Task | Command |
| --- | --- |
| **Translate Book (Fast/Groq)** | `node scripts/pipeline/ai_translate_pipeline.js [book] pt` |
| **Translate Book (Bulk/Gemini)** | `node scripts/pipeline/ai_translate_gemini.js [book] pt` |
| **Translate Book (Azure/GPT-4o-mini) ⭐** | `node scripts/pipeline/ai_translate_azure.js [book] pt` |
| **Re-run Pipeline** | Simply run the command again; it will skip already translated verses. |


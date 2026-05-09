# 🏛️ Pipeline Septuaginta (LXX)

Gerador de dados interlineares gregos para o Antigo Testamento, seguindo a arquitetura do pipeline do projeto.

## 📋 O que faz este script

O `generator_lxx.js` processa os dados da **Septuaginta (LXX)** e adiciona:

- ✅ `sourceTexts.greek` - Texto grego completo do versículo
- ✅ `greekWitnesses` - Testemunho da Septuaginta (LXX)
- ✅ `tokens` - Tokens gregos com:
  - `surface` - Palavra com acentos
  - `lemma` - Forma lexical
  - `strong` - Código Strong (Gxxxx)
  - `morph` - Parsing morfológico (V-Aor-Act-3s, etc.)
  - `transliteration` - Transliteração latina

## 🗂️ Fonte de Dados

### Proveniência Oficial

**CATSS - Computer Assisted Tools for Septuagint Studies**
- **Instituição:** Penn State University
- **Projeto:** Septuaginta textual research since 1981
- **URL:** https://github.com/CATSS
- **Licença:** Open Source acadêmica (uso livre para pesquisa e projetos open source)

### Dataset Utilizado

**GreekResources LXX Lemmas** (mirror no projeto)
- **Local:** `raw_data/GreekResources-master/GreekResources-master/LxxLemmas/*.js`
- **Formato:** JSON estruturado por versículo (ex: `"Gen.1.1": [{"key": "εν", "lemma": "ἐν"}, ...]`)
- **Cobertura:** Todo o Antigo Testamento grego, incluindo deuterocanônicos
- **Conteúdo:**
  - Texto grego (forma superficial)
  - Lemas (formas lexicais)
  - Referências cruzadas com manuscritos

### Manuscritos Base da Edição

A LXX no dataset baseia-se principalmente em:

| Manuscrito | Sigla | Século | Conteúdo no Dataset |
|------------|-------|--------|---------------------|
| Codex Vaticanus | B | IV d.C. | Base principal |
| Codex Sinaiticus | א | IV d.C. | Segunda testemunha |
| Codex Alexandrinus | A | V d.C. | Texto alternativo |

### Livros Deuterocanônicos Incluídos

- **Históricos:** 1-4 Macabeus, 1-2 Esdras, Tobias, Judite
- **Sapienciais:** Sabedoria de Salomão, Eclesiástico (Sirach)
- **Proféticos:** Baruc, Epístola de Jeremias, Adições a Daniel (Susana, Bel)
- **Poéticos:** Salmo 151, Salmos de Salomão, Odes/Cânticos
- **Outros:** Oração de Manassés

## 🚀 Como usar

### 1. Processar livro específico

```bash
cd scripts/pipeline
node generator_lxx.js gen      # Gênesis
node generator_lxx.js exo      # Êxodo
node generator_lxx.js psa      # Salmos
```

### 2. Processar todos os livros

```bash
node generator_lxx.js
```

### 3. Saída esperada

```
🏛️  PIPELINE SEPTUAGINTA (LXX)
═══════════════════════════════════════
📚 Encontrados 52 arquivos LXX

📖 Processando: Gen → gen
✅ Processados: 1533 versículos

📖 Processando: Exod → exo
✅ Processados: 1213 versículos
...
```

## 📊 Estrutura dos dados gerados

### Exemplo: Gênesis 1:1

```json
{
  "sourceTexts": {
    "hebrew": "בְּרֵאשִׁית...",
    "greek": "ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν"
  },
  "greekWitnesses": [
    {
      "id": "lxx",
      "label": "Septuaginta (LXX)",
      "text": "ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν",
      "transliteration": "en archê epoiēsen ho theos ton ouranon kai tēn gēn",
      "literalPt": "",
      "literalEn": ""
    }
  ],
  "tokens": [
    {
      "id": "gen.1.1.g1",
      "lang": "greek",
      "langPt": "Grego",
      "langEn": "Greek",
      "surface": "ἐν",
      "transliteration": "en",
      "lemma": "ἐν",
      "strong": "G1722",
      "morph": "Prep",
      "manuscript": "Grego: Septuaginta (LXX), tradição alexandrina",
      "manuscriptEn": "Greek: Septuagint (LXX), Alexandrian tradition",
      "ptLiteralWord": "",
      "enLiteralWord": "",
      "explanation": "",
      "explanationEn": ""
    }
    // ... mais tokens
  ]
}
```

## 🧠 Parsing Morfológico Detectado

O script identifica automaticamente:

| Padrão | Morph | Significado |
|--------|-------|-------------|
| `σεν$` | V-Aor-Act-3s | Aoristo ativo 3ª pessoa |
| `θη$` | V-Aor-Pass-3s | Aoristo passivo 3ª pessoa |
| `ον$` | V-Pres-Act-1s/3s | Presente ativo |
| `ει$` | V-Pres-Act-3s | Presente ativo indicativo |
| `ων$` | V-Pres-Ptc | Particípio presente |
| `ος$` | N-ms | Substantivo masculino singular |
| `η$` | N-fs | Substantivo feminino singular |
| `ὁ` | Art | Artigo definido |
| `ἐν` | Prep | Preposição |
| `καί` | Conj | Conjunção |

## ⚠️ Limitações e Melhorias Futuras

1. **Diacríticos**: O script reconstrói acentos via mapeamento. Não 100% preciso.
2. **Parsing**: Detecção baseada em padrões. Não substitui parser morfológico completo.
3. **Strong's**: Mapeamento parcial (~200 palavras). Expandir conforme necessidade.
4. **Traduções**: Campos `literalPt/En` ficam vazios. Preencher via:
   - `ai_translate_azure.js` (recomendado)
   - `ai_translate_gemini.js`
   - Manualmente

## 🔗 Integração com Tradução AI

Após gerar tokens gregos, use os scripts de tradução:

```bash
# Traduzir literais para português
node ai_translate_azure.js gen pt

# Ou usar Gemini (gratuito)
node ai_translate_gemini.js gen pt
```

## 📚 Manuscritos Gregos

A LXX é baseada principalmente em:

| Manuscrito | Século | Sigla | Importância |
|------------|--------|-------|-------------|
| Codex Vaticanus | IV d.C. | B | Base principal |
| Codex Sinaiticus | IV d.C. | א | Segundo melhor |
| Codex Alexandrinus | V d.C. | A | Completo |

## 🛠️ Troubleshooting

### Erro: "Arquivo não encontrado"
- Verifique se `raw_data/GreekResources-master/` existe
- Baixe os dados: `node download_raw_data.js`

### Tokens não aparecem
- Confirme que os arquivos JSON de destino existem em `public/data/verses/`
- Execute o `generator.js` primeiro para criar estrutura base

### Parsing incorreto
- O morph é aproximado. Para precisão máxima, use MorphGNT ou CATSS diretamente
- Edite manualmente ou refine o script

## 📖 Referências

- [Septuaginta Online](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxm/)
- [CATSS Database](https://github.com/CATSS)
- [STEP Bible](https://stepbible.org/)
- [OpenScriptures](https://github.com/openscriptures)

---

**Criado seguindo a arquitetura do PIPELINE.md**

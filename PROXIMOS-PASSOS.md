# Próximos passos (handoff)

Arquivo vivo para continuidade: marque `- [x]` ao concluir e acrescente notas curtas na seção **Log**.

---

## Documentação e alinhamento

- [x] Badge Next.js nos READMEs alinhado à versão real em `package.json` (16).
- [x] Seção de localização por IA adicionada em `README.pt-BR.md` (paridade com `README.md`).
- [x] `PIPELINE.md` e `README.md`: texto sobre tamanho de lote Azure coerente com `BATCH_SIZE` em `ai_translate_azure.js`.
- [x] `ai_translate_azure.js`: mensagens/comentários alinhados ao lote real (10 versos).
- [x] `eslint-config-next` alinhado à major 16 (mesma linha do `next`; conferir `package.json`).

---

## Config Next.js / ESLint

- [x] Remover `eslint` de `next.config.mjs` (Next 16 não aceita mais — ver aviso no build).
- [x] Migrar `eslint.config.mjs` para `FlatCompat` + `next/core-web-vitals`.
- [x] Dependência `@eslint/eslintrc` declarada em `package.json` (FlatCompat).
- [ ] Rodar `npm run lint` até concluir (repositório grande — pode levar vários minutos) e corrigir avisos/erros.
- [ ] Rodar `npm run build` até o fim (export estático ~25k+ páginas — pode demorar) e registrar tempo ou falhas.

---

## Dados e pipeline linguístico

### Estado real (grego e interlinear)

- **Novo Testamento:** os JSON do NT (`mat`, `mrk`, …) foram gerados como **esqueleto** (`generate_nt_verses.js`) + texto fluido em PT via **Almeida** (`apply_almeida_translation.js`). Em geral **não há** `sourceTexts.greek` real nem lista `tokens` com morfologia grega — aparecem placeholders (`[Greek text to be added]`, `tokens: []`, `enLiteralVerse: "[placeholder]"` em muitos lugares). Ou seja: falta **todo** o pipeline de GN grego (texto + Strong/lema/morfologia por palavra), como descrito na **Opção B** de `PIPELINE.md`.
- **Antigo Testamento (Septuaginta):** `generator_lxx.js` injeta grego a partir dos **LxxLemmas** (CATSS) nos capítulos já existentes. Lacunas podem ocorrer onde não há arquivo destino, onde o livro/verso não bate com a chave `Gen.1.1`, ou onde o dataset LXX não cobre aquele trecho.
- **Deuterocanônicos / duplas tradições:** vários livros estão mapeados em `BOOK_MAP` do `generator_lxx.js` (ex.: `TobBA`/`TobS`, `DanOG`/`DanTh`). Ainda assim pode faltar harmonização ou versículos sem merge — vale rodar o relatório abaixo e revisar livro a livro.
- **Tabelas interlineares “fracas”:** mesmo com tokens hebraicos/gregos, campos como `ptLiteralWord`, `enLiteralWord`, `explanation` dependem do **léxico Strong** + **`generator.js`** + **`ai_translate_*.js`** (versículo + palavras). Onde o léxico não tem entrada ou a IA não rodou, a UI fica esparsa ou com gloss em inglês cru.

### Tarefas

- [x] **GN grego (NT):** `fetch_nt_morphgnt.js` + `generator_nt_greek.js` (MorphGNT/SBLGNT + Strong grego). NPM: `npm run pipeline:fetch-morphgnt` → `npm run pipeline:nt-greek`.
- [ ] **LXX:** rodar `node scripts/pipeline/generator_lxx.js` (ou por livro `node … gen`) após backups; depois `node scripts/pipeline/analyze_greek_lxx_coverage.js` para ver versículos sem tokens `lang === 'greek'` ou sem `sourceTexts.greek`.
- [ ] **Cobertura PT:** versículos/tokens sem `ptLiteralVerse` / `ptLiteralWord` — scripts AI com `.env.local`: `ai_translate_azure.js`, `ai_translate_pipeline.js`, `ai_translate_gemini.js`.
- [ ] **Qualidade léxica:** tokens com PT ruim ou inglês bruto — `analyze_frequency.js`, `strongs_pt.json`, revisão manual onde necessário.

---

## Testes e CI

- [ ] `npm run test:e2e` em ambiente com browsers Playwright instalados.
- [ ] Verificar workflow GitHub Actions (`deploy-pages.yml`) após mudanças em ESLint/build.

---

## Log (últimas alterações)

| Data       | Quem / sessão | Notas |
| ---------- | ------------- | ----- |
| 2026-05-09 | Assistente    | README/pt-BR/PIPELINE e logs Azure ajustados; `next.config.mjs` sem `eslint`; `eslint.config.mjs` com FlatCompat; `@eslint/eslintrc`; `eslint-config-next` ^16.2.6. Lint antigo falhou (`nextVitals is not iterable`) antes do FlatCompat — resolvido no código. Criado `PROXIMOS-PASSOS.md`. Pendência: `npm install` após bump ESLint, depois `npm run lint` / `build` completos. |
| 2026-05-09 | Assistente    | Esclarecido estado do grego: NT = esqueleto sem interlinear grego; AT LXX via `generator_lxx.js`; interlinear depende de léxico + IA. Adicionados bullets em **Dados e pipeline** e script `analyze_greek_lxx_coverage.js`. |
| 2026-05-09 | Assistente    | Pipeline NT grego: `fetch_nt_morphgnt.js`, `generator_nt_greek.js`, `greek_transliterate.js`; `.txt` MorphGNT em `.gitignore`; `PIPELINE.md`, `SOURCES-LICENSES.md`, `package.json` atualizados. NT inteiro regerado em `public/data/verses/*.json`. |

_Addicionar linhas acima conforme novos merges ou sessões._

---

## Windows / PowerShell (`npm` bloqueado)

Se aparecer *«npm.ps1 não pode ser carregado… execução de scripts foi desabilitada»*, use uma destas opções:

1. **Rápido:** chame o `.cmd` — `npm.cmd install`, `npm.cmd run lint`, etc.
2. **Ou pelo CMD:** `cmd /c npm install`
3. **Permanente (usuário atual):** num PowerShell normal:  
   `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`  
   Depois `npm install` volta a funcionar como de costume.

---

## Como usar este arquivo

1. Ao pegar o projeto, leia **Log** e desmarque itens que já foram feitos noutro branch sem atualizar aqui.
2. Ao terminar uma tarefa, marque a caixa e, se for relevante, uma linha no **Log**.
3. Mantenha bullets objetivos; detalhes longos ficam em PRs ou issues.

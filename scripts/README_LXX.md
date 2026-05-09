# Script de Integração Septuaginta (LXX)

Script para preencher dados dos manuscritos gregos do Antigo Testamento (Septuaginta/LXX) nos arquivos JSON do projeto.

## O que este script faz

1. Busca texto grego da Septuaginta
2. Gera tokens com:
   - Texto grego com diacríticos
   - Transliteração para alfabeto latino
   - Lemmas
   - Códigos Strong
   - Parsing morfológico (V-Aor-Act-3s, etc.)
3. Preenche campos:
   - `sourceTexts.greek`
   - `greekWitnesses` (Septuaginta)
   - `tokens` (idioma: greek)

## Fonte de Dados

**CATSS (Computer Assisted Tools for Septuagint Studies)**
- Repositório: https://github.com/CATSS
- Licença: Acadêmica/Open Source ✅
- Formato: Texto com parsing morfológico

## Como usar

### 1. Instalar dependências

```bash
cd scripts
pip install requests
```

### 2. Executar script

```bash
python fetch_lxx_data.py
```

O script vai:
- Buscar dados da CATSS
- Processar tokens
- Atualizar arquivos em `public/data/verses/`

### 3. Revisão manual

⚠️ **Importante**: Os dados gerados precisam de revisão:
- Verificar parsing morfológico
- Completar traduções literais (`literalPt`, `literalEn`)
- Adicionar explicações dos tokens
- Confirmar códigos Strong

## Estrutura dos tokens gerados

```json
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
  "ptLiteralWord": "em",
  "enLiteralWord": "in",
  "explanation": "Preposição 'em'",
  "explanationEn": "Preposition 'in'"
}
```

## Limitações atuais

1. **Parsing morfológico**: Simplificado, pode precisar de ajustes
2. **Strong's numbers**: Mapeamento parcial (precisa de BD completo)
3. **Lemmas**: Simplificados (ideal: lematizador grego)
4. **API CATSS**: Script atual usa textos de exemplo; integração completa necessita download dos arquivos CATSS

## Manuscritos gregos importantes

| Sigla | Nome | Século | Status na LXX |
|-------|------|--------|---------------|
| B | Codex Vaticanus | IV d.C. | Base principal |
| א | Codex Sinaiticus | IV d.C. | Parcial |
| A | Codex Alexandrinus | V d.C. | Completo |

## Próximos passos sugeridos

1. Download completo do banco CATSS
2. Integrar lematizador grego (pode usar MorphGNT)
3. Expandir mapeamento Strong
4. Adicionar comparação com Texto Massorético (alinhamento)

## Recursos adicionais

- **Septuaginta Online**: http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxm/
- **Blue Letter Bible LXX**: https://www.blueletterbible.org/lxx/
- **MorphGNT**: https://github.com/morphgnt

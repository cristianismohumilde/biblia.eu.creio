# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: language-switcher.spec.js >> Language Switcher >> keeps interlinear route, query and hash when switching languages
- Location: e2e\language-switcher.spec.js:14:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "/en/interlinear/b19a/"
Received: "/pt/interlinear/b19a/"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - paragraph [ref=e6]: Codex Leningradensis (B19A)
          - heading "Interlinear Completo" [level=1] [ref=e7]
          - paragraph [ref=e8]: Análise detalhada com transliteração, morfologia e explicações palavra por palavra.
        - navigation [ref=e9]:
          - link "Voltar ao interlinear" [ref=e10] [cursor=pointer]:
            - /url: /pt/
          - link "Tabela detalhada" [ref=e11] [cursor=pointer]:
            - /url: "#tabela-interlinear"
          - generic [ref=e12]:
            - link "Portugues" [ref=e13] [cursor=pointer]:
              - /url: /pt/interlinear/b19a/?book=gen&chapter=1&verse=2#tabela-interlinear
              - img "Brasil" [ref=e14]
              - generic [ref=e15]: PT
            - link "English" [active] [ref=e16] [cursor=pointer]:
              - /url: /en/interlinear/b19a/?book=gen&chapter=1&verse=2#tabela-interlinear
              - img "USA" [ref=e17]
              - generic [ref=e18]: EN
          - button "🌙 Tema escuro" [ref=e19] [cursor=pointer]
      - generic [ref=e20]:
        - region "Selecionar referência" [ref=e21]:
          - heading "Selecionar referência" [level=2] [ref=e22]
          - generic [ref=e23]:
            - generic [ref=e24]:
              - text: Livro
              - combobox "Livro" [ref=e25]:
                - option "Gênesis" [selected]
            - generic [ref=e26]:
              - text: Capítulo
              - combobox "Capítulo" [ref=e27]:
                - option "1" [selected]
                - option "2"
                - option "3"
                - option "4"
                - option "5"
            - generic [ref=e28]:
              - text: Verso
              - combobox "Verso" [ref=e29]:
                - option "1" [selected]
                - option "2"
                - option "3"
                - option "4"
                - option "5"
            - button "Carregar verso" [ref=e30] [cursor=pointer]
        - generic [ref=e31]:
          - heading "Visão do Verso" [level=2] [ref=e32]
          - paragraph [ref=e33]: gen 1:2
          - paragraph [ref=e34]: Codex Leningradensis (B19A)
          - paragraph [ref=e35]: Texto do manuscrito
          - blockquote [ref=e36]: וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל פְּנֵי הַמָּיִם
          - paragraph [ref=e37]: TRANSLITERAÇÃO
          - paragraph [ref=e38]: Ve-haaretz hayetah tohu va-vohu ve-choshek al penei tehom ve-ruach Elohim merachefet al penei hamayim
          - paragraph [ref=e39]: TRADUÇÃO LITERAL
          - paragraph [ref=e40]: E a terra era vã e vazia, e trevas [estavam] sobre a face do abismo, e o Espírito de Deus pairava sobre a face das águas.
        - generic [ref=e41]:
          - heading "Resumo Linguístico" [level=2] [ref=e42]
          - generic [ref=e43]:
            - article [ref=e44]:
              - paragraph [ref=e45]: Tokens totais
              - paragraph [ref=e46]: "14"
            - article [ref=e47]:
              - paragraph [ref=e48]: Com Strong
              - paragraph [ref=e49]: "14"
            - article [ref=e50]:
              - paragraph [ref=e51]: Com morfologia
              - paragraph [ref=e52]: "14"
        - generic [ref=e53]:
          - heading "Tabela detalhada" [level=2] [ref=e54]
          - generic [ref=e55]:
            - text: Buscar por palavra, lema, léxico ou transliteração
            - searchbox "Buscar por palavra, lema, léxico ou transliteração" [ref=e56]
          - table [ref=e58]:
            - rowgroup [ref=e59]:
              - row "# ID Original TRANSLITERAÇÃO Lema Strong Morfologia TRADUÇÃO LITERAL" [ref=e60]:
                - columnheader "#" [ref=e61]
                - columnheader "ID" [ref=e62]
                - columnheader "Original" [ref=e63]
                - columnheader "TRANSLITERAÇÃO" [ref=e64]
                - columnheader "Lema" [ref=e65]
                - columnheader "Strong" [ref=e66]
                - columnheader "Morfologia" [ref=e67]
                - columnheader "TRADUÇÃO LITERAL" [ref=e68]
            - rowgroup [ref=e69]:
              - row "1 gen.1.2.h1 וְהָאָרֶץ ve-haaretz אֶרֶץ H776 Conj + Art + Subst e a terra" [ref=e70]:
                - cell "1" [ref=e71]
                - cell "gen.1.2.h1" [ref=e72]
                - cell "וְהָאָרֶץ" [ref=e73]
                - cell "ve-haaretz" [ref=e74]
                - cell "אֶרֶץ" [ref=e75]
                - cell "H776" [ref=e76]
                - cell "Conj + Art + Subst" [ref=e77]
                - cell "e a terra" [ref=e78]
              - row "2 gen.1.2.h2 הָיְתָה hayetah הָיָה H1961 Verbo era/estava" [ref=e79]:
                - cell "2" [ref=e80]
                - cell "gen.1.2.h2" [ref=e81]
                - cell "הָיְתָה" [ref=e82]
                - cell "hayetah" [ref=e83]
                - cell "הָיָה" [ref=e84]
                - cell "H1961" [ref=e85]
                - cell "Verbo" [ref=e86]
                - cell "era/estava" [ref=e87]
              - row "3 gen.1.2.h3 תֹהוּ tohu תֹּהוּ H8414 Subst vã / sem forma" [ref=e88]:
                - cell "3" [ref=e89]
                - cell "gen.1.2.h3" [ref=e90]
                - cell "תֹהוּ" [ref=e91]
                - cell "tohu" [ref=e92]
                - cell "תֹּהוּ" [ref=e93]
                - cell "H8414" [ref=e94]
                - cell "Subst" [ref=e95]
                - cell "vã / sem forma" [ref=e96]
              - row "4 gen.1.2.h4 וָבֹהוּ va-vohu בֹּהוּ H922 Conj + Subst e vazia" [ref=e97]:
                - cell "4" [ref=e98]
                - cell "gen.1.2.h4" [ref=e99]
                - cell "וָבֹהוּ" [ref=e100]
                - cell "va-vohu" [ref=e101]
                - cell "בֹּהוּ" [ref=e102]
                - cell "H922" [ref=e103]
                - cell "Conj + Subst" [ref=e104]
                - cell "e vazia" [ref=e105]
              - row "5 gen.1.2.h5 וְחֹשֶׁךְ ve-choshek חֹשֶׁךְ H2822 Conj + Subst e trevas" [ref=e106]:
                - cell "5" [ref=e107]
                - cell "gen.1.2.h5" [ref=e108]
                - cell "וְחֹשֶׁךְ" [ref=e109]
                - cell "ve-choshek" [ref=e110]
                - cell "חֹשֶׁךְ" [ref=e111]
                - cell "H2822" [ref=e112]
                - cell "Conj + Subst" [ref=e113]
                - cell "e trevas" [ref=e114]
              - row "6 gen.1.2.h6 עַל al עַל H5921 Prep sobre" [ref=e115]:
                - cell "6" [ref=e116]
                - cell "gen.1.2.h6" [ref=e117]
                - cell "עַל" [ref=e118]
                - cell "al" [ref=e119]
                - cell "עַל" [ref=e120]
                - cell "H5921" [ref=e121]
                - cell "Prep" [ref=e122]
                - cell "sobre" [ref=e123]
              - row "7 gen.1.2.h7 פְּנֵי penei פָּנֶה H6440 Subst (const) face de" [ref=e124]:
                - cell "7" [ref=e125]
                - cell "gen.1.2.h7" [ref=e126]
                - cell "פְּנֵי" [ref=e127]
                - cell "penei" [ref=e128]
                - cell "פָּנֶה" [ref=e129]
                - cell "H6440" [ref=e130]
                - cell "Subst (const)" [ref=e131]
                - cell "face de" [ref=e132]
              - row "8 gen.1.2.h8 תְהוֹם tehom תְּהוֹם H8415 Subst abismo" [ref=e133]:
                - cell "8" [ref=e134]
                - cell "gen.1.2.h8" [ref=e135]
                - cell "תְהוֹם" [ref=e136]
                - cell "tehom" [ref=e137]
                - cell "תְּהוֹם" [ref=e138]
                - cell "H8415" [ref=e139]
                - cell "Subst" [ref=e140]
                - cell "abismo" [ref=e141]
              - row "9 gen.1.2.h9 וְרוּחַ ve-ruach רוּחַ H7307 Conj + Subst e o Espírito" [ref=e142]:
                - cell "9" [ref=e143]
                - cell "gen.1.2.h9" [ref=e144]
                - cell "וְרוּחַ" [ref=e145]
                - cell "ve-ruach" [ref=e146]
                - cell "רוּחַ" [ref=e147]
                - cell "H7307" [ref=e148]
                - cell "Conj + Subst" [ref=e149]
                - cell "e o Espírito" [ref=e150]
              - row "10 gen.1.2.h10 אֱלֹהִים Elohim אֱלֹהִים H430 Subst de Deus" [ref=e151]:
                - cell "10" [ref=e152]
                - cell "gen.1.2.h10" [ref=e153]
                - cell "אֱלֹהִים" [ref=e154]
                - cell "Elohim" [ref=e155]
                - cell "אֱלֹהִים" [ref=e156]
                - cell "H430" [ref=e157]
                - cell "Subst" [ref=e158]
                - cell "de Deus" [ref=e159]
              - row "11 gen.1.2.h11 מְרַחֶפֶת merachefet רָחַף H7363 Verbo (particípio) pairava" [ref=e160]:
                - cell "11" [ref=e161]
                - cell "gen.1.2.h11" [ref=e162]
                - cell "מְרַחֶפֶת" [ref=e163]
                - cell "merachefet" [ref=e164]
                - cell "רָחַף" [ref=e165]
                - cell "H7363" [ref=e166]
                - cell "Verbo (particípio)" [ref=e167]
                - cell "pairava" [ref=e168]
              - row "12 gen.1.2.h12 עַל al עַל H5921 Prep sobre" [ref=e169]:
                - cell "12" [ref=e170]
                - cell "gen.1.2.h12" [ref=e171]
                - cell "עַל" [ref=e172]
                - cell "al" [ref=e173]
                - cell "עַל" [ref=e174]
                - cell "H5921" [ref=e175]
                - cell "Prep" [ref=e176]
                - cell "sobre" [ref=e177]
              - row "13 gen.1.2.h13 פְּנֵי penei פָּנֶה H6440 Subst (const) face de" [ref=e178]:
                - cell "13" [ref=e179]
                - cell "gen.1.2.h13" [ref=e180]
                - cell "פְּנֵי" [ref=e181]
                - cell "penei" [ref=e182]
                - cell "פָּנֶה" [ref=e183]
                - cell "H6440" [ref=e184]
                - cell "Subst (const)" [ref=e185]
                - cell "face de" [ref=e186]
              - row "14 gen.1.2.h14 הַמָּיִם hamayim מַיִם H4325 Art + Subst as águas" [ref=e187]:
                - cell "14" [ref=e188]
                - cell "gen.1.2.h14" [ref=e189]
                - cell "הַמָּיִם" [ref=e190]
                - cell "hamayim" [ref=e191]
                - cell "מַיִם" [ref=e192]
                - cell "H4325" [ref=e193]
                - cell "Art + Subst" [ref=e194]
                - cell "as águas" [ref=e195]
    - contentinfo [ref=e196]:
      - paragraph [ref=e197]:
        - text: "Projeto open source em português no GitHub:"
        - link "github.com/cristianismohumilde/biblia.eu.creio" [ref=e198] [cursor=pointer]:
          - /url: https://github.com/cristianismohumilde/biblia.eu.creio
      - paragraph [ref=e199]: "Licenças: código MIT e dados conforme LICENSE-DATA e SOURCES-LICENSES."
      - paragraph [ref=e200]: "Health: ok | versão 0.1.0 | schema 1.0.0 | atualizado Invalid Date UTC"
  - button "Open Next.js Dev Tools" [ref=e206] [cursor=pointer]:
    - img [ref=e207]
  - alert [ref=e210]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Language Switcher", () => {
  4  |   test("keeps same section path when switching languages", async ({ page }) => {
  5  |     await page.goto("/pt/idiomas-biblicos/");
  6  | 
  7  |     await expect(page).toHaveURL(/\/pt\/idiomas-biblicos\/?$/);
  8  | 
  9  |     await page.getByRole("link", { name: "English" }).click();
  10 | 
  11 |     await expect(page).toHaveURL(/\/en\/idiomas-biblicos\/?$/);
  12 |   });
  13 | 
  14 |   test("keeps interlinear route, query and hash when switching languages", async ({ page }) => {
  15 |     await page.goto("/pt/interlinear/b19a/?book=gen&chapter=1&verse=2#tabela-interlinear");
  16 | 
  17 |     await page.getByRole("link", { name: "English" }).click();
  18 | 
  19 |     const url = new URL(page.url());
> 20 |     expect(url.pathname).toBe("/en/interlinear/b19a/");
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  21 |     expect(url.searchParams.get("book")).toBe("gen");
  22 |     expect(url.searchParams.get("chapter")).toBe("1");
  23 |     expect(url.searchParams.get("verse")).toBe("2");
  24 |     expect(url.hash).toBe("#tabela-interlinear");
  25 |   });
  26 | });
  27 | 
```
# SOURCES-LICENSES

Status de verificação de fontes e licenças de dados textuais do projeto.

Data desta última revisão: 2026-04-25

## Situação do Projeto

Este projeto deixou de ser um MVP técnico e agora é a versão completa em expansão. A base de dados segue critérios rigorosos de licenciamento para garantir a natureza open source e a segurança jurídica.

## Detalhamento das Fontes e Licenças

O projeto utiliza uma combinação de dados em domínio público e curadoria original. Abaixo, o detalhamento por componente das tabelas interlineares:

### 1. Textos Fonte (Manuscritos)

#### Hebraico
- **Codex Leningradensis (B19A).** Fonte digital: TanakhML (OSIS XML Project) - Domínio Público.

#### Grego - Septuaginta (LXX)
- **Fonte Principal:** CATSS (Computer Assisted Tools for Septuagint Studies) / Penn State University
- **Dataset:** GreekResources LXX Lemmas
- **Localização:** `scripts/pipeline/raw_data/GreekResources-master/`
- **URL:** https://github.com/CATSS
- **Licença:** Acadêmica/Open Source (uso permitido para pesquisa e projetos open source)
- **Conteúdo:** Texto grego, lemas, parsing morfológico para toda a Septuaginta incluindo deuterocanônicos
- **Manuscritos Base:** Codex Vaticanus (B), Sinaiticus (א), Alexandrinus (A)

#### Grego - Novo Testamento
- **Texto base + morfologia:** *MorphGNT: SBLGNT Edition* (James Tauber et al.) — morfologia/lemas **CC-BY-SA 3.0**; texto **SBLGNT** sujeito ao [EULA da SBL](https://sblgnt.com/license/). Pipeline: `fetch_nt_morphgnt.js` + `generator_nt_greek.js`.
- **Léxico Strong grego (glosas EN):** Open Scriptures — **CC-BY-SA** (`strongs-greek-dictionary.js`).
- **Nota:** O site também menciona comparação com tradição bizantina (metadados); o interlinear NT gerado pelo pipeline atual usa a camada MorphGNT/SBLGNT conforme os scripts acima.

#### Outros Idiomas
- **Vulgata (Latim),** Peshitta (Siríaco), Copta, Armênio e Ge'ez.

#### Status Geral
- **Domínio Público.** As transcrições digitais utilizadas são baseadas em fontes abertas (como *Open Scriptures*, *CATSS* e projetos acadêmicos de acesso livre).
  - *Nota Histórica:* O B19A é utilizado por sua integridade. Pesquisas comparativas demonstram que ele é praticamente idêntico ao Códice de Aleppo e aos Manuscritos do Mar Morto (DSS), confirmando uma preservação textual de extrema fidelidade ao longo de mais de mil anos.

### 2. Dados Linguísticos Técnicos
- **Lemas e Raízes:** Fatos da língua (não protegíveis por copyright).
- **Números de Strong:** **Domínio Público** (James Strong, 1890).
- **Morfologia:** Categorias gramaticais universais (Subst, Verbo, etc.), sem uso de sistemas de codificação proprietários.
- **Transliterações:** Representação fonética funcional para auxílio ao estudo.

### 3. Léxicos e Dicionários
- O campo `lexicon` nos dados JSON é utilizado apenas para apontar o lema ou forma base da palavra.
- O projeto baseia-se em léxicos clássicos de **Domínio Público**, tais como:
    - **Latim:** Lewis & Short (*A Latin Dictionary*, 1879) - **Domínio Público.**
    - **Grego:** Liddell-Scott-Jones (*LSJ*, Ed. 1940 ou anterior) e Thayer - **Domínio Público.**
    - **Hebraico:** Brown-Driver-Briggs (BDB) e Strong's Concordance - **Domínio Público.**
    - **Aramaico:** Marcus Jastrow (*A Dictionary of the Targumim...*, 1903) - **Domínio Público.**
    - **Ge'ez:** August Dillmann (*Lexicon Linguae Aethiopicae*, 1865) - **Domínio Público.**
    - **Sírio:** Payne Smith (*A Compendious Syriac Dictionary*, 1903) - **Domínio Público.**
    - **Copta:** W.E. Crum (*A Coptic Dictionary*, 1939) - **Domínio Público.**
    - **Armênio:** Matthias Bedrossian (1875) - **Domínio Público.**

## Política de Uso Justo e Transição

O projeto Biblia.Creio.EU está em constante processo de auditoria. 
1. **Fontes de Redistribuição:** A base de dados principal disponível para download e fork baseia-se exclusivamente nas obras de **Domínio Público** listadas acima.
2. **Uso de Obras Modernas:** Referências a léxicos modernos (como CAL ou CDG) podem ter sido utilizadas em fases iniciais apenas para verificação de lemas ou pequenas amostras comparativas. Este uso é estritamente limitado, de caráter acadêmico e não-comercial, amparado pelas cláusulas de **Uso Justo (Fair Use)** e Direito de Citação (Art. 46, VIII da Lei 9.610/98), não constituindo cópia ou redistribuição de bases de dados protegidas.
3. **Curadoria:** Todas as glosas e traduções em Português/Inglês são produções originais da equipe, licenciadas como Dados Abertos.

### 4. Traduções Literais (Glosas)
- As traduções palavra-por-palavra (`ptLiteralWord`, `enLiteralWord`) são fruto de **curadoria original da Equipe Biblia.Creio.EU**.
- Trata-se de uma tradução literal acadêmica voltada para o estudo interlinear, não infringindo direitos de traduções comerciais protegidas.

## Risco Legal Atual

- **Baixo / Seguro.**
- O projeto baseia-se exclusivamente em dados de domínio público e produção própria.
- A redistribuição é permitida sob os termos da nossa [LICENSE-DATA](LICENSE-DATA).

## Próximas Ações
- Manter o manifesto de proveniência para cada novo dataset de idiomas adicionado.
- Priorizar sempre fontes com licenças Creative Commons ou equivalentes.

---

## 🤖 Traduções Assistidas por IA (AI-Assisted Translations)

### Metodologia
A partir de Maio de 2026, parte das traduções literais em Português (`ptLiteralVerse`, `ptLiteralWord`) foram geradas com auxílio de Inteligência Artificial, especificamente:

- **Modelo**: OpenAI `o4-mini` via Microsoft Azure OpenAI Service
- **Pipeline**: `scripts/pipeline/ai_translate_azure.js`
- **Fonte de referência**: Textos em inglês literal (`enLiteralVerse`, `enLiteralWord`) como base de entrada

### Situação Jurídica
- **Textos fonte** (Hebraico, Grego, Aramaico): Domínio Público. Sem restrições.
- **Output do modelo**: Os [Termos de Serviço da Microsoft Azure](https://azure.microsoft.com/support/legal/) permitem uso comercial e não-comercial dos outputs gerados.
- **Direito Autoral do Output**: Segundo a legislação da maioria das jurisdições (incluindo Brasil e EUA), conteúdo gerado puramente por IA **sem criatividade humana substancial** não é protegido por direitos autorais e pode ser considerado de domínio público.
- **Posição do Projeto**: Tratamos as traduções AI-assistidas como **produção original da equipe** (supervisionadas editorialmente) e as licenciamos como **Dados Abertos (CC0 / Open Data)**.

### Transparência e Auditoria
- Os arquivos JSON contêm os campos `ptLiteralVerse` e `ptLiteralWord` gerados por este processo.
- O processo é **reproduzível**: qualquer pessoa pode re-executar o pipeline com a mesma entrada e verificar o output.
- Revisão editorial humana é **recomendada** antes de uso em publicações acadêmicas formais.

### Risco Legal
- **Baixo / Seguro** para uso no contexto deste projeto open-source de estudo bíblico.

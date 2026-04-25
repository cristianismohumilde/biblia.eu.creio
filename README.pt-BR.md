# Biblia.Creio.EU

[Read in English](README.md)

[![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-149ECA)
![Licença: MIT](https://img.shields.io/badge/licenca-MIT-green)

Projeto open source de estudo bíblico interlinear de alto nível, utilizando Next.js para geração estática de alta performance e roteamento dinâmico. O foco é fornecer uma ferramenta acadêmica e espiritual gratuita para análise profunda dos manuscritos originais.

## Objetivos do Projeto

O Biblia.Creio.EU oferece uma experiência completa de estudo interlinear:

- **Textos de Manuscritos Antigos:** Hebraico, Aramaico, Grego, Latim, Ge'ez, Siríaco, Copta e Armênio.
- **Tradução Literal Curada:** Versão literal por verso e palavra-por-palavra desenvolvida pela equipe.
- **Ferramental Acadêmico:** Explicação léxica, morfologia e números de Strong por palavra.
- **Comparativo Multitradicional:** Análise simultânea entre os principais testemunhos linguísticos da história bíblica.

## Segurança Jurídica e Transparência

Este projeto é construído sobre o pilar dos **Dados Abertos (Open Data)**. Para garantir a segurança jurídica de todos os colaboradores e usuários:

- **Domínio Público:** Todas as bases de dados linguísticas (lemas, Strong, morfologia e dicionários base) utilizam exclusivamente obras de domínio público (como Jastrow, Dillmann, LSJ, L&S).
- **Uso Justo (Fair Use):** Qualquer referência pontual a léxicos modernos é restrita ao âmbito acadêmico e comparativo, amparada pelo direito de citação e uso justo, sem redistribuição de bases protegidas.
- **Produção Original:** As traduções literais e a organização dos dados são de propriedade da equipe Biblia.Creio.EU e licenciadas abertamente.

Para detalhes completos e lista de obras, consulte [SOURCES-LICENSES.md](SOURCES-LICENSES.md).

## Capacidades Principais

- Leitura interlinear por token (superfície, transliteração, lema, morfologia, referências lexicais).
- Comparação de testemunhos por verso.
- Navegação livro -> capítulo -> verso por rotas dinâmicas.
- Filtros em tempo real nas tabelas interlineares.
- Superfície bilíngue (PT/EN).
- Exportação estática otimizada para GitHub Pages.

## Stack Tecnológica

| Camada | Tecnologia |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) App Router |
| UI | Vanilla CSS + design system customizado |
| Runtime | React 19 |
| Hospedagem | GitHub Pages (estática) |
| Dados | JSON pré-gerado em public/data |

## Arquitetura

### Exportação Estática + JSON
As páginas são geradas no momento do build via Next.js, garantindo velocidade máxima e SEO otimizado. O roteamento dinâmico permite navegar entre livros, capítulos e versos de forma instantânea.

### Estrutura de Dados
Os dados são servidos como arquivos estáticos a partir de `public/data/`, permitindo que o projeto seja hospedado em qualquer servidor de arquivos estáticos sem necessidade de banco de dados ativo.

## Estrutura do Projeto

- `src/app/`: App Router do Next.js (lógica de visualização).
- `public/data/`: Banco de dados estruturado em JSON.
- `public/assets/`: Assets estáticos e estilos globais.
- `next.config.mjs`: Configuração de exportação estática.

## Como Rodar Localmente

1. Instale as dependências: `npm install`
2. Inicie o servidor: `npm run dev`
3. Gere o build estático: `npm run build`
4. Acesse `http://localhost:3000`

## Publicação

- O CI executa build e deploy com GitHub Actions.
- `npm run build` gera a pasta estática `out`.
- `out` é publicada automaticamente na branch `gh-pages`.
- URL esperada: https://cristianismohumilde.github.io/biblia.eu.creio/

## Contribuição

Antes de abrir um PR, leia:
- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## Licenciamento

- **Código:** Licença MIT (ver [LICENSE](LICENSE)).
- **Dados:** Política de uso livre para estudo e redistribuição (ver [LICENSE-DATA](LICENSE-DATA) e [SOURCES-LICENSES.md](SOURCES-LICENSES.md)).

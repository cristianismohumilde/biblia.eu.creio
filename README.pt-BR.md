# Biblia.Creio.EU

[Read in English](README.md)

[![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-149ECA)
![Licença: MIT](https://img.shields.io/badge/licenca-MIT-green)

Plataforma open source de estudo bíblico interlinear com arquitetura static-first.
O foco é unir fidelidade aos manuscritos, análise linguística por token e entrega rápida em hospedagem estática.

## Por que este projeto

- Preservar acesso aos testemunhos textuais antigos em uma interface moderna.
- Oferecer tradução literal por verso e por palavra.
- Facilitar comparação entre tradições linguísticas relevantes.
- Escalar por fases sem inflar infraestrutura no inicio.

## Capacidades principais

- Leitura interlinear por token (surface, transliteration, lemma, morfologia, referências lexicais).
- Comparação de testemunhos por verso.
- Navegação livro -> capítulo -> verso por rotas dinâmicas.
- Filtros em tempo real nas tabelas interlineares.
- Superfície bilíngue (PT/EN).
- Exportação estática otimizada para GitHub Pages.

## Stack tecnológica

| Camada | Tecnologia |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) App Router |
| UI | Vanilla CSS + design system customizado |
| Runtime | React 19 |
| Hospedagem | GitHub Pages (estática) |
| Dados | JSON pré-gerado em public/data |

## Arquitetura por fases

### Fase 1 (atual)
Exportação estática com datasets JSON pré-gerados.

- Geração de páginas no build.
- Templates dinâmicos para páginas interlineares.
- Redirecionamento por idioma do navegador em / para /pt ou /en.
- Dados servidos como arquivos estáticos em public/data.

### Fase 2
Camada leve de API/busca sem quebrar contratos de URL da fase estática.

### Fase 3
Backend completo em VPS para busca avançada, jobs de processamento e contas.

## Estrutura do projeto

```text
src/app/                # paginas e layouts (App Router)
public/data/            # datasets de livros, capítulos e versos
public/assets/          # CSS/JS e mídias estáticas
next.config.mjs         # configuração de exportação estática
```

## Como rodar localmente

Requisitos:

- Node.js 20+
- npm

Instalar dependências:

```bash
npm install
```

Iniciar ambiente de desenvolvimento:

```bash
npm run dev
```

Gerar build estático:

```bash
npm run build
```

URL local: http://localhost:3000

## Modelo de dados (visão geral)

```text
public/data/books.json
public/data/books/{livro}/chapters/{capítulo}.json
public/data/verses/{livro}.{capítulo}.{verso}.json
```

Cada JSON de verso pode incluir:

- referência canônica
- textos-fonte por idioma
- metadados de testemunhos
- traduções literais
- lista de tokens com campos lexicais e morfológicos

## Publicacao

- O CI executa build e deploy com GitHub Actions.
- npm run build gera a pasta estática out.
- out e publicada automaticamente na branch gh-pages.
- URL esperada: https://cristianismohumilde.github.io/biblia.eu.creio/

## Contribuição

Antes de abrir PR, leia:

- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## Licenciamento

Código e dados textuais seguem políticas diferentes.

- Licença de código: [LICENSE](LICENSE)
- Política de dados: [LICENSE-DATA](LICENSE-DATA)
- Status de licenciamento das fontes: [SOURCES-LICENSES.md](SOURCES-LICENSES.md)

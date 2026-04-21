# Biblia.Creio.EU

[Read in English](README.md)

![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)

Projeto open source de estudo bíblico interlinear, com foco inicial em publicação estática (GitHub Pages), utilizando Next.js para geração estática de alta performance e roteamento dinâmico.

## Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Estilização:** Vanilla CSS (sistema de design premium customizado)
- **Hospedagem:** GitHub Pages (via Static Export)
- **Dados:** Arquivos JSON estruturados

## Como Contribuir

Para manter o projeto estável e evitar regressões, siga o guia de colaboração:

- ver [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)
- ver [CONTRIBUTING.md](CONTRIBUTING.md) (versão em inglês)

## Objetivo Inicial (MVP)

Entregar um site com:

- textos dos manuscritos antigos (grego, hebraico, aramaico e latim)
- tradução literal por verso
- tradução literal por palavra
- explicação léxica/morfológica por palavra
- comparação entre os principais testemunhos linguísticos: hebraico, aramaico, grego, latim, ge'ez, siríaco, copta e armênio

## Arquitetura por Fases

### Fase 1 (Atual): Next.js Static Export + JSON Pré-gerado

Plataforma alvo:

- GitHub Pages (Hospedagem Estática)

Decisões:

- **Geração Estática:** As páginas são geradas no momento do build via Next.js.
- **Roteamento Dinâmico:** Um único template gerencia todas as visualizações interlineares baseado nos parâmetros da URL.
- **Redirecionamento Automático:** A raiz (/) detecta o idioma do navegador e redireciona para `/pt/` ou `/en/`.
- **Dados:** Os dados são gerados offline e servidos como arquivos JSON estáticos a partir do diretório `public/data/`.

Escopo técnico:

- UI interlinear moderna e responsiva por verso.
- Navegação dinâmica livro > capítulo > verso.
- Filtros em tempo real nas tabelas interlineares.
- Suporte multilíngue (PT/EN) a partir de uma base de código única.

### Fase 2: Backend Leve ou Serviço Externo

Objetivo:

- adicionar busca e API básicas sem quebrar a estrutura da Fase 1.

### Fase 3: VPS + Backend Completo

Objetivo:

- escalar para busca avançada, jobs de processamento e contas de usuário.

## Estrutura do Projeto

- `src/app/`: App Router do Next.js (páginas e layouts).
- `public/data/`: Dados JSON estruturados para livros, capítulos e versos.
- `public/assets/`: Assets estáticos (CSS, JS, imagens).
- `next.config.mjs`: Configurado para `output: 'export'`.

## Como Rodar Localmente

Certifique-se de ter o Node.js instalado.

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse http://localhost:3000.

## Publicação

### GitHub Pages

- O projeto utiliza GitHub Actions para build e deploy.
- O processo executa `npm run build`, gerando a pasta estática `out/`.
- A pasta `out/` é publicada automaticamente na branch `gh-pages`.
- URL esperada: https://cristianismohumilde.github.io/biblia.eu.creio/

## Estrutura de Dados Recomendada

- public/data/books.json
- public/data/books/{livro}/chapters/{capitulo}.json
- public/data/verses/{livro}.{capitulo}.{verso}.json

## Nota de Licenciamento

Este projeto é open source. O código utiliza a licença MIT, mas os datasets textuais devem respeitar a licença de cada fonte original.

- Licença do código: ver arquivo [LICENSE](LICENSE)
- Política de dados: ver arquivo [LICENSE-DATA](LICENSE-DATA)
- Status das fontes: ver arquivo [SOURCES-LICENSES.md](SOURCES-LICENSES.md)

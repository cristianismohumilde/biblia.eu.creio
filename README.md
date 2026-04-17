# Biblia.Creio.EU

![Deploy static site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)

Projeto open source de estudo bíblico interlinear em português, com foco inicial em publicação estática (GitHub Pages e hospedagem compartilhada), preparado para evoluir para backend em fases sem retrabalho.

## Objetivo Inicial (MVP)

Entregar um site com:

- textos dos manuscritos antigos (grego, hebraico, aramaico e latim)
- tradução literal para português por verso
- tradução literal por palavra
- explicação léxica/morfológica por palavra

## Arquitetura por Fases

### Fase 1 (Atual): Frontend Estático + JSON Pré-gerado

Plataforma alvo:

- GitHub Pages
- hospedagem compartilhada sem Node persistente

Decisões:

- sem backend no runtime
- dados gerados offline e publicados como arquivos JSON
- páginas estáticas por livro/capítulo/verso

Escopo técnico:

- UI interlinear por verso
- navegação livro > capítulo > verso
- carregamento de JSON por trecho
- busca local simples (opcional no início)

Critérios de sucesso:

- build estático publicado com sucesso
- páginas carregando rápido em mobile/desktop
- estrutura de dados pronta para evolução futura

### Fase 2: Backend Leve ou Serviço Externo

Objetivo:

- adicionar busca e API básicas sem quebrar a estrutura da Fase 1

Escopo técnico:

- API de leitura de versos/interlinear
- busca básica por palavra/lema/Strong
- cache simples para consultas frequentes

Critérios de sucesso:

- manter URLs e estrutura pública da Fase 1
- reduzir payload no cliente para consultas amplas

### Fase 3: VPS + Backend Completo

Objetivo:

- escalar para busca avançada, jobs de processamento e contas

Escopo técnico:

- pipeline automatizado de ingestão/reprocessamento de dados
- cache robusto
- busca avançada (concordância, relevância, filtros)
- autenticação e recursos de usuário (notas, favoritos, histórico)

Critérios de sucesso:

- observabilidade (logs, métricas, alertas)
- performance estável com alto volume de tráfego

## Checklist de Migração Sem Retrabalho

### Base de dados e contratos

- definir um schema JSON versionado (ex: schemaVersion)
- manter IDs estáveis para livro/capítulo/verso/token
- separar conteúdo textual de metadados léxicos/morfológicos
- documentar licenças de cada fonte em arquivo próprio

### Frontend

- encapsular acesso a dados em uma camada única (data adapters)
- evitar acoplar componentes diretamente ao formato bruto do JSON
- preservar URLs canônicas para SEO durante todas as fases

### Busca

- iniciar com índice local simples (Fase 1)
- evoluir para endpoint de busca mantendo a mesma interface no frontend
- garantir fallback gracioso quando busca avançada não estiver disponível

### Operação

- automatizar geração de dados (scripts reprodutíveis)
- validar consistência dos JSONs em CI
- publicar changelog de dados e de schema

## Estrutura de Dados Recomendada (Fase 1)

Sugestão de organização:

- data/books.json
- data/books/{livro}/chapters/{capitulo}.json
- data/verses/{livro}.{capitulo}.{verso}.json
- data/lexicon/{idioma}/{id}.json

Exemplo resumido de verso interlinear:

```json
{
  "schemaVersion": "1.0.0",
  "ref": {
    "book": "gen",
    "chapter": 1,
    "verse": 1
  },
  "sourceTexts": {
    "hebrew": "...",
    "greek": "...",
    "aramaic": null,
    "latin": "..."
  },
  "ptLiteralVerse": "No princípio...",
  "tokens": [
    {
      "id": "gen.1.1.t1",
      "lang": "hebrew",
      "surface": "...",
      "transliteration": "...",
      "lemma": "...",
      "strong": "H7225",
      "morph": "...",
      "ptLiteralWord": "princípio",
      "explanation": "Substantivo..."
    }
  ]
}
```

## Padrões para Continuidade por Programador ou Agente de IA

- não alterar contratos de dados sem atualizar schemaVersion
- nunca quebrar URLs públicas já indexadas
- priorizar compatibilidade retroativa no frontend
- registrar decisões arquiteturais no README antes de grandes mudanças

## Estado Atual

- planejamento arquitetural registrado
- frontend estático criado (HTML/CSS/JS)
- primeira página interlinear funcional com dados JSON de exemplo (Gênesis 1:1)

## Como Rodar Localmente

Como o projeto é estático, você pode abrir via servidor HTTP simples.

Exemplo com Python:

```bash
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Publicação

### GitHub Pages

- publicar a raiz do repositório como site estático
- garantir que os arquivos `index.html`, `assets/` e `data/` estejam versionados
- workflow automático já incluído em `.github/workflows/deploy-pages.yml`
- no GitHub, abrir Settings > Pages > Build and deployment > Source e selecionar GitHub Actions
- após isso, cada push na branch `main` publica automaticamente o site
- URL esperada do site: `https://cristianismohumilde.github.io/biblia.eu.creio/`

Checklist rápido após ativação:

- verificar execução do workflow em Actions
- confirmar publicação sem erro no ambiente `github-pages`
- abrir a URL pública e validar carregamento de `index.html` e arquivos em `data/`
- validar o health-check em `data/health.json`

Health-check estático:

- arquivo: `data/health.json`
- uso: monitorar versão publicada, schema e data de geração do pacote estático

### Hospedagem Compartilhada

- enviar os mesmos arquivos para o diretório público (ex: `public_html`)
- não requer Node.js nem backend para o MVP

## Próximo Passo Recomendado

- ampliar `data/books.json`, capítulos e versos
- criar script offline para gerar JSONs em lote a partir das fontes licenciadas

## Nota de Licenciamento

Este projeto deve permanecer open source. O código pode usar licença MIT, mas os dados textuais devem respeitar a licença específica de cada fonte. Não publicar conteúdo sem verificar direitos de uso.

- Licença do código: ver arquivo `LICENSE`
- Licença e política de dados: ver arquivo `LICENSE-DATA`
- Verificação atual de fontes e risco legal: ver arquivo `SOURCES-LICENSES.md`

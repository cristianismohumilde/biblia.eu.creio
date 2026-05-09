# Guia de Colaboração

[Read in English](CONTRIBUTING.md)

Obrigado por contribuir com este projeto open source.

Este repositório prioriza estabilidade de publicação estática, consistência entre idiomas e qualidade dos dados interlineares. O objetivo principal deste guia é evitar que uma alteração aparentemente simples quebre o site em produção.

## Princípios

- Preservar a estabilidade do site em produção.
- Não quebrar rotas públicas ou arquivos necessários ao deploy estático.
- Manter comportamento PT e EN alinhado ao alterar UI.
- Lidar com dados bíblicos com rigor e rastreabilidade de fontes.
- **Fontes de Dados:** Ao adicionar novos dados de manuscritos (ex: LXX Grego, Hebraico, Aramaico), use apenas fontes acadêmicas abertas (como CATSS, OpenScriptures) e documente a proveniência no `SOURCES-LICENSES.md`.

## Fluxo recomendado

1. Crie uma branch a partir da main.
2. Faça mudanças pequenas e focadas por tema.
3. Valide localmente com o checklist obrigatório.
4. Abra Pull Request com descrição clara e evidências de validação.

## Checklist obrigatório antes de abrir Pull Request

### 1) Site não quebra

- Inicie servidor local estático na raiz do projeto.
- Valide carregamento das rotas:
  - /
  - /pt/
  - /en/
- Confirme que as páginas principais carregam sem tela em branco.

Sugestão de servidor local:

- python -m http.server 8080

### 2) Navegação e referência bíblica

- Teste seleção de Livro, Capítulo e Verso em PT e EN.
- Confirme atualização correta do conteúdo ao trocar a referência.
- Verifique se links do menu rápido levam à seção correta.

### 3) Regressão visual (desktop e mobile)

- Teste em desktop (largura comum, ex. 1366px ou maior).
- Teste em mobile (largura próxima de 360px).
- Confira especialmente:
  - bloco Selecionar referência
  - bloco Tradução literal do verso
  - tabelas/listas de Traduções literais por idioma original
  - seção Palavra a palavra por idioma

### 4) Console e rede

- Abra o DevTools do navegador.
- Garanta ausência de erros em Console.
- Garanta ausência de 404 para JSON, CSS e JS em Network.

### 5) Dados JSON

- Se alterou arquivos em data/, valide sintaxe JSON dos arquivos modificados.
- Não mude schema sem justificar no PR e atualizar documentação.
- Preserve IDs estáveis de livro/capítulo/verso/token quando possível.

Sugestão para validar JSON via Python:

- python -m json.tool data/verses/gen.1.1.json > nul

Repita para cada JSON alterado.

### 6) Consistência multilíngue

- Mudança de interface em PT deve ser avaliada também em EN (e vice-versa).
- Texto, âncoras e comportamento devem permanecer equivalentes.

### 7) Licenças e fontes

- Não adicione conteúdo textual sem verificar licença.
- Consulte LICENSE-DATA e SOURCES-LICENSES.md ao incluir novas fontes.

## Como escrever uma boa Pull Request

Inclua no corpo da PR:

- Resumo objetivo do que mudou.
- Motivação da mudança.
- Arquivos principais alterados.
- Como validar manualmente.
- Riscos conhecidos e mitigação.
- Checklist obrigatório marcado.

Modelo sugerido:

- Resumo:
- Motivação:
- Arquivos alterados:
- Passos de validação executados:
- Evidências (prints/logs curtos):
- Riscos e rollback:

## Regras de qualidade para mudanças de frontend

- Evite alterar estilos globais sem necessidade.
- Prefira mudanças pequenas e incrementais em CSS/JS.
- Não remova elementos/ids usados por scripts sem revisar impacto.
- Verifique acessibilidade básica (labels, foco, contraste legível).

## Regras de qualidade para mudanças de dados bíblicos

- Mantenha coerência literal entre idiomas e textos-fonte.
- Evite traduções parafrásticas em campos literais.
- Se houver dúvida textual, explique no PR e proponha alternativa.

## Quando NÃO abrir PR ainda

Adie a PR se houver qualquer um dos pontos abaixo:

- erro de console não investigado
- rota quebrada ou link âncora inválido
- JSON inválido
- visual quebrado no mobile
- texto inconsistente entre PT e EN

## Dúvidas

Se estiver em dúvida sobre impacto arquitetural, abra primeiro uma issue curta com:

- problema
- proposta
- riscos
- arquivos afetados

[Read in English](PULL_REQUEST_TEMPLATE.md)

## Resumo

Descreva claramente o que mudou.

## Motivação

Por que esta mudança é necessária?

## Tipo de mudança

- [ ] Correção de bug
- [ ] Nova funcionalidade
- [ ] Refatoração
- [ ] Atualização de documentação
- [ ] Atualização de dados
- [ ] Outro (descreva abaixo)

## Principais arquivos alterados

Liste os principais arquivos alterados nesta PR.

## Passos de validação executados

Descreva exatamente o que você testou.

Exemplo:

1. Iniciei servidor estático local na raiz do repositório.
2. Abri /, /pt/ e /en/.
3. Testei seleção de Livro/Capítulo/Verso em PT e EN.
4. Verifiquei layout mobile em largura próxima de 360px.
5. Verifiquei Console e Network no navegador.

## Checklist obrigatório antes da PR

### Estabilidade do site

- [ ] O site carrega localmente sem tela em branco.
- [ ] As rotas /, /pt/ e /en/ carregam corretamente.
- [ ] Os links de navegação rápida apontam para seções válidas.

### Comportamento funcional

- [ ] O fluxo Livro/Capítulo/Verso funciona em PT.
- [ ] O fluxo Livro/Capítulo/Verso funciona em EN.
- [ ] O conteúdo é atualizado corretamente ao trocar a referência.

### Regressão visual

- [ ] Layout desktop validado (por exemplo, 1366px+).
- [ ] Layout mobile validado (largura próxima de 360px).
- [ ] O bloco "Selecionar referência" continua utilizável no mobile.
- [ ] As seções de tradução literal e palavra por palavra continuam legíveis.

### Console e rede

- [ ] Sem erros de Console relacionados a esta mudança.
- [ ] Sem novos erros 404 para JSON, CSS ou JS.

### Qualidade de dados (se data/ foi alterado)

- [ ] Os arquivos JSON alterados são sintaticamente válidos.
- [ ] IDs de livro/capítulo/verso/token permanecem estáveis quando possível.
- [ ] Não houve alterações de schema não intencionais.

### Consistência entre idiomas

- [ ] O comportamento entre PT e EN permanece equivalente nos fluxos alterados.
- [ ] Rótulos/âncoras/textos estão consistentes quando aplicável.

### Licenças e fontes (se conteúdo textual foi alterado)

- [ ] A licença das fontes foi verificada.
- [ ] As mudanças estão em conformidade com LICENSE-DATA e SOURCES-LICENSES.md.

## Evidências (prints, logs ou notas)

Adicione prints, logs ou notas curtas comprovando os checks acima.

## Riscos e plano de rollback

Descreva riscos conhecidos e como reverter com segurança se necessário.

## Observações adicionais

Inclua qualquer ponto ao qual os revisores devem prestar atenção especial.

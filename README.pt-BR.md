# 📜 Biblia.Creio.EU

[Read in English 🇺🇸](README.md)

<div align="center">
  <h3>🏛️ Manuscritos Antigos | 🔍 Estudo Interlinear | 🚀 Arquitetura Static-First</h3>

  [![Deploy Next.js site to Pages](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cristianismohumilde/biblia.eu.creio/actions/workflows/deploy-pages.yml)
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
  ![Licença: MIT](https://img.shields.io/badge/licenca-MIT-green)
</div>

---

O **Biblia.Creio.EU** é um projeto open source de estudo bíblico interlinear de alto nível. Utilizando **Next.js** para geração estática de alta performance, ele fornece uma ferramenta acadêmica e espiritual gratuita para análise profunda dos manuscritos originais em múltiplas tradições linguísticas.

## 🎯 Objetivos do Projeto

O Biblia.Creio.EU oferece uma experiência completa de estudo interlinear:

- **💎 Testemunhos de Manuscritos Antigos:** Hebraico, Aramaico, Grego, Latim, Ge'ez, Siríaco, Copta e Armênio.
- **✍️ Tradução Literal Curada:** Versão literal por verso e palavra-por-palavra desenvolvida para fidelidade estrutural.
- **📚 Léxicos Multilinguagem:** Suporte abrangente a **Strong (Hebraico/Grego)**, **Jastrow (Aramaico)**, **Dillmann (Ge'ez)**, **LSJ**, **L&S** e mais.
- **⚖️ Comparativo Multitradicional:** Análise simultânea entre os principais testemunhos linguísticos da história bíblica.

## 🛡️ Segurança Jurídica e Transparência

Este projeto é construído sobre o pilar dos **Dados Abertos (Open Data)**. Garantimos segurança jurídica total para colaboradores e usuários:

- **🔓 Domínio Público:** Todas as bases de dados linguísticas (lemas, morfologia e dicionários base) utilizam exclusivamente obras de domínio público.
- **🔍 Uso Justo (Fair Use):** Referências pontuais a léxicos modernos são restritas ao âmbito acadêmico e comparativo (Direito de Citação).
- **🎨 Produção Original:** As traduções literais e a organização dos dados são produções originais da equipe, licenciadas abertamente.

> [!IMPORTANT]
> Para detalhes completos e lista de obras, consulte o [SOURCES-LICENSES.md](SOURCES-LICENSES.md) e a [Página de Fontes](https://cristianismohumilde.github.io/biblia.eu.creio/pt/fontes).

## ⚡ Capacidades Principais

- **📖 Interlinear por Token:** Texto de superfície, transliteração, lema, morfologia e referências lexicais.
- **🔄 Comparação de Testemunhos:** Compare diferentes manuscritos (Leningradensis, LXX, Vulgata, etc.) por verso.
- **📍 Navegação Dinâmica:** Navegação Livro ➔ Capítulo ➔ Verso com rotas otimizadas para SEO.
- **🔍 Filtros em Tempo Real:** Busque e filtre tokens nas tabelas interlineares instantaneamente.
- **🌓 Suporte a Temas:** Modos Escuro e Claro premium para longas sessões de estudo.

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) App Router |
| **UI/UX** | Vanilla CSS + Design System Premium |
| **Runtime** | React 19 |
| **Hospedagem** | GitHub Pages (Exportação Estática) |
| **Dados** | Datasets JSON estruturados (JSON-LD ready) |

## 🏗️ Arquitetura

- **🚀 Exportação Estática:** Páginas geradas no build para velocidade máxima e SEO.
- **📦 Estrutura de Dados:** Servidos como arquivos estáticos a partir de `public/data/`, sem necessidade de banco de dados ativo.
- **🗺️ Roteamento Dinâmico:** Navegação instantânea via roteamento client-side do Next.js.

## ⚙️ Master Data Pipeline (Para outros Apps e Desenvolvedores)

O coração do **Biblia.Creio.EU** é a sua estrutura de dados JSON interlinear. Se você está desenvolvendo **outro aplicativo** e deseja reutilizar esta mesma arquitetura (por exemplo, um aplicativo mobile ou outro site de estudo), você não deve criar o banco de dados manualmente. 

Em vez disso, você deve utilizar um **Script Gerador Mestre** (Master Data Pipeline) para importar dados acadêmicos abertos (como OSIS ou o repositório OpenScriptures) e convertê-los em arquivos `.json` consumíveis pela sua aplicação.

### Exemplo de Pipeline (Hebraico sem Niqqud)
Muitos desenvolvedores preferem trabalhar com o **Hebraico Consonantal** (apenas as consoantes originais, sem as vogais/Niqqud introduzidas pelos massoretas). Para aplicar esse pipeline em seu próprio app e remover as vogais, o seu script Node.js ou Python deve aplicar uma expressão regular simples durante a importação dos dados:

```javascript
// Exemplo de como um script de importação limpa o Hebraico
function removeNiqqud(hebrewText) {
    // A regex [\u0591-\u05C7] captura todos os sinais massoréticos e de cantilação
    return hebrewText.replace(/[\u0591-\u05C7]/g, '');
}

// Exemplo:
// Entrada: "בְּרֵאשִׁית" (bereshit com niqqud)
// Saída: "בראשית" (bereshit apenas consoantes)
```

**Como adaptar para o seu App:**
1. Baixe um banco de dados bruto (ex: XML do Westminster Leningrad Codex).
2. Escreva um script (Node.js/Python) que itere por todos os capítulos e versos.
3. Para cada palavra, aplique o `removeNiqqud()` na propriedade de texto.
4. Salve o resultado como um grande array de objetos (ou múltiplos arquivos JSON) dentro da pasta de dados do seu novo aplicativo.

## 💻 Como Rodar Localmente

1. **Instalação:**
   ```bash
   npm install
   ```
2. **Desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Build Estático:**
   ```bash
   npm run build
   ```

## 🤝 Contribuição

Estudiosos e desenvolvedores são bem-vindos! Antes de abrir um PR, leia:
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md)

## 📄 Licenciamento

- **Código:** [Licença MIT](LICENSE)
- **Dados:** Política de uso livre para estudo e redistribuição (ver [LICENSE-DATA](LICENSE-DATA)).

---
<div align="center">
  Desenvolvido com ❤️ pela Equipe Biblia.Creio.EU
</div>

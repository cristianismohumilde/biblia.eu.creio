const state = {
  books: [],
};

const LANG_ORDER = [
  { code: "hebrew", fallbackLabel: "Hebraico" },
  { code: "aramaic", fallbackLabel: "Aramaico" },
  { code: "greek", fallbackLabel: "Grego" },
  { code: "latin", fallbackLabel: "Latim" },
  { code: "geez", fallbackLabel: "Ge'ez" },
  { code: "syriac", fallbackLabel: "Siríaco" },
  { code: "coptic", fallbackLabel: "Copta" },
  { code: "armenian", fallbackLabel: "Armênio" },
];

const els = {
  form: document.querySelector("#reference-form"),
  status: document.querySelector("#status"),
  themeToggle: document.querySelector("#theme-toggle"),
  bookSelect: document.querySelector("#book-select"),
  chapterSelect: document.querySelector("#chapter-select"),
  verseSelect: document.querySelector("#verse-select"),
  referenceTitle: document.querySelector("#reference-title"),
  translationAuthor: document.querySelector("#translation-author"),
  translationSource: document.querySelector("#translation-source"),
  ptVerse: document.querySelector("#pt-verse"),
  literalSourcesBody: document.querySelector("#literal-sources-body"),
  hebrewWitnesses: document.querySelector("#hebrew-witnesses"),
  greekWitnesses: document.querySelector("#greek-witnesses"),
  healthInfo: document.querySelector("#health-info"),
  metaByLang: {},
  sourceByLang: {},
  witnessContainersByLang: {},
};

LANG_ORDER.forEach(({ code }) => {
  els.metaByLang[code] = document.querySelector(`#meta-${code}`);
  els.sourceByLang[code] = document.querySelector(`#source-${code}`);
  els.witnessContainersByLang[code] = document.querySelector(`#${code}-witnesses`);
});

const THEME_KEY = "biblia-theme";
const DATA_ROOT = document.body.dataset.dataRoot || "data";
const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", normalizedTheme);

  if (!els.themeToggle) {
    return;
  }

  const isDark = normalizedTheme === "dark";
  els.themeToggle.textContent = isDark ? "☀️ Tema claro" : "🌙 Tema escuro";
  els.themeToggle.setAttribute("aria-pressed", String(isDark));
};

const initializeTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(stored || preferred);

  if (!els.themeToggle) {
    return;
  }

  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
};

const setStatus = (message) => {
  els.status.textContent = message;
};

const clearBody = (element) => {
  if (!element) {
    return;
  }
  element.innerHTML = "";
};

const addOption = (selectEl, value, label) => {
  const option = document.createElement("option");
  option.value = String(value);
  option.textContent = label;
  selectEl.appendChild(option);
};

const resetSelect = (selectEl) => {
  selectEl.innerHTML = "";
};

const getRefFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    book: params.get("book"),
    chapter: params.get("chapter"),
    verse: params.get("verse"),
  };
};

const updateURL = (book, chapter, verse) => {
  const url = new URL(window.location.href);
  url.searchParams.set("book", book);
  url.searchParams.set("chapter", chapter);
  url.searchParams.set("verse", verse);
  window.history.replaceState({}, "", url);
};

const fillChapters = (bookCode) => {
  const book = state.books.find((item) => item.code === bookCode);
  resetSelect(els.chapterSelect);
  if (!book) {
    return;
  }

  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    addOption(els.chapterSelect, chapter, chapter);
  }
};

const fillVerses = async (bookCode, chapter) => {
  resetSelect(els.verseSelect);
  const chapterFile = `${DATA_ROOT}/books/${bookCode}/chapters/${chapter}.json`;

  try {
    const response = await fetch(chapterFile);
    if (!response.ok) {
      throw new Error(`Arquivo não encontrado: ${chapterFile}`);
    }

    const chapterData = await response.json();
    chapterData.verses.forEach((verse) => addOption(els.verseSelect, verse, verse));
  } catch (error) {
    setStatus("Não foi possível carregar os versos desse capítulo.");
  }
};

const renderTokensByLanguage = (tokens) => {
  const tabsContainer = document.querySelector("#lang-tabs");
  const contentContainer = document.querySelector("#tokens-by-lang-content");
  
  if (!tabsContainer || !contentContainer) return;
  
  clearBody(tabsContainer);
  clearBody(contentContainer);
  
  // Group tokens by language
  const tokensByLang = {};
  tokens.forEach((token) => {
    const lang = token.lang || "unknown";
    const langPt = token.langPt || lang;
    
    if (!tokensByLang[lang]) {
      tokensByLang[lang] = {
        langPt,
        tokens: []
      };
    }
    tokensByLang[lang].tokens.push(token);
  });
  
  // Get languages in order
  const langOrder = LANG_ORDER.map(x => x.code);
  const sortedLangs = Object.keys(tokensByLang).sort((a, b) => {
    return langOrder.indexOf(a) - langOrder.indexOf(b);
  });
  
  if (sortedLangs.length === 0) return;
  
  // Create tabs
  sortedLangs.forEach((lang, idx) => {
    const langData = tokensByLang[lang];
    const btn = document.createElement("button");
    btn.className = `tab-button ${idx === 0 ? "active" : ""}`;
    btn.textContent = langData.langPt;
    btn.setAttribute("data-lang", lang);
    
    btn.addEventListener("click", () => {
      // Remove active from all buttons and content
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      // Add active to clicked button and corresponding content
      btn.classList.add("active");
      const content = document.querySelector(`[data-lang-content="${lang}"]`);
      if (content) content.classList.add("active");
    });
    
    tabsContainer.appendChild(btn);
  });
  
  // Create content tabs
  sortedLangs.forEach((lang, idx) => {
    const langData = tokensByLang[lang];
    const content = document.createElement("div");
    content.className = `tab-content ${idx === 0 ? "active" : ""}`;
    content.setAttribute("data-lang-content", lang);
    
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrap";
    
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <th>Palavra</th>
      <th>Original</th>
      <th>Transliteração</th>
      <th>Lema</th>
      <th>Strong</th>
      <th>Morfologia</th>
      <th>Manuscrito/Fonte</th>
      <th>PT literal</th>
      <th>Explicação</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    langData.tokens.forEach((token, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${token.surface || "-"}</td>
        <td>${token.transliteration || "-"}</td>
        <td>${token.lemma || "-"}</td>
        <td>${token.strong || "-"}</td>
        <td>${token.morph || "-"}</td>
        <td>${token.manuscript || "-"}</td>
        <td>${token.ptLiteralWord || "-"}</td>
        <td>${token.explanation || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    tableWrap.appendChild(table);
    content.appendChild(tableWrap);
    contentContainer.appendChild(content);
  });
};

const renderLiteralBySource = (entries) => {
  if (!els.literalSourcesBody) {
    return;
  }

  clearBody(els.literalSourcesBody);

  entries.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.langPt || entry.lang || "-"}</td>
      <td>${entry.pt || "-"}</td>
    `;
    els.literalSourcesBody.appendChild(tr);
  });
};

const getTokenTransliterationByLang = (tokens = [], langCode) => {
  const transliteratedTokens = tokens
    .filter(
      (token) => token.lang === langCode && token.transliteration && token.transliteration !== "-",
    )
    .map((token) => token.transliteration.trim())
    .filter(Boolean);

  return transliteratedTokens.join(" ");
};

const buildDefaultWitness = ({ sourceText, literalText, transliterationText }) => {
  if (!sourceText) {
    return [];
  }

  return [
    {
      id: "base",
      label: "Texto-base",
      text: sourceText,
      transliteration: transliterationText,
      literalPt: literalText,
    },
  ];
};

const buildHebrewInterlinearHref = (ref) => {
  const params = new URLSearchParams({
    book: String(ref.book || "gen"),
    chapter: String(ref.chapter || 1),
    verse: String(ref.verse || 1),
  });
  return `interlinear-hebraico-b19a.html?${params.toString()}`;
};

const isHebrewLeningradensisWitness = (witness) => {
  if (!witness || typeof witness !== "object") {
    return false;
  }

  if (witness.id === "leningradensis") {
    return true;
  }

  const normalizedLabel = String(witness.label || "").toLowerCase();
  return normalizedLabel.includes("leningradensis") || normalizedLabel.includes("b19a");
};

const buildGreekInterlinearHref = (ref) => {
  const params = new URLSearchParams({
    book: String(ref.book || "gen"),
    chapter: String(ref.chapter || 1),
    verse: String(ref.verse || 1),
  });
  return `interlinear-grego-lxx.html?${params.toString()}`;
};

const isGreekSeptuagintWitness = (witness) => {
  if (!witness || typeof witness !== "object") {
    return false;
  }

  if (witness.id === "lxx" || witness.id === "septuagint") {
    return true;
  }

  const normalizedLabel = String(witness.label || "").toLowerCase();
  return normalizedLabel.includes("septuaginta") || normalizedLabel.includes("lxx");
};

const buildAramaicInterlinearHref = (ref) => {
  const params = new URLSearchParams({
    book: String(ref.book || "gen"),
    chapter: String(ref.chapter || 1),
    verse: String(ref.verse || 1),
  });
  return `interlinear-aramaico-targum.html?${params.toString()}`;
};

const isAramaicTargumWitness = (witness) => {
  if (!witness || typeof witness !== "object") {
    return false;
  }

  if (witness.id === "targum" || witness.id === "base") {
    return true;
  }

  const normalizedLabel = String(witness.label || "").toLowerCase();
  return normalizedLabel.includes("targum") || normalizedLabel.includes("onkelos");
};

const renderLanguageWitnesses = ({
  containerEl,
  witnesses,
  fallbackLiteral,
  fallbackTransliteration,
  fallbackSourceLabel,
  sourceTextClass = "",
  langCode = "",
  currentRef = null,
}) => {
  if (!containerEl) {
    return false;
  }

  clearBody(containerEl);

  if (!Array.isArray(witnesses) || witnesses.length === 0) {
    containerEl.hidden = true;
    return false;
  }

  witnesses.forEach((witness) => {
    const witnessCard = document.createElement("div");
    witnessCard.className = "text-witness";

    const title = document.createElement("h4");
    title.className = "text-witness-title";
    title.textContent = witness.label || fallbackSourceLabel || "Fonte textual";
    witnessCard.appendChild(title);

    const sourceText = document.createElement("p");
    sourceText.className = sourceTextClass
      ? `text-witness-text ${sourceTextClass}`
      : "text-witness-text";
    sourceText.textContent = witness.text || "Sem texto disponível.";
    witnessCard.appendChild(sourceText);

    const transliterationLabel = document.createElement("p");
    transliterationLabel.className = "text-witness-label";
    transliterationLabel.textContent = "Transliteração";
    witnessCard.appendChild(transliterationLabel);

    const transliterationText = document.createElement("p");
    transliterationText.className = "text-witness-transliteration";
    transliterationText.textContent =
      witness.transliteration || fallbackTransliteration || "Sem transliteração disponível.";
    witnessCard.appendChild(transliterationText);

    const literalLabel = document.createElement("p");
    literalLabel.className = "text-witness-label";
    literalLabel.textContent = "Tradução literal";
    witnessCard.appendChild(literalLabel);

    const literalText = document.createElement("p");
    literalText.className = "text-witness-literal";
    literalText.textContent = witness.literalPt || fallbackLiteral || "Sem tradução literal disponível.";
    witnessCard.appendChild(literalText);

    if (langCode === "hebrew" && currentRef && isHebrewLeningradensisWitness(witness)) {
      const actions = document.createElement("div");
      actions.className = "manuscript-actions";

      const interlinearLink = document.createElement("a");
      interlinearLink.className = "manuscript-cta";
      interlinearLink.href = buildHebrewInterlinearHref(currentRef);
      interlinearLink.textContent = "Interlinear completo";

      actions.appendChild(interlinearLink);
      witnessCard.appendChild(actions);
    }

    if (langCode === "greek" && currentRef && isGreekSeptuagintWitness(witness)) {
      const actions = document.createElement("div");
      actions.className = "manuscript-actions";

      const interlinearLink = document.createElement("a");
      interlinearLink.className = "manuscript-cta";
      interlinearLink.href = buildGreekInterlinearHref(currentRef);
      interlinearLink.textContent = "Interlinear completo";

      actions.appendChild(interlinearLink);
      witnessCard.appendChild(actions);
    }

    if (langCode === "aramaic" && currentRef && isAramaicTargumWitness(witness)) {
      const actions = document.createElement("div");
      actions.className = "manuscript-actions";

      const interlinearLink = document.createElement("a");
      interlinearLink.className = "manuscript-cta";
      interlinearLink.href = buildAramaicInterlinearHref(currentRef);
      interlinearLink.textContent = "Interlinear completo";

      actions.appendChild(interlinearLink);
      witnessCard.appendChild(actions);
    }

    containerEl.appendChild(witnessCard);
  });

  containerEl.hidden = false;
  return true;
};

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.name : data.ref.book;
  const translation = data.translation || {};
  const manuscripts = data.manuscripts || {};
  const sourceTexts = data.sourceTexts || {};
  const literalTranslations = data.literalTranslations || [];
  const tokens = data.tokens || [];
  const witnessSetsByLang = {
    hebrew: data.hebrewWitnesses,
    aramaic: data.aramaicWitnesses,
    greek: data.greekWitnesses,
    latin: data.latinWitnesses,
    geez: data.geezWitnesses,
    syriac: data.syriacWitnesses,
    coptic: data.copticWitnesses,
    armenian: data.armenianWitnesses,
  };
  const literalByLang = {};
  literalTranslations.forEach((entry) => {
    if (entry && entry.lang) {
      literalByLang[entry.lang] = entry.pt || "";
    }
  });
  const witnessVisibility = {};

  LANG_ORDER.forEach(({ code, fallbackLabel }) => {
    const fallbackLiteral = literalByLang[code] || "";
    const fallbackTransliteration = getTokenTransliterationByLang(tokens, code);
    const providedWitnesses = Array.isArray(witnessSetsByLang[code]) ? witnessSetsByLang[code] : [];
    const witnesses =
      providedWitnesses.length > 0
        ? providedWitnesses
        : buildDefaultWitness({
            sourceText: sourceTexts[code] || "",
            literalText: fallbackLiteral,
            transliterationText: fallbackTransliteration,
          });
    const sourceTextClass = RTL_LANGS.has(code) ? "rtl" : "";

    witnessVisibility[code] = renderLanguageWitnesses({
      containerEl: els.witnessContainersByLang[code],
      witnesses,
      fallbackLiteral,
      fallbackTransliteration,
      fallbackSourceLabel: `Fonte ${fallbackLabel.toLowerCase()}`,
      sourceTextClass,
      langCode: code,
      currentRef: data.ref,
    });
  });

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.translationAuthor.textContent = `Autoria das traduções literais: ${translation.author || "não informado"}`;
  els.translationSource.textContent = `Texto-fonte das traduções: ${translation.baseText || "não informado"}`;
  els.ptVerse.textContent = data.ptLiteralVerse || "Sem tradução literal disponível.";

  LANG_ORDER.forEach(({ code, fallbackLabel }) => {
    const metaEl = els.metaByLang[code];
    const sourceEl = els.sourceByLang[code];
    if (metaEl) {
      metaEl.textContent = manuscripts[code] || `Manuscrito/fonte (${fallbackLabel}) não informado.`;
    }
    if (sourceEl) {
      if (witnessVisibility[code]) {
        sourceEl.hidden = true;
        sourceEl.textContent = "";
      } else {
        sourceEl.hidden = false;
        sourceEl.textContent = sourceTexts[code] || "Sem conteúdo.";
      }
    }
  });

  renderLiteralBySource(literalTranslations);
  renderTokensByLanguage(data.tokens || []);
};

const loadVerse = async (bookCode, chapter, verse) => {
  setStatus("Carregando verso...");

  try {
    const file = `${DATA_ROOT}/verses/${bookCode}.${chapter}.${verse}.json`;
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Verso não encontrado: ${file}`);
    }

    const data = await response.json();
    renderVerse(data);
    updateURL(bookCode, chapter, verse);
    setStatus("Verso carregado.");
  } catch (error) {
    setStatus("Não foi possível carregar esse verso.");
  }
};

const initializeBooks = () => {
  resetSelect(els.bookSelect);
  state.books.forEach((book) => addOption(els.bookSelect, book.code, book.name));
};

const setupReferenceEvents = () => {
  els.bookSelect.addEventListener("change", async () => {
    fillChapters(els.bookSelect.value);
    await fillVerses(els.bookSelect.value, els.chapterSelect.value);
  });

  els.chapterSelect.addEventListener("change", async () => {
    await fillVerses(els.bookSelect.value, els.chapterSelect.value);
  });

  els.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadVerse(
      els.bookSelect.value,
      Number(els.chapterSelect.value),
      Number(els.verseSelect.value),
    );
  });
};

const loadHealthInfo = async () => {
  if (!els.healthInfo) {
    return;
  }

  try {
    const response = await fetch(`${DATA_ROOT}/health.json`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Falha ao carregar health.json");
    }

    const health = await response.json();
    const generated = health.generatedAt
      ? new Date(health.generatedAt).toLocaleString("pt-BR", { timeZone: "UTC" }) + " UTC"
      : "n/d";

    els.healthInfo.textContent = `Health: ${health.status || "n/d"} | versão ${health.version || "n/d"} | schema ${health.schemaVersion || "n/d"} | atualizado ${generated}`;
  } catch (error) {
    els.healthInfo.textContent = "Health: indisponível";
  }
};

const bootstrap = async () => {
  localStorage.setItem("preferred-lang", "pt");
  initializeTheme();

  try {
    const booksResponse = await fetch(`${DATA_ROOT}/books.json`);
    if (!booksResponse.ok) {
      throw new Error("Não foi possível carregar books.json");
    }

    state.books = await booksResponse.json();
    initializeBooks();

    const fromURL = getRefFromURL();
    const defaultBook = fromURL.book || state.books[0].code;

    els.bookSelect.value = defaultBook;
    fillChapters(defaultBook);

    const chapter = Number(fromURL.chapter || 1);
    els.chapterSelect.value = String(chapter);

    await fillVerses(defaultBook, chapter);

    const verse = Number(fromURL.verse || 1);
    els.verseSelect.value = String(verse);

    setupReferenceEvents();
    await loadHealthInfo();
    await loadVerse(defaultBook, chapter, verse);
  } catch (error) {
    setStatus("Erro ao inicializar o site. Verifique os dados JSON.");
    if (els.healthInfo) {
      els.healthInfo.textContent = "Health: indisponível";
    }
  }
};

bootstrap();

const state = {
  books: [],
};

const LANG_ORDER = [
  { code: "hebrew", fallbackLabel: "Hebrew" },
  { code: "aramaic", fallbackLabel: "Aramaic" },
  { code: "greek", fallbackLabel: "Greek" },
  { code: "latin", fallbackLabel: "Latin" },
  { code: "geez", fallbackLabel: "Ge'ez" },
  { code: "syriac", fallbackLabel: "Syriac" },
  { code: "coptic", fallbackLabel: "Coptic" },
  { code: "armenian", fallbackLabel: "Armenian" },
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
  tokensBody: document.querySelector("#tokens-body"),
  healthInfo: document.querySelector("#health-info"),
  metaByLang: {},
  sourceByLang: {},
};

LANG_ORDER.forEach(({ code }) => {
  els.metaByLang[code] = document.querySelector(`#meta-${code}`);
  els.sourceByLang[code] = document.querySelector(`#source-${code}`);
});

const THEME_KEY = "biblia-theme";
const DATA_ROOT = document.body.dataset.dataRoot || "../data";

const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", normalizedTheme);

  if (!els.themeToggle) {
    return;
  }

  const isDark = normalizedTheme === "dark";
  els.themeToggle.textContent = isDark ? "☀️ Light theme" : "🌙 Dark theme";
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
      throw new Error(`File not found: ${chapterFile}`);
    }

    const chapterData = await response.json();
    chapterData.verses.forEach((verse) => addOption(els.verseSelect, verse, verse));
  } catch (error) {
    setStatus("Could not load verses for this chapter.");
  }
};

const renderTokens = (tokens) => {
  clearBody(els.tokensBody);

  tokens.forEach((token) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${token.langEn || token.lang || "-"}</td>
      <td>${token.surface || "-"}</td>
      <td>${token.transliteration || "-"}</td>
      <td>${token.lemma || "-"}</td>
      <td>${token.strong || "-"}</td>
      <td>${token.morph || "-"}</td>
      <td>${token.manuscriptEn || token.manuscript || "-"}</td>
      <td>${token.enLiteralWord || token.ptLiteralWord || "-"}</td>
      <td>${token.explanationEn || token.explanation || "-"}</td>
    `;
    els.tokensBody.appendChild(tr);
  });
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
    const langEn = token.langEn || lang;
    
    if (!tokensByLang[lang]) {
      tokensByLang[lang] = {
        langEn,
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
    btn.textContent = langData.langEn;
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
      <th>Word</th>
      <th>Original</th>
      <th>Transliteration</th>
      <th>Lemma</th>
      <th>Strong</th>
      <th>Morphology</th>
      <th>Manuscript/Source</th>
      <th>EN literal</th>
      <th>Explanation</th>
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
        <td>${token.manuscriptEn || token.manuscript || "-"}</td>
        <td>${token.enLiteralWord || token.ptLiteralWord || "-"}</td>
        <td>${token.explanationEn || token.explanation || "-"}</td>
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
  clearBody(els.literalSourcesBody);

  entries.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.langEn || entry.lang || "-"}</td>
      <td>${entry.en || "-"}</td>
      <td>${entry.pt || "-"}</td>
    `;
    els.literalSourcesBody.appendChild(tr);
  });
};

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.nameEn || book.name : data.ref.book;
  const translation = data.translation || {};
  const manuscripts = data.manuscripts || {};
  const sourceTexts = data.sourceTexts || {};

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.translationAuthor.textContent = `Literal translation authors: ${translation.authorEn || translation.author || "not provided"}`;
  els.translationSource.textContent = `Translation source texts: ${translation.baseTextEn || translation.baseText || "not provided"}`;
  els.ptVerse.textContent = data.enLiteralVerse || data.ptLiteralVerse || "Literal translation unavailable.";

  LANG_ORDER.forEach(({ code, fallbackLabel }) => {
    const metaEl = els.metaByLang[code];
    const sourceEl = els.sourceByLang[code];
    if (metaEl) {
      metaEl.textContent = manuscripts[`${code}En`] || manuscripts[code] || `Manuscript/source (${fallbackLabel}) not provided.`;
    }
    if (sourceEl) {
      sourceEl.textContent = sourceTexts[code] || "No content.";
    }
  });

  renderLiteralBySource(data.literalTranslations || []);
  renderTokens(data.tokens || []);
  renderTokensByLanguage(data.tokens || []);
};

const loadVerse = async (bookCode, chapter, verse) => {
  setStatus("Loading verse...");

  try {
    const file = `${DATA_ROOT}/verses/${bookCode}.${chapter}.${verse}.json`;
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Verse not found: ${file}`);
    }

    const data = await response.json();
    renderVerse(data);
    updateURL(bookCode, chapter, verse);
    setStatus("Verse loaded.");
  } catch (error) {
    setStatus("Could not load this verse.");
  }
};

const initializeBooks = () => {
  resetSelect(els.bookSelect);
  state.books.forEach((book) => addOption(els.bookSelect, book.code, book.nameEn || book.name));
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
      throw new Error("Failed to load health.json");
    }

    const health = await response.json();
    const generated = health.generatedAt
      ? new Date(health.generatedAt).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC"
      : "n/a";

    els.healthInfo.textContent = `Health: ${health.status || "n/a"} | version ${health.version || "n/a"} | schema ${health.schemaVersion || "n/a"} | updated ${generated}`;
  } catch (error) {
    els.healthInfo.textContent = "Health: unavailable";
  }
};

const bootstrap = async () => {
  localStorage.setItem("preferred-lang", "en");
  initializeTheme();

  try {
    const booksResponse = await fetch(`${DATA_ROOT}/books.json`);
    if (!booksResponse.ok) {
      throw new Error("Could not load books.json");
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
    setStatus("Initialization error. Check JSON files.");
    if (els.healthInfo) {
      els.healthInfo.textContent = "Health: unavailable";
    }
  }
};

bootstrap();

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
const DATA_ROOT = document.body.dataset.dataRoot || "data";

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

const renderTokens = (tokens) => {
  clearBody(els.tokensBody);

  tokens.forEach((token) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${token.langPt || token.lang || "-"}</td>
      <td>${token.surface || "-"}</td>
      <td>${token.transliteration || "-"}</td>
      <td>${token.lemma || "-"}</td>
      <td>${token.strong || "-"}</td>
      <td>${token.morph || "-"}</td>
      <td>${token.manuscript || "-"}</td>
      <td>${token.ptLiteralWord || "-"}</td>
      <td>${token.explanation || "-"}</td>
    `;
    els.tokensBody.appendChild(tr);
  });
};

const renderLiteralBySource = (entries) => {
  clearBody(els.literalSourcesBody);

  entries.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.langPt || entry.lang || "-"}</td>
      <td>${entry.pt || "-"}</td>
      <td>${entry.en || "-"}</td>
    `;
    els.literalSourcesBody.appendChild(tr);
  });
};

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.name : data.ref.book;
  const translation = data.translation || {};
  const manuscripts = data.manuscripts || {};
  const sourceTexts = data.sourceTexts || {};

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.translationAuthor.textContent = `Autor da tradução literal: ${translation.author || "não informado"}`;
  els.translationSource.textContent = `Texto-fonte da tradução: ${translation.baseText || "não informado"}`;
  els.ptVerse.textContent = data.ptLiteralVerse || "Sem tradução literal disponível.";

  LANG_ORDER.forEach(({ code, fallbackLabel }) => {
    const metaEl = els.metaByLang[code];
    const sourceEl = els.sourceByLang[code];
    if (metaEl) {
      metaEl.textContent = manuscripts[code] || `Manuscrito/fonte (${fallbackLabel}) não informado.`;
    }
    if (sourceEl) {
      sourceEl.textContent = sourceTexts[code] || "Sem conteúdo.";
    }
  });

  renderLiteralBySource(data.literalTranslations || []);
  renderTokens(data.tokens || []);
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

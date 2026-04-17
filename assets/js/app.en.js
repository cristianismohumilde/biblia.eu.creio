const state = {
  books: [],
};

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
  metaHebrew: document.querySelector("#meta-hebrew"),
  metaGreek: document.querySelector("#meta-greek"),
  metaAramaic: document.querySelector("#meta-aramaic"),
  metaLatin: document.querySelector("#meta-latin"),
  sourceHebrew: document.querySelector("#source-hebrew"),
  sourceGreek: document.querySelector("#source-greek"),
  sourceAramaic: document.querySelector("#source-aramaic"),
  sourceLatin: document.querySelector("#source-latin"),
  tokensBody: document.querySelector("#tokens-body"),
  healthInfo: document.querySelector("#health-info"),
};

const THEME_KEY = "biblia-theme";
const DATA_ROOT = document.body.dataset.dataRoot || "../data";

const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", normalizedTheme);

  if (!els.themeToggle) {
    return;
  }

  const isDark = normalizedTheme === "dark";
  els.themeToggle.textContent = isDark ? "Enable light theme" : "Enable dark theme";
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

const clearTokens = () => {
  els.tokensBody.innerHTML = "";
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
    chapterData.verses.forEach((verse) => {
      addOption(els.verseSelect, verse, verse);
    });
  } catch (error) {
    setStatus("Could not load verses for this chapter.");
  }
};

const renderTokens = (tokens) => {
  clearTokens();

  tokens.forEach((token) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
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

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.name : data.ref.book;
  const translation = data.translation || {};
  const manuscripts = data.manuscripts || {};

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.translationAuthor.textContent = `Literal translation author: ${translation.authorEn || translation.author || "not provided"}`;
  els.translationSource.textContent = `Translation source text: ${translation.baseTextEn || translation.baseText || "not provided"}`;
  els.ptVerse.textContent = data.enLiteralVerse || data.ptLiteralVerse || "Literal translation unavailable.";

  els.metaHebrew.textContent = manuscripts.hebrewEn || manuscripts.hebrew || "Manuscript/source not provided.";
  els.metaGreek.textContent = manuscripts.greekEn || manuscripts.greek || "Manuscript/source not provided.";
  els.metaAramaic.textContent = manuscripts.aramaicEn || manuscripts.aramaic || "Manuscript/source not provided.";
  els.metaLatin.textContent = manuscripts.latinEn || manuscripts.latin || "Manuscript/source not provided.";

  els.sourceHebrew.textContent = data.sourceTexts.hebrew || "No content.";
  els.sourceGreek.textContent = data.sourceTexts.greek || "No content.";
  els.sourceAramaic.textContent = data.sourceTexts.aramaic || "No content.";
  els.sourceLatin.textContent = data.sourceTexts.latin || "No content.";

  renderTokens(data.tokens || []);
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

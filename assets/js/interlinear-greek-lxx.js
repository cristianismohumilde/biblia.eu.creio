const state = {
  books: [],
  filteredTokens: [],
};

const els = {
  form: document.querySelector("#reference-form"),
  status: document.querySelector("#status"),
  themeToggle: document.querySelector("#theme-toggle"),
  bookSelect: document.querySelector("#book-select"),
  chapterSelect: document.querySelector("#chapter-select"),
  verseSelect: document.querySelector("#verse-select"),
  referenceTitle: document.querySelector("#reference-title"),
  witnessMeta: document.querySelector("#witness-meta"),
  witnessText: document.querySelector("#witness-text"),
  witnessTransliteration: document.querySelector("#witness-transliteration"),
  witnessLiteral: document.querySelector("#witness-literal"),
  statTotal: document.querySelector("#stat-total"),
  statStrong: document.querySelector("#stat-strong"),
  statMorph: document.querySelector("#stat-morph"),
  tokenFilter: document.querySelector("#token-filter"),
  interlinearBody: document.querySelector("#interlinear-body"),
};

const THEME_KEY = "biblia-theme";
const DATA_ROOT = document.body.dataset.dataRoot || "data";
const WITNESS_ID = "lxx";

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
  if (els.status) {
    els.status.textContent = message;
  }
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

const getWitnessFromData = (data) => {
  const literalEntry = (data.literalTranslations || []).find((entry) => entry.lang === "greek");
  const transliterationFromTokens = (data.tokens || [])
    .filter((token) => token.lang === "greek" && token.transliteration && token.transliteration !== "-")
    .map((token) => token.transliteration.trim())
    .filter(Boolean)
    .join(" ");

  const witnessList = Array.isArray(data.greekWitnesses) ? data.greekWitnesses : [];
  const witness = witnessList.find((item) => item.id === WITNESS_ID) || witnessList[0];

  if (witness) {
    return {
      label: witness.label || "Septuaginta (LXX)",
      text: witness.text || data.sourceTexts?.greek || "Sem texto disponível.",
      transliteration:
        witness.transliteration || transliterationFromTokens || "Sem transliteração disponível.",
      literal:
        witness.literalPt ||
        (literalEntry ? literalEntry.pt || "" : "") ||
        "Sem tradução literal disponível.",
    };
  }

  return {
    label: "Septuaginta (LXX)",
    text: data.sourceTexts?.greek || "Sem texto disponível.",
    transliteration: transliterationFromTokens || "Sem transliteração disponível.",
    literal:
      (literalEntry ? literalEntry.pt || "" : "") ||
      "Sem tradução literal disponível.",
  };
};

const getGreekTokens = (data) => {
  const tokens = Array.isArray(data.tokens) ? data.tokens : [];
  return tokens.filter((token) => token.lang === "greek");
};

const renderStats = (tokens) => {
  if (!Array.isArray(tokens)) {
    return;
  }

  const withStrong = tokens.filter((token) => token.strong && token.strong !== "-").length;
  const withMorph = tokens.filter((token) => token.morph && token.morph !== "-").length;

  if(els.statTotal) els.statTotal.textContent = String(tokens.length);
  if(els.statStrong) els.statStrong.textContent = String(withStrong);
  if(els.statMorph) els.statMorph.textContent = String(withMorph);
};

const renderTokenRows = (tokens) => {
  clearBody(els.interlinearBody);

  if (!tokens.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="8">Nenhum token grego disponível para este verso.</td>';
    els.interlinearBody.appendChild(tr);
    return;
  }

  tokens.forEach((token, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${token.id || "-"}</td>
      <td>${token.surface || "-"}</td>
      <td>${token.transliteration || "-"}</td>
      <td>${token.lemma || "-"}</td>
      <td>${token.strong || "-"}</td>
      <td>${token.morph || "-"}</td>
      <td>${token.ptLiteralWord || "-"}</td>
    `;
    els.interlinearBody.appendChild(tr);
  });
};

const applyFilter = () => {
  const query = (els.tokenFilter.value || "").trim().toLowerCase();
  if (!query) {
    renderTokenRows(state.filteredTokens);
    return;
  }

  const filtered = state.filteredTokens.filter((token) => {
    const haystack = [
      token.id,
      token.surface,
      token.transliteration,
      token.lemma,
      token.strong,
      token.morph,
      token.ptLiteralWord,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  renderTokenRows(filtered);
};

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.name : data.ref.book;
  const witness = getWitnessFromData(data);
  const tokens = getGreekTokens(data);

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.witnessMeta.textContent = "Septuaginta (LXX)";
  els.witnessText.textContent = witness.text;
  els.witnessTransliteration.textContent = witness.transliteration;
  els.witnessLiteral.textContent = witness.literal;

  state.filteredTokens = tokens;
  renderStats(tokens);
  applyFilter();
};

const loadVerse = async (bookCode, chapter, verse) => {
  setStatus("Carregando interlinear...");

  try {
    const file = `${DATA_ROOT}/verses/${bookCode}.${chapter}.${verse}.json`;
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Verso não encontrado: ${file}`);
    }

    const data = await response.json();
    renderVerse(data);
    updateURL(bookCode, chapter, verse);
    setStatus("Interlinear carregado.");
  } catch (error) {
    setStatus("Não foi possível carregar esse verso.");
    clearBody(els.interlinearBody);
  }
};

const initializeBooks = () => {
  resetSelect(els.bookSelect);
  state.books.forEach((book) => addOption(els.bookSelect, book.code, book.name));
};

const setupEvents = () => {
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

  els.tokenFilter.addEventListener("input", applyFilter);
};

const bootstrap = async () => {
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

    setupEvents();
    await loadVerse(defaultBook, chapter, verse);
  } catch (error) {
    setStatus("Erro ao inicializar o interlinear. Verifique os dados JSON.");
  }
};

bootstrap();

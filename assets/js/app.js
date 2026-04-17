const state = {
  books: [],
};

const els = {
  form: document.querySelector("#reference-form"),
  status: document.querySelector("#status"),
  bookSelect: document.querySelector("#book-select"),
  chapterSelect: document.querySelector("#chapter-select"),
  verseSelect: document.querySelector("#verse-select"),
  referenceTitle: document.querySelector("#reference-title"),
  ptVerse: document.querySelector("#pt-verse"),
  sourceHebrew: document.querySelector("#source-hebrew"),
  sourceGreek: document.querySelector("#source-greek"),
  sourceAramaic: document.querySelector("#source-aramaic"),
  sourceLatin: document.querySelector("#source-latin"),
  tokensBody: document.querySelector("#tokens-body"),
  healthInfo: document.querySelector("#health-info"),
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
  const chapterFile = `data/books/${bookCode}/chapters/${chapter}.json`;

  try {
    const response = await fetch(chapterFile);
    if (!response.ok) {
      throw new Error(`Arquivo não encontrado: ${chapterFile}`);
    }

    const chapterData = await response.json();
    chapterData.verses.forEach((verse) => {
      addOption(els.verseSelect, verse, verse);
    });
  } catch (error) {
    setStatus("Não foi possível carregar os versos desse capítulo.");
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
      <td>${token.ptLiteralWord || "-"}</td>
      <td>${token.explanation || "-"}</td>
    `;
    els.tokensBody.appendChild(tr);
  });
};

const renderVerse = (data) => {
  const book = state.books.find((item) => item.code === data.ref.book);
  const bookName = book ? book.name : data.ref.book;

  els.referenceTitle.textContent = `${bookName} ${data.ref.chapter}:${data.ref.verse}`;
  els.ptVerse.textContent = data.ptLiteralVerse || "Sem tradução literal disponível.";

  els.sourceHebrew.textContent = data.sourceTexts.hebrew || "Sem conteúdo.";
  els.sourceGreek.textContent = data.sourceTexts.greek || "Sem conteúdo.";
  els.sourceAramaic.textContent = data.sourceTexts.aramaic || "Sem conteúdo.";
  els.sourceLatin.textContent = data.sourceTexts.latin || "Sem conteúdo.";

  renderTokens(data.tokens || []);
};

const loadVerse = async (bookCode, chapter, verse) => {
  setStatus("Carregando verso...");

  try {
    const file = `data/verses/${bookCode}.${chapter}.${verse}.json`;
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
    const response = await fetch("data/health.json", { cache: "no-store" });
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
  try {
    const booksResponse = await fetch("data/books.json");
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

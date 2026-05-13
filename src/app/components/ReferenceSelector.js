"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const otCodes = ['gen', 'exo', 'lev', 'num', 'deu', 'jos', 'jdg', 'rut', '1sa', '2sa', '1ki', '2ki', '1ch', '2ch', 'ezr', 'neh', 'est', 'job', 'psa', 'pro', 'ecc', 'sng', 'isa', 'jer', 'lam', 'ezk', 'dan', 'hos', 'jol', 'amo', 'oba', 'jon', 'mic', 'nah', 'hab', 'zph', 'hag', 'zec', 'mal'];
const ntCodes = ['mat', 'mrk', 'luk', 'jhn', 'act', 'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm', 'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'];

export default function ReferenceSelector({ lang, t, isInterlinear, manuscript, onSelect, initialBook, initialChapter, initialVerse }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(initialBook || "");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter || "");
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState(initialVerse || "");
  const router = useRouter();

  useEffect(() => {
    fetch("/data/books.json")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  }, []);

  useEffect(() => {
    if (books.length === 0) return;
    
    const bookToUse = initialBook || books[0].code;
    setSelectedBook(bookToUse);
    setSelectedChapter(initialChapter || "1");
    setSelectedVerse(initialVerse || "1");
    updateChapters(books, bookToUse, initialChapter || "1", initialVerse || "1");
  }, [books, initialBook, initialChapter, initialVerse]);


  const updateChapters = (allBooks, bookCode, targetChapter = "1", targetVerse = "1") => {
    const book = allBooks.find((b) => b.code === bookCode);
    if (book) {
      const chaps = Array.from({ length: book.chapters }, (_, i) => i + 1);
      setChapters(chaps);
      setSelectedChapter(targetChapter);
      updateVerses(bookCode, targetChapter, targetVerse);
    }
  };

  const [lastFetched, setLastFetched] = useState({ book: "", chapter: "" });

  const updateVerses = (bookCode, chapter, targetVerse = "1") => {
    if (lastFetched.book === bookCode && lastFetched.chapter === chapter) {
      setSelectedVerse(targetVerse);
      return;
    }

    fetch(`/data/verses/${bookCode}.${chapter}.json`)
      .then((res) => res.json())
      .then((data) => {
        const verseNumbers = data.verses.map(v => v.ref.verse.toString());
        setVerses(verseNumbers);
        setSelectedVerse(targetVerse);
        setLastFetched({ book: bookCode, chapter: chapter });
      })
      .catch(err => console.error("Erro ao carregar lista de versos:", err));
  };


  const handleBookChange = (e) => {
    const code = e.target.value;
    setSelectedBook(code);
    updateChapters(books, code);
  };

  const handleChapterChange = (e) => {
    const chap = e.target.value;
    setSelectedChapter(chap);
    updateVerses(selectedBook, chap);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInterlinear) {
      // Update URL with new verse on interlinear page (using query param for verse)
      const url = `/${lang}/interlinear/${manuscript}/${selectedBook}/${selectedChapter}?v=${selectedVerse}`;
      router.push(url);
    } else if (onSelect) {
      // Update home page content
      onSelect(selectedBook, selectedChapter, selectedVerse);
    }
  };

  const otBooks = books.filter(b => otCodes.includes(b.code));
  const ntBooks = books.filter(b => ntCodes.includes(b.code));
  const dcBooks = books.filter(b => !otCodes.includes(b.code) && !ntCodes.includes(b.code));

  return (
    <section className="card controls" aria-labelledby="controles-titulo">
      <h2 id="controles-titulo">{t.selectReference}</h2>
      <form onSubmit={handleSubmit} id="reference-form">
        <label>
          {t.book}
          <select value={selectedBook} onChange={handleBookChange} name="book">
            {otBooks.length > 0 && (
              <optgroup label={t.ot}>
                {otBooks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {lang === 'pt' ? b.name : b.nameEn}
                  </option>
                ))}
              </optgroup>
            )}
            {dcBooks.length > 0 && (
              <optgroup label={t.dc}>
                {dcBooks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {lang === 'pt' ? b.name : b.nameEn}
                  </option>
                ))}
              </optgroup>
            )}
            {ntBooks.length > 0 && (
              <optgroup label={t.nt}>
                {ntBooks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {lang === 'pt' ? b.name : b.nameEn}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
        <label>
          {t.chapter}
          <select value={selectedChapter} onChange={handleChapterChange} name="chapter">
            {chapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.verse}
          <select value={selectedVerse} onChange={(e) => setSelectedVerse(e.target.value)} name="verse">
            {verses.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{isInterlinear ? t.loadVerse : t.loadVerse}</button>
      </form>
    </section>
  );
}

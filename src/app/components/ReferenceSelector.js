"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        if (data.length > 0) {
          const bookToUse = initialBook || data[0].code;
          setSelectedBook(bookToUse);
          setSelectedChapter(initialChapter || "1");
          setSelectedVerse(initialVerse || "1");
          updateChapters(data, bookToUse, initialChapter || "1", initialVerse || "1");
        }
      });
  }, [initialBook, initialChapter, initialVerse]);

  const updateChapters = (allBooks, bookCode, targetChapter = "1", targetVerse = "1") => {
    const book = allBooks.find((b) => b.code === bookCode);
    if (book) {
      const chaps = Array.from({ length: book.chapters }, (_, i) => i + 1);
      setChapters(chaps);
      setSelectedChapter(targetChapter);
      updateVerses(bookCode, targetChapter, targetVerse);
    }
  };

  const updateVerses = (bookCode, chapter, targetVerse = "1") => {
    fetch(`/data/books/${bookCode}/chapters/${chapter}.json`)
      .then((res) => res.json())
      .then((data) => {
        setVerses(data.verses);
        setSelectedVerse(targetVerse);
      });
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

  return (
    <section className="card controls" aria-labelledby="controles-titulo">
      <h2 id="controles-titulo">{t.selectReference}</h2>
      <form onSubmit={handleSubmit} id="reference-form">
        <label>
          {t.book}
          <select value={selectedBook} onChange={handleBookChange} name="book">
            {books.map((b) => (
              <option key={b.code} value={b.code}>
                {lang === 'pt' ? b.name : b.nameEn}
              </option>
            ))}
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

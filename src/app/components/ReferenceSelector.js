"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferenceSelector({ lang, t, isInterlinear, manuscript, onSelect }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/biblia.eu.creio/data/books.json")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        if (data.length > 0) {
          const firstBook = data[0].code;
          setSelectedBook(firstBook);
          updateChapters(data, firstBook);
        }
      });
  }, []);

  const updateChapters = (allBooks, bookCode) => {
    const book = allBooks.find((b) => b.code === bookCode);
    if (book) {
      const chaps = Array.from({ length: book.chapters }, (_, i) => i + 1);
      setChapters(chaps);
      setSelectedChapter("1");
      updateVerses(bookCode, 1);
    }
  };

  const updateVerses = (bookCode, chapter) => {
    fetch(`/biblia.eu.creio/data/books/${bookCode}/chapters/${chapter}.json`)
      .then((res) => res.json())
      .then((data) => {
        setVerses(data.verses);
        setSelectedVerse(data.verses[0]);
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
      // Update URL with new verse on interlinear page
      const url = `/${lang}/interlinear/${manuscript}/?book=${selectedBook}&chapter=${selectedChapter}&verse=${selectedVerse}`;
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
                {b.name}
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

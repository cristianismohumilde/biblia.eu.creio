"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "./ReferenceSelector";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { handleSpeak } from "@/app/utils/audio";

const manuscriptLabels = {
  pt: {
    b19a: "Codex Leningradensis (B19A)",
    lxx: "Septuaginta (LXX)",
    byzantine: "Tradição Bizantina",
    targum: "Targum Onkelos",
    vulgate: "Vulgata",
    syriac: "Peshitta",
    geez: "Tradição Etíope Clássica",
    coptic: "Copta",
    armenian: "Armênio"
  },
  en: {
    b19a: "Codex Leningradensis (B19A)",
    lxx: "Septuagint (LXX)",
    byzantine: "Byzantine Tradition",
    targum: "Targum Onkelos",
    vulgate: "Vulgate",
    syriac: "Peshitta",
    geez: "Classical Ethiopic Tradition",
    coptic: "Coptic",
    armenian: "Armenian"
  }
};

const morphTranslations = {
  en: {
    "verbo": "Verb", "subst": "Noun", "substantivo": "Noun", "marcador": "Marker",
    "artigo": "Article", "particípio": "participle", "advérbio": "adverb",
    "adjetivo": "adjective", "pronome": "pronoun", "preposição": "preposition",
    "conjunção": "conjunction", "numeral": "numeral", "interjeição": "interjection", "conj": "Conj"
  }
};

const formatMorph = (morph, lang) => {
  if (!morph || lang === 'pt' || !morphTranslations[lang]) return morph;
  let result = morph;
  const dict = morphTranslations[lang];
  Object.entries(dict).forEach(([pt, en]) => {
    const regex = new RegExp(`\\b${pt}\\b`, 'gi');
    result = result.replace(regex, en);
  });
  return result;
};

const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

function InterlinearContent({ lang, manuscript, initialBook, initialChapter, initialVerse }) {
  const t = translations[lang] || translations.pt;
  const searchParams = useSearchParams();

  const book = initialBook || searchParams.get("book") || "gen";
  const chapter = initialChapter || searchParams.get("chapter") || "1";
  const verse = searchParams.get("v") || initialVerse || "1";

  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/data/books.json")
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!book || !chapter) return;
    const filePath = `/data/verses/${book.toLowerCase()}.${chapter}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Capítulo não encontrado");
        return res.json();
      })
      .then((json) => {
        if (!json.verses) throw new Error("Formato de capítulo inválido");
        setChapterData(json);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao carregar capítulo:", err);
        setError(err.message);
      });
  }, [book, chapter]);

  useEffect(() => {
    if (!chapterData) return;
    const vNum = parseInt(verse);
    let verseData;
    if (vNum > 500) {
      verseData = chapterData.verses[chapterData.verses.length - 1];
    } else {
      verseData = chapterData.verses.find(v => v.verse === vNum) || chapterData.verses[0];
    }
    setData(verseData);
  }, [chapterData, verse]);

  const navigation = useMemo(() => {
    if (!books.length || !chapterData) return { prev: null, next: null };
    const vNum = parseInt(verse);
    const totalVerses = chapterData.verses.length;
    const cNum = parseInt(chapter);
    const currentBookIndex = books.findIndex(b => b.code.toLowerCase() === book.toLowerCase());
    const currentBook = books[currentBookIndex];

    let prev = null;
    let next = null;

    if (vNum > 1) {
      prev = `/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${vNum - 1}`;
    } else if (cNum > 1) {
      prev = `/${lang}/interlinear/${manuscript}/${book}/${cNum - 1}?v=999`;
    } else if (currentBookIndex > 0) {
      const prevBook = books[currentBookIndex - 1];
      prev = `/${lang}/interlinear/${manuscript}/${prevBook.code}/${prevBook.chapters}?v=999`;
    }

    if (vNum < totalVerses) {
      next = `/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${vNum + 1}`;
    } else if (currentBook && cNum < currentBook.chapters) {
      next = `/${lang}/interlinear/${manuscript}/${book}/${cNum + 1}?v=1`;
    } else if (currentBookIndex < books.length - 1) {
      const nextBook = books[currentBookIndex + 1];
      next = `/${lang}/interlinear/${manuscript}/${nextBook.code}/1?v=1`;
    }
    return { prev, next };
  }, [books, chapterData, book, chapter, verse, lang, manuscript]);

  const langMap = {
    b19a: "hebrew", lxx: "greek", byzantine: "greek", targum: "aramaic",
    vulgate: "latin", syriac: "syriac", coptic: "coptic", armenian: "armenian", geez: "geez"
  };
  const targetLang = langMap[manuscript] || "hebrew";

  const filteredTokens = useMemo(() => {
    if (!data || !data.tokens) return [];
    const tokens = data.tokens.filter(tk => tk.lang === targetLang);
    if (!filter) return tokens;
    const query = filter.toLowerCase();
    return tokens.filter(tk => {
      const haystack = [tk.surface, tk.transliteration, tk.lemma, tk.strong, tk.bdb, tk.lsj, tk.bedrossian, tk.lexicon, tk.cal, tk.morph, tk.ptLiteralWord]
        .filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [data, targetLang, filter]);

  const stats = useMemo(() => {
    if (!data || !data.tokens) return { total: 0, withStrong: 0, withBdb: 0, withLsj: 0, withBedrossian: 0, withBrockelmann: 0, withLexicon: 0, withMorph: 0 };
    const tokens = data.tokens.filter(tk => tk.lang === targetLang);
    const hasValue = (value) => value && value !== "-";
    return {
      total: tokens.length,
      withStrong: tokens.filter(tk => tk.strong && tk.strong !== "-").length,
      withBdb: tokens.filter(tk => tk.bdb && tk.bdb !== "-").length,
      withLsj: tokens.filter(tk => tk.lsj && tk.lsj !== "-").length,
      withBedrossian: tokens.filter(tk => hasValue(tk.bedrossian) || hasValue(tk.lexicon) || hasValue(tk.strong)).length,
      withBrockelmann: tokens.filter(tk => hasValue(tk.brockelmann) || hasValue(tk.lexicon) || hasValue(tk.strong)).length,
      withLexicon: tokens.filter(tk => (tk.lexicon && tk.lexicon !== "-") || (tk.strong && tk.strong !== "-") || (tk.bdb && tk.bdb !== "-") || (tk.cal && tk.cal !== "-") || (tk.bedrossian && tk.bedrossian !== "-") || (tk.brockelmann && tk.brockelmann !== "-")).length,
      withMorph: tokens.filter(tk => tk.morph && tk.morph !== "-").length
    };
  }, [data, targetLang]);

  if (error) return <div className="card"><h2>Erro</h2><p>{error}</p></div>;
  if (!data) return <div className="card"><p>{t.loading}</p></div>;

  const witnessData = (() => {
    const witnesses = data[`${targetLang}Witnesses`] || [];
    let w = witnesses.find(item => item.id === manuscript || item.id === "base") || witnesses[0];
    const literalEntry = (data.literalTranslations || []).find(e => e.lang === targetLang);
    const translit = (data.tokens || [])
      .filter(tk => tk.lang === targetLang && tk.transliteration && tk.transliteration !== "-")
      .map(tk => tk.transliteration.trim()).filter(Boolean).join(" ");

    return {
      label: w?.label || (manuscriptLabels[lang] ? manuscriptLabels[lang][manuscript] : manuscript.toUpperCase()),
      text: w?.text || data.sourceTexts?.[targetLang] || data[`${targetLang}Text`],
      transliteration: w?.transliteration || translit,
      literal: w?.literalPt || literalEntry?.pt || data.ptLiteralVerse
    };
  })();

  const lexiconHeader = (() => {
    if (manuscript === "geez") return t.geezLexicon;
    if (manuscript === "vulgate") return t.latinLexicon;
    if (manuscript === "coptic") return t.copticLexicon;
    if (manuscript === "targum") return t.aramaicLexicon;
    if (manuscript === "armenian") return t.armenianLexicon;
    if (manuscript === "syriac") return t.syriacLexicon;
    return t.lexiconStrong;
  })();

  return (
    <>
      <header className="site-header">
        <div>
          <p className="brand-eyebrow">{manuscriptLabels[lang][manuscript] || manuscript.toUpperCase()}</p>
          <h1>{t.interlinearTitle}</h1>
          <p className="subtitle">{t.interlinearSubtitle}</p>
        </div>
        <nav className="quick-nav">
          <Link href={`/${lang}/`}>{t.backToIndex}</Link>
          <Link href={`/${lang}/atualizacoes-e-novidades`} className="nav-updates">{t.updates}</Link>
          <Link href={`/${lang}/fontes`}>{t.sources}</Link>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle t={t} />
        </nav>
      </header>

      <div className="layout">
        <ReferenceSelector lang={lang} t={t} isInterlinear manuscript={manuscript} initialBook={book} initialChapter={chapter} initialVerse={verse} />

        <section className="card" id="visao-geral">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>{t.verseVision}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {navigation.prev && (
                <Link href={navigation.prev} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  ⬅ {lang === 'en' ? 'Previous' : 'Anterior'}
                </Link>
              )}
              {navigation.next && (
                <Link href={navigation.next} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  {lang === 'en' ? 'Next' : 'Próximo'} ➡
                </Link>
              )}
            </div>
          </div>
          <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
          <p className="translation-meta">{witnessData.label}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.2rem', marginBottom: '0.5rem' }}>
            <p className="text-witness-label" style={{ margin: 0 }}>{t.manuscriptText}</p>
            <button 
              onClick={() => handleSpeak(witnessData.text, targetLang)} 
              className="audio-player-mini"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              {lang === 'pt' ? "OUVIR" : "LISTEN"}
            </button>
          </div>

          <blockquote className={`verse ${RTL_LANGS.has(targetLang) ? 'rtl' : ''}`} style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>
            {witnessData.text}
          </blockquote>

          <p className="text-witness-label">{t.transliteration}</p>
          <p className="text-witness-transliteration" style={{ fontSize: '1.1rem', opacity: 0.8 }}>{witnessData.transliteration}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.2rem', marginBottom: '0.5rem' }}>
            <p className="text-witness-label" style={{ margin: 0 }}>{t.literalTranslationLabel}</p>
            <button 
              onClick={() => handleSpeak(witnessData.literal, lang)} 
              className="audio-player-mini"
              style={{ background: 'rgba(204, 154, 88, 0.1)', borderColor: 'rgba(204, 154, 88, 0.25)', color: '#cc9a58' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              {lang === 'pt' ? "OUVIR" : "LISTEN"}
            </button>
          </div>
          <p className="text-witness-literal" style={{ fontSize: '1.15rem', fontWeight: 500 }}>{witnessData.literal}</p>
        </section>

        <section className="card">
          <h2>{t.linguisticSummary}</h2>
          <div className="interlinear-stats-grid">
            <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.tokensTotal}</p><p className="interlinear-stat-value">{stats.total}</p></article>
            {targetLang === "hebrew" ? (
              <>
                <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.withStrong}</p><p className="interlinear-stat-value">{stats.withStrong}</p></article>
                <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.withBdb}</p><p className="interlinear-stat-value">{stats.withBdb}</p></article>
              </>
            ) : targetLang === "greek" ? (
              <>
                <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.withStrong}</p><p className="interlinear-stat-value">{stats.withStrong}</p></article>
                <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.withLsj}</p><p className="interlinear-stat-value">{stats.withLsj}</p></article>
              </>
            ) : (
              <article className="interlinear-stat-card"><p className="interlinear-stat-label">{lexiconHeader}</p><p className="interlinear-stat-value">{stats.withLexicon}</p></article>
            )}
            <article className="interlinear-stat-card"><p className="interlinear-stat-label">{t.withMorphology}</p><p className="interlinear-stat-value">{stats.withMorph}</p></article>
          </div>
        </section>

        <section className="card" id="tabela-interlinear">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>{t.detailedTable}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {navigation.prev && <Link href={navigation.prev} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>⬅ {lang === 'en' ? 'Previous' : 'Anterior'}</Link>}
              {navigation.next && <Link href={navigation.next} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>{lang === 'en' ? 'Next' : 'Próximo'} ➡</Link>}
            </div>
          </div>
          <label className="interlinear-filter">
            {t.searchPlaceholder}
            <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={lang === 'pt' ? 'Ex.: Elohim, H430, bara' : 'Ex.: Elohim, H430, bara'} />
          </label>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>{t.id}</th><th>{t.original}</th><th>{t.transliteration}</th><th>{t.lemma}</th>
                  {targetLang === "hebrew" ? (<><th>Strong</th><th>BDB</th></>) : targetLang === "greek" ? (<><th>Strong</th><th>LSJ</th></>) : (<th>{lexiconHeader}</th>)}
                  <th>{t.morphology}</th><th>{t.literalTranslationLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token, idx) => (
                  <tr key={token.id || idx}>
                    <td>{idx + 1}</td><td>{token.id}</td><td className={RTL_LANGS.has(targetLang) ? 'rtl' : ''}>{token.surface}</td><td>{token.transliteration}</td><td>{token.lemma}</td>
                    {targetLang === "hebrew" ? (<><td>{token.strong}</td><td>{token.bdb}</td></>) : targetLang === "greek" ? (<><td>{token.strong}</td><td>{token.lsj}</td></>) : (<td>{token.lexicon || token.strong || "-"}</td>)}
                    <td>{formatMorph(token.morph, lang)}</td><td>{lang === 'pt' ? token.ptLiteralWord : token.enLiteralWord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default function InterlinearClient(props) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <InterlinearContent {...props} />
    </Suspense>
  );
}

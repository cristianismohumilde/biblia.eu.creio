"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "./ReferenceSelector";
import ThemeToggle from "./ThemeToggle";
import { FlagBR, FlagUS } from "./FlagIcon";

const manuscriptLabels = {
  pt: {
    b19a: "Codex Leningradensis (B19A)",
    aleppo: "Aleppo Codex (A)",
    qumran: "Qumran (4QGen)",
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
    aleppo: "Aleppo Codex (A)",
    qumran: "Qumran (4QGen)",
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

const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

function InterlinearContent({ lang, manuscript, initialBook, initialChapter, initialVerse }) {
  const t = translations[lang] || translations.pt;
  const searchParams = useSearchParams();

  const book = initialBook || searchParams.get("book") || "gen";
  const chapter = initialChapter || searchParams.get("chapter") || "1";
  const verse = initialVerse || searchParams.get("verse") || "1";

  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const filePath = `/data/verses/${book.toLowerCase()}.${chapter}.${verse}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Verso não encontrado");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, [book, chapter, verse]);

  const langMap = {
    b19a: "hebrew",
    aleppo: "hebrew",
    qumran: "hebrew",
    lxx: "greek",
    byzantine: "greek",
    targum: "aramaic",
    vulgate: "latin",
    syriac: "syriac",
    coptic: "coptic",
    armenian: "armenian",
    geez: "geez"
  };
  const targetLang = langMap[manuscript] || "hebrew";

  const filteredTokens = useMemo(() => {
    if (!data || !data.tokens) return [];
    const tokens = data.tokens.filter(tk => tk.lang === targetLang);
    if (!filter) return tokens;
    const query = filter.toLowerCase();
    return tokens.filter(tk => {
      const haystack = [tk.surface, tk.transliteration, tk.lemma, tk.strong, tk.lexicon, tk.cal, tk.morph, tk.ptLiteralWord]
        .filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [data, targetLang, filter]);

  const stats = useMemo(() => {
    if (!data || !data.tokens) return { total: 0, withLexicon: 0, withMorph: 0 };
    const tokens = data.tokens.filter(tk => tk.lang === targetLang);
    return {
      total: tokens.length,
      withLexicon: tokens.filter(tk => (tk.lexicon && tk.lexicon !== "-") || (tk.strong && tk.strong !== "-") || (tk.cal && tk.cal !== "-")).length,
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

    if (w) {
      return {
        label: w.label || manuscriptLabels[lang][manuscript],
        text: w.text || data.sourceTexts?.[targetLang],
        transliteration: w.transliteration || translit,
        literal: w.literalPt || literalEntry?.pt
      };
    }
    return {
      label: manuscriptLabels[lang][manuscript],
      text: data.sourceTexts?.[targetLang],
      transliteration: translit,
      literal: literalEntry?.pt
    };
  })();

  const lexiconHeader = (() => {
    if (manuscript === "geez") return t.geezLexicon;
    if (manuscript === "vulgate") return t.latinLexicon;
    if (manuscript === "coptic") return t.copticLexicon;
    if (manuscript === "targum") return t.aramaicLexicon;
    if (targetLang === "hebrew" || targetLang === "greek") return t.lexiconStrong;
    return t.lexiconLabel;
  })();

  const lexiconStatLabel = (() => {
    if (manuscript === "targum") return t.withCal;
    if (manuscript === "geez" || manuscript === "vulgate" || manuscript === "coptic") return t.withLexicon;
    return t.withStrong;
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
          <a href="#tabela-interlinear">{t.detailedTable}</a>
          <div className="lang-switcher">
            <Link href="/pt/" className={lang === 'pt' ? 'active' : ''} aria-label="Português">
              <FlagBR /> <span className="desktop-only">PT</span>
            </Link>
            <Link href="/en/" className={lang === 'en' ? 'active' : ''} aria-label="English">
              <FlagUS /> <span className="desktop-only">EN</span>
            </Link>
          </div>
          <ThemeToggle t={t} />
        </nav>
      </header>

      <div className="layout">
        <ReferenceSelector lang={lang} t={t} isInterlinear manuscript={manuscript} />

        <section className="card" id="visao-geral">
          <h2>{t.verseVision}</h2>
          <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
          <p className="translation-meta">{witnessData.label}</p>

          <p className="text-witness-label">{t.manuscriptText}</p>
          <blockquote className={`verse ${RTL_LANGS.has(targetLang) ? 'rtl' : ''}`}>
            {witnessData.text}
          </blockquote>

          <p className="text-witness-label">{t.transliteration}</p>
          <p className="text-witness-transliteration">{witnessData.transliteration}</p>

          <p className="text-witness-label">{t.literalTranslationLabel}</p>
          <p className="text-witness-literal">{witnessData.literal}</p>
        </section>

        <section className="card">
          <h2>{t.linguisticSummary}</h2>
          <div className="interlinear-stats-grid">
            <article className="interlinear-stat-card">
              <p className="interlinear-stat-label">{t.tokensTotal}</p>
              <p className="interlinear-stat-value">{stats.total}</p>
            </article>
            <article className="interlinear-stat-card">
              <p className="interlinear-stat-label">{lexiconStatLabel}</p>
              <p className="interlinear-stat-value">{stats.withLexicon}</p>
            </article>
            <article className="interlinear-stat-card">
              <p className="interlinear-stat-label">{t.withMorphology}</p>
              <p className="interlinear-stat-value">{stats.withMorph}</p>
            </article>
          </div>
        </section>

        <section className="card" id="tabela-interlinear">
          <h2>{t.detailedTable}</h2>
          <label className="interlinear-filter">
            {t.searchPlaceholder}
            <input 
              type="search" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              placeholder={lang === 'pt' ? 'Ex.: Elohim, H430, bara' : 'Ex.: Elohim, H430, bara'} 
            />
          </label>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.id}</th>
                  <th>{t.original}</th>
                  <th>{t.transliteration}</th>
                  <th>{t.lemma}</th>
                  <th>{lexiconHeader}</th>
                  <th>{t.morphology}</th>
                  <th>{t.literalTranslationLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token, idx) => (
                  <tr key={token.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{token.id}</td>
                    <td className={RTL_LANGS.has(targetLang) ? 'rtl' : ''}>
                      {token.surface}
                    </td>
                    <td>{token.transliteration}</td>
                    <td>{token.lemma}</td>
                    <td>{token.lexicon || token.strong || token.cal || "-"}</td>
                    <td>{token.morph}</td>
                    <td>{lang === 'pt' ? token.ptLiteralWord : token.enLiteralWord}</td>
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

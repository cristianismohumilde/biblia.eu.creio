"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "./ReferenceSelector";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { handleSpeak, SpeakerIcon } from "@/app/utils/audio";


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
    "verbo": "Verb",
    "subst": "Noun",
    "substantivo": "Noun",
    "marcador": "Marker",
    "artigo": "Article",
    "particípio": "participle",
    "advérbio": "adverb",
    "adjetivo": "adjective",
    "pronome": "pronoun",
    "preposição": "preposition",
    "conjunção": "conjunction",
    "numeral": "numeral",
    "interjeição": "interjection",
    "conj": "Conj"
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
  // Prioriza o verso da URL (?v=1), depois o inicial, senão 1
  const verse = searchParams.get("v") || initialVerse || "1";

  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  const [chapterData, setChapterData] = useState(null);



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
    const verseData = chapterData.verses.find(v => v.verse === vNum);
    if (!verseData) {
      setData(chapterData.verses[0]);
    } else {
      setData(verseData);
    }
  }, [chapterData, verse]);


  const langMap = {
    b19a: "hebrew",
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

    if (w) {
      return {
        label: w.label || (manuscriptLabels[lang] ? manuscriptLabels[lang][manuscript] : manuscript.toUpperCase()),
        text: w.text || data.sourceTexts?.[targetLang] || data[`${targetLang}Text`],
        transliteration: w.transliteration || translit,
        literal: w.literalPt || literalEntry?.pt || data.ptLiteralVerse
      };
    }
    const tokenWithMs = data.tokens?.find(tk => tk.lang === targetLang);
    return {
      label: (manuscriptLabels[lang] ? manuscriptLabels[lang][manuscript] : manuscript.toUpperCase()) || 
             (tokenWithMs?.[lang === 'en' ? 'manuscriptEn' : 'manuscript']),
      text: data.sourceTexts?.[targetLang] || data[`${targetLang}Text`],
      transliteration: translit,
      literal: literalEntry?.pt || data.ptLiteralVerse
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
  const lexiconStatLabel = lexiconHeader;

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

          <a href="#tabela-interlinear">{t.detailedTable}</a>
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
              {parseInt(verse) > 1 && (
                <Link href={`/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${parseInt(verse) - 1}`} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  ⬅ {lang === 'en' ? 'Previous' : 'Anterior'}
                </Link>
              )}
              <Link href={`/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${parseInt(verse) + 1}`} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                {lang === 'en' ? 'Next' : 'Próximo'} ➡
              </Link>
            </div>
          </div>
          <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
          <p className="translation-meta">{witnessData.label}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1rem', marginBottom: '0.3rem' }}>
            <p className="text-witness-label" style={{ margin: 0 }}>{t.manuscriptText}</p>
            <button 
              onClick={() => handleSpeak(witnessData.text, targetLang)} 
              className="support-cta" 
              style={{ 
                padding: '0.2rem 0.6rem', 
                fontSize: '0.7rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                height: 'auto',
                boxShadow: 'none'
              }}
            >
              🔊 {lang === 'pt' ? "OUVIR" : "LISTEN"}
            </button>
          </div>

          <blockquote className={`verse ${RTL_LANGS.has(targetLang) ? 'rtl' : ''}`}>
            {witnessData.text}
          </blockquote>

          <p className="text-witness-label">{t.transliteration}</p>
          <p className="text-witness-transliteration">{witnessData.transliteration}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1rem', marginBottom: '0.3rem' }}>
            <p className="text-witness-label" style={{ margin: 0 }}>{t.literalTranslationLabel}</p>
            <button 
              onClick={() => handleSpeak(witnessData.literal, lang)} 
              className="support-cta" 
              style={{ 
                padding: '0.2rem 0.6rem', 
                fontSize: '0.7rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                height: 'auto',
                boxShadow: 'none',
                background: 'linear-gradient(120deg, #cc9a58, #e0b37a)' // Cor dourada para diferenciar
              }}
            >
              🔊 {lang === 'pt' ? "OUVIR" : "LISTEN"}
            </button>
          </div>

          <p className="text-witness-literal">{witnessData.literal}</p>

        </section>

        <section className="card">
          <h2>{t.linguisticSummary}</h2>
          <div className="interlinear-stats-grid">
            <article className="interlinear-stat-card">
              <p className="interlinear-stat-label">{t.tokensTotal}</p>
              <p className="interlinear-stat-value">{stats.total}</p>
            </article>
            {targetLang === "hebrew" ? (
              <>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withStrong}</p>
                  <p className="interlinear-stat-value">{stats.withStrong}</p>
                </article>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withBdb}</p>
                  <p className="interlinear-stat-value">{stats.withBdb}</p>
                </article>
              </>
            ) : targetLang === "greek" ? (
              <>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withStrong}</p>
                  <p className="interlinear-stat-value">{stats.withStrong}</p>
                </article>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withLsj}</p>
                  <p className="interlinear-stat-value">{stats.withLsj}</p>
                </article>
              </>
            ) : targetLang === "armenian" ? (
              <>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withBedrossian}</p>
                  <p className="interlinear-stat-value">{stats.withBedrossian}</p>
                </article>
              </>
            ) : targetLang === "syriac" ? (
              <>
                <article className="interlinear-stat-card">
                  <p className="interlinear-stat-label">{t.withBrockelmann}</p>
                  <p className="interlinear-stat-value">{stats.withBrockelmann}</p>
                </article>
              </>
            ) : (
              <article className="interlinear-stat-card">
                <p className="interlinear-stat-label">{lexiconStatLabel}</p>
                <p className="interlinear-stat-value">{stats.withLexicon}</p>
              </article>
            )}
            <article className="interlinear-stat-card">
              <p className="interlinear-stat-label">{t.withMorphology}</p>
              <p className="interlinear-stat-value">{stats.withMorph}</p>
            </article>
          </div>
        </section>

        <section className="card" id="tabela-interlinear">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>{t.detailedTable}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {parseInt(verse) > 1 && (
                <Link href={`/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${parseInt(verse) - 1}`} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  ⬅ {lang === 'en' ? 'Previous' : 'Anterior'}
                </Link>
              )}
              <Link href={`/${lang}/interlinear/${manuscript}/${book}/${chapter}?v=${parseInt(verse) + 1}`} className="support-cta" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                {lang === 'en' ? 'Next' : 'Próximo'} ➡
              </Link>
            </div>
          </div>
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
                  {targetLang === "hebrew" ? (
                    <>
                      <th>Strong</th>
                      <th>BDB</th>
                    </>
                  ) : targetLang === "greek" ? (
                    <>
                      <th>Strong</th>
                      <th>LSJ</th>
                    </>
                  ) : targetLang === "armenian" ? (
                    <th>{t.armenianLexicon}</th>
                  ) : targetLang === "syriac" ? (
                    <th>{t.syriacLexicon}</th>
                  ) : (
                    <th>{lexiconHeader}</th>
                  )}
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
                    {targetLang === "hebrew" ? (
                      <>
                        <td>{token.strong && token.strong !== "-" ? token.strong : "-"}</td>
                        <td>{token.bdb && token.bdb !== "-" ? (lang === 'pt' ? token.bdb.replace(/direct object marker/gi, "marcador de objeto direto") : token.bdb) : "-"}</td>
                      </>
                    ) : targetLang === "greek" ? (
                      <>
                        <td>{token.strong && token.strong !== "-" ? token.strong : "-"}</td>
                        <td>{token.lsj && token.lsj !== "-" ? token.lsj : "-"}</td>
                      </>
                    ) : targetLang === "armenian" ? (
                      <td>{token.bedrossian && token.bedrossian !== "-" ? token.bedrossian : (token.lexicon && token.lexicon !== "-" ? token.lexicon : (token.strong && token.strong !== "-" ? token.strong : "-"))}</td>
                    ) : targetLang === "syriac" ? (
                      <td>{token.brockelmann && token.brockelmann !== "-" ? token.brockelmann : (token.lexicon && token.lexicon !== "-" ? token.lexicon : (token.strong && token.strong !== "-" ? token.strong : "-"))}</td>
                    ) : (
                      <td>{(() => {
                        if (token.lexicon && token.lexicon !== "-") return token.lexicon;
                        if (token.strong && token.strong !== "-") return token.strong;
                        if (token.cal && token.cal !== "-") return token.cal;
                        return "-";
                      })()}</td>
                    )}
                    <td>{formatMorph(token.morph, lang)}</td>
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

"use client";

import { useState, useEffect, useMemo } from "react";
import { translations } from "@/app/translations";
import ReferenceSelector from "./ReferenceSelector";
import WitnessCards from "./WitnessCards";

export default function InterlinearClient({ lang, manuscript, book, chapter, verse }) {
  const t = translations[lang] || translations.pt;

  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const filePath = `/biblia.eu.creio/data/verses/${book}.${chapter}.${verse}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Verso não encontrado");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, [book, chapter, verse]);

  const filteredTokens = useMemo(() => {
    if (!data || !data.tokens) return [];
    
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
    
    const tokens = data.tokens.filter(tk => tk.lang === targetLang);
    
    if (!filter) return tokens;
    
    const query = filter.toLowerCase();
    return tokens.filter(tk => {
      const haystack = [tk.surface, tk.transliteration, tk.lemma, tk.strong, tk.morph, tk.ptLiteralWord]
        .filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [data, manuscript, filter]);

  if (error) return <div className="card"><h2>Erro</h2><p>{error}</p></div>;
  if (!data) return <div className="card"><p>{t.loading}</p></div>;

  return (
    <>
      <header className="site-header" style={{ marginBottom: '2rem' }}>
        <div>
          <p className="brand-eyebrow">{manuscript.toUpperCase()}</p>
          <h1>Interlinear Completo</h1>
          <p className="subtitle">
            Análise detalhada com transliteração, morfologia e explicações palavra por palavra.
          </p>
        </div>
      </header>

      <ReferenceSelector lang={lang} t={t} />

      <section className="card" id="verso">
        <h2>{t.literalTranslation}</h2>
        <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
        <blockquote className="verse">{data.ptLiteralVerse}</blockquote>
      </section>

      <section className="card" id="originais">
        <h2>{t.manuscriptTexts}</h2>
        <WitnessCards lang={lang} data={data} manuscript={manuscript} />
      </section>

      <section className="card" id="tabela-interlinear">
        <h2>Tabela Interlinear - {manuscript.toUpperCase()}</h2>
        <label className="interlinear-filter">
          Buscar
          <input 
            type="search" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Ex.: Elohim, H430..." 
          />
        </label>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Original</th>
                <th>Transliteração</th>
                <th>Lema</th>
                <th>Strong</th>
                <th>Morfologia</th>
                <th>Tradução literal</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token, idx) => (
                <tr key={token.id || idx}>
                  <td>{idx + 1}</td>
                  <td className={token.lang === 'hebrew' || token.lang === 'aramaic' || token.lang === 'syriac' ? 'rtl' : ''}>
                    {token.surface}
                  </td>
                  <td>{token.transliteration}</td>
                  <td>{token.lemma}</td>
                  <td>{token.strong}</td>
                  <td>{token.morph}</td>
                  <td>{token.ptLiteralWord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

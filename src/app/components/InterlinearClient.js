"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { translations } from "@/app/translations";

export default function InterlinearClient({ lang, manuscript, book, chapter, verse }) {
  const t = translations[lang] || translations.pt;

  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  const manuscriptMap = {
    hebrew: [
      { id: "leningradensis", key: "b19a", label: "Codex Leningradensis (B19A)" },
      { id: "aleppo", key: "aleppo", label: "Aleppo Codex (A)" },
      { id: "dead-sea-scrolls", key: "qumran", label: "Qumran (4QGen)" }
    ],
    greek: [
      { id: "lxx", key: "lxx", label: "Septuaginta (LXX)" },
      { id: "byzantine", key: "byzantine", label: "Tradição Bizantina" }
    ],
    aramaic: [{ id: "targum", key: "targum", label: "Targum Onkelos" }],
    latin: [{ id: "vulgate", key: "vulgate", label: "Vulgata" }],
    syriac: [{ id: "peshitta", key: "syriac", label: "Peshitta" }],
    geez: [{ id: "geez", key: "geez", label: "Ge'ez" }],
    coptic: [{ id: "coptic", key: "coptic", label: "Copta" }],
    armenian: [{ id: "armenian", key: "armenian", label: "Armênio" }]
  };

  useEffect(() => {
    const filePath = `/data/verses/${book}.${chapter}.${verse}.json`;
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

  const langOrder = [
    { code: "hebrew", label: "Hebraico" },
    { code: "greek", label: "Grego" },
    { code: "aramaic", label: "Aramaico" },
    { code: "latin", label: "Latim" },
    { code: "geez", label: "Ge'ez" },
    { code: "syriac", label: "Siríaco" },
    { code: "coptic", label: "Copta" },
    { code: "armenian", label: "Armênio" },
  ];

  return (
    <>
      <section className="card" id="verso">
        <h2>{t.literalTranslation}</h2>
        <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
        <blockquote className="verse">{data.ptLiteralVerse}</blockquote>
      </section>

      <section className="card" id="originais">
        <h2>{t.manuscriptTexts}</h2>
        <div className="manuscripts">
          {langOrder.map(lo => {
            const witnesses = data[`${lo.code}Witnesses`] || [];
            const sourceText = data.sourceTexts?.[lo.code];
            if (witnesses.length === 0 && !sourceText) return null;

            return (
              <article key={lo.code}>
                <h3>{lo.label}</h3>
                <p className="manuscript-meta">{data.manuscripts?.[lo.code]}</p>
                {witnesses.map(w => {
                  const msInfo = manuscriptMap[lo.code]?.find(m => m.id === w.id);
                  const isCurrent = msInfo && msInfo.key === manuscript;

                  return (
                    <div key={w.id} className={`text-witness ${isCurrent ? 'active-witness' : ''}`}>
                      <h4 className="text-witness-title">{w.label}</h4>
                      <p className={`text-witness-text ${lo.code === 'hebrew' || lo.code === 'aramaic' || lo.code === 'syriac' ? 'rtl' : ''}`}>
                        {w.text}
                      </p>
                      <p className="text-witness-label">Transliteração</p>
                      <p className="text-witness-transliteration">{w.transliteration}</p>
                      <p className="text-witness-label">Tradução literal</p>
                      <p className="text-witness-literal">{w.literalPt}</p>
                      
                      {msInfo && !isCurrent && (
                        <div className="manuscript-actions">
                          <Link 
                            href={`/${lang}/interlinear/${msInfo.key}/${book}/${chapter}/${verse}`}
                            className="manuscript-cta"
                          >
                            Interlinear completo
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!witnesses.length && sourceText && (
                  <p className={lo.code === 'hebrew' || lo.code === 'aramaic' || lo.code === 'syriac' ? 'rtl' : ''}>
                    {sourceText}
                  </p>
                )}
              </article>
            );
          })}
        </div>
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

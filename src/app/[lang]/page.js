"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "@/app/components/ReferenceSelector";
import VisitMetrics from "@/app/components/VisitMetrics";

export default function LangHomePage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Await params in a useEffect since this is a client component now
  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    // Default verse for home page: Genesis 1:1
    const filePath = `/biblia.eu.creio/data/verses/gen.1.1.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Verso não encontrado");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, [resolvedParams]);

  if (!resolvedParams) return null;
  const { lang } = resolvedParams;
  const t = translations[lang] || translations.pt;

  const manuscriptMap = {
    hebrew: [{ id: "leningradensis", key: "b19a", label: "Codex Leningradensis (B19A)" }],
    greek: [{ id: "lxx", key: "lxx", label: "Septuaginta (LXX)" }],
    aramaic: [{ id: "targum", key: "targum", label: "Targum Onkelos" }],
    latin: [{ id: "vulgate", key: "vulgate", label: "Vulgata" }],
    syriac: [{ id: "peshitta", key: "syriac", label: "Peshitta" }],
    geez: [{ id: "geez", key: "geez", label: "Ge'ez" }],
    coptic: [{ id: "coptic", key: "coptic", label: "Copta" }],
    armenian: [{ id: "armenian", key: "armenian", label: "Armênio" }]
  };

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
      <section className="card support-banner" aria-labelledby="support-title">
        <p className="support-kicker">Comunidade</p>
        <h2 id="support-title">{t.supportTitle}</h2>
        <p>{t.supportText}</p>
        <VisitMetrics lang={lang} t={t} />
        <div className="support-actions">
          <a
            className="support-cta"
            href="https://wa.me/5585986794831?text=Quero+Colaborar!"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.supportCta}
          </a>
          <a
            className="support-cta support-cta--github"
            href="https://github.com/cristianismohumilde/biblia.eu.creio/discussions/2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.supportGithub}
          </a>
        </div>
      </section>

      <ReferenceSelector lang={lang} t={t} />

      {data && (
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
                      return (
                        <div key={w.id} className="text-witness">
                          <h4 className="text-witness-title">{w.label}</h4>
                          <p className={`text-witness-text ${lo.code === 'hebrew' || lo.code === 'aramaic' || lo.code === 'syriac' ? 'rtl' : ''}`}>
                            {w.text}
                          </p>
                          <p className="text-witness-label">Transliteração</p>
                          <p className="text-witness-transliteration">{w.transliteration}</p>
                          <p className="text-witness-label">Tradução literal</p>
                          <p className="text-witness-literal">{w.literalPt}</p>
                          
                          {msInfo && (
                            <div className="manuscript-actions">
                              <Link 
                                href={`/${lang}/interlinear/${msInfo.key}/${data.ref.book.toLowerCase()}/${data.ref.chapter}/${data.ref.verse}`}
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
        </>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { translations } from "@/app/translations";
import ReferenceSelector from "@/app/components/ReferenceSelector";
import VisitMetrics from "@/app/components/VisitMetrics";
import WitnessCards from "@/app/components/WitnessCards";

export default function LangHomePage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    // Default verse: Genesis 1:1
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
            <WitnessCards lang={lang} data={data} />
          </section>
        </>
      )}
    </>
  );
}

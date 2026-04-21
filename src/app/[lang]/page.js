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

  const loadVerse = (book, chapter, verse) => {
    const filePath = `/biblia.eu.creio/data/verses/${book.toLowerCase()}.${chapter}.${verse}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Verso não encontrado");
        return res.json();
      })
      .then((json) => {
        setData(json);
        // Update URL to match selection for better refresh/share experience
        const url = new URL(window.location.href);
        url.searchParams.set("book", book);
        url.searchParams.set("chapter", chapter);
        url.searchParams.set("verse", verse);
        window.history.replaceState({}, "", url);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (!resolvedParams) return;
    loadVerse("gen", 1, 1);
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

      <ReferenceSelector lang={lang} t={t} onSelect={loadVerse} />

      {data && (
        <>
          <section className="card" id="verso">
            <h2>{t.literalTranslation}</h2>
            <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
            <blockquote className="verse">{data.ptLiteralVerse}</blockquote>
            <p className="translation-meta">{t.translationAuthor} {data.translation?.author || t.notInformed}</p>
            <p className="translation-meta">{t.translationSource} {data.translation?.baseText || t.notInformed}</p>
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

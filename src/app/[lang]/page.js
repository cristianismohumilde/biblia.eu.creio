"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "@/app/components/ReferenceSelector";
import WitnessCards from "@/app/components/WitnessCards";
import ThemeToggle from "@/app/components/ThemeToggle";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function LangHomePage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  const loadVerse = (book, chapter, verse) => {
    const filePath = `/data/verses/${book.toLowerCase()}.${chapter}.${verse}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Verso não encontrado");
        return res.json();
      })
      .then((json) => {
        setData(json);
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
      <header className="site-header">
        <div>
          <p className="brand-eyebrow">{t.openSource}</p>
          <h1><Link href={`/${lang}/`} style={{ color: 'inherit', textDecoration: 'none' }}>Biblia.Creio.EU</Link></h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
        <nav className="quick-nav" aria-label="Navegação rápida">
          <Link href={`/${lang}/#verso`}>{t.verse}</Link>
          <Link href={`/${lang}/#originais`}>{t.manuscriptTexts}</Link>
          <Link href={`/${lang}/idiomas-biblicos`}>
            {t.biblicalLanguages}
          </Link>
          <Link href={`/${lang}/fontes`} className="nav-spotlight">
            {t.sources}
          </Link>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle t={t} />
        </nav>
      </header>

      <section className="card support-banner" aria-labelledby="support-title">
        <p className="support-kicker">{t.community}</p>
        <h2 id="support-title">{t.supportTitle}</h2>
        <p>{t.supportText}</p>

        {!showDonation ? (
          <div className="support-actions">
            <button
              className="support-cta"
              onClick={() => setShowDonation(true)}
            >
              {t.supportCta}
            </button>
            <a
              className="support-cta support-cta--github"
              href="https://github.com/cristianismohumilde/biblia.eu.creio/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.supportGithub}
            </a>
            <a
              className="support-cta support-cta--discord"
              href="https://discord.gg/dmjd6QDb9u"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.supportDiscord}
            </a>
            <a
              className="support-cta support-cta--academy"
              href="https://creio.eu"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.supportAcademy}
            </a>
          </div>
        ) : (
          <div className="donation-info">
            <p className="donation-title">{t.donationTitle}</p>
            <ul className="donation-list">
              <li>{t.donationPix}</li>
              <li>
                {t.donationWise}:{" "}
                <a href="https://wise.com/pay/me/venelouistyagov" target="_blank" rel="noopener noreferrer">
                  @venelouistyagov
                </a>
              </li>
            </ul>
            <div className="support-actions">
              <a
                className="support-cta"
                href="https://wa.me/5585986794831?text=Quero+Colaborar!"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.whatsappCta}
              </a>
              <button
                className="support-cta support-cta--github"
                onClick={() => setShowDonation(false)}
              >
                {t.back}
              </button>
            </div>
          </div>
        )}
      </section>

      <ReferenceSelector lang={lang} t={t} onSelect={loadVerse} />

      {data && (
        <>
          <section className="card" id="verso">
            <h2>{t.literalTranslation}</h2>
            <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse}</p>
            <blockquote className="verse">{lang === 'pt' ? data.ptLiteralVerse : data.enLiteralVerse}</blockquote>
            <p className="translation-meta">{t.translationAuthor} { (lang === 'en' ? data.translation?.authorEn : data.translation?.author) || t.notInformed}</p>
            <p className="translation-meta">{t.translationSource} { (lang === 'en' ? data.translation?.baseTextEn : data.translation?.baseText) || t.notInformed}</p>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "@/app/translations";
import ReferenceSelector from "@/app/components/ReferenceSelector";
import WitnessCards from "@/app/components/WitnessCards";
import SiteHeader from "@/app/components/SiteHeader";
import NewsBanner from "@/app/components/NewsBanner";
import { handleSpeak } from "@/app/utils/audio";

export default function LangHomePage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  const loadVerse = (book, chapter, verse) => {
    const filePath = `/data/verses/${book.toLowerCase()}.${chapter}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Capítulo não encontrado");
        return res.json();
      })
      .then((json) => {
        // Encontra o verso específico dentro do capítulo (suporta formatos v.verse ou v.ref.verse)
        const verseData = json.verses.find(v => (v.verse || v.ref?.verse) === parseInt(verse));
        if (!verseData) throw new Error("Versículo não encontrado no capítulo");
        
        setData(verseData);
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

  const navLinks = [
    { href: `/${lang}/idiomas-biblicos`, label: t.biblicalLanguages, className: "nav-spotlight" },
    { href: `/${lang}/atualizacoes-e-novidades`, label: t.updates, className: "nav-updates" },
    { href: `/${lang}/fontes`, label: t.sources }
  ];

  return (
    <>
      <SiteHeader 
        lang={lang}
        t={t}
        eyebrow={t.openSource}
        title={<Link href={`/${lang}/`} style={{ color: 'inherit', textDecoration: 'none' }}>Biblia.Creio.EU</Link>}
        subtitle={t.subtitle}
        links={navLinks}
      />

      <section className="card support-banner" aria-labelledby="support-title" id="apoie">
        <p className="support-kicker">{t.community}</p>
        <h2 id="support-title">{t.supportTitle}</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.8, textAlign: 'center', width: '100%' }}>{t.globalBannerText}</p>

        {!showDonation ? (
          <div className="support-actions">
            <button
              className="support-cta support-cta--red heart-beat"
              onClick={() => setShowDonation(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              ❤️ {t.supportCta}
            </button>
            <a
              className="support-cta support-cta--github"
              href="https://github.com/cristianismohumilde/biblia.eu.creio/discussions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              {t.supportGithub}
            </a>
            <a
              className="support-cta support-cta--discord"
              href="https://discord.gg/dmjd6QDb9u"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              {t.supportDiscord}
            </a>
            <div className="academy-action-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/lux%202.png"
                alt="Lux 2"
                className="lux-mascot desktop-only"
                style={{
                  position: 'absolute',
                  bottom: '-40%',
                  left: '28%',
                  transform: 'translateX(-50%)',
                  zIndex: 0,
                  animation: 'bounce 1.5s infinite ease-in-out',
                  pointerEvents: 'none'
                }}
              />
              <a
                className="support-cta support-cta--academy"
                href="https://creio.eu"
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                🕹️ {t.supportAcademy}
              </a>
              <img
                src="/rob3.png"
                alt="Rob3"
                className="rob3-mascot mobile-only"
                style={{
                  width: '55px',
                  height: '55px',
                  objectFit: 'contain'
                }}
              />
            </div>
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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
        <p style={{ marginTop: '1.5rem', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
          {t.supportText}
        </p>
      </section>

      <NewsBanner lang={lang} />
      <ReferenceSelector 
        lang={lang} 
        t={t} 
        onSelect={loadVerse} 
        initialBook={data?.ref?.book || "gen"}
        initialChapter={data?.ref?.chapter || "1"}
        initialVerse={data?.ref?.verse || data?.verse || "1"}
      />

      {error && (
        <section className="card" style={{ borderColor: '#e74c3c', background: '#fdf2f2' }}>
          <h2 style={{ color: '#c0392b' }}>Erro</h2>
          <p>{error}</p>
          <button onClick={() => { setError(null); loadVerse("gen", 1, 1); }} className="support-cta" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Tentar novamente</button>
        </section>
      )}

      {data && (
        <>
          <section className="card" id="verso">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <h2 style={{ margin: 0 }}>{t.literalTranslation}</h2>
                <button 
                  onClick={() => handleSpeak(lang === 'pt' ? data.ptLiteralVerse : data.enLiteralVerse, lang)} 
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
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {parseInt(data.ref.verse || data.verse) > 1 && (
                  <button 
                    onClick={() => loadVerse(data.ref.book, data.ref.chapter, parseInt(data.ref.verse || data.verse) - 1)} 
                    className="support-cta" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                  >
                    ⬅ {lang === 'en' ? 'Previous' : 'Anterior'}
                  </button>
                )}
                <button 
                  onClick={() => loadVerse(data.ref.book, data.ref.chapter, parseInt(data.ref.verse || data.verse) + 1)} 
                  className="support-cta" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                >
                  {lang === 'en' ? 'Next' : 'Próximo'} ➡
                </button>
              </div>
            </div>

            <p className="reference">{data.ref.book} {data.ref.chapter}:{data.ref.verse || data.verse}</p>
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

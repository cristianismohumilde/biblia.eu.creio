import { translations } from "../translations";
import ReferenceSelector from "../components/ReferenceSelector";

export default function LangHomePage({ params }) {
  const { lang } = params;
  const t = translations[lang] || translations.pt;

  return (
    <>
      <section className="card support-banner" aria-labelledby="support-title">
        <p className="support-kicker">Comunidade</p>
        <h2 id="support-title">{t.supportTitle}</h2>
        <p>{t.supportText}</p>
        <div className="support-metrics" aria-live="polite">
          <p>
            <strong>{t.visitCount}</strong> <span id="metric-total-views">--</span>
          </p>
        </div>
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

      {/* The rest of the page would go here, 
          but in Next.js we might want to split this into 
          the "Home" view and the "Interlinear" view.
          For now, this mimics the selection part. */}
    </>
  );
}

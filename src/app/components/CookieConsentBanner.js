"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie_consent";

/**
 * CookieConsentBanner
 * Exibe um banner de consentimento de cookies em conformidade com LGPD/GDPR.
 * Aparece apenas se o usuário ainda não tomou uma decisão.
 * Props:
 *   lang: "pt" | "en"
 */
export default function CookieConsentBanner({ lang = "pt" }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Pequeno delay para a animação de entrada não colidir com o hydration
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (value) => {
    setAnimating(true);
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, value);
      setVisible(false);
      setAnimating(false);
    }, 380);
  };

  if (!visible) return null;

  const text = {
    pt: {
      message:
        "Utilizamos cookies estritamente necessários para o funcionamento do site. Com seu consentimento, também podemos usar cookies de preferência e análise para melhorar sua experiência.",
      accept: "Aceitar todos",
      necessary: "Apenas necessários",
      learnMore: "Saiba mais",
    },
    en: {
      message:
        "We use strictly necessary cookies for the website to function. With your consent, we may also use preference and analytics cookies to improve your experience.",
      accept: "Accept all",
      necessary: "Necessary only",
      learnMore: "Learn more",
    },
  };

  const t = text[lang] || text.pt;
  const policyHref = `/${lang}/cookies`;

  return (
    <div
      className={`cookie-banner ${animating ? "cookie-banner--exit" : "cookie-banner--enter"}`}
      role="dialog"
      aria-modal="true"
      aria-label={lang === "pt" ? "Aviso de cookies" : "Cookie notice"}
    >
      <div className="cookie-banner__inner">
        <div className="cookie-banner__icon" aria-hidden="true">🍪</div>
        <div className="cookie-banner__content">
          <p className="cookie-banner__text">{t.message}</p>
          <Link
            href={policyHref}
            className="cookie-banner__link"
          >
            {t.learnMore}
          </Link>
        </div>
        <div className="cookie-banner__actions">
          <button
            id="btn-cookie-accept-all"
            className="cookie-btn cookie-btn--accept"
            onClick={() => dismiss("all")}
          >
            {t.accept}
          </button>
          <button
            id="btn-cookie-necessary-only"
            className="cookie-btn cookie-btn--necessary"
            onClick={() => dismiss("necessary")}
          >
            {t.necessary}
          </button>
        </div>
      </div>
    </div>
  );
}

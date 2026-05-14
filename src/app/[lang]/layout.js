import Link from "next/link";
import { translations } from "../translations";
import HealthInfo from "../components/HealthInfo";
import FloatingSupport from "../components/FloatingSupport";
import CookieConsentBanner from "../components/CookieConsentBanner";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  return (
    <div className="min-h-col flex flex-col">
      <div className="aurora" aria-hidden="true"></div>
      <main className="layout">{children}</main>
      <FloatingSupport lang={lang} t={t} />

      <footer className="site-footer">
        <p>
          {t.footerText}{" "}
          <a
            href="https://github.com/cristianismohumilde/biblia.eu.creio"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/cristianismohumilde/biblia.eu.creio
          </a>
        </p>
        <p>
          {t.licenses} | <Link href={`/${lang}/fontes`}>{t.sources}</Link> | <a href={`/${lang}/#apoie`} style={{ color: '#ef4444', fontWeight: 'bold', textDecoration: 'none' }}>❤️ {t.support}</a>
        </p>
        <p style={{ fontSize: '0.82rem', marginTop: '0.5rem', opacity: 0.75 }}>
          <Link href={`/${lang}/termos`} style={{ color: 'var(--accent)' }}>
            {lang === 'en' ? '📜 Terms of Use' : '📜 Termos de Uso'}
          </Link>
          {' · '}
          <Link href={`/${lang}/privacidade`} style={{ color: 'var(--accent)' }}>
            {lang === 'en' ? '🛡️ Privacy Policy' : '🛡️ Política de Privacidade'}
          </Link>
          {' · '}
          <Link href={`/${lang}/cookies`} style={{ color: 'var(--accent)' }}>
            {lang === 'en' ? '🍪 Cookie Notice' : '🍪 Aviso de Cookies'}
          </Link>
        </p>
        <HealthInfo />
      </footer>
      <CookieConsentBanner lang={lang} />
    </div>
  );
}

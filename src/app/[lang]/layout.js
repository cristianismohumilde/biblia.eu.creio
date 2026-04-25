import Link from "next/link";
import { translations } from "../translations";
import HealthInfo from "../components/HealthInfo";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  return (
    <div className="min-h-full flex flex-col">
      <div style={{ background: 'var(--brand, #3b82f6)', color: '#fff', padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', zIndex: 50, position: 'relative' }}>
        <span>{t.globalBannerText}</span>
        <Link href={`/${lang}/#apoie`} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '4px', textDecoration: 'none', color: '#fff', fontWeight: 600, transition: 'background 0.2s' }}>
          {t.supportCta}
        </Link>
      </div>
      <div className="aurora" aria-hidden="true"></div>
      <main className="layout">{children}</main>

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
          {t.licenses} | <Link href={`/${lang}/fontes`}>{t.sources}</Link>
        </p>
        <HealthInfo />
      </footer>
    </div>
  );
}

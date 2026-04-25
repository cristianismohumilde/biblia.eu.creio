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
    <div className="min-h-col flex flex-col">
      <div className="aurora" aria-hidden="true"></div>
      <main className="layout">{children}</main>
      
      <Link 
        href={`/${lang}/#apoie`}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#ef4444',
          color: '#fff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
          zIndex: 1000,
          textDecoration: 'none',
          fontSize: '24px',
          cursor: 'pointer',
        }}
        title={t.supportTitle}
      >
        ❤️
      </Link>

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

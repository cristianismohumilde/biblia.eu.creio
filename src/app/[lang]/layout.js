import Link from "next/link";
import { translations } from "../translations";
import ThemeToggle from "../components/ThemeToggle";
import HealthInfo from "../components/HealthInfo";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  return (
    <div className="min-h-full flex flex-col">
      <header className="site-header">
        <div>
          <p className="brand-eyebrow">{t.openSource}</p>
          <h1><Link href={`/${lang}/`} style={{ color: 'inherit', textDecoration: 'none' }}>Biblia.Creio.EU</Link></h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
        <nav className="quick-nav" aria-label="Navegação rápida">
          <Link href={`/${lang}/#verso`}>{t.verse}</Link>
          <Link href={`/${lang}/#originais`}>{t.manuscriptTexts}</Link>
          <Link href={`/${lang}/idiomas-biblicos`} className="nav-spotlight">
            {t.biblicalLanguages}
          </Link>
          <Link href={`/${t.otherLangCode}/`} hreflang={t.otherLangCode}>
            {t.otherLangName}
          </Link>
          <ThemeToggle t={t} />
        </nav>
      </header>

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
        <p>{t.licenses}</p>
        <HealthInfo />
      </footer>
    </div>
  );
}

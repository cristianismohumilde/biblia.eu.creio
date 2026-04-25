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

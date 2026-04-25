import Link from "next/link";
import { translations } from "../../translations";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function FontesPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: [
      {
        title: "Textos-Fonte (Manuscritos)",
        text: "Utilizamos as edições acadêmicas mais respeitadas dos testemunhos antigos: Codex Leningradensis e Aleppo (Hebraico), Septuaginta e Texto Bizantino (Grego), Vulgata (Latim) e a Peshitta (Siríaco). Todas essas bases textuais são de domínio público."
      },
      {
        title: "Léxicos e Dicionários (Domínio Público)",
        text: "Para garantir segurança jurídica total e liberdade de redistribuição, nossa base de dados interlinear fundamenta-se em obras clássicas cujo copyright já expirou: Marcus Jastrow (Aramaico), August Dillmann (Ge'ez), Lewis & Short (Latim), LSJ (Grego), BDB e Strong's (Hebraico), W.E. Crum (Copta) e Matthias Bedrossian (Armênio)."
      },
      {
        title: "Tradução Literal e Curadoria",
        text: "As glosas (traduções palavra-por-palavra) em português e inglês são produções originais da equipe Biblia.Creio.EU. Trata-se de uma tradução técnica voltada para o estudo interlinear, e não uma reprodução de traduções comerciais protegidas."
      },
      {
        title: "Conformidade e Uso Justo",
        text: "Qualquer referência a léxicos modernos é estritamente limitada ao âmbito comparativo acadêmico, amparada pelo direito de citação e uso justo (Fair Use), sem a redistribuição de bases de dados protegidas de terceiros."
      }
    ],
    en: [
      {
        title: "Source Texts (Manuscripts)",
        text: "We use the most respected academic editions of ancient witnesses: Codex Leningradensis and Aleppo (Hebrew), Septuagint and Byzantine Text (Greek), Vulgate (Latin), and the Peshitta (Syriac). All these textual bases are in the public domain."
      },
      {
        title: "Lexicons and Dictionaries (Public Domain)",
        text: "To ensure total legal safety and freedom of redistribution, our interlinear database is based on classic works whose copyright has expired: Marcus Jastrow (Aramaic), August Dillmann (Ge'ez), Lewis & Short (Latin), LSJ (Greek), BDB and Strong's (Hebrew), W.E. Crum (Coptic), and Matthias Bedrossian (Armenian)."
      },
      {
        title: "Literal Translation and Curation",
        text: "The glosses (word-for-word translations) in Portuguese and English are original productions of the Biblia.Creio.EU team. This is a technical translation aimed at interlinear study, and not a reproduction of protected commercial translations."
      },
      {
        title: "Compliance and Fair Use",
        text: "Any reference to modern lexicons is strictly limited to an academic comparative scope, supported by the right of citation and fair use, without the redistribution of protected third-party databases."
      }
    ]
  };

  const activeContent = content[lang] || content.pt;

  return (
    <>
      <header className="site-header" style={{ marginBottom: '2rem' }}>
        <div>
          <p className="brand-eyebrow">{t.openSource}</p>
          <h1>{t.sources}</h1>
          <p className="subtitle">{t.sourcesSubtitle}</p>
        </div>
        <nav className="quick-nav">
          <Link href={`/${lang}/`}>{t.back}</Link>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle t={t} />
        </nav>
      </header>

      {activeContent.map((item, index) => (
        <section key={index} className="card">
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </section>
      ))}

      <footer className="site-footer" style={{ marginTop: '2rem' }}>
        <p>{t.footerText} <a href="https://github.com/cristianismohumilde/biblia.eu.creio" target="_blank" rel="noopener noreferrer">github.com/cristianismohumilde/biblia.eu.creio</a></p>
      </footer>
    </>
  );
}

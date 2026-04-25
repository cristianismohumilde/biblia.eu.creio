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
        title: "Tradição Hebraica (Texto Massorético)",
        text: "O Codex Leningradensis (B19A) é o manuscrito completo mais antigo da Bíblia Hebraica (1008 d.C.), servindo como base para as principais edições acadêmicas modernas (BHS). O Codex de Aleppo, embora incompleto, é considerado a testemunha mais autoritativa da pontuação e acentuação massorética. Ambos garantem a preservação técnica do texto do Antigo Testamento."
      },
      {
        title: "Tradição Grega (LXX e Texto Bizantino)",
        text: "A Septuaginta (LXX) é a tradução grega mais antiga do Antigo Testamento (séc. III-II a.C.), sendo a versão mais citada pelos autores do Novo Testamento. O Texto Bizantino (ou Majoritário) representa a forma do texto grego preservada na maioria dos manuscritos e na liturgia da Igreja Ortodoxa, sendo fundamental para entender a transmissão viva do texto neotestamentário."
      },
      {
        title: "Tradição Aramaica (Targum Onkelos)",
        text: "Os Targumim são traduções e paráfrases aramaicas antigas. O Targum Onkelos é a versão oficial da Torá, essencial para compreender como os judeus do período do Segundo Templo e da era talmúdica interpretavam e aplicavam o texto bíblico em sua própria língua vernácula."
      },
      {
        title: "Tradição Latina (Vulgata)",
        text: "Traduzida por Jerônimo no final do século IV, a Vulgata tornou-se o texto padrão da Igreja Ocidental por mais de um milênio. Ela é uma peça-chave para rastrear a recepção teológica no Ocidente e para entender o desenvolvimento do vocabulário doutrinário latino."
      },
      {
        title: "Tradição Siríaca (Peshitta)",
        text: "A Peshitta é a versão 'simples' ou 'comum' utilizada pelos cristãos de fala siríaca (um dialeto do aramaico). Por ser uma língua semítica, o siríaco preserva estruturas de pensamento e nuances poéticas muito próximas do ambiente original da revelação bíblica, sendo uma das testemunhas mais antigas e consistentes."
      },
      {
        title: "Tradição Etíope (Ge'ez)",
        text: "A Bíblia em Ge'ez preserva uma trajetória única do cristianismo africano. A tradição etíope é famosa por ter preservado livros e variantes textuais que não sobreviveram em outras linhagens, oferecendo um horizonte comparativo valioso para a crítica textual."
      },
      {
        title: "Testemunhos Copta e Armênio",
        text: "O Copta (Egito) e o Armênio antigo (frequentemente chamado de 'Rainha das Versões') ajudam a reconstruir a expansão do cristianismo para além do eixo greco-latino. Esses manuscritos registram como o texto foi adaptado para culturas diversas e preservam leituras que auxiliam na identificação de variantes textuais arcaicas."
      },
      {
        title: "Léxicos e Dicionários (Domínio Público)",
        text: "Nossa base de dados interlinear fundamenta-se em obras clássicas de domínio público: Marcus Jastrow (Aramaico), August Dillmann (Ge'ez), Lewis & Short (Latim), LSJ (Grego), BDB e Strong's (Hebraico), W.E. Crum (Copta) e Matthias Bedrossian (Armênio)."
      },
      {
        title: "Tradução Literal e Curadoria",
        text: "As glosas e traduções literais em português e inglês são produções originais da equipe Biblia.Creio.EU, focadas em precisão técnica e filológica para o estudo interlinear."
      }
    ],
    en: [
      {
        title: "Hebrew Tradition (Masoretic Text)",
        text: "The Codex Leningradensis (B19A) is the oldest complete manuscript of the Hebrew Bible (1008 AD), serving as the basis for major modern academic editions (BHS). The Aleppo Codex, although incomplete, is considered the most authoritative witness to Masoretic pointing and accentuation. Both ensure the technical preservation of the Old Testament text."
      },
      {
        title: "Greek Tradition (LXX and Byzantine Text)",
        text: "The Septuagint (LXX) is the oldest Greek translation of the Old Testament (3rd-2nd century BC), and was the version most cited by New Testament authors. The Byzantine (or Majority) Text represents the form of the Greek text preserved in most manuscripts and in the liturgy of the Orthodox Church, being fundamental to understanding the living transmission of the New Testament text."
      },
      {
        title: "Aramaic Tradition (Targum Onkelos)",
        text: "The Targumim are ancient Aramaic translations and paraphrases. Targum Onkelos is the official version of the Torah, essential for understanding how Jews of the Second Temple period and the Talmudic era interpreted and applied the biblical text in their own vernacular."
      },
      {
        title: "Latin Tradition (Vulgate)",
        text: "Translated by Jerome at the end of the 4th century, the Vulgate became the standard text of the Western Church for over a millennium. It is a key piece for tracking theological reception in the West and for understanding the development of Latin doctrinal vocabulary."
      },
      {
        title: "Syriac Tradition (Peshitta)",
        text: "The Peshitta is the 'simple' or 'common' version used by Syriac-speaking Christians (a dialect of Aramaic). As a Semitic language, Syriac preserves thought structures and poetic nuances very close to the original environment of biblical revelation, being one of the oldest and most consistent witnesses."
      },
      {
        title: "Ethiopic Tradition (Ge'ez)",
        text: "The Bible in Ge'ez preserves a unique trajectory of African Christianity. The Ethiopian tradition is famous for having preserved books and textual variants that did not survive in other lineages, offering a valuable comparative horizon for textual criticism."
      },
      {
        title: "Coptic and Armenian Witnesses",
        text: "Coptic (Egypt) and Ancient Armenian (often called the 'Queen of Versions') help reconstruct the expansion of Christianity beyond the Greco-Latin axis. These manuscripts record how the text was adapted for diverse cultures and preserve readings that assist in identifying archaic textual variants."
      },
      {
        title: "Lexicons and Dictionaries (Public Domain)",
        text: "Our interlinear database is based on classic public domain works: Marcus Jastrow (Aramaic), August Dillmann (Ethiopic), Lewis & Short (Latin), LSJ (Greek), BDB and Strong's (Hebrew), W.E. Crum (Coptic), and Matthias Bedrossian (Armenian)."
      },
      {
        title: "Literal Translation and Curation",
        text: "The glosses and literal translations in Portuguese and English are original productions of the Biblia.Creio.EU team, focused on technical and philological precision for interlinear study."
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

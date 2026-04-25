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
        text: "A Peshitta é a versão 'simples' ou 'comum' utilizada pelos cristãos de fala siríaca (um dialeto do aramaico). Por ser uma língua semítica, o siríaco preserva estruturas de pensamento e nuances poéticas muito próximas do ambiente original da revelação bíblica."
      },
      {
        title: "Tradição Etíope (Ge'ez) e outras Versões",
        text: "A Bíblia em Ge'ez preserva uma trajetória única do cristianismo africano, enquanto as versões Copta e Armênia (a 'Rainha das Versões') ajudam a reconstruir a expansão do cristianismo para além do eixo greco-latino, preservando leituras que auxiliam na identificação de variantes textuais arcaicas."
      },
      {
        title: "A Importância dos Léxicos Utilizados",
        text: "Utilizamos as ferramentas mais robustas da filologia clássica: o sistema **Strong** permite a conexão universal entre termos; o **BDB** é a autoridade máxima em etimologia hebraica; o **LSJ** é o monumento do grego antigo; o **Lewis & Short** define o vocabulário latino clássico; o **Jastrow** é vital para o aramaico targúmico; e os léxicos de **Dillmann**, **Crum** e **Bedrossian** são os portais fundamentais para as nuances do Ge'ez, Copta e Armênio, respectivamente. Cada léxico garante que o significado de cada token seja fundamentado em séculos de erudição."
      },
      {
        title: "O Valor da Tradução Literal Biblia.Creio.EU",
        text: "Muitas traduções modernas priorizam a fluidez e a beleza do texto ('equivalência dinâmica'), o que frequentemente 'suaviza' ou até oculta estruturas gramaticais e repetições propositais do original. Nossa tradução literal de curadoria é de extrema importância porque foca na **fidelidade estrutural e morfológica**. Ela permite que o estudante veja exatamente qual palavra original gerou o conceito traduzido, mantendo as ambiguidades e forças do texto-fonte que se perdem em leituras meramente devocionais. É a ponte transparente entre o leitor e o manuscrito."
      },
      {
        title: "Conformidade e Domínio Público",
        text: "Para garantir segurança jurídica total e liberdade de redistribuição, fundamentamos nossos dados técnicos em obras clássicas de domínio público, complementadas por nossa própria curadoria original de traduções e glosas."
      }
    ],
    en: [
      {
        title: "Hebrew Tradition (Masoretic Text)",
        text: "The Codex Leningradensis (B19A) is the oldest complete manuscript of the Hebrew Bible (1008 AD), serving as the basis for major modern academic editions (BHS). The Aleppo Codex, although incomplete, is considered the most authoritative witness to Masoretic pointing and accentuation."
      },
      {
        title: "Greek Tradition (LXX and Byzantine Text)",
        text: "The Septuagint (LXX) is the oldest Greek translation of the Old Testament (3rd-2nd century BC), and was the version most cited by New Testament authors. The Byzantine (or Majority) Text represents the form of the Greek text preserved in most manuscripts and in the liturgy of the Orthodox Church."
      },
      {
        title: "Aramaic Tradition (Targum Onkelos)",
        text: "The Targumim are ancient Aramaic translations and paraphrases. Targum Onkelos is the official version of the Torah, essential for understanding how Jews of the Second Temple and Talmudic eras interpreted and applied the biblical text."
      },
      {
        title: "Latin Tradition (Vulgate)",
        text: "Translated by Jerome at the end of the 4th century, the Vulgate became the standard text of the Western Church for over a millennium, being a key piece for tracking theological reception in the West."
      },
      {
        title: "Syriac Tradition (Peshitta)",
        text: "The Peshitta is the 'simple' version used by Syriac-speaking Christians. As a Semitic language, Syriac preserves thought structures and poetic nuances very close to the original environment of biblical revelation."
      },
      {
        title: "Ethiopic (Ge'ez) and other Versions",
        text: "The Bible in Ge'ez preserves a unique trajectory of African Christianity, while Coptic and Armenian ('Queen of Versions') help reconstruct the expansion of Christianity beyond the Greco-Latin axis."
      },
      {
        title: "The Importance of the Lexicons Used",
        text: "We use the most robust tools of classical philology: the **Strong** system provides a universal connection between terms; **BDB** is the ultimate authority on Hebrew etymology; **LSJ** is the monument of ancient Greek; **Lewis & Short** defines classical Latin vocabulary; **Jastrow** is vital for Targumic Aramaic; and the lexicons of **Dillmann**, **Crum**, and **Bedrossian** are the fundamental portals to the nuances of Ge'ez, Coptic, and Armenian. Each lexicon ensures that the meaning of every token is grounded in centuries of scholarship."
      },
      {
        title: "The Value of the Biblia.Creio.EU Literal Translation",
        text: "Many modern translations prioritize flow and beauty ('dynamic equivalence'), which often 'smooths' or even hides grammatical structures and intentional repetitions of the original. Our curated literal translation is of extreme importance because it focuses on **structural and morphological fidelity**. It allows the student to see exactly which original word generated the translated concept, maintaining the ambiguities and strengths of the source text that are lost in purely devotional readings. It is the transparent bridge between the reader and the manuscript."
      },
      {
        title: "Compliance and Public Domain",
        text: "To ensure total legal safety and freedom of redistribution, we base our technical data on classic public domain works, complemented by our own original curation of translations and glosses."
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

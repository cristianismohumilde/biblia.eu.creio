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
        title: "Tradições de Manuscritos e Testemunhos",
        text: "Nosso projeto utiliza as bases textuais mais respeitadas da história: o Texto Massorético (Codex Leningradensis e Aleppo) para o Hebraico; a Septuaginta (LXX) e o Texto Bizantino para o Grego; a Vulgata de Jerônimo para o Latim; o Targum Onkelos para o Aramaico; a Peshitta para o Siríaco; e as antigas versões Etíope (Ge'ez), Copta e Armênia. Cada uma dessas fontes representa uma linhagem de transmissão que preserva nuances e variantes essenciais para a crítica textual e exegese profunda."
      },
      {
        title: "James Strong (Concordância de Strong)",
        text: "Publicado originalmente em 1890, o sistema de numeração de James Strong tornou-se o padrão universal para o estudo bíblico não especializado. Ele atribui um número único a cada palavra raiz no Hebraico e no Grego, permitindo que estudantes sem profundo conhecimento linguístico acessem o léxico original e comparem ocorrências de termos em toda a Bíblia."
      },
      {
        title: "BDB (Brown-Driver-Briggs)",
        text: "Este é o léxico definitivo para o Hebraico Bíblico. O BDB é fundamentado na filologia semítica comparada, focando intensamente nas raízes das palavras e em como seu significado se desenvolveu ao longo dos séculos. É a ferramenta indispensável para entender o Antigo Testamento em sua profundidade semântica original."
      },
      {
        title: "LSJ (Liddell-Scott-Jones)",
        text: "Considerado o maior dicionário de Grego Antigo do mundo. O LSJ cobre desde a literatura homérica até o período koiné (bíblico), oferecendo uma visão monumental de como as palavras gregas eram usadas na filosofia, poesia e, posteriormente, na tradução da Septuaginta e no Novo Testamento."
      },
      {
        title: "Marcus Jastrow",
        text: "O léxico de Marcus Jastrow é a autoridade máxima para o Aramaico dos Targumim, do Talmude e da literatura Midráshica. Ele é fundamental para o nosso projeto pois fornece as chaves interpretativas para o Aramaico antigo, captando nuances que léxicos bíblicos genéricos muitas vezes ignoram."
      },
      {
        title: "Lewis & Short",
        text: "O padrão para o estudo do Latim clássico e tardio. É o léxico que utilizamos para decifrar a Vulgata Latina, garantindo que as escolhas lexicais de Jerônimo sejam entendidas dentro do contexto linguístico romano do século IV."
      },
      {
        title: "August Dillmann (Ge'ez)",
        text: "O 'Lexicon Linguae Aethiopicae' de Dillmann é um monumento da erudição do século XIX e continua sendo a obra de referência primária para o Ge'ez (Etíope clássico). Sem este léxico, o acesso acadêmico à rica e antiga tradição bíblica etíope seria virtualmente impossível."
      },
      {
        title: "W.E. Crum (Copta) e Matthias Bedrossian (Armênio)",
        text: "Crum é a autoridade absoluta para o Copta, essencial para entender a Bíblia no Egito cristão. Bedrossian fornece o dicionário mais detalhado para o Armênio clássico (a 'Rainha das Versões'), permitindo captar a precisão e a beleza desta tradição textual tão importante para a crítica textual."
      },
      {
        title: "O Valor da Tradução Literal Biblia.Creio.EU",
        text: "Enquanto as traduções comerciais buscam a fluidez ('equivalência dinâmica'), nossa curadoria foca na fidelidade estrutural. A tradução literal é de extrema importância pois permite ao estudante ver a 'anatomia' do texto original: as repetições de palavras, a ordem sintática e as ambiguidades ricas do manuscrito que desaparecem em traduções devocionais comuns."
      },
      {
        title: "Conformidade e Domínio Público",
        text: "Para garantir segurança jurídica total e liberdade de redistribuição, fundamentamos nossos dados técnicos nestas obras clássicas de domínio público, complementadas por nossa própria curadoria original de traduções e glosas."
      }
    ],
    en: [
      {
        title: "Manuscript Traditions and Witnesses",
        text: "Our project uses the most respected textual bases in history: the Masoretic Text (Codex Leningradensis and Aleppo) for Hebrew; the Septuagint (LXX) and the Byzantine Text for Greek; Jerome's Vulgate for Latin; Targum Onkelos for Aramaic; the Peshitta for Syriac; and the ancient Ethiopic (Ge'ez), Coptic, and Armenian versions. Each of these sources represents a lineage of transmission that preserves nuances and variants essential for textual criticism and deep exegesis."
      },
      {
        title: "James Strong (Strong's Concordance)",
        text: "Originally published in 1890, James Strong's numbering system has become the universal standard for non-specialist Bible study. It assigns a unique number to each root word in Hebrew and Greek, allowing students without deep linguistic knowledge to access the original lexicon and compare occurrences of terms throughout the Bible."
      },
      {
        title: "BDB (Brown-Driver-Briggs)",
        text: "This is the definitive lexicon for Biblical Hebrew. BDB is grounded in comparative Semitic philology, focusing intensely on word roots and how their meaning developed over the centuries. It is the indispensable tool for understanding the Old Testament in its original semantic depth."
      },
      {
        title: "LSJ (Liddell-Scott-Jones)",
        text: "Considered the greatest dictionary of Ancient Greek in the world. LSJ covers everything from Homeric literature to the Koine (biblical) period, offering a monumental view of how Greek words were used in philosophy, poetry, and later in the translation of the Septuagint and the New Testament."
      },
      {
        title: "Marcus Jastrow",
        text: "Marcus Jastrow's lexicon is the ultimate authority for the Aramaic of the Targumim, the Talmud, and Midrashic literature. It is fundamental to our project as it provides the interpretative keys for ancient Aramaic, capturing nuances that generic biblical lexicons often ignore."
      },
      {
        title: "Lewis & Short",
        text: "The standard for the study of classical and late Latin. It is the lexicon we use to decipher the Latin Vulgate, ensuring that Jerome's lexical choices are understood within the Roman linguistic context of the 4th century."
      },
      {
        title: "August Dillmann (Ge'ez)",
        text: "Dillmann's 'Lexicon Linguae Aethiopicae' is a monument of 19th-century scholarship and remains the primary reference work for Ge'ez (Classical Ethiopic). Without this lexicon, academic access to the rich and ancient Ethiopian biblical tradition would be virtually impossible."
      },
      {
        title: "W.E. Crum (Coptic) and Matthias Bedrossian (Armenian)",
        text: "Crum is the absolute authority for Coptic, essential for understanding the Bible in Christian Egypt. Bedrossian provides the most detailed dictionary for Classical Armenian (the 'Queen of Versions'), allowing us to capture the precision and beauty of this textual tradition so important for textual criticism."
      },
      {
        title: "The Value of the Biblia.Creio.EU Literal Translation",
        text: "While commercial translations seek flow ('dynamic equivalence'), our curation focuses on structural fidelity. The literal translation is of extreme importance as it allows the student to see the 'anatomy' of the original text: word repetitions, syntactic order, and the rich ambiguities of the manuscript that disappear in common devotional translations."
      },
      {
        title: "Compliance and Public Domain",
        text: "To ensure total legal safety and freedom of redistribution, we base our technical data on these classic public domain works, complemented by our own original curation of translations and glosses."
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

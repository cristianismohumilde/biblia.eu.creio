import Link from "next/link";
import { translations } from "../../translations";
import SiteHeader from "../../components/SiteHeader";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function FontesPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      manuscripts: {
        sectionTitle: "Manuscritos e Tradições Textuais",
        items: [
          { title: "📜 Tradição Hebraica (Texto Massorético)", text: "O Codex Leningradensis (B19A) é o manuscrito completo mais antigo da Bíblia Hebraica (1008 d.C.), servindo como base para as principais edições acadêmicas modernas (BHS). Ele garante a preservação técnica do texto do Antigo Testamento." },
          { title: "🏛️ Tradição Grega (LXX e Texto Bizantino)", text: "A Septuaginta (LXX) é a tradução grega mais antiga do Antigo Testamento (séc. III-II a.C.), sendo a versão mais citada pelos autores do Novo Testamento. O Texto Bizantino (ou Majoritário) representa a forma do texto grego preservada na maioria dos manuscritos e na liturgia da Igreja Ortodoxa, sendo fundamental para entender a transmissão viva do texto neotestamentário." },
          { title: "🐪 Tradição Aramaica (Targum Onkelos)", text: "Os Targumim são traduções e paráfrases aramaicas antigas. O Targum Onkelos é a versão oficial da Torá, essencial para compreender como os judeus do período do Segundo Templo e da era talmúdica interpretavam e aplicavam o texto bíblico em sua própria língua vernácula." },
          { title: "🦅 Tradição Latina (Vulgata)", text: "Traduzida por Jerônimo no final do século IV, a Vulgata tornou-se o texto padrão da Igreja Ocidental por mais de um milênio. Ela é uma peça-chave para rastrear a recepção teológica no Ocidente e para entender o desenvolvimento do vocabulário doutrinário latino." },
          { title: "⛪ Tradição Siríaca (Peshitta)", text: "A Peshitta é a versão 'simples' ou 'comum' utilizada pelos cristãos de fala siríaca (um dialeto do aramaico). Por ser uma língua semítica, o siríaco preserva estruturas de pensamento e nuances poéticas muito próximas do ambiente original da revelação bíblica, sendo uma das testemunhas mais antigas e consistentes." },
          { title: "🌍 Tradição Etíope (Ge'ez)", text: "A Bíblia em Ge'ez preserva uma trajetória única do cristianismo africano. A tradição etíope é famosa por ter preservado livros e variantes textuais que não sobreviveram em outras linhagens, oferecendo um horizonte comparativo valioso para a crítica textual." },
          { title: "🏺 Testemunhos Copta e Armênio", text: "O Copta (Egito) e o Armênio antigo (frequentemente chamado de 'Rainha das Versões') ajudam a reconstruir a expansão do cristianismo para além do eixo greco-latino. Esses manuscritos registram como o texto foi adaptado para culturas diversas e preservam leituras que auxiliam na identificação de variantes textuais arcaicas." }
        ]
      },
      lexicons: {
        sectionTitle: "Léxicos e Dicionários",
        items: [
          { title: "🔢 James Strong (Concordância de Strong)", text: "Publicado originalmente em 1890, o sistema de numeração de James Strong tornou-se o padrão universal para o estudo bíblico não especializado. Ele atribui um número único a cada palavra raiz no Hebraico e no Grego, permitindo que estudantes sem profundo conhecimento linguístico acessem o léxico original e comparem ocorrências de termos em toda a Bíblia." },
          { title: "📖 BDB (Brown-Driver-Briggs)", text: "Este é o léxico definitivo para o Hebraico Bíblico. O BDB é fundamentado na filologia semítica comparada, focando intensamente nas raízes das palavras e em como seu significado se desenvolveu ao longo dos séculos. É a ferramenta indispensável para entender o Antigo Testamento em sua profundidade semântica original." },
          { title: "🏛️ LSJ (Liddell-Scott-Jones)", text: "Considerado o maior dicionário de Grego Antigo do mundo. O LSJ cobre desde a literatura homérica até o período koiné (bíblico), oferecendo uma visão monumental de como as palavras gregas eram usadas na filosofia, poesia e, posteriormente, na tradução da Septuaginta e no Novo Testamento." },
          { title: "📜 Marcus Jastrow", text: "O léxico de Marcus Jastrow é a autoridade máxima para o Aramaico dos Targumim, do Talmude e da literatura Midráshica. Ele é fundamental para o nosso projeto pois fornece as chaves interpretativas para o Aramaico antigo, captando nuances que léxicos bíblicos genéricos muitas vezes ignoram." },
          { title: "🦅 Lewis & Short", text: "O padrão para o estudo do Latim clássico e tardio. É o léxico que utilizamos para decifrar a Vulgata Latina, garantindo que as escolhas lexicais de Jerônimo sejam entendidas dentro do contexto linguístico romano do século IV." },
          { title: "🌍 August Dillmann (Ge'ez)", text: "O 'Lexicon Linguae Aethiopicae' de Dillmann é um monumento da erudição do século XIX e continua sendo a obra de referência primária para o Ge'ez (Etíope clássico). Sem este léxico, o acesso acadêmico à rica e antiga tradição bíblica etíope seria virtualmente impossível." },
          { title: "🏺 W.E. Crum (Copta)", text: "Walter Ewing Crum foi o maior especialista do século XX em Copta, a língua dos cristãos egípcios. Seu dicionário monumental documenta com precisão as palavras coptas usadas na Bíblia copta, que preserva variantes textuais únicas do Egito cristão primitivo. O Copta, embora extinto como língua viva, continua sendo uma testemunha crucial para a crítica textual, especialmente ao rastrear influências e leituras da tradição alexandrina." },
          { title: "📜 Carl Brockelmann - Léxico Siríaco", text: "Carl Brockelmann (1868-1956), um dos maiores orientalistas do século XX, compilou o monumental 'Lexicon Syriacum' (1895), referência indispensável para o siríaco clássico e bíblico. A Peshitta, versão 'simples' do Antigo e Novo Testamento em siríaco, carrega um léxico profundamente ligado às raízes semíticas do hebraico e aramaico. O léxico de Brockelmann permite rastrear com precisão como termos bíblicos foram interpretados por comunidades cristãs semíticas muito próximas do período e contexto do texto original. O siríaco preserva nuances linguísticas e estruturas poéticas perdidas em tradições posteriores." },
          { title: "🏛️ Matthias Bedrossian (Armênio Clássico)", text: "Matthias Bedrossian (1817-1897) compilou o mais detalhado e erudito dicionário da língua armênia clássica. A Bíblia Armênia é frequentemente chamada de 'Rainha das Versões' por sua extraordinária fidelidade e elegância linguística. Bedrossian fornece as chaves para compreender como os antigos cristãos armênios expressavam conceitos teológicos, preservando uma perspectiva única sobre a transmissão do texto bíblico em uma tradição linguística distinta dos eixos greco-latino e semítico direto." }
        ]
      },
      about: {
        sectionTitle: "Sobre o Projeto",
        items: [
          { title: "🛡️ O Valor da Tradução Literal", text: "Enquanto as traduções comerciais buscam a fluidez ('equivalência dinâmica'), nossa curadoria foca na fidelidade estrutural. A tradução literal é de extrema importância pois permite ao estudante ver a 'anatomia' do texto original: as repetições de palavras, a ordem sintática e as ambiguidades ricas do manuscrito que desaparecem em traduções devocionais comuns." },
          { title: "⚖️ Conformidade e Domínio Público", text: "Para garantir segurança jurídica total e liberdade de redistribuição, fundamentamos nossos dados técnicos nestas obras clássicas de domínio público, complementadas por nossa própria curadoria original de traduções e glosas." }
        ]
      }
    },
    en: {
      manuscripts: {
        sectionTitle: "Manuscripts and Textual Traditions",
        items: [
          { title: "📜 Hebrew Tradition (Masoretic Text)", text: "The Codex Leningradensis (B19A) is the oldest complete manuscript of the Hebrew Bible (1008 AD), serving as the basis for major modern academic editions (BHS). It ensures the technical preservation of the Old Testament text." },
          { title: "🏛️ Greek Tradition (LXX and Byzantine Text)", text: "The Septuagint (LXX) is the oldest Greek translation of the Old Testament (3rd-2nd century BC), and was the version most cited by New Testament authors. The Byzantine (or Majority) Text represents the form of the Greek text preserved in most manuscripts and in the liturgy of the Orthodox Church, being fundamental to understanding the living transmission of the New Testament text." },
          { title: "🐪 Aramaic Tradition (Targum Onkelos)", text: "The Targumim are ancient Aramaic translations and paraphrases. Targum Onkelos is the official version of the Torah, essential for understanding how Jews of the Second Temple period and the Talmudic era interpreted and applied the biblical text in their own vernacular." },
          { title: "🦅 Latin Tradition (Vulgate)", text: "Translated by Jerome at the end of the 4th century, the Vulgate became the standard text of the Western Church for over a millennium. It is a key piece for tracking theological reception in the West and for understanding the development of Latin doctrinal vocabulary." },
          { title: "⛪ Syriac Tradition (Peshitta)", text: "The Peshitta is the 'simple' or 'common' version used by Syriac-speaking Christians (a dialect of Aramaic). As a Semitic language, Syriac preserves thought structures and poetic nuances very close to the original environment of biblical revelation, being one of the oldest and most consistent witnesses." },
          { title: "🌍 Ethiopic Tradition (Ge'ez)", text: "The Bible in Ge'ez preserves a unique trajectory of African Christianity. The Ethiopian tradition is famous for having preserved books and textual variants that did not survive in other lineages, offering a valuable comparative horizon for textual criticism." },
          { title: "🏺 Coptic and Armenian Witnesses", text: "Coptic (Egypt) and Ancient Armenian (often called the 'Queen of Versions') help reconstruct the expansion of Christianity beyond the Greco-Latin axis. These manuscripts record how the text was adapted for diverse cultures and preserve readings that assist in identifying archaic textual variants." }
        ]
      },
      lexicons: {
        sectionTitle: "Lexicons and Dictionaries",
        items: [
          { title: "🔢 James Strong (Strong's Concordance)", text: "Originally published in 1890, James Strong's numbering system has become the universal standard for non-specialist Bible study. It assigns a unique number to each root word in Hebrew and Greek, allowing students without deep linguistic knowledge to access the original lexicon and compare occurrences of terms throughout the Bible." },
          { title: "📖 BDB (Brown-Driver-Briggs)", text: "This is the definitive lexicon for Biblical Hebrew. BDB is grounded in comparative Semitic philology, focusing intensely on word roots and how their meaning developed over the centuries. It is the indispensable tool for understanding the Old Testament in its original semantic depth." },
          { title: "🏛️ LSJ (Liddell-Scott-Jones)", text: "Considered the greatest dictionary of Ancient Greek in the world. LSJ covers everything from Homeric literature to the Koine (biblical) period, offering a monumental view of how Greek words were used in philosophy, poetry, and later in the translation of the Septuagint and the New Testament." },
          { title: "📜 Marcus Jastrow", text: "Marcus Jastrow's lexicon is the ultimate authority for the Aramaic of the Targumim, the Talmud, and Midrashic literature. It is fundamental to our project as it provides the interpretative keys for ancient Aramaic, capturing nuances that generic biblical lexicons often ignore." },
          { title: "🦅 Lewis & Short", text: "The standard for the study of classical and late Latin. It is the lexicon we use to decipher the Latin Vulgate, ensuring that Jerome's lexical choices are understood within the Roman linguistic context of the 4th century." },
          { title: "🌍 August Dillmann (Ge'ez)", text: "Dillmann's 'Lexicon Linguae Aethiopicae' is a monument of 19th-century scholarship and remains the primary reference work for Ge'ez (Classical Ethiopic). Without this lexicon, academic access to the rich and ancient Ethiopian biblical tradition would be virtually impossible." },
          { title: "🏺 W.E. Crum (Coptic)", text: "Walter Ewing Crum was the greatest 20th-century expert in Coptic, the language of Egyptian Christians. His monumental dictionary documents with precision the Coptic words used in the Coptic Bible, which preserves unique textual variants from early Christian Egypt. Although extinct as a living language, Coptic remains a crucial witness for textual criticism, especially when tracing influences and readings from the Alexandrian tradition." },
          { title: "📜 Carl Brockelmann - Syriac Lexicon", text: "Carl Brockelmann (1868-1956), one of the greatest 20th-century orientalists, compiled the monumental 'Lexicon Syriacum' (1895), the indispensable reference for Classical and Biblical Syriac. The Peshitta, the 'simple' version of the Old and New Testament in Syriac, carries a lexicon deeply connected to the Semitic roots of Hebrew and Aramaic. Brockelmann's lexicon allows us to precisely trace how biblical terms were interpreted by Semitic Christian communities very close to the period and context of the original text. Syriac preserves linguistic nuances and poetic structures lost in later traditions." },
          { title: "🏛️ Matthias Bedrossian (Classical Armenian)", text: "Matthias Bedrossian (1817-1897) compiled the most detailed and erudite dictionary of the Classical Armenian language. The Armenian Bible is often called the 'Queen of Versions' for its extraordinary fidelity and linguistic elegance. Bedrossian provides the keys to understanding how ancient Armenian Christians expressed theological concepts, preserving a unique perspective on the transmission of the biblical text in a linguistic tradition distinct from the direct Greco-Latin and Semitic axes." }
        ]
      },
      about: {
        sectionTitle: "About the Project",
        items: [
          { title: "🛡️ The Value of Literal Translation", text: "While commercial translations seek flow ('dynamic equivalence'), our curation focuses on structural fidelity. The literal translation is of extreme importance as it allows the student to see the 'anatomy' of the original text: word repetitions, syntactic order, and the rich ambiguities of the manuscript that disappear in common devotional translations." },
          { title: "⚖️ Compliance and Public Domain", text: "To ensure total legal safety and freedom of redistribution, we base our technical data on these classic public domain works, complemented by our own original curation of translations and glosses." }
        ]
      }
    }
  };

  const activeContent = content[lang] || content.pt;

  const navLinks = [
    { href: `/${lang}/`, label: t.back },
    { href: `/${lang}/idiomas-biblicos`, label: t.biblicalLanguages, className: "nav-spotlight" }
  ];

  return (
    <>
      <SiteHeader 
        lang={lang}
        t={t}
        eyebrow={t.openSource}
        title={t.sources}
        subtitle={t.sourcesSubtitle}
        links={navLinks}
      />

      {Object.entries(activeContent).map(([key, section]) => (
        <div key={key} style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            marginBottom: '1.5rem', 
            paddingBottom: '0.75rem', 
            fontSize: '1.75rem',
            borderBottom: '2px solid rgba(150, 150, 150, 0.15)'
          }}>
            {section.sectionTitle}
          </h2>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {section.items.map((item, index) => (
              <section key={index} className="card" style={{ 
                margin: 0
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>{item.title}</h3>
                <p style={{ 
                  lineHeight: '1.6', 
                  opacity: 0.9,
                  margin: 0
                }}>{item.text}</p>
              </section>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

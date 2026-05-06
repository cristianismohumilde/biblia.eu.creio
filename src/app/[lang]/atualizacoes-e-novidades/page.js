import Link from "next/link";
import { translations } from "../../translations";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function UpdatesPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      title: "Atualizações e Novidades",
      articles: [
        {
          date: "06 de Maio, 2026",
          headline: "Novo Marco: Gênesis em Tradução Literal + Bíblia Inteira com Almeida",
          paragraphs: [
            "🎉 Cumprimos nosso compromisso inicial! Gênesis foi concluído com tradução literal em curadoria, e a Bíblia inteira agora está disponível com a tradução de João Ferreira de Almeida (Domínio Público).",
            "Por quê essa decisão? Como projeto de código aberto com recursos limitados, decidimos utilizar a Almeida como base sólida e gratuita para oferecer uma Bíblia completa funcionando agora, em vez de esperar meses por tradução literal de todo o texto. A Almeida é confiável, em domínio público e mantém a qualidade acadêmica que nossos usuários merecem.",
            "O plano futuro: Conforme recursos forem disponíveis, continuaremos a curadoria e tradução literal livro por livro, começando pelos que têm maior relevância litúrgica e acadêmica. Gênesis é o início dessa jornada; você verá mais avanços em breve.",
            "Enquanto isso, todos os interlineares (Hebraico, Grego, Aramaico, Latim, Ge'ez, Siríaco, Copta e Armênio) continuam íntegros com suas definições lexicais, transliterações e análise morfológica — a ferramenta de estudo que você esperava funciona plenamente."
          ]
        },
        {
          date: "05 de Maio, 2026",
          headline: "A Anatomia Sonora da Fé: Por que ouvir os textos em seus idiomas originais?",
          paragraphs: [
            "Hoje, damos um passo revolucionário na Biblia.Creio.EU: a introdução de áudio de alta fidelidade para os textos originais e as traduções literais. Mas por que isso é tão importante para o estudante da Bíblia?",
            "A Bíblia não foi apenas escrita; ela foi vocalizada. Durante milênios, a transmissão da Escritura foi prioritariamente oral. O ritmo do Hebraico, a cadência das aliterações nos Salmos e a força das homoioteleutons (rimas gramaticais) no Grego do Novo Testamento carregam camadas de significado que o olho, sozinho, muitas vezes ignora.",
            "Ao ouvir o Codex Leningradensis em Hebraico, você deixa de ver apenas sinais gráficos e passa a experimentar a sonoridade que os profetas e escribas utilizaram para fixar a revelação. A fonética bíblica ajuda na memorização, na compreensão da estrutura poética e, acima de tudo, na conexão emocional com o texto.",
            "Nossa nova ferramenta utiliza tecnologia de nuvem para garantir que, mesmo que você não saiba ler Hebraico ou Grego fluentemente, você possa 'sentir' a textura do idioma. É o início de uma nova era de imersão linguística para todos os nossos usuários."
          ]
        },
          paragraphs: [
            "Recentemente, tomamos a decisão estratégica de focar nossa base de dados de Gênesis exclusivamente no Codex Leningradensis (B19A) para a tradição hebraica massorética. Mas qual a importância técnica disso?",
            "O Codex Leningradensis é o manuscrito completo mais antigo da Bíblia Hebraica (aprox. 1008 d.C.). Ele é o 'irmão' mais novo do Códice de Aleppo (que está incompleto) e serve como base para as edições acadêmicas modernas como a BHS. O mais fascinante é que, ao compararmos o B19A com os Manuscritos do Mar Morto (DSS), descobertos em Qumran e mil anos mais antigos, vemos que o texto é praticamente idêntico. Isso prova a precisão milenar da transmissão dos escribas judeus.",
            "Para gerar esses textos com precisão acadêmica, utilizamos as fontes em domínio público do projeto TanakhML (distribuído em formato OSIS XML), garantindo que cada acento e vogal massorética siga os padrões internacionais de crítica textual.",
            "Esta mudança permite uma interface mais limpa e um foco maior na curadoria das traduções literais e na análise morfológica, garantindo a você a melhor ferramenta de estudo possível."
          ]
        }
      ]
    },
    en: {
      title: "Updates and News",
      articles: [
        {
          date: "May 06, 2026",
          headline: "New Milestone: Genesis in Literal Translation + Full Bible with Almeida",
          paragraphs: [
            "🎉 We fulfilled our initial commitment! Genesis has been completed with curated literal translation, and the entire Bible is now available with the translation of João Ferreira de Almeida (Public Domain).",
            "Why this decision? As an open-source project with limited resources, we chose to use Almeida as a solid and free foundation to offer a complete, functioning Bible now, rather than wait months for a literal translation of the entire text. Almeida is reliable, public domain, and maintains the academic quality our users deserve.",
            "The future plan: As resources become available, we will continue with curation and literal translation book by book, starting with those of greater liturgical and academic relevance. Genesis is the beginning of this journey; you will see more progress soon.",
            "Meanwhile, all interlinears (Hebrew, Greek, Aramaic, Latin, Ge'ez, Syriac, Coptic, and Armenian) remain intact with their lexical definitions, transliterations, and morphological analysis — the study tool you've been waiting for works fully."
          ]
        },
        {
          date: "May 05, 2026",
          headline: "The Sonic Anatomy of Faith: Why listen to the texts in their original languages?",
          paragraphs: [
            "Today, we take a revolutionary step at Biblia.Creio.EU: the introduction of high-fidelity audio for the original texts and literal translations. But why is this so important for the Bible student?",
            "The Bible was not just written; it was vocalized. For millennia, the transmission of Scripture was primarily oral. The rhythm of Hebrew, the cadence of alliterations in the Psalms, and the power of homoioteleutons (grammatical rhymes) in New Testament Greek carry layers of meaning that the eye alone often ignores.",
            "By listening to the Codex Leningradensis in Hebrew, you stop seeing only graphic signs and begin to experience the sound that the prophets and scribes used to fix the revelation. Biblical phonetics helps in memorization, in understanding the poetic structure, and, above all, in the emotional connection with the text.",
            "Our new tool uses cloud technology to ensure that, even if you don't know how to read Hebrew or Greek fluently, you can 'feel' the texture of the language. It is the beginning of a new era of linguistic immersion for all our users."
          ]
        },
        {
          date: "May 04, 2026",
          headline: "Hebrew Text Unification: Why Codex Leningradensis (B19A)?",
          paragraphs: [
            "Recently, we made the strategic decision to focus our Genesis database exclusively on the Codex Leningradensis (B19A) for the Masoretic Hebrew tradition. But what is the technical significance of this?",
            "The Codex Leningradensis is the oldest complete manuscript of the Hebrew Bible (approx. 1008 AD). It is the younger 'brother' of the Aleppo Codex (which is incomplete) and serves as the basis for modern academic editions such as the BHS. What's most fascinating is that when we compare B19A with the Dead Sea Scrolls (DSS), discovered in Qumran and a thousand years older, we see that the text is virtually identical. This proves the millennial precision of the transmission by Jewish scribes.",
            "To generate these texts with academic precision, we utilized the public domain sources from the TanakhML project (distributed in OSIS XML format), ensuring that every accent and Masoretic vowel follows international textual criticism standards.",
            "This change allows for a cleaner interface and a greater focus on the curation of literal translations and morphological analysis, ensuring you have the best possible study tool."
          ]
        }
      ]
    }
  };

  const active = content[lang] || content.pt;

  return (
    <div className="updates-container">
      <header className="site-header" style={{ marginBottom: '3rem' }}>
        <div>
          <p className="brand-eyebrow">Biblia.Creio.EU</p>
          <h1>{active.title}</h1>
        </div>
        <nav className="quick-nav">
          <Link href={`/${lang}/`}>{t.back || "Voltar"}</Link>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle t={t} />
        </nav>
      </header>

      {active.articles.map((article, idx) => (
        <article key={idx} className="update-card" style={{ marginBottom: '2rem' }}>
          <div className="update-header">
            <span className="update-date">{article.date}</span>
            <h2 className="update-title">{article.headline}</h2>
          </div>
          
          <div className="update-content">
            {article.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      ))}

      <div style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '4rem' }}>
        <Link href={`/${lang}/`} className="support-cta">
          {lang === 'en' ? "Back to Study" : "Voltar ao Estudo"}
        </Link>
      </div>
    </div>
  );

}

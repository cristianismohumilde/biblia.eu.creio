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
      date: "04 de Maio, 2026",
      headline: "Unificação do Texto Hebraico: Por que o Codex Leningradensis (B19A)?",
      paragraphs: [
        "Recentemente, tomamos a decisão estratégica de focar nossa base de dados de Gênesis exclusivamente no Codex Leningradensis (B19A) para a tradição hebraica massorética.",
        "O Codex Leningradensis é o manuscrito completo mais antigo da Bíblia Hebraica que sobreviveu até os nossos dias (datado de aproximadamente 1008 d.C.). Ele serve como o 'texto padrão' (textus receptus acadêmico) para as edições críticas modernas mais respeitadas no mundo, como a Biblia Hebraica Stuttgartensia (BHS).",
        "Ao contrário de outros manuscritos famosos como o Códice de Aleppo (que está severamente incompleto, especialmente na Torá) ou os Manuscritos do Mar Morto (que são fragmentários e separados por milênios), o B19A nos oferece uma visão orgânica, completa e tecnicamente impecável de Gênesis.",
        "Nossos estudos comparativos mostram que, para o livro de Gênesis, as variantes encontradas nos fragmentos mais antigos não alteram a substância teológica ou estrutural do texto preservado no Leningradensis. Portanto, para o estudante e o acadêmico, o B19A oferece a base mais sólida e confiável para um estudo interlinear profundo, sem a confusão de múltiplas variantes fragmentadas que dificultam a visualização da 'anatomia' do texto bíblico.",
        "Esta mudança permite uma interface mais limpa e um foco maior na curadoria das traduções literais e na análise morfológica, garantindo a você a melhor ferramenta de estudo possível."
      ]
    },
    en: {
      title: "Updates and News",
      date: "May 04, 2026",
      headline: "Hebrew Text Unification: Why Codex Leningradensis (B19A)?",
      paragraphs: [
        "Recently, we made the strategic decision to focus our Genesis database exclusively on the Codex Leningradensis (B19A) for the Masoretic Hebrew tradition.",
        "The Codex Leningradensis is the oldest complete manuscript of the Hebrew Bible that has survived to this day (dated to approximately 1008 AD). It serves as the 'standard text' (academic textus receptus) for the most respected modern critical editions in the world, such as the Biblia Hebraica Stuttgartensia (BHS).",
        "Unlike other famous manuscripts like the Aleppo Codex (which is severely incomplete, especially in the Torah) or the Dead Sea Scrolls (which are fragmentary and separated by millennia), B19A offers us an organic, complete, and technically flawless view of Genesis.",
        "Our comparative studies show that, for the book of Genesis, the variants found in the oldest fragments do not alter the theological or structural substance of the text preserved in Leningradensis. Therefore, for both the student and the scholar, B19A provides the most solid and reliable basis for deep interlinear study, without the confusion of multiple fragmented variants that make it difficult to visualize the 'anatomy' of the biblical text.",
        "This change allows for a cleaner interface and a greater focus on the curation of literal translations and morphological analysis, ensuring you have the best possible study tool."
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

      <article className="update-card">
        <div className="update-header">
          <span className="update-date">{active.date}</span>
          <h2 className="update-title">{active.headline}</h2>
        </div>
        
        <div className="update-content">
          {active.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href={`/${lang}/`} className="support-cta">
            {lang === 'en' ? "Back to Study" : "Voltar ao Estudo"}
          </Link>
        </div>
      </article>
    </div>
  );
}

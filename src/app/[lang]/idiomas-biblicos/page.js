import Link from "next/link";
import { translations } from "../../translations";
import SiteHeader from "../../components/SiteHeader";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export default async function IdiomasBiblicosPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      methodology: {
        sectionTitle: "Metodologia e Impacto",
        items: [
          { title: "🎯 A Importância para Estudantes e Leitores", text: "O projeto Biblia.Creio.EU democratiza o acesso a ferramentas acadêmicas de alta qualidade, permitindo que qualquer pessoa — do leitor devocional leigo ao pesquisador experiente — tenha contato direto com as fontes originais das Escrituras. Ao integrar múltiplos idiomas antigos, transliterações precisas e léxicos históricos, quebramos a barreira da língua e proporcionamos um ambiente seguro para o aprofundamento teológico. Nossa missão é resgatar a riqueza estrutural do texto sagrado, garantindo que a beleza, a precisão e a profundidade da revelação original não se percam em traduções simplificadas, equipando a Igreja e a academia com recursos de excelência de forma livre e acessível." },
          { title: "📊 Resumo Metodológico", text: "Trabalhar com múltiplos idiomas não é apenas 'ter mais traduções': é comparar testemunhas de épocas, regiões e tradições diferentes com critérios históricos e filológicos. Essa abordagem permite detectar variantes, pesar escolhas interpretativas antigas e evitar leituras anacrônicas. Na prática, o estudo multilíngue fortalece a exegese, melhora a transparência metodológica e torna a leitura bíblica mais robusta e verificável." }
        ]
      },
      languages: {
        sectionTitle: "Idiomas Bíblicos e Tradições",
        items: [
          { title: "📜 Hebraico", text: "É a língua-base da maior parte do Antigo Testamento e, por isso, o primeiro filtro para qualquer leitura séria do texto bíblico. O hebraico bíblico carrega jogos de palavras, paralelismos poéticos, fórmulas de aliança e expressões idiomáticas que nem sempre sobrevivem em traduções modernas. Estudar sua sintaxe verbal e seu campo semântico ajuda a distinguir nuance narrativa, tom profético e ênfase teológica com muito mais precisão." },
          { title: "🐪 Aramaico", text: "Aparece em porções do Antigo Testamento (como Daniel e Esdras) e em tradições judaicas relevantes para o ambiente do Segundo Templo. O aramaico funciona como ponte histórica entre diferentes comunidades semíticas e ajuda a explicar mudanças de vocabulário, fórmulas jurídicas e títulos religiosos. Ele também ilumina o pano de fundo linguístico em que o judaísmo tardio e o cristianismo primitivo dialogaram." },
          { title: "🏛️ Grego", text: "É a língua do Novo Testamento e também da Septuaginta (LXX), tradução grega antiga do Antigo Testamento que moldou a leitura cristã desde cedo. O grego koiné permite observar com clareza como autores neotestamentários articulam conceitos como graça, fé, justiça e reino. Comparar o grego da LXX com o hebraico massorético e com citações no Novo Testamento revela linhas interpretativas antigas e decisões exegéticas de grande impacto." },
          { title: "🦅 Latim", text: "A Vulgata exerceu influência profunda na tradição cristã ocidental por muitos séculos, tornando-se referência litúrgica, pastoral e acadêmica. O latim é essencial para rastrear como conceitos bíblicos foram recebidos em concílios, comentários patrísticos tardios e teologia medieval. Sem ele, perde-se parte decisiva da história interpretativa que formou o vocabulário doutrinário do Ocidente." },
          { title: "🌍 Ge'ez", text: "A tradição etíope em Ge'ez preserva formas textuais antigas e uma recepção bíblica com trajetória própria, muitas vezes pouco explorada em estudos ocidentais. Esse idioma amplia o horizonte comparativo ao oferecer testemunhos fora do eixo greco-latino clássico. Ele é especialmente útil para investigar circulação, adaptação e preservação de tradições bíblicas em contextos africanos cristãos históricos." },
          { title: "⛪ Siríaco", text: "A Peshitta e outras tradições siríacas são testemunhas-chave do cristianismo oriental e de sua vida litúrgica e teológica. Por ser uma língua semítica, o siríaco ajuda a captar estruturas de pensamento próximas ao ambiente do hebraico e do aramaico, ao mesmo tempo em que dialoga com o grego. Isso faz dele uma fonte valiosa para crítica textual e para exegese comparada entre Oriente e Ocidente." },
          { title: "🏺 Copta", text: "Os testemunhos coptas ajudam a reconstruir a recepção bíblica no Egito cristão e preservam leituras relevantes em diferentes dialetos e tradições manuscritas. Em crítica textual do Novo Testamento, o copta frequentemente funciona como apoio para identificar variantes antigas e padrões de transmissão regional. Ele também contribui para entender práticas catequéticas, litúrgicas e monásticas que moldaram a interpretação do texto." },
          { title: "🏺 Armênio", text: "A versão armênia antiga conserva tradições textuais relevantes e, em vários casos, registra leituras úteis para avaliar variantes difíceis. A tradição bíblica armênia é importante para mapear a expansão do cristianismo para além dos grandes centros mediterrâneos e observar processos locais de recepção. Seu valor cresce quando comparada com grego, siríaco e latim em passagens com transmissão complexa." }
        ]
      }
    },
    en: {
      methodology: {
        sectionTitle: "Methodology and Impact",
        items: [
          { title: "🎯 The Importance for Students and Readers", text: "The Biblia.Creio.EU project democratizes access to high-quality academic tools, allowing anyone — from the lay devotional reader to the experienced researcher — to have direct contact with the original sources of the Scriptures. By integrating multiple ancient languages, precise transliterations, and historical lexicons, we break the language barrier and provide a safe environment for theological deepening. Our mission is to rescue the structural richness of the sacred text, ensuring that the beauty, precision, and depth of the original revelation are not lost in simplified translations, equipping the Church and the academy with excellent resources freely and accessibly." },
          { title: "📊 Methodological Summary", text: "Working with multiple languages is not just 'having more translations': it is comparing witnesses from different eras, regions, and traditions with historical and philological criteria. This approach allows for detecting variants, weighing ancient interpretative choices, and avoiding anachronistic readings. In practice, multilingual study strengthens exegesis, improves methodological transparency, and makes biblical reading more robust and verifiable." }
        ]
      },
      languages: {
        sectionTitle: "Biblical Languages and Traditions",
        items: [
          { title: "📜 Hebrew", text: "It is the base language of most of the Old Testament and, therefore, the first filter for any serious reading of the biblical text. Biblical Hebrew carries wordplay, poetic parallelisms, covenant formulas, and idioms that do not always survive in modern translations. Studying its verbal syntax and semantic field helps to distinguish narrative nuance, prophetic tone, and theological emphasis with much more precision." },
          { title: "🐪 Aramaic", text: "It appears in portions of the Old Testament (such as Daniel and Ezra) and in Jewish traditions relevant to the Second Temple environment. Aramaic works as a historical bridge between different Semitic communities and helps explain changes in vocabulary, legal formulas, and religious titles. It also illuminates the linguistic background in which late Judaism and early Christianity dialogued." },
          { title: "🏛️ Greek", text: "It is the language of the New Testament and also of the Septuagint (LXX), the ancient Greek translation of the Old Testament that shaped Christian reading from early on. Koine Greek allows for clearly observing how New Testament authors articulate concepts such as grace, faith, justice, and kingdom. Comparing the Greek of the LXX with the Masoretic Hebrew and with citations in the New Testament reveals ancient interpretative lines and exeggetical decisions of great impact." },
          { title: "🦅 Latin", text: "The Vulgate exerted deep influence on the Western Christian tradition for many centuries, becoming a liturgical, pastoral, and academic reference. Latin is essential for tracking how biblical concepts were received in councils, late patristic commentaries, and medieval theology. Without it, a decisive part of the interpretative history that formed the doctrinal vocabulary of the West is lost." },
          { title: "🌍 Ge'ez", text: "The Ethiopian tradition in Ge'ez preserves ancient textual forms and a biblical reception with its own trajectory, often little explored in Western studies. This language expands the comparative horizon by offering witnesses outside the classic Greco-Latin axis. It is especially useful for investigating circulation, adaptation, and preservation of biblical traditions in historical African Christian contexts." },
          { title: "⛪ Syriac", text: "The Peshitta and other Syriac traditions are key witnesses of Eastern Christianity and its liturgical and theological life. Being a Semitic language, Syriac helps capture structures of thought close to the environment of Hebrew and Aramaic, while at the same time dialoguing with Greek. This makes it a valuable source for textual criticism and for comparative exegesis between East and West." },
          { title: "🏺 Coptic", text: "Coptic witnesses help reconstruct biblical reception in Christian Egypt and preserve relevant readings in different dialects and manuscript traditions. In New Testament textual criticism, Coptic often works as support for identifying ancient variants and regional transmission patterns. It also contributes to understanding catechetical, liturgical, and monastic practices that shaped the interpretation of the text." },
          { title: "🏺 Armenian", text: "The ancient Armenian version preserves relevant textual traditions and, in several cases, records useful readings for evaluating difficult variants. The Armenian biblical tradition is important for mapping the expansion of Christianity beyond the major Mediterranean centers and observing local processes of reception. Its value grows when compared with Greek, Syriac, and Latin in passages with complex transmission." }
        ]
      }
    }
  };

  const activeContent = content[lang] || content.pt;

  const navLinks = [
    { href: `/${lang}/`, label: t.back },
    { href: `/${lang}/idiomas-biblicos`, label: t.biblicalLanguages, className: "nav-spotlight" },
    { href: `/${lang}/fontes`, label: t.sources }
  ];

  return (
    <>
      <SiteHeader 
        lang={lang}
        t={t}
        eyebrow={t.biblicalStudies}
        title={t.biblicalLanguages}
        subtitle={t.languagesSubtitle}
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

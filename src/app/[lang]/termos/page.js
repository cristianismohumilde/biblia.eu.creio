import Link from "next/link";
import { translations } from "../../translations";
import SiteHeader from "../../components/SiteHeader";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export const metadata = {
  title: "Termos de Uso | Biblia.Creio.EU",
  description: "Termos de Uso do Biblia.Creio.EU — regras de utilização da plataforma open source.",
};

export default async function TermosPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      title: "Termos de Uso",
      subtitle: "Regras de utilização do Biblia.Creio.EU",
      lastUpdated: "Última atualização: 14 de maio de 2026",
      intro: "Bem-vindo ao Biblia.Creio.EU. Ao acessar e utilizar o nosso site, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso. Leia-os com atenção. Se não concordar com alguma destas condições, por favor não utilize o site.",
      sections: [
        {
          title: "1. Natureza do Projeto",
          items: [
            "O Biblia.Creio.EU é um projeto de código aberto (open source) hospedado no GitHub, sem fins lucrativos, criado com o objetivo de fornecer ferramentas para o estudo bíblico interlinear.",
            "O acesso ao site é público, gratuito e não exige criação de conta."
          ]
        },
        {
          title: "2. Propriedade Intelectual e Licenças",
          items: [
            "O código-fonte da aplicação é disponibilizado sob licença MIT e pode ser acessado em nosso repositório no GitHub.",
            "Os textos bíblicos e dicionários estão sujeitos às suas respectivas licenças (domínio público ou licenças abertas específicas). Verifique a página de Fontes e Referências para mais detalhes.",
            "É proibido copiar ou redistribuir conteúdo com direitos autorais restritos de terceiros presentes neste site sem a devida autorização."
          ]
        },
        {
          title: "3. Uso Permitido",
          items: [
            "Você pode utilizar o site para estudo pessoal, pesquisa teológica e leitura bíblica.",
            "Não é permitido utilizar a plataforma de forma automatizada (ex: bots, scrapers) que possa sobrecarregar a infraestrutura e prejudicar outros usuários.",
            "O uso da síntese de voz (áudio neural) é disponibilizado como ferramenta de estudo e não deve ser extraído ou retransmitido comercialmente."
          ]
        },
        {
          title: "4. Isenção de Responsabilidade",
          items: [
            "A plataforma é fornecida 'no estado em que se encontra', sem garantias de qualquer tipo, expressas ou implícitas.",
            "Apesar do nosso esforço em garantir a precisão dos textos e traduções interlineares, podem ocorrer erros de formatação ou de tradução baseados nas fontes de dados originais. O projeto não se responsabiliza por eventuais danos ou prejuízos decorrentes da utilização da plataforma."
          ]
        },
        {
          title: "5. Modificações na Plataforma e Termos",
          items: [
            "Reservamo-nos o direito de alterar, suspender ou descontinuar o site (ou qualquer parte dele) a qualquer momento, sem aviso prévio.",
            "Estes Termos de Uso podem ser atualizados periodicamente. Recomendamos que os revise regularmente. O uso contínuo do site após alterações significa que você aceita os novos termos."
          ]
        },
        {
          title: "6. Contato",
          items: [
            "Dúvidas ou sugestões? Entre em contato através do nosso repositório no GitHub: https://github.com/cristianismohumilde/biblia.eu.creio",
            "Para questões de privacidade, consulte nossa Política de Privacidade."
          ]
        }
      ]
    },
    en: {
      title: "Terms of Use",
      subtitle: "Rules of use for Biblia.Creio.EU",
      lastUpdated: "Last updated: May 14, 2026",
      intro: "Welcome to Biblia.Creio.EU. By accessing and using our website, you agree to comply with and be bound by the following Terms of Use. Please read them carefully. If you do not agree with any of these conditions, please do not use the site.",
      sections: [
        {
          title: "1. Nature of the Project",
          items: [
            "Biblia.Creio.EU is an open source project hosted on GitHub, not-for-profit, created with the goal of providing tools for interlinear Bible study.",
            "Access to the site is public, free, and does not require account creation."
          ]
        },
        {
          title: "2. Intellectual Property and Licenses",
          items: [
            "The application's source code is available under the MIT license and can be accessed in our GitHub repository.",
            "Biblical texts and dictionaries are subject to their respective licenses (public domain or specific open licenses). Check the Sources and References page for more details.",
            "It is prohibited to copy or redistribute copyrighted content from third parties present on this site without proper authorization."
          ]
        },
        {
          title: "3. Permitted Use",
          items: [
            "You may use the site for personal study, theological research, and Bible reading.",
            "It is not permitted to use the platform in an automated way (e.g., bots, scrapers) that may overload the infrastructure and harm other users.",
            "The use of voice synthesis (neural audio) is provided as a study tool and must not be extracted or retransmitted commercially."
          ]
        },
        {
          title: "4. Disclaimer",
          items: [
            "The platform is provided 'as is', without warranties of any kind, express or implied.",
            "Despite our efforts to ensure the accuracy of interlinear texts and translations, formatting or translation errors based on the original data sources may occur. The project is not responsible for any damages or losses arising from the use of the platform."
          ]
        },
        {
          title: "5. Modifications to the Platform and Terms",
          items: [
            "We reserve the right to modify, suspend, or discontinue the site (or any part thereof) at any time, without prior notice.",
            "These Terms of Use may be updated periodically. We recommend that you review them regularly. Continued use of the site after changes indicates your acceptance of the new terms."
          ]
        },
        {
          title: "6. Contact",
          items: [
            "Questions or suggestions? Contact us through our GitHub repository: https://github.com/cristianismohumilde/biblia.eu.creio",
            "For privacy concerns, please refer to our Privacy Policy."
          ]
        }
      ]
    }
  };

  const active = content[lang] || content.pt;

  return (
    <div className="privacy-page">
      <SiteHeader
        lang={lang}
        t={t}
        eyebrow="Biblia.Creio.EU"
        title={active.title}
        subtitle={active.subtitle}
        links={[
          { href: `/${lang}/`, label: t.backToHome }
        ]}
      />

      <p className="privacy-updated">{active.lastUpdated}</p>

      <div className="privacy-intro card">{active.intro}</div>

      {active.sections.map((section, idx) => (
        <section key={idx} className="card privacy-section">
          <h2 className="privacy-section-title">{section.title}</h2>
          <ul className="privacy-list">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <div className="privacy-footer-nav">
        <Link href={`/${lang}/`} className="support-cta">
          {t.backToHome}
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { translations } from "../../translations";
import SiteHeader from "../../components/SiteHeader";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export const metadata = {
  title: "Política de Privacidade | Biblia.Creio.EU",
  description:
    "Política de Privacidade completa do Biblia.Creio.EU — conformidade com LGPD, GDPR, CCPA e padrões globais.",
};

export default async function PrivacidadePage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      title: "Política de Privacidade",
      subtitle: "Transparência total sobre como tratamos seus dados.",
      lastUpdated: "Última atualização: 14 de maio de 2026",
      intro:
        "O Biblia.Creio.EU é um projeto open source dedicado ao estudo bíblico interlinear. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018, Brasil), o GDPR (Regulamento Geral sobre a Proteção de Dados, UE), o CCPA (California Consumer Privacy Act), o PIPEDA (Canadá), o PDPA (Singapura) e demais normas internacionais aplicáveis.",
      sections: [
        {
          title: "1. Dados Coletados",
          items: [
            "Dados de navegação (endereço IP, tipo de navegador, páginas visitadas) coletados automaticamente via logs do servidor de hospedagem (GitHub Pages).",
            "Preferências de tema (claro/escuro) e idioma, armazenadas localmente no seu dispositivo (localStorage) — nunca enviadas a servidores externos.",
            "Dados de cookies estritamente necessários ao funcionamento do site.",
            "Caso você utilize o formulário de contato ou abra uma issue no GitHub, os dados fornecidos voluntariamente (nome, e-mail, mensagem) serão tratados apenas para responder à sua solicitação.",
          ],
        },
        {
          title: "2. Finalidade do Tratamento",
          items: [
            "Funcionamento e melhoria contínua da plataforma.",
            "Análise de desempenho e diagnóstico de erros.",
            "Comunicação com colaboradores e usuários que nos contactam diretamente.",
            "Cumprimento de obrigações legais.",
          ],
        },
        {
          title: "3. Base Legal",
          items: [
            "Legítimo interesse (art. 7º, IX, LGPD / art. 6(1)(f) GDPR): para garantir o funcionamento e segurança da plataforma.",
            "Consentimento (art. 7º, I, LGPD / art. 6(1)(a) GDPR): para cookies não essenciais e análises de uso, obtido via banner de consentimento.",
            "Obrigação legal: quando exigido por autoridades competentes.",
          ],
        },
        {
          title: "4. Compartilhamento de Dados",
          items: [
            "GitHub (Microsoft): infraestrutura de hospedagem (GitHub Pages) e gestão de código-fonte.",
            "Azure Cognitive Services (Microsoft): síntese de áudio neural, utilizado apenas durante a sessão do usuário, sem armazenamento persistente de dados pessoais.",
            "Nunca vendemos, alugamos ou comercializamos seus dados pessoais com terceiros.",
            "Qualquer parceiro tem contrato de confidencialidade e uso limitado à finalidade contratada.",
          ],
        },
        {
          title: "5. Armazenamento e Retenção",
          items: [
            "Preferências locais (tema, idioma): armazenadas exclusivamente no seu dispositivo e removidas quando você limpa os dados do navegador.",
            "Logs de acesso: retidos pelo período mínimo exigido por lei ou necessário para diagnóstico de segurança, e excluídos após esse período.",
            "Dados de contato: mantidos apenas pelo tempo necessário para responder à solicitação.",
          ],
        },
        {
          title: "6. Segurança",
          items: [
            "Comunicação via HTTPS (TLS) em todo o site.",
            "Acesso ao repositório e configurações restrito a mantenedores autorizados.",
            "Chaves de API armazenadas como Secrets no GitHub Actions, nunca expostas no código-fonte.",
            "Auditorias periódicas de dependências e configurações.",
          ],
        },
        {
          title: "7. Seus Direitos",
          items: [
            "Acesso: solicitar cópia dos dados que possuímos sobre você.",
            "Retificação: corrigir dados incorretos ou desatualizados.",
            "Exclusão ('direito ao esquecimento'): solicitar a remoção dos seus dados.",
            "Portabilidade: receber seus dados em formato estruturado.",
            "Revogação do consentimento: retirar o consentimento a qualquer momento, sem afetar tratamentos anteriores.",
            "Oposição: opor-se ao tratamento baseado em legítimo interesse.",
            "Para exercer qualquer desses direitos, envie e-mail para: ajuda@creio.eu",
          ],
        },
        {
          title: "8. Cookies",
          items: [
            "Utilizamos apenas cookies estritamente necessários por padrão.",
            "Cookies analíticos e de preferência são ativados somente com seu consentimento explícito.",
            "Consulte nosso Aviso de Cookies para detalhes completos.",
          ],
        },
        {
          title: "9. Transferência Internacional",
          items: [
            "Os dados processados pelo GitHub Pages e Azure podem ser tratados em servidores nos EUA e na Europa.",
            "Essas transferências são realizadas com garantias adequadas (Cláusulas Contratuais Padrão / SCCs do GDPR e equivalentes LGPD).",
          ],
        },
        {
          title: "10. Notificação de Incidentes",
          items: [
            "Em caso de violação de dados que possa representar risco relevante, notificaremos os usuários afetados e a autoridade competente (ANPD no Brasil, DPA na UE) dentro dos prazos legais.",
          ],
        },
        {
          title: "11. Atualizações desta Política",
          items: [
            "Esta política pode ser atualizada periodicamente. Mudanças significativas serão comunicadas via banner no site.",
            "A data de 'última atualização' sempre refletirá a versão mais recente.",
          ],
        },
        {
          title: "12. Contato",
          items: [
            "Encarregado de Dados (DPO): Venelouis Tyago",
            "E-mail: ajuda@creio.eu",
            "GitHub: https://github.com/cristianismohumilde/biblia.eu.creio",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      subtitle: "Full transparency on how we handle your data.",
      lastUpdated: "Last updated: May 14, 2026",
      intro:
        "Biblia.Creio.EU is an open source project dedicated to interlinear Bible study. This Privacy Policy describes how we collect, use, store, and protect your personal data, in compliance with the LGPD (Law No. 13,709/2018, Brazil), the GDPR (General Data Protection Regulation, EU), the CCPA (California Consumer Privacy Act), PIPEDA (Canada), PDPA (Singapore), and other applicable international standards.",
      sections: [
        {
          title: "1. Data Collected",
          items: [
            "Browsing data (IP address, browser type, pages visited) collected automatically via hosting server logs (GitHub Pages).",
            "Theme (light/dark) and language preferences, stored locally on your device (localStorage) — never sent to external servers.",
            "Strictly necessary cookies for site functionality.",
            "If you use the contact form or open an issue on GitHub, voluntarily provided data (name, email, message) will be used solely to respond to your request.",
          ],
        },
        {
          title: "2. Purpose of Processing",
          items: [
            "Platform operation and continuous improvement.",
            "Performance analysis and error diagnostics.",
            "Communication with contributors and users who contact us directly.",
            "Compliance with legal obligations.",
          ],
        },
        {
          title: "3. Legal Basis",
          items: [
            "Legitimate interest (Art. 7(IX) LGPD / Art. 6(1)(f) GDPR): to ensure platform operation and security.",
            "Consent (Art. 7(I) LGPD / Art. 6(1)(a) GDPR): for non-essential cookies and usage analytics, obtained via consent banner.",
            "Legal obligation: when required by competent authorities.",
          ],
        },
        {
          title: "4. Data Sharing",
          items: [
            "GitHub (Microsoft): hosting infrastructure (GitHub Pages) and source code management.",
            "Azure Cognitive Services (Microsoft): neural audio synthesis, used only during the user session, with no persistent storage of personal data.",
            "We never sell, rent, or commercialize your personal data with third parties.",
            "Any partner has a confidentiality agreement and use limited to the contracted purpose.",
          ],
        },
        {
          title: "5. Storage and Retention",
          items: [
            "Local preferences (theme, language): stored exclusively on your device and removed when you clear browser data.",
            "Access logs: retained for the minimum period required by law or necessary for security diagnostics, and deleted after that period.",
            "Contact data: kept only for the time necessary to respond to the request.",
          ],
        },
        {
          title: "6. Security",
          items: [
            "HTTPS (TLS) communication across the entire site.",
            "Repository and settings access restricted to authorized maintainers.",
            "API keys stored as Secrets in GitHub Actions, never exposed in source code.",
            "Periodic dependency and configuration audits.",
          ],
        },
        {
          title: "7. Your Rights",
          items: [
            "Access: request a copy of the data we hold about you.",
            "Rectification: correct incorrect or outdated data.",
            "Erasure ('right to be forgotten'): request deletion of your data.",
            "Portability: receive your data in a structured format.",
            "Withdrawal of consent: withdraw consent at any time without affecting prior processing.",
            "Objection: object to processing based on legitimate interest.",
            "To exercise any of these rights, send an email to: ajuda@creio.eu",
          ],
        },
        {
          title: "8. Cookies",
          items: [
            "We use only strictly necessary cookies by default.",
            "Analytical and preference cookies are activated only with your explicit consent.",
            "See our Cookie Notice for full details.",
          ],
        },
        {
          title: "9. International Transfers",
          items: [
            "Data processed by GitHub Pages and Azure may be handled on servers in the US and Europe.",
            "These transfers are made with adequate safeguards (Standard Contractual Clauses / SCCs under GDPR and LGPD equivalents).",
          ],
        },
        {
          title: "10. Incident Notification",
          items: [
            "In the event of a data breach that may pose a significant risk, we will notify affected users and the competent authority (ANPD in Brazil, DPA in the EU) within the legal deadlines.",
          ],
        },
        {
          title: "11. Policy Updates",
          items: [
            "This policy may be updated periodically. Significant changes will be communicated via a banner on the site.",
            "The 'last updated' date will always reflect the most recent version.",
          ],
        },
        {
          title: "12. Contact",
          items: [
            "Data Protection Officer (DPO): Venelouis Tyago",
            "Email: ajuda@creio.eu",
            "GitHub: https://github.com/cristianismohumilde/biblia.eu.creio",
          ],
        },
      ],
    },
  };

  const active = content[lang] || content.pt;
  const cookieHref = `/${lang}/cookies`;

  return (
    <div className="privacy-page">
      <SiteHeader
        lang={lang}
        t={t}
        eyebrow="Biblia.Creio.EU"
        title={active.title}
        subtitle={active.subtitle}
        links={[
          { href: `/${lang}/`, label: t.backToHome },
          { href: cookieHref, label: lang === "pt" ? "🍪 Aviso de Cookies" : "🍪 Cookie Notice" },
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
        <Link href={cookieHref} className="support-cta support-cta--github">
          {lang === "pt" ? "🍪 Ver Aviso de Cookies" : "🍪 View Cookie Notice"}
        </Link>
        <Link href={`/${lang}/`} className="support-cta">
          {t.backToHome}
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { translations } from "../../translations";
import SiteHeader from "../../components/SiteHeader";
import RevokeConsentButton from "../../components/RevokeConsentButton";

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export const metadata = {
  title: "Aviso de Cookies | Biblia.Creio.EU",
  description:
    "Aviso de Cookies do Biblia.Creio.EU — entenda quais cookies usamos e como gerenciá-los.",
};

export default async function CookiesPage({ params }) {
  const { lang } = await params;
  const t = translations[lang] || translations.pt;

  const content = {
    pt: {
      title: "Aviso de Cookies",
      subtitle: "Como usamos cookies e como você pode controlá-los.",
      lastUpdated: "Última atualização: 14 de maio de 2026",
      intro:
        "Este Aviso de Cookies explica o que são cookies, quais utilizamos nesta plataforma, por quê os utilizamos e como você pode gerenciá-los. Utilizamos cookies em conformidade com a LGPD, o GDPR e outras legislações aplicáveis.",
      whatTitle: "O que são cookies?",
      whatText:
        "Cookies são pequenos arquivos de texto armazenados pelo seu navegador no seu dispositivo quando você visita um site. Eles servem para lembrar suas preferências, garantir o funcionamento correto do site e, quando com seu consentimento, coletar dados analíticos.",
      tableTitle: "Cookies que utilizamos",
      tableHeaders: ["Nome / Categoria", "Tipo", "Finalidade", "Duração", "Base Legal"],
      cookies: [
        {
          name: "theme",
          type: "Preferência",
          purpose: "Salva sua preferência de tema (claro/escuro) para não precisar reselecionar a cada visita.",
          duration: "Persistente (localStorage)",
          basis: "Legítimo interesse",
        },
        {
          name: "lang",
          type: "Preferência",
          purpose: "Salva sua preferência de idioma (PT/EN).",
          duration: "Persistente (localStorage)",
          basis: "Legítimo interesse",
        },
        {
          name: "cookie_consent",
          type: "Estritamente necessário",
          purpose: "Registra se você aceitou ou recusou cookies não essenciais.",
          duration: "365 dias",
          basis: "Obrigação legal (LGPD/GDPR)",
        },
        {
          name: "Logs de sessão (GitHub Pages)",
          type: "Técnico / Necessário",
          purpose: "Logs automáticos da infraestrutura de hospedagem para diagnóstico de segurança e desempenho.",
          duration: "Sessão / Retidos conforme política GitHub",
          basis: "Legítimo interesse",
        },
        {
          name: "azure_speech_session",
          type: "Funcional",
          purpose: "Token temporário para síntese de áudio neural via Azure TTS. Não armazena dados pessoais.",
          duration: "Sessão",
          basis: "Execução do contrato / Consentimento",
        },
      ],
      noTrackingTitle: "O que NÃO fazemos",
      noTracking: [
        "Não utilizamos cookies de rastreamento publicitário.",
        "Não compartilhamos dados de cookies com redes de anúncios.",
        "Não vendemos dados de navegação.",
        "Não utilizamos fingerprinting ou técnicas de rastreamento invasivo.",
      ],
      manageTitle: "Como gerenciar cookies",
      manageText:
        "Você pode controlar e excluir cookies a qualquer momento nas configurações do seu navegador. Abaixo, links para os guias oficiais dos principais navegadores:",
      browsers: [
        { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
        { name: "Mozilla Firefox", url: "https://support.mozilla.org/pt-BR/kb/limpar-cookies-e-dados-de-sites" },
        { name: "Safari (Apple)", url: "https://support.apple.com/pt-br/guide/safari/sfri11471/mac" },
        { name: "Microsoft Edge", url: "https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies" },
      ],
      consentTitle: "Revogar consentimento",
      consentText:
        "Você pode revogar seu consentimento para cookies não essenciais a qualquer momento clicando no botão abaixo ou nas configurações de cookies do rodapé:",
      revokeBtn: "Gerenciar Preferências de Cookies",
      contactTitle: "Contato",
      contactText: "Dúvidas? Entre em contato: ajuda@creio.eu",
    },
    en: {
      title: "Cookie Notice",
      subtitle: "How we use cookies and how you can control them.",
      lastUpdated: "Last updated: May 14, 2026",
      intro:
        "This Cookie Notice explains what cookies are, which ones we use on this platform, why we use them, and how you can manage them. We use cookies in compliance with the LGPD, GDPR, and other applicable legislation.",
      whatTitle: "What are cookies?",
      whatText:
        "Cookies are small text files stored by your browser on your device when you visit a website. They are used to remember your preferences, ensure the website works correctly, and, when you consent, collect analytical data.",
      tableTitle: "Cookies we use",
      tableHeaders: ["Name / Category", "Type", "Purpose", "Duration", "Legal Basis"],
      cookies: [
        {
          name: "theme",
          type: "Preference",
          purpose: "Saves your theme preference (light/dark) so you don't have to reselect it on each visit.",
          duration: "Persistent (localStorage)",
          basis: "Legitimate interest",
        },
        {
          name: "lang",
          type: "Preference",
          purpose: "Saves your language preference (PT/EN).",
          duration: "Persistent (localStorage)",
          basis: "Legitimate interest",
        },
        {
          name: "cookie_consent",
          type: "Strictly necessary",
          purpose: "Records whether you accepted or declined non-essential cookies.",
          duration: "365 days",
          basis: "Legal obligation (LGPD/GDPR)",
        },
        {
          name: "Session logs (GitHub Pages)",
          type: "Technical / Necessary",
          purpose: "Automatic logs from the hosting infrastructure for security and performance diagnostics.",
          duration: "Session / Retained per GitHub policy",
          basis: "Legitimate interest",
        },
        {
          name: "azure_speech_session",
          type: "Functional",
          purpose: "Temporary token for neural audio synthesis via Azure TTS. Does not store personal data.",
          duration: "Session",
          basis: "Contract execution / Consent",
        },
      ],
      noTrackingTitle: "What we do NOT do",
      noTracking: [
        "We do not use advertising tracking cookies.",
        "We do not share cookie data with ad networks.",
        "We do not sell browsing data.",
        "We do not use fingerprinting or invasive tracking techniques.",
      ],
      manageTitle: "How to manage cookies",
      manageText:
        "You can control and delete cookies at any time in your browser settings. Below are links to the official guides for major browsers:",
      browsers: [
        { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
        { name: "Mozilla Firefox", url: "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" },
        { name: "Safari (Apple)", url: "https://support.apple.com/guide/safari/sfri11471/mac" },
        { name: "Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" },
      ],
      consentTitle: "Revoke consent",
      consentText:
        "You can revoke your consent for non-essential cookies at any time by clicking the button below or via the cookie settings in the footer:",
      revokeBtn: "Manage Cookie Preferences",
      contactTitle: "Contact",
      contactText: "Questions? Contact us: ajuda@creio.eu",
    },
  };

  const active = content[lang] || content.pt;
  const privacyHref = `/${lang}/privacidade`;

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
          { href: privacyHref, label: lang === "pt" ? "🛡️ Política de Privacidade" : "🛡️ Privacy Policy" },
        ]}
      />

      <p className="privacy-updated">{active.lastUpdated}</p>

      <div className="privacy-intro card">{active.intro}</div>

      {/* O que são cookies */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.whatTitle}</h2>
        <p style={{ lineHeight: "1.7", margin: 0 }}>{active.whatText}</p>
      </section>

      {/* Tabela de cookies */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.tableTitle}</h2>
        <div className="cookies-table-wrap">
          <table className="cookies-table">
            <thead>
              <tr>
                {active.tableHeaders.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.cookies.map((cookie, i) => (
                <tr key={i}>
                  <td><code>{cookie.name}</code></td>
                  <td><span className="cookie-badge">{cookie.type}</span></td>
                  <td>{cookie.purpose}</td>
                  <td>{cookie.duration}</td>
                  <td>{cookie.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* O que NÃO fazemos */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.noTrackingTitle}</h2>
        <ul className="privacy-list privacy-list--check">
          {active.noTracking.map((item, i) => (
            <li key={i}>✅ {item}</li>
          ))}
        </ul>
      </section>

      {/* Como gerenciar */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.manageTitle}</h2>
        <p style={{ lineHeight: "1.7", marginBottom: "1rem" }}>{active.manageText}</p>
        <ul className="privacy-list">
          {active.browsers.map((b, i) => (
            <li key={i}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                {b.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Revogar consentimento */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.consentTitle}</h2>
        <p style={{ lineHeight: "1.7", marginBottom: "1rem" }}>{active.consentText}</p>
        <RevokeConsentButton label={active.revokeBtn} />
      </section>

      {/* Contato */}
      <section className="card privacy-section">
        <h2 className="privacy-section-title">{active.contactTitle}</h2>
        <p>{active.contactText}</p>
      </section>

      <div className="privacy-footer-nav">
        <Link href={privacyHref} className="support-cta support-cta--github">
          {lang === "pt" ? "🛡️ Política de Privacidade" : "🛡️ Privacy Policy"}
        </Link>
        <Link href={`/${lang}/`} className="support-cta">
          {t.backToHome}
        </Link>
      </div>
    </div>
  );
}

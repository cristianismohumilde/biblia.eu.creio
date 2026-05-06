import Link from "next/link";

export default function NewsBanner({ lang }) {
  const text = lang === 'en' 
    ? "Almeida translation now available! We're expanding literal translations soon." 
    : "Tradução Almeida disponível! Expandindo com traduções literais em breve.";
  
  const linkText = lang === 'en' ? "learn more" : "saiba mais";


  return (
    <div className="news-banner">
      <span className="bouncing-emoji">📢</span>
      <div className="news-banner-content">
        {text}
        <Link href={`/${lang}/atualizacoes-e-novidades`} className="news-banner-link">
          {linkText} ➔
        </Link>
      </div>
    </div>
  );
}

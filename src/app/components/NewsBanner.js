import Link from "next/link";

export default function NewsBanner({ lang }) {
  const text = lang === 'en' 
    ? "We moved to a new site with a more complete translation: cristianismohumilde.github.io/AI-BIBLE." 
    : "Estamos de casa nova com uma tradução mais completa: cristianismohumilde.github.io/AI-BIBLE.";
  
  const linkText = lang === 'en' ? "read more" : "saiba mais";


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

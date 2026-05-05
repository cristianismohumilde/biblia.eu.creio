import Link from "next/link";

export default function NewsBanner({ lang }) {
  const text = lang === 'en' 
    ? "New: High-quality audio for original languages and literal translations!" 
    : "Novidade: Áudio de alta fidelidade para os idiomas originais e traduções literais!";
  
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

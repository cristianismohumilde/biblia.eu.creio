import Link from "next/link";

export default function NewsBanner({ lang }) {
  const text = lang === 'en' 
    ? "For the book of Genesis in Hebrew, we now use only the Codex Leningradensis (B19A)" 
    : "Para o livro de Gênesis em Hebraico, agora utilizamos exclusivamente o Codex Leningradensis (B19A)";
  
  const linkText = lang === 'en' ? "read more" : "leia mais";

  return (
    <div className="news-banner">
      <span className="bouncing-emoji">✨</span>
      <div className="news-banner-content">
        {text}
        <Link href={`/${lang}/atualizacoes-e-novidades`} className="news-banner-link">
          {linkText} ➔
        </Link>
      </div>
    </div>
  );
}

import InterlinearClient from "@/app/components/InterlinearClient";

export async function generateStaticParams() {
  const langs = ["pt", "en"];
  const manuscripts = ["b19a", "aleppo", "qumran", "lxx", "byzantine", "targum", "vulgate", "syriac", "geez", "coptic", "armenian"];
  const verses = ["gen.1.1", "gen.2.1", "gen.3.1", "gen.4.1", "gen.5.1"];
  
  const params = [];
  for (const lang of langs) {
    for (const ms of manuscripts) {
      for (const v of verses) {
        const [book, chapter, verse] = v.split(".");
        params.push({ lang, manuscript: ms, book, chapter, verse });
      }
    }
  }
  return params;
}

export default function InterlinearPage({ params }) {
  const { lang, manuscript, book, chapter, verse } = params;
  
  return (
    <InterlinearClient 
      lang={lang} 
      manuscript={manuscript} 
      book={book} 
      chapter={chapter} 
      verse={verse} 
    />
  );
}

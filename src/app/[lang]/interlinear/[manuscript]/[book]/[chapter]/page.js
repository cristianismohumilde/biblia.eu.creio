import InterlinearClient from "@/app/components/InterlinearClient";
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const langs = ["pt", "en"];
  const manuscripts = ["b19a"]; // Por enquanto focamos no Hebraico (B19A) para o AT
  
  const versesDir = path.join(process.cwd(), 'public', 'data', 'verses');
  let chapters = [];
  try {
    const files = fs.readdirSync(versesDir);
    // Arquivos agora são no formato book.chapter.json
    chapters = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
  } catch (err) {
    chapters = ["gen.1", "gen.2"]; 
  }
  
  const params = [];
  for (const lang of langs) {
    for (const ms of manuscripts) {
      for (const c of chapters) {
        const [book, chapter] = c.split(".");
        if (book && chapter) {
          params.push({ lang, manuscript: ms, book, chapter });
        }
      }
    }
  }
  return params;
}

export default async function InterlinearChapterPage({ params }) {
  const { lang, manuscript, book, chapter } = await params;
  
  return (
    <InterlinearClient 
      lang={lang} 
      manuscript={manuscript} 
      initialBook={book} 
      initialChapter={chapter}
      // O verso será lido via query param (?v=1) ou padrão 1 no cliente
    />
  );
}

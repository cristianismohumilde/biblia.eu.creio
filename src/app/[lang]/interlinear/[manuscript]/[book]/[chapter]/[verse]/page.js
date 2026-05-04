import InterlinearClient from "@/app/components/InterlinearClient";

import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const langs = ["pt", "en"];
  const manuscripts = ["b19a", "lxx", "byzantine", "targum", "vulgate", "syriac", "geez", "coptic", "armenian"];
  
  const versesDir = path.join(process.cwd(), 'public', 'data', 'verses');
  let verses = [];
  try {
    const files = fs.readdirSync(versesDir);
    verses = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
  } catch (err) {
    verses = ["gen.1.1", "gen.2.1", "gen.3.1", "gen.4.1", "gen.5.1"]; // fallback
  }
  
  const params = [];
  for (const lang of langs) {
    for (const ms of manuscripts) {
      for (const v of verses) {
        const [book, chapter, verse] = v.split(".");
        if (book && chapter && verse) {
          params.push({ lang, manuscript: ms, book, chapter, verse });
        }
      }
    }
  }
  return params;
}

export default async function InterlinearPage({ params }) {
  const { lang, manuscript, book, chapter, verse } = await params;
  
  return (
    <InterlinearClient 
      lang={lang} 
      manuscript={manuscript} 
      initialBook={book} 
      initialChapter={chapter} 
      initialVerse={verse} 
    />
  );
}

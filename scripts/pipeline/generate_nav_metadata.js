/**
 * GERADOR DE METADADOS DE NAVEGAÇÃO
 * ====================================
 * Lê os JSONs de versos gerados e cria:
 *   1. public/data/books.json           — lista de todos os livros com contagem de capítulos
 *   2. public/data/books/{book}/chapters/{n}.json — lista de versos de cada capítulo
 *
 * Isso corrige a navegação (seletor de livro/capítulo/verso) no site.
 */

const fs   = require('fs');
const path = require('path');

const VERSES_DIR   = path.join(__dirname, '../../public/data/verses');
const BOOKS_DIR    = path.join(__dirname, '../../public/data/books');
const BOOKS_JSON   = path.join(__dirname, '../../public/data/books.json');

// Metadados completos dos livros (PT e EN) — ordem canônica do AT Hebraico
const BOOK_META = [
  { code: 'gen',  name: 'Gênesis',       nameEn: 'Genesis' },
  { code: 'exo',  name: 'Êxodo',         nameEn: 'Exodus' },
  { code: 'lev',  name: 'Levítico',      nameEn: 'Leviticus' },
  { code: 'num',  name: 'Números',       nameEn: 'Numbers' },
  { code: 'deu',  name: 'Deuteronômio',  nameEn: 'Deuteronomy' },
  { code: 'jos',  name: 'Josué',         nameEn: 'Joshua' },
  { code: 'jdg',  name: 'Juízes',        nameEn: 'Judges' },
  { code: 'rut',  name: 'Rute',          nameEn: 'Ruth' },
  { code: '1sa',  name: '1 Samuel',      nameEn: '1 Samuel' },
  { code: '2sa',  name: '2 Samuel',      nameEn: '2 Samuel' },
  { code: '1ki',  name: '1 Reis',        nameEn: '1 Kings' },
  { code: '2ki',  name: '2 Reis',        nameEn: '2 Kings' },
  { code: '1ch',  name: '1 Crônicas',    nameEn: '1 Chronicles' },
  { code: '2ch',  name: '2 Crônicas',    nameEn: '2 Chronicles' },
  { code: 'ezr',  name: 'Esdras',        nameEn: 'Ezra' },
  { code: 'neh',  name: 'Neemias',       nameEn: 'Nehemiah' },
  { code: 'est',  name: 'Ester',         nameEn: 'Esther' },
  { code: 'job',  name: 'Jó',            nameEn: 'Job' },
  { code: 'psa',  name: 'Salmos',        nameEn: 'Psalms' },
  { code: 'pro',  name: 'Provérbios',    nameEn: 'Proverbs' },
  { code: 'ecc',  name: 'Eclesiastes',   nameEn: 'Ecclesiastes' },
  { code: 'sng',  name: 'Cânticos',      nameEn: 'Song of Solomon' },
  { code: 'isa',  name: 'Isaías',        nameEn: 'Isaiah' },
  { code: 'jer',  name: 'Jeremias',      nameEn: 'Jeremiah' },
  { code: 'lam',  name: 'Lamentações',   nameEn: 'Lamentations' },
  { code: 'ezk',  name: 'Ezequiel',      nameEn: 'Ezekiel' },
  { code: 'dan',  name: 'Daniel',        nameEn: 'Daniel' },
  { code: 'hos',  name: 'Oséias',        nameEn: 'Hosea' },
  { code: 'jol',  name: 'Joel',          nameEn: 'Joel' },
  { code: 'amo',  name: 'Amós',          nameEn: 'Amos' },
  { code: 'oba',  name: 'Obadias',       nameEn: 'Obadiah' },
  { code: 'jon',  name: 'Jonas',         nameEn: 'Jonah' },
  { code: 'mic',  name: 'Miquéias',      nameEn: 'Micah' },
  { code: 'nah',  name: 'Naum',          nameEn: 'Nahum' },
  { code: 'hab',  name: 'Habacuque',     nameEn: 'Habakkuk' },
  { code: 'zph',  name: 'Sofonias',      nameEn: 'Zephaniah' },
  { code: 'hag',  name: 'Ageu',          nameEn: 'Haggai' },
  { code: 'zec',  name: 'Zacarias',      nameEn: 'Zechariah' },
  { code: 'mal',  name: 'Malaquias',     nameEn: 'Malachi' },
];

function run() {
  console.log('🗺️  Gerando metadados de navegação (books.json + chapters)...\n');

  // Lê todos os arquivos de verso e indexa por livro → capítulo → versos
  const index = {}; // { gen: { 1: [1,2,3,...], 2: [...] }, exo: {...}, ... }

  const files = fs.readdirSync(VERSES_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Lendo ${files.length} arquivos de versos...`);

  for (const file of files) {
    const parts = file.replace('.json', '').split('.');
    if (parts.length !== 3) continue;
    const [book, chapter, verse] = parts;
    const chNum = parseInt(chapter);
    const vNum  = parseInt(verse);
    if (!book || isNaN(chNum) || isNaN(vNum)) continue;

    if (!index[book]) index[book] = {};
    if (!index[book][chNum]) index[book][chNum] = [];
    index[book][chNum].push(vNum);
  }

  // Ordena versos dentro de cada capítulo
  for (const book of Object.keys(index)) {
    for (const ch of Object.keys(index[book])) {
      index[book][ch].sort((a, b) => a - b);
    }
  }

  // Gera os arquivos de capítulo para cada livro
  let totalFiles = 0;
  const booksOutput = [];

  for (const meta of BOOK_META) {
    const { code, name, nameEn } = meta;
    if (!index[code]) continue; // livro sem dados gerados (NT ainda não processado)

    const chapters = Object.keys(index[code]).map(Number).sort((a, b) => a - b);

    // Cria pasta do livro
    const bookDir = path.join(BOOKS_DIR, code, 'chapters');
    fs.mkdirSync(bookDir, { recursive: true });

    // Gera um JSON por capítulo
    for (const chNum of chapters) {
      const verses = index[code][chNum];
      const outPath = path.join(bookDir, `${chNum}.json`);
      fs.writeFileSync(outPath, JSON.stringify({ book: code, chapter: chNum, verses }, null, 2));
      totalFiles++;
    }

    booksOutput.push({ code, name, nameEn, chapters: chapters.length });
    console.log(`  ✅ ${nameEn.padEnd(20)} — ${chapters.length} capítulos`);
  }

  // Salva o books.json completo
  fs.writeFileSync(BOOKS_JSON, JSON.stringify(booksOutput, null, 2));

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ books.json atualizado com ${booksOutput.length} livros`);
  console.log(`✅ ${totalFiles} arquivos de capítulo gerados`);
  console.log(`\n🎯 A navegação por livro/capítulo/verso já está funcional!`);
}

run();

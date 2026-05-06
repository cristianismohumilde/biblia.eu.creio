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
  // Novo Testamento
  { code: 'mat',  name: 'Mateus',         nameEn: 'Matthew' },
  { code: 'mrk',  name: 'Marcos',         nameEn: 'Mark' },
  { code: 'luk',  name: 'Lucas',          nameEn: 'Luke' },
  { code: 'jhn',  name: 'João',           nameEn: 'John' },
  { code: 'act',  name: 'Atos',           nameEn: 'Acts' },
  { code: 'rom',  name: 'Romanos',        nameEn: 'Romans' },
  { code: '1co',  name: '1 Coríntios',    nameEn: '1 Corinthians' },
  { code: '2co',  name: '2 Coríntios',    nameEn: '2 Corinthians' },
  { code: 'gal',  name: 'Gálatas',        nameEn: 'Galatians' },
  { code: 'eph',  name: 'Efésios',        nameEn: 'Ephesians' },
  { code: 'php',  name: 'Filipenses',     nameEn: 'Philippians' },
  { code: 'col',  name: 'Colossenses',    nameEn: 'Colossians' },
  { code: '1th',  name: '1 Tessalonicenses', nameEn: '1 Thessalonians' },
  { code: '2th',  name: '2 Tessalonicenses', nameEn: '2 Thessalonians' },
  { code: '1ti',  name: '1 Timóteo',      nameEn: '1 Timothy' },
  { code: '2ti',  name: '2 Timóteo',      nameEn: '2 Timothy' },
  { code: 'tit',  name: 'Tito',           nameEn: 'Titus' },
  { code: 'phm',  name: 'Filemom',        nameEn: 'Philemon' },
  { code: 'heb',  name: 'Hebreus',        nameEn: 'Hebrews' },
  { code: 'jas',  name: 'Tiago',          nameEn: 'James' },
  { code: '1pe',  name: '1 Pedro',        nameEn: '1 Peter' },
  { code: '2pe',  name: '2 Pedro',        nameEn: '2 Peter' },
  { code: '1jn',  name: '1 João',         nameEn: '1 John' },
  { code: '2jn',  name: '2 João',         nameEn: '2 John' },
  { code: '3jn',  name: '3 João',         nameEn: '3 John' },
  { code: 'jud',  name: 'Judas',          nameEn: 'Jude' },
  { code: 'rev',  name: 'Apocalipse',     nameEn: 'Revelation' },
];

function run() {
  console.log('🗺️  Gerando metadados de navegação (books.json + chapters)...\n');

  // Lê todos os arquivos de verso e indexa por livro → capítulo → versos
  const index = {}; // { gen: { 1: [1,2,3,...], 2: [...] }, exo: {...}, ... }

  const files = fs.readdirSync(VERSES_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Lendo ${files.length} arquivos de versos...`);

  for (const file of files) {
    const parts = file.replace('.json', '').split('.');
    if (parts.length !== 2) continue; // Agora é book.chapter.json
    const [book, chapter] = parts;
    const chNum = parseInt(chapter);
    if (!book || isNaN(chNum)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(path.join(VERSES_DIR, file), 'utf8'));
      if (data.verses) {
        if (!index[book]) index[book] = {};
        index[book][chNum] = data.verses.map(v => v.verse).sort((a, b) => a - b);
      }
    } catch (e) { console.error(`Erro ao ler ${file}:`, e.message); }
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

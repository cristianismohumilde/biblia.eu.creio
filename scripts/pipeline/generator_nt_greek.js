/**
 * PIPELINE — Grego do Novo Testamento (SBLGNT + MorphGNT)
 * ========================================================
 * Lê os .txt MorphGNT em raw_data/morphgnt-sblgnt/ (rode fetch_nt_morphgnt.js antes).
 * Mescla tokens gregos + sourceTexts.greek nos JSON existentes em public/data/verses/.
 *
 * Léxico: strongs-greek-dictionary.js (Open Scriptures, CC-BY-SA)
 *
 * Uso:
 *   node scripts/pipeline/generator_nt_greek.js           # todo o NT
 *   node scripts/pipeline/generator_nt_greek.js mat      # só Mateus
 */

const fs = require('fs');
const path = require('path');
const { transliterateGreek } = require('./greek_transliterate');

const MORPH_DIR = path.join(__dirname, 'raw_data/morphgnt-sblgnt');
const LEXICON_JS = path.join(
  __dirname,
  'raw_data/strongs-master/strongs-master/greek/strongs-greek-dictionary.js'
);
const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

const MORPH_BOOKS = [
  { file: '61-Mt-morphgnt.txt', site: 'mat' },
  { file: '62-Mk-morphgnt.txt', site: 'mrk' },
  { file: '63-Lk-morphgnt.txt', site: 'luk' },
  { file: '64-Jn-morphgnt.txt', site: 'jhn' },
  { file: '65-Ac-morphgnt.txt', site: 'act' },
  { file: '66-Ro-morphgnt.txt', site: 'rom' },
  { file: '67-1Co-morphgnt.txt', site: '1co' },
  { file: '68-2Co-morphgnt.txt', site: '2co' },
  { file: '69-Ga-morphgnt.txt', site: 'gal' },
  { file: '70-Eph-morphgnt.txt', site: 'eph' },
  { file: '71-Php-morphgnt.txt', site: 'php' },
  { file: '72-Col-morphgnt.txt', site: 'col' },
  { file: '73-1Th-morphgnt.txt', site: '1th' },
  { file: '74-2Th-morphgnt.txt', site: '2th' },
  { file: '75-1Ti-morphgnt.txt', site: '1ti' },
  { file: '76-2Ti-morphgnt.txt', site: '2ti' },
  { file: '77-Tit-morphgnt.txt', site: 'tit' },
  { file: '78-Phm-morphgnt.txt', site: 'phm' },
  { file: '79-Heb-morphgnt.txt', site: 'heb' },
  { file: '80-Jas-morphgnt.txt', site: 'jas' },
  { file: '81-1Pe-morphgnt.txt', site: '1pe' },
  { file: '82-2Pe-morphgnt.txt', site: '2pe' },
  { file: '83-1Jn-morphgnt.txt', site: '1jn' },
  { file: '84-2Jn-morphgnt.txt', site: '2jn' },
  { file: '85-3Jn-morphgnt.txt', site: '3jn' },
  { file: '86-Jud-morphgnt.txt', site: 'jud' },
  { file: '87-Re-morphgnt.txt', site: 'rev' },
];

function loadGreekLexicon() {
  const js = fs.readFileSync(LEXICON_JS, 'utf8');
  const start = js.indexOf('{');
  const end = js.lastIndexOf('}');
  return JSON.parse(js.slice(start, end + 1));
}

function normalizeLemmaKey(s) {
  return (s || '').normalize('NFC').trim().toLowerCase();
}

function buildLemmaIndex(lexicon) {
  const m = new Map();
  for (const [code, ent] of Object.entries(lexicon)) {
    const lem = ent.lemma;
    if (!lem) continue;
    const k = normalizeLemmaKey(lem);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(code);
  }
  for (const arr of m.values()) {
    arr.sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  }
  return m;
}

function glossFromStrong(entry) {
  if (!entry) return '';
  const k = (entry.kjv_def || '').split(',')[0].trim();
  if (k) return k;
  let d = (entry.strongs_def || '').trim().replace(/^\s*to\s+/i, '');
  d = d.split(';')[0].trim();
  return d.length > 120 ? d.slice(0, 117) + '…' : d;
}

function explanationFromStrong(entry) {
  if (!entry) return '';
  const d = (entry.strongs_def || '').trim();
  if (d) return d.slice(0, 240);
  return (entry.kjv_def || '').trim().slice(0, 240);
}

function resolveStrong(lemma, norm, posRaw, lemmaIndex) {
  const pos = (posRaw || '').replace(/-$/, '');
  const keys = [normalizeLemmaKey(lemma), normalizeLemmaKey(norm)].filter(Boolean);
  for (const k of keys) {
    const arr = lemmaIndex.get(k);
    if (arr && arr.length) {
      if (pos === 'RA' && arr.includes('G3588')) return 'G3588';
      return arr[0];
    }
  }
  return '';
}

function parseMorphgntLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 7) return null;
  const bcv = parts[0];
  if (!/^\d{6}$/.test(bcv)) return null;

  const lemma = parts[parts.length - 1];
  const norm = parts[parts.length - 2];
  const word = parts[parts.length - 3];
  const text = parts[parts.length - 4];
  const pos = parts[1];
  const morph = parts[2];

  const chapter = parseInt(bcv.slice(2, 4), 10);
  const verse = parseInt(bcv.slice(4, 6), 10);

  return { chapter, verse, pos, morph, text, word, norm, lemma };
}

function mergeGreekIntoVerse(verseObj, rows, bookCode, lexicon, lemmaIndex) {
  const ch = verseObj.ref.chapter;
  const v = verseObj.ref.verse;
  verseObj.id = verseObj.id || `${bookCode}.${ch}.${v}`;

  verseObj.tokens = (verseObj.tokens || []).filter((t) => t.lang !== 'greek');

  const surfaces = [];
  const translits = [];
  const enWords = [];

  rows.forEach((row, idx) => {
    const strong = resolveStrong(row.lemma, row.norm, row.pos, lemmaIndex);
    const dict = strong && lexicon[strong] ? lexicon[strong] : null;
    const enLit = glossFromStrong(dict);
    const surface = row.word || row.text;
    surfaces.push(surface);
    const tr = transliterateGreek(surface);
    translits.push(tr);

    verseObj.tokens.push({
      id: `${bookCode}.${ch}.${v}.g${idx + 1}`,
      lang: 'greek',
      langPt: 'Grego',
      langEn: 'Greek',
      surface,
      transliteration: tr,
      lemma: row.lemma,
      strong: strong || '-',
      morph: `${row.pos} ${row.morph}`.trim(),
      lsj: '',
      manuscript: 'Grego: SBLGNT + análise MorphGNT (morfologia CC-BY-SA)',
      manuscriptEn: 'Greek: SBLGNT + MorphGNT analysis (morphology CC-BY-SA)',
      ptLiteralWord: '',
      enLiteralWord: enLit || '',
      explanation: dict ? explanationFromStrong(dict) : '',
      explanationEn: dict ? explanationFromStrong(dict) : '',
    });
    if (enLit) enWords.push(enLit);
  });

  const joined = surfaces.join(' ');
  verseObj.sourceTexts = verseObj.sourceTexts || {};
  verseObj.sourceTexts.greek = joined;

  verseObj.greekWitnesses = Array.isArray(verseObj.greekWitnesses)
    ? verseObj.greekWitnesses
    : [];
  const wit = {
    id: 'sblgnt',
    label: 'SBLGNT (MorphGNT)',
    labelEn: 'SBLGNT (MorphGNT)',
    text: joined,
    transliteration: translits.join(' '),
    literalPt: '',
    literalEn: enWords.join(' '),
  };
  const witIdx = verseObj.greekWitnesses.findIndex((w) => w.id === 'sblgnt');
  if (witIdx >= 0) verseObj.greekWitnesses[witIdx] = wit;
  else verseObj.greekWitnesses.push(wit);

  if (verseObj.literalTranslations && Array.isArray(verseObj.literalTranslations)) {
    const lt = verseObj.literalTranslations.find((x) => x.lang === 'greek');
    if (lt) {
      lt.en = wit.literalEn || lt.en;
      if (!lt.pt || lt.pt === '[placeholder]') lt.pt = '';
    }
  }

  if (
    !verseObj.enLiteralVerse ||
    verseObj.enLiteralVerse === '[placeholder]' ||
    !String(verseObj.enLiteralVerse).trim()
  ) {
    verseObj.enLiteralVerse = wit.literalEn || verseObj.enLiteralVerse;
  }
}

function loadVerseRows(morphPath) {
  const text = fs.readFileSync(morphPath, 'utf8');
  const byVerse = new Map();
  for (const line of text.split(/\r?\n/)) {
    const row = parseMorphgntLine(line);
    if (!row) continue;
    const k = `${row.chapter}.${row.verse}`;
    if (!byVerse.has(k)) byVerse.set(k, []);
    byVerse.get(k).push(row);
  }
  return byVerse;
}

function processBook(entry, lexicon, lemmaIndex) {
  const morphPath = path.join(MORPH_DIR, entry.file);
  if (!fs.existsSync(morphPath)) {
    console.warn(`⚠️  Arquivo ausente: ${entry.file} — rode fetch_nt_morphgnt.js`);
    return;
  }

  console.log(`\n📖 ${entry.site} ← ${entry.file}`);
  const byVerse = loadVerseRows(morphPath);
  const chapters = new Set();
  for (const k of byVerse.keys()) {
    chapters.add(parseInt(k.split('.')[0], 10));
  }

  let files = 0;
  for (const chNum of [...chapters].sort((a, b) => a - b)) {
    const outFile = path.join(VERSES_DIR, `${entry.site}.${chNum}.json`);
    if (!fs.existsSync(outFile)) {
      console.warn(`   ⚠️  Pulando capítulo inexistente: ${entry.site}.${chNum}.json`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    let merged = 0;
    for (const verseObj of data.verses || []) {
      const vk = `${verseObj.ref.chapter}.${verseObj.ref.verse}`;
      const rows = byVerse.get(vk);
      if (!rows || !rows.length) continue;
      mergeGreekIntoVerse(verseObj, rows, entry.site, lexicon, lemmaIndex);
      merged++;
    }
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
    files++;
    console.log(`   ✓ ${entry.site}.${chNum}.json (${merged} versículos atualizados)`);
  }
  console.log(`   → ${files} arquivos de capítulo escritos`);
}

function main() {
  const target = (process.argv[2] || '').toLowerCase();

  if (!fs.existsSync(MORPH_DIR)) {
    console.error(`❌ Pasta não encontrada: ${MORPH_DIR}`);
    console.error('   Execute: node scripts/pipeline/fetch_nt_morphgnt.js');
    process.exit(1);
  }

  console.log('📚 Carregando léxico Strong grego…');
  const lexicon = loadGreekLexicon();
  const lemmaIndex = buildLemmaIndex(lexicon);
  console.log(`   OK (${Object.keys(lexicon).length} entradas)\n`);

  const books = target
    ? MORPH_BOOKS.filter((b) => b.site === target)
    : MORPH_BOOKS;

  if (target && books.length === 0) {
    console.error(`❌ Código de livro desconhecido: ${target}`);
    console.error(`   Ex.: mat, mrk, jhn, rom, rev`);
    process.exit(1);
  }

  console.log('🏛️  PIPELINE NT GREGO (MorphGNT / SBLGNT)');
  console.log('═'.repeat(50));

  for (const entry of books) {
    processBook(entry, lexicon, lemmaIndex);
  }

  console.log('\n═'.repeat(50));
  console.log('✨ Concluído. Revise amostras e rode ai_translate_*.js para PT nos tokens.');
}

main();

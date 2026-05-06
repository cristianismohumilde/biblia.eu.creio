/**
 * 🔷 NEW TESTAMENT VERSE GENERATOR
 * =========================================================
 * Cria estrutura de arquivos JSON para o Novo Testamento.
 * Os versículos serão preenchidos pela tradução Almeida
 * (apply_almeida_translation.js) e interlineares futuros.
 * 
 * Uso: node scripts/pipeline/generate_nt_verses.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../public/data/verses');

// Mapa de livros NT com seus respectivos capítulos
const NT_BOOKS = {
  'mat': { name: 'Matthew', namePt: 'Mateus', chapters: 28 },
  'mrk': { name: 'Mark', namePt: 'Marcos', chapters: 16 },
  'luk': { name: 'Luke', namePt: 'Lucas', chapters: 24 },
  'jhn': { name: 'John', namePt: 'João', chapters: 21 },
  'act': { name: 'Acts', namePt: 'Atos', chapters: 28 },
  'rom': { name: 'Romans', namePt: 'Romanos', chapters: 16 },
  '1co': { name: '1 Corinthians', namePt: '1 Coríntios', chapters: 16 },
  '2co': { name: '2 Corinthians', namePt: '2 Coríntios', chapters: 13 },
  'gal': { name: 'Galatians', namePt: 'Gálatas', chapters: 6 },
  'eph': { name: 'Ephesians', namePt: 'Efésios', chapters: 6 },
  'php': { name: 'Philippians', namePt: 'Filipenses', chapters: 4 },
  'col': { name: 'Colossians', namePt: 'Colossenses', chapters: 4 },
  '1th': { name: '1 Thessalonians', namePt: '1 Tessalonicenses', chapters: 5 },
  '2th': { name: '2 Thessalonians', namePt: '2 Tessalonicenses', chapters: 3 },
  '1ti': { name: '1 Timothy', namePt: '1 Timóteo', chapters: 6 },
  '2ti': { name: '2 Timothy', namePt: '2 Timóteo', chapters: 4 },
  'tit': { name: 'Titus', namePt: 'Tito', chapters: 3 },
  'phm': { name: 'Philemon', namePt: 'Filemom', chapters: 1 },
  'heb': { name: 'Hebrews', namePt: 'Hebreus', chapters: 13 },
  'jas': { name: 'James', namePt: 'Tiago', chapters: 5 },
  '1pe': { name: '1 Peter', namePt: '1 Pedro', chapters: 5 },
  '2pe': { name: '2 Peter', namePt: '2 Pedro', chapters: 3 },
  '1jn': { name: '1 John', namePt: '1 João', chapters: 5 },
  '2jn': { name: '2 John', namePt: '2 João', chapters: 1 },
  '3jn': { name: '3 John', namePt: '3 João', chapters: 1 },
  'jud': { name: 'Jude', namePt: 'Judas', chapters: 1 },
  'rev': { name: 'Revelation', namePt: 'Apocalipse', chapters: 22 }
};

/**
 * Obtém número de versículos para um capítulo NT específico.
 * Baseado em padrão bíblico conhecido.
 */
function getVerseCount(book, chapter) {
  // Mapeamento simplificado de versículos por capítulo
  // Para um NT completo, este seria expandido com dados reais
  const verseCounts = {
    'mat': [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 54],
    'mrk': [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 34, 30, 37, 38, 42],
    'luk': [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
    'jhn': [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
    'act': [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 33, 37, 29, 19, 36, 27, 27, 34, 26],
    'rom': [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
    '1co': [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
    '2co': [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
    'gal': [24, 21, 29, 31, 26, 18],
    'eph': [23, 22, 21, 32, 33, 24],
    'php': [30, 30, 21, 23],
    'col': [29, 23, 25, 18],
    '1th': [10, 20, 13, 18, 28],
    '2th': [12, 17, 18],
    '1ti': [20, 15, 16, 16, 25, 21],
    '2ti': [18, 26, 17, 22],
    'tit': [16, 15, 15],
    'phm': [25],
    'heb': [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
    'jas': [27, 26, 18, 17, 20],
    '1pe': [25, 25, 22, 19, 14],
    '2pe': [21, 22, 18],
    '1jn': [10, 29, 24, 21, 21],
    '2jn': [14],
    '3jn': [14],
    'jud': [25],
    'rev': [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21]
  };

  if (verseCounts[book] && verseCounts[book][chapter - 1]) {
    return verseCounts[book][chapter - 1];
  }
  return 30; // fallback padrão
}

/**
 * Cria um objeto verso básico para o NT
 */
function createVerseObject(bookCode, bookName, chapter, verse) {
  return {
    schemaVersion: '1.1.0',
    ref: {
      book: bookCode,
      chapter: parseInt(chapter),
      verse: parseInt(verse)
    },
    translation: {
      author: 'Equipe Biblia.Creio.EU (Almeida + interlineares em curadoria)',
      authorEn: 'Biblia.Creio.EU Team (Almeida + interlinears under curation)',
      baseText: 'Almeida (Domínio Público) + comparação com manuscritos gregos',
      baseTextEn: 'Almeida (Public Domain) + comparison with Greek manuscripts'
    },
    manuscripts: {
      greek: 'Grego: Textos Críticos (NA28/UBS5) e tradição bizantina (Byz/RP)',
      greekEn: 'Greek: Critical Texts (NA28/UBS5) and Byzantine tradition (Byz/RP)',
      latin: 'Latim: Vulgata (Vg)',
      latinEn: 'Latin: Vulgate (Vg)',
      armenian: 'Armênio: versão armênia antiga (Arm)',
      armenianEn: 'Armenian: ancient Armenian version (Arm)',
      syriac: 'Siríaco: Peshitta (SyrP)',
      syriacEn: 'Syriac: Peshitta (SyrP)',
      coptic: 'Copta: testemunhos sahídico/boárico (cop-sa/cop-bo)',
      copticEn: 'Coptic: Sahidic/Bohairic witnesses (cop-sa/cop-bo)'
    },
    sourceTexts: {
      greek: '[Greek text to be added]',
      latin: '[Latin text to be added]',
      armenian: '[Armenian text to be added]',
      syriac: '[Syriac text to be added]',
      coptic: '[Coptic text to be added]'
    },
    greekWitnesses: [],
    ptLiteralVerse: '[placeholder]',
    enLiteralVerse: '[placeholder]',
    literalTranslations: [
      {
        lang: 'greek',
        langPt: 'Grego',
        langEn: 'Greek',
        pt: '[placeholder]',
        en: '[placeholder]'
      },
      {
        lang: 'latin',
        langPt: 'Latim',
        langEn: 'Latin',
        pt: '[placeholder]',
        en: '[placeholder]'
      }
    ],
    tokens: []
  };
}

/**
 * Cria arquivo JSON para um capítulo do NT
 */
function createChapterFile(bookCode, bookName, chapter) {
  const bookEntry = NT_BOOKS[bookCode];
  if (!bookEntry) {
    console.error(`❌ Livro desconhecido: ${bookCode}`);
    return;
  }

  const verseCount = getVerseCount(bookCode, chapter);
  const verses = [];

  for (let v = 1; v <= verseCount; v++) {
    verses.push(createVerseObject(bookCode, bookEntry.namePt, chapter, v));
  }

  const chapterData = {
    book: bookEntry.name,
    bookCode: bookCode,
    chapter: chapter,
    verses: verses
  };

  const fileName = `${bookCode}.${chapter}.json`;
  const filePath = path.join(OUT_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(chapterData, null, 2));
  return fileName;
}

/**
 * Função principal: gera todos os capítulos do NT
 */
function generateAllNTVerses() {
  console.log('🔷 Iniciando geração de estrutura do Novo Testamento...\n');

  let totalFiles = 0;
  let totalVerses = 0;

  for (const [bookCode, bookInfo] of Object.entries(NT_BOOKS)) {
    console.log(`📖 Gerando ${bookInfo.namePt} (${bookCode})...`);

    for (let chapter = 1; chapter <= bookInfo.chapters; chapter++) {
      const fileName = createChapterFile(bookCode, bookInfo.name, chapter);
      if (fileName) {
        const verseCount = getVerseCount(bookCode, chapter);
        totalFiles++;
        totalVerses += verseCount;
        process.stdout.write(`   ✓ Capítulo ${chapter} (${verseCount} versículos)\n`);
      }
    }
  }

  console.log(`\n🎉 Geração Concluída!`);
  console.log(`   📁 Arquivos criados: ${totalFiles}`);
  console.log(`   📝 Total de versículos NT: ${totalVerses}`);
  console.log(`\n⚠️  Próximo passo: Execute o pipeline Almeida para preencher as traduções!`);
  console.log(`   Comando: node scripts/pipeline/apply_almeida_translation.js`);
}

generateAllNTVerses();

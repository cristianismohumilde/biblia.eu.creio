/**
 * DEUTEROCANONICAL BOOKS GENERATOR
 * =================================
 * Cria estrutura de arquivos JSON para livros deuterocanônicos.
 * Estes serão preenchidos posteriormente pelos dados da LXX.
 * 
 * Uso: node scripts/pipeline/generate_deuterocanonical.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../public/data/verses');

// Livros deuterocanônicos com número de capítulos e versículos
const DEUTEROCANONICAL_BOOKS = {
  // Livros Históricos
  '1ma': { 
    name: '1 Macabeus', 
    nameEn: '1 Maccabees', 
    chapters: 16,
    verses: [64, 70, 60, 61, 68, 63, 50, 32, 73, 89, 74, 53, 53, 49, 41, 24]
  },
  '2ma': { 
    name: '2 Macabeus', 
    nameEn: '2 Maccabees', 
    chapters: 15,
    verses: [36, 32, 40, 50, 27, 31, 42, 36, 29, 45, 38, 45, 26, 46, 40]
  },
  '3ma': { 
    name: '3 Macabeus', 
    nameEn: '3 Maccabees', 
    chapters: 7,
    verses: [29, 33, 30, 21, 51, 41, 23]
  },
  '4ma': { 
    name: '4 Macabeus', 
    nameEn: '4 Maccabees', 
    chapters: 18,
    verses: [35, 24, 21, 26, 38, 35, 23, 29, 32, 21, 27, 20, 27, 20, 32, 25, 24, 24]
  },
  '1es': { 
    name: '1 Esdras', 
    nameEn: '1 Esdras', 
    chapters: 9,
    verses: [58, 30, 24, 63, 73, 34, 15, 96, 55]
  },
  '2es': { 
    name: '2 Esdras', 
    nameEn: '2 Esdras', 
    chapters: 16,
    verses: [40, 48, 36, 52, 56, 59, 140, 63, 47, 59, 46, 51, 58, 48, 63, 78]
  },
  'tob': { 
    name: 'Tobias', 
    nameEn: 'Tobit', 
    chapters: 14,
    verses: [22, 14, 17, 21, 22, 18, 16, 21, 6, 12, 19, 22, 18, 15]
  },
  'jdt': { 
    name: 'Judite', 
    nameEn: 'Judith', 
    chapters: 16,
    verses: [16, 28, 10, 15, 24, 21, 32, 36, 14, 23, 23, 20, 20, 19, 14, 25]
  },
  // Livros Sapienciais
  'wis': { 
    name: 'Sabedoria', 
    nameEn: 'Wisdom of Solomon', 
    chapters: 19,
    verses: [16, 24, 19, 20, 23, 25, 30, 21, 18, 21, 26, 27, 19, 31, 19, 29, 21, 25, 22]
  },
  'sir': { 
    name: 'Eclesiástico', 
    nameEn: 'Sirach', 
    chapters: 51,
    verses: [30, 18, 31, 31, 15, 37, 36, 19, 18, 31, 34, 18, 26, 27, 20, 30, 32, 33, 
             30, 32, 28, 27, 27, 34, 26, 29, 30, 26, 28, 25, 40, 24, 31, 26, 24, 27, 
             31, 34, 35, 30, 27, 25, 33, 23, 26, 20, 25, 25, 16, 29, 30]
  },
  // Livros Proféticos e Adições
  'bar': { 
    name: 'Baruc', 
    nameEn: 'Baruch', 
    chapters: 6,
    verses: [22, 35, 38, 37, 9, 73]
  },
  'epj': { 
    name: 'Epístola de Jeremias', 
    nameEn: 'Letter of Jeremiah', 
    chapters: 1,
    verses: [73]
  },
  'sus': { 
    name: 'Susana', 
    nameEn: 'Susanna', 
    chapters: 1,
    verses: [64]
  },
  'bel': { 
    name: 'Bel e o Dragão', 
    nameEn: 'Bel and the Dragon', 
    chapters: 1,
    verses: [42]
  },
  'man': { 
    name: 'Oração de Manassés', 
    nameEn: 'Prayer of Manasseh', 
    chapters: 1,
    verses: [15]
  },
  'ps2': { 
    name: 'Salmo 151', 
    nameEn: 'Psalm 151', 
    chapters: 1,
    verses: [7]
  },
  'wis': {
    name: 'Sabedoria',
    nameEn: 'Wisdom of Solomon',
    chapters: 19,
    verses: [16, 24, 19, 20, 23, 25, 30, 21, 18, 21, 26, 27, 19, 31, 19, 29, 21, 25, 22]
  },
  'sir': {
    name: 'Eclesiástico',
    nameEn: 'Sirach (Ecclesiasticus)',
    chapters: 51,
    verses: [30, 18, 31, 31, 15, 37, 36, 19, 18, 31, 34, 18, 26, 27, 20, 30, 32, 33, 30, 32, 28, 27, 27, 34, 26, 29, 30, 26, 28, 25, 40, 24, 31, 26, 24, 27, 31, 34, 35, 30, 27, 25, 33, 23, 26, 20, 25, 25, 16, 29, 30]
  },
  'pss': {
    name: 'Salmos de Salomão',
    nameEn: 'Psalms of Solomon',
    chapters: 18,
    verses: [8, 37, 12, 25, 19, 6, 10, 34, 11, 8, 9, 6, 12, 10, 13, 15, 46, 12]
  },
  'ode': {
    name: 'Odes/Cânticos',
    nameEn: 'Odes of Solomon',
    chapters: 14,
    verses: [20, 43, 52, 19, 20, 20, 45, 50, 50, 7, 20, 13, 45, 46]
  },
};

function generateVerse(bookCode, chapter, verse, bookName, bookNameEn) {
  return {
    schemaVersion: "1.1.0",
    ref: {
      book: bookCode,
      chapter: chapter,
      verse: verse
    },
    translation: {
      author: "Equipe Biblia.Creio.EU (tradução literal em curadoria)",
      authorEn: "Biblia.Creio.EU Team (literal translation under curation)",
      baseText: "Base principal da Septuaginta (LXX)",
      baseTextEn: "Primary Septuagint (LXX) base"
    },
    manuscripts: {
      hebrew: "Hebraico: Texto não preservado no TM, presente na LXX",
      hebrewEn: "Hebrew: Text not preserved in MT, present in LXX",
      aramaic: "Aramaico: Não aplicável",
      aramaicEn: "Aramaic: Not applicable",
      greek: "Grego: Septuaginta (LXX), tradição alexandrina",
      greekEn: "Greek: Septuagint (LXX), Alexandrian tradition",
      latin: "Latim: Vulgata (Vg)",
      latinEn: "Latin: Vulgate (Vg)",
      syriac: "Siríaco: Peshitta (SyrP)",
      syriacEn: "Syriac: Peshitta (SyrP)"
    },
    sourceTexts: {
      greek: "",
      latin: "",
      syriac: ""
    },
    literalTranslations: [
      {
        lang: "greek",
        pt: "",
        en: ""
      }
    ],
    ptLiteralVerse: "",
    enLiteralVerse: "",
    greekWitnesses: [
      {
        id: "lxx",
        label: "Septuaginta (LXX)",
        text: "",
        transliteration: "",
        literalPt: "",
        literalEn: ""
      }
    ],
    latinWitnesses: [
      {
        id: "vulgate",
        label: "Vulgata",
        text: "",
        transliteration: "",
        literalPt: "",
        literalEn: ""
      }
    ],
    tokens: [],
    interlinearStats: {
      totalTokens: 0,
      hebrewTokens: 0,
      aramaicTokens: 0,
      greekTokens: 0,
      latinTokens: 0,
      uniqueLemmas: 0
    }
  };
}

function generateChapter(bookCode, chapter, verseCount, bookInfo) {
  const verses = [];
  for (let v = 1; v <= verseCount; v++) {
    verses.push(generateVerse(bookCode, chapter, v, bookInfo.name, bookInfo.nameEn));
  }
  
  return {
    book: bookCode,
    bookName: bookInfo.name,
    bookNameEn: bookInfo.nameEn,
    chapter: chapter,
    schemaVersion: "1.1.0",
    verses: verses,
    chapterStats: {
      totalVerses: verseCount,
      totalTokens: 0,
      hebrewTokens: 0,
      greekTokens: 0,
      latinTokens: 0
    }
  };
}

function main() {
  console.log('📚 Gerador de Livros Deuterocanônicos');
  console.log('═══════════════════════════════════════');
  
  let totalFiles = 0;
  let totalVerses = 0;
  
  for (const [bookCode, bookInfo] of Object.entries(DEUTEROCANONICAL_BOOKS)) {
    console.log(`\n📖 ${bookInfo.name} (${bookCode})`);
    
    for (let ch = 1; ch <= bookInfo.chapters; ch++) {
      const verseCount = bookInfo.verses[ch - 1] || 20; // Default se não especificado
      const chapterData = generateChapter(bookCode, ch, verseCount, bookInfo);
      
      const filePath = path.join(OUT_DIR, `${bookCode}.${ch}.json`);
      
      // Verificar se arquivo já existe
      if (fs.existsSync(filePath)) {
        console.log(`   ⏭️  Capítulo ${ch} já existe`);
        continue;
      }
      
      fs.writeFileSync(filePath, JSON.stringify(chapterData, null, 2), 'utf8');
      console.log(`   ✅ Capítulo ${ch} (${verseCount} versículos)`);
      
      totalFiles++;
      totalVerses += verseCount;
    }
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('✅ Geração concluída!');
  console.log(`📊 Total: ${totalFiles} arquivos criados`);
  console.log(`📊 Total: ${totalVerses} versículos gerados`);
  console.log('\nPróximos passos:');
  console.log('1. Rodar: node scripts/pipeline/generator_lxx.js');
  console.log('2. Verificar dados preenchidos');
  console.log('3. Traduzir: node ai_translate_azure.js [livro] pt');
}

main();

/**
 * MASTER DATA PIPELINE - ANTIGO TESTAMENTO HEBRAICO
 * =====================================================
 * Fonte 1 (Texto): OpenScriptures MorphHB (Westminster Leningrad Codex)
 *   - Pasta: raw_data/morphhb-master/morphhb-master/wlc/*.xml
 * Fonte 2 (Léxico): Strong's Hebrew Dictionary (OpenScriptures)
 *   - Arquivo: raw_data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js
 * Saída: public/data/verses/*.json (formato biblia.eu.creio)
 */

const fs = require('fs');
const path = require('path');

// ─── Configurações de Caminhos ──────────────────────────────────────────────
const WLC_DIR   = path.join(__dirname, 'raw_data/morphhb-master/morphhb-master/wlc');
const LEXICON_JS = path.join(__dirname, 'raw_data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js');
const OUT_DIR    = path.join(__dirname, '../../public/data/verses');

// Mapa dos nomes de arquivo para abreviações de livro do site
const BOOK_MAP = {
  'Gen': 'gen',   'Exod': 'exo',   'Lev': 'lev',   'Num': 'num',   'Deut': 'deu',
  'Josh': 'jos',  'Judg': 'jdg',   'Ruth': 'rut',   '1Sam': '1sa',  '2Sam': '2sa',
  '1Kgs': '1ki',  '2Kgs': '2ki',  '1Chr': '1ch',   '2Chr': '2ch',  'Ezra': 'ezr',
  'Neh': 'neh',   'Esth': 'est',   'Job': 'job',    'Ps': 'psa',    'Prov': 'pro',
  'Eccl': 'ecc',  'Song': 'sng',   'Isa': 'isa',    'Jer': 'jer',   'Lam': 'lam',
  'Ezek': 'ezk',  'Dan': 'dan',    'Hos': 'hos',    'Joel': 'jol',  'Amos': 'amo',
  'Obad': 'oba',  'Jonah': 'jon',  'Mic': 'mic',    'Nah': 'nah',   'Hab': 'hab',
  'Zeph': 'zph',  'Hag': 'hag',   'Zech': 'zec',   'Mal': 'mal'
};

// ─── Utilitários ─────────────────────────────────────────────────────────────

/**
 * Remove Niqqud (vogais e cantilações massoréticas) do texto hebraico.
 * Para usar hebraico consonantal puro, passe as words por aqui.
 * Para manter o texto completo com vogais (como neste site), não use.
 */
function removeNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

/**
 * Limpa a tag de superfície do XML: remove cantilações de acentuação, 
 * mas mantém os sinais massoréticos (Niqqud/vogais).
 */
function cleanSurface(raw) {
  // Remove marcadores de acento (trops/cantilações Unicode) mas mantém vogais
  return raw
    .replace(/[\u0591-\u05AF\u05A0-\u05A9\u05AE\u05BD\u05BF\u05C4-\u05C5]/g, '')
    .replace(/[\/]/g, '') // remove "/" de prefixos no texto
    .trim();
}

/**
 * Extrai o número de Strong do atributo "lemma" do OSIS.
 * Exemplos: "b/7225" → "H7225" | "d/430" → "H430" | "c/559" → "H559"
 * Remove prefixos gramaticais (b/, c/, d/, l/, k/, m/, h/, s/, r/).
 */
function extractStrong(lemmaAttr) {
  if (!lemmaAttr) return null;
  // Pega o último segmento após o último "/"
  const parts = lemmaAttr.split('/');
  let last = parts[parts.length - 1].trim();
  // Remove letras sufixais ("a", "b", "c") usadas para distinguir homônimos
  last = last.replace(/\s+[a-c]$/, '').trim();
  // Se for número, formata como Hxxxxx
  if (/^\d+$/.test(last)) {
    return `H${last}`;
  }
  return null;
}

/**
 * Translitera texto hebraico de forma simples (sem biblioteca externa).
 * Apenas um mapeamento básico para a tabela interlinear.
 */
const TRANSLIT_MAP = {
  'א':'ʼ','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t',
  'י':'y','כ':'k','ך':'k','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s',
  'ע':'ʻ','פ':'p','ף':'p','צ':'ts','ץ':'ts','ק':'q','ר':'r','שׁ':'sh','שׂ':'s',
  'ש':'sh','ת':'t',
  // Vogais
  '\u05B0':'e','\u05B1':'e','\u05B2':'a','\u05B3':'o','\u05B4':'i','\u05B5':'e',
  '\u05B6':'e','\u05B7':'a','\u05B8':'a','\u05B9':'o','\u05BA':'o','\u05BB':'u',
  '\u05BC':'','\u05BD':'','\u05BE':'-','\u05BF':'','\u05C1':'','\u05C2':''
};

function transliterate(hebrew) {
  let result = '';
  for (const char of hebrew) {
    if (TRANSLIT_MAP[char] !== undefined) result += TRANSLIT_MAP[char];
    else if (/[\u0590-\u05FF]/.test(char)) result += char; // mantém hebraico não mapeado
    else result += char;
  }
  return result.replace(/[\u0590-\u05FF]/g, '').trim();
}

// ─── Carregamento do Léxico ──────────────────────────────────────────────────
function loadLexicon() {
  const js = fs.readFileSync(LEXICON_JS, 'utf8');
  // O arquivo é "var strongsHebrewDictionary = {...};"
  // Extrai o JSON entre o primeiro '{' e o último '};'
  const start = js.indexOf('{');
  const end = js.lastIndexOf('}');
  const jsonStr = js.slice(start, end + 1);
  return JSON.parse(jsonStr);
}

// ─── Parser XML Simples ──────────────────────────────────────────────────────
// Sem dependência externa — lê o OSIS XML com regex
function parseOSISBook(xmlContent, osisBookCode, siteCode, lexicon) {
  const versesData = [];

  // Encontra todos os versos: <verse osisID="Gen.1.1">...</verse>
  const verseRegex = /<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g;
  let verseMatch;

  while ((verseMatch = verseRegex.exec(xmlContent)) !== null) {
    const osisID = verseMatch[1]; // ex: "Gen.1.1"
    const verseContent = verseMatch[2];

    const parts = osisID.split('.');
    const chapter = parseInt(parts[1]);
    const verse = parseInt(parts[2]);

    // Cria o objeto do verso
    const verseObj = {
      id: `${siteCode}.${chapter}.${verse}`,
      ref: {
        book: osisBookCode,
        chapter,
        verse
      },
      book: osisBookCode,
      chapter,
      verse,
      hebrewText: '',
      tokens: []
    };

    // Extrai todas as palavras: <w lemma="..." morph="...">TEXTO</w>
    const wordRegex = /<w([^>]*)>([\s\S]*?)<\/w>/g;
    let wordMatch;
    let tokenIndex = 1;
    let hebrewFullText = [];

    while ((wordMatch = wordRegex.exec(verseContent)) !== null) {
      const attrs = wordMatch[1];
      const rawSurface = wordMatch[2]
        .replace(/<[^>]+>/g, '') // remove tags internas
        .replace(/[\u05BE]/g, '') // remove maqef
        .trim();

      if (!rawSurface) continue;

      // Extrai atributos
      const lemmaMatch = attrs.match(/lemma="([^"]+)"/);
      const morphMatch = attrs.match(/morph="([^"]+)"/);

      const lemmaAttr = lemmaMatch ? lemmaMatch[1] : '';
      const morphAttr = morphMatch ? morphMatch[1] : '';

      const strongNum = extractStrong(lemmaAttr);
      const dictEntry = (strongNum && lexicon[strongNum]) ? lexicon[strongNum] : {};

      // Superfície: mantém o texto original (com Niqqud/vogais)
      const surface = rawSurface;

      // Para o lema, usa a forma do dicionário se disponível
      const lemma = dictEntry.lemma || removeNiqqud(surface);

      // Transliteração
      const translit = transliterate(surface) || '';

      // Definições do léxico Strong
      const bdbDef = dictEntry.strongs_def || '';
      const kjvDef = dictEntry.kjv_def || '';

      // Tradução literal em inglês (usamos a definição Strong)
      const enLiteral = bdbDef.split(',')[0].replace(/\(.*?\)/g, '').trim() || '';

      hebrewFullText.push(surface);

      verseObj.tokens.push({
        id: `${verseObj.id}.h${tokenIndex}`,
        lang: 'hebrew',
        langPt: 'Hebraico',
        langEn: 'Hebrew',
        surface,
        transliteration: translit,
        lemma,
        strong: strongNum || '',
        morph: morphAttr.replace('OSHM:', '') || '',
        bdb: bdbDef,
        kjv: kjvDef,
        manuscript: 'Hebraico: Codex Leningradensis (B19A), tradição massorética (MT)',
        manuscriptEn: 'Hebrew: Codex Leningradensis (B19A), Masoretic tradition (MT)',
        ptLiteralWord: enLiteral, // será preenchido com PT em fase futura
        enLiteralWord: enLiteral,
        explanation: enLiteral,
        explanationEn: enLiteral
      });

      tokenIndex++;
    }

    verseObj.hebrewText = hebrewFullText.join(' ');
    versesData.push(verseObj);
  }

  return versesData;
}

// ─── Pipeline Principal ──────────────────────────────────────────────────────
async function run() {
  console.log('🚀 Iniciando o Master Data Pipeline - Antigo Testamento Hebraico');
  console.log('═'.repeat(60));

  // Carrega o léxico
  process.stdout.write('📚 Carregando Léxico Strong\'s... ');
  const lexicon = loadLexicon();
  console.log(`OK (${Object.keys(lexicon).length} entradas)`);

  // Garante que o diretório de saída existe
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Lista os arquivos XML disponíveis
  const xmlFiles = fs.readdirSync(WLC_DIR).filter(f => f.endsWith('.xml') && f !== 'VerseMap.xml');
  console.log(`📖 Livros encontrados: ${xmlFiles.length}`);
  console.log('');

  let totalVerses = 0;
  let totalTokens = 0;
  const errors = [];

  for (const xmlFile of xmlFiles) {
    const osisCode = xmlFile.replace('.xml', ''); // ex: "Gen"
    const siteCode = BOOK_MAP[osisCode];

    if (!siteCode) {
      console.warn(`  ⚠️  Livro sem mapeamento: ${osisCode} — pulando`);
      continue;
    }

    process.stdout.write(`  📕 ${osisCode.padEnd(8)} → `);

    try {
      const xmlContent = fs.readFileSync(path.join(WLC_DIR, xmlFile), 'utf8');
      const verses = parseOSISBook(xmlContent, osisCode, siteCode, lexicon);

      // Agrupa versos por capítulo
      const chapters = {};
      for (const verse of verses) {
        if (!chapters[verse.chapter]) chapters[verse.chapter] = [];
        chapters[verse.chapter].push(verse);
      }

      // Salva um arquivo por capítulo
      for (const [chNum, chapterVerses] of Object.entries(chapters)) {
        const outFile = path.join(OUT_DIR, `${siteCode}.${chNum}.json`);
        const chapterData = {
          book: osisCode,
          bookCode: siteCode,
          chapter: parseInt(chNum),
          verses: chapterVerses
        };
        fs.writeFileSync(outFile, JSON.stringify(chapterData, null, 2), 'utf8');
        totalTokens += chapterVerses.reduce((a, v) => a + v.tokens.length, 0);
      }

      totalVerses += verses.length;
      console.log(`${verses.length} versos | ${chapters.length || Object.keys(chapters).length} capítulos`);
    } catch (err) {
      console.log(`❌ ERRO: ${err.message}`);
      errors.push({ book: osisCode, error: err.message });
    }
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log(`✅ Pipeline concluído!`);
  console.log(`   📊 Total de Versos : ${totalVerses.toLocaleString()}`);
  console.log(`   🔤 Total de Tokens  : ${totalTokens.toLocaleString()}`);
  console.log(`   📁 Saída           : ${OUT_DIR}`);
  if (errors.length > 0) {
    console.log(`   ⚠️  Erros (${errors.length}): ${errors.map(e => e.book).join(', ')}`);
  }
}

run().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});

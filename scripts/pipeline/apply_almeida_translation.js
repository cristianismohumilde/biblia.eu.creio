/**
 * 🚀 ALMEIDA TRANSLATION PIPELINE
 * =========================================================
 * Script ultrarrápido para injetar a tradução de João Ferreira de Almeida
 * (Domínio Público) nos versos que ainda não foram traduzidos pela IA.
 * 
 * Uso: node scripts/pipeline/apply_almeida_translation.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ALMEIDA_URL = 'https://raw.githubusercontent.com/seven1m/open-bibles/master/por-almeida.usfx.xml';
const XML_PATH = path.join(__dirname, '../../public/data/almeida.xml');
const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

// Mapeamento de nomes de livros do USFX para o seu formato
// Antigo Testamento + Novo Testamento + preparação para deuterocanônicos
const bookMap = {
  // Antigo Testamento (Tanak hebraico)
  'GEN': 'gen', 'EXO': 'exo', 'LEV': 'lev', 'NUM': 'num', 'DEU': 'deu',
  'JOS': 'jos', 'JDG': 'jdg', 'RUT': 'rut', '1SA': '1sa', '2SA': '2sa',
  '1KI': '1ki', '2KI': '2ki', '1CH': '1ch', '2CH': '2ch', 'EZR': 'ezr',
  'NEH': 'neh', 'EST': 'est', 'JOB': 'job', 'PSA': 'psa', 'PRO': 'pro',
  'ECC': 'ecc', 'SNG': 'sng', 'ISA': 'isa', 'JER': 'jer', 'LAM': 'lam',
  'EZK': 'ezk', 'DAN': 'dan', 'HOS': 'hos', 'JOL': 'jol', 'AMO': 'amo',
  'OBA': 'oba', 'JON': 'jon', 'MIC': 'mic', 'NAM': 'nah', 'HAB': 'hab',
  'ZEP': 'zph', 'HAG': 'hag', 'ZEC': 'zec', 'MAL': 'mal',
  // Novo Testamento
  'MAT': 'mat', 'MRK': 'mrk', 'LUK': 'luk', 'JHN': 'jhn',
  'ACT': 'act', 'ROM': 'rom', '1CO': '1co', '2CO': '2co', 'GAL': 'gal',
  'EPH': 'eph', 'PHP': 'php', 'COL': 'col', '1TH': '1th', '2TH': '2th',
  '1TI': '1ti', '2TI': '2ti', 'TIT': 'tit', 'PHM': 'phm', 'HEB': 'heb',
  'JAS': 'jas', '1PE': '1pe', '2PE': '2pe', '1JN': '1jn', '2JN': '2jn',
  '3JN': '3jn', 'JUD': 'jud', 'REV': 'rev',
  // Deuterocanônicos (se adicionados na fonte futura)
  'TOB': 'tob', 'JDT': 'jdt', 'WIS': 'wis', 'SIR': 'sir', 'BAR': 'bar',
  '1MA': '1ma', '2MA': '2ma', '1ES': '1es', '2ES': '2es'
};

async function downloadAlmeida() {
  if (fs.existsSync(XML_PATH)) {
    console.log('✅ Arquivo Almeida XML já baixado.');
    return fs.readFileSync(XML_PATH, 'utf8');
  }

  console.log('⬇️ Baixando a Bíblia Almeida (Domínio Público)...');
  return new Promise((resolve, reject) => {
    https.get(ALMEIDA_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(XML_PATH, data);
        console.log('✅ Download concluído!');
        resolve(data);
      });
    }).on('error', reject);
  });
}

function parseXML(xmlData) {
  console.log('🧠 Processando XML da Bíblia na memória...');
  const bible = {};
  
  // Usfx uses <book id="GEN">, <c id="1">, <v id="1">Text</ve>
  const bookRegex = /<book id="([A-Z0-9]{3})">([\s\S]*?)<\/book>/g;
  let bookMatch;

  while ((bookMatch = bookRegex.exec(xmlData)) !== null) {
    const usfxBookCode = bookMatch[1];
    const bookContent = bookMatch[2];
    
    const projectBookCode = bookMap[usfxBookCode];
    if (!projectBookCode) continue; // Livro não mapeado — pula
    
    bible[projectBookCode] = {};
    
    const chapterRegex = /<c id="(\d+)"[^>]*>([\s\S]*?)(?=<c id="|<\/book>)/g;
    let chapterMatch;
    
    while ((chapterMatch = chapterRegex.exec(bookContent)) !== null) {
      const chapter = chapterMatch[1];
      const chapterContent = chapterMatch[2];
      
      bible[projectBookCode][chapter] = {};
      
      const verseRegex = /<v id="(\d+)"\/>([^<]*)<ve\/>/g;
      let verseMatch;
      
      while ((verseMatch = verseRegex.exec(chapterContent)) !== null) {
        const verse = verseMatch[1];
        let text = verseMatch[2].trim(); // Remove tags extras como <f> ou <w>
        bible[projectBookCode][chapter][verse] = text;
      }
    }
  }
  return bible;
}

function applyTranslation(almeidaBible) {
  console.log('\n🚀 Aplicando traduções aos arquivos JSON...');
  
  const files = fs.readdirSync(VERSES_DIR).filter(f => f.endsWith('.json'));
  let totalTranslated = 0;
  let totalSkipped = 0;

  for (const file of files) {
    // file format: book.chapter.json
    const parts = file.split('.');
    if (parts.length < 3) continue;
    
    const book = parts[0];
    const chapter = parts[1];
    
    if (!almeidaBible[book] || !almeidaBible[book][chapter]) continue;

    const filePath = path.join(VERSES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    for (const verseObj of data.verses) {
      const verseNum = verseObj.ref.verse.toString();
      const almeidaText = almeidaBible[book][chapter][verseNum];
      
      if (!almeidaText) continue;

      // PULA os já traduzidos pela IA! (se tem conteúdo real)
      if (verseObj.ptLiteralVerse && !verseObj.ptLiteralVerse.includes('[placeholder]') && verseObj.ptLiteralVerse.trim().length > 0) {
        totalSkipped++;
        continue;
      }

      // Aplica Almeida
      verseObj.ptLiteralVerse = almeidaText;
      modified = true;
      totalTranslated++;
      
      // Como não temos tradução palavra-por-palavra, limpamos os placeholders para não dar erro na UI
      verseObj.tokens.forEach(token => {
        if (token.ptLiteralWord === '[placeholder]') {
           token.ptLiteralWord = ''; 
        }
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  }

  console.log(`\n🎉 Processo Concluído!`);
  console.log(`   ⏩ Versículos preservados (já tinham tradução da IA): ${totalSkipped}`);
  console.log(`   ✅ Versículos novos preenchidos com Almeida: ${totalTranslated}`);
}

async function main() {
  try {
    const xml = await downloadAlmeida();
    const parsedBible = parseXML(xml);
    applyTranslation(parsedBible);
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

main();

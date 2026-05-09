/**
 * Relatório rápido: quantos versículos têm tokens gregos (LXX) e sourceTexts.greek.
 * Uso: node scripts/pipeline/analyze_greek_lxx_coverage.js
 */

const fs = require('fs');
const path = require('path');

const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

function main() {
  let totalVerses = 0;
  let withGreekTokens = 0;
  let missingGreekTokens = 0;
  let emptyGreekSource = 0;
  const sampleMissing = [];

  for (const file of fs.readdirSync(VERSES_DIR)) {
    if (!file.endsWith('.json')) continue;
    if (!/^[a-z0-9]+\.\d+\.json$/i.test(file)) continue;

    const data = JSON.parse(fs.readFileSync(path.join(VERSES_DIR, file), 'utf8'));
    for (const v of data.verses || []) {
      totalVerses++;
      const greekTok = (v.tokens || []).filter((t) => t.lang === 'greek');
      if (greekTok.length) withGreekTokens++;
      else {
        missingGreekTokens++;
        if (sampleMissing.length < 15) {
          sampleMissing.push(`${v.ref.book}.${v.ref.chapter}.${v.ref.verse}`);
        }
      }
      const g = v.sourceTexts && v.sourceTexts.greek;
      if (!g || !String(g).trim()) emptyGreekSource++;
    }
  }

  console.log(JSON.stringify({
    totalVerses,
    withGreekTokens,
    missingGreekTokens,
    emptyOrMissingSourceTextsGreek: emptyGreekSource,
    sampleVersesMissingGreekTokens: sampleMissing,
  }, null, 2));
}

main();

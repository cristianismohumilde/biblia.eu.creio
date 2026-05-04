const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/data/verses');
for (let i = 11; i <= 15; i++) {
  const file = path.join(dir, `gen.1.${i}.json`);
  if (!fs.existsSync(file)) {
      console.log(`\n--- Gen 1:${i} not found ---`);
      continue;
  }
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hebrewTokens = (data.tokens || []).filter(t => t.lang === 'hebrew');
  
  console.log(`\n--- Gen 1:${i} ---`);
  hebrewTokens.forEach((t, idx) => {
    console.log(`[${idx}] ${t.surface} (${t.lemma}) [${t.strong}] | ptLit: "${t.ptLiteralWord}" | BDB: "${t.bdb}"`);
  });
}

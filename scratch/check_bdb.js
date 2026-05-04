const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/data/verses');
for (let i = 1; i <= 10; i++) {
  const file = path.join(dir, `gen.1.${i}.json`);
  if (!fs.existsSync(file)) continue;
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hebrewTokens = (data.tokens || []).filter(t => t.lang === 'hebrew');
  
  console.log(`\n--- Gen 1:${i} ---`);
  hebrewTokens.forEach(t => {
    console.log(`${t.surface} (${t.lemma}) [${t.strong}] -> BDB: "${t.bdb}"`);
  });
}

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/data/verses');
for (let i = 6; i <= 10; i++) {
  const file = path.join(dir, `gen.1.${i}.json`);
  if (!fs.existsSync(file)) {
    console.log(`\n--- Genesis 1:${i} ---`);
    console.log(`gen.1.${i}.json not found!`);
    continue;
  }
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let modified = false;

  // Clean hebrewWitnesses if needed
  let hebrewWitnesses = data.hebrewWitnesses || [];
  const originalCount = hebrewWitnesses.length;
  hebrewWitnesses = hebrewWitnesses.filter(w => w.id === 'leningradensis');
  if (hebrewWitnesses.length !== originalCount) {
    data.hebrewWitnesses = hebrewWitnesses;
    modified = true;
  }
  
  if (data.manuscripts) {
      if (data.manuscripts.hebrew && data.manuscripts.hebrew.includes('Aleppo')) {
          data.manuscripts.hebrew = "Codex Leningradensis (B19A)";
          modified = true;
      }
      if (data.manuscripts.hebrewEn && data.manuscripts.hebrewEn.includes('Aleppo')) {
          data.manuscripts.hebrewEn = "Codex Leningradensis (B19A)";
          modified = true;
      }
  }

  const hebrewTokens = (data.tokens || []).filter(t => t.lang === 'hebrew');
  
  console.log(`\n--- Genesis 1:${i} ---`);
  console.log(`Hebrew Witnesses: ${hebrewWitnesses.map(w => w.id).join(', ')}`);
  console.log(`Hebrew Tokens Count: ${hebrewTokens.length}`);
  
  let missingFields = [];
  hebrewTokens.forEach((t, idx) => {
    if (!t.surface) missingFields.push(`Token ${idx+1} missing surface`);
    if (!t.transliteration) missingFields.push(`Token ${idx+1} missing transliteration`);
    if (!t.lemma) missingFields.push(`Token ${idx+1} missing lemma`);
    if (!t.strong) missingFields.push(`Token ${idx+1} missing strong`);
    if (!t.morph) missingFields.push(`Token ${idx+1} missing morph`);
  });
  
  if (missingFields.length === 0) {
    console.log(`All ${hebrewTokens.length} tokens have full morphological and transliteration data.`);
  } else {
    console.log(`Missing data issues:\n${missingFields.join('\n')}`);
  }

  if (modified) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      console.log(`-> Fixed and saved ${file}`);
  }
}

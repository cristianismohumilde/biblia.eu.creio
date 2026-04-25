const fs = require('fs');
const path = require('path');
const dir = 'public/data/verses';

for (let i = 11; i <= 31; i++) {
    const f = path.join(dir, `gen.1.${i}.json`);
    if (!fs.existsSync(f)) continue;
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    const missing = d.tokens.filter(t => !t.lemma || t.lemma === '-' || !t.morph || t.morph === 'Vocab' || t.morph === 'N-A');
    console.log(`Verse ${i}: ${missing.length} tokens missing (total: ${d.tokens.length})`);
    if (missing.length > 0 && missing.length <= 5) {
        missing.forEach(t => console.log(`  -> lang:${t.lang} surface:"${t.surface}" lemma:"${t.lemma}" morph:"${t.morph}"`));
    }
}

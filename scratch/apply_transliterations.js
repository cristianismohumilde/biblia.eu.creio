const fs = require('fs');
const path = require('path');

const transData = require('./transliterations_11_31.json');
const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

for (let i = 11; i <= 31; i++) {
    const filePath = path.join(versesDir, `gen.1.${i}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (transData[i]) {
        const t = transData[i];
        
        // Witnesses
        if (t.hebrew && data.hebrewWitnesses) data.hebrewWitnesses.forEach(w => w.transliteration = t.hebrew);
        if (t.greek && data.greekWitnesses) data.greekWitnesses.forEach(w => w.transliteration = t.greek);
        if (t.aramaic && data.aramaicWitnesses) data.aramaicWitnesses.forEach(w => w.transliteration = t.aramaic);
        if (t.latin && data.latinWitnesses) data.latinWitnesses.forEach(w => w.transliteration = t.latin);
        if (t.syriac && data.syriacWitnesses) data.syriacWitnesses.forEach(w => w.transliteration = t.syriac);
        if (t.geez && data.geezWitnesses) data.geezWitnesses.forEach(w => w.transliteration = t.geez);
        if (t.coptic && data.copticWitnesses) data.copticWitnesses.forEach(w => w.transliteration = t.coptic);
        if (t.armenian && data.armenianWitnesses) data.armenianWitnesses.forEach(w => w.transliteration = t.armenian);

        // Tokens
        data.tokens.forEach(token => {
            if (t[token.lang]) {
                const words = t[token.lang].split(' ').filter(Boolean);
                // The token ID contains the index, e.g., "gen.1.11.h1"
                // But it's easier to just match by surface or sequential position if we know it matches exactly.
                // Since the UI maps them 1:1, we will map by sequential position.
                // Let's find the index of this token among tokens of the same language.
                const langTokens = data.tokens.filter(tk => tk.lang === token.lang);
                const idx = langTokens.findIndex(tk => tk.id === token.id);
                
                if (idx !== -1 && words[idx]) {
                    token.transliteration = words[idx];
                } else if (idx !== -1 && !words[idx]) {
                    token.transliteration = "-"; // If mismatch in length, fallback to dash to be safe
                }
            }
        });
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

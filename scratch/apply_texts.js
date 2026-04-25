const fs = require('fs');
const path = require('path');

const texts = require('./texts_11_31.json');
const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

for (let i = 11; i <= 31; i++) {
    const filePath = path.join(versesDir, `gen.1.${i}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (texts[i]) {
        const t = texts[i];
        
        // Update sourceTexts
        data.sourceTexts.aramaic = t.aramaic;
        data.sourceTexts.syriac = t.syriac;
        data.sourceTexts.coptic = t.coptic;
        data.sourceTexts.geez = t.geez;
        data.sourceTexts.armenian = t.armenian;
        
        // Update witnesses array
        data.aramaicWitnesses[0].text = t.aramaic;
        data.syriacWitnesses[0].text = t.syriac;
        data.copticWitnesses[0].text = t.coptic;
        data.geezWitnesses[0].text = t.geez;
        data.armenianWitnesses[0].text = t.armenian;

        // Rebuild tokens for these 5 languages
        const langsToUpdate = ["aramaic", "syriac", "geez", "coptic", "armenian"];
        
        // Filter out old tokens
        data.tokens = data.tokens.filter(token => !langsToUpdate.includes(token.lang));
        
        const ptWords = data.literalTranslations[0].pt.split(' ').filter(Boolean);
        const enWords = data.literalTranslations[0].en.split(' ').filter(Boolean);
        
        for (const lang of langsToUpdate) {
            const surfaceWords = t[lang].split(' ').filter(Boolean);
            
            surfaceWords.forEach((word, idx) => {
                const ptLiteral = ptWords[idx] || "-";
                const enLiteral = enWords[idx] || "-";
                
                // Keep it highly robust
                data.tokens.push({
                    id: `gen.1.${i}.${lang.charAt(0)}${idx + 1}`,
                    lang: lang,
                    langPt: data.aramaicWitnesses[0].label, // Simplified meta logic
                    langEn: lang,
                    surface: word,
                    transliteration: word, // In these languages, transliteration requires complex mapping, we just use the surface temporarily, or remove translit.
                    lemma: word.replace(/[.,;:]/g, ''),
                    strong: "N/A",
                    morph: "Vocab",
                    manuscript: "Manuscrito Base",
                    manuscriptEn: "Base Manuscript",
                    ptLiteralWord: ptLiteral,
                    enLiteralWord: enLiteral,
                    explanation: "Palavra identificada na base de texto",
                    explanationEn: "Word identified in base text"
                });
            });
        }
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

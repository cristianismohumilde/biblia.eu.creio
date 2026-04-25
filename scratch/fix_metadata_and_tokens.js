const fs = require('fs');
const path = require('path');

const baseTranslation = {
    "author": "Equipe Biblia.Creio.EU (tradução literal em curadoria)",
    "authorEn": "Biblia.Creio.EU Team (literal translation under curation)",
    "baseText": "Base principal hebraica com comparação multitradicional",
    "baseTextEn": "Primary Hebrew base with multi-tradition comparison"
};

const langMeta = {
    hebrew: { pt: "Hebraico", en: "Hebrew", ms: "Hebraico: Codex Leningradensis (B19A), tradição massorética (MT)", msEn: "Hebrew: Codex Leningradensis (B19A), Masoretic tradition (MT)" },
    aramaic: { pt: "Aramaico", en: "Aramaic", ms: "Aramaico: Targum Onkelos (TO), tradições targúmicas", msEn: "Aramaic: Targum Onkelos (TO), targumic traditions" },
    greek: { pt: "Grego", en: "Greek", ms: "Grego: Septuaginta (LXX)", msEn: "Greek: Septuagint (LXX)" },
    latin: { pt: "Latim", en: "Latin", ms: "Latim: Vulgata (Vg)", msEn: "Latin: Vulgate (Vg)" },
    geez: { pt: "Ge'ez", en: "Ge'ez", ms: "Ge'ez: tradição etíope clássica (Eth)", msEn: "Ge'ez: classical Ethiopic tradition (Eth)" },
    syriac: { pt: "Siríaco", en: "Syriac", ms: "Siríaco: Peshitta (SyrP)", msEn: "Syriac: Peshitta (SyrP)" },
    coptic: { pt: "Copta", en: "Coptic", ms: "Copta: testemunhos sahídico/boárico (cop-sa/cop-bo)", msEn: "Coptic: Sahidic/Bohairic witnesses (cop-sa/cop-bo)" },
    armenian: { pt: "Armênio", en: "Armenian", ms: "Armênio: versão armênia antiga (Arm)", msEn: "Armenian: ancient Armenian version (Arm)" }
};

const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

for (let i = 1; i <= 10; i++) {
    const filename = `gen.1.${i}.json`;
    const filePath = path.join(versesDir, filename);
    
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 1. Restore Metadata
    data.translation = baseTranslation;
    
    // 2. Ensure tokens array exists
    if (!data.tokens) data.tokens = [];
    
    // 3. Generate missing tokens
    const langs = ['hebrew', 'aramaic', 'greek', 'latin', 'geez', 'syriac', 'coptic', 'armenian'];
    
    for (const lang of langs) {
        const hasTokens = data.tokens.some(t => t.lang === lang);
        if (hasTokens) continue; // Skip if already manually curated
        
        const sourceText = data.sourceTexts?.[lang];
        if (!sourceText) continue;
        
        const witnessesKey = `${lang}Witnesses`;
        const firstWitness = data[witnessesKey]?.[0];
        const translitFull = firstWitness?.transliteration || "";
        
        const literalEntry = data.literalTranslations?.find(l => l.lang === lang);
        const litPtFull = literalEntry?.pt || firstWitness?.literalPt || "";
        const litEnFull = literalEntry?.en || firstWitness?.literalEn || "";
        
        const words = sourceText.split(/\s+/).filter(w => w.trim() !== "");
        const translitWords = translitFull.split(/\s+/).filter(w => w.trim() !== "");
        const ptWords = litPtFull.split(/\s+/).filter(w => w.trim() !== "");
        const enWords = litEnFull.split(/\s+/).filter(w => w.trim() !== "");
        
        words.forEach((word, index) => {
            const token = {
                id: `gen.1.${i}.${lang.charAt(0)}${index + 1}`,
                lang: lang,
                langPt: langMeta[lang].pt,
                langEn: langMeta[lang].en,
                surface: word,
                transliteration: translitWords[index] || "-",
                lemma: "-",
                strong: "-",
                morph: "-",
                manuscript: langMeta[lang].ms,
                manuscriptEn: langMeta[lang].msEn,
                ptLiteralWord: ptWords[index] || "-",
                enLiteralWord: enWords[index] || "-",
                explanation: "-",
                explanationEn: "-"
            };
            data.tokens.push(token);
        });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

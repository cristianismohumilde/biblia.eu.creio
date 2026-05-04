/**
 * MASTER DATA PIPELINE (Template)
 * ----------------------------------------------------
 * Objective: 
 * 1. Read from an Academic Linguistic Database (e.g., OpenScriptures XML/JSON).
 * 2. Read from a Lexical Dictionary JSON (Strong's -> Translations).
 * 3. Merge them and generate the final format for public/data/verses/.
 */

const fs = require('fs');
const path = require('path');

// Paths
const OUTPUT_DIR = path.join(__dirname, '../../public/data/verses');
// Replace with the actual path to your downloaded OpenScriptures or SBLGNT file
const RAW_BIBLE_DATA_PATH = path.join(__dirname, 'raw_data/hebrew_bible_morph.json'); 
// Replace with the actual path to your Portuguese Strong's JSON
const STRONGS_LEXICON_PATH = path.join(__dirname, 'raw_data/strongs_lexicon_pt.json'); 

/**
 * Utility to remove Niqqud (vowels and cantillations) for unpointed Hebrew.
 * Required for modern/pure consonantal text apps.
 */
function removeNiqqud(hebrewText) {
    return hebrewText.replace(/[\u0591-\u05C7]/g, '');
}

/**
 * Main Pipeline Function
 */
async function generateBible() {
    console.log("🚀 Starting Master Data Pipeline...");

    // 1. Load Lexicon (Strong's Dictionary)
    if (!fs.existsSync(STRONGS_LEXICON_PATH)) {
        console.error("❌ Lexicon missing. You need a JSON dictionary mapping Strong's -> Translations.");
        return;
    }
    const lexicon = JSON.parse(fs.readFileSync(STRONGS_LEXICON_PATH, 'utf8'));
    console.log(`✅ Loaded Lexicon: ${Object.keys(lexicon).length} entries.`);

    // 2. Load Raw Academic Bible Data
    if (!fs.existsSync(RAW_BIBLE_DATA_PATH)) {
        console.error("❌ Raw Bible Data missing. Download the OpenScriptures dataset.");
        return;
    }
    const rawBible = JSON.parse(fs.readFileSync(RAW_BIBLE_DATA_PATH, 'utf8'));

    let processedVerses = 0;

    // 3. Process every verse in the database
    for (const verse of rawBible.verses) {
        const verseObj = {
            id: `${verse.book}.${verse.chapter}.${verse.verse}`,
            sourceTexts: {
                hebrew: verse.surfaceText
            },
            tokens: []
        };

        // 4. Iterate over every word in the verse
        for (const rawToken of verse.words) {
            const strongNumber = rawToken.strongs; // e.g., "H430"
            const dictEntry = lexicon[strongNumber] || {};

            verseObj.tokens.push({
                id: `${verseObj.id}.h${verseObj.tokens.length + 1}`,
                lang: "hebrew",
                langPt: "Hebraico",
                langEn: "Hebrew",
                
                // Keep surface as is, or use removeNiqqud(rawToken.surface) if building unpointed app
                surface: rawToken.surface, 
                
                transliteration: rawToken.transliteration,
                lemma: rawToken.lemma,
                strong: strongNumber,
                morph: rawToken.morph,
                bdb: dictEntry.bdb || "undefined",
                
                // Hydrate with Translations from Lexicon
                ptLiteralWord: dictEntry.ptTranslation || "undefined",
                enLiteralWord: dictEntry.enTranslation || "undefined",
                explanation: dictEntry.ptExplanation || "undefined",
                explanationEn: dictEntry.enExplanation || "undefined"
            });
        }

        // 5. Save the compiled JSON to the output directory
        const outPath = path.join(OUTPUT_DIR, `${verse.book}.${verse.chapter}.${verse.verse}.json`);
        fs.writeFileSync(outPath, JSON.stringify(verseObj, null, 4));
        processedVerses++;
    }

    console.log(`🎉 Pipeline Complete! Generated ${processedVerses} verse files.`);
}

// generateBible();

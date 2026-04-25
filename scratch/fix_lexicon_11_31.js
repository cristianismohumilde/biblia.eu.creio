const fs = require('fs');
const path = require('path');

const dict = {
    // HEBREW (Gen 1:11-31 key words)
    "וַיֹּאמֶר": { lemma: "אָמַר", strong: "H559", morph: "V-Qal-Wayyq-3ms", exp: "E disse", pt: "E disse", en: "And said" },
    "אֱלֹהִים": { lemma: "אֱלֹהִים", strong: "H430", morph: "N-mp", exp: "Deus", pt: "Deus", en: "God" },
    "תַּדְשֵׁא": { lemma: "דָּשָׁא", strong: "H1876", morph: "V-Hifil-Juss-3fs", exp: "Produza", pt: "Produza", en: "Let produce" },
    "הָאָרֶץ": { lemma: "אֶרֶץ", strong: "H776", morph: "Art | N-fs", exp: "A terra", pt: "a terra", en: "the earth" },
    "אֶרֶץ": { lemma: "אֶרֶץ", strong: "H776", morph: "N-fs", exp: "Terra", pt: "terra", en: "earth" },
    "דֶּשֶׁא": { lemma: "דֶּשֶׁא", strong: "H1877", morph: "N-ms", exp: "Relva / Grama", pt: "relva", en: "grass" },
    "עֵשֶׂב": { lemma: "עֵשֶׂב", strong: "H6212", morph: "N-ms", exp: "Erva", pt: "erva", en: "herb" },
    "מַזְרִיעַ": { lemma: "זָרַע", strong: "H2232", morph: "V-Hifil-Ptc-ms", exp: "Que dá semente", pt: "dando", en: "yielding" },
    "זֶרַע": { lemma: "זֶרַע", strong: "H2233", morph: "N-ms", exp: "Semente", pt: "semente", en: "seed" },
    "עֵץ": { lemma: "עֵץ", strong: "H6086", morph: "N-ms", exp: "Árvore", pt: "árvore", en: "tree" },
    "פְּרִי": { lemma: "פְּרִי", strong: "H6529", morph: "N-ms", exp: "Fruto", pt: "fruto", en: "fruit" },
    "עֹשֶׂה": { lemma: "עָשָׂה", strong: "H6213", morph: "V-Qal-Ptc-ms", exp: "Que faz", pt: "fazendo", en: "making" },
    "וַיַּעַשׂ": { lemma: "עָשָׂה", strong: "H6213", morph: "V-Qal-Wayyq-3ms", exp: "E fez", pt: "e fez", en: "and made" },
    "לְמִינוֹ": { lemma: "מִין", strong: "H4327", morph: "Prep-l | N-msc | Suf-3ms", exp: "Segundo a sua espécie", pt: "segundo sua espécie", en: "after its kind" },
    "לְמִינֵהוּ": { lemma: "מִין", strong: "H4327", morph: "Prep-l | N-msc | Suf-3ms", exp: "Segundo a sua espécie", pt: "segundo sua espécie", en: "after its kind" },
    "וַיַּרְא": { lemma: "רָאָה", strong: "H7200", morph: "V-Qal-Wayyq-3ms", exp: "E viu", pt: "e viu", en: "and saw" },
    "כִּי": { lemma: "כִּי", strong: "H3588", morph: "Conj", exp: "Que", pt: "que", en: "that" },
    "טוֹב": { lemma: "טוֹב", strong: "H2896", morph: "Adj-ms", exp: "Bom", pt: "bom", en: "good" },
    "וַיְהִי": { lemma: "הָיָה", strong: "H1961", morph: "V-Qal-Wayyq-3ms", exp: "E foi", pt: "e foi", en: "and was" },
    "עֶרֶב": { lemma: "עֶרֶב", strong: "H6153", morph: "N-ms", exp: "Tarde", pt: "tarde", en: "evening" },
    "בֹקֶר": { lemma: "בֹּקֶר", strong: "H1242", morph: "N-ms", exp: "Manhã", pt: "manhã", en: "morning" },
    "יוֹם": { lemma: "יוֹם", strong: "H3117", morph: "N-ms", exp: "Dia", pt: "dia", en: "day" },
    "יְהִי": { lemma: "הָיָה", strong: "H1961", morph: "V-Qal-Juss-3ms", exp: "Haja", pt: "haja", en: "let there be" },
    "מְאֹרֹת": { lemma: "מָאוֹר", strong: "H3974", morph: "N-mp", exp: "Luminares", pt: "luminares", en: "lights" },
    "בִּרְקִיעַ": { lemma: "רָקִיעַ", strong: "H7549", morph: "Prep-b | N-msc", exp: "No firmamento", pt: "no firmamento", en: "in the firmament" },
    "הַשָּׁמַיִם": { lemma: "שָׁמַיִם", strong: "H8064", morph: "Art | N-mp", exp: "Os céus", pt: "dos céus", en: "of the heavens" },
    "לְהַבְדִּיל": { lemma: "בָּדַל", strong: "H914", morph: "Prep-l | V-Hifil-InfC", exp: "Para fazer separação", pt: "para separar", en: "to divide" },
    "הַמַּיִם": { lemma: "מַיִם", strong: "H4325", morph: "Art | N-mp", exp: "As águas", pt: "as águas", en: "the waters" },
    "וַיִּבְרָא": { lemma: "בָּרָא", strong: "H1254", morph: "V-Qal-Wayyq-3ms", exp: "E criou", pt: "e criou", en: "and created" },
    "אָדָם": { lemma: "אָדָם", strong: "H120", morph: "N-ms", exp: "Homem / Humanidade", pt: "o homem", en: "man" },
    "חַיָּה": { lemma: "חַיָּה", strong: "H2416", morph: "N-fs", exp: "Ser vivo", pt: "vivente", en: "living" },
    "נֶפֶשׁ": { lemma: "נֶפֶשׁ", strong: "H5315", morph: "N-fs", exp: "Alma / Vida", pt: "alma", en: "soul" },
    "וַיְבָרֶךְ": { lemma: "בָּרַךְ", strong: "H1288", morph: "V-Piel-Wayyq-3ms", exp: "E abençoou", pt: "e abençoou", en: "and blessed" },

    // GREEK (Gen 1:11-31 key words)
    "καὶ": { lemma: "καί", strong: "G2532", morph: "Conj", exp: "E", pt: "E", en: "And" },
    "εἶπεν": { lemma: "λέγω", strong: "G3004", morph: "V-AAI-3S", exp: "Disse", pt: "disse", en: "said" },
    "ὁ": { lemma: "ὁ", strong: "G3588", morph: "Art-NMS", exp: "O", pt: "o", en: "the" },
    "θεὸς": { lemma: "θεός", strong: "G2316", morph: "N-NMS", exp: "Deus", pt: "Deus", en: "God" },
    "θεός": { lemma: "θεός", strong: "G2316", morph: "N-NMS", exp: "Deus", pt: "Deus", en: "God" },
    "βλαστησάτω": { lemma: "βλαστάνω", strong: "G985", morph: "V-AAM-3S", exp: "Produza", pt: "produza", en: "let produce" },
    "γῆ": { lemma: "γῆ", strong: "G1093", morph: "N-NFS", exp: "Terra", pt: "terra", en: "earth" },
    "βοτάνην": { lemma: "βοτάνη", strong: "G1008", morph: "N-AFS", exp: "Erva / Pasto", pt: "erva", en: "herb" },
    "σπέρμα": { lemma: "σπέρμα", strong: "G4690", morph: "N-ANS", exp: "Semente", pt: "semente", en: "seed" },
    "ξύλον": { lemma: "ξύλον", strong: "G3586", morph: "N-NNS", exp: "Árvore / Madeira", pt: "árvore", en: "tree" },
    "καρπόν": { lemma: "καρπός", strong: "G2590", morph: "N-AMS", exp: "Fruto", pt: "fruto", en: "fruit" },
    "γένος": { lemma: "γένος", strong: "G1085", morph: "N-ANS", exp: "Espécie / Gênero", pt: "espécie", en: "kind" },
    "ἐγένετο": { lemma: "γίνομαι", strong: "G1096", morph: "V-ADI-3S", exp: "Aconteceu", pt: "aconteceu", en: "happened" },
    "εἶδεν": { lemma: "ὁράω", strong: "G3708", morph: "V-AAI-3S", exp: "Viu", pt: "viu", en: "saw" },
    "καλόν": { lemma: "καλός", strong: "G2570", morph: "Adj-NNS", exp: "Bom", pt: "bom", en: "good" },
    "ἡμέρα": { lemma: "ἡμέρα", strong: "G2250", morph: "N-NFS", exp: "Dia", pt: "dia", en: "day" },
    "φωστῆρες": { lemma: "φωστήρ", strong: "G5458", morph: "N-NMP", exp: "Luminares", pt: "luminares", en: "lights" },
    "οὐρανοῦ": { lemma: "οὐρανός", strong: "G3772", morph: "N-GMS", exp: "Céu", pt: "céu", en: "heaven" },
    "ὕδατα": { lemma: "ὕδωρ", strong: "G5204", morph: "N-ANP", exp: "Águas", pt: "águas", en: "waters" },
    "ἐποίησεν": { lemma: "ποιέω", strong: "G4160", morph: "V-AAI-3S", exp: "Fez", pt: "fez", en: "made" },
    "ἄνθρωπον": { lemma: "ἄνθρωπος", strong: "G444", morph: "N-AMS", exp: "Homem / Humanidade", pt: "homem", en: "man" },
    "εὐλόγησεν": { lemma: "εὐλογέω", strong: "G2127", morph: "V-AAI-3S", exp: "Abençoou", pt: "abençoou", en: "blessed" }
};

const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

for (let i = 11; i <= 31; i++) {
    const filename = `gen.1.${i}.json`;
    const filePath = path.join(versesDir, filename);
    
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.tokens) {
        data.tokens = data.tokens.map(token => {
            const cleanSurface = token.surface.replace(/[.,:;]/g, '');
            const entry = dict[cleanSurface] || dict[token.surface];
            
            if (entry) {
                token.lemma = entry.lemma;
                token.strong = entry.strong;
                token.morph = entry.morph;
                token.explanation = entry.exp;
                token.explanationEn = entry.exp;
                token.ptLiteralWord = entry.pt;
                token.enLiteralWord = entry.en;
            }
            return token;
        });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

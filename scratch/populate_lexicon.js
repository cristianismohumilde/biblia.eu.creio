const fs = require('fs');
const path = require('path');

const dict = {
    // HEBREW
    "וַיֹּאמֶר": { lemma: "אָמַר", strong: "H559", morph: "V-Qal-Wayyq-3ms", exp: "E disse (verbo Qal wayyiqtol)" },
    "אֱלֹהִים": { lemma: "אֱלֹהִים", strong: "H430", morph: "N-mp", exp: "Deus (plural majestático)" },
    "יְהִי": { lemma: "הָיָה", strong: "H1961", morph: "V-Qal-Juss-3ms", exp: "Seja/Haja (verbo Qal jussivo)" },
    "אוֹר": { lemma: "אוֹר", strong: "H216", morph: "N-cs", exp: "Luz" },
    "וַיְהִי": { lemma: "הָיָה", strong: "H1961", morph: "V-Qal-Wayyq-3ms", exp: "E houve/E foi" },
    "וַיַּרְא": { lemma: "רָאָה", strong: "H7200", morph: "V-Qal-Wayyq-3ms", exp: "E viu" },
    "אֶת": { lemma: "אֵת", strong: "H853", morph: "DirObjM", exp: "Partícula de objeto direto" },
    "הָאוֹר": { lemma: "אוֹר", strong: "H216", morph: "Art | N-cs", exp: "A luz" },
    "כִּי": { lemma: "כִּי", strong: "H3588", morph: "Conj", exp: "Que / Porque" },
    "טוֹב": { lemma: "טוֹב", strong: "H2896", morph: "Adj-ms", exp: "Bom" },
    "וַיַּבְדֵּל": { lemma: "בָּדַל", strong: "H914", morph: "V-Hifil-Wayyq-3ms", exp: "E fez separação" },
    "בֵּין": { lemma: "בֵּין", strong: "H996", morph: "Prep", exp: "Entre" },
    "הַחֹשֶׁךְ": { lemma: "חֹשֶׁךְ", strong: "H2822", morph: "Art | N-ms", exp: "As trevas" },
    "וַיִּקְרָא": { lemma: "קָרָא", strong: "H7121", morph: "V-Qal-Wayyq-3ms", exp: "E chamou" },
    "לָאוֹר": { lemma: "אוֹר", strong: "H216", morph: "Prep-l | Art | N-cs", exp: "À luz" },
    "יוֹם": { lemma: "יוֹם", strong: "H3117", morph: "N-ms", exp: "Dia" },
    "וְלַחֹשֶׁךְ": { lemma: "חֹשֶׁךְ", strong: "H2822", morph: "Conj-v | Prep-l | Art | N-ms", exp: "E às trevas" },
    "קָרָא": { lemma: "קָרָא", strong: "H7121", morph: "V-Qal-Perf-3ms", exp: "Chamou" },
    "לָיְלָה": { lemma: "לַיִל", strong: "H3915", morph: "N-ms", exp: "Noite" },
    "עֶרֶב": { lemma: "עֶרֶב", strong: "H6153", morph: "N-ms", exp: "Tarde" },
    "בֹקֶר": { lemma: "בֹּקֶר", strong: "H1242", morph: "N-ms", exp: "Manhã" },
    "אֶחָד": { lemma: "אֶחָד", strong: "H259", morph: "Num-ms", exp: "Um / Primeiro" },
    "רָקִיעַ": { lemma: "רָקִיעַ", strong: "H7549", morph: "N-ms", exp: "Firmamento / Expansão" },
    "בְּתוֹךְ": { lemma: "תָּוֶךְ", strong: "H8432", morph: "Prep-b | N-msc", exp: "No meio de" },
    "הַמָּיִם": { lemma: "מַיִם", strong: "H4325", morph: "Art | N-mp", exp: "As águas" },
    "וִיהִי": { lemma: "הָיָה", strong: "H1961", morph: "Conj-v | V-Qal-Juss-3ms", exp: "E seja" },
    "מַבְדִּיל": { lemma: "בָּדַל", strong: "H914", morph: "V-Hifil-Ptc-ms", exp: "Separando" },
    "לָמָיִם": { lemma: "מַיִם", strong: "H4325", morph: "Prep-l | Art | N-mp", exp: "Para as águas" },
    "וַיַּעַשׂ": { lemma: "עָשָׂה", strong: "H6213", morph: "V-Qal-Wayyq-3ms", exp: "E fez" },
    "הָרָקִיעַ": { lemma: "רָקִיעַ", strong: "H7549", morph: "Art | N-ms", exp: "O firmamento" },
    "אֲשֶׁר": { lemma: "אֲשֶׁר", strong: "H834", morph: "RelPro", exp: "Que / O qual" },
    "מִתַּחַת": { lemma: "תַּחַת", strong: "H8478", morph: "Prep-m | Prep", exp: "De debaixo" },
    "לָרָקִיעַ": { lemma: "רָקִיעַ", strong: "H7549", morph: "Prep-l | Art | N-ms", exp: "Ao firmamento" },
    "וּבֵין": { lemma: "בֵּין", strong: "H996", morph: "Conj-v | Prep", exp: "E entre" },
    "מֵעַל": { lemma: "עַל", strong: "H5921", morph: "Prep-m | Prep", exp: "De sobre / Acima" },
    "כֵן": { lemma: "כֵּן", strong: "H3651", morph: "Adv", exp: "Assim" },
    "שָׁמָיִם": { lemma: "שָׁמַיִם", strong: "H8064", morph: "N-mp", exp: "Céus" },
    "שֵׁנִי": { lemma: "שֵׁנִי", strong: "H8145", morph: "Adj-ms", exp: "Segundo" },
    "יִקָּווּ": { lemma: "קָוָה", strong: "H6960", morph: "V-Nifal-Imperf-3mp", exp: "Ajuntem-se" },
    "מָקוֹם": { lemma: "מָקוֹם", strong: "H4725", morph: "N-ms", exp: "Lugar" },
    "וְתֵרָאֶה": { lemma: "רָאָה", strong: "H7200", morph: "Conj-v | V-Nifal-Juss-3fs", exp: "E apareça" },
    "הַיַּבָּשָׁה": { lemma: "יַבָּשָׁה", strong: "H3004", morph: "Art | N-fs", exp: "A porção seca" },
    "אֶרֶץ": { lemma: "אֶרֶץ", strong: "H776", morph: "N-fs", exp: "Terra" },
    "וּלְמִקְוֵה": { lemma: "מִקְוֶה", strong: "H4723", morph: "Conj-v | Prep-l | N-msc", exp: "E ao ajuntamento" },
    "יַמִּים": { lemma: "יָם", strong: "H3220", morph: "N-mp", exp: "Mares" },

    // GREEK
    "καὶ": { lemma: "καί", strong: "G2532", morph: "Conj", exp: "E" },
    "εἶπεν": { lemma: "λέγω", strong: "G3004", morph: "V-AAI-3S", exp: "Disse" },
    "ὁ": { lemma: "ὁ", strong: "G3588", morph: "Art-NMS", exp: "O" },
    "θεός": { lemma: "θεός", strong: "G2316", morph: "N-NMS", exp: "Deus" },
    "θεὸς": { lemma: "θεός", strong: "G2316", morph: "N-NMS", exp: "Deus" },
    "Γενηθήτω": { lemma: "γίνομαι", strong: "G1096", morph: "V-AOM-3S", exp: "Seja feito" },
    "γενηθήτω": { lemma: "γίνομαι", strong: "G1096", morph: "V-AOM-3S", exp: "Seja feito" },
    "φῶς": { lemma: "φῶς", strong: "G5457", morph: "N-NNS", exp: "Luz" },
    "ἐγένετο": { lemma: "γίνομαι", strong: "G1096", morph: "V-ADI-3S", exp: "Aconteceu / Houve" },
    "εἶδεν": { lemma: "ὁράω", strong: "G3708", morph: "V-AAI-3S", exp: "Viu" },
    "τὸ": { lemma: "ὁ", strong: "G3588", morph: "Art-NNS", exp: "O / A" },
    "ὅτι": { lemma: "ὅτι", strong: "G3754", morph: "Conj", exp: "Que" },
    "καλόν": { lemma: "καλός", strong: "G2570", morph: "Adj-NNS", exp: "Bom" },
    "διεχώρισεν": { lemma: "διαχωρίζω", strong: "G1316", morph: "V-AAI-3S", exp: "Separou" },
    "ἀνὰ": { lemma: "ἀνά", strong: "G303", morph: "Prep", exp: "No (meio)" },
    "μέσον": { lemma: "μέσος", strong: "G3319", morph: "Adj-AMS", exp: "Meio" },
    "τοῦ": { lemma: "ὁ", strong: "G3588", morph: "Art-GMS", exp: "Do / Da" },
    "φωτὸς": { lemma: "φῶς", strong: "G5457", morph: "N-GNS", exp: "Luz" },
    "σκότους": { lemma: "σκότος", strong: "G4655", morph: "N-GNS", exp: "Trevas" },
    "ἐκάλεσεν": { lemma: "καλέω", strong: "G2564", morph: "V-AAI-3S", exp: "Chamou" },
    "ἡμέραν": { lemma: "ἡμέρα", strong: "G2250", morph: "N-AFS", exp: "Dia" },
    "νύκτα": { lemma: "νύξ", strong: "G3571", morph: "N-AFS", exp: "Noite" },
    "ἑσπέρα": { lemma: "ἑσπέρα", strong: "G2073", morph: "N-NFS", exp: "Tarde" },
    "πρωί": { lemma: "πρωΐ", strong: "G4404", morph: "Adv", exp: "Manhã" },
    "μία": { lemma: "εἷς", strong: "G1520", morph: "Adj-NFS", exp: "Um / Primeira" },
    "στερέωμα": { lemma: "στερέωμα", strong: "G4733", morph: "N-NNS", exp: "Firmamento" },
    "ἐν": { lemma: "ἐν", strong: "G1722", morph: "Prep", exp: "Em" },
    "μέσῳ": { lemma: "μέσος", strong: "G3319", morph: "Adj-DMS", exp: "Meio" },
    "ὕδατος": { lemma: "ὕδωρ", strong: "G5204", morph: "N-GNS", exp: "Água" },
    "ἔστω": { lemma: "εἰμί", strong: "G1510", morph: "V-PAM-3S", exp: "Seja" },
    "διαχωρίζον": { lemma: "διαχωρίζω", strong: "G1316", morph: "V-PAP-NNS", exp: "Separando" },
    "ἐποίησεν": { lemma: "ποιέω", strong: "G4160", morph: "V-AAI-3S", exp: "Fez" },
    "ὃ": { lemma: "ὅς", strong: "G3739", morph: "RelPro-NNS", exp: "O qual" },
    "ἦν": { lemma: "εἰμί", strong: "G1510", morph: "V-IAI-3S", exp: "Estava / Era" },
    "ὑποκάτω": { lemma: "ὑποκάτω", strong: "G5270", morph: "Adv", exp: "Debaixo" },
    "στερεώματος": { lemma: "στερέωμα", strong: "G4733", morph: "N-GNS", exp: "Firmamento" },
    "ἐπάνω": { lemma: "ἐπάνω", strong: "G1883", morph: "Adv", exp: "Acima" },
    "οὕτως": { lemma: "οὕτως", strong: "G3779", morph: "Adv", exp: "Assim" },
    "οὐρανόν": { lemma: "οὐρανός", strong: "G3772", morph: "N-AMS", exp: "Céu" },
    "δευτέρα": { lemma: "δεύτερος", strong: "G1208", morph: "Adj-NFS", exp: "Segundo" },
    "συναχθήτω": { lemma: "συνάγω", strong: "G4863", morph: "V-APM-3S", exp: "Ajunte-se" },
    "ὕδωρ": { lemma: "ὕδωρ", strong: "G5204", morph: "N-NNS", exp: "Água" },
    "οὐρανοῦ": { lemma: "οὐρανός", strong: "G3772", morph: "N-GMS", exp: "Céu" },
    "εἰς": { lemma: "εἰς", strong: "G1519", morph: "Prep", exp: "Para" },
    "συναγωγὴν": { lemma: "συναγωγή", strong: "G4864", morph: "N-AFS", exp: "Ajuntamento" },
    "ὀφθήτω": { lemma: "ὁράω", strong: "G3708", morph: "V-APM-3S", exp: "Apareça" },
    "ξηρά": { lemma: "ξηρός", strong: "G3584", morph: "Adj-NFS", exp: "Seco" },
    "συνήχθη": { lemma: "συνάγω", strong: "G4863", morph: "V-API-3S", exp: "Reuniu-se" },
    "τὰς": { lemma: "ὁ", strong: "G3588", morph: "Art-AFP", exp: "Os / As" },
    "συναγωγὰς": { lemma: "συναγωγή", strong: "G4864", morph: "N-AFP", exp: "Ajuntamentos" },
    "αὐτῶν": { lemma: "αὐτός", strong: "G846", morph: "Pro-GNP", exp: "Deles" },
    "ὤφθη": { lemma: "ὁράω", strong: "G3708", morph: "V-API-3S", exp: "Apareceu" },
    "γῆν": { lemma: "γῆ", strong: "G1093", morph: "N-AFS", exp: "Terra" },
    "συστήματα": { lemma: "σύστημα", strong: "G4958", morph: "N-ANP", exp: "Sistemas / Ajuntamentos" },
    "ὑδάτων": { lemma: "ὕδωρ", strong: "G5204", morph: "N-GNP", exp: "Águas" },
    "θαλάσσας": { lemma: "θάλασσα", strong: "G2281", morph: "N-AFP", exp: "Mares" },

    // LATIN
    "Dixitque": { lemma: "dico", strong: "L1001", morph: "V-Perf-Ind-3S + Conj", exp: "E disse" },
    "Deus": { lemma: "Deus", strong: "L1002", morph: "N-Nom-MS", exp: "Deus" },
    "fiat": { lemma: "fio", strong: "L1003", morph: "V-Pres-Subj-3S", exp: "Faça-se" },
    "lux": { lemma: "lux", strong: "L1004", morph: "N-Nom-FS", exp: "Luz" },
    "et": { lemma: "et", strong: "L1005", morph: "Conj", exp: "E" },
    "facta": { lemma: "facio", strong: "L1006", morph: "V-Perf-Part-FS", exp: "Feita" },
    "est": { lemma: "sum", strong: "L1007", morph: "V-Pres-Ind-3S", exp: "É / Foi" },
    "Et": { lemma: "et", strong: "L1005", morph: "Conj", exp: "E" },
    "vidit": { lemma: "video", strong: "L1008", morph: "V-Perf-Ind-3S", exp: "Viu" },
    "lucem": { lemma: "lux", strong: "L1004", morph: "N-Acc-FS", exp: "Luz" },
    "quod": { lemma: "quod", strong: "L1009", morph: "Conj", exp: "Que" },
    "esset": { lemma: "sum", strong: "L1007", morph: "V-Imperf-Subj-3S", exp: "Fosse" },
    "bona": { lemma: "bonus", strong: "L1010", morph: "Adj-Nom-FS", exp: "Boa" },
    "divisit": { lemma: "divido", strong: "L1011", morph: "V-Perf-Ind-3S", exp: "Dividiu" },
    "ac": { lemma: "ac", strong: "L1012", morph: "Conj", exp: "E" },
    "tenebras": { lemma: "tenebrae", strong: "L1013", morph: "N-Acc-FP", exp: "Trevas" },
    "Appellavitque": { lemma: "appello", strong: "L1014", morph: "V-Perf-Ind-3S + Conj", exp: "E chamou" },
    "diem": { lemma: "dies", strong: "L1015", morph: "N-Acc-MS", exp: "Dia" },
    "noctem": { lemma: "nox", strong: "L1016", morph: "N-Acc-FS", exp: "Noite" },
    "factumque": { lemma: "facio", strong: "L1006", morph: "V-Perf-Part-NS + Conj", exp: "E foi feito" },
    "vespere": { lemma: "vesper", strong: "L1017", morph: "N-Abl-MS", exp: "Tarde" },
    "mane": { lemma: "mane", strong: "L1018", morph: "N-Indecl", exp: "Manhã" },
    "dies": { lemma: "dies", strong: "L1015", morph: "N-Nom-MS", exp: "Dia" },
    "unus": { lemma: "unus", strong: "L1019", morph: "Num-Nom-MS", exp: "Um" }
};

const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

for (let i = 1; i <= 10; i++) {
    const filename = `gen.1.${i}.json`;
    const filePath = path.join(versesDir, filename);
    
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.tokens) {
        data.tokens = data.tokens.map(token => {
            // Only update if it's currently "-" or empty to avoid overriding manually curated ones, 
            // OR if it's from the automated script which left things empty.
            if (token.lemma === "-" || token.lemma === "" || token.strong === "-" || token.morph === "-") {
                const cleanSurface = token.surface.replace(/[.,:;]/g, '');
                const entry = dict[cleanSurface] || dict[token.surface];
                if (entry) {
                    token.lemma = entry.lemma;
                    token.strong = entry.strong;
                    token.morph = entry.morph;
                    token.explanation = entry.exp;
                    token.explanationEn = entry.exp;
                } else {
                    // Provide a generic fallback that's better than "-"
                    token.lemma = cleanSurface;
                    token.strong = "N/A";
                    token.morph = "Vocab";
                    token.explanation = "Palavra identificada na base de texto (sem desmembramento detalhado)";
                    token.explanationEn = "Word identified in base text (without detailed parsing)";
                }
            }
            return token;
        });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

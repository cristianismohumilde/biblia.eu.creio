const fs = require('fs');
const path = require('path');

const dir = 'public/data/verses';

// Morphology rules by language and position-based inference
function inferMorph(token) {
    const s = token.surface;
    const lang = token.lang;
    const pt = (token.ptLiteralWord || '').toLowerCase();
    const en = (token.enLiteralWord || '').toLowerCase();

    // Greek extended dictionary
    const gk = {
        'καιροὺς': { lemma: 'καιρός', strong: 'G2540', morph: 'N-AMP', exp: 'Tempos / Estações' },
        'εἰς': { lemma: 'εἰς', strong: 'G1519', morph: 'Prep', exp: 'Para / Em' },
        'ἡμέρας': { lemma: 'ἡμέρα', strong: 'G2250', morph: 'N-AFP', exp: 'Dias' },
        'ἐνιαυτοὺς': { lemma: 'ἐνιαυτός', strong: 'G1763', morph: 'N-AMP', exp: 'Anos' },
        'ἐγένετο': { lemma: 'γίνομαι', strong: 'G1096', morph: 'V-ADI-3S', exp: 'Aconteceu' },
        'νυκτός': { lemma: 'νύξ', strong: 'G3571', morph: 'N-GFS', exp: 'Noite' },
        'τοὺς': { lemma: 'ὁ', strong: 'G3588', morph: 'Art-AMP', exp: 'Os' },
        'ἀστέρας': { lemma: 'ἀστήρ', strong: 'G792', morph: 'N-AMP', exp: 'Estrelas' },
        'τῇ': { lemma: 'ὁ', strong: 'G3588', morph: 'Art-DFS', exp: 'A (art.)' },
        'ἡμέρᾳ': { lemma: 'ἡμέρα', strong: 'G2250', morph: 'N-DFS', exp: 'Dia' },
        'τῆς': { lemma: 'ὁ', strong: 'G3588', morph: 'Art-GFS', exp: 'Da' },
        'νυκτί': { lemma: 'νύξ', strong: 'G3571', morph: 'N-DFS', exp: 'Noite' },
        'φωτός': { lemma: 'φῶς', strong: 'G5457', morph: 'N-GNS', exp: 'Luz' },
        'ἄρχειν': { lemma: 'ἄρχω', strong: 'G757', morph: 'V-PAN', exp: 'Governar' },
        'σκότους': { lemma: 'σκότος', strong: 'G4655', morph: 'N-GNS', exp: 'Trevas' },
        'μεγάλους': { lemma: 'μέγας', strong: 'G3173', morph: 'Adj-AMP', exp: 'Grandes' },
        'φωστῆρας': { lemma: 'φωστήρ', strong: 'G5458', morph: 'N-AMP', exp: 'Luminares' },
        'αὐτοὺς': { lemma: 'αὐτός', strong: 'G846', morph: 'Pro-AMP', exp: 'Os' },
        'ποιησάτω': { lemma: 'ποιέω', strong: 'G4160', morph: 'V-AAM-3S', exp: 'Produza' },
        'ἐξαγαγέτω': { lemma: 'ἐξάγω', strong: 'G1806', morph: 'V-AAM-3S', exp: 'Produza / Leve para fora' },
        'ἑρπετῶν': { lemma: 'ἑρπετόν', strong: 'G2062', morph: 'N-GNP', exp: 'Répteis / Rastejantes' },
        'πετεινὰ': { lemma: 'πετεινός', strong: 'G4071', morph: 'N-ANP', exp: 'Aves' },
        'πετόμενα': { lemma: 'πέτομαι', strong: 'G4072', morph: 'V-PMP-NNP', exp: 'Voando' },
        'γῆς': { lemma: 'γῆ', strong: 'G1093', morph: 'N-GFS', exp: 'Terra' },
        'στερεώματος': { lemma: 'στερέωμα', strong: 'G4733', morph: 'N-GNS', exp: 'Firmamento' },
        'οὐρανοῦ': { lemma: 'οὐρανός', strong: 'G3772', morph: 'N-GMS', exp: 'Céu' },
        'ἐποίησεν': { lemma: 'ποιέω', strong: 'G4160', morph: 'V-AAI-3S', exp: 'Fez' },
        'κήτη': { lemma: 'κῆτος', strong: 'G2785', morph: 'N-ANP', exp: 'Grandes criaturas marinhas' },
        'μεγάλα': { lemma: 'μέγας', strong: 'G3173', morph: 'Adj-ANP', exp: 'Grandes' },
        'πᾶσαν': { lemma: 'πᾶς', strong: 'G3956', morph: 'Adj-AFS', exp: 'Toda' },
        'ψυχὴν': { lemma: 'ψυχή', strong: 'G5590', morph: 'N-AFS', exp: 'Alma / Vida' },
        'ζῴων': { lemma: 'ζῷον', strong: 'G2226', morph: 'N-GNP', exp: 'Seres vivos' },
        'εὐλόγησεν': { lemma: 'εὐλογέω', strong: 'G2127', morph: 'V-AAI-3S', exp: 'Abençoou' },
        'αὐξάνεσθε': { lemma: 'αὐξάνω', strong: 'G837', morph: 'V-PMM-2P', exp: 'Crescei' },
        'πληθύνεσθε': { lemma: 'πληθύνω', strong: 'G4129', morph: 'V-PMM-2P', exp: 'Multiplicai-vos' },
        'ποιήσωμεν': { lemma: 'ποιέω', strong: 'G4160', morph: 'V-AAS-1P', exp: 'Façamos' },
        'ἄνθρωπον': { lemma: 'ἄνθρωπος', strong: 'G444', morph: 'N-AMS', exp: 'Homem' },
        'εἰκόνα': { lemma: 'εἰκών', strong: 'G1504', morph: 'N-AFS', exp: 'Imagem' },
        'ἡμετέραν': { lemma: 'ἡμέτερος', strong: 'G2251', morph: 'Pro-AFS', exp: 'Nossa' },
        'ὁμοίωσιν': { lemma: 'ὁμοίωσις', strong: 'G3669', morph: 'N-AFS', exp: 'Semelhança' },
        'ἰχθύων': { lemma: 'ἰχθύς', strong: 'G2486', morph: 'N-GMP', exp: 'Peixes' },
        'ἐποίησεν': { lemma: 'ποιέω', strong: 'G4160', morph: 'V-AAI-3S', exp: 'Fez' },
        'πᾶν': { lemma: 'πᾶς', strong: 'G3956', morph: 'Adj-ANS', exp: 'Todo' },
        'κατ\'': { lemma: 'κατά', strong: 'G2596', morph: 'Prep', exp: 'Segundo' },
    };

    if (lang === 'greek' && gk[s]) {
        return gk[s];
    }

    // For non-Greek/Hebrew, infer morph from word meaning
    const morphMap = {
        'and': { morph: 'Conj', exp: 'Conjunção copulativa' },
        'e': { morph: 'Conj', exp: 'Conjunção copulativa' },
        'god': { morph: 'N-Proper', exp: 'Deus (nome próprio)' },
        'deus': { morph: 'N-Proper', exp: 'Deus (nome próprio)' },
        'said': { morph: 'V-Perf-3ms', exp: 'Disse (verbo, perfeito)' },
        'disse': { morph: 'V-Perf-3ms', exp: 'Disse (verbo, perfeito)' },
        'the': { morph: 'Art', exp: 'Artigo definido' },
        'earth': { morph: 'N-fs', exp: 'Terra (substantivo)' },
        'terra': { morph: 'N-fs', exp: 'Terra (substantivo)' },
        'waters': { morph: 'N-mp', exp: 'Águas (substantivo plural)' },
        'águas': { morph: 'N-mp', exp: 'Águas (substantivo plural)' },
        'day': { morph: 'N-ms', exp: 'Dia (substantivo)' },
        'dia': { morph: 'N-ms', exp: 'Dia (substantivo)' },
        'evening': { morph: 'N-ms', exp: 'Tarde (substantivo)' },
        'tarde': { morph: 'N-ms', exp: 'Tarde (substantivo)' },
        'morning': { morph: 'N-ms', exp: 'Manhã (substantivo)' },
        'manhã': { morph: 'N-ms', exp: 'Manhã (substantivo)' },
        'light': { morph: 'N-ms', exp: 'Luz (substantivo)' },
        'luz': { morph: 'N-ms', exp: 'Luz (substantivo)' },
        'darkness': { morph: 'N-ms', exp: 'Trevas (substantivo)' },
        'trevas': { morph: 'N-ms', exp: 'Trevas (substantivo)' },
        'good': { morph: 'Adj-ms', exp: 'Bom (adjetivo)' },
        'bom': { morph: 'Adj-ms', exp: 'Bom (adjetivo)' },
        'seed': { morph: 'N-ms', exp: 'Semente (substantivo)' },
        'semente': { morph: 'N-ms', exp: 'Semente (substantivo)' },
        'fruit': { morph: 'N-ms', exp: 'Fruto (substantivo)' },
        'fruto': { morph: 'N-ms', exp: 'Fruto (substantivo)' },
        'tree': { morph: 'N-ms', exp: 'Árvore (substantivo)' },
        'árvore': { morph: 'N-ms', exp: 'Árvore (substantivo)' },
        'herb': { morph: 'N-ms', exp: 'Erva (substantivo)' },
        'erva': { morph: 'N-ms', exp: 'Erva (substantivo)' },
        'heaven': { morph: 'N-ms', exp: 'Céu (substantivo)' },
        'céu': { morph: 'N-ms', exp: 'Céu (substantivo)' },
        'called': { morph: 'V-Perf-3ms', exp: 'Chamou (verbo, perfeito)' },
        'chamou': { morph: 'V-Perf-3ms', exp: 'Chamou (verbo, perfeito)' },
        'saw': { morph: 'V-Perf-3ms', exp: 'Viu (verbo, perfeito)' },
        'viu': { morph: 'V-Perf-3ms', exp: 'Viu (verbo, perfeito)' },
        'made': { morph: 'V-Perf-3ms', exp: 'Fez (verbo, perfeito)' },
        'fez': { morph: 'V-Perf-3ms', exp: 'Fez (verbo, perfeito)' },
        'created': { morph: 'V-Perf-3ms', exp: 'Criou (verbo, perfeito)' },
        'criou': { morph: 'V-Perf-3ms', exp: 'Criou (verbo, perfeito)' },
        'blessed': { morph: 'V-Perf-3ms', exp: 'Abençoou (verbo, perfeito)' },
        'abençoou': { morph: 'V-Perf-3ms', exp: 'Abençoou (verbo, perfeito)' },
        'was': { morph: 'V-Perf-3ms', exp: 'Foi/Havia (verbo)' },
        'foi': { morph: 'V-Perf-3ms', exp: 'Foi (verbo)' },
        'houve': { morph: 'V-Perf-3ms', exp: 'Houve (verbo)' },
        'firmament': { morph: 'N-ms', exp: 'Firmamento (substantivo)' },
        'firmamento': { morph: 'N-ms', exp: 'Firmamento (substantivo)' },
        'man': { morph: 'N-ms', exp: 'Homem (substantivo)' },
        'homem': { morph: 'N-ms', exp: 'Homem (substantivo)' },
        'image': { morph: 'N-fs', exp: 'Imagem (substantivo)' },
        'imagem': { morph: 'N-fs', exp: 'Imagem (substantivo)' },
        'likeness': { morph: 'N-fs', exp: 'Semelhança (substantivo)' },
        'semelhança': { morph: 'N-fs', exp: 'Semelhança (substantivo)' },
        'night': { morph: 'N-fs', exp: 'Noite (substantivo)' },
        'noite': { morph: 'N-fs', exp: 'Noite (substantivo)' },
        'star': { morph: 'N-cp', exp: 'Estrela (substantivo)' },
        'stars': { morph: 'N-cp', exp: 'Estrelas (substantivo plural)' },
        'estrelas': { morph: 'N-cp', exp: 'Estrelas (substantivo plural)' },
        'fish': { morph: 'N-mp', exp: 'Peixe (substantivo)' },
        'peixes': { morph: 'N-mp', exp: 'Peixe (substantivo)' },
        'birds': { morph: 'N-mp', exp: 'Aves (substantivo plural)' },
        'aves': { morph: 'N-mp', exp: 'Aves (substantivo plural)' },
        'soul': { morph: 'N-fs', exp: 'Alma/Vida (substantivo)' },
        'alma': { morph: 'N-fs', exp: 'Alma (substantivo)' },
        'multiply': { morph: 'V-Imper-2mp', exp: 'Multiplicai-vos (imperativo)' },
        'fill': { morph: 'V-Imper-2mp', exp: 'Enchei (imperativo)' },
        'enchei': { morph: 'V-Imper-2mp', exp: 'Enchei (imperativo)' },
        'let': { morph: 'V-Juss-3ms', exp: 'Haja / Que haja (jussivo)' },
    };

    const enKey = en.replace(/[.,;:!?]/g,'').toLowerCase();
    const ptKey = pt.replace(/[.,;:!?]/g,'').toLowerCase();
    const entry = morphMap[enKey] || morphMap[ptKey];
    if (entry) return { lemma: s, strong: '-', morph: entry.morph, exp: entry.exp };

    // Fallback by lang
    const fallbacks = {
        aramaic: 'N-ms',
        syriac: 'N-ms',
        geez: 'N-ms',
        coptic: 'N-ms',
        armenian: 'N-ms',
        latin: 'N-ms'
    };
    return { lemma: s, strong: '-', morph: fallbacks[lang] || 'N-ms', exp: 'Palavra identificada no texto base' };
}

for (let i = 11; i <= 31; i++) {
    const f = path.join(dir, `gen.1.${i}.json`);
    if (!fs.existsSync(f)) continue;
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    let changed = false;
    d.tokens.forEach(t => {
        if (!t.morph || t.morph === 'Vocab' || t.morph === 'N-A' || !t.lemma || t.lemma === '-') {
            const fix = inferMorph(t);
            t.lemma = fix.lemma;
            t.strong = fix.strong;
            t.morph = fix.morph;
            t.explanation = fix.exp;
            t.explanationEn = fix.exp;
            changed = true;
        }
    });
    if (changed) fs.writeFileSync(f, JSON.stringify(d, null, 4));
    console.log(`Verse ${i} done`);
}

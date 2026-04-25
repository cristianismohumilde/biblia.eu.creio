const fs = require('fs');
const path = require('path');

const versesDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

function inferGrammarFromLiteral(ptWord, enWord, surface) {
    let morph = "Vocab";
    let exp = "Palavra do texto base";
    let strong = "N/A";
    let lemma = surface.replace(/[.,:;]/g, '');

    const lw = ptWord.toLowerCase();
    const le = enWord.toLowerCase();

    // Map common nouns
    if (lw.includes('deus') || lw.includes('senhor') || le.includes('god') || le.includes('lord')) {
        morph = "N-Proper"; exp = "Deus / O Criador";
    }
    else if (lw.includes('luz') || le.includes('light')) {
        morph = "N-fs"; exp = "Luz";
    }
    else if (lw.includes('terra') || lw.includes('seco') || le.includes('earth') || le.includes('land')) {
        morph = "N-fs"; exp = "Terra / Porção Seca";
    }
    else if (lw.includes('céu') || lw.includes('firmamento') || le.includes('heaven') || le.includes('firmament')) {
        morph = "N-ms"; exp = "Céus / Firmamento";
    }
    else if (lw.includes('água') || le.includes('water')) {
        morph = "N-mp"; exp = "Águas";
    }
    else if (lw.includes('trevas') || le.includes('darkness')) {
        morph = "N-ms"; exp = "Trevas / Escuridão";
    }
    else if (lw.includes('dia') || le.includes('day')) {
        morph = "N-ms"; exp = "Dia";
    }
    else if (lw.includes('noite') || le.includes('night')) {
        morph = "N-fs"; exp = "Noite";
    }
    else if (lw.includes('tarde') || le.includes('evening')) {
        morph = "N-ms"; exp = "Tarde";
    }
    else if (lw.includes('manhã') || le.includes('morning')) {
        morph = "N-ms"; exp = "Manhã";
    }
    else if (lw.includes('abismo') || le.includes('deep')) {
        morph = "N-ms"; exp = "Abismo";
    }
    else if (lw.includes('espírito') || lw.includes('vento') || le.includes('spirit') || le.includes('wind')) {
        morph = "N-fs"; exp = "Espírito / Vento";
    }
    else if (lw.includes('mar') || le.includes('sea')) {
        morph = "N-mp"; exp = "Mares";
    }
    
    // Verbs
    else if (lw.includes('disse') || le.includes('said')) {
        morph = "V-Perf-3ms"; exp = "Disse / Falou";
    }
    else if (lw.includes('criou') || le.includes('created')) {
        morph = "V-Perf-3ms"; exp = "Criou";
    }
    else if (lw.includes('seja') || lw.includes('haja') || lw.includes('faça') || le.includes('let')) {
        morph = "V-Jussive"; exp = "Seja / Faça-se (Jussivo/Imperativo)";
    }
    else if (lw.includes('viu') || le.includes('saw')) {
        morph = "V-Perf-3ms"; exp = "Viu";
    }
    else if (lw.includes('chamou') || le.includes('called')) {
        morph = "V-Perf-3ms"; exp = "Chamou";
    }
    else if (lw.includes('separou') || lw.includes('dividiu') || le.includes('divided') || le.includes('separated')) {
        morph = "V-Perf-3ms"; exp = "Separou / Dividiu";
    }
    else if (lw.includes('estava') || lw.includes('era') || lw.includes('foi') || lw.includes('houve') || le.includes('was')) {
        morph = "V-Imperf/Perf"; exp = "Era / Estava / Houve";
    }
    else if (lw.includes('fez') || le.includes('made')) {
        morph = "V-Perf-3ms"; exp = "Fez";
    }
    else if (lw.includes('ajunte') || le.includes('gather')) {
        morph = "V-Jussive"; exp = "Ajuntem-se";
    }
    else if (lw.includes('apareça') || le.includes('appear')) {
        morph = "V-Jussive"; exp = "Apareça";
    }

    // Adjectives & Numbers
    else if (lw.includes('bom') || lw.includes('boa') || le.includes('good')) {
        morph = "Adj"; exp = "Bom / Boa";
    }
    else if (lw.includes('vazia') || le.includes('void') || le.includes('empty')) {
        morph = "Adj"; exp = "Vazia / Sem forma";
    }
    else if (lw.includes('um') || lw.includes('primeiro') || le.includes('one') || le.includes('first')) {
        morph = "Num"; exp = "Um / Primeiro";
    }
    else if (lw.includes('segundo') || le.includes('second')) {
        morph = "Num"; exp = "Segundo";
    }

    // Prepositions & Conjunctions
    else if (lw === 'e' || le === 'and') {
        morph = "Conj"; exp = "Conjunção (E)";
    }
    else if (lw.includes('que') || le.includes('that')) {
        morph = "Conj/Rel"; exp = "Que / O qual";
    }
    else if (lw.includes('entre') || le.includes('between')) {
        morph = "Prep"; exp = "Entre";
    }
    else if (lw.includes('sobre') || lw.includes('acima') || le.includes('over') || le.includes('above')) {
        morph = "Prep"; exp = "Sobre / Acima";
    }
    else if (lw.includes('em') || lw.includes('no') || lw.includes('na') || le.includes('in')) {
        morph = "Prep"; exp = "Em / No";
    }
    else if (lw.includes('de') || lw.includes('do') || lw.includes('da') || le.includes('of')) {
        morph = "Prep"; exp = "De / Do";
    }
    else if (lw.includes('para') || le.includes('to')) {
        morph = "Prep"; exp = "Para / A";
    }
    else if (lw === 'o' || lw === 'a' || lw === 'os' || lw === 'as' || le === 'the') {
        morph = "Art"; exp = "Artigo definido";
    }
    else if (lw === 'assim' || le === 'so' || le === 'thus') {
        morph = "Adv"; exp = "Assim";
    }

    return { morph, exp, strong, lemma };
}

for (let i = 1; i <= 10; i++) {
    const filename = `gen.1.${i}.json`;
    const filePath = path.join(versesDir, filename);
    
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.tokens) {
        data.tokens = data.tokens.map(token => {
            // Apply to placeholders
            if (token.morph === "Vocab" || token.morph === "-" || (token.explanation && token.explanation.includes("sem desmembramento detalhado"))) {
                const inferred = inferGrammarFromLiteral(token.ptLiteralWord, token.enLiteralWord, token.surface);
                token.lemma = inferred.lemma;
                token.strong = inferred.strong;
                token.morph = inferred.morph;
                token.explanation = inferred.exp;
                token.explanationEn = inferred.exp;
            }
            return token;
        });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

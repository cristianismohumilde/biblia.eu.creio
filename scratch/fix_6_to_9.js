const fs = require('fs');
const path = require('path');

const fixes = {
  6: [
    ["E disse", "And said"], ["Deus", "God"], ["haja", "let there be"], 
    ["um firmamento", "a firmament"], ["no meio", "in the midst"], ["das águas", "of the waters"], 
    ["e haja", "and let it"], ["separação", "divide"], ["entre", "between"], 
    ["águas", "waters"], ["e águas", "and waters"]
  ],
  7: [
    ["E fez", "And made"], ["Deus", "God"], ["(o)", "(the)"], 
    ["firmamento", "firmament"], ["e separou", "and divided"], ["entre", "between"], 
    ["as águas", "the waters"], ["que estavam", "which were"], ["debaixo", "under"], 
    ["do firmamento", "the firmament"], ["e entre", "and between"], ["as águas", "the waters"], 
    ["que estavam", "which were"], ["acima", "above"], ["do firmamento", "the firmament"], 
    ["e foi", "and it was"], ["assim", "so"]
  ],
  8: [
    ["E chamou", "And called"], ["Deus", "God"], ["ao firmamento", "the firmament"], 
    ["Céus", "Heaven"], ["e houve", "and there was"], ["tarde", "evening"], 
    ["e houve", "and there was"], ["manhã", "morning"], ["dia", "day"], 
    ["segundo", "second"]
  ],
  9: [
    ["E disse", "And said"], ["Deus", "God"], ["Ajuntem-se", "Let be gathered"], 
    ["as águas", "the waters"], ["de debaixo", "under"], ["dos céus", "the heaven"], 
    ["em", "unto"], ["um lugar", "one place"], ["um", "one"], 
    ["e apareça", "and let appear"], ["a porção seca", "the dry land"], ["e foi", "and it was"], 
    ["assim", "so"]
  ]
};

for (let i = 6; i <= 9; i++) {
  const file = path.join(__dirname, `../public/data/verses/gen.1.${i}.json`);
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  let hebrewIdx = 0;
  for (let t of data.tokens) {
    if (t.lang === 'hebrew') {
      if (fixes[i] && fixes[i][hebrewIdx]) {
        t.ptLiteralWord = fixes[i][hebrewIdx][0];
        t.enLiteralWord = fixes[i][hebrewIdx][1];
        t.explanation = fixes[i][hebrewIdx][0];
        t.explanationEn = fixes[i][hebrewIdx][1];
      }
      hebrewIdx++;
    }
  }
  
  fs.writeFileSync(file, JSON.stringify(data, null, 4));
  console.log(`Fixed gen.1.${i}.json`);
}

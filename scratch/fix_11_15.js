const fs = require('fs');
const path = require('path');

const fixes = {
  11: [
    { st: 'H559', bdb: 'to say', pt: 'E disse', en: 'And said' },
    { st: 'H430', bdb: 'God', pt: 'Deus', en: 'God' },
    { st: 'H1876', bdb: 'sprout, shoot', pt: 'Produza', en: 'Let bring forth' },
    { st: 'H776', bdb: 'earth, land', pt: 'a terra', en: 'the earth' },
    { st: 'H1877', bdb: 'grass, new grass', pt: 'relva', en: 'grass' },
    { st: 'H6212', bdb: 'herb, herbage', pt: 'erva', en: 'herb' },
    { st: 'H2232', bdb: 'to sow, yield', pt: 'dando', en: 'yielding' },
    { st: 'H2233', bdb: 'seed', pt: 'semente', en: 'seed' },
    { st: 'H6086', bdb: 'tree, wood', pt: 'árvore', en: 'tree' },
    { st: 'H6529', bdb: 'fruit', pt: 'frutífera', en: 'fruit' },
    { st: 'H6213', bdb: 'to do, make', pt: 'fazendo', en: 'yielding' },
    { st: 'H6529', bdb: 'fruit', pt: 'fruto', en: 'fruit' },
    { st: 'H4327', bdb: 'kind, species', pt: 'segundo sua espécie', en: 'after its kind' },
    { st: 'H834', bdb: 'which, whose', pt: 'cuja', en: 'whose' },
    { st: 'H2233', bdb: 'seed', pt: 'semente', en: 'seed' },
    { st: 'H9003', bdb: 'in, at', pt: 'nela', en: 'in itself' },
    { st: 'H5921', bdb: 'upon, above', pt: 'sobre', en: 'upon' },
    { st: 'H776', bdb: 'earth, land', pt: 'a terra', en: 'the earth' },
    { st: 'H1961', bdb: 'to be, become', pt: 'e foi', en: 'and it was' },
    { st: 'H3651', bdb: 'so, thus', pt: 'assim', en: 'so' }
  ],
  12: [
    { st: 'H3318', bdb: 'to bring forth', pt: 'E produziu', en: 'And brought forth' },
    { st: 'H776', bdb: 'earth, land', pt: 'a terra', en: 'the earth' },
    { st: 'H1877', bdb: 'grass', pt: 'relva', en: 'grass' },
    { st: 'H6212', bdb: 'herb', pt: 'erva', en: 'herb' },
    { st: 'H2232', bdb: 'to sow, yield', pt: 'dando', en: 'yielding' },
    { st: 'H2233', bdb: 'seed', pt: 'semente', en: 'seed' },
    { st: 'H4327', bdb: 'kind', pt: 'segundo sua espécie', en: 'after its kind' },
    { st: 'H6086', bdb: 'tree', pt: 'e árvore', en: 'and tree' },
    { st: 'H6213', bdb: 'to do, make', pt: 'fazendo', en: 'yielding' },
    { st: 'H6529', bdb: 'fruit', pt: 'fruto', en: 'fruit' },
    { st: 'H834', bdb: 'which, whose', pt: 'cuja', en: 'whose' },
    { st: 'H2233', bdb: 'seed', pt: 'semente', en: 'seed' },
    { st: 'H9003', bdb: 'in, at', pt: 'nela', en: 'in itself' },
    { st: 'H4327', bdb: 'kind', pt: 'segundo sua espécie', en: 'after its kind' },
    { st: 'H7200', bdb: 'to see', pt: 'e viu', en: 'and saw' },
    { st: 'H430', bdb: 'God', pt: 'Deus', en: 'God' },
    { st: 'H3588', bdb: 'that, because', pt: 'que', en: 'that' },
    { st: 'H2896', bdb: 'good', pt: 'bom', en: 'good' }
  ],
  13: [
    { st: 'H1961', bdb: 'to be, become', pt: 'e foi', en: 'and there was' },
    { st: 'H6153', bdb: 'evening', pt: 'tarde', en: 'evening' },
    { st: 'H1961', bdb: 'to be, become', pt: 'e foi', en: 'and there was' },
    { st: 'H1242', bdb: 'morning', pt: 'manhã', en: 'morning' },
    { st: 'H3117', bdb: 'day', pt: 'dia', en: 'day' },
    { st: 'H7992', bdb: 'third', pt: 'terceiro', en: 'third' }
  ],
  14: [
    { st: 'H559', bdb: 'to say', pt: 'E disse', en: 'And said' },
    { st: 'H430', bdb: 'God', pt: 'Deus', en: 'God' },
    { st: 'H1961', bdb: 'to be, become', pt: 'haja', en: 'let there be' },
    { st: 'H3974', bdb: 'luminary, light', pt: 'luminares', en: 'lights' },
    { st: 'H7549', bdb: 'firmament', pt: 'no firmamento', en: 'in the firmament' },
    { st: 'H8064', bdb: 'heavens', pt: 'dos céus', en: 'of heaven' },
    { st: 'H914', bdb: 'to separate', pt: 'para separar', en: 'to divide' },
    { st: 'H996', bdb: 'between', pt: 'entre', en: 'between' },
    { st: 'H3117', bdb: 'day', pt: 'o dia', en: 'the day' },
    { st: 'H996', bdb: 'between', pt: 'e entre', en: 'and between' },
    { st: 'H3915', bdb: 'night', pt: 'a noite', en: 'the night' },
    { st: 'H1961', bdb: 'to be', pt: 'e sejam', en: 'and let them be' },
    { st: 'H226', bdb: 'sign', pt: 'para sinais', en: 'for signs' },
    { st: 'H4150', bdb: 'appointed time, season', pt: 'e para estações', en: 'and for seasons' },
    { st: 'H3117', bdb: 'day', pt: 'e para dias', en: 'and for days' },
    { st: 'H8141', bdb: 'year', pt: 'e anos', en: 'and years' }
  ],
  15: [
    { st: 'H1961', bdb: 'to be', pt: 'e sejam', en: 'and let them be' },
    { st: 'H3974', bdb: 'luminary', pt: 'para luminares', en: 'for lights' },
    { st: 'H7549', bdb: 'firmament', pt: 'no firmamento', en: 'in the firmament' },
    { st: 'H8064', bdb: 'heavens', pt: 'dos céus', en: 'of the heaven' },
    { st: 'H215', bdb: 'to shine', pt: 'para iluminar', en: 'to give light' },
    { st: 'H5921', bdb: 'upon', pt: 'sobre', en: 'upon' },
    { st: 'H776', bdb: 'earth', pt: 'a terra', en: 'the earth' },
    { st: 'H1961', bdb: 'to be', pt: 'e foi', en: 'and it was' },
    { st: 'H3651', bdb: 'so, thus', pt: 'assim', en: 'so' }
  ]
};

for (const [verseNum, items] of Object.entries(fixes)) {
  const file = path.join(__dirname, `../public/data/verses/gen.1.${verseNum}.json`);
  if (!fs.existsSync(file)) continue;
  
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let idx = 0;
  for (let t of data.tokens) {
    if (t.lang === 'hebrew' && items[idx]) {
      t.strong = items[idx].st;
      t.bdb = items[idx].bdb;
      t.ptLiteralWord = items[idx].pt;
      t.enLiteralWord = items[idx].en;
      t.explanation = items[idx].pt;
      t.explanationEn = items[idx].en;
      idx++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 4));
  console.log(`Fixed gen.1.${verseNum}.json`);
}

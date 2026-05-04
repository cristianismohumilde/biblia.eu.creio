const fs = require('fs');
const path = require('path');

const fixes = {
  5: {
    'H430': 'god, deity',
    'H1961': 'to be, to exist',
    'H6153': 'evening',
    'H1242': 'morning',
    'H259': 'one, first'
  },
  6: {
    'H996': 'between'
  },
  10: {
    'H430': 'god, deity'
  }
};

for (const [verseNum, bdbMap] of Object.entries(fixes)) {
  const file = path.join(__dirname, `../public/data/verses/gen.1.${verseNum}.json`);
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  let modified = false;
  for (let t of data.tokens) {
    if (t.lang === 'hebrew' && bdbMap[t.strong]) {
      if (t.bdb === undefined || t.bdb === 'undefined' || t.bdb === '-') {
          t.bdb = bdbMap[t.strong];
          modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
    console.log(`Fixed BDB in gen.1.${verseNum}.json`);
  }
}

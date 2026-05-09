/**
 * Baixa os arquivos MorphGNT (edição SBLGNT) para uso offline.
 *
 * Licenças (resumo — ver README na pasta de destino):
 * - Texto SBLGNT: EULA da SBL (https://sblgnt.com/license/)
 * - Morfologia / lematização: CC-BY-SA 3.0 (MorphGNT)
 *
 * Uso: node scripts/pipeline/fetch_nt_morphgnt.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE =
  'https://raw.githubusercontent.com/morphgnt/sblgnt/master';

const FILES = [
  '61-Mt-morphgnt.txt',
  '62-Mk-morphgnt.txt',
  '63-Lk-morphgnt.txt',
  '64-Jn-morphgnt.txt',
  '65-Ac-morphgnt.txt',
  '66-Ro-morphgnt.txt',
  '67-1Co-morphgnt.txt',
  '68-2Co-morphgnt.txt',
  '69-Ga-morphgnt.txt',
  '70-Eph-morphgnt.txt',
  '71-Php-morphgnt.txt',
  '72-Col-morphgnt.txt',
  '73-1Th-morphgnt.txt',
  '74-2Th-morphgnt.txt',
  '75-1Ti-morphgnt.txt',
  '76-2Ti-morphgnt.txt',
  '77-Tit-morphgnt.txt',
  '78-Phm-morphgnt.txt',
  '79-Heb-morphgnt.txt',
  '80-Jas-morphgnt.txt',
  '81-1Pe-morphgnt.txt',
  '82-2Pe-morphgnt.txt',
  '83-1Jn-morphgnt.txt',
  '84-2Jn-morphgnt.txt',
  '85-3Jn-morphgnt.txt',
  '86-Jud-morphgnt.txt',
  '87-Re-morphgnt.txt',
];

const OUT_DIR = path.join(__dirname, 'raw_data/morphgnt-sblgnt');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} ${url}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      })
      .on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`⬇️  MorphGNT → ${OUT_DIR}\n`);

  for (const name of FILES) {
    const url = `${BASE}/${name}`;
    const dest = path.join(OUT_DIR, name);
    process.stdout.write(`   ${name} ... `);
    await download(url, dest);
    console.log('OK');
  }

  console.log('\n✅ Download completo. Rode: node scripts/pipeline/generator_nt_greek.js');
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});

/**
 * ANALISADOR DE FREQUÊNCIA DE STRONG'S
 * ======================================
 * Lê todos os JSONs gerados e conta quantas vezes cada Strong's aparece.
 * Gera dois arquivos:
 *   1. strong_frequency.json  — tabela completa de frequência
 *   2. strongs_pt.json        — dicionário PT esqueleto com os Top 500 para traduzir
 */

const fs   = require('fs');
const path = require('path');

const VERSES_DIR   = path.join(__dirname, '../../public/data/verses');
const LEXICON_JS   = path.join(__dirname, 'raw_data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js');
const OUT_FREQ     = path.join(__dirname, 'strong_frequency.json');
const OUT_PT_DICT  = path.join(__dirname, 'strongs_pt.json');

// ─── Carrega o léxico ─────────────────────────────────────────────────────
function loadLexicon() {
  const js = fs.readFileSync(LEXICON_JS, 'utf8');
  const start = js.indexOf('{');
  const end   = js.lastIndexOf('}');
  return JSON.parse(js.slice(start, end + 1));
}

// ─── Tradução PT manual dos mais importantes ──────────────────────────────
// Estas são as traduções curadas por nós nos versículos que já trabalhamos.
// O script vai expandir essa lista com os Top 500.
const PT_MANUAL = {
  'H430':  { ptLiteralWord: 'Deus',         explanation: 'Elohim — nome hebraico de Deus, forma plural de majestade' },
  'H1254': { ptLiteralWord: 'criou',         explanation: 'bara — criar do nada, ato exclusivo de Deus' },
  'H7225': { ptLiteralWord: 'princípio',     explanation: 'reshit — começo, início, a primeira parte de algo' },
  'H853':  { ptLiteralWord: '(part. direta)', explanation: 'et — partícula de objeto direto, sem tradução literal em português' },
  'H8064': { ptLiteralWord: 'céus',          explanation: 'shamayim — os céus, o firmamento, a abóbada celeste' },
  'H776':  { ptLiteralWord: 'terra',         explanation: 'eretz — terra, solo, país, região' },
  'H1961': { ptLiteralWord: 'era/havia',     explanation: 'hayah — ser, estar, existir, tornar-se' },
  'H8414': { ptLiteralWord: 'sem forma',     explanation: 'tohu — vazio, caos, sem forma, sem propósito' },
  'H922':  { ptLiteralWord: 'vazia',         explanation: 'bohu — vazio, deserto, desolação' },
  'H2822': { ptLiteralWord: 'trevas',        explanation: 'choshek — escuridão, trevas, ausência de luz' },
  'H5921': { ptLiteralWord: 'sobre',         explanation: 'al — sobre, acima, em relação a' },
  'H6440': { ptLiteralWord: 'face/superfície', explanation: 'panim — face, superfície, presença' },
  'H8415': { ptLiteralWord: 'abismo',        explanation: 'tehom — abismo, oceano primordial, profundezas das águas' },
  'H7307': { ptLiteralWord: 'Espírito/vento', explanation: 'ruach — espírito, vento, sopro, alento de vida' },
  'H7363': { ptLiteralWord: 'pairava',       explanation: 'rachaph — planar, mover-se suavemente sobre algo' },
  'H4325': { ptLiteralWord: 'águas',         explanation: 'mayim — água, rio, mar (sempre no plural em hebraico)' },
  'H559':  { ptLiteralWord: 'disse',         explanation: 'amar — dizer, falar, declarar, ordenar' },
  'H216':  { ptLiteralWord: 'luz',           explanation: 'or — luz, claridade, iluminação' },
  'H7200': { ptLiteralWord: 'viu',           explanation: 'raah — ver, observar, contemplar, perceber' },
  'H2896': { ptLiteralWord: 'bom',           explanation: 'tov — bom, agradável, útil, correto' },
  'H914':  { ptLiteralWord: 'separou',       explanation: 'badal — separar, dividir, distinguir' },
  'H996':  { ptLiteralWord: 'entre',         explanation: 'ben — entre, no meio de' },
  'H7121': { ptLiteralWord: 'chamou',        explanation: 'qara — chamar, nomear, convocar, proclamar' },
  'H3117': { ptLiteralWord: 'dia',           explanation: 'yom — dia, período de tempo, era' },
  'H3915': { ptLiteralWord: 'noite',         explanation: 'lailah — noite, escuridão' },
  'H6153': { ptLiteralWord: 'tarde/entardecer', explanation: 'erev — tarde, entardecer, crepúsculo' },
  'H1242': { ptLiteralWord: 'manhã',         explanation: 'boqer — manhã, aurora, alvorecer' },
  'H259':  { ptLiteralWord: 'um/primeiro',   explanation: 'echad — um, unido, o primeiro' },
  'H7549': { ptLiteralWord: 'firmamento',    explanation: 'raqia — firmamento, expansão, abóbada celeste' },
  'H8432': { ptLiteralWord: 'meio',          explanation: 'tavek — meio, centro, interior' },
  'H8145': { ptLiteralWord: 'segundo',       explanation: 'sheni — segundo (ordinal)' },
  'H6960': { ptLiteralWord: 'ajuntem-se',    explanation: 'qavah — reunir, ajuntar, esperar' },
  'H4725': { ptLiteralWord: 'lugar',         explanation: 'maqom — lugar, localidade, espaço' },
  'H413':  { ptLiteralWord: 'a/para',        explanation: 'el — preposição de direção: a, para, em direção a' },
  'H3004': { ptLiteralWord: 'terra seca',    explanation: 'yabbashah — terra seca, continente' },
  'H3220': { ptLiteralWord: 'mares',         explanation: 'yam — mar, lago, océano' },
  'H1876': { ptLiteralWord: 'produza',       explanation: 'dasha — germinar, brotar, produzir vegetação' },
  'H1877': { ptLiteralWord: 'erva',          explanation: 'deshe — erva, vegetação verde, plantas' },
  'H6212': { ptLiteralWord: 'erva/planta',   explanation: 'esev — erva, planta, vegetação' },
  'H2232': { ptLiteralWord: 'que semeia',    explanation: 'zara — semear, plantar, produzir semente' },
  'H2233': { ptLiteralWord: 'semente',       explanation: 'zera — semente, descendência, progênie' },
  'H6086': { ptLiteralWord: 'árvore',        explanation: 'ets — árvore, madeira, lenho' },
  'H6529': { ptLiteralWord: 'fruto',         explanation: 'peri — fruto, produto, resultado' },
  'H6213': { ptLiteralWord: 'faz/fez',       explanation: 'asah — fazer, realizar, executar, produzir' },
  'H4327': { ptLiteralWord: 'espécie',       explanation: 'min — espécie, tipo, gênero, variedade' },
  'H834':  { ptLiteralWord: 'que/cujo',      explanation: 'asher — pronome relativo: que, quem, o qual' },
  'H3651': { ptLiteralWord: 'assim',         explanation: 'ken — assim, deste modo, portanto' },
  'H3974': { ptLiteralWord: 'luminares',     explanation: 'maor — luminar, fonte de luz, lâmpada' },
  'H914':  { ptLiteralWord: 'separar',       explanation: 'badal — separar, dividir, fazer distinção' },
  'H226':  { ptLiteralWord: 'sinais',        explanation: 'ot — sinal, marca, presságio, milagre' },
  'H4150': { ptLiteralWord: 'estações/festivais', explanation: 'moed — tempo fixo, estação, assembleia, festival' },
  'H8141': { ptLiteralWord: 'anos',          explanation: 'shanah — ano, período anual' },
  'H215':  { ptLiteralWord: 'iluminar',      explanation: 'or (verbo) — iluminar, brilhar, trazer luz' },
  'H3588': { ptLiteralWord: 'que/pois',      explanation: 'ki — porque, pois, que (conjunção causal/explicativa)' },
  'H3605': { ptLiteralWord: 'todo/toda',     explanation: 'kol — todo, toda, qualquer, totalidade' },
  'H5315': { ptLiteralWord: 'alma/ser vivo', explanation: 'nefesh — alma, ser vivo, vida, pessoa' },
  'H2416': { ptLiteralWord: 'vivo/vivente',  explanation: 'chai — vivo, vivente, ser que tem vida' },
  'H120':  { ptLiteralWord: 'homem/ser humano', explanation: 'adam — ser humano, homem, a humanidade' },
  'H6754': { ptLiteralWord: 'imagem',        explanation: 'tselem — imagem, semelhança, ídolo, representação' },
  'H1823': { ptLiteralWord: 'semelhança',    explanation: 'demut — semelhança, forma, aparência' },
  'H2145': { ptLiteralWord: 'macho/masculino', explanation: 'zakar — macho, masculino, varão' },
  'H5347': { ptLiteralWord: 'fêmea/feminino', explanation: 'neqevah — fêmea, feminino' },
  'H1288': { ptLiteralWord: 'abençoou',      explanation: 'barak — abençoar, louvar, ajoelhar' },
  'H6509': { ptLiteralWord: 'sede frutífera', explanation: 'parah — ser frutífero, multiplicar-se, crescer' },
  'H7235': { ptLiteralWord: 'multiplicai',   explanation: 'ravah — multiplicar, aumentar, tornar-se numeroso' },
  'H4390': { ptLiteralWord: 'enchei',        explanation: 'male — encher, completar, cumprir' },
};

// ─── Script principal ─────────────────────────────────────────────────────
function run() {
  console.log('🔍 Analisando frequência de Strong\'s em todo o AT gerado...\n');

  const lexicon = loadLexicon();
  const freq = {};
  let filesRead = 0;

  const files = fs.readdirSync(VERSES_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Lendo ${files.length} arquivos de versos...`);

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(VERSES_DIR, file), 'utf8'));
      if (data.tokens) {
        for (const token of data.tokens) {
          if (token.strong) {
            freq[token.strong] = (freq[token.strong] || 0) + 1;
          }
        }
      }
      filesRead++;
    } catch (e) { /* ignora arquivos mal formados */ }
  }

  // Ordena por frequência (mais frequente primeiro)
  const sorted = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .map(([strong, count], index) => {
      const entry = lexicon[strong] || {};
      return {
        rank: index + 1,
        strong,
        occurrences: count,
        lemma: entry.lemma || '',
        xlit: entry.xlit || '',
        enDefinition: entry.strongs_def || '',
        hasPtTranslation: !!PT_MANUAL[strong]
      };
    });

  // Salva tabela completa de frequência
  fs.writeFileSync(OUT_FREQ, JSON.stringify(sorted, null, 2));
  console.log(`✅ Frequência completa salva: ${OUT_FREQ}`);
  console.log(`   Total de Strong's únicos encontrados: ${sorted.length}`);

  // Top 20 para visualização imediata
  console.log('\n📊 TOP 20 STRONG\'S MAIS FREQUENTES DO AT HEBRAICO:');
  console.log('─'.repeat(70));
  console.log(`${'#'.padEnd(4)} ${'Strong'.padEnd(7)} ${'Ocorr.'.padEnd(8)} ${'Translit.'.padEnd(12)} ${'Definição EN'.padEnd(30)} PT?`);
  console.log('─'.repeat(70));
  for (const item of sorted.slice(0, 20)) {
    const pt = item.hasPtTranslation ? '✅' : '  ';
    console.log(
      `${String(item.rank).padEnd(4)} ${item.strong.padEnd(7)} ${String(item.occurrences).padEnd(8)} ${(item.xlit || '').slice(0, 11).padEnd(12)} ${(item.enDefinition || '').slice(0, 29).padEnd(30)} ${pt}`
    );
  }
  console.log('─'.repeat(70));

  // Gera o dicionário PT esqueleto com os Top 500
  console.log('\n📝 Gerando dicionário PT esqueleto (Top 500)...');
  const ptDict = {};
  const top500 = sorted.slice(0, 500);

  for (const item of top500) {
    const entry = lexicon[item.strong] || {};
    const manual = PT_MANUAL[item.strong];
    ptDict[item.strong] = {
      rank: item.rank,
      occurrences: item.occurrences,
      lemma: entry.lemma || '',
      xlit: entry.xlit || '',
      enDefinition: entry.strongs_def || '',
      // Tradução PT — já preenchida se tiver curada, senão inglês como "plano B"
      ptLiteralWord: manual ? manual.ptLiteralWord : entry.strongs_def?.split(',')[0]?.trim() || '',
      explanation: manual ? manual.explanation : entry.strongs_def || '',
      // Flag para saber se ainda precisa de revisão humana
      needsReview: !manual
    };
  }

  fs.writeFileSync(OUT_PT_DICT, JSON.stringify(ptDict, null, 2));

  const curated  = top500.filter(i => i.hasPtTranslation).length;
  const needsWork = top500.filter(i => !i.hasPtTranslation).length;

  console.log(`✅ Dicionário PT salvo: ${OUT_PT_DICT}`);
  console.log(`   - ${curated} Strong's com tradução PT curada manualmente`);
  console.log(`   - ${needsWork} Strong's com "plano B" em inglês (aguardando tradução)`);
  console.log(`\n🎯 Próximo passo: revisar o arquivo strongs_pt.json e preencher`);
  console.log(`   o campo "ptLiteralWord" dos itens com needsReview: true`);
}

run();

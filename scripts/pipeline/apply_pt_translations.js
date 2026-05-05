/**
 * APLICADOR DE TRADUÇÕES PT AO CORPUS HEBRAICO
 * ===============================================
 * Lê o dicionário strongs_pt.json e atualiza os campos
 * ptLiteralWord e explanation em todos os versos gerados.
 * 
 * Execute sempre que adicionar novas traduções PT ao dicionário.
 */

const fs   = require('fs');
const path = require('path');

const VERSES_DIR = path.join(__dirname, '../../public/data/verses');
const PT_DICT    = path.join(__dirname, 'strongs_pt.json');

// ─── Traduções PT curadas ────────────────────────────────────────────────────
// Baseado nos Strong's mais frequentes do AT (Top 100+)
const PT_TRANSLATIONS = {
  // ── Top 10 ─────────────────────────────────────────────────────────────────
  'H853':  { pt: '(part. direta)',      ex: 'et — partícula de objeto direto, sem tradução literal em português' },
  'H3068': { pt: 'O SENHOR (YHWH)',     ex: 'YHWH (יהוה) — O tetragrama sagrado. Nome próprio de Deus em hebraico. Traduzido como "SENHOR" na maioria das versões' },
  'H5921': { pt: 'sobre/acima',         ex: 'al — sobre, acima, contra, em relação a' },
  'H413':  { pt: 'a/para',              ex: 'el — preposição de direção: a, para, em direção a' },
  'H3605': { pt: 'todo/toda',           ex: 'kol — todo, toda, qualquer, totalidade de algo' },
  'H559':  { pt: 'disse/falou',         ex: 'amar — dizer, falar, declarar, ordenar' },
  'H3808': { pt: 'não',                 ex: 'lo — negação absoluta em hebraico: não, nunca, jamais' },
  'H834':  { pt: 'que/o qual',          ex: 'asher — pronome relativo: que, quem, o qual, cujo' },
  'H1121': { pt: 'filho/filhos',        ex: 'ben — filho, descendente, membro de um grupo (bar em aramaico)' },
  'H3588': { pt: 'porque/que/pois',     ex: 'ki — conjunção causal e explicativa: porque, pois, que, quando' },
  // ── 11–25 ──────────────────────────────────────────────────────────────────
  'H1961': { pt: 'era/foi/havia',       ex: 'hayah — ser, existir, acontecer, tornar-se' },
  'H6213': { pt: 'fez/fazer',           ex: 'asah — fazer, realizar, executar, praticar, produzir' },
  'H430':  { pt: 'Deus',               ex: 'Elohim — nome hebraico de Deus. Plural de majestade. Denota o único Deus verdadeiro' },
  'H935':  { pt: 'veio/entrou/foi',     ex: 'bo — vir, ir, entrar, chegar, avançar em direção a algo' },
  'H4428': { pt: 'rei',                 ex: 'melek — rei, governante, soberano de um povo ou nação' },
  'H3478': { pt: 'Israel',             ex: 'Yisrael — "aquele que luta com Deus". Nome dado a Jacó, depois ao povo e à nação' },
  'H776':  { pt: 'terra/país',          ex: 'eretz — terra, solo, país, região, toda a terra' },
  'H3117': { pt: 'dia',                 ex: 'yom — dia, período de 24h, era, tempo específico' },
  'H376':  { pt: 'homem/alguém',        ex: 'ish — homem, varão, marido, indivíduo, alguém' },
  'H6440': { pt: 'face/presença',       ex: 'panim — face, superfície, frente, presença (sempre plural em hebraico)' },
  // ── 26–50 ──────────────────────────────────────────────────────────────────
  'H1697': { pt: 'palavra/coisa',       ex: 'davar — palavra, assunto, coisa, evento, mandamento' },
  'H3068': { pt: 'O SENHOR',            ex: 'YHWH — Nome próprio de Deus revelado a Moisés. Tradição massorética lê "Adonai"' },
  'H5971': { pt: 'povo/pessoas',        ex: 'am — povo, nação, grupo de pessoas com identidade comum' },
  'H3027': { pt: 'mão/poder',           ex: 'yad — mão, força, poder, influência, autoridade' },
  'H1254': { pt: 'criou',               ex: 'bara — criar ex nihilo (do nada), ato exclusivo de Deus no AT' },
  'H5414': { pt: 'deu/dar',             ex: 'natan — dar, entregar, conceder, pôr, colocar' },
  'H7225': { pt: 'princípio/começo',    ex: 'reshit — começo, início, a primeira parte de algo' },
  'H8064': { pt: 'céus',                ex: 'shamayim — os céus, o firmamento (sempre plural em hebraico)' },
  'H1696': { pt: 'falou/disse',         ex: 'davar — falar, dizer, declarar (forma verbal de davar)' },
  'H5869': { pt: 'olho/olhos',          ex: 'ayin — olho, olhos, aparência, fonte (de água), perspectiva' },
  'H3117': { pt: 'dia',                 ex: 'yom — dia, período de luz, era, tempo específico' },
  'H310':  { pt: 'depois/após',         ex: 'achar — depois, após, atrás, em seguida' },
  'H5650': { pt: 'servo/escravo',       ex: 'eved — servo, escravo, adorador (eved YHWH = servo do Senhor)' },
  'H7227': { pt: 'muito/grande/muitos', ex: 'rav — grande, muito, numeroso, abundante, ancião' },
  'H4714': { pt: 'Egito',               ex: 'Mitsrayim — Egito. A terra das "duas margens" do Nilo' },
  'H6310': { pt: 'boca/ordem',          ex: 'peh — boca, linguagem, beira, entrada, abertura' },
  'H2416': { pt: 'vivo/vivente',        ex: 'chai — vivo, vivente, ser que tem vida' },
  'H7965': { pt: 'paz/prosperidade',    ex: 'shalom — paz, harmonia, integridade, bem-estar, salvação' },
  'H2896': { pt: 'bom/agradável',       ex: 'tov — bom, correto, agradável, útil, virtuoso' },
  'H5046': { pt: 'anunciou/contou',     ex: 'nagad — anunciar, declarar, dizer, contar, revelar' },
  // ── Gênesis 1 (já curados) ─────────────────────────────────────────────────
  'H8415': { pt: 'abismo/profundeza',   ex: 'tehom — abismo, oceano primordial, profundezas das águas' },
  'H7307': { pt: 'Espírito/vento',      ex: 'ruach — espírito, vento, sopro, alento de vida' },
  'H7363': { pt: 'pairava',             ex: 'rachaph — planar, mover-se suavemente sobre algo' },
  'H4325': { pt: 'águas',               ex: 'mayim — água, rio, mar (sempre plural em hebraico)' },
  'H216':  { pt: 'luz',                 ex: 'or — luz, claridade, iluminação' },
  'H7200': { pt: 'viu/ver',             ex: 'raah — ver, observar, contemplar, perceber, entender' },
  'H914':  { pt: 'separou/separar',     ex: 'badal — separar, dividir, distinguir entre duas coisas' },
  'H996':  { pt: 'entre',              ex: 'ben — entre, no meio de, no espaço que separa' },
  'H7121': { pt: 'chamou/chamar',       ex: 'qara — chamar, nomear, convocar, proclamar, invocar' },
  'H3915': { pt: 'noite',              ex: 'lailah — noite, período de escuridão' },
  'H6153': { pt: 'tarde/entardecer',    ex: 'erev — tarde, entardecer, crepúsculo vespertino' },
  'H1242': { pt: 'manhã',              ex: 'boqer — manhã, aurora, alvorecer' },
  'H259':  { pt: 'um/primeiro',         ex: 'echad — um, unido, o primeiro (numeral ordinal)' },
  'H7549': { pt: 'firmamento',          ex: 'raqia — firmamento, expansão, abóbada celeste' },
  'H8432': { pt: 'meio/centro',         ex: 'tavek — meio, centro, interior, entre' },
  'H8145': { pt: 'segundo',            ex: 'sheni — segundo (numeral ordinal)' },
  'H6960': { pt: 'ajuntem-se',          ex: 'qavah — reunir, ajuntar, esperar ansiosamente por algo' },
  'H4725': { pt: 'lugar',              ex: 'maqom — lugar, localidade, espaço físico, santuário' },
  'H3004': { pt: 'terra seca',          ex: 'yabbashah — terra seca, continente, oposto ao mar' },
  'H3220': { pt: 'mar/mares',           ex: 'yam — mar, lago, oceano, ocidente (o mar fica a oeste)' },
  'H1876': { pt: 'produza/germinar',    ex: 'dasha — germinar, brotar, produzir vegetação verde' },
  'H1877': { pt: 'erva/vegetação',      ex: 'deshe — erva, vegetação verde, plantas que brotam' },
  'H6212': { pt: 'erva/planta',         ex: 'esev — erva, planta, vegetação geral' },
  'H2232': { pt: 'que semeia',          ex: 'zara — semear, plantar, reproduzir-se por semente' },
  'H2233': { pt: 'semente',            ex: 'zera — semente, descendência, progênie, posteridade' },
  'H6086': { pt: 'árvore',             ex: 'ets — árvore, madeira, lenho, madeira como material' },
  'H6529': { pt: 'fruto',              ex: 'peri — fruto, produto, resultado de algo' },
  'H4327': { pt: 'espécie/tipo',        ex: 'min — espécie, tipo, gênero, variedade biológica' },
  'H8141': { pt: 'anos/ano',            ex: 'shanah — ano, período de um ano completo' },
  'H226':  { pt: 'sinais',             ex: 'ot — sinal, marca, presságio, milagre, evidência' },
  'H4150': { pt: 'tempos/festivais',    ex: 'moed — tempo fixo, estação, assembleia sagrada, festival' },
  'H215':  { pt: 'iluminar',           ex: 'or (verbo) — iluminar, brilhar, dar luz, clarear' },
  'H3974': { pt: 'luminar/luminares',   ex: 'maor — luminar, fonte de luz, lâmpada, candelabro' },
  'H5315': { pt: 'alma/ser vivo',       ex: 'nefesh — alma, ser vivo, vida, pessoa, desejo interior' },
  'H3651': { pt: 'assim/deste modo',    ex: 'ken — assim, deste modo, portanto, desta forma' },
  'H8414': { pt: 'sem forma/caos',      ex: 'tohu — vazio, caos, sem forma, sem propósito, deserto' },
  'H922':  { pt: 'vazia/vazio',         ex: 'bohu — vazio, deserto, desolação absoluta' },
  'H2822': { pt: 'trevas/escuridão',    ex: 'choshek — escuridão, trevas, ausência de luz' },
  'H120':  { pt: 'homem/ser humano',    ex: 'adam — ser humano, homem, a humanidade como espécie' },
  'H6754': { pt: 'imagem',             ex: 'tselem — imagem, semelhança, representação, ídolo' },
  'H1823': { pt: 'semelhança',          ex: 'demut — semelhança, forma, aparência, parecido com' },
  'H2145': { pt: 'macho/masculino',     ex: 'zakar — macho, masculino, varão, sexo masculino' },
  'H5347': { pt: 'fêmea/feminino',      ex: 'neqevah — fêmea, feminino, sexo feminino' },
  'H1288': { pt: 'abençoou',            ex: 'barak — abençoar, louvar, ajoelhar em reverência' },
  'H6509': { pt: 'frutificai',          ex: 'parah — ser frutífero, multiplicar-se, crescer' },
  'H7235': { pt: 'multiplicai',         ex: 'ravah — multiplicar, aumentar, tornar-se numeroso' },
  'H4390': { pt: 'enchei',             ex: 'male — encher, completar, cumprir, saturar' },
  // ── Palavras frequentes importantes ────────────────────────────────────────
  'H1':    { pt: 'pai',                 ex: 'av — pai, ancestral, fundador, progenitor' },
  'H517':  { pt: 'mãe',                 ex: 'em — mãe, origem, laço familiar' },
  'H251':  { pt: 'irmão',              ex: 'ach — irmão, parente próximo, aliado' },
  'H269':  { pt: 'irmã',               ex: 'achot — irmã, parente feminina próxima' },
  'H1004': { pt: 'casa/família',        ex: 'bayit — casa, família, templo, dinastia' },
  'H776':  { pt: 'terra',              ex: 'eretz — terra, solo, país, região, toda a terra' },
  'H5892': { pt: 'cidade',             ex: 'ir — cidade, vila, lugar habitado' },
  'H1870': { pt: 'caminho',            ex: 'derek — caminho, estrada, modo de vida, conduta' },
  'H3820': { pt: 'coração/mente',       ex: 'lev — coração, mente, vontade, centro da vida interior' },
  'H6440': { pt: 'face/frente',         ex: 'panim — face, presença, frente (sempre plural em hebraico)' },
  'H5647': { pt: 'servir/adorar',       ex: 'avad — trabalhar, servir, adorar, ser escravo de algo' },
  'H8085': { pt: 'ouviu/ouvir',         ex: 'shama — ouvir, escutar, obedecer, prestar atenção' },
  'H7725': { pt: 'voltou/retornar',     ex: 'shuv — voltar, retornar, arrepender-se, converter-se' },
  'H3318': { pt: 'saiu/sair',           ex: 'yatsa — sair, partir, nascer, brotar, emergir' },
  'H5927': { pt: 'subiu/subir',         ex: 'alah — subir, ascender, oferecer holocausto' },
  'H7971': { pt: 'enviou/enviar',       ex: 'shalach — enviar, mandar, despachar, estender a mão' },
  'H2009': { pt: 'eis aqui!/veja!',     ex: 'hinneh — interjeição de atenção: eis, veja, olha!' },
  'H3478': { pt: 'Israel',             ex: 'Yisrael — nome dado a Jacó (aquele que luta com Deus)' },
  'H3063': { pt: 'Judá',               ex: 'Yehudah — Judá, quarto filho de Jacó, tribo e reino' },
  'H4872': { pt: 'Moisés',             ex: 'Moshe — Moisés, o grande legislador e profeta de Israel' },
  'H85':   { pt: 'Abraão',             ex: 'Avraham — Abraão, pai das nações, patriarca do povo de Deus' },
  'H3290': { pt: 'Jacó',               ex: 'Yaaqov — Jacó (depois chamado Israel), patriarca das 12 tribos' },
  'H1732': { pt: 'Davi',               ex: 'David — Davi, rei de Israel, autor de muitos salmos' },
};

function applyTranslations() {
  // Carrega o dicionário PT atual
  let ptDict = {};
  if (fs.existsSync(PT_DICT)) {
    ptDict = JSON.parse(fs.readFileSync(PT_DICT, 'utf8'));
  }

  // Mescla as traduções curadas no dicionário
  for (const [strong, data] of Object.entries(PT_TRANSLATIONS)) {
    if (ptDict[strong]) {
      ptDict[strong].ptLiteralWord = data.pt;
      ptDict[strong].explanation   = data.ex;
      ptDict[strong].needsReview   = false;
    }
  }
  fs.writeFileSync(PT_DICT, JSON.stringify(ptDict, null, 2));
  console.log(`📚 Dicionário PT atualizado com ${Object.keys(PT_TRANSLATIONS).length} entradas curadas.`);

  // Aplica nos versos
  console.log('\n⚙️  Aplicando traduções PT em todos os versos...');
  const files = fs.readdirSync(VERSES_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  let tokensUpdated = 0;

  for (const file of files) {
    const filePath = path.join(VERSES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    if (data.verses) {
      for (const verse of data.verses) {
        if (verse.tokens) {
          for (const token of verse.tokens) {
            const entry = PT_TRANSLATIONS[token.strong];
            if (entry) {
              token.ptLiteralWord = entry.pt;
              token.explanation   = entry.ex;
              changed = true;
              tokensUpdated++;
            }
          }
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      updated++;
    }
  }

  console.log(`\n✅ Concluído!`);
  console.log(`   📝 Versos atualizados : ${updated.toLocaleString()} de ${files.length.toLocaleString()}`);
  console.log(`   🔤 Tokens com PT      : ${tokensUpdated.toLocaleString()}`);
}

applyTranslations();

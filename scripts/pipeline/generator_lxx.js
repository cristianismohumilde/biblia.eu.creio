/**
 * MASTER DATA PIPELINE - SEPTUAGINTA (LXX)
 * ==========================================
 * Fonte: GreekResources LXX Lemmas (CATSS/Septuaginta)
 *   - Pasta: raw_data/GreekResources-master/GreekResources-master/LxxLemmas/*.js
 * Saída: Atualiza public/data/verses/*.json com tokens gregos
 * 
 * Uso: node scripts/pipeline/generator_lxx.js [livro_opcional]
 * Exemplo: node scripts/pipeline/generator_lxx.js gen
 */

const fs = require('fs');
const path = require('path');

// ─── Configurações de Caminhos ──────────────────────────────────────────────
const LXX_DIR = path.join(__dirname, 'raw_data/GreekResources-master/GreekResources-master/LxxLemmas');
const OUT_DIR = path.join(__dirname, '../../public/data/verses');

// Mapa dos nomes de arquivo LXX para abreviações do site
const BOOK_MAP = {
  'Gen': 'gen',      // Gênesis
  'Exod': 'exo',     // Êxodo
  'Lev': 'lev',      // Levítico
  'Num': 'num',      // Números
  'Deut': 'deu',     // Deuteronômio
  'Josh': 'jos',     // Josué
  'Judg': 'jdg',     // Juízes
  'Ruth': 'rut',     // Rute
  '1Sam': '1sa',     // 1 Samuel
  '2Sam': '2sa',     // 2 Samuel
  '1Kgs': '1ki',     // 1 Reis
  '2Kgs': '2ki',     // 2 Reis
  '1Chr': '1ch',     // 1 Crônicas
  '2Chr': '2ch',     // 2 Crônicas
  'Ezra': 'ezr',     // Esdras
  'Neh': 'neh',      // Neemias
  'Esth': 'est',     // Ester
  'Job': 'job',      // Jó
  'Ps': 'psa',       // Salmos
  'Prov': 'pro',     // Provérbios
  'Eccl': 'ecc',     // Eclesiastes
  'Song': 'sng',     // Cânticos (Song of Solomon)
  'Isa': 'isa',      // Isaías
  'Jer': 'jer',      // Jeremias
  'Lam': 'lam',      // Lamentações
  'Ezek': 'ezk',     // Ezequiel
  'Dan': 'dan',      // Daniel (inclui OG e Th)
  'Hos': 'hos',      // Oséias
  'Joel': 'jol',     // Joel
  'Amos': 'amo',     // Amós
  'Obad': 'oba',     // Obadias
  'Jonah': 'jon',    // Jonas
  'Mic': 'mic',      // Miqueias
  'Nah': 'nah',      // Naum
  'Hab': 'hab',      // Habacuque
  'Zeph': 'zph',     // Sofonias
  'Hag': 'hag',      // Ageu
  'Zech': 'zec',     // Zacarias
  'Mal': 'mal',      // Malaquias
  // Livros deutero-canônicos/apócrifos
  '1Esd': '1es',     // 1 Esdras
  '2Esd': '2es',     // 2 Esdras (4 Esdras na Vulgata)
  'Tob': 'tob',      // Tobias
  'Jdt': 'jdt',      // Judite
  '1Macc': '1ma',    // 1 Macabeus
  '2Macc': '2ma',    // 2 Macabeus
  '3Macc': '3ma',    // 3 Macabeus
  '4Macc': '4ma',    // 4 Macabeus
  'Bar': 'bar',      // Baruc
  'EpJer': 'epj',    // Epístola de Jeremias
  'Sus': 'sus',      // Susana
  'Bel': 'bel',      // Bel e o Dragão
  'Wis': 'wis',      // Sabedoria de Salomão
  'Sir': 'sir',      // Eclesiástico (Sirach)
  'PrMan': 'man',    // Oração de Manassés
  'Ps151': 'ps2',    // Salmo 151
  'PsSol': 'pss',    // Salmos de Salomão
  // Versões alternativas (usar mesma abreviação)
  'TobBA': 'tob',    // Tobias (Codex Vaticanus)
  'TobS': 'tob',     // Tobias (Codex Sinaiticus)
  'SusOG': 'sus',    // Susana (Old Greek)
  'SusTh': 'sus',    // Susana (Theodotion)
  'BelOG': 'bel',    // Bel (Old Greek)
  'BelTh': 'bel',    // Bel (Theodotion)
  'DanOG': 'dan',    // Daniel Adições (Old Greek)
  'DanTh': 'dan',    // Daniel Adições (Theodotion)
  'JoshA': 'jos',    // Josué (Codex Vaticanus)
  'JoshB': 'jos',    // Josué (Codex Alexandrinus)
  'JudgA': 'jdg',    // Juízes (Codex Vaticanus)
  'JudgB': 'jdg',    // Juízes (Codex Alexandrinus)
  'Odes': 'ode',     // Odes/Cânticos
};

// ─── Utilitários ─────────────────────────────────────────────────────────────

/**
 * Translitera grego koine para alfabeto latino
 * Simplificado para interlinear
 */
const GREEK_TRANS = {
  'α': 'a', 'ά': 'a', 'ὰ': 'a', 'ᾶ': 'a', 'ἀ': 'a', 'ἁ': 'a', 'ἂ': 'a', 'ἃ': 'a', 
  'ἄ': 'a', 'ἅ': 'a', 'ἆ': 'a', 'ἇ': 'a', 'ᾀ': 'a', 'ᾁ': 'a', 'ᾴ': 'a',
  'β': 'b', 'γ': 'g', 'δ': 'd',
  'ε': 'e', 'έ': 'e', 'ὲ': 'e', 'ἐ': 'e', 'ἑ': 'e', 'ἒ': 'e', 'ἓ': 'e', 
  'ἔ': 'e', 'ἕ': 'e',
  'ζ': 'z',
  'η': 'ê', 'ή': 'ê', 'ὴ': 'ê', 'ῆ': 'ê', 'ἠ': 'ê', 'ἡ': 'ê', 'ἢ': 'ê', 
  'ἣ': 'ê', 'ἤ': 'ê', 'ἥ': 'ê', 'ἦ': 'ê', 'ἧ': 'ê',
  'θ': 'th',
  'ι': 'i', 'ί': 'i', 'ὶ': 'i', 'ῖ': 'i', 'ἰ': 'i', 'ἱ': 'i', 'ἲ': 'i', 
  'ἳ': 'i', 'ἴ': 'i', 'ἵ': 'i', 'ἶ': 'i', 'ἷ': 'i', 'ϊ': 'i', 'ΐ': 'i', 'ῒ': 'i', 'ΐ': 'i',
  'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n',
  'ξ': 'x',
  'ο': 'o', 'ό': 'o', 'ὸ': 'o', 'ὀ': 'o', 'ὁ': 'o', 'ὂ': 'o', 'ὃ': 'o', 'ὄ': 'o', 'ὅ': 'o',
  'π': 'p',
  'ρ': 'r', 'ῥ': 'rh', 'ῤ': 'rh', 'Ῥ': 'Rh',
  'σ': 's', 'ς': 's',
  'τ': 't',
  'υ': 'y', 'ύ': 'y', 'ὺ': 'y', 'ῦ': 'y', 'ὐ': 'y', 'ὑ': 'hy', 'ὒ': 'hy', 
  'ὓ': 'hy', 'ὔ': 'y', 'ὕ': 'hy', 'ὖ': 'y', 'ὗ': 'hy', 'ϋ': 'y', 'ΰ': 'y', 'ῢ': 'y', 'ΰ': 'y',
  'φ': 'ph', 'χ': 'ch', 'ψ': 'ps',
  'ω': 'ô', 'ώ': 'ô', 'ὼ': 'ô', 'ῶ': 'ô', 'ὠ': 'ô', 'ὡ': 'hô', 'ὢ': 'hô', 
  'ὣ': 'hô', 'ὤ': 'ô', 'ὥ': 'hô', 'ὦ': 'ô', 'ὧ': 'hô',
  // Maiúsculas
  'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'Ê', 
  'Θ': 'Th', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 
  'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'Ph', 
  'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'Ô'
};

function transliterateGreek(text) {
  let result = '';
  for (const char of text) {
    result += GREEK_TRANS[char] || char;
  }
  return result;
}

/**
 * Detecta morfologia básica baseada na forma da palavra
 * Simplificado - idealmente usar parser completo
 */
function detectMorph(word, lemma) {
  // Artigos
  if (lemma === 'ὁ') {
    if (/ὸς$/.test(word)) return 'Art-N-ms';
    if (/ἡ$/.test(word) || /ὴ$/.test(word)) return 'Art-N-fs';
    if (/όν$/.test(word) || /ὸν$/.test(word)) return 'Art-A-ns';
    if (/ήν$/.test(word) || /ὴν$/.test(word)) return 'Art-A-fs';
    if (/ῷ$/.test(word)) return 'Art-D-ms';
    if (/ῆς$/.test(word)) return 'Art-G-fs';
    if (/ῶν$/.test(word)) return 'Art-G-mp';
    return 'Art';
  }
  
  // Preposições comuns
  const preps = ['ἐν', 'εἰς', 'ἐκ', 'ἐπί', 'πρός', 'ὑπό', 'διά', 'μετά', 'κατά', 
                 'περί', 'ὑπέρ', 'ἀπό', 'παρά', 'σύν', 'ἄνευ', 'μέχρι'];
  if (preps.includes(lemma)) return 'Prep';
  
  // Conjunções
  const conjs = ['καί', 'δέ', 'ἵνα', 'ὅτι', 'εἰ', 'ἀλλά', 'ἤ', 'οὖν', 'γάρ', 
                 'οὔτε', 'μήτε', 'ὡς', 'ἐάν'];
  if (conjs.includes(lemma)) return 'Conj';
  
  // Advérbios
  const advs = ['οὐ', 'μή', 'νῦν', 'τότε', 'ὧδε', 'ἐκεῖ', 'οὕτως', 'καλῶς', 
                'ἤδη', 'πάλιν', 'εὐθύς', 'σήμερον'];
  if (advs.includes(lemma)) return 'Adv';
  
  // Verbos - detecção por terminações típicas da LXX
  // Aoristo
  if (/σεν$/.test(word) || /σαν$/.test(word) || /σε$/.test(word)) {
    return 'V-Aor-Act-3s';
  }
  if (/θη$/.test(word) || /θησαν$/.test(word)) {
    return 'V-Aor-Pass-3s';
  }
  // Imperativo Aoristo
  if (/σον$/.test(word) || /σατε$/.test(word)) {
    return 'V-Aor-Imp-2s';
  }
  if (/θητι$/.test(word)) {
    return 'V-Aor-Imp-2s';
  }
  // Imperfeito
  if (/εν$/.test(word) && word.length > 3) {
    return 'V-Impf-Act-3s';
  }
  // Presente
  if (/ει$/.test(word) || /ῃ$/.test(word)) {
    return 'V-Pres-Act-3s';
  }
  if (/ουσιν$/.test(word) || /ουσι$/.test(word)) {
    return 'V-Pres-Act-3p';
  }
  // Futuro
  if (/σω$/.test(word) || /σομαι$/.test(word)) {
    return 'V-Fut-Act-1s';
  }
  // Particípios
  if (/ων$/.test(word) || /ουσα$/.test(word) || /ον$/.test(word)) {
    return 'V-Pres-Ptc-Act';
  }
  if (/σας$/.test(word) || /σασα$/.test(word) || /σαν$/.test(word)) {
    return 'V-Aor-Ptc-Act';
  }
  if (/θεις$/.test(word) || /θεῖσα$/.test(word)) {
    return 'V-Aor-Ptc-Pass';
  }
  
  // Substantivos
  if (/ος$/.test(word) || /ός$/.test(word) || /ὸς$/.test(word)) {
    return 'N-ms';
  }
  if (/ον$/.test(word) || /όν$/.test(word) || /ὸν$/.test(word)) {
    return 'N-ns';
  }
  if (/η$/.test(word) || /ή$/.test(word) || /ὴ$/.test(word) || 
      /ᾱ$/.test(word) || /ᾶ$/.test(word)) {
    return 'N-fs';
  }
  if (/ες$/.test(word) || /ές$/.test(word)) {
    return 'N-mp';
  }
  if (/α$/.test(word) || /ά$/.test(word) || /ὰ$/.test(word)) {
    return 'N-fp';
  }
  
  // Adjetivos
  if (/ος$/.test(word) && !word.includes('τος')) {
    return 'A-ms';
  }
  if (/η$/.test(word) || /ή$/.test(word)) {
    return 'A-fs';
  }
  if (/ον$/.test(word) || /όν$/.test(word)) {
    return 'A-ns';
  }
  
  // Pronomes
  const pronouns = ['ἐγώ', 'σύ', 'αὐτός', 'ἡμεῖς', 'ὑμεῖς', 'οὗτος', 'ἐκεῖνος',
                   'τις', 'τίς', 'ὅς', 'ὅστις', 'ἐμαυτοῦ', 'σεαυτοῦ'];
  if (pronouns.includes(lemma)) return 'Pron';
  
  // Números
  const numbers = ['εἷς', 'δύο', 'τρεῖς', 'τέσσαρες', 'πέντε', 'ἕξ', 'ἑπτά', 
                   'ὀκτώ', 'ἐννέα', 'δέκα', 'εἴκοσι', 'τριάκοντα', 'ἑκατόν',
                   'χίλιοι', 'μύριοι'];
  if (numbers.includes(lemma)) return 'Num';
  
  return 'Unkn';
}

/**
 * Adiciona diacríticos à palavra (reconstrução simplificada)
 * Os dados CATSS vêm sem acentos, precisamos reconstruir
 */
function addGreekDiacritics(word, lemma) {
  // Mapeamento de palavras comuns para suas formas acentuadas
  const accentMap = {
    // Artigo
    'ο': 'ὁ', 'ἡ': 'ἡ', 'το': 'τὸ', 'του': 'τοῦ', 'τω': 'τῷ', 'τον': 'τὸν',
    'την': 'τὴν', 'των': 'τῶν', 'οι': 'οἱ', 'αι': 'αἱ', 'τα': 'τὰ',
    // Conjunções
    'και': 'καί', 'δε': 'δέ', 'γαρ': 'γάρ', 'ουν': 'οὖν', 'ινα': 'ἵνα',
    'οτι': 'ὅτι', 'ει': 'εἰ', 'αλλα': 'ἀλλά', 'η': 'ἤ',
    // Preposições
    'εν': 'ἐν', 'εις': 'εἰς', 'εκ': 'ἐκ', 'επι': 'ἐπί', 'προς': 'πρός',
    'υπο': 'ὑπό', 'δια': 'διά', 'μετα': 'μετά', 'κατα': 'κατά', 'περι': 'περί',
    'υπερ': 'ὑπέρ', 'απο': 'ἀπό', 'παρα': 'παρά', 'συν': 'σύν',
    // Verbos comuns
    'ειμι': 'εἰμί', 'ποιεω': 'ποιέω', 'λεγω': 'λέγω', 'γινομαι': 'γίνομαι',
    'οραω': 'ὁράω', 'επω': 'ἔπω', 'φερω': 'φέρω', 'εχω': 'ἔχω',
    'πορευομαι': 'πορεύομαι', 'ερχομαι': 'ἔρχομαι', 'διδωμι': 'δίδωμι',
    'λαμβανω': 'λαμβάνω', 'γραφω': 'γράφω', 'ακουω': 'ἀκούω',
    // Substantivos comuns
    'θεος': 'θεός', 'ουρανος': 'οὐρανός', 'γη': 'γῆ', 'φως': 'φῶς',
    'νυξ': 'νύξ', 'ημερα': 'ἡμέρα', 'υδωρ': 'ὕδωρ', 'πνευμα': 'πνεῦμα',
    'ανθρωπος': 'ἄνθρωπος', 'καρδια': 'καρδία', 'οικος': 'οἶκος',
    'γλωσσα': 'γλῶσσα', 'βασιλεια': 'βασιλεία', 'αγαπη': 'ἀγάπη',
    // Adjetivos
    'αγιος': 'ἅγιος', 'καλος': 'καλός', 'μεγας': 'μέγας', 'μικρος': 'μικρός',
    'πονηρος': 'πονηρός', 'δικαιος': 'δίκαιος', 'αμαρτωλος': 'ἁμαρτωλός',
    // Advérbios
    'ου': 'οὐ', 'μη': 'μή', 'νυν': 'νῦν', 'τοτε': 'τότε', 'ωδε': 'ὧδε',
    'εκει': 'ἐκεῖ', 'ουτως': 'οὕτως', 'σημερον': 'σήμερον',
    // Pronomes
    'εγω': 'ἐγώ', 'συ': 'σύ', 'αυτος': 'αὐτός', 'ημεις': 'ἡμεῖς',
    'υμεις': 'ὑμεῖς', 'ουτος': 'οὗτος', 'εκεινος': 'ἐκεῖνος',
  };
  
  const accented = accentMap[word.toLowerCase()];
  if (accented) return accented;
  
  // Se não encontrou no mapa, retorna o lemma (que geralmente tem acentos)
  // ou a própria palavra
  return lemma || word;
}

/**
 * Obtém número Strong grego
 * Mapeamento parcial - expandir conforme necessário
 */
function getGreekStrong(word, lemma) {
  const strongMap = {
    // Preposições
    'εν': 'G1722', 'εις': 'G1519', 'εκ': 'G1537', 'επι': 'G1909',
    'προς': 'G4314', 'υπο': 'G5259', 'δια': 'G1223', 'μετα': 'G3326',
    'κατα': 'G2596', 'περι': 'G4012', 'υπερ': 'G5228', 'απο': 'G575',
    'παρα': 'G3844', 'συν': 'G4862',
    // Conjunções
    'και': 'G2532', 'δε': 'G1161', 'γαρ': 'G1063', 'ουν': 'G3767',
    'ινα': 'G2443', 'οτι': 'G3754', 'ει': 'G1487', 'αλλα': 'G235',
    'η': 'G2228', 'οτε': 'G3753', 'ως': 'G5613',
    // Artigo
    'ο': 'G3588', 'ἡ': 'G3588', 'το': 'G3588',
    // Verbos comuns
    'ειμι': 'G1510', 'ποιεω': 'G4160', 'λεγω': 'G3004', 'γινομαι': 'G1096',
    'οραω': 'G3708', 'επω': 'G2036', 'φερω': 'G5342', 'εχω': 'G2192',
    'πορευομαι': 'G4198', 'ερχομαι': 'G2064', 'διδωμι': 'G1325',
    'λαμβανω': 'G2983', 'γραφω': 'G1125', 'ακουω': 'G191',
    'ευρισκω': 'G2147', 'πιστευω': 'G4100', 'αγαπαω': 'G25',
    'οικοδομεω': 'G3618', 'σωζω': 'G4982', 'θεραπευω': 'G2323',
    // Substantivos comuns
    'θεος': 'G2316', 'ουρανος': 'G3772', 'γη': 'G1093', 'φως': 'G5457',
    'νυξ': 'G3571', 'ημερα': 'G2250', 'υδωρ': 'G5204', 'πνευμα': 'G4151',
    'ανθρωπος': 'G444', 'καρδια': 'G2588', 'οικος': 'G3624',
    'γλωσσα': 'G1100', 'βασιλεια': 'G932', 'αγαπη': 'G26',
    'ψυχη': 'G5590', 'σαρξ': 'G4561', 'αδελφος': 'G80',
    'μητηρ': 'G3384', 'πατηρ': 'G3962', 'υιος': 'G5207',
    'γυνη': 'G1135', 'τεκνον': 'G5043', 'δουλος': 'G1401',
    // Adjetivos
    'αγιος': 'G40', 'καλος': 'G2570', 'μεγας': 'G3173', 'μικρος': 'G3398',
    'πονηρος': 'G4190', 'δικαιος': 'G1342', 'αμαρτωλος': 'G268',
    // Advérbios
    'ου': 'G3756', 'μη': 'G3361', 'νυν': 'G3568', 'τοτε': 'G5119',
    'ωδε': 'G5602', 'εκει': 'G1563', 'ουτως': 'G3779', 'σημερον': 'G4594',
    'ευθυς': 'G2117', 'παλιν': 'G3825', 'ηδη': 'G2235',
    // Pronomes
    'εγω': 'G1473', 'συ': 'G4771', 'αυτος': 'G846', 'ημεις': 'G2249',
    'υμεις': 'G5210', 'ουτος': 'G3778', 'εκεινος': 'G1565',
    'τις': 'G5101', 'τι': 'G5100', 'οστις': 'G3748',
  };
  
  const key = (lemma || word).toLowerCase();
  return strongMap[key] || '-';
}

// ─── Processamento Principal ─────────────────────────────────────────────────

function processLXXFile(filename) {
  const bookLXX = path.basename(filename, '.js');
  const bookCode = BOOK_MAP[bookLXX];
  
  if (!bookCode) {
    console.log(`⚠️ Livro não mapeado: ${bookLXX}`);
    return;
  }
  
  console.log(`\n📖 Processando: ${bookLXX} → ${bookCode}`);
  
  // Carregar arquivo LXX
  const filePath = path.join(LXX_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let lxxData;
  try {
    lxxData = JSON.parse(content);
  } catch (e) {
    // Tentar como JS module
    try {
      lxxData = eval('(' + content + ')');
    } catch (e2) {
      console.log(`❌ Erro ao parsear ${filename}: ${e2.message}`);
      return;
    }
  }
  
  // Iterar sobre os versículos
  let processed = 0;
  for (const [ref, words] of Object.entries(lxxData)) {
    // Parse: "Gen.1.1"
    const parts = ref.split('.');
    if (parts.length !== 3) continue;
    
    const [, chapter, verse] = parts;
    
    // Processar tokens
    const tokens = [];
    let verseText = [];
    
    words.forEach((word, idx) => {
      const surfaceRaw = word.key || word.word || word.surface;
      const lemma = word.lemma || word.root || surfaceRaw;
      
      // Adicionar acentos
      const surface = addGreekDiacritics(surfaceRaw, lemma);
      
      // Gerar token
      const token = {
        id: `${bookCode}.${chapter}.${verse}.g${idx + 1}`,
        lang: 'greek',
        langPt: 'Grego',
        langEn: 'Greek',
        surface: surface,
        transliteration: transliterateGreek(surface),
        lemma: lemma,
        strong: getGreekStrong(surfaceRaw, lemma),
        morph: detectMorph(surface, lemma),
        manuscript: 'Grego: Septuaginta (LXX), tradição alexandrina',
        manuscriptEn: 'Greek: Septuagint (LXX), Alexandrian tradition',
        ptLiteralWord: '',
        enLiteralWord: '',
        explanation: '',
        explanationEn: ''
      };
      
      tokens.push(token);
      verseText.push(surface);
    });
    
    // Atualizar arquivo de saída
    const outFile = path.join(OUT_DIR, `${bookCode}.${chapter}.json`);
    if (!fs.existsSync(outFile)) {
      console.log(`   ⚠️ Arquivo não existe: ${bookCode}.${chapter}.json (pulando ${bookCode}.${chapter}.${verse})`);
      continue; // Arquivo destino não existe
    }
    
    try {
      // Ler arquivo com retry
      let retries = 3;
      let fileContent;
      while (retries > 0) {
        try {
          fileContent = fs.readFileSync(outFile, 'utf8');
          break;
        } catch (readErr) {
          retries--;
          if (retries === 0) throw readErr;
          // Aguardar 100ms antes de retry
          const start = Date.now();
          while (Date.now() - start < 100) {}
        }
      }
      
      const verseData = JSON.parse(fileContent);
      
      // Encontrar versículo específico
      const verseObj = verseData.verses.find(v => v.ref.verse === parseInt(verse));
      if (!verseObj) continue;
      
      // Adicionar sourceTexts.greek
      if (!verseObj.sourceTexts) verseObj.sourceTexts = {};
      verseObj.sourceTexts.greek = verseText.join(' ');
      
      // Adicionar greekWitnesses
      if (!verseObj.greekWitnesses) verseObj.greekWitnesses = [];
      const existingLXX = verseObj.greekWitnesses.find(w => w.id === 'lxx');
      if (!existingLXX) {
        verseObj.greekWitnesses.push({
          id: 'lxx',
          label: 'Septuaginta (LXX)',
          text: verseText.join(' '),
          transliteration: tokens.map(t => t.transliteration).join(' '),
          literalPt: '',
          literalEn: ''
        });
      }
      
      // Adicionar tokens
      if (!verseObj.tokens) verseObj.tokens = [];
      tokens.forEach(token => {
        const exists = verseObj.tokens.find(t => t.id === token.id);
        if (!exists) {
          verseObj.tokens.push(token);
        }
      });
      
      // Salvar
      fs.writeFileSync(outFile, JSON.stringify(verseData, null, 2), 'utf8');
      processed++;
      
    } catch (e) {
      console.log(`❌ Erro ao processar ${bookCode}.${chapter}.${verse}: ${e.message}`);
    }
  }
  
  console.log(`✅ Processados: ${processed} versículos`);
}

// ─── Execução Principal ─────────────────────────────────────────────────────

function main() {
  console.log('🏛️  PIPELINE SEPTUAGINTA (LXX)');
  console.log('═══════════════════════════════════════');
  
  const targetBook = process.argv[2];
  
  if (targetBook) {
    // Processar livro específico
    const lxxName = Object.keys(BOOK_MAP).find(k => BOOK_MAP[k] === targetBook);
    if (lxxName) {
      processLXXFile(`${lxxName}.js`);
    } else {
      console.log(`❌ Livro não encontrado: ${targetBook}`);
      console.log('Livros disponíveis:');
      Object.entries(BOOK_MAP).forEach(([k, v]) => console.log(`  ${v} → ${k}`));
    }
  } else {
    // Processar todos os arquivos
    const files = fs.readdirSync(LXX_DIR).filter(f => f.endsWith('.js'));
    console.log(`📚 Encontrados ${files.length} arquivos LXX`);
    
    files.forEach(file => {
      processLXXFile(file);
    });
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('✨ Pipeline LXX concluído!');
  console.log('\nNotas:');
  console.log('- Tokens gregos adicionados aos versículos existentes');
  console.log('- Revisar campos: ptLiteralWord, enLiteralWord, explanation');
  console.log('- Verificar parsing morfológico (morph)');
}

main();

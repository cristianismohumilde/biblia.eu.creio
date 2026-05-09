#!/usr/bin/env python3
"""
Script para baixar e processar dados da Septuaginta (LXX) da CATSS
Preenche greekWitnesses e tokens no formato do projeto Biblia.Creio.EU
"""

import json
import requests
import re
import os
from pathlib import Path

# Configurações
CATSS_BASE_URL = "https://raw.githubusercontent.com/CATSS/LXX-Rahlfs/master/"
OUTPUT_DIR = Path("../public/data/verses")

# Mapeamento de livros CATSS -> código do projeto
BOOK_MAPPING = {
    "Gen": "gen",      # Gênesis
    "Exod": "exo",     # Êxodo
    "Lev": "lev",      # Levítico
    "Num": "num",      # Números
    "Deut": "deu",     # Deuteronômio
    "Josh": "jos",     # Josué
    "Judg": "jdg",     # Juízes
    "Ruth": "rut",     # Rute
    "1Sam": "1sa",     # 1 Samuel
    "2Sam": "2sa",     # 2 Samuel
    "1Kgs": "1ki",     # 1 Reis
    "2Kgs": "2ki",     # 2 Reis
    "1Chr": "1ch",     # 1 Crônicas
    "2Chr": "2ch",     # 2 Crônicas
    "Ezra": "ezr",     # Esdras
    "Neh": "neh",      # Neemias
    "Esth": "est",     # Ester
    "Job": "job",      # Jó
    "Ps": "psa",       # Salmos
    "Prov": "pro",     # Provérbios
    "Eccl": "ecc",     # Eclesiastes
    "Song": "sos",     # Cânticos
    "Isa": "isa",      # Isaías
    "Jer": "jer",      # Jeremias
    "Lam": "lam",      # Lamentações
    "Ezek": "eze",     # Ezequiel
    "Dan": "dan",      # Daniel
    "Hos": "hos",      # Oséias
    "Joel": "joe",     # Joel
    "Amos": "amo",     # Amós
    "Obad": "oba",     # Obadias
    "Jonah": "jon",    # Jonas
    "Mic": "mic",      # Miqueias
    "Nah": "nah",      # Naum
    "Hab": "hab",      # Habacuque
    "Zeph": "zep",     # Sofonias
    "Hag": "hag",      # Ageu
    "Zech": "zec",     # Zacarias
    "Mal": "mal",      # Malaquias
}

# Códigos Strong gregos (mapeamento simplificado - precisa de BD completo)
GREEK_STRONGS = {
    "ἐν": "G1722",      # en - em
    "τῷ": "G3588",      # ho (dativo)
    "ἀρχῇ": "G746",     # archê - princípio
    "ἐποίησεν": "G4160", # poieô - fazer
    "ὁ": "G3588",       # ho - o/a
    "θεὸς": "G2316",    # theos - Deus
    "τὸν": "G3588",     # ho (acusativo)
    "οὐρανὸν": "G3772", # ouranos - céu
    "καὶ": "G2532",     # kai - e
    "τὴν": "G3588",     # ho (acusativo fem)
    "γῆν": "G1093",     # gê - terra
    "ἡ": "G3588",       # ho (nominativo fem)
    "δὲ": "G1161",      # de - mas/e
    "γῆ": "G1093",      # gê - terra
    "ἦν": "G2258",      # ên - era/era
    "ἀόρατος": "G517",  # aoratos - invisível
    "ἀκατασκεύαστος": "G181", # akataskeuastos - desordenado
    "σκότος": "G4655",   # skotos - escuridão
    "ἐπάνω": "G1883",   # epanô - sobre
    "τῆς": "G3588",     # ho (genitivo)
    "ἀβύσσου": "G12",   # abyssos - abismo
    "πνεῦμα": "G4151",   # pneuma - espírito/vento
    "θεοῦ": "G2316",    # theos (genitivo)
    "ἐπεφέρετο": "G2014", # epipherô - pairar
    "ὕδατος": "G5204",  # hudôr - água
    "εἶπεν": "G2036",   # eipon - dizer
    "γενηθήτω": "G1096", # ginomai - tornar-se (imperativo)
    "φῶς": "G5457",     # phôs - luz
    "ἐγένετο": "G1096", # ginomai - tornou-se
    "ἴδεν": "G3708",    # horaô - ver
    "ὅτι": "G3754",     # hoti - que
    "καλόν": "G2570",   # kalos - bom
    "διεχώρισεν": "G5563", # diachôrizô - separar
    "ἀνὰ": "G303",      # ana - entre
    "μέσον": "G3319",   # mesos - meio
    "ἐσπέρα": "G2073",  # hespera - tarde/noite
    "ἐγένετο": "G1096", # ginomai - foi/fez-se
    "ἕως": "G2193",     # heôs - até
    "πρωΐ": "G4404",    # prôi - manhã
}

# Parsing morfológico básico
def parse_morphology(word, lemma, context):
    """Tenta identificar morfologia básica do grego koine"""
    
    # Artigo definido
    if lemma == "ὁ":
        if word.endswith("ός") or word.endswith("ὸς"):
            return "Art-N-ms"  # Nominativo masculino singular
        elif word.endswith("ή") or word.endswith("ὴ"):
            return "Art-N-fs"  # Nominativo feminino singular
        elif word.endswith("όν") or word.endswith("ὸν"):
            return "Art-A-ms"  # Acusativo masculino singular
        elif word.endswith("ήν") or word.endswith("ὴν"):
            return "Art-A-fs"  # Acusativo feminino singular
        elif word.endswith("ῷ") or word.endswith("ῷ"):
            return "Art-D-ms"  # Dativo masculino singular
        elif word.endswith("ῆς") or word.endswith("ῆς"):
            return "Art-G-fs"  # Genitivo feminino singular
        return "Art"
    
    # Verbos comuns na LXX
    if lemma in ["ποιέω", "λέγω", "γίνομαι", "ὁράω", "εἰμί"]:
        # Detecta tempo/modo por terminação
        if word.endswith("σεν") or word.endswith("σε"):
            return "V-Aor-Act-3s"  # Aoristo ativo 3a pessoa
        elif word.endswith("θητω") or word.endswith("θήτω"):
            return "V-Aor-Imp-3s"  # Aoristo imperativo
        elif word.endswith("ετο") or word.endswith("ετο"):
            return "V-Impf-Mid-3s"  # Imperfeito médio
        elif word.endswith("εν") and len(word) > 4:
            return "V-Aor-Act-3s"  # Provável aoristo
        elif word.endswith("ω") or word.endswith("ῶν"):
            return "V-Pres-Act-1s"  # Presente
        return "V"
    
    # Preposições
    preps = ["ἐν", "εἰς", "ἐκ", "ἐπί", "πρός", "ὑπό", "διά", "μετά", "κατά", "περί", "ὑπέρ", "ἀπό", "παρά"]
    if lemma in preps:
        return "Prep"
    
    # Conjunções
    conjs = ["καί", "δέ", "ἵνα", "ὅτι", "εἰ", "ἀλλά", "ἤ", "οὖν", "γάρ"]
    if lemma in conjs:
        return "Conj"
    
    # Advérbios
    advs = ["οὐ", "μή", "νῦν", "τότε", "ὧδε", "ἐκεῖ", "οὕτως", "καλῶς"]
    if lemma in advs:
        return "Adv"
    
    # Substantivos (detecção simplificada)
    if word.endswith("ος") or word.endswith("ός") or word.endswith("ὸς"):
        return "N-ms"  # Masculino singular
    elif word.endswith("ον") or word.endswith("όν") or word.endswith("ὸν"):
        return "N-ns"  # Neutro singular
    elif word.endswith("η") or word.endswith("ή") or word.endswith("ὴ"):
        return "N-fs"  # Feminino singular
    elif word.endswith("ων") or word.endswith("ών") or word.endswith("ῶν"):
        return "N-mp"  # Masculino plural
    
    return "Unknown"

def get_strong_number(word, lemma):
    """Retorna número Strong grego se conhecido"""
    return GREEK_STRONGS.get(word, GREEK_STRONGS.get(lemma, "-"))

def transliterate_greek(text):
    """Translitera grego para alfabeto latino (simplificado)"""
    greek_to_lat = {
        'α': 'a', 'ά': 'a', 'ὰ': 'a', 'ᾶ': 'a', 'ἀ': 'a', 'ἁ': 'a', 'ἂ': 'a', 'ἃ': 'a', 'ἄ': 'a', 'ἅ': 'a',
        'β': 'b',
        'γ': 'g',
        'δ': 'd',
        'ε': 'e', 'έ': 'e', 'ὲ': 'e', 'ἐ': 'e', 'ἑ': 'e', 'ἒ': 'e', 'ἓ': 'e', 'ἔ': 'e', 'ἕ': 'e',
        'ζ': 'z',
        'η': 'ê', 'ή': 'ê', 'ὴ': 'ê', 'ῆ': 'ê', 'ἠ': 'ê', 'ἡ': 'ê', 'ἤ': 'ê', 'ἥ': 'ê',
        'θ': 'th',
        'ι': 'i', 'ί': 'i', 'ὶ': 'i', 'ῖ': 'i', 'ἰ': 'i', 'ἱ': 'i', 'ἴ': 'i', 'ἵ': 'i',
        'κ': 'k',
        'λ': 'l',
        'μ': 'm',
        'ν': 'n',
        'ξ': 'x',
        'ο': 'o', 'ό': 'o', 'ὸ': 'o', 'ὀ': 'o', 'ὁ': 'o', 'ὄ': 'o', 'ὅ': 'o',
        'π': 'p',
        'ρ': 'r', 'ῥ': 'rh', 'ῤ': 'rh',
        'σ': 's', 'ς': 's',
        'τ': 't',
        'υ': 'y', 'ύ': 'y', 'ὺ': 'y', 'ῦ': 'y', 'ὐ': 'y', 'ὑ': 'hy',
        'φ': 'ph',
        'χ': 'ch',
        'ψ': 'ps',
        'ω': 'ô', 'ώ': 'ô', 'ὼ': 'ô', 'ῶ': 'ô', 'ὠ': 'ô', 'ὡ': 'hô',
    }
    
    result = ""
    for char in text.lower():
        result += greek_to_lat.get(char, char)
    return result

def fetch_catss_data(book_code, chapter):
    """Busca dados da CATSS para um capítulo específico"""
    try:
        # Formato do arquivo CATSS: lxx.rahlfs.txt ou similar
        # Vamos buscar o texto completo
        url = f"{CATSS_BASE_URL}lxx.rahlfs.txt"
        response = requests.get(url, timeout=30)
        
        if response.status_code != 200:
            print(f"Erro ao buscar dados: {response.status_code}")
            return None
            
        # O arquivo CATSS tem formato específico
        # Precisamos parsear linha por linha
        lines = response.text.split('\n')
        
        # Encontrar versículos do livro/capítulo
        verses_data = []
        current_ref = f"{book_code.upper()} {chapter}:"
        
        for line in lines:
            if line.startswith(current_ref):
                # Parse: "GEN 1:1 ἐν ἀρχῇ ἐποίησεν..."
                parts = line.split(' ', 2)
                if len(parts) >= 3:
                    ref = parts[1]  # "1:1"
                    text = parts[2]  # texto grego
                    verses_data.append({
                        'verse': ref.split(':')[1],
                        'text': text
                    })
        
        return verses_data
    except Exception as e:
        print(f"Erro: {e}")
        return None

def process_verse(verse_num, greek_text, book_code, chapter):
    """Processa um versículo e gera tokens"""
    
    # Dividir em palavras (simplificado - idealmente usar tokenização grega)
    words = re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', greek_text)
    
    tokens = []
    for i, word in enumerate(words, 1):
        lemma = word  # Simplificado - idealmente usar lematizador
        translit = transliterate_greek(word)
        morph = parse_morphology(word, lemma, greek_text)
        strong = get_strong_number(word, lemma)
        
        token = {
            "id": f"{book_code}.{chapter}.{verse_num}.g{i}",
            "lang": "greek",
            "langPt": "Grego",
            "langEn": "Greek",
            "surface": word,
            "transliteration": translit,
            "lemma": lemma,
            "strong": strong,
            "morph": morph,
            "manuscript": "Grego: Septuaginta (LXX), tradição alexandrina",
            "manuscriptEn": "Greek: Septuagint (LXX), Alexandrian tradition",
            "ptLiteralWord": "",  # Preencher manualmente ou via API
            "enLiteralWord": "",
            "explanation": "",
            "explanationEn": ""
        }
        tokens.append(token)
    
    return tokens

def update_verse_file(book_code, chapter, verse_num, greek_text, tokens):
    """Atualiza arquivo JSON do versículo com dados gregos"""
    
    file_path = OUTPUT_DIR / f"{book_code}.{chapter}.json"
    
    if not file_path.exists():
        print(f"Arquivo não encontrado: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Encontrar o versículo
    verse_found = False
    for verse_data in data.get('verses', []):
        if verse_data.get('ref', {}).get('verse') == int(verse_num):
            # Adicionar sourceTexts.greek
            if 'sourceTexts' not in verse_data:
                verse_data['sourceTexts'] = {}
            verse_data['sourceTexts']['greek'] = greek_text
            
            # Adicionar greekWitnesses se não existir
            if 'greekWitnesses' not in verse_data:
                verse_data['greekWitnesses'] = []
            
            # Adicionar witness LXX
            witness = {
                "id": "lxx",
                "label": "Septuaginta (LXX)",
                "text": greek_text,
                "transliteration": " ".join([t['transliteration'] for t in tokens]),
                "literalPt": "",  # Traduzir manualmente
                "literalEn": ""
            }
            
            # Evitar duplicatas
            existing_ids = [w['id'] for w in verse_data['greekWitnesses']]
            if 'lxx' not in existing_ids:
                verse_data['greekWitnesses'].append(witness)
            
            # Adicionar tokens gregos
            if 'tokens' not in verse_data:
                verse_data['tokens'] = []
            
            # Adicionar tokens gregos (identificados com .gX)
            for token in tokens:
                # Verificar se token já existe
                existing = [t for t in verse_data['tokens'] if t['id'] == token['id']]
                if not existing:
                    verse_data['tokens'].append(token)
            
            verse_found = True
            break
    
    if verse_found:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Atualizado: {book_code}.{chapter}.{verse_num}")
        return True
    else:
        print(f"⚠️ Versículo não encontrado: {book_code}.{chapter}.{verse_num}")
        return False

def main():
    """Função principal"""
    print("🚀 Script de integração CATSS - Septuaginta")
    print("=" * 50)
    
    # Teste com Gênesis 1:1-5
    test_cases = [
        ("gen", "1", "1"),
        ("gen", "1", "2"),
        ("gen", "1", "3"),
        ("gen", "1", "4"),
        ("gen", "1", "5"),
    ]
    
    # Textos de exemplo da LXX (Gênesis 1)
    # Na prática, você buscaria da API CATSS
    sample_texts = {
        ("gen", "1", "1"): "ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν",
        ("gen", "1", "2"): "ἡ δὲ γῆ ἦν ἀόρατος καὶ ἀκατασκεύαστος καὶ σκότος ἐπάνω τῆς ἀβύσσου καὶ πνεῦμα θεοῦ ἐπεφέρετο ἐπάνω τοῦ ὕδατος",
        ("gen", "1", "3"): "καὶ εἶπεν ὁ θεός γενηθήτω φῶς καὶ ἐγένετο φῶς",
        ("gen", "1", "4"): "καὶ εἶδεν ὁ θεὸς τὸ φῶς ὅτι καλόν καὶ διεχώρισεν ὁ θεὸς ἀνὰ μέσον τοῦ φωτὸς καὶ ἀνὰ μέσον τοῦ σκότους",
        ("gen", "1", "5"): "καὶ ἐκάλεσεν ὁ θεὸς τὸ φῶς ἡμέραν καὶ τὸ σκότος νύκτα καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα μία",
    }
    
    print("\n📖 Processando versículos de teste...")
    print("-" * 50)
    
    for book, chapter, verse in test_cases:
        greek_text = sample_texts.get((book, chapter, verse), "")
        if greek_text:
            tokens = process_verse(verse, greek_text, book, chapter)
            success = update_verse_file(book, chapter, verse, greek_text, tokens)
            if success:
                print(f"   Tokens criados: {len(tokens)}")
    
    print("\n" + "=" * 50)
    print("✨ Processo concluído!")
    print("\nNotas:")
    print("- Este script usa textos de exemplo. Para produção, integre com API CATSS.")
    print("- Strong's numbers e parsing morfológico são simplificados.")
    print("- Recomenda-se revisão manual dos tokens gerados.")

if __name__ == "__main__":
    main()

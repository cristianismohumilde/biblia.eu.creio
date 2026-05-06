/**
 * 🤖 AI TRANSLATION PIPELINE (Groq Cloud)
 * ======================================
 * Este script automatiza a tradução de dicionários e versículos 
 * usando LLMs (Llama 3.1) via Groq.
 * 
 * Uso: node scripts/pipeline/ai_translate_pipeline.js [bookCode] [targetLang]
 * Exemplo: node scripts/pipeline/ai_translate_pipeline.js gen pt
 */

const fs = require('fs');
const path = require('path');

// Carregar .env.local manualmente (para compatibilidade com Node < 20)
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
}

// Configurações
const API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

if (!API_KEY) {
  console.error("❌ Erro: GROQ_API_KEY não encontrada no ambiente.");
  process.exit(1);
}

/**
 * Função para chamar a API da Groq
 */
async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Você é um especialista em tradução bíblica literal e linguística antiga (Hebraico/Grego). Sua tarefa é fornecer traduções extremamente literais e acadêmicas, preservando a estrutura original." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.choices[0].message.content);
}

/**
 * Traduz um capítulo inteiro
 */
async function translateChapter(filePath, targetLang = 'pt') {
  console.log(`📖 Processando: ${path.basename(filePath)}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  for (let i = 0; i < data.verses.length; i++) {
    const verse = data.verses[i];
    const enVerse = verse.enLiteralVerse;
    
    // Pular se já tiver tradução
    if (verse.ptLiteralVerse && !verse.ptLiteralVerse.includes("[placeholder]")) {
       console.log(`⏩ Pulando verso ${verse.ref.verse} (já traduzido)`);
       continue;
    }

    console.log(`   🔸 Traduzindo verso ${verse.ref.verse}...`);

    // Criar prompt para o verso e para os tokens
    const tokensToTranslate = verse.tokens
      .filter(t => t.lang === 'hebrew' || t.lang === 'greek')
      .map(t => ({ id: t.id, en: t.enLiteralWord, lemma: t.lemma }));

    const prompt = `
      Traduza o seguinte versículo bíblico do inglês para o ${targetLang === 'pt' ? 'Português' : targetLang} de forma LITERAL.
      Versículo Original (EN): "${enVerse}"
      
      Também traduza os seguintes termos individuais baseados no contexto do versículo:
      ${JSON.stringify(tokensToTranslate)}

      Retorne APENAS um objeto JSON no formato:
      {
        "translatedVerse": "tradução aqui",
        "tokens": { "id_do_token": "tradução_do_termo", ... }
      }
    `;

    try {
      let result;
      let retries = 3;
      
      while (retries > 0) {
        try {
          result = await callGroq(prompt);
          break;
        } catch (err) {
          if (err.message.includes("Rate limit reached")) {
            console.log(`     ⚠️ Rate limit! Esperando 10 segundos... (Tentativas restantes: ${retries})`);
            await new Promise(r => setTimeout(r, 10000));
            retries--;
          } else {
            throw err;
          }
        }
      }

      if (!result) throw new Error("Falha após várias tentativas");
      
      // Atualizar o verso
      if (targetLang === 'pt') {
        verse.ptLiteralVerse = result.translatedVerse;
        
        // Atualizar os tokens
        verse.tokens.forEach(token => {
          if (result.tokens[token.id]) {
            token.ptLiteralWord = result.tokens[token.id];
          }
        });
      }
      
      // Delay maior para evitar rate limit agressivo
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (err) {
      console.error(`   ❌ Erro no verso ${verse.ref.verse}: ${err.message}`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Capítulo finalizado e salvo!`);
}

/**
 * Main
 */
async function run() {
  const [,, bookCode, lang] = process.argv;
  
  if (!bookCode) {
    console.log("Uso: node --env-file=.env.local scripts/pipeline/ai_translate_pipeline.js [bookCode] [lang]");
    return;
  }

  const files = fs.readdirSync(VERSES_DIR).filter(f => f.startsWith(`${bookCode}.`));
  
  if (files.length === 0) {
    console.error(`❌ Nenhum arquivo encontrado para o livro: ${bookCode}`);
    return;
  }

  for (const file of files) {
    await translateChapter(path.join(VERSES_DIR, file), lang);
  }
}

run();

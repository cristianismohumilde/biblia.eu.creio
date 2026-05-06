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
  
  const BATCH_SIZE = 5; // Processar 5 versos de cada vez
  
  for (let i = 0; i < data.verses.length; i += BATCH_SIZE) {
    const batch = data.verses.slice(i, i + BATCH_SIZE)
      .filter(v => !v.ptLiteralVerse || v.ptLiteralVerse.includes("[placeholder]"));
    
    if (batch.length === 0) {
      console.log(`⏩ Pulando lote (versos ${i + 1} a ${i + BATCH_SIZE} já traduzidos)`);
      continue;
    }

    console.log(`   🔸 Traduzindo lote de ${batch.length} versos (início no verso ${batch[0].ref.verse})...`);

    const promptData = batch.map(v => ({
      id: v.id,
      text: v.enLiteralVerse,
      tokens: v.tokens
        .filter(t => t.lang === 'hebrew' || t.lang === 'greek')
        .map(t => ({ id: t.id, en: t.enLiteralWord }))
    }));

    const prompt = `
      Traduza os seguintes ${batch.length} versículos bíblicos do inglês para o ${targetLang === 'pt' ? 'Português' : targetLang} de forma LITERAL.
      
      Dados:
      ${JSON.stringify(promptData)}

      Retorne APENAS um objeto JSON no formato:
      {
        "verses": [
          {
            "id": "id_do_verso",
            "translatedVerse": "tradução aqui",
            "tokens": { "id_do_token": "tradução_em_português", ... }
          }
        ]
      }
    `;

    try {
      let result;
      let retries = 3;
      
      while (retries > 0) {
        try {
          result = await callGroq(prompt);
          if (result.verses) break;
          throw new Error("Formato de resposta inválido");
        } catch (err) {
          if (err.message.includes("Rate limit")) {
            console.log(`     ⚠️ Rate limit! Esperando 15 segundos...`);
            await new Promise(r => setTimeout(r, 15000));
            retries--;
          } else {
            console.error(`     ❌ Erro: ${err.message}`);
            retries--;
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }

      if (result && result.verses) {
        result.verses.forEach(vResult => {
          const verse = data.verses.find(v => v.id === vResult.id);
          if (verse) {
            verse.ptLiteralVerse = vResult.translatedVerse;
            verse.tokens.forEach(token => {
              if (vResult.tokens[token.id]) {
                token.ptLiteralWord = vResult.tokens[token.id];
              }
            });
          }
        });
        console.log(`      ✅ Lote de ${batch.length} versos salvo.`);
      }
      
      await new Promise(r => setTimeout(r, 2000)); // Pausa entre lotes
      
    } catch (err) {
      console.error(`   ❌ Erro fatal no lote: ${err.message}`);
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

/**
 * 🚀 GEMINI 3.1 FLASH-LITE TRANSLATION PIPELINE
 * ============================================
 * Script de alta performance para tradução bíblica em massa.
 * 
 * Uso: node scripts/pipeline/ai_translate_gemini.js [bookCode] [targetLang]
 * Exemplo: node scripts/pipeline/ai_translate_gemini.js gen pt
 */

const fs = require('fs');
const path = require('path');

// Carregar .env.local manualmente
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
}

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

if (!API_KEY || API_KEY === "SUA_CHAVE_AQUI") {
  console.error("❌ Erro: GEMINI_API_KEY não encontrada ou não configurada no .env.local");
  process.exit(1);
}

/**
 * Função para chamar a API do Gemini
 */
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`${data.error.code}: ${data.error.message}`);
  }

  if (!data.candidates || !data.candidates[0].content.parts[0].text) {
    throw new Error("Resposta do Gemini vazia ou inválida.");
  }

  return JSON.parse(data.candidates[0].content.parts[0].text);
}

/**
 * Traduz um capítulo inteiro usando Batching (Lotes)
 */
async function translateChapter(filePath, targetLang = 'pt') {
  console.log(`\n📖 Processando: ${path.basename(filePath)}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const BATCH_SIZE = 10; // Reduzido para 10 para evitar erros 503 de timeout
  
  for (let i = 0; i < data.verses.length; i += BATCH_SIZE) {
    const batch = data.verses.slice(i, i + BATCH_SIZE)
      .filter(v => !v.ptLiteralVerse || v.ptLiteralVerse.includes("[placeholder]") || v.ptLiteralVerse.includes("Não há versículo"));
    
    if (batch.length === 0) {
      console.log(`   ⏩ Lote (versos ${i + 1}-${Math.min(i + BATCH_SIZE, data.verses.length)}) já traduzido.`);
      continue;
    }

    console.log(`   🔸 Traduzindo lote de ${batch.length} versos (início no verso ${batch[0].ref.verse})...`);

    const promptData = batch.map(v => ({
      id: v.id,
      enVerse: v.enLiteralVerse,
      tokens: v.tokens
        .filter(t => t.lang === 'hebrew' || t.lang === 'greek')
        .map(t => ({ id: t.id, en: t.enLiteralWord }))
    }));

    const prompt = `
      INSTRUÇÃO: Traduza os versículos bíblicos abaixo do Inglês para o Português de forma EXTREMAMENTE LITERAL.
      
      DADOS DE ENTRADA (JSON):
      ${JSON.stringify(promptData)}

      REGRAS:
      1. Use o campo "enVerse" como a frase original para traduzir.
      2. Traduza também cada termo na lista "tokens" individualmente.
      3. Mantenha a fidelidade absoluta ao sentido original.
      
      RETORNE APENAS JSON NO FORMATO:
      {
        "verses": [
          {
            "id": "id_do_verso",
            "translatedVerse": "tradução da frase",
            "tokens": { "id_token": "tradução_palavra", ... }
          }
        ]
      }
    `;

    try {
      let result;
      let retries = 5;
      
      while (retries > 0) {
        try {
          result = await callGemini(prompt);
          if (result.verses) break;
          throw new Error("Formato JSON retornado é inválido.");
        } catch (err) {
          console.log(`      ⚠️  Aviso: ${err.message}. Retentando em 20s... (Tentativas: ${retries})`);
          await new Promise(r => setTimeout(r, 20000));
          retries--;
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
        console.log(`      ✅ Lote de ${batch.length} versos processado com sucesso.`);
      }
      
      // Delay maior para ser "gentil" com o servidor e evitar 429/503
      await new Promise(r => setTimeout(r, 10000)); 
      
    } catch (err) {
      console.error(`   ❌ Erro crítico no lote: ${err.message}`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`🏁 Capítulo finalizado!`);
}

/**
 * Main
 */
async function run() {
  const [,, bookCode, lang] = process.argv;
  
  if (!bookCode) {
    console.log("Uso: node scripts/pipeline/ai_translate_gemini.js [bookCode] [lang]");
    return;
  }

  const files = fs.readdirSync(VERSES_DIR).filter(f => f.startsWith(`${bookCode}.`));
  
  if (files.length === 0) {
    console.error(`❌ Nenhum arquivo encontrado para o livro: ${bookCode}`);
    return;
  }

  // Ordenar arquivos numericamente (cap 1, 2, 3...)
  files.sort((a, b) => {
    const numA = parseInt(a.split('.')[1]);
    const numB = parseInt(b.split('.')[1]);
    return numA - numB;
  });

  for (const file of files) {
    await translateChapter(path.join(VERSES_DIR, file), lang);
  }
}

run();

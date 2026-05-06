/**
 * 🤖 AI TRANSLATION PIPELINE (Azure OpenAI — GPT-4o-mini)
 * =========================================================
 * Script de tradução de alta performance usando Azure OpenAI.
 * Ideal para o plano Azure for Students ($100 créditos).
 * 
 * Custo estimado: ~$0.15/1M tokens → traduzir a Bíblia toda custa < $2!
 * 
 * PRÉ-REQUISITOS:
 * 1. Criar um recurso "Azure OpenAI" no portal.azure.com
 * 2. Implantar o modelo "gpt-4o-mini" no Azure OpenAI Studio
 * 3. Adicionar ao .env.local:
 *    AZURE_OPENAI_ENDPOINT=https://SEU-RECURSO.openai.azure.com
 *    AZURE_OPENAI_KEY=sua_chave_aqui
 *    AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
 * 
 * Uso: node scripts/pipeline/ai_translate_azure.js [bookCode] [targetLang]
 * Exemplo: node scripts/pipeline/ai_translate_azure.js gen pt
 * Exemplo: node scripts/pipeline/ai_translate_azure.js exo pt
 */

const fs = require('fs');
const path = require('path');

// Carregar .env.local manualmente
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      const key = line.slice(0, eqIdx).trim();
      const value = line.slice(eqIdx + 1).trim();
      if (key) process.env[key] = value;
    }
  });
}

// Configurações
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_KEY = process.env.AZURE_OPENAI_KEY;
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
const API_VERSION = '2024-12-01-preview';
const VERSES_DIR = path.join(__dirname, '../../public/data/verses');

if (!AZURE_ENDPOINT || !AZURE_KEY) {
  console.error('❌ Erro: AZURE_OPENAI_ENDPOINT e AZURE_OPENAI_KEY são obrigatórios no .env.local');
  console.error('   Adicione as variáveis e tente novamente.');
  process.exit(1);
}

/**
 * Chama a API Azure OpenAI com o modelo GPT-4o-mini
 * Vantagem: limites muito maiores que Groq/Gemini gratuito
 */
async function callAzureOpenAI(prompt) {
  const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em tradução bíblica literal e linguística antiga (Hebraico/Grego). Sua tarefa é fornecer traduções extremamente literais e acadêmicas, preservando a estrutura original. Retorne APENAS JSON válido conforme o esquema solicitado, sem texto adicional.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.choices[0].message.content);
}

/**
 * Traduz um capítulo inteiro usando lotes de 20 versos.
 * O GPT-4o-mini suporta contextos muito maiores que a Groq Free Tier.
 */
async function translateChapter(filePath, targetLang = 'pt') {
  console.log(`\n📖 Processando: ${path.basename(filePath)}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const BATCH_SIZE = 10; // 10 versos: bom equilíbrio entre velocidade e confiabilidade

  for (let i = 0; i < data.verses.length; i += BATCH_SIZE) {
    const allInBatch = data.verses.slice(i, i + BATCH_SIZE);
    const batch = allInBatch.filter(
      v => !v.ptLiteralVerse || v.ptLiteralVerse.includes('[placeholder]') || v.ptLiteralVerse === ''
    );

    if (batch.length === 0) {
      console.log(`   ⏩ Lote (versos ${i + 1}-${Math.min(i + BATCH_SIZE, data.verses.length)}) já traduzido.`);
      continue;
    }

    console.log(`   🔸 Traduzindo lote de ${batch.length} versos (verso ${batch[0].ref.verse}–${batch[batch.length - 1].ref.verse})...`);

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
      3. Mantenha a fidelidade absoluta ao sentido original do Hebraico/Grego.
      4. Não adicione explicações, apenas a tradução direta.

      RETORNE APENAS JSON NO FORMATO EXATO:
      {
        "verses": [
          {
            "id": "id_do_verso",
            "translatedVerse": "tradução literal da frase",
            "tokens": { "id_token_1": "palavra_traduzida_1", "id_token_2": "palavra_traduzida_2" }
          }
        ]
      }
    `;

    let retries = 4;
    let result = null;

    while (retries > 0) {
      try {
        result = await callAzureOpenAI(prompt);
        if (result && result.verses) break;
        throw new Error('Formato JSON inválido na resposta.');
      } catch (err) {
        retries--;
        const isRateLimit = err.message.includes('429') || err.message.toLowerCase().includes('rate');
        const waitTime = isRateLimit ? 30000 : 5000;
        const label = isRateLimit ? 'Rate limit! Aguardando 30s...' : `Erro: ${err.message}. Tentando novamente...`;
        console.log(`     ⚠️  ${label} (${retries} tentativas restantes)`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }

    if (result && result.verses) {
      result.verses.forEach(vResult => {
        const verse = data.verses.find(v => v.id === vResult.id);
        if (verse) {
          verse.ptLiteralVerse = vResult.translatedVerse;
          verse.tokens.forEach(token => {
            if (vResult.tokens && vResult.tokens[token.id]) {
              token.ptLiteralWord = vResult.tokens[token.id];
            }
          });
        }
      });
      console.log(`      ✅ Lote de ${batch.length} versos processado com sucesso.`);
    } else {
      console.error(`      ❌ Falha ao processar lote após todas as tentativas.`);
    }

    // Pausa curta entre lotes (Azure tem limites mais altos, mas ainda assim respeitamos)
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`🏁 Capítulo finalizado e salvo!`);
}

/**
 * Main — processa todos os capítulos do livro informado
 */
async function run() {
  const [,, bookCode, lang = 'pt'] = process.argv;

  if (!bookCode) {
    console.log('Uso: node scripts/pipeline/ai_translate_azure.js [bookCode] [lang]');
    console.log('Exemplo: node scripts/pipeline/ai_translate_azure.js gen pt');
    return;
  }

  const files = fs.readdirSync(VERSES_DIR)
    .filter(f => f.startsWith(`${bookCode}.`) && f.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[1]);
      const numB = parseInt(b.split('.')[1]);
      return numA - numB;
    });

  if (files.length === 0) {
    console.error(`❌ Nenhum arquivo encontrado para o livro: "${bookCode}"`);
    console.error(`   Verifique se o código do livro está correto (ex: gen, exo, lev...)`);
    return;
  }

  console.log(`\n🚀 Iniciando tradução de "${bookCode.toUpperCase()}" (${files.length} capítulos) com Azure OpenAI GPT-4o-mini`);
  console.log(`   Modelo: ${DEPLOYMENT}`);
  console.log(`   Lotes: 20 versos por requisição\n`);

  for (const file of files) {
    await translateChapter(path.join(VERSES_DIR, file), lang);
  }

  console.log(`\n🎉 Tradução de "${bookCode.toUpperCase()}" concluída!`);
}

run().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});

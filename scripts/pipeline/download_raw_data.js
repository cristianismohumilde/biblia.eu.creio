const https = require('https');
const fs = require('fs');
const path = require('path');

const RAW_DATA_DIR = path.join(__dirname, 'raw_data');

// Criar a pasta raw_data se não existir
if (!fs.existsSync(RAW_DATA_DIR)){
    fs.mkdirSync(RAW_DATA_DIR, { recursive: true });
}

// Arquivos que vamos baixar do Github (Repositórios Open Source)
const filesToDownload = [
    {
        name: 'strongs_hebrew_dictionary.json',
        // Repositório consolidado com definições Strong em Inglês
        url: 'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.json'
    },
    {
        name: 'hebrew_bible_morph.json',
        // Repositório que consolidou o OpenScriptures WLC para JSON
        url: 'https://raw.githubusercontent.com/jordanhudgens/hebrew-bible-json/master/hebrew-bible.json'
    }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        console.log(`Baixando: ${path.basename(dest)}...`);
        const file = fs.createWriteStream(dest);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Concluído: ${path.basename(dest)}`);
                    resolve();
                });
            } else if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                console.log(`Redirecionando...`);
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Erro de Servidor: ${response.statusCode} - ${response.statusMessage}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

async function startDownload() {
    console.log("🚀 Iniciando o Download das Bases de Dados Oficiais (OpenScriptures)...");
    console.log("Isso pode demorar alguns minutos dependendo da sua conexão.\n");

    for (const file of filesToDownload) {
        const destPath = path.join(RAW_DATA_DIR, file.name);
        try {
            await downloadFile(file.url, destPath);
        } catch (error) {
            console.error(`❌ Falha ao baixar ${file.name}: ${error}`);
            console.error(`⚠️ Nota: Alguns links do GitHub podem mudar. Se falhar, precisaremos baixar os zips manualmente.`);
        }
    }
    
    console.log("\n🎉 Processo de Download finalizado!");
    console.log("Agora os arquivos brutos estão na pasta: /scripts/pipeline/raw_data/");
}

startDownload();

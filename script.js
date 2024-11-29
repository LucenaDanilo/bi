const fs = require('fs');
const csvParser = require('csv-parser');
const axios = require('axios');


// Função para carregar e processar o CSV
async function processCsv(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

// Função para gerar as relações com a API da OpenAI
async function generateInsights(data) {
    const prompt = `
    Eu recebi os seguintes dados em CSV:
    ${JSON.stringify(data, null, 2)}

    Baseado nesses dados, me sugira boas relações ou gráficos que eu poderia criar. Nesse formato: ['ColunaA', 'ColunaB', ... , 'ColunaN', 'TipoGráfico']
    `;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini', // ou outro modelo disponível
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const insights = response.data.choices[0].message.content;
        console.log('Sugestões de gráficos e relações:');
        console.log(insights);
    } catch (error) {
        console.error('Erro ao chamar a API da OpenAI:', error.response?.data || error.message);
    }
}

// Executar
(async () => {
    const csvData = await processCsv('data.csv'); // substitua pelo caminho do seu CSV
    await generateInsights(csvData);
})();

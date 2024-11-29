// URL do Google Sheets (exemplo: link gerado após "Publicar na web")
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQreU5QGDZ5viTm95YVVdBA4lCwWM7TbeaqYhIHJOVagw5P6PT4py-okZq3ZUESQZRgvgnHTT0kY7-g/pub?output=csv';

// Função para carregar o CSV
async function loadCSVFromGoogleSheets(csvUrl) {
    const response = await fetch(csvUrl);
    const data = await response.text();

    // Processa o CSV em arrays de categorias (labels) e valores
    const rows = data.split("\n").slice(1); // Ignora o cabeçalho
    const labels = [];
    const values = [];

    rows.forEach(row => {
        const [category, value] = row.split(",");
        if (category && value) {
            labels.push(category.trim());
            values.push(Number(value.trim()));
        }
    });

    return { labels, values };
}

// Função para criar o gráfico com Chart.js
async function createChart() {
    const { labels, values } = await loadCSVFromGoogleSheets(GOOGLE_SHEETS_CSV_URL);

    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
        type: "bar", // Tipo de gráfico (barras)
        data: {
            labels: labels, // Categorias (ex.: A, B, C, D)
            datasets: [
                {
                    label: "Valores", // Nome da série de dados
                    data: values, // Valores (ex.: 10, 15, 8, 20)
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)", // Cor de fundo
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)"
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)", // Cor da borda
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
                    ],
                    borderWidth: 1 // Largura da borda
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true // Exibir legenda
                },
                tooltip: {
                    enabled: true // Exibir tooltip ao passar o mouse
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Iniciar eixo Y no zero
                }
            }
        }
    });
}

// Inicializa o gráfico
createChart();
const express = require('express');
const app = express();
const port = 3000;

// Rota para a página inicial
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meu Site Node.js</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    margin-top: 100px;
                }
                h1 {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Bem-vindo ao Meu Site Node.js!</h1>
                <p>Este site está hospedado na AWS EC2.</p>
            </div>
        </body>
        </html>
    `);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
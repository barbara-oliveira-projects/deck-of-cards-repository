const express = require('express');
const app = express();
const path = require('path');

// Configuração do EJS e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => res.render('index'));
app.get('/buscar', (req, res) => res.render('buscar'));
app.get('/incluir', (req, res) => res.render('incluir'));
app.get('/atualizar', (req, res) => res.render('atualizar'));

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'public/uploads/' });

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rotas GET
app.get('/', (req, res) => res.render('index'));
app.get('/buscar', (req, res) => res.render('buscar'));
app.get('/incluir', (req, res) => res.render('incluir'));
app.get('/atualizar', (req, res) => res.render('atualizar'));

// Rota POST para inclusão
app.post('/incluir', upload.single('capa'), (req, res) => {
    const { titulo, textos } = req.body;
    const capa = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Exemplo de processamento (substitua por sua lógica de banco de dados)
    console.log('Novo baralho criado:', {
        titulo,
        capa,
        textos: Array.isArray(textos) ? textos : [textos]
    });
    
    res.redirect('/');
});

// Rota 404
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
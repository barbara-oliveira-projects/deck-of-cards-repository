const express = require('express');
const AWS = require('aws-sdk');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

AWS.config.update({ region: process.env.AWS_REGION });

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const TABLE_NAME = process.env.DYNAMO_TABLE;
const BUCKET_NAME = process.env.S3_BUCKET;

// Página inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para exibir o formulário de inclusão
app.get('/incluir', (req, res) => {
    res.render('incluir');
  });
  

app.post('/incluir', upload.single('capa'), async (req, res) => {
    const { titulo, textos } = req.body;
    const file = req.file;
  
    if (!titulo || !textos || !file) {
      return res.status(400).send("Preencha todos os campos e envie uma imagem.");
    }
  
    const fileName = `${Date.now()}-${file.originalname}`;
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };
  
    try {
      // Faz upload para o S3
      await s3.upload(s3Params).promise();
  
      // Salva no DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Item: {
          BaralhoID: uuidv4(), // ✅ chave primária obrigatória
          Titulo: titulo,
          Descricao: Array.isArray(textos) ? textos.join('\n') : textos,
          Imagem: fileName
        }
      };
  
      await dynamoClient.put(params).promise();
      console.log('Baralho salvo com sucesso:', params.Item);
      res.redirect('/buscar');
    } catch (err) {
      console.error('Erro ao salvar baralho:', err);
      res.status(500).send('Erro ao salvar baralho.');
    }
  });
  

// Rota para buscar baralhos
app.get('/buscar', async (req, res) => {
  const searchTerm = req.query.q;
  let baralhos = [];

  const params = {
    TableName: TABLE_NAME
  };

  try {
    const data = await dynamoClient.scan(params).promise();
    baralhos = data.Items;

    if (searchTerm) {
      baralhos = baralhos.filter(b =>
        b.Titulo && b.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Gera URL das imagens
    baralhos = baralhos.map(b => ({
      ...b,
      ImagemUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${b.Imagem}`
    }));

    console.log("Baralhos encontrados:", baralhos);

    res.render('buscar', { baralhos, searchTerm });
  } catch (err) {
    console.error('Erro ao buscar baralhos:', err);
    res.render('buscar', { baralhos: [], searchTerm });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');

const app = express();

// Configuração AWS
const dynamoDB = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configurações do Multer para upload temporário
const upload = multer({ 
  dest: '/tmp/uploads',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rotas GET (mantidas as originais)
app.get('/', (req, res) => res.render('index'));
app.get('/buscar', (req, res) => res.render('buscar'));
app.get('/incluir', (req, res) => res.render('incluir'));
app.get('/atualizar', (req, res) => res.render('atualizar'));

// Rota POST modificada para DynamoDB + S3
app.post('/incluir', upload.single('capa'), async (req, res) => {
  try {
    // 1. Upload para S3 (se existir arquivo)
    let capaURL = null;
    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      const fileKey = `covers/${Date.now()}_${req.file.originalname}`;
      
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.S3_BUCKET || 'seu-bucket-baralhos',
          Key: fileKey,
          Body: fileStream,
          ContentType: req.file.mimetype
        }
      });
      
      await upload.done();
      capaURL = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      
      // Remove arquivo temporário
      fs.unlinkSync(req.file.path);
    }

    // 2. Salvar no DynamoDB
    const textosArray = Array.isArray(req.body.textos) ? req.body.textos : [req.body.textos];
    
    const params = {
      TableName: process.env.DYNAMO_TABLE || 'Baralhos',
      Item: {
        'BaralhoID': { S: Date.now().toString() },
        'Titulo': { S: req.body.titulo },
        'Textos': { SS: textosArray },
        'DataCriacao': { S: new Date().toISOString() }
      }
    };

    if (capaURL) {
      params.Item.CapaURL = { S: capaURL };
    }

    await dynamoDB.send(new PutItemCommand(params));

    res.redirect('/?success=true');
  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    res.status(500).render('erro', { 
      mensagem: 'Erro ao salvar baralho',
      erro: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

// Rota 404
app.use((req, res) => {
  res.status(404).render('erro', { mensagem: 'Página não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('erro', { 
    mensagem: 'Erro interno no servidor',
    erro: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/sugestao", (req, res) => {
  const { nome, ingredientes } = req.query;
  if (nome && ingredientes) {
    res.send(`
      <html>
        <head>
          <title>Agradecimento</title>
          <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
          <h1>Obrigado pela sugestão, ${nome}!</h1>
          <p>Ingredientes sugeridos: <strong>${ingredientes}</strong></p>
          <a href="/">Voltar ao início</a>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <head>
          <title>Sugestão</title>
          <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
          <h1>Página de Sugestão</h1>
          <p>Envie sua sugestão pela página principal.</p>
          <a href="/">Voltar ao início</a>
        </body>
      </html>
    `);
  }
});

app.get("/contato", (req, res) => {
  res.sendFile(__dirname + "/views/contato.html");
});

app.post("/contato", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  const params = new URLSearchParams({
    nome,
    email,
    assunto,
    mensagem,
  }).toString();
  res.redirect(302, `/contato-recebido?${params}`);
});

app.get("/contato-recebido", (req, res) => {
  const { nome, email, assunto, mensagem } = req.query;
  res.status(200).send(`
    <html>
      <head><title>Contato Recebido</title></head>
      <link rel="stylesheet" href="/css/style.css">
      <body>
        <h1>Obrigado pelo contato!</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${assunto}</p>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
        <a href="/">Voltar ao início</a>
      </body>
    </html>
  `);
});

const fs = require("fs");

app.get("/api/lanches", (req, res) => {
  fs.readFile(__dirname + "/public/data/lanches.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao ler lanches.json" });
    }
    try {
      const lanches = JSON.parse(data);
      res.json(lanches);
    } catch (e) {
      res.status(500).json({ error: "JSON inválido em lanches.json" });
    }
  });
});

app.use((req, res) => {
  res.status(404);

  if (req.method === "GET") {
    res.sendFile(__dirname + "/public/404.html", (err) => {
      if (err) {
        res.send("<h1>404 - Página não encontrada</h1>");
      }
    });
  } else {
    res.send("<h1>404 - Página não encontrada</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});

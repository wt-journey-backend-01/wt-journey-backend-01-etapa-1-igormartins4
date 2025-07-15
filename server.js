const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/sugestao", (req, res) => {
  const { nome, ingredientes } = req.query;
  if (nome && ingredientes) {
    res.send(`
            <html>
                <head><title>Agradecimento</title></head>
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
                <head><title>Sugestão</title></head>
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
  res.redirect(`/contato-recebido?${params}`);
});

app.get("/contato-recebido", (req, res) => {
  const { nome, email, assunto, mensagem } = req.query;
  res.send(`
        <html>
            <head><title>Contato Recebido</title></head>
            <body>
                <h1>Obrigado pelo contato!</h1>
                <p><strong>Nome:</strong> ${nome || ""}</p>
                <p><strong>Email:</strong> ${email || ""}</p>
                <p><strong>Assunto:</strong> ${assunto || ""}</p>
                <p><strong>Mensagem:</strong> ${mensagem || ""}</p>
                <a href="/">Voltar ao início</a>
            </body>
        </html>
    `);
});

// ...existing code...

app.get("/api/lanches", (req, res) => {
  res.json([
    {
      id: 1,
      nome: "DevBurger Clássico",
      ingredientes:
        "Pão brioche, Carne 150g, Queijo cheddar, Alface americana, Tomate fresco, Molho especial",
    },
    {
      id: 2,
      nome: "Burger de Bacon",
      ingredientes:
        "Pão australiano, Carne 180g, Queijo prato, Bacon crocante, Cebola caramelizada, Molho barbecue",
    },
    {
      id: 3,
      nome: "Commit Veggie",
      ingredientes:
        "Pão integral, Burger de grão de bico, Queijo vegano, Rúcula, Tomate seco, Maionese de ervas",
    },
  ]);
});

app.use((req, res) => {
  res.status(404);

  res.sendFile(__dirname + "/public/404.html", (err) => {
    if (err) {
      res.send("<h1>404 - Página não encontrada</h1>");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});

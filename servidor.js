const db = require('./conexao');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
  secret: '46feb3e2fec47e6d6cd7bc44bfe1aef9',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 15 * 60 * 1000 }
}));

// Página principal
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
})

// Página de login
app.get("/login", (req, res)=>{
  res.sendFile(path.join(__dirname, 'login.html'));
})

// Arquivo estilo.css
app.get("/estilo", (req, res)=>{
  res.sendFile(path.join(__dirname, 'estilo.css'));
})

//Fazer login
app.post("/fazerLogin", (req, res)=>{
    const {usuario, senha} = req.body;
    db.query('SELECT * FROM tb_usuarios WHERE nome_usuario=? AND senha_usuario=?',
      [usuario, senha], (erro, resultado)=>{
        if(erro){return res.json({msg:"Falha ao consultar "+erro.message})}
        if(resultado.length == 1){
          return res.json({msg: true})
        }else{
          return res.json({msg: false})
        }
      })
}); // Fim do fazer login

app.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000');
});
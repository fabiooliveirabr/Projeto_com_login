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

function verificarAutenticado(req, res, next){
  if(req.session.usuarioLogado){
      next();
  }else{
      res.redirect('/login')
  }
}

// Endpoint para deslogar
app.get('/logout', (req, res)=>{
  req.session.destroy();
  res.redirect('/login');
})

// Endpoint para cadastrar novos usuários
app.post('/cadastrarUsuario', (req, res)=>{
    const {nomeCompleto, usuario, senha} = req.body;
    db.query(`INSERT INTO tb_usuarios 
              (nome, nome_usuario, senha_usuario) VALUES (?, ?, ?)`,
            [nomeCompleto, usuario, senha], (erro, resultado)=>{
                 if(erro){return res.json({msg:'Falha ao cadastrar'+erro.message})}
                 return res.json({msg: "Cadastrado com sucesso"})
            })
})


// Página principal
app.get("/", verificarAutenticado, (req, res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
})

// Página de login
app.get("/login", (req, res)=>{
  res.sendFile(path.join(__dirname, 'login.html'));
})

// Página de conta
app.get("/conta", (req, res)=>{
  res.sendFile(path.join(__dirname, 'conta.html'));
})


// Arquivo estilo.css
app.get("/estilo", (req, res)=>{
  res.sendFile(path.join(__dirname, 'estilo.css'));
})

// Arquivo outra página em html
app.get("/outra", verificarAutenticado, (req, res)=>{
  res.sendFile(path.join(__dirname, 'outra.html'));
});

//Fazer login
app.post("/fazerLogin", (req, res)=>{
    const {usuario, senha} = req.body;
    db.query('SELECT * FROM tb_usuarios WHERE nome_usuario=? AND senha_usuario=?',
      [usuario, senha], (erro, resultado)=>{
        if(erro){return res.json({msg:"Falha ao consultar "+erro.message})}
        if(resultado.length == 1){
          req.session.usuarioLogado = "Sim";
          return res.json({msg: true})
        }else{
          return res.json({msg: false})
        }
      })
}); // Fim do fazer login

app.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000');
});
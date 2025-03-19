let pontuacaoAtual = 0;
let nivelAtual = 'facil'; // Nível padrão
let tempoRestante = 20; // 20 segundos
let timerInterval; // Variável para armazenar o intervalo do timer

async function cadastrarUsuario() {
  const nome = document.getElementById('cadastro-nome').value;
  const email = document.getElementById('cadastro-email').value;
  const senha = document.getElementById('cadastro-senha').value;

  try {
    const response = await fetch('https://seu-backend.onrender.com/api/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await response.text();
    alert(data);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    alert("Erro ao cadastrar usuário.");
  }
}

async function loginUsuario() {
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const response = await fetch('https://seu-backend.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token); // Salva o token no navegador
      alert("Login bem-sucedido!");
    } else {
      alert(data);
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro ao fazer login.");
  }
}


function iniciarTimer() {
  tempoRestante = 20; // Reinicia o tempo para 20 segundos
  const timerElement = document.getElementById('timer');

  // Limpa qualquer intervalo anterior (para evitar múltiplos timers)
  clearInterval(timerInterval);

  // Inicia o novo timer
  timerInterval = setInterval(() => {
    timerElement.innerText = `Tempo restante: ${tempoRestante}s`;
    tempoRestante--;

    if (tempoRestante <= 5) {
      timerElement.classList.add('alerta'); // Altera a cor do timer para alerta
    } else {
      timerElement.classList.remove('alerta');
    }

    if (tempoRestante < 0) {
      clearInterval(timerInterval); // Para o timer quando o tempo acabar
      alert("Tempo esgotado!");
      carregarPergunta(); // Carrega uma nova pergunta
    }
  }, 1000); // Atualiza a cada segundo
}

// Função para carregar uma nova pergunta
async function carregarPergunta() {
  try {
    const response = await fetch(`http://localhost:3000/api/perguntas?nivel=${nivelAtual}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById('pergunta-texto').innerText = data.pergunta;
    sessionStorage.setItem('respostaCorreta', data.respostaCorreta);

    // Inicia o timer ao carregar a pergunta
    iniciarTimer();
  } catch (error) {
    console.error("Erro ao carregar pergunta:", error);
    document.getElementById('pergunta-texto').innerText = "Erro ao carregar pergunta.";
  }
}

function enviarResposta() {
  const respostaUsuario = document.getElementById('resposta').value;
  const respostaCorreta = sessionStorage.getItem('respostaCorreta');

  if (parseInt(respostaUsuario) === parseInt(respostaCorreta)) {
    alert("Resposta correta!");
    pontuacaoAtual += 10;
    document.getElementById('pontuacao').innerText = pontuacaoAtual;
  } else {
    alert(`Resposta incorreta. A resposta correta é: ${respostaCorreta}`);
  }

  carregarPergunta(); // Carrega uma nova pergunta
}

function mudarNivel(nivel) {
  nivelAtual = nivel; // Atualiza o nível
  carregarPergunta(); // Carrega uma nova pergunta com o nível selecionado
}

async function salvarPontuacao() {
  const nomeJogador = document.getElementById('nome-jogador').value;
  if (!nomeJogador) {
    alert("Por favor, insira seu nome.");
    return;
  }

  try {
    await fetch('http://localhost:3000/api/salvar-pontuacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: nomeJogador, pontuacao: pontuacaoAtual })
    });
    alert("Pontuação salva com sucesso!");
    carregarRanking(); // Atualiza o ranking após salvar
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error);
    alert("Erro ao salvar pontuação. Tente novamente.");
  }
}

// Função para carregar o ranking
async function carregarRanking() {
  try {
    const response = await fetch('http://localhost:3000/api/ranking');
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const ranking = await response.json();

    const lista = document.getElementById('ranking-lista');
    lista.innerHTML = ''; // Limpa a lista anterior

    ranking.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      // Adiciona ícone de troféu para os 3 primeiros lugares
      let icone = '';
      if (index === 0) {
        icone = '<i class="fas fa-trophy text-warning"></i>'; // Ouro
      } else if (index === 1) {
        icone = '<i class="fas fa-trophy text-secondary"></i>'; // Prata
      } else if (index === 2) {
        icone = '<i class="fas fa-trophy text-danger"></i>'; // Bronze
      }

      li.innerHTML = `
        <span>${icone} <strong>${index + 1}. ${item.usuario}</strong></span>
        <span class="badge bg-success rounded-pill">${item.pontuacao} pontos</span>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    document.getElementById('ranking-lista').innerHTML = '<li class="list-group-item">Erro ao carregar ranking.</li>';
  }
}

// Carrega a primeira pergunta ao iniciar
carregarPergunta();
carregarRanking();
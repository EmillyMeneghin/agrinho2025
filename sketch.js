let personagem;
let geleias = [];
let pontuacao = 0;
let pontuacaoFinal = 50;
let tempoLimite = 60;
let tempoInicial;
let efeitos = [];

let estado = "inicio"; // 'inicio', 'jogando', 'fim'
let venceu = false;

// Pré-carregamento de Imagens
function preload() {
    
    // na mesma pasta do sketch.js.
     imgGeleiaVerde = loadImage('GeleiaRosa.png');
     imgGeleiaCinza = loadImage('GeleiaCinza.png');
     imgPersonagem = loadImage('Personagem.png');
    
}


function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background("#E91E93CE");

  if (estado === "inicio") {
    mostrarTelaInicial();
  } else if (estado === "jogando") {
    atualizarJogo();
  } else if (estado === "fim") {
    mostrarTelaFim();
  }
}

function mostrarTelaInicial() {
  background("#E91E63");
  fill("white");
  textSize(48);
  image(imgGeleiaRosa, 130, 70, 50, 50)
  image(imgGeleiaRosa, 615, 70, 50, 50)
  image(imgGeleiaCinza, 70, 70, 50, 50)
  image(imgGeleiaCinza, 675, 70, 50, 50)
  text(" Coletando Geleias ", width / 2, height / 2 - 100);
  textSize(24);
  text(`Ajude o personagem a coletar as geleias verdes e evitar as cinzas!\nChegue a  ${pontuacaoFinal} pontos em 1 minuto!`, width / 2, height / 2 - 30);
  desenharBotao("Começar Jogo", width / 2 - 75, height / 2 + 40, 150, 50);
  text("Setas movem o personagem\n Espaço coleta as geleias\n Clique do mouse cria novas geleias.", width / 2, height - 50);
}

function iniciarJogo() {
  personagem = {
    x: width / 2,
    y: height / 2,
    tamanho: 40,
    imagem: imgPersonagem
  };
  geleias = [];
  pontuacao = 0;
  efeitos = [];
  teclas = {};
  venceu = false;
  tempoInicial = millis();
  gerarGeleias(10);
  estado = "jogando";
}

function atualizarJogo() {
  moverPersonagem();

  let tempoDecorrido = floor((millis() - tempoInicial) / 1000);
  let tempoRestante = max(0, tempoLimite - tempoDecorrido);

  if (tempoRestante === 0 || pontuacao >= pontuacaoFinal) {
    venceu = pontuacao >= pontuacaoFinal;
    estado = "fim";
  }

  // Mostrar personagem
  textSize(personagem.tamanho);
    image(personagem.imagem, personagem.x, personagem.y, personagem.tamanho -10, personagem.tamanho);

  // Mostrar geleias
  textSize(24);
  for (let geleia of geleias) {
    if (!geleia.coletada) {
      if (geleia.tipo === "boa") {
                // Desenha a imagem da geleia verde
                image(imgGeleiaVerde, geleia.x, geleia.y, 24, 24); 
            } else {
                // Desenha a imagem da geleia cinza
                image(imgGeleiaCinza, geleia.x, geleia.y, 24, 24);
            }
    }
  }

  mostrarEfeitos();

  // HUD
  fill(0);
  textSize(20);
  text(`Pontos: ${pontuacao}`, 80, 30);
  text(`Tempo: ${tempoRestante}s`, width - 100, 30);
}

function mostrarTelaFim() {
  background(venceu ? color("rgb(204,247,204)") : color("rgb(233,200,200)"));
  textSize(40);
  fill(venceu ? 'green' : 'red');
  text(venceu ? "Você venceu! 🎉" : "Fim de jogo 😢", width / 2, height / 2 - 40);
  desenharBotao("Reiniciar", width / 2 - 60, height / 2 + 10, 120, 40);
}

function keyPressed() {
  if (estado === "jogando" && key === ' ') {
    for (let geleia of geleias) {
      if (!geleia.coletada && dist(personagem.x, personagem.y, geleia.x, geleia.y) < 30) {
        geleia.coletada = true;
        if (geleia.tipo === "boa") {
          pontuacao += 1;
          criarEfeito("+1", geleia.x, geleia.y, color(0, 150, 0));
        } else {
          pontuacao -= 5;
          criarEfeito("-5", geleia.x, geleia.y, color(200, 0, 0));
        }
      }
    }
  }
}

function moverPersonagem() {
  const velocidade = 5;
  if (keyIsDown(LEFT_ARROW)) personagem.x -= velocidade;
  if (keyIsDown(RIGHT_ARROW)) personagem.x += velocidade;
  if (keyIsDown(UP_ARROW)) personagem.y -= velocidade;
  if (keyIsDown(DOWN_ARROW)) personagem.y += velocidade;

  personagem.x = constrain(personagem.x, 20, width - 20);
  personagem.y = constrain(personagem.y, 60, height - 20);
}

function gerarGeleias(qtd) {
  for (let i = 0; i < qtd; i++) {
    let tipo = random() < 0.8 ? "boa" : "podre";
    geleias.push({
      x: random(50, width - 50),
      y: random(100, height - 50),
      tipo: tipo,
      coletada: false
    });
  }
}

function criarEfeito(texto, x, y, cor) {
  efeitos.push({
    texto: texto,
    x: x,
    y: y,
    cor: cor,
    tempo: 60
  });
}

function mostrarEfeitos() {
  for (let i = efeitos.length - 1; i >= 0; i--) {
    let e = efeitos[i];
    fill(e.cor);
    textSize(20);
    text(e.texto, e.x, e.y);
    e.y -= 1;
    e.tempo--;
    if (e.tempo <= 0) efeitos.splice(i, 1);
  }
}

function desenharBotao(texto, x, y, largura, altura) {
  fill(255);
  stroke(0);
  rect(x, y, largura, altura, 10);
  fill(0);
  noStroke();
  textSize(20);
  text(texto, x + largura / 2, y + altura / 2);
}

function mousePressed() {
  if (estado === "inicio") {
    if (dentroDoBotao(mouseX, mouseY, width / 2 - 75, height / 2 + 40, 150, 50)) {
      iniciarJogo();
    } 
  } else if (estado === "fim") {
    if (dentroDoBotao(mouseX, mouseY, width / 2 - 60, height / 2 + 10, 120, 40)) {
      iniciarJogo();
    
  }
}
  else if (estado === "jogando") {
    gerarGeleias(10);
}
}

function dentroDoBotao(mx, my, x, y, largura, altura) {
  return mx > x && mx < x + largura && my > y && my < y + altura;
}

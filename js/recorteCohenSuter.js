let desenhaJanela = desenhaReta = recortaReta = false;

function setup() {
  select("#desenhar-janela").mousePressed(desenharJanelaTela);
  select("#desenhar-reta").mousePressed(desenharRetaTela);
  select("#recortar").mousePressed(recortarRetaTela);

  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  noLoop();
}

function draw() {
  novaTela();
  x1 = parseFloat(select("#reta_xa").value());
  y1 = parseFloat(select("#reta_ya").value());
  x2 = parseFloat(select("#reta_xb").value());
  y2 = parseFloat(select("#reta_yb").value());

  xRetangulo = Number(select("#retangulo_x").value());
  yRetangulo = Number(select("#retangulo_y").value());
  largura = Number(select("#retangulo_w").value());
  altura = Number(select("#retangulo_h").value());

  if (desenhaJanela) {
    desenharRetangulo(++xRetangulo, ++yRetangulo, ++largura, ++altura);
  }

  if (desenhaReta) {
    desenharReta(++x1, ++y1, ++x2, ++y2, 'ponto-medio' , '#00ff00');
  }

  if (recortaReta) {
    xmin = xRetangulo;
    ymin = yRetangulo;
    xmax = xRetangulo + largura;
    ymax = yRetangulo + altura;

    var resultado = cohenSutherland(x1,y1,x2,y2, xmin, ymin, xmax, ymax);
    if (resultado != null) {
      x1 = resultado[0];
      y1 = resultado[1];
      x2 = resultado[2];
      y2 = resultado[3];
      desenharReta(++x1, ++y1, ++x2, ++y2 , 'ponto-medio' , '#00ff00');
    }
  }

  updatePixels();
}

function desenharJanelaTela() {
  desenhaJanela = true;
  draw();
}

function desenharRetaTela() {
  desenhaReta = true;
  draw();
}

function recortarRetaTela() {
  desenhaReta = false;
  recortaReta = true;
  draw();
}

function limparTela() {
  desenhaReta = false;
  recortaReta = false;
  desenhaJanela = false;

  x1 = select("#reta_xa").value('');
  y1 = select("#reta_ya").value('');
  x2 = select("#reta_xb").value('');
  y2 = select("#reta_yb").value('');

  xRetangulo = select("#retangulo_x").value('');
  yRetangulo = select("#retangulo_y").value('');
  largura = select("#retangulo_w").value('');
  altura = select("#retangulo_h").value('');
  draw();
}

function setup(){ // setup do canvas
  let canvas = createCanvas(LARGURA,ALTURA);
  canvas.parent("#screen");
  select("#desenhar-janela").mousePressed(desenharJanelaTela);
  select("#desenhar-reta").mousePressed(desenharRetaTela);
  select("#recortar").mousePressed(recortarRetaTela);
  select("#limpar").mousePressed(limparTela);
  noLoop();
}
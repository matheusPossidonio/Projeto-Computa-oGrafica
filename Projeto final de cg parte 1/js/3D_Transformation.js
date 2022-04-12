let deixaRastro = false;
let pontosX = [],pontosY = [],pontosZ = [];
let desenha = false;
let transforma = false;

function draw() {
  x = parseFloat(document.getElementsByName('x-figura')[0].value)
  y = parseFloat(document.getElementsByName('y-figura')[0].value)
  z = parseFloat(document.getElementsByName('z-figura')[0].value)
  l = parseFloat(document.getElementsByName('largura')[0].value)
  c = parseFloat(document.getElementsByName('comprimento')[0].value)
  a = parseFloat(document.getElementsByName('altura')[0].value)

  deixaRastro = document.querySelector("#deixa-rastro").checked;
  pontosX = [x, x+c, x+c, x, x, x+c, x+c, x];
  pontosY = [y, y, y+l, y+l, y, y, y+l, y+l];
  pontosZ = [z, z, z, z, z+a, z+a, z+a, z+a];

  let matrizPontos = [pontosX, pontosY, pontosZ];
  let [angleX,angleY,angleZ] = getValuesFromQuery(['#slider-eixo-x','#slider-eixo-y','#slider-eixo-z']);
  rotationX = getMatrizRotacaoX(angleX);
  rotationY = getMatrizRotacaoY(angleY);
  rotationZ = getMatrizRotacaoZ(angleZ);

  novaTela3d();

  let resultado = [];
  if (desenha) {
    desenharQuadradoNaTela(matrizPontos);
  }
  
  if(opcao == "translacao") {
    let [tx,ty,tz] = getValuesFromQuery(['#tx','#ty','#tz']);
    resultado = translacao(matrizPontos, tx, ty, tz, "3d");
  } 
  else if (opcao == "escala") {
    sx = Number(document.querySelector("#sx").value);
    sy = Number(document.querySelector("#sy").value);
    sz = Number(document.querySelector("#sz").value);
    resultado = escala(matrizPontos, sx, sy, sz, "3d");
  } 
  
  else if (opcao == "reflexao") {
    planoRotacao = document.querySelector(
      'input[name="reflexao-plano"]:checked'
    ).value;

    if (planoRotacao == "plano-xy") {
      resultado = reflexaoXY(matrizPontos, "3d");
    } else if (planoRotacao == "plano-yz") {
      resultado = reflexaoYZ(matrizPontos, "3d");
    } else if (planoRotacao == "plano-xz") {
      resultado = reflexaoXZ(matrizPontos, "3d");
    }

  }

  else if(opcao === 'cisalhamento') {
    eixoCisalhamento = document.querySelector(
      'input[name="cisalhamento-eixo"]:checked'
    ).value;
    valorCisalhamento1 = Number(
      document.querySelector("#valorCisalhamento1").value)
      valorCisalhamento2 = Number(
        document.querySelector("#valorCisalhamento2").value)
        if (eixoCisalhamento == "eixo-x") {
          resultado = cisalhamentoX(matrizPontos, valorCisalhamento1, valorCisalhamento2,  "3d");
        } else if (eixoCisalhamento == "eixo-y") {
          resultado = cisalhamentoY(matrizPontos, valorCisalhamento1 , valorCisalhamento2, "3d");
        }
        else if (eixoCisalhamento == "eixo-z") {
          resultado = cisalhamentoZ(matrizPontos, valorCisalhamento1 , valorCisalhamento2, "3d");
        }

  }

  else if(opcao === 'rotacao') {
    sentido = document.querySelector(
      'input[name="rotacao-sentido"]:checked'
    ).value;
    graus = Number(document.querySelector("#grausRotacao").value);
      if(sentido == 'eixo-x') {
        resultado = rotacaoX(matrizPontos , graus)
      }

      else if(sentido == 'eixo-y') {
        resultado = rotacaoY(matrizPontos , graus)
      }

      else if(sentido == 'eixo-z') {
        resultado = rotacaoZ(matrizPontos , graus)
      }

  
  }

  if(!deixaRastro && transforma) {
    novaTela3d()
  }

  if(transforma) {
    desenharQuadradoNaTela(resultado , '#fff');
  }

  updatePixels();
}

function setValorSliders(nome , valor) {
  document.querySelector(nome).value = valor
}

function transformar() {
  let dropdown = document.querySelector("#transformacoes-select");
  opcao = dropdown[dropdown.selectedIndex].value;
  transforma = true;
  draw();
}

function desenhar() {
  setValorSliders('#slider-eixo-x',53)
  setValorSliders('#slider-eixo-y',51)
  setValorSliders('#slider-eixo-z',45)
  desenha = true;
  draw();
}

function limparTela() {
  desenha = false;
  transforma = false;
  draw();
}

function desenharQuadradoNaTela(quadrado, cor = "red") {
  let quadradoTransladadoProjecao = getProjecaoQuadrado(
    quadrado,
    rotationX,
    rotationY,
    rotationZ
  );
  formarQuadrado(quadradoTransladadoProjecao, cor);
}

function getProjecaoQuadrado(quadrado) {
  let quadradoProjetado;
  const projection = [[1, 0, 0],[0, 1, 0],[0, 0, 1],];
  let rotated = matmul(rotationY, quadrado);
  rotated = matmul(rotationX, rotated);
  rotated = matmul(rotationZ, rotated);
  let projected2d = matmul(projection, rotated);
  quadradoProjetado = projected2d;
  return quadradoProjetado;
}

function desenharQuadrado(quadradoProjetado, cor = "#red") {
  for (let i = 0; i < quadradoProjetado[0].length; i++) {
    stroke(255);
    noFill();
    desenharPixel(quadradoProjetado[0][i], quadradoProjetado[1][i], cor);
  }
}


function formarQuadrado(quadradoProjetado, cor = "#red") {
  desenharReta(
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    "dda",cor);

  desenharReta(
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    "dda",cor
  );
  desenharReta(
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    "dda",cor
  );
  desenharReta(
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    quadradoProjetado[0][0],quadradoProjetado[1][0],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    quadradoProjetado[0][1],quadradoProjetado[1][1],
    "dda",cor);

  desenharReta(
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][5],quadradoProjetado[1][5],
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    "dda",cor);
  desenharReta(
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    quadradoProjetado[0][4],quadradoProjetado[1][4],
    "dda",cor
  );

  desenharReta(
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    "dda",cor
  );
  desenharReta(
    quadradoProjetado[0][3],quadradoProjetado[1][3],
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    "dda",cor
  );
  desenharReta(
    quadradoProjetado[0][7],quadradoProjetado[1][7],
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    "dda",cor
  );
  desenharReta(
    quadradoProjetado[0][6],quadradoProjetado[1][6],
    quadradoProjetado[0][2],quadradoProjetado[1][2],
    "dda",cor
  );
}


function getPontos(nome) {
  let input = document.getElementsByName(nome);
  let pontos = [];

  for (let i = 0; i < input.length; i++) {
    let a = input[i];
    let k = Number(a.value);
    pontos.push(k);
  }

  return pontos;
}

function setValorX(nome, i, valor) {
  let input = document.getElementsByName(nome)[i].setAttribute("value", "oi");
}

function novaTela3d() {
  clear();
  const projecao = [[1, 0, 0],[0, 1, 0],[0, 0, 1]];

  background(0);
  let linhaEixo = [];
  linhaEixo[0] = createVector(-LARGURA / 2, 0, 0);
  linhaEixo[1] = createVector(LARGURA / 2, 0, 0);
  linhaEixo[2] = createVector(0, -LARGURA / 2, 0);
  linhaEixo[3] = createVector(0, LARGURA / 2, 0);
  linhaEixo[4] = createVector(0, 0, -LARGURA / 2);
  linhaEixo[5] = createVector(0, 0, LARGURA / 2);

  loadPixels();
  pixels = [];

  let linhaProjetada = [];
  for (let i = 0; i < linhaEixo.length; i++) {
    let rotated = matmul(rotationY, linhaEixo[i]);
    rotated = matmul(rotationX, rotated);
    rotated = matmul(rotationZ, rotated);
    let projected2d = matmul(projecao, rotated);
    linhaProjetada[i] = projected2d;
  }

  connectLinha(0, 1, linhaProjetada, "#00cc00");
  connectLinha(2, 3, linhaProjetada, "#0099ff");
  connectLinha(4, 5, linhaProjetada, "#ffff99");

  updatePixels();
}

function connectLinha(i, j, points, cor) {
  const a = points[i];
  const b = points[j];
  strokeWeight(1);
  stroke(cor);
  desenharReta(a.x, a.y, b.x, b.y, "ponto-medio", cor);
}

function vecToMatrix(v) {
  let m = [];
  for (let i = 0; i < 3; i++) {
    m[i] = [];
  }
  m[0][0] = v.x;
  m[1][0] = v.y;
  m[2][0] = v.z;
  return m;
}

function matrixToVec(m) {
  return createVector(m[0][0], m[1][0], m.length > 2 ? m[2][0] : 0);
}

function logMatrix(m) {
  const cols = m[0].length;
  const rows = m.length;
  let s = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      s += m[i][j] + " ";
    }
  }
}

function matmulvec(a, vec) {
  let m = vecToMatrix(vec);
  let r = matmul(a, m);
  return matrixToVec(r);
}

function matmul(a, b) {
  if(b instanceof p5.Vector) {
    return matmulvec(a, b);
  }

  let colsA = a[0].length, rowsA = a.length, colsB = b[0].length, rowsB = b.length;

  if(colsA !== rowsB) {
    return null;
  }

  result = [];
  for(let j = 0; j < rowsA; j++) {
    result[j] = [];
    for(let i = 0; i < colsB; i++) {
      let sum = 0;
      for(let n = 0; n < colsA; n++) {
        sum += a[j][n] * b[n][i];
      }
      result[j][i] = sum;
    }
  }
  return result;
}

function getMatrizRotacaoX(angle) {
  return (rotationX = [[1, 0, 0], [0, cos(angle), -sin(angle)],[0, sin(angle), cos(angle)]]);
}

function getMatrizRotacaoY(angle) {
  return (rotationY = [[cos(angle), 0, sin(angle)],[0, 1, 0],[-sin(angle), 0, cos(angle)]]);
}

function getMatrizRotacaoZ(angle) {
  return (rotationZ = [[cos(angle),-sin(angle),0], [sin(angle), cos(angle), 0], [0, 0, 1]]);
}

/* Configuracoes do HTML */

function setup() {
  let canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");

  setValorSliders('#slider-eixo-x',53)
  setValorSliders('#slider-eixo-y',51)
  setValorSliders('#slider-eixo-z',45)

  select("#transformar").mousePressed(transformar);
  select("#desenhar-figura").mousePressed(desenhar);
  select('#limpar').mousePressed(limparTela)
  opcao = "vazio";
}

function removerCampo3d() {
  let linha = document.querySelector("#pontos-figura");
  let elementoRemover = linha.lastChild;
  linha.removeChild(elementoRemover);
}

function adicionarCampo3d() {
  let container = document.querySelector("#pontos-figura");

  let linha = document.createElement("div");
  linha.setAttribute("class", "row");

  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  let coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");

  let novoCampoX = document.createElement("input");
  novoCampoX.setAttribute("name", "x-figura[]");
  novoCampoX.setAttribute("class", "form-control");
  novoCampoX.setAttribute("type", "text");
  novoCampoX.setAttribute("placeholder", "X do ponto");

  let novoCampoY = document.createElement("input");
  novoCampoY.setAttribute("name", "y-figura[]");
  novoCampoY.setAttribute("class", "form-control");
  novoCampoY.setAttribute("type", "text");
  novoCampoY.setAttribute("placeholder", "Y do ponto");

  let novoCampoZ = document.createElement("input");
  novoCampoZ.setAttribute("name", "z-figura[]");
  novoCampoZ.setAttribute("class", "form-control");
  novoCampoZ.setAttribute("type", "text");
  novoCampoZ.setAttribute("placeholder", "Z do ponto");

  coluna1.appendChild(novoCampoX);
  coluna2.appendChild(novoCampoY);
  coluna3.appendChild(novoCampoZ);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  linha.appendChild(coluna3);

  container.appendChild(linha);
}

function limparOpcoes(opcoes) {
  while (opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }
}

function mudarOpcoes3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  while (opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }

  if (s == "rotacao") {
    rotacaoOpcoesComponent3d();
  } else if (s == "translacao") {
    translacaoOpcoesComponent3d();
  } else if (s == "escala") {
    escalaOpcoesComponente3d();
  } else if (s == "cisalhamento") {
    cisalhamentoOpcoesComponent3d();
  } else if (s == "reflexao") {
    reflexaoOpcoesComponent3d();
  }
}

function rotacaoOpcoesComponent3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");

  limparOpcoes(opcoes);

  let linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  let coluna1 = document.createElement("div"); 
  coluna1.setAttribute("class", "col");

  let linha2 = document.createElement("div");
  linha2.setAttribute("class", "row");
  let coluna2 = document.createElement("div"); 
  coluna2.setAttribute("class", "col");

  let grausInput = document.createElement("input");
  grausInput.setAttribute("placeholder", "Diga quantos graus");
  grausInput.setAttribute("id", "grausRotacao");
  grausInput.setAttribute("class", "form-control");

  let eixoX = document.createElement("input");
  eixoX.setAttribute("type", "radio");
  eixoX.setAttribute("name", "rotacao-sentido");
  eixoX.setAttribute("value", "eixo-x");
  eixoX.setAttribute("id", "eixo-x");
  eixoX.setAttribute("class", "mx-2");

  let eixoY = document.createElement("input");
  eixoY.setAttribute("type", "radio");
  eixoY.setAttribute("name", "rotacao-sentido");
  eixoY.setAttribute("value", "eixo-y");
  eixoY.setAttribute("id", "eixo-y");
  eixoY.setAttribute("class", "mx-2");

  let eixoZ = document.createElement("input");
  eixoZ.setAttribute("type", "radio");
  eixoZ.setAttribute("name", "rotacao-sentido");
  eixoZ.setAttribute("value", "eixo-z");
  eixoZ.setAttribute("id", "eixo-z");
  eixoZ.setAttribute("class", "mx-2");

  let labelEixoX = document.createElement("label");
  labelEixoX.textContent = "Eixo X";
  labelEixoX.setAttribute("for", "eixo-x");

  let labelEixoY = document.createElement("label");
  labelEixoY.textContent = "Eixo Y";
  labelEixoY.setAttribute("for", "eixo-y");

  let labelEixoZ = document.createElement("label");
  labelEixoZ.textContent = "Eixo Z";
  labelEixoZ.setAttribute("for", "eixo-Z");

  coluna1.appendChild(grausInput);
  coluna2.appendChild(eixoX);
  coluna2.appendChild(labelEixoX);
  coluna2.appendChild(eixoY);
  coluna2.appendChild(labelEixoY);
  coluna2.appendChild(eixoZ);
  coluna2.appendChild(labelEixoZ);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function translacaoOpcoesComponent3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  let linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  let coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");

  let tx = document.createElement("input");
  tx.setAttribute("placeholder", "Diga TX");
  tx.setAttribute("id", "tx");
  tx.setAttribute("class", "form-control");

  let ty = document.createElement("input");
  ty.setAttribute("placeholder", "Diga TY");
  ty.setAttribute("id", "ty");
  ty.setAttribute("class", "form-control");

  let tz = document.createElement("input");
  tz.setAttribute("placeholder", "Diga TZ");
  tz.setAttribute("id", "tz");
  tz.setAttribute("class", "form-control");

  coluna1.appendChild(tx);
  coluna2.appendChild(ty);
  coluna3.appendChild(tz);

  linha1.appendChild(coluna1);
  linha1.appendChild(coluna2);
  linha1.appendChild(coluna3);

  opcoes.appendChild(linha1);
}

function escalaOpcoesComponente3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  let linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  let coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");

  let sx = document.createElement("input");
  sx.setAttribute("placeholder", "Diga SX");
  sx.setAttribute("id", "sx");
  sx.setAttribute("class", "form-control");

  let sy = document.createElement("input");
  sy.setAttribute("placeholder", "Diga SY");
  sy.setAttribute("id", "sy");
  sy.setAttribute("class", "form-control");

  let sz = document.createElement("input");
  sz.setAttribute("placeholder", "Diga SX");
  sz.setAttribute("id", "sz");
  sz.setAttribute("class", "form-control");

  coluna1.appendChild(sx);
  coluna2.appendChild(sy);
  coluna3.appendChild(sz);

  linha1.appendChild(coluna1);
  linha1.appendChild(coluna2);
  linha1.appendChild(coluna3);

  opcoes.appendChild(linha1);
}

function cisalhamentoOpcoesComponent3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  let linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  let linha2 = document.createElement("div");
  linha2.setAttribute("class", "row");
  let coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");

  let valorCisalhamento1 = document.createElement("input");
  valorCisalhamento1.setAttribute("placeholder", "Diga valor cisalhamento 1");
  valorCisalhamento1.setAttribute("id", "valorCisalhamento1");
  valorCisalhamento1.setAttribute("class", "form-control");
  
  let valorCisalhamento2 = document.createElement("input");
  valorCisalhamento2.setAttribute("placeholder", "Diga valor cisalhamento 2");
  valorCisalhamento2.setAttribute("id", "valorCisalhamento2");
  valorCisalhamento2.setAttribute("class", "form-control");

  let eixoX = document.createElement("input");
  eixoX.setAttribute("type", "radio");
  eixoX.setAttribute("name", "cisalhamento-eixo");
  eixoX.setAttribute("value", "eixo-x");
  eixoX.setAttribute("id", "cisalhamento-eixo-x");
  eixoX.setAttribute("class", "mx-2");

  let eixoY = document.createElement("input");
  eixoY.setAttribute("type", "radio");
  eixoY.setAttribute("name", "cisalhamento-eixo");
  eixoY.setAttribute("value", "eixo-y");
  eixoY.setAttribute("id", "cisalhamento-eixo-y");
  eixoY.setAttribute("class", "mx-2");

  let eixoZ = document.createElement("input");
  eixoZ.setAttribute("type", "radio");
  eixoZ.setAttribute("name", "cisalhamento-eixo");
  eixoZ.setAttribute("value", "eixo-z");
  eixoZ.setAttribute("id", "cisalhamento-eixo-z");
  eixoZ.setAttribute("class", "mx-2");

  let labelX = document.createElement("label");
  labelX.textContent = "Eixo X";
  labelX.setAttribute("for", "cisalhamento-eixo-x");

  let labelY = document.createElement("label");
  labelY.setAttribute("for", "cisalhamento-eixo-y");
  labelY.textContent = "Eixo Y";

  let labelZ = document.createElement("label");
  labelZ.setAttribute("for", "cisalhamento-eixo-z");
  labelZ.textContent = "Eixo Z";

  coluna1.appendChild(valorCisalhamento1);
  coluna2.appendChild(valorCisalhamento2);
  coluna3.appendChild(eixoX);
  coluna3.appendChild(labelX);
  coluna3.appendChild(eixoY);
  coluna3.appendChild(labelY);
  coluna3.appendChild(eixoZ);
  coluna3.appendChild(labelZ);

  linha1.appendChild(coluna1);
  linha1.appendChild(coluna2);
  linha2.appendChild(coluna3);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function reflexaoOpcoesComponent3d() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  let linha = document.createElement("div");
  linha.setAttribute("class", "row");

  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");

  let planoXY = document.createElement("input");
  planoXY.setAttribute("type", "radio");
  planoXY.setAttribute("name", "reflexao-plano");
  planoXY.setAttribute("value", "plano-xy");
  planoXY.setAttribute("id", "reflexao-plano-xy");
  planoXY.setAttribute("class", "mx-2");


  let planoYZ = document.createElement("input");
  planoYZ.setAttribute("type", "radio");
  planoYZ.setAttribute("name", "reflexao-plano");
  planoYZ.setAttribute("value", "plano-yz");
  planoYZ.setAttribute("id", "relexao-plano-yz");
  planoYZ.setAttribute("class", "mx-2");

  let planoXZ = document.createElement("input");
  planoXZ.setAttribute("type", "radio");
  planoXZ.setAttribute("name", "reflexao-plano");
  planoXZ.setAttribute("value", "plano-xz");
  planoXZ.setAttribute("id", "reflexao-plano-xz");
  planoXZ.setAttribute("class", "mx-2");

  let labelXY = document.createElement("label");
  labelXY.textContent = "Plano XY ";
  labelXY.setAttribute("for", "reflexao-plano-xy");

  let labelYZ = document.createElement("label");
  labelYZ.textContent = "Plano YZ  ";
  labelYZ.setAttribute("for", "reflexao-plano-yz");

  let labelXZ = document.createElement("label");
  labelXZ.textContent = "Plano XZ  ";
  labelXZ.setAttribute("for", "reflexao-plano-yz");

  coluna1.appendChild(planoXY);
  coluna1.appendChild(labelXY);
  coluna1.appendChild(planoYZ);
  coluna1.appendChild(labelYZ);
  coluna1.appendChild(planoXZ);
  coluna1.appendChild(labelXZ);

  linha.appendChild(coluna1);

  opcoes.appendChild(linha);
}

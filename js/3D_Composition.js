/* Composição Transformações 2D */

let deixaRastro = desenha = transforma = false;
let pontosX = [], pontosY = [], pontosZ = [];

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

    let [angleX,angleY,angleZ] = getValuesFromQuery(['#slider-eixo-x','#slider-eixo-y','#slider-eixo-z']);

    let matrizPonto = [pontosX, pontosY,pontosZ];
    let resultado = [pontosX, pontosY,pontosZ];
    transformacoes = getValores("transformacoes[]");
    valores1 = getValores("valor1-transformacoes[]");
    valores2 = getValores("valor2-transformacoes[]");
    valores3 = getValores("valor3-transformacoes[]");
  
    rotationX = getMatrizRotacaoX(angleX);
    rotationY = getMatrizRotacaoY(angleY);
    rotationZ = getMatrizRotacaoZ(angleZ);
    novaTela3d();
  

    if(transforma) {
        for (let i = 0; i < transformacoes.length; i++) {
            let t = transformacoes[i].toLowerCase();
      
            if (t == "escala") {
              sx = Number(valores1[i]);
              sy = Number(valores2[i]);
              sz = Number(valores3[i]);
              resultado = escala(resultado, sx, sy, sz, "3d");
            } 
            
            else if (t == "translacao") {
              tx = Number(valores1[i]);
              ty = Number(valores2[i]);
              tz = Number(valores3[i]);
              resultado = translacao(resultado, tx, ty, tz, "3d");
            } 
            
            else if (t == "rotacao") {
              graus = Number(valores1[i]);
              sentido = valores2[i];
      
              if (sentido == "x") {
                resultado  = rotacaoX(resultado , graus)
              } else if (sentido == "y") {
                resultado = rotacaoY(resultado , graus)
              }
              else if (sentido == "z") {
                resultado = rotacaoZ(resultado , graus)
              }
            } 
            
            else if (t == "cisalhamento") {
              valorCisalhamento1 = Number(valores1[i]);
              valorCisalhamento2 = Number(valores2[i]);
              eixoCisalhamento = valores3[i];
      
              if (eixoCisalhamento == "x") {
                resultado = cisalhamentoX(resultado, valorCisalhamento1, valorCisalhamento2, "3d");
              } else if (eixoCisalhamento == "y") {
                resultado = cisalhamentoY(resultado, valorCisalhamento1, valorCisalhamento2, "3d");
              }
              else if (eixoCisalhamento == "z") {
                resultado = cisalhamentoZ(resultado, valorCisalhamento1, valorCisalhamento2, "3d");
              }
            } 
            
            else if (t == "reflexao") {
              planoRotacao = valores1[i];
              if (planoRotacao == "xy") {
                resultado = reflexaoXY(resultado, "3d");
              } else if (planoRotacao == "yz") {
                resultado = reflexaoYZ(resultado, "3d");
              } else if (planoRotacao == "xz") {
                resultado = reflexaoXZ(resultado, "3d");
              }
            }
          }
    }


    if (desenha) {
      desenharQuadradoNaTela(matrizPonto);
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
    transforma = true;
    draw();
  }
  
  function desenhar() {
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
    const projection = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
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
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      "dda",
      cor
    );
  
    desenharReta(
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      "dda",
      cor
    );
  
    desenharReta(
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      quadradoProjetado[0][0],
      quadradoProjetado[1][0],
      "dda",
      cor
    );
  
    desenharReta(
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      quadradoProjetado[0][1],
      quadradoProjetado[1][1],
      "dda",
      cor
    );
  
    desenharReta(
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][5],
      quadradoProjetado[1][5],
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      quadradoProjetado[0][4],
      quadradoProjetado[1][4],
      "dda",
      cor
    );
  
    desenharReta(
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][3],
      quadradoProjetado[1][3],
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][7],
      quadradoProjetado[1][7],
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      "dda",
      cor
    );
    desenharReta(
      quadradoProjetado[0][6],
      quadradoProjetado[1][6],
      quadradoProjetado[0][2],
      quadradoProjetado[1][2],
      "dda",
      cor
    );
  }

function setup() {
  let canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  select("#transformar").mousePressed(transformar);
  select("#desenhar-figura").mousePressed(desenhar);
  select('#limpar').mousePressed(limparTela);
  opcao = "vazio";
  setValorSliders('#slider-eixo-x',53)
  setValorSliders('#slider-eixo-y',51)
  setValorSliders('#slider-eixo-z',45)
}


function setValorX(nome, i, valor) {
    let input = document.getElementsByName(nome)[i].setAttribute("value", "oi");
  }
  
  function novaTela3d() {
    clear();
  
    const projecao = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  
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
    console.log(rows + "x" + cols);
    console.log("----------------");
    let s = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        s += m[i][j] + " ";
      }
      console.log(s);
    }
    console.log();
  }
  
  function matmulvec(a, vec) {
    let m = vecToMatrix(vec);
    let r = matmul(a, m);
    return matrixToVec(r);
  }
  
  function matmul(a, b) {
    if (b instanceof p5.Vector) {
      return matmulvec(a, b);
    }
  
    let colsA = a[0].length;
    let rowsA = a.length;
    let colsB = b[0].length;
    let rowsB = b.length;
  
    if (colsA !== rowsB) {
      return null;
    }
  
    result = [];
    for (let j = 0; j < rowsA; j++) {
      result[j] = [];
      for (let i = 0; i < colsB; i++) {
        let sum = 0;
        for (let n = 0; n < colsA; n++) {
          sum += a[j][n] * b[n][i];
        }
        result[j][i] = sum;
      }
    }
    return result;
  }
  
  function getMatrizRotacaoX(angle) {
    return (rotationX = [
      [1, 0, 0],
      [0, cos(angle), -sin(angle)],
      [0, sin(angle), cos(angle)],
    ]);
  }
  
  function getMatrizRotacaoY(angle) {
    return (rotationY = [
      [cos(angle), 0, sin(angle)],
      [0, 1, 0],
      [-sin(angle), 0, cos(angle)],
    ]);
  }
  
  function getMatrizRotacaoZ(angle) {
    return (rotationZ = [
      [cos(angle), -sin(angle), 0],
      [sin(angle), cos(angle), 0],
      [0, 0, 1],
    ]);
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

function getValores(nome) {
  let input = document.getElementsByName(nome);
  let pontos = [];

  for (let i = 0; i < input.length; i++) {
    let a = input[i];
    let k = a.value;
    pontos.push(k);
  }

  return pontos;
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

function removerCampoTransformacao() {
  let linha = document.querySelector("#opcoes-transformacao");
  let elementoRemover = linha.lastChild;
  linha.removeChild(elementoRemover);
}

function adicionarCampoTransformacao() {
  let container = document.querySelector("#opcoes-transformacao");

  let linha = document.createElement("div");
  linha.setAttribute("class", "row");

  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  let coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");
  let coluna4 = document.createElement("div");
  coluna4.setAttribute("class", "col");

  let novoCampoTransformacao = document.createElement("input");
  novoCampoTransformacao.setAttribute("name", "transformacoes[]");
  novoCampoTransformacao.setAttribute("class", "form-control");
  novoCampoTransformacao.setAttribute("type", "text");
  novoCampoTransformacao.setAttribute("placeholder", "Transformacao");

  let novoCampo1 = document.createElement("input");
  novoCampo1.setAttribute("name", "valor1-transformacoes[]");
  novoCampo1.setAttribute("class", "form-control");
  novoCampo1.setAttribute("type", "text");
  novoCampo1.setAttribute("placeholder", "Valor 1");

  let novoCampo2 = document.createElement("input");
  novoCampo2.setAttribute("name", "valor2-transformacoes[]");
  novoCampo2.setAttribute("class", "form-control");
  novoCampo2.setAttribute("type", "text");
  novoCampo2.setAttribute("placeholder", "Valor 2");

  let novoCampo3 = document.createElement("input");
  novoCampo3.setAttribute("name", "valor3-transformacoes[]");
  novoCampo3.setAttribute("class", "form-control");
  novoCampo3.setAttribute("type", "text");
  novoCampo3.setAttribute("placeholder", "Valor 3");

  coluna1.appendChild(novoCampoTransformacao);
  coluna2.appendChild(novoCampo1);
  coluna3.appendChild(novoCampo2);
  coluna4.appendChild(novoCampo3);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  linha.appendChild(coluna3);
  linha.appendChild(coluna4);

  container.appendChild(linha);
}

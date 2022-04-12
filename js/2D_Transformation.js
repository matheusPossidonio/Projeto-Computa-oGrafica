let desenha = false;
let pontosX = [], pontosY;
let deixaRastro = false;
let sentido = null;
let transforma = false

function aplicarTransformacoes() {
  novaTela();

  deixaRastro = document.querySelector("#deixa-rastro").checked;
  pontosX = getPontos("x-figura[]");
  pontosY = getPontos("y-figura[]");
  let resultado = [], matrizPonto = [pontosX,pontosY];

  if(desenha) // escolheu desenhar figura
    desenharFigura([pontosX,pontosY]);

  if(opcao == "escala"){ // aplica a transformacao escala
    let [sx,sy] = getValuesFromQuery(["#sx","#sy"]);
    resultado = escala(matrizPonto,sx,sy,0,"2d");

  } else if(opcao == "translacao"){// aplica a transformacao translacao
    let [tx,ty] = getValuesFromQuery(["#tx","#ty"]);
    resultado = translacao(matrizPonto,tx,ty,0,'2d');

  } else if(opcao=="rotacao") { // aplica a transformacao rotacao
    sentido = document.querySelector('input[name="rotacao-sentido"]:checked').value;
    let graus = parseInt(document.getElementById("grausRotacao").value);
    
    // rotaciona no sentido horario ou antihorario
    if(sentido=="horario")
      resultado = rotacaoHoraria(matrizPonto,graus*-1,"2d");
    else if(sentido=="antiHorario")
      resultado = rotacaoAntiHoraria(matrizPonto,graus*-1,"2d");

  } else if(opcao == "cisalhamento") {
    let eixoCisalhamento = document.querySelector('input[name="cisalhamento-eixo"]:checked').value;
    let valorCisalhamento = parseInt(document.getElementById("valorCisalhamento").value);

    if(eixoCisalhamento == "eixo-x")
      resultado = cisalhamentoX(matrizPonto,valorCisalhamento,0,"2d");
    else if(eixoCisalhamento == "eixo-y")
      resultado = cisalhamentoY(matrizPonto,0,valorCisalhamento,"2d");

  } else if (opcao == "reflexao") {
    let eixoRotacao = document.querySelector('input[name="reflexao-eixo"]:checked').value;

    if(eixoRotacao == "eixo-x") // aplica a reflexao no eixo X
       resultado = reflexaoX(matrizPonto, "2d");
    else if (eixoRotacao == "eixo-y") // aplica a reflexao no eixo Y
      resultado = reflexaoY(matrizPonto, "2d");
    else if (eixoRotacao == "eixo-reta"){ // aplica a reflexao no eixo da reta
      let [mReta,bReta] = getValuesFromQuery("#mReta,#bReta");

      let complemento = Array(pontosX.length).fill(0)
      let matrizPonto = [pontosX,pontosY,complemento];
      desenharReta(-300, mReta*-300+bReta, 300, mReta*300+bReta,'ponto-medio','#ffff00');
      resultado = reflexaoReta(matrizPonto, mReta, bReta);
    }
  }

  if(!deixaRastro && transforma)
    novaTela()
  if(transforma)
    desenharFigura(resultado,'yellow');

  background(0);
  updatePixels();
  transforma = false
}
draw = () => {
  aplicarTransformacoes();
}

function desenhar() {
  desenha = true;
  aplicarTransformacoes();
}

function limparTela() {
  desenha = transforma = false
  aplicarTransformacoes()
}

function transformar() {
  let dropdown = document.querySelector("#transformacoes-select");
  opcao = dropdown[dropdown.selectedIndex].value;
  transforma = true;
  aplicarTransformacoes();
}

function getPontos(nome) {
  let input = document.getElementsByName(nome);
  let pontos = [];

  for(let i=0; i < input.length; i++) {
    pontos.push(Number(input[i].value));
  }
  return pontos;
}

function mudarOpcoes(){ 
  let dropdown = document.querySelector("#transformacoes-select");
  let escolhida = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  while(opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }

  switch(escolhida){
    case "rotacao": rotacaoOpcoesComponent(); break
    case "translacao": translacaoOpcoesComponent(); break
    case "escala": escalaOpcoesComponente(); break
    case "cisalhamento": cisalhamentoOpcoesComponent(); break
    case "reflexao": reflexaoOpcoesComponent(); break
  }
}

function setup(){ // configuracao inicial do canvas
  let canvas = createCanvas(LARGURA,ALTURA);
  canvas.parent("#screen");
  select("#transformar").mousePressed(transformar);
  select("#desenhar-figura").mousePressed(desenhar);
  select('#limpar').mousePressed(limparTela)
  opcao = 'vazio';
  noLoop();
}


/* configuracoes do HTML: */

function limparOpcoes(opcoes){ // limpa o campo de opcoes 
  while (opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }
}
function rotacaoOpcoesComponent() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");

  limparOpcoes(opcoes);

  let linha1 = document.createElement("div");
  linha1.setAttribute("class","row");
  let coluna1 = document.createElement("div"); 
  coluna1.setAttribute("class","col");

  let linha2 = document.createElement("div");
  linha2.setAttribute("class","row");
  let coluna2 = document.createElement("div"); 
  coluna2.setAttribute("class","col");

  let grausInput = document.createElement("input");
  grausInput.setAttribute("placeholder", "Diga quantos graus");
  grausInput.setAttribute("id", "grausRotacao");
  grausInput.setAttribute("class", "form-control");

  let radioHorario = document.createElement("input");
  radioHorario.setAttribute("type", "radio");
  radioHorario.setAttribute("name", "rotacao-sentido");
  radioHorario.setAttribute("value", "horario");
  radioHorario.setAttribute("id", "horario");
  radioHorario.setAttribute("class", "mx-2");

  let radioAntiHorario = document.createElement("input");
  radioAntiHorario.setAttribute("type", "radio");
  radioAntiHorario.setAttribute("name", "rotacao-sentido");
  radioAntiHorario.setAttribute("value", "antiHorario");
  radioAntiHorario.setAttribute("id", "horario");
  radioAntiHorario.setAttribute("class", "mx-2");

  let labelHorario = document.createElement("label");
  labelHorario.textContent = "horario";
  labelHorario.setAttribute("for", "horario");

  let labelAntiHorario = document.createElement("label");
  labelAntiHorario.setAttribute("for", "antiHorario");
  labelAntiHorario.textContent = "Anti-horario";

  coluna1.appendChild(grausInput);
  coluna2.appendChild(radioHorario);
  coluna2.appendChild(labelHorario);
  coluna2.appendChild(radioAntiHorario);
  coluna2.appendChild(labelAntiHorario);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function translacaoOpcoesComponent() {
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

  let tx = document.createElement("input");
  tx.setAttribute("placeholder", "Diga TX");
  tx.setAttribute("id", "tx");
  tx.setAttribute("class", "form-control");

  let ty = document.createElement("input");
  ty.setAttribute("placeholder", "Diga TY");
  ty.setAttribute("id", "ty");
  ty.setAttribute("class", "form-control");

  coluna1.appendChild(tx);
  coluna2.appendChild(ty);

  linha1.appendChild(coluna1);
  linha1.appendChild(coluna2);

  opcoes.appendChild(linha1);
}

function escalaOpcoesComponente() {
  let dropdown = document.querySelector("#transformacoes-select");
  let s = dropdown[dropdown.selectedIndex].value;
  let opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  let linha = document.createElement("div");
  linha.setAttribute("class", "row");
  let coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  let coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");

  let sx = document.createElement("input");
  sx.setAttribute("placeholder", "Diga SX");
  sx.setAttribute("id", "sx");
  sx.setAttribute("class", "form-control");

  let sy = document.createElement("input");
  sy.setAttribute("placeholder", "Diga SY");
  sy.setAttribute("id", "sy");
  sy.setAttribute("class", "form-control");

  coluna1.appendChild(sx);
  coluna2.appendChild(sy);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);

  opcoes.appendChild(linha);
}

function cisalhamentoOpcoesComponent() {
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

  let valorCisalhamento = document.createElement("input");
  valorCisalhamento.setAttribute("placeholder", "Diga valor cisalhamento");
  valorCisalhamento.setAttribute("id", "valorCisalhamento");
  valorCisalhamento.setAttribute("class", "form-control");

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

  let labelX = document.createElement("label");
  labelX.textContent = "Eixo X";
  labelX.setAttribute("for", "cisalhamento-eixo-x");

  let labelY = document.createElement("label");
  labelY.setAttribute("for", "cisalhamento-eixo-y");
  labelY.textContent = "Eixo Y";

  coluna1.appendChild(valorCisalhamento);
  coluna2.appendChild(eixoX);
  coluna2.appendChild(labelX);
  coluna2.appendChild(eixoY);
  coluna2.appendChild(labelY);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function reflexaoOpcoesComponent() {
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

  let eixoX = document.createElement("input");
  eixoX.setAttribute("type", "radio");
  eixoX.setAttribute("name", "reflexao-eixo");
  eixoX.setAttribute("value", "eixo-x");
  eixoX.setAttribute("id", "reflexao-eixo-x");
  eixoX.setAttribute('class', 'mx-2')

  let eixoY = document.createElement("input");
  eixoY.setAttribute("type", "radio");
  eixoY.setAttribute("name", "reflexao-eixo");
  eixoY.setAttribute("value", "eixo-y");
  eixoY.setAttribute("id", "relexao-eixo-y");
  eixoY.setAttribute('class', 'mx-2')

  let reta = document.createElement("input");
  reta.setAttribute("type", "radio");
  reta.setAttribute("name", "reflexao-eixo");
  reta.setAttribute("value", "eixo-reta");
  reta.setAttribute("id", "reflexao-eixo-reta");
  reta.setAttribute('class', 'mx-2')

  let mReta = document.createElement("input");
  mReta.setAttribute("placeholder", "Diga M da reta");
  mReta.setAttribute("id", "mReta");
  mReta.setAttribute("class", "form-control");

  let bReta = document.createElement("input");
  bReta.setAttribute("placeholder", "Diga B da reta");
  bReta.setAttribute("id", "bReta");
  bReta.setAttribute("class", "form-control");

  let labelX = document.createElement("label");
  labelX.textContent = "Eixo X";
  labelX.setAttribute("for", "reflexao-eixo-x");

  let labelY = document.createElement("label");
  labelY.setAttribute("for", "reflexao-eixo-y");
  labelY.textContent = "Eixo Y";

  let labelReta = document.createElement("label");
  labelReta.setAttribute("for", "reflexao-eixo-reta");
  labelReta.textContent = "Reta";

  coluna1.appendChild(eixoX);
  coluna1.appendChild(labelX);
  coluna1.appendChild(eixoY);
  coluna1.appendChild(labelY);
  coluna1.appendChild(reta);
  coluna1.appendChild(labelReta);
  coluna2.appendChild(mReta);
  coluna3.appendChild(bReta);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);
  linha2.appendChild(coluna3);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function removerCampo() {
  let linha = document.querySelector('#pontos-figura')
  let elementoRemover = linha.lastChild
  linha.removeChild(elementoRemover)
}

function adicionarCampo() {
  let container = document.querySelector('#pontos-figura')

  let linha = document.createElement('div')
  linha.setAttribute('class', 'row my-1 ')

  let coluna1 = document.createElement('div')
  coluna1.setAttribute('class', 'col')
  let coluna2 = document.createElement('div')
  coluna2.setAttribute('class', 'col')

  let novoCampoX = document.createElement('input')
  novoCampoX.setAttribute('name', 'x-figura[]')
  novoCampoX.setAttribute('class', 'form-control')
  novoCampoX.setAttribute('type', 'text')
  novoCampoX.setAttribute('placeholder', 'X do ponto')

  let novoCampoY = document.createElement('input')
  novoCampoY.setAttribute('name', 'y-figura[]')
  novoCampoY.setAttribute('class', 'form-control')
  novoCampoY.setAttribute('type', 'text')
  novoCampoY.setAttribute('placeholder', 'Y do ponto')

  coluna1.appendChild(novoCampoX)
  coluna2.appendChild(novoCampoY)

  linha.appendChild(coluna1)
  linha.appendChild(coluna2)

  container.appendChild(linha)

}
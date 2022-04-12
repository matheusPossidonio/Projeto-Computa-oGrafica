function setup(){
  // configuracao inicial canvas
  setupBasico();
  document.querySelector('#testar').onclick = ()=>exibirOitantes();
}

function calcularPontosOitante(x,xOrigem,y,yOrigem){
  // retornar os oitantes
  const oitantes = [
    [x+xOrigem, y+yOrigem], [-x+xOrigem, y+yOrigem],
    [x+xOrigem, -y+yOrigem], [-x+xOrigem, -y+yOrigem],
    [y+xOrigem, x+yOrigem], [-y+xOrigem, x+yOrigem],
    [y+xOrigem, -x+yOrigem], [-y+xOrigem, -x+yOrigem]
  ];
  return oitantes;
}

// Desenhar Reta na tela
function drawReta(x1,y1,x2,y2,metodo,cor="red") {
  let retaAlgoritmo = null;

  if(metodo=="ponto-medio")
    retaAlgoritmo = getRetaPontoMedio;
  else
    retaAlgoritmo = getRetaDDA;

  let retaPontos = retaAlgoritmo(++x1,++y1,++x2,++y2);
  retaPontos.map(ponto => desenharPixel(ponto[0],ponto[1],cor));
}

function desenharForma(desenhar){
  // Desenhar uma reta com os valores e metodo especificado
  if(!desenhar) // apenas limpa o canvas, nao desenha a reta
    return novaTela();
  let [x1,y1,x2,y2,metodo,cor] = getValuesFromQuery(['#xa','#ya','#xb','#yb','#algoritmo','#cor']);

  if(!metodo)
    return alert("Metodo não selecionado");
  else if(!x1 || !y1 || !x2 || !y2)
    return alert("Valores não preenchidos por completo");
  
  drawReta(x1,y1,x2,y2,metodo,cor);
  updatePixels();
}
draw = desenhar => {
  desenharForma(desenhar);
}

function exibirOitantes() { // exibe o teste de oitantes
  novaTela();

  let [metodo] = getValuesFromQuery(['#algoritmo']);
  if(!metodo)
    return alert("Metodo não selecionado");

  let iteracao = 0, final = 300;
  do { // Desenho de cada oitante da reta
    calcularPontosOitante(iteracao,0,final,0).map(ponto => {
      drawReta(0,0,ponto[0],ponto[1],algoritmo,"yellow");
    });

    iteracao+=10;
  } while(iteracao<=300);

  updatePixels();
}

  /*document.querySelector('canvas').onmousemove = e => {
    let [xValor,yValor] = convertToCartesian([e.pageX-this.offsetLeft, e.pageY-this.offsetTop+1]);
    document.querySelector('#mouseX').innerHTML = xValor;
    document.querySelector('#mouseY').innerHTML = yValor;
  };*/
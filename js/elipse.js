function calcularPontosElipse(x,xOrigem,y,yOrigem){
  // calculo de todos os pontos da elipse
  const pontosElipse = [
    [x+xOrigem, y+yOrigem], [-x+xOrigem, y+yOrigem],
    [x+xOrigem, -y+yOrigem], [-x+xOrigem, -y+yOrigem]
  ];
  return pontosElipse;
}

function desenharElipsePontoMedio(xOrigem, yOrigem, xRaio, yRaio, cor="red") {
  // metodo do ponto medio de desenho da elipse
  let x=0, y=yRaio, pontosElipse=[];

  // primeira parte do desenho da elipse de simetria=4
  calcularPontosElipse(x,xOrigem,y,yOrigem).map(pt => pontosElipse.push(pt));
  
  let pMedio1 = yRaio**2 - xRaio**2 * yRaio+0.25*xRaio**2;
  while((2*yRaio**2*x) <= (2*xRaio**2*y)) {
    if(pMedio1<0){
      x++; pMedio1 += 2*yRaio**2*x + yRaio**2;
    } else {
      x++; y--;
      pMedio1 += 2*yRaio**2*x - 2*xRaio**2*y + yRaio**2;
    }
    calcularPontosElipse(x,xOrigem,y,yOrigem).map(pt => pontosElipse.push(pt));
  }

  // segunda parte do desenho da elipse de simetria=4
  let pMedio2 = (x+0.5)**2*yRaio**2 + (y-1)**2*xRaio**2 - xRaio**2*yRaio**2;
  
  while(y!=0){
    if(pMedio2>0){
      y--; pMedio2 += -2*y*xRaio**2 + xRaio**2;
    } else {
      x++; y--;
      pMedio2 += -2*y*xRaio**2 + 2*x*yRaio**2 + xRaio**2;
    }

    calcularPontosElipse(x,xOrigem,y,yOrigem).map(pt => pontosElipse.push(pt));
  }
  pontosElipse.map(ponto => desenharPixel(ponto[0],ponto[1],cor));
}

function desenharForma(desenhar) {
  novaTela();
  if(!desenhar) return;

  metodoAlgoritmo = document.getElementById("algoritmo");
  opcao = metodoAlgoritmo[metodoAlgoritmo.selectedIndex].value;

  if(opcao == "ponto-medio"){
    let [x,y,xRaio,yRaio] = getValuesFromQuery(['#x_origem','#y_origem','#raio_x','#raio_y']);
    desenharElipsePontoMedio(++x,++y,++xRaio,++yRaio);
  }

  background(0);
  updatePixels();
}
draw = desenhar => {
  desenharForma(desenhar);
}
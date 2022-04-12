/* Funções para desenho de batimentos do coração em um monitor */

const frequencias = {
  20:{min:100,max:170}, 25:{min:100,max:170}, 30:{min:95,max:162},
  35:{min:93,max:157}, 40:{min:90,max:153}, 45:{min:88,max:149},
  50:{min:85,max:145}, 55:{min:83,max:140}, 60:{min:80,max:136},
  65:{min:78,max:132}, 70:{min:75,max:128},
};

let maximoBatimento = frequencias[20].min, minimoBatimento = 30;
let distanceBatimentos = 20, distanceBatimento = 10;
let situacoes = [90,70,30,20,10], monitorBatimentos = posicaoInicial = null;

function exibirBatimentos(){
  let [age,situacao] = getValuesFromQuery(['#slider-idade','#slider-situacao']);
  background(20);

  minimoBatimento = frequencias[age]["min"];
  maximoBatimento = frequencias[age]["max"];
  distanceBatimentos = situacoes[situacao];
  monitorBatimentos.mostrarPontos();
}
draw = desenhar => {
  exibirBatimentos(desenhar);
}

function desenharRetaBatimento(x1,y1,x2,y2,algoritmo) {
  if(algoritmo=='ponto-medio')
    desenharRetaB(x1,y1,x2,y2);
}

class Ponto {
  constructor(x1,y1){ this.x=x1, this.y=y1;}
}

class BatimentosCoracao {
  constructor(){
    this.pontos = [];
    this.indicePontoAtual = 0;

    this.criarPontos = ()=>{
      this.pontos.push(posicaoInicial);
      for(let i=1; i<floor(width/distanceBatimento); i++) {
        let pAnterior = Object.assign({},this.pontos[i-1]);

        if(i%distanceBatimentos == 0) {
          let pInferiorRand = floor(random(pAnterior.y-minimoBatimento, pAnterior.y-maximoBatimento));
          let pSuperiorRand = floor(random(pAnterior.y+minimoBatimento, pAnterior.y+maximoBatimento));

          let pInferior = new Ponto(pAnterior.x+distanceBatimento, pInferiorRand);
          let pSuperior = new Ponto(pInferior.x+distanceBatimento, pSuperiorRand);
          this.pontos.push(pInferior,pSuperior);
          i++;
        } else {
          this.pontos.push(new Ponto(pAnterior.x+distanceBatimento, posicaoInicial.y));
        }
      }
    };

    this.reset = ()=>{ // reseta os pontos
      this.pontos = [];
      this.criarPontos();
      this.indicePontoAtual = 0;
    };

    this.mostrarPontos = ()=>{
      stroke(255,0,0); //stroke(0,156,0); -> Cor da linha em rgb
      strokeWeight(1);
      noFill();

      for(let i=1; i<this.indicePontoAtual; i++)
        desenharRetaBatimento(this.pontos[i-1].x, this.pontos[i-1].y, this.pontos[i].x, this.pontos[i].y, 'ponto-medio');
      this.indicePontoAtual++;
      
      if(this.indicePontoAtual >= this.pontos.length)
        this.reset();
    };
  }
}

function setup(){ // setup do canvas
  let canvas = createCanvas(900, 450);
  canvas.parent("#screen");
  frameRate(20);
  posicaoInicial = new Ponto(0, height/2);
  monitorBatimentos = new BatimentosCoracao(posicaoInicial,100,30,20,10);
  monitorBatimentos.criarPontos();
}

function getValuesFromQuery(idList){
    // pega os valores de multiplos IDs/Querys do html
    idStr = idList.join(', ');
    return Array.from(document.querySelectorAll(idStr)).map(elem => parseFloat(elem.value) ? parseFloat(elem.value) : elem.value);
  }

function setupBasico(){
    // configuração inicial do canvas e dos botoes 
    const canvas = createCanvas(LARGURA,ALTURA);
    canvas.parent("#screen");
    select(".row.botao.mt-4 button").mousePressed(()=>desenharForma(true));
    select("#limpar").mousePressed(()=>desenharForma(false));
    noLoop();
}
// setup do canvas
setup = ()=>setupBasico();

desenharRetaB = (x1,y1,x2,y2)=>line(x1,y1,x2,y2)

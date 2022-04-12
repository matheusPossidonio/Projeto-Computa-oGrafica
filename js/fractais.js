function aplicarIteracao(){
    // configura o canvas e aplica as iteracoes dos fractais
    const canvas = document.querySelector('#imagecanvas');
    const context = canvas.getContext('2d');
    const iteracoes = document.querySelector('#numeroIteracoes').value;
    
    if(iteracoes<0 || iteracoes==null || iteracoes==NaN){
        alert('[ ! ] Número de Iteracoes inválido');
        return
    }

    canvas.setAttribute('style','display:block');
    // limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    setSpeed(0); 
    const tamanho = 300.0; 

    for(let i=0;i<3;i++){
        fractal(tamanho, iteracoes);
        right(120);
    }
}

function fractal(tamanho, levels){
    // função recursiva de geracao do fractal
    if(levels==0)
        return forward(tamanho);

    tamanho = tamanho/3;
    fractal(tamanho,levels-1);
    left(60);
    fractal(tamanho,levels-1);
    right(120);
    fractal(tamanho,levels-1);
    left(60);
    fractal(tamanho,levels-1);
}

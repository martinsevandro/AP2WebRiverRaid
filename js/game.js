function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    //const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    // this.elemento.appendChild(reversa ? corpo : borda)
    // this.elemento.appendChild(reversa ? borda : corpo)
    this.elemento.appendChild(corpo)

    this.setAltura = altura => corpo.style.height = `40px` //fixando altura
    this.setComprimento = comprimento => corpo.style.width = `${comprimento}px`

}


//  const b = new Barreira(true)
//  b.setAltura(300)  //nao é pra definir altura mas o comprimento na horizontal
//  b.setComprimento(50)
//  document.querySelector('[wm-flappy]').appendChild(b.elemento) 



function ParDeBarreiras(comprimento, abertura, popsicaoNaTela) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)  //barreira esquerda
    this.inferior = new Barreira(false) //barreira direita

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    //  this.sortearAbertura = () => { //aqui deve ser definido estaticamente de acordo com a imagem
    //     const alturaSuperior = Math.random() * (altura - abertura)
    //     const alturaInferior = altura - abertura - alturaSuperior
    //     this.superior.setAltura(alturaSuperior)
    //     this.inferior.setAltura(alturaInferior)
    // }

    this.sortearAbertura = () => {      
        // caminho livre no centro
        const comprimentoSuperior = comprimento - abertura;
        console.log("aqui", comprimento)
        const comprimentoInferior = comprimento - abertura - comprimentoSuperior
        this.superior.setComprimento(comprimentoSuperior)
        this.inferior.setComprimento(comprimentoInferior)
    }
    this.getX = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setX =  popsicaoNaTela => this.elemento.style.bottom = `${popsicaoNaTela}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(popsicaoNaTela)
 } 

 /* const b= new ParDeBarreiras(550,250,500)
document.querySelector('[wm-flappy]').appendChild(b.elemento)  
 */
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouMeio) {
                notificarPonto()
            }
        })
    }
}

const barreiras = new Barreiras(300, 300, 10, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')

// barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))       //"criando uma barrer estatica"

// setInterval(() => {
//     barreiras.animar()
// },10) 


function Carro(alturaJogo) {
    alturaJogo = window.width;
    console.log("altura:",alturaJogo)
    let voando = false

    this.elemento = novoElemento('img', 'carro')
    this.elemento.src = 'img/carro.png'

    this.getX = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setX = x => this.elemento.style.bottom = `${x}px`

    // window.onkeydown = e => voando = true
    // window.onkeyup = e => voando = false

    let esquerda = false;
    let direita = false;
    
    window.onkeydown = e => esquerda = true
    window.onkeyup = e => direita = true

    this.animar = () => {
        const novoX = this.getX() + (esquerda ? -5 : 0)
        novoX = this.getX() + (direita ? 5 : 0)
        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if (novoX <= 0) {
            this.setX(0)
        } else if (novoX >= alturaMaxima) {
            this.setX(alturaMaxima)
        } else {
            this.setX(novoX)
        }
    }
    this.setX(alturaJogo / 2)
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const carro = new Carro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(carro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
      barreiras.animar()
      carro.animar() 
},20) */

/*  Resolvendo parte superior ainda */


 function Progresso() {

    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

/*  const barreiras = new Barreiras(700, 400, 200, 400)
const carro = new Carro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(carro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))  */


 function estaoSobrepostos(elementoA, elementoB) {

    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(carro, barreiras) {
    let colidiu = false

    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(carro.elemento, superior)
                || estaoSobrepostos(carro.elemento, inferior)
        }
    })
    return colidiu

}

 function FlappyBird() {
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))

    const carro = new Carro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(carro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            carro.animar()

              if(colidiu(carro,barreiras)){
                 clearInterval(temporizador) 
             } 
        }, 20)
    }
}
 new FlappyBird().start() 
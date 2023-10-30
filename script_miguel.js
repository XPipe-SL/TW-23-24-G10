const num_peças =12 ;
//https://www.youtube.com/watch?v=k1kC8b6t2kg

window.onload = function() {new Game();};

class Tabuleiro{
	constructor(linhas,colunas){
		this.colunas = linhas;
		this.linhas = colunas;
		this.tabuleiro1 = new Array();
		this.limpar_tabuleiro();
		this.criar_tabuleiro();
	}

	limpar_tabuleiro(){
		const tab = document.getElementById("tab");
        tab.innerHTML = '';
	}

	criar_tabuleiro(){
		this.tab = document.getElementById("tab");
		tab.setAttribute("style", "grid-template-columns:"+"auto ".repeat(this.colunas));
		for(var linha = 1; linha<=this.linhas; linha++) {
			this.tabuleiro1[linha] = new Array();
			for(var coluna = 1; coluna<=this.colunas; coluna++) {
				const bloco = document.createElement("div");
				bloco.classList.add('bloco');
				bloco.setAttribute("id", "b"+linha+coluna);
				bloco.setAttribute("ondrop", "drop(event)"); 
                bloco.setAttribute("ondragover", "allowDrop(event)");
				tab.appendChild(bloco);

				this.tabuleiro1[linha][coluna] = undefined;
			}
		}
	}
	
}

class Fora {
    constructor(first) {

        const tab_main = document.getElementById("tab_main");

        if (first) {
            var fora = document.getElementById("fora1");
            this.clearFora(fora);
            for (var i = 0; i < num_peças; i++) {
                const peça = document.createElement("div");
                peça.setAttribute("class", "peça j1");
                peça.setAttribute("id", "j1" + (i + 1));
                peça.setAttribute("draggable", "true");
                peça.setAttribute("ondragstart", "drag(event)");
                fora.appendChild(peça);
            }
        } else {
            var fora = document.getElementById("fora2");
            this.clearFora(fora);
            for (var i = 0; i < num_peças; i++) {
                const peça = document.createElement("div");
                peça.setAttribute("class", "peça j2");
                peça.setAttribute("id", "j2" + (i + 1));
                peça.setAttribute("draggable", "true");
                peça.setAttribute("ondragstart", "drag(event)");
                fora.appendChild(peça);
            }
        }
    }

    clearFora(fora) {
        while (fora.firstChild) {
            fora.removeChild(fora.firstChild);
        }
    }
}

class Game {
    constructor(j1, j2) {

        if (j1 === undefined && j2 === undefined) {
			j1 = "black";
            j2 = "white";
        }

        if (j1 === 'Preto') {
            j1 = "black";
            j2 = "white";
        } else if (j1 === 'Branco') {
            j1 = "white";
            j2 = "black";
        }

		this.colunas = parseInt(document.getElementById('comprimento').value);
		this.linhas = parseInt(document.getElementById('altura').value);

        this.current = j1;
        this.tabuleiro_desenho = new Tabuleiro(this.colunas,this.linhas);
        this.fora_j1 = new Fora(true);
        this.fora_j2 = new Fora(false);

        var r = document.querySelector(':root');
        r.style.setProperty('--j1', j1);
        r.style.setProperty('--j2', j2);
		
        this.tabuleiro = this.tabuleiro_desenho.tabuleiro1;
        this.linhas_j1 = 0;
        this.linhas_j2 = 0;
        this.jogadas = 0;
        this.fase = 1;
    }

    //não principais
    vez() { //verifica quem tem a vez de jogar
        if (this.jogadas % 2 == 0) {return 'j1';}
        else {return 'j2';}
    }

    mudança() { //deteta o fim da fase 1 e faz as mudanças necessárias para avançar para a fase 2
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            const fora1 = document.getElementById('fora1');
            const fora2 = document.getElementById('fora2');
            peçaj1.setAttribute("draggable", "true");
            peçaj2.setAttribute("draggable", "true");
        }
        const fora1 = document.getElementById('fora1');
        const fora2 = document.getElementById('fora2');
        fora1.setAttribute("ondrop", "drop(event)"); 
        fora1.setAttribute("ondragover", "allowDrop(event)");
        fora2.setAttribute("ondrop", "drop(event)"); 
        fora2.setAttribute("ondragover", "allowDrop(event)");
        console.log('fase 2');
        this.fase++;
    }
    
    fez_linha(jogador, linha, coluna) {
        var count = 0;
        //avaliar linhas horizontais
        if (coluna <= this.colunas - 2) { //avalia linha para a frente _b
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna + 2] == jogador) {
                count++;
            }
        }
        if (coluna >= 3) { //avalia linha para tras bb_
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador) {
                count++;
            }
        }
        if (coluna > 1 || coluna < this.colunas) { //avalia linha b_b
            if (this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna + 1] == jogador) {
                count++;
            }
        }

        //avaliar linhas verticais
        if (linha <= this.linhas - 2) { //avalia linha para baixo
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador) {
                count++;
            }
        }
        if (linha >= 3) { //avalia linha para cima
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador) {
                count++;
            }
        }
        if (linha > 1 && linha < this.linhas) { //avalia b_b na vertical
            if (this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha + 1][coluna] == jogador) {
                count++;
            }
        }

        return count;
    }

    //principais

    colocar_peça(peçaId, alvoId) {
        const linha = parseInt(alvoId.substring(1, 2)); //obtem a linha do bloco em causa
        const coluna = parseInt(alvoId.substring(2, 3)); //obtem a coluna do bloco em causa
		const jogador = peçaId.substring(0,2); //obtem o jogador a quem pertence a peça
        const peça = document.getElementById(peçaId);

        if(peça.draggable && jogador == this.vez()){ //se a peça não estiver no tabuleiro e for a vez do jogador
		    if(this.possivel_colocar(jogador,linha,coluna)){ //jogada válida
                this.tabuleiro[linha][coluna] = jogador; //coloca a peça no array tabuleiro
                if(jogador == 'j1'){ 
                    this.linhas_j1 += this.fez_linha(jogador, linha, coluna);
                } else {
                    this.linhas_j2 += this.fez_linha(jogador, linha, coluna);
                }
                peça.draggable = false; //bloqueia a peça durnte a fase 1 após ser colocada no tabuleiro
                console.log(this.linhas_j1, this.linhas_j2);
                return true;
            } else { //jogada inválida
                mensagem('Movimento inválido');
            }

        } else if(!peça.draggable) { //se a peça já estiver no tabuleiro
            mensagem('Não pode mover uma peça já posta no tabuleiro.'); 
        } else if(jogador != this.vez()){ //se não for a vez deste jogador
            mensagem('Espere pela sua vez!');
        }

        return false;
    }

	possivel_colocar(jogador,linha, coluna) {
		if (this.tabuleiro[linha][coluna] != 'j1' && this.tabuleiro[linha][coluna] != 'j2') {
			if (coluna <= this.colunas - 3) { //avalia linha para a frente
				if (this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna + 2] == jogador && this.tabuleiro[linha][coluna + 3] == jogador) {
					return false;
				}
			}
	
			if (coluna >= 4) { //avalia linha para tras
				if (this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador && this.tabuleiro[linha][coluna - 3] == jogador) {
					return false;
				}
			}
	
	
			if (linha <= this.linhas - 3) { //avalia linha para baixo
				if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador && this.tabuleiro[linha + 3][coluna] == jogador) {
					return false;
				}
			}
	
			if (linha >= 4) { //avalia linha para cima
				if (this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador && this.tabuleiro[linha - 3][coluna] == jogador) {
					return false;
				}
			}

            if (coluna > 1 && coluna <= this.colunas - 2) { //avalia situações do tipo b_bb
                if (this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna + 2] == jogador && this.tabuleiro[linha][coluna - 1] == jogador){
                    return false;
                }
            }

            if (coluna > 2 && coluna <= this.colunas - 1) { //avalia situações do tipo bb_b
                if (this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador && this.tabuleiro[linha][coluna - 1] == jogador){
                    return false;
                } 
            }

            if (linha > 1 && linha <= this.linhas - 2) { //avalia situações do tipo b_bb em coluna
                if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador) {
                    return false;
                } 
            }
            
            if (linha > 2 && linha <= this.linhas -1) { //avalia situações do tipo bb_b em coluna
                if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador){ 
                    return false;
                }
            }

			return true;
		}
		return false;
	}

    mover_peça(peçaId, alvoId) {
        const linha = parseInt(alvoId.substring(1, 2)); //obtem a linha do bloco em causa
        const coluna = parseInt(alvoId.substring(2, 3)); //obtem a coluna do bloco em causa
		const jogador = peçaId.substring(0,2); //obtem o jogador a quem pertence a peça

        const peça = document.getElementById(peçaId);
        const originalBlock = document.getElementById(peçaId).parentNode; // original block of the piece
        const originalLine = parseInt(originalBlock.id.substring(1,2)); // original line of that block
        const originalColumn = parseInt(originalBlock.id.substring(2,3)); // original column of that block
        
        if(jogador == this.vez()) {
            if(this.possivel_mover(jogador, linha, coluna, originalLine, originalColumn)) {
                // retira a peça do array tabuleiro
                this.tabuleiro[originalLine][originalColumn] = undefined;
                
                this.tabuleiro[linha][coluna] = jogador; //coloca a peça no array tabuleiro
                
                if(jogador == 'j1'){ 
                    this.linhas_j1 += this.fez_linha(jogador, linha, coluna);
                } else {
                    this.linhas_j2 += this.fez_linha(jogador, linha, coluna);
                }
                
                console.log(this.linhas_j1, this.linhas_j2);
                return true;

            } else {
                mensagem('Movimento inválido');
            }
        } else {
            mensagem('Espere pela sua vez!');
        }

        return false;
    }

    // This can probaly be subsumed into possivel_colocar to streamline
    // Identical except this one skips checking [originalLine][originalColumn]
    possivel_mover(jogador, linha, coluna, originalLine, originalColumn){
        if (this.tabuleiro[linha][coluna] != 'j1' && this.tabuleiro[linha][coluna] != 'j2') {
			if (coluna <= this.colunas - 3) { //avalia linha para a frente
                let check = true;
                for (let i=1; i<=3; i++){
                    let checkLine = linha;
                    let checkColumn = coluna + i;

                    check &&= (originalLine != checkLine && originalColumn != checkColumn && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
			}
            
            // TODO: rest of the checks
			if (coluna >= 4) { //avalia linha para tras
				if (this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador && this.tabuleiro[linha][coluna - 3] == jogador) {
					return false;
				}
			}
	
	
			if (linha <= this.linhas - 3) { //avalia linha para baixo
				if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador && this.tabuleiro[linha + 3][coluna] == jogador) {
					return false;
				}
			}
	
			if (linha >= 4) { //avalia linha para cima
				if (this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador && this.tabuleiro[linha - 3][coluna] == jogador) {
					return false;
				}
			}

            if (coluna > 1 && coluna <= this.colunas - 2) { //avalia situações do tipo b_bb
                if (this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna + 2] == jogador && this.tabuleiro[linha][coluna - 1] == jogador){
                    return false;
                }
            }

            if (coluna > 2 && coluna <= this.colunas - 1) { //avalia situações do tipo bb_b
                if (this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador && this.tabuleiro[linha][coluna - 1] == jogador){
                    return false;
                } 
            }

            if (linha > 1 && linha <= this.linhas - 2) { //avalia situações do tipo b_bb em coluna
                if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador) {
                    return false;
                } 
            }
            
            if (linha > 2 && linha <= this.linhas -1) { //avalia situações do tipo bb_b em coluna
                if (this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador){ 
                    return false;
                }
            }

			return true;
		}
		return false;
    }

    retirar_peça(peçaId, alvoId) {

    }
}

function openInstruction() {
    var instruction = document.getElementById("instruções");
    instruction.style.display = 'block';
}

function closeInstruction() {
    var instruction = document.getElementById("instruções");
    instruction.style.display = 'none';
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault(); // Prevent the default action of the element
    var data = ev.dataTransfer.getData("text");
    var alvoId = ev.target.id;
    if(game.jogadas < 2*num_peças) { //fase 1
        if (alvoId.substring(0,1) != "j" && game.colocar_peça(data, alvoId)){ //única maneira que consegui de evitar que uma peça seja movida para dentro da mesma peça
            ev.target.appendChild(document.getElementById(data));
            mensagem('Movimento efetuado com sucesso!');
            game.jogadas++;
            if(game.jogadas == 2*num_peças) {
                game.mudança();
            }
        }  
    } else { //fase 2

        // TODO: movement to adjacent blocks only
        // TODO: removal of pieces
        if (alvoId.substring(0,1) != "j" && game.mover_peça(data, alvoId)) {
            ev.target.appendChild(document.getElementById(data));
            mensagem('Movimento efetuado com sucesso!');
            game.jogadas++;
        }
    }
}

function mensagem(text) {
    document.getElementById('mensagens').innerText = text;
}


var game = new Game();
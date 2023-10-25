const num_peças =12 ;

window.onload = function() {new Game();};

class Tabuleiro{
	constructor(){
		this.clearBoard();
		this.createBoard();
	}

	clearBoard(){
		const tab = document.getElementById("tab");
        tab.innerHTML = '';
	}

	createBoard(){
		const x = parseInt(document.getElementById('comprimento').value);
		const y = parseInt(document.getElementById('altura').value);
		this.tab = document.getElementById("tab");
		tab.setAttribute("style", "grid-template-columns:"+"auto ".repeat(x));
		
		for(var i = 0; i<x; i++) {
			for(var j = 0; j<y; j++) {
				const bloco = document.createElement("div");
				bloco.classList.add('bloco');
				bloco.setAttribute("id", "b"+i);
				tab.appendChild(bloco);
			}
		}
	}
	
}

class Fora{
	constructor(first){
		const tab_main = document.getElementById("tab_main");

		if (first) {
			var fora = document.getElementById("fora1");
			this.clearFora(fora);
			for (var i = 0; i <num_peças; i++) {
				const peça = document.createElement("div");
				peça.setAttribute("class", "peça j1")
				fora.appendChild(peça);
			}
		}
		else{
			var fora = document.getElementById("fora2");
			this.clearFora(fora);
			for (var i = 0; i <num_peças; i++) {
				const peça = document.createElement("div");
				peça.setAttribute("class", "peça j2")
				fora.appendChild(peça);
			}
		}
			
		
		
	}

	clearFora(fora){
		while(fora.firstChild){
			fora.removeChild(fora.firstChild);
		}
	}

}

/*var fora1 = new Fora(true);
var fora2 = new Fora(false);
const tab_main = document.getElementById("tab_main");
		tab_main.style.background = "cyan";
*/

class Game{
	constructor(j1,j2){
		if (j1 === undefined && j2 === undefined) {j1 = "black"; j2 = "white";}
		if (j1 == 'Preto') {j1 = "black"; j2 = "white";}
		else if (j1 == 'Branco') {j1 = "white"; j2 = "black";}

		this.current = j1;
		this.tabuleiro = new Tabuleiro();
		this.fora_j1 = new Fora(true);
		this.fora_j2 = new Fora(false);
		
		var r = document.querySelector(':root');
		r.style.setProperty('--j1', j1);
		r.style.setProperty('--j2', j2);

		
	}

}

function openInstruction(){
	var instruction = document.getElementById("instruções");
	instruction.style.display = 'block';
}

function closeInstruction(){
	var instruction = document.getElementById("instruções");
	instruction.style.display = 'none';
}

var mygame = new Game();
		
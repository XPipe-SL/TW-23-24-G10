const num_peças =12 ;


class Tabuleiro{
	constructor(x,y){
		this.x = x;
		this.y =y;
		this.board = new Array(x*y);
		this.tab = document.getElementById("tab");
		tab.setAttribute("style", "grid-template-columns:"+"auto ".repeat(x));

		for (var i = 0; i<this.board.length; i++) {
			const bloco = document.createElement("div");
			bloco.setAttribute("class", "bloco");
			bloco.setAttribute("id", "b"+i);
			tab.appendChild(bloco);
		}
	}
	
}

class Fora{
	constructor(first){ 
		const tab_main = document.getElementById("tab_main");

		if (first) {
			var fora = document.getElementById("fora1");
			for (var i = 0; i <num_peças; i++) {
				const peça = document.createElement("div");
				peça.setAttribute("class", "peça j1")
				fora.appendChild(peça);
			}
		}
		else{
			var fora = document.getElementById("fora2");
			
			for (var i = 0; i <num_peças; i++) {
				const peça = document.createElement("div");
				peça.setAttribute("class", "peça j2")
				fora.appendChild(peça);
			}
		}
			
		
		
	}
}

/*var fora1 = new Fora(true);
var fora2 = new Fora(false);
const tab_main = document.getElementById("tab_main");
		tab_main.style.background = "cyan";
*/

class Game{
	constructor(x,y,j1,j2){
		if (j1 === undefined) {j1 = "black"}
		if (j2 === undefined) {j2 = "white"}
		
		this.current = j1;
		this.tabuleiro = new Tabuleiro(x,y);
		this.fora_j1 = new Fora(true);
		this.fora_j2 = new Fora(false);
		
		var r = document.querySelector(':root');
		r.style.setProperty('--j1', j1);
		r.style.setProperty('--j2', j2);

		
	}

}

var mygame = new Game(8,10);
		
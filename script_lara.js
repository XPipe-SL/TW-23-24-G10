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
				peça.setAttribute("class", "peça j1");
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
		this.x = x;
		this.y =y;
		this.current = j1;
		this.tabuleiro = new Tabuleiro(x,y);
		this.fora_j1 = new Fora(true);
		this.fora_j2 = new Fora(false);
		this.peças_no_jogo =0;
		this.game_won = false;
		this.num_peças_j1 = num_peças;
		this.num_peças_j2 = num_peças;
		
		var r = document.querySelector(':root');
		r.style.setProperty('--j1', j1);
		r.style.setProperty('--j2', j2);
	}
	/*play(){
		while (peças_no_jogo <= 2*num_peças){
			put_peças();
		}
		while (game_won == false){
			moving_phase();
		}
	}
	place(peça, block){

		num_peças-=1;
	}
	move(peça, block)	{
		onclick
	}
	take_piece(peça){

	}*/

	get_neighbours(block){
		neighbours = new Array(4);
		var up = block-this.x;
		var down = block+this.x;
		var left = block-1;
		var right = block+1;
		/*check, if not out of border*/
		if (up>=0) {neighbours.push(up)}
		if (down<this.x*this.y-1) {neighbours.push(down)}
		if (left>=0 && block%this.x!=0) {neighbours.push(left)}
		if (right<this.x*this.y-1 && (block+1)%this.x!=) {neighbours.push(right)}
		return neighbours;
	}

	move_valid(peça, from, to){
		/*no other piece in block*/
		if (this.tabuleiro.board[to]!= null) {return false} /*error warning in messages?*/
		/* only neighbour block*/
		if (!(get_neighbours(from).includes(to))) {return false}
		/*not more than 3 pieces in row*/

		/*not more than 3 pieces in column*/


		return true;
	}
	

	game_decided(){
		return (this.num_peças_j1 >=3 || this.num_peças_j2 >=3);
	}

}

var mygame = new Game(5,6);
		
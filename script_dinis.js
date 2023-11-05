 const num_peças =4 ;
//https://www.youtube.com/watch?v=k1kC8b6t2kg

// Game AI

class gameAI {
    constructor(){};

    nextStep( tabuleiro, fase ){
        if ( fase==1 ){
            // Choose a spot to move a piece to
            // Calculate available spots
            let spots = new Array();

            for (let i=1; i<tabuleiro.length; i++){
                for (let j=1; j<tabuleiro[i].length; j++){
                    if (game.possivel_colocar("j2",i,j)) spots.push(""+i+j);
                }
            }

            // Choose randomly

            let choice = Math.floor( Math.random()*spots.length);
            let chosenSpot = "b"+spots[choice];
            let currentPiece = "j2"+Math.floor((game.jogadas+1)/2);

            // Move a piece there

            // There should be a function to directly move pieces

            if (game.colocar_peça( currentPiece, chosenSpot)) {
                document.getElementById( chosenSpot ).appendChild( document.getElementById(currentPiece) );
                mensagem("A AI colocou a peça na linha " + chosenSpot.substring(1,2) + " e na coluna " + chosenSpot.substring(2,3) + ".");
            }
            
        }else{
            // List all the pieces and all their possible movements

            // WARNING: the possivel_mover function does not check that
            // the movement is not the last position
            // Check here

            // WARNING: pieces are numbered from 1 to num_peças instead of from 0 to num_peças

            let possiblePieces = new Array(); // Stores which pieces can be moved

            let piecesMovements = new Array();  // Stores movement posibilities for each piece
            // 0 = down, 1=up, 2=right, 3=left

            for (let i=0; i<num_peças; i++){
                piecesMovements[i] = new Array();

                let currentPiece = "j2"+(i+1);
                let currentBlock = document.getElementById(currentPiece).parentNode;

                if (currentBlock.id != "fora1" && currentBlock.id != "fora2"){
                    let currentLine = parseInt(currentBlock.id.substring(1,2));
                    let currentColumn = parseInt(currentBlock.id.substring(2,3));

                    for (let j=0; j<4; j++){

                        // Generate positions in a loop

                        let movLine = currentLine;
                        let movColumn = currentColumn;

                        switch(j){
                            case 0:
                                if (currentLine < tabuleiro.length-1) { movLine++; }
                                break;

                            case 1:
                                if (currentLine > 1) { movLine--; }
                                break;

                            case 2:
                                if (currentColumn < tabuleiro[1].length-1) { movColumn++; }
                                break;

                            case 3:
                                if (currentColumn > 1) { movColumn--; }
                        }

                        // Check last_pos here

                        let movBlock = "b"+movLine+movColumn;

                        if ( !(game.last_posj2[0] == currentPiece && game.last_posj2[1] == movBlock) ){
                            if (game.possivel_mover("j2", movLine, movColumn, currentLine, currentColumn)){
                                piecesMovements[i].push(movBlock);
                            }
                        }
                    }
                }

                

                if (piecesMovements[i].length > 0){
                    possiblePieces.push(i);
                }

            }

            // If there are no possibilities to move a piece, surrender
            if (possiblePieces.length == 0){ game.desistir() };

            // Choose randomly
            let chosenPieceNum = possiblePieces[Math.floor( Math.random()*possiblePieces.length )];
            let chosenPiece = "j2"+(chosenPieceNum+1);
            let chosenMovNum = Math.floor( Math.random()*piecesMovements[chosenPieceNum].length );
            let chosenMov = piecesMovements[chosenPieceNum][chosenMovNum];

            // Move the piece
            const lastline = document.getElementById(chosenPiece).parentNode.id.substring(1,2);
            const lastcolumn = document.getElementById(chosenPiece).parentNode.id.substring(2,3);
            if (game.mover_peça( chosenPiece, chosenMov )) {
                
                mensagem("A AI moveu a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ chosenMov.substring(1,2) + "," +  chosenMov.substring(2,3) + ").")

                document.getElementById( chosenMov ).appendChild( document.getElementById(chosenPiece) );
            }

            // Piece removal management

            if (game.piece_to_remove){

                console.log("Your time is over puny human");

                // List all enemy pieces in the board

                let piecesToRemove = new Array();

                for (let i=0; i<num_peças; i++){
                    let currentPiece = "j1"+(i+1);
                    let currentBlock = document.getElementById(currentPiece).parentNode;

                    if (currentBlock.id != "fora1" && currentBlock.id != "fora2"){
                        piecesToRemove.push(currentPiece);
                    }
                }

                // Choose one randomly

                let choice = Math.floor( Math.random()*piecesToRemove.length );

                // Remove!

                game.remover_peça(piecesToRemove[choice]);
                mensagem("A AI fez linha movendo a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ chosenMov.substring(1,2) + "," +  chosenMov.substring(2,3) + ") e removeu uma peça da posição (" + document.getElementById(piecesToRemove[choice]).parentNode.id.substring(1,2) + "," +  document.getElementById(piecesToRemove[choice]).parentNode.id.substring(2,3) + ").")

                document.getElementById( "fora2" ).appendChild( document.getElementById(piecesToRemove[choice]) );

            }
        }
    }
}

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
        this.restore(j1,j2);
    }

    restore (j1, j2) {
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

        this.j1 = j1;
        this.j2 = j2;
        this.tabuleiro_desenho = new Tabuleiro(this.colunas,this.linhas);
        this.fora_j1 = new Fora(true);
        this.fora_j2 = new Fora(false);
        this.peças_j1 = num_peças;
        this.peças_j2 = num_peças;

        var r = document.querySelector(':root');
        r.style.setProperty('--j1', j1);
        r.style.setProperty('--j2', j2);
		
        this.tabuleiro = this.tabuleiro_desenho.tabuleiro1;
        this.jogadas = 0;
        this.fase = 1;
        this.piece_to_remove = false;
        this.last_posj1 = new Array(2);
        this.last_posj2 = new Array(2);

        if (document.getElementById("ia").checked){
            this.againstAI = true;
            this.GameAI = new gameAI();
        }
        else { this.againstAI = false; }
    }

    //non-main

    vez() { //checks how has to play
        if (this.jogadas % 2 == 0) {return 'j1';}
        else {return 'j2';}
    }

    mudança() { //detects the end of phase 1
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
    
    fez_linha(jogador, linha, coluna) { //checks if the player made a line
        //avaliar linhas horizontais
        if (coluna <= this.colunas - 2) { //avalia linha para a frente _b
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna + 1] == jogador && this.tabuleiro[linha][coluna + 2] == jogador) {
                return true;
            }
        }
        if (coluna >= 3) { //avalia linha para tras bb_
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna - 2] == jogador) {
                return true;
            }
        }
        if (coluna > 1 || coluna < this.colunas) { //avalia linha b_b
            if (this.tabuleiro[linha][coluna - 1] == jogador && this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha][coluna + 1] == jogador) {
                return true;
            }
        }

        //avaliar linhas verticais
        if (linha <= this.linhas - 2) { //avalia linha para baixo
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha + 1][coluna] == jogador && this.tabuleiro[linha + 2][coluna] == jogador) {
                return true;
            }
        }
        if (linha >= 3) { //avalia linha para cima
            if (this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha - 2][coluna] == jogador) {
                return true;
            }
        }
        if (linha > 1 && linha < this.linhas) { //avalia b_b na vertical
            if (this.tabuleiro[linha - 1][coluna] == jogador && this.tabuleiro[linha][coluna] == jogador && this.tabuleiro[linha + 1][coluna] == jogador) {
                return true;
            }
        }

        return false;
    }

    //main

    //phase 1

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
                return true;
            }
        } 
        return false;
    }

	possivel_colocar(jogador, linha, coluna) {
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

    //phase 2

    mover_peça(peçaId, alvoId) {
        const linha = parseInt(alvoId.substring(1, 2)); //obtem a linha do bloco em causa
        const coluna = parseInt(alvoId.substring(2, 3)); //obtem a coluna do bloco em causa
		const jogador = peçaId.substring(0,2); //obtem o jogador a quem pertence a peça

        const peça = document.getElementById(peçaId);
        const originalBlock = document.getElementById(peçaId).parentNode; // original block of the piece
        const originalLine = parseInt(originalBlock.id.substring(1,2)); // original line of that block
        const originalColumn = parseInt(originalBlock.id.substring(2,3)); // original column of that block
        
        // console.log(this.last_posj1, this.last_posj2, alvoId, peçaId);

        //checks if the piece is being moved to the last pos. that it was at
        if (jogador == 'j1' && this.last_posj1[0] == peçaId && this.last_posj1[1] == alvoId) {return false;}
        if (jogador == 'j2' && this.last_posj2[0] == peçaId && this.last_posj2[1] == alvoId) {return false;}

        if (jogador == this.vez()) {
            if (this.possivel_mover(jogador, linha, coluna, originalLine, originalColumn)) {
                this.tabuleiro[originalLine][originalColumn] = undefined; //removes the piece from the board
                this.tabuleiro[linha][coluna] = jogador; //place the piece in the new pos. in the board
                this.piece_to_remove = this.fez_linha(jogador, linha, coluna); 
                
                //save the last piece that was moved and the original pos
                if (jogador == 'j1') {
                    this.last_posj1[0] = peçaId;
                    this.last_posj1[1] = originalBlock.id;
                } else {
                    this.last_posj2[0] = peçaId;
                    this.last_posj2[1] = originalBlock.id;
                }

                return true;
                 
            }
        } 

        return false;
    }

    possivel_mover(jogador, linha, coluna, originalLine, originalColumn){
        if (coluna != originalColumn){
            if (coluna != originalColumn -1 && coluna != originalColumn + 1){
                return false;
            }

            if (linha != originalLine){
                return false;
            }
        } else if ( linha != originalLine - 1 && linha != originalLine + 1 ){
            return false;
        }


        if (this.tabuleiro[linha][coluna] != 'j1' && this.tabuleiro[linha][coluna] != 'j2') {
			if (coluna <= this.colunas - 3) { //avalia linha para a frente
                let check = true;
                for (let i=1; i<=3; i++){
                    let checkLine = linha;
                    let checkColumn = coluna + i;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
			}
            
			if (coluna >= 4) { //avalia linha para tras

                let check = true;
                for (let i=1; i<=3; i++){
                    let checkLine = linha;
                    let checkColumn = coluna - i;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
			}
	
	
			if (linha <= this.linhas - 3) { //avalia linha para baixo

                let check = true;
                for (let i=1; i<=3; i++){
                    let checkLine = linha + i;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
			}
	
			if (linha >= 4) { //avalia linha para cima

                let check = true;
                for (let i=1; i<=3; i++){
                    let checkLine = linha - i;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
			}

            if (coluna > 1 && coluna <= this.colunas - 2) { //avalia situações do tipo b_bb

                let check = true;
                for (let i=1; i<=2; i++){
                    let checkLine = linha;
                    let checkColumn = coluna + i;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }
                {
                    let checkLine = linha;
                    let checkColumn = coluna - 1;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
            }

            if (coluna > 2 && coluna <= this.colunas - 1) { //avalia situações do tipo bb_b

                let check = true;
                for (let i=1; i<=2; i++){
                    let checkLine = linha;
                    let checkColumn = coluna - i;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }
                {
                    let checkLine = linha;
                    let checkColumn = coluna + 1;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
            }

            if (linha > 1 && linha <= this.linhas - 2) { //avalia situações do tipo b_bb em coluna

                let check = true;
                for (let i=1; i<=2; i++){
                    let checkLine = linha + i;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }
                {
                    let checkLine = linha - 1;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
            }
            
            if (linha > 2 && linha <= this.linhas -1) { //avalia situações do tipo bb_b em coluna

                let check = true;
                for (let i=1; i<=2; i++){
                    let checkLine = linha - i;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }
                {
                    let checkLine = linha + 1;
                    let checkColumn = coluna;

                    check &&= ( !(originalLine == checkLine && originalColumn == checkColumn) && this.tabuleiro[checkLine][checkColumn] == jogador);
                }

                if (check) {
                    return false;
                }
            }

			return true;
		}
		return false;
    }

    remover_peça(peçaId) {
        const bloco = document.getElementById(peçaId).parentNode;
        const linha = parseInt(bloco.id.substring(1,2));
        const coluna = parseInt(bloco.id.substring(2,3));
        const peça_removida = peçaId.substring(0,2);
        if (peça_removida != this.vez()) {
            this.tabuleiro[linha][coluna] = undefined;
            this.piece_to_remove = false;
            if (peça_removida == "j1") {this.peças_j1-=1;}
            else{ this.peças_j2 -=1;}
            return true;
        }
        return false;
    }

    game_finished(){
        if(this.peças_j1<3){
            if (!this.againstAI) {
                mensagem("O jogador 2 ganhou! Para jogar de novo reinicie o jogo.");
                fim_mensagem("Parabéns jogador 2, ganhaste!");
                this.update_classifications(this.j2);
            } else {
                mensagem("A máquina ganhou! Para jogar de novo reinicie o jogo.");
                fim_mensagem("A máquina ganhou!");
                
            }
            openEnd();
            return true;
        }
        else if(this.peças_j2<3){
            mensagem("O jogador 1 ganhou! Para jogar de novo reinicie o jogo.")
            fim_mensagem("Parabéns jogador 1, ganhaste!")
            this.update_classifications(this.j1);
            openEnd();
            return true;
        } 
    }

    desistir() { 
        if(this.vez() == 'j1') {
            mensagem("O jogador 1 desistiu! Se quiser jogar reinicie o jogo!");
            fim_mensagem("O jogador 1 desistiu! \n" + "Parabéns jogador 2, ganhaste!");
        } else {
            mensagem('O jogador 2 desistiu! Se quiser jogar reinicie o jogo!');
            fim_mensagem("O jogador 2 desistiu! \n " + "Parabéns jogador 1, ganhaste!");
        }
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            peçaj1.setAttribute("draggable", "false");
            peçaj2.setAttribute("draggable", "false");
        }
        openEnd();
    }

    end_of_game(){
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            peçaj1.setAttribute("draggable", "false");
            peçaj2.setAttribute("draggable", "false");
        }

    }

    update_classifications(name){
        var points = Math.abs(this.peças_j1-this.peças_j2);
        var table = document.getElementById("tab_clas");
        var rows = table.rows;
        var changed = false;
        /*go throug list and see if name is already in it*/
        for (var i = 1; i < (rows.length); i++) {
            var name_cell= rows[i].getElementsByTagName("TD")[1].innerHTML;
            if (name==name_cell) {
                changed = true;
                /*check if points are higher than before*/
                var old_points = rows[i].getElementsByTagName("TD")[2].innerHTML;
                if (points>old_points) {
                    /*change points*/
                    rows[i].getElementsByTagName("TD")[2].innerHTML = points;
                }
            }
        }
        if (!changed) { /*means, name wasnt in table jet*/
            /*add row to table (is inserted as the first row)*/
            var new_row = table.insertRow(1);
            var cell1 = new_row.insertCell(0);
            var cell2 = new_row.insertCell(1);
            var cell3 = new_row.insertCell(2);

            cell1.innerHTML = "0";
            cell2.innerHTML = name;
            cell3.innerHTML = points;
        }

        /*sort the table in decrecing order of points*/
        var switching = true;
        var shouldSwitch;
        while (switching) {
            switching = false;
            rows = table.rows;
            for (var i = 1; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              /* Get the two elements you want to compare,
              one from current row and one from the next: */
              var x = rows[i].getElementsByTagName("TD")[2];
              var y = rows[i + 1].getElementsByTagName("TD")[2];
              // Check if the two rows should switch place:
              if (x.innerHTML < y.innerHTML) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            if (shouldSwitch) {
              /* If a switch has been marked, make the switch
              and mark that a switch has been done: */
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
            }
          }

          /*make numeration right*/
          for (var i = 1; i < (rows.length - 1); i++) {
            rows[i].getElementsByTagName("TD")[0].innerHTML = i;
          }
    }

}

function openInstruction() {
    var instruction = document.getElementById("instruções");
    document.getElementById('main').style.display = 'none';
    instruction.style.display = 'block';
}

function closeInstruction() {
    var instruction = document.getElementById("instruções");
    document.getElementById('main').style.display = 'flex';
    instruction.style.display = 'none';
}

function openEnd(){
    var fim = document.getElementById("fim");
    fim.style.width = (document.getElementById('tab_main').offsetWidth - 26) + 'px';
    fim.style.height = (document.getElementById('tab_main').offsetHeight - 26) + 'px';
    document.getElementById('tab_main').style.display = 'none';
    document.getElementById('give_up').disabled = true;
    document.getElementById('open_instruction').disabled = true;
    fim.style.display = 'flex';
}

function closeEnd(cor) {
    var fim = document.getElementById("fim");
    game.restore(cor);
    document.getElementById('give_up').disabled = false;
    document.getElementById('open_instruction').disabled = false;
    fim.style.display = 'none';
    mensagem("Jogo reiniciado.");
    document.getElementById('tab_main').style.display = 'flex';
}

function openClassificações(){
    var classificações = document.getElementById("classificações");
    classificações.style.display = "flex";
}

function closeClassificações(){
    var classificações = document.getElementById("classificações");
    classificações.style.display = "none";
}

function mensagem(text) {
    document.getElementById('mensagens').innerText = text;
}

function fim_mensagem(text) {
    document.getElementById('fim_inner').innerText = text;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

}

function drop(ev) {
    ev.preventDefault(); 
    var data = ev.dataTransfer.getData("text");
    var alvoId = ev.target.id;

    if(game.jogadas < 2*num_peças) { //phase 1
        if (alvoId.substring(0,1) != "j" && game.colocar_peça(data, alvoId)){
            ev.target.appendChild(document.getElementById(data));
            mensagem('Movimento efetuado com sucesso!');
            game.jogadas++;
        } else if (data.substring(0,2) != game.vez()) {
            mensagem("Espere pela sua vez!");
        } else if (!document.getElementById(data).draggable) {
            mensagem('Não pode mover uma peça já posta no tabuleiro.');             
        } else { mensagem("Jogada inválida!");}

    } else { //phase 2

        if (!game.piece_to_remove){

            if (alvoId.substring(0,1) == "b" && game.mover_peça(data, alvoId)) {
                ev.target.appendChild(document.getElementById(data));
                mensagem('Movimento efetuado com sucesso!');
                if (!game.piece_to_remove) { //increase jogadas if there is no pieces to remove, else waits until the piece is removed
                    game.jogadas++;
                } else {
                    mensagem('Fez uma linha, tem de remover uma peça do adversário.');
                }
            } else if (data.substring(0,2) != game.vez()) {
                mensagem("Espere pela sua vez!");
            } else if( document.getElementById(data).parentNode.id.substring(0,4) == 'fora'){
                mensagem("Não pode mover uma peça já removida do tabuleiro.");
            } else {
                mensagem("Movimento inválido!");
            }
        } else {
            if (data.substring(0,2) == 'j1') {var fora = 'fora2';} else {var fora = 'fora1';} 
            if (alvoId.substring(0,5) == fora){ //sees if the piece was moved to the right place
                if (game.remover_peça(data)) { //sees if this piece can be removed
                    ev.target.appendChild(document.getElementById(data));
                    game.jogadas++; //increase jogadas because before we didnt
                    mensagem("Peça removida com sucesso!");
                }
            } else {
                mensagem("Tem de retirar uma peça do adversário para o seu espaço.");
            }
        }
    }

    if (game.againstAI && game.vez() == "j2"){
        game.GameAI.nextStep( game.tabuleiro, game.fase );
        
        game.jogadas++;
    }

    if(game.jogadas == 2*num_peças) {
        game.mudança();
    }

    if(game.game_finished() && game.fase == 2){
        game.end_of_game();
    }
}

var rating = new Tabuleiro();
var game = new Game();
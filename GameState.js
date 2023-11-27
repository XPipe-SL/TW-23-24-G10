// Game state

// Deals with the data side of things
// Also what the AI uses
class GameState{
    constructor(linhas, colunas, tabuleiro){
        this.peças_j1 = num_peças;
        this.peças_j2 = num_peças;

        this.linhas = linhas;
        this.colunas = colunas;
        this.tabuleiro = tabuleiro;

        this.jogadas = 0;
        this.fase = 1;
        this.piece_to_remove = false;

        // Now the piece (last_posjX[0]) is identified by its current block
        // last_posjX[0] is its previous block
        this.last_posj1 = new Array(2);
        this.last_posj2 = new Array(2);
    }

    // deep-copies another GameState
    deep_copy(gamestate){
        this.peças_j1 = gamestate.peças_j1;
        this.peças_j2 = gamestate.peças_j2;

        this.linhas = gamestate.linhas;
        this.colunas = gamestate.colunas;

        this.tabuleiro = new Array();
        for (let i=1; i<=this.linhas; i++) {
            this.tabuleiro[i] = new Array();
            for (let j=1; j<=this.colunas; j++) {
                this.tabuleiro[i][j] = gamestate.tabuleiro[i][j];
            }
        }

        this.jogadas = gamestate.jogadas;
        this.fase = gamestate.fase;
        this.piece_to_remove = gamestate.piece_to_remove;
        this.last_posj1 = new Array(2);
        this.last_posj1[0] = gamestate.last_posj1[0];
        this.last_posj1[1] = gamestate.last_posj1[1];
        this.last_posj2 = new Array(2);
        this.last_posj2[0] = gamestate.last_posj2[0];
        this.last_posj2[1] = gamestate.last_posj2[1];

        this.difficulty = gamestate.difficulty;
    }

    //non-main

    vez() { //checks who has to play
        if (this.jogadas % 2 == 0) {return 'j1';}
        else {return 'j2';}
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

    // Checks if piece, position pair is the last one for the two players
    isPiecePosLast( pieceBlock, targetBlock ){
        if (this.last_posj1[0] == pieceBlock && this.last_posj1[1] == targetBlock) return true;
        if (this.last_posj2[0] == pieceBlock && this.last_posj2[1] == targetBlock) return true;
        return false;
    }

    // Checks if it's time for next fase
    isNextFase(){
        if (this.jogadas == 2*num_peças) {
            return true;
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
                this.jogadas++;
                if (this.isNextFase()) this.fase++;
                if (this.fase>2) alert("oopsie");
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

    // Piece to move now identified by the block it occupies
    mover_peça(peçaBlocoId, alvoId) {
        const linha = parseInt(alvoId.substring(1, 2)); //obtem a linha do bloco em causa
        const coluna = parseInt(alvoId.substring(2, 3)); //obtem a coluna do bloco em causa

        const originalLine = parseInt(peçaBlocoId.substring(1,2)); // original line of that block
        const originalColumn = parseInt(peçaBlocoId.substring(2,3)); // original column of that block
        const jogador = this.tabuleiro[originalLine][originalColumn]; //obtem o jogador a quem pertence a peça
        
        // console.log(this.last_posj1, this.last_posj2, alvoId, peçaId);

        //checks if the piece is being moved to the last pos. that it was at
        if (this.isPiecePosLast( peçaBlocoId, alvoId )) return false;

        if (jogador == this.vez()) {
            if (this.possivel_mover(jogador, linha, coluna, originalLine, originalColumn)) {
                this.tabuleiro[originalLine][originalColumn] = undefined; //removes the piece from the board
                this.tabuleiro[linha][coluna] = jogador; //place the piece in the new pos. in the board
                this.piece_to_remove = this.fez_linha(jogador, linha, coluna); 
                
                //save the last piece that was moved and the original pos
                if (jogador == 'j1') {
                    this.last_posj1[0] = alvoId;
                    this.last_posj1[1] = peçaBlocoId;
                } else {
                    this.last_posj2[0] = alvoId;
                    this.last_posj2[1] = peçaBlocoId;
                }

                if (!this.piece_to_remove) this.jogadas++;

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

    // It doesn't care about the piece only the position so it takes that now
    remover_peça(blocoId) {
        const linha = parseInt(blocoId.substring(1,2));
        const coluna = parseInt(blocoId.substring(2,3));
        const peça_removida = this.tabuleiro[linha][coluna];
        if (peça_removida != this.vez() && peça_removida != undefined) {
            this.tabuleiro[linha][coluna] = undefined;
            this.piece_to_remove = false;
            if (peça_removida == "j1") {this.peças_j1-=1;}
            else{ this.peças_j2 -=1;}
            this.jogadas++;
            return true;
        }
        return false;
    }

    // checks data for victory conditions
    // 0 = game unfinished
    // 1 = j1 defeat
    // 2 = j2 defeat
    game_finished(){
        let availableMovementsj1 = this.getAvailableMovements("j1");
        if (this.peças_j1<3 || availableMovementsj1.length == 0) return 1;
        let availableMovementsj2 = this.getAvailableMovements("j2");
        if (this.peças_j2<3 || availableMovementsj2.length == 0) return 2;

        return 0;
    }

    // Functions to assist the AI

    // Phase 1
    // Gets all spots available for the player
    getAvailableSpots( player ){
        let spots = new Array();

        for (let i=1; i<this.tabuleiro.length; i++){
            for (let j=1; j<this.tabuleiro[i].length; j++){
                if ( this.possivel_colocar(player, i,j) ) spots.push("b"+i+j);
            }
        }

        return spots;
    }

    // Phase 2
    
    // Gets all possible movements for each piece (identified by block)
    getAvailableMovements( player ){
        let piecesMovements = new Array();

        for (let i=1; i<=this.linhas; i++) {
            for (let j=1; j<=this.colunas; j++) {
                if (this.tabuleiro[i][j] == player) {
                    let currentBlock = "b"+i+j;
                    let availableMovementsPiece = this.getAvailableMovementsPiece( player, currentBlock );
                    if (availableMovementsPiece.length > 0) piecesMovements.push( [currentBlock, availableMovementsPiece] );
                }
            }
        }

        return piecesMovements;
    }

    // Gets possible movements (blocks) for a piece (identified by its current block)
    getAvailableMovementsPiece( player, block ){
        let piecesMovements = new Array();

        let currentLine = parseInt(block.substring(1,2));
        let currentColumn = parseInt(block.substring(2,3));
    
        for (let j=0; j<4; j++){
    
            // Generate positions in a loop
    
            let movLine = currentLine;
            let movColumn = currentColumn;
    
            switch(j){
                case 0:
                    if (currentLine < this.tabuleiro.length-1) { movLine++; }
                    break;
    
                case 1:
                    if (currentLine > 1) { movLine--; }
                    break;
    
                case 2:
                    if (currentColumn < this.tabuleiro[1].length-1) { movColumn++; }
                    break;
    
                case 3:
                    if (currentColumn > 1) { movColumn--; }
            }
    
            let movBlock = "b"+movLine+movColumn;

            if ( !(this.isPiecePosLast(block, movBlock)) && this.possivel_mover(player, movLine, movColumn, currentLine, currentColumn) ){
                piecesMovements.push( movBlock );
            }
        }

        return piecesMovements;
    }

    // Returns pieces in the board of a player (positions in the board)
    getPiecesOnBoard( player ){
        let piecesOnBoard = new Array();

        for (let i=1; i<=this.linhas; i++) {
            for (let j=1; j<=this.colunas; j++) {
                if (this.tabuleiro[i][j] == player) piecesOnBoard.push("b"+i+j);
            }
        }

        return piecesOnBoard;
    }
}
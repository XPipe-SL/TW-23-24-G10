// Auxiliary functions

// Returns an array with the non zero rows of matrix arg
function nonZero(arg){
    let ret = new Array();
    
    for (let i=0; i<num_peças; i++){
        if (arg[i].length > 0){
            ret.push(i);
        }
    }

    return ret;
}

// Game AI

// Random

function randomNextStep( gameState ){
    if (gameState.fase==1) {
        return randomNextStepFase1( gameState );
    } else {
        return randomNextStepFase2( gameState );
    }
}

function randomNextStepFase1( gameState ){
    // Choose a spot to move a piece to
    // Calculate available spots
    let availableSpots = gameState.getAvailableSpots( "j2" );

    // Choose randomly

    let choice = Math.floor( Math.random()*availableSpots.length );
    let chosenSpot = availableSpots[choice];
    let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

    // Move a piece there

    gameState.colocar_peça( currentPiece, chosenSpot );

    return [0, chosenSpot, currentPiece, undefined];

}

function randomNextStepFase2( gameState ){
    // List all the pieces and all their possible movements

    // WARNING: the possivel_mover function does not check that
    // the movement is not the last position
    // Check here

    // WARNING: pieces are numbered from 1 to num_peças instead of from 0 to num_peças-1

    // Stores movement posibilities for each piece
    let piecesMovements = gameState.getAvailableMovements( "j2" );

    // Stores which pieces can be moved (positions in the other array not undefined)
    let possiblePieces = nonZero( piecesMovements );

    // Choose randomly
    let chosenPieceNum = possiblePieces[Math.floor( Math.random()*possiblePieces.length )];
    let chosenPiece = "j2"+(chosenPieceNum+1);
    let chosenMovNum = Math.floor( Math.random()*piecesMovements[chosenPieceNum].length );
    let chosenMov = piecesMovements[chosenPieceNum][chosenMovNum];

    // Move the piece

    gameState.mover_peça( chosenPiece, chosenMov );

    // Piece removal management

    if (gameState.piece_to_remove){
        return [2, chosenMov, chosenPiece, randomRemoval( gameState )];
    }
    
    return [1, chosenMov, chosenPiece, undefined];
}

function randomRemoval( gameState ){
    // List all enemy pieces in the board

    let piecesToRemove = gameState.getPiecesOnBoard( "j1" );

    // Choose one randomly

    let choice = Math.floor( Math.random()*piecesToRemove.length );

    // Remove!

    gameState.remover_peça(piecesToRemove[choice]);

    return piecesToRemove[choice];
}

// Minimax

function miniMaxNextStep(gameState, depth){

    if (gameState.fase==1) {
        return miniMaxNextStepFase1(gameState, depth);
    
    } else {
        return miniMaxNextStepFase2(gameState, depth);
    }
}

// Assumes depth%2 == 1
function miniMaxNextStepFase1(gameState, depth){

    // Get all available spots
    let availableSpots = gameState.getAvailableSpots( "j2" );

    // Choose a spot
    let max = -Infinity;
    let chosenSpot = undefined;
    let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

    for (let i=0; i<availableSpots.length; i++){
        let spot = availableSpots[i];
        let node = new GameState(0,0,[]);
        node.deep_copy(gameState);

        node.colocar_peça(currentPiece, spot);
        let curValue = miniMax(node, depth-1);

        if ( max < curValue ){
            max = curValue;
            chosenSpot = spot;
        }
    }

    // Move the piece there

    gameState.colocar_peça( currentPiece, chosenSpot );

    return [0, chosenSpot, currentPiece, undefined];

}

// Assumes depth%2 == 1
function miniMaxNextStepFase2(gameState, depth){

}

function miniMax( gameState, depth ){
    if (depth==0){
        return eval(gameState);
    }
}

class gameAI {
    constructor(){};

    nextStep( gameState ){
        switch (gameState.difficulty){
            case 1:
                this.miniMaxNextStep(gameState, 1);
                break;
            
            case 2:
                this.miniMaxNextStep(gameState, 1);
                break;

            case 0:
            default:
                this.randomNextStep(gameState);
                break;
        }
    }

    randomNextStep(gameState){

        if ( gameState.fase==1 ){
            // Choose a spot to move a piece to
            // Calculate available spots
            let spots = new Array();

            for (let i=1; i<gameState.tabuleiro.length; i++){
                for (let j=1; j<gameState.tabuleiro[i].length; j++){
                    if (gameState.possivel_colocar("j2",i,j)) spots.push(""+i+j);
                }
            }

            // Choose randomly

            let choice = Math.floor( Math.random()*spots.length);
            let chosenSpot = "b"+spots[choice];
            let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

            // Move a piece there

            // There should be a function to directly move pieces

            if (gameState.colocar_peça( currentPiece, chosenSpot)) {
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
                                if (currentLine < gameState.tabuleiro.length-1) { movLine++; }
                                break;

                            case 1:
                                if (currentLine > 1) { movLine--; }
                                break;

                            case 2:
                                if (currentColumn < gameState.tabuleiro[1].length-1) { movColumn++; }
                                break;

                            case 3:
                                if (currentColumn > 1) { movColumn--; }
                        }

                        // Check last_pos here

                        let movBlock = "b"+movLine+movColumn;

                        if ( !(gameState.last_posj2[0] == currentPiece && gameState.last_posj2[1] == movBlock) ){
                            if (gameState.possivel_mover("j2", movLine, movColumn, currentLine, currentColumn)){
                                piecesMovements[i].push(movBlock);
                            }
                        }
                    }
                }

                

                if (piecesMovements[i].length > 0){
                    possiblePieces.push(i);
                }

            }

            // Choose randomly
            let chosenPieceNum = possiblePieces[Math.floor( Math.random()*possiblePieces.length )];
            let chosenPiece = "j2"+(chosenPieceNum+1);
            let chosenMovNum = Math.floor( Math.random()*piecesMovements[chosenPieceNum].length );
            let chosenMov = piecesMovements[chosenPieceNum][chosenMovNum];

            // Move the piece
            const lastline = document.getElementById(chosenPiece).parentNode.id.substring(1,2);
            const lastcolumn = document.getElementById(chosenPiece).parentNode.id.substring(2,3);
            if (gameState.mover_peça( chosenPiece, chosenMov )) {
                
                mensagem("A AI moveu a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ chosenMov.substring(1,2) + "," +  chosenMov.substring(2,3) + ").")

                document.getElementById( chosenMov ).appendChild( document.getElementById(chosenPiece) );
            }

            // Piece removal management

            if (gameState.piece_to_remove){

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

                gameState.remover_peça(piecesToRemove[choice]);
                mensagem("A AI fez linha movendo a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ chosenMov.substring(1,2) + "," +  chosenMov.substring(2,3) + ") e removeu uma peça da posição (" + document.getElementById(piecesToRemove[choice]).parentNode.id.substring(1,2) + "," +  document.getElementById(piecesToRemove[choice]).parentNode.id.substring(2,3) + ").")

                document.getElementById( "fora2" ).appendChild( document.getElementById(piecesToRemove[choice]) );

            }
        }
    }

    // Assumes odd is max, even is min
    miniMaxNextStep (gameState, depth=1){
        if (gameState.fase==1){
            // Calculate available spots
            let spots = new Array();

            for (let i=1; i<gameState.tabuleiro.length; i++){
                for (let j=1; j<gameState.tabuleiro[i].length; j++){
                    if (gameState.possivel_colocar("j2",i,j)) spots.push( [i,j] );
                }
            }

            // Minimax choose a spot
            let chosenSpot = -1;

            // max node (j2, AI)
            if ( depth%2 == 1 ){
                let max = -Infinity;

                for(let i=0; i<spots.length; i++){
                    let nodeGameState = new GameState( gameState.linhas, gameState.colunas, gameState.tabuleiro);
                    nodeGameState.deep_copy(gameState);

                    nodeGameState.tabuleiro[ spots[i][0] ][ spots[i][1] ] = "j2";

                    let cur = miniMax (nodeGameState, depth-1);

                    if (cur>max){
                        max = cur;
                        chosenSpot = i;
                    }
                }
            }
        }
    }
}
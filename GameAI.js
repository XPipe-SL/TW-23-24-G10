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

    // Stores movement posibilities for each piece
    let piecesMovements = gameState.getAvailableMovements( "j2" );

    // Choose randomly
    let chosenPieceNum = Math.floor( Math.random()*piecesMovements.length );
    let chosenPieceBlock = piecesMovements[chosenPieceNum][0];
    let chosenMovNum = Math.floor( Math.random()*piecesMovements[chosenPieceNum][1].length );
    let chosenMov = piecesMovements[chosenPieceNum][1][chosenMovNum];

    // Move the piece

    gameState.mover_peça( chosenPieceBlock, chosenMov );

    // Piece removal management

    if (gameState.piece_to_remove){
        return [2, chosenMov, chosenPieceBlock, randomRemoval( gameState )];
    }
    
    return [1, chosenMov, chosenPieceBlock, undefined];
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
    let maxSpots = new Array();
    let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

    for (let i=0; i<availableSpots.length; i++){
        let spot = availableSpots[i];
        let node = new GameState(0,0,[]);
        node.deep_copy(gameState);

        node.colocar_peça(currentPiece, spot);
        let curValue = miniMax(node, depth-1);

        if ( max < curValue ){
            max = curValue;
            maxSpots = new Array();
            maxSpots.push(spot);
        }

        if (max == curValue) maxSpots.push(spot);
    }

    // Choose one randomly from the different maximal posibilities
    let chosenSpot = maxSpots[ Math.floor( Math.random()*maxSpots.length )]

    // Move the piece there

    gameState.colocar_peça( currentPiece, chosenSpot );

    return [0, chosenSpot, currentPiece, undefined];

}

// Assumes depth%2 == 1
function miniMaxNextStepFase2(gameState, depth){
    // List all the pieces and all their possible movements

    // Stores movement posibilities for each piece
    let piecesMovements = gameState.getAvailableMovements( "j2" );

    // Choose a piece, a movement and a piece to remove (if necessary)
    let max = -Infinity;
    let maxPieceMovRemove = new Array();

    for (let i=0; i<piecesMovements.length; i++) {
        let piece = piecesMovements[i][0];
        for (let j=0; j<piecesMovements[i][1].length; j++) {
            let mov = piecesMovements[i][1][j];
            let node = new GameState(0,0,[]);
            node.deep_copy(gameState);

            node.mover_peça( piece, mov );

            if (node.piece_to_remove) {
                // List all enemy pieces in the board

                let piecesToRemove = gameState.getPiecesOnBoard( "j1" );

                for (let k=0; k<piecesToRemove.length; k++) {
                    let remove = piecesToRemove[k];
                    let noder = new GameState(0,0,[]);
                    noder.deep_copy(node);
                    noder.remover_peça( remove );

                    let curVal = miniMax( noder, depth-1 );

                    if ( max < curVal ){
                        max = curVal;
                        maxPieceMovRemove = new Array();
                        maxPieceMovRemove.push([piece, mov, remove]);
                    }

                    if (max==curVal) {
                        max = curVal;
                        maxPieceMovRemove.push([piece, mov, remove]);
                    }
                }
            
            } else {
                let curVal = miniMax( node, depth-1 );
                
                if ( max < curVal ){
                    max = curVal;
                    maxPieceMovRemove = new Array();
                    maxPieceMovRemove.push([piece, mov, undefined])
                }

                if (max==curVal) {
                    max = curVal;
                    maxPieceMovRemove.push([piece, mov, undefined]);
                }
                
            }
        }
    }

    let choice = Math.floor( Math.random()*maxPieceMovRemove.length );

    let chosenPiece = maxPieceMovRemove[choice][0];
    let chosenMov = maxPieceMovRemove[choice][1];
    let chosenRemove = maxPieceMovRemove[choice][2];

    // Move the piece

    gameState.mover_peça( chosenPiece, chosenMov );

    // Piece removal management

    if (gameState.piece_to_remove){
        gameState.remover_peça( chosenRemove );
        return [2, chosenMov, chosenPiece, chosenRemove];
    }
    
    return [1, chosenMov, chosenPiece, undefined];
}

// Actual miniMax function: evaluates each node:
// Max of child nodes if the AI is playing
// Min of child nodes if the player is playing
// Once it reaches depth, an static evaluation
function miniMax(gameState, depth){
    if (depth==0) {
        return evaluate(gameState);
    }

    // Node MAX
    if (depth%2 == 1) {
        if (gameState.fase == 1) {
            return maxNodeFase1(gameState, depth);
        }

        if (gameState.fase == 2) {
            return maxNodeFase2(gameState, depth);
        }
    }

    // Node Min
    if (depth%2 == 0) {
        if (gameState.fase == 1) {
            return minNodeFase1(gameState, depth);
        }

        if (gameState.fase == 2) {
            return minNodeFase2(gameState, depth);
        }
    }
}

// Max Node: of the child nodes, choose the one with the highest evaluation

function maxNodeFase1(gameState, depth) {
    // Get all available spots
    let availableSpots = gameState.getAvailableSpots( "j2" );

    let max = -Infinity;
    let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

    for (let i=0; i<availableSpots.length; i++){
        let spot = availableSpots[i];
        let node = new GameState(0,0,[]);
        node.deep_copy(gameState);

        node.colocar_peça(currentPiece, spot);
        let curValue = miniMax(node, depth-1);

        if ( max < curValue ){
            max = curValue;
        }
    }

    return max;
}

function maxNodeFase2(gameState, depth) {
    // List all the pieces and all their possible movements

    // Stores movement posibilities for each piece
    let piecesMovements = gameState.getAvailableMovements( "j2" );

    // Choose a piece, a movement and a piece to remove (if necessary)
    let max = -Infinity;

    for (let i=0; i<piecesMovements.length; i++) {
        let piece = piecesMovements[i][0];
        for (let j=0; j<piecesMovements[i][1].length; j++) {
            let mov = piecesMovements[i][1][j];
            let node = new GameState(0,0,[]);
            node.deep_copy(gameState);

            node.mover_peça( piece, mov );

            if (node.piece_to_remove) {
                // List all enemy pieces in the board

                let piecesToRemove = gameState.getPiecesOnBoard( "j1" );

                for (let k=0; k<piecesToRemove.length; k++) {
                    let remove = piecesToRemove[k];
                    let noder = new GameState(0,0,[]);
                    noder.deep_copy(node);
                    noder.remover_peça( remove );

                    let curVal = miniMax( noder, depth-1 );

                    if ( max < curVal ){
                        max = curVal;
                    }
                }
            
            } else {
                let curVal = miniMax( node, depth-1 );
                
                if ( max < curVal ){
                    max = curVal;
                }
            }
        }
    }

    return max;
}

// Node MIN: choose the lowest valued child node

function minNodeFase1(gameState, depth) {
    // Get all available spots
    let availableSpots = gameState.getAvailableSpots( "j2" );

    let min = Infinity;
    let currentPiece = "j2"+Math.floor((gameState.jogadas+1)/2);

    for (let i=0; i<availableSpots.length; i++){
        let spot = availableSpots[i];
        let node = new GameState(0,0,[]);
        node.deep_copy(gameState);

        node.colocar_peça(currentPiece, spot);
        let curValue = miniMax(node, depth-1);

        if ( min > curValue ){
            min = curValue;
        }
    }

    return min;
}

function minNodeFase2(gameState, depth) {
    // List all the pieces and all their possible movements

    // Stores movement posibilities for each piece
    let piecesMovements = gameState.getAvailableMovements( "j2" );

    // Choose a piece, a movement and a piece to remove (if necessary)
    let min = Infinity;

    for (let i=0; i<piecesMovements.length; i++) {
        let piece = piecesMovements[i][0];
        for (let j=0; j<piecesMovements[i][1].length; j++) {
            let mov = piecesMovements[i][1][j];
            let node = new GameState(0,0,[]);
            node.deep_copy(gameState);

            node.mover_peça( piece, mov );

            if (node.piece_to_remove) {
                // List all enemy pieces in the board

                let piecesToRemove = gameState.getPiecesOnBoard( "j1" );

                for (let k=0; k<piecesToRemove.length; k++) {
                    let remove = piecesToRemove[k];
                    let noder = new GameState(0,0,[]);
                    noder.deep_copy(node);
                    noder.remover_peça( remove );

                    let curVal = miniMax( noder, depth-1 );

                    if ( min > curVal ){
                        max = curVal;
                    }
                }
            
            } else {
                let curVal = miniMax( node, depth-1 );
                
                if ( min > curVal ){
                    min = curVal;
                }
            }
        }
    }

    return min;
}

// Returns an evaluation on the state of the board
function evaluate( gameState ){
    if ( gameState.fase==1 )
        return evaluateFase1( gameState );
    else
        return evaluateFase2( gameState );
}

function evaluateFase1( gameState ){
    let result = [0,0];
    // Count instances of two pieces in line and only other one at one step distance
    // Such as XX_X
    // Or XX__
    //    __X_

    for (let p=0; p<2; p++) {
        let player = "j"+(p+1);

        let piecesOnBoard = gameState.getPiecesOnBoard(player)

        for (let i=0; i<piecesOnBoard.length; i++){
            let line = piecesOnBoard[i].substring(1,2);
            line = parseInt(line);
            let column = piecesOnBoard[i].substring(2,3);
            column = parseInt(column);

            // Count instances of two pieces in line and only other one at one step distance
            // Such as XX_X
            // Or XX__
            //    __X_

            // Left to right
            if (
                (column <= gameState.colunas-2)
                &&
                // Checks it's a _XX_ situation (first piece selected)
                gameState.tabuleiro[line][column+1] == player
                &&
                gameState.tabuleiro[line][column+2] == undefined
                &&
                (column == 1 || gameState.tabuleiro[line][column-1] != player)
            ) {
                
                // Checks _XX_
                //           X 
                if (line < gameState.linhas && gameState.tabuleiro[line+1][column+2] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == 1 || gameState.tabuleiro[line-1][column+2] == undefined)
                        &&
                        (column > gameState.colunas-3 || gameState.tabuleiro[line][column+3] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks    X
                //        _XX_ 
                if (line > 1 && gameState.tabuleiro[line-1][column+2] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == gameState.linhas || gameState.tabuleiro[line+1][column+2] == undefined)
                        &&
                        (column > gameState.colunas-3 || gameState.tabuleiro[line][column+3] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks _XX_X
                if (column <= gameState.colunas-3 && gameState.tabuleiro[line][column+3] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == 1 || gameState.tabuleiro[line-1][column+2] == undefined)
                        &&
                        (line == gameState.linhas || gameState.tabuleiro[line+1][column+2] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }
            }


            // Right to left
            if (
                (column >= 3)
                &&
                // Checks it's a _XX_ situation (second piece selected)
                gameState.tabuleiro[line][column-1] == player
                &&
                gameState.tabuleiro[line][column-2] == undefined
                &&
                (column == gameState.colunas || gameState.tabuleiro[line][column+1] == undefined)
            ) {

                // Checks _XX_
                //        X 
                if (line < gameState.linhas && gameState.tabuleiro[line+1][column-2] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == 1 || gameState.tabuleiro[line-1][column-2] == undefined)
                        &&
                        (column <= 3 || gameState.tabuleiro[line][column-3] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks X
                //        _XX_ 
                if (line > 1 && gameState.tabuleiro[line-1][column-2] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == gameState.linhas || gameState.tabuleiro[line+1][column-2] == undefined)
                        &&
                        (column <= 3 || gameState.tabuleiro[line][column-3] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks X_XX_
                if (column >=4 && gameState.tabuleiro[line][column-3] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (line == 1 || gameState.tabuleiro[line-1][column-2] == undefined)
                        &&
                        (line == gameState.linhas || gameState.tabuleiro[line+1][column-2] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }
            }

            // Up down
            if (
                (line <= gameState.linhas-2)
                &&
                // Checks it's a
                // _
                // X
                // X
                // _
                // situation (first piece selected)
                gameState.tabuleiro[line+1][column] == player
                &&
                gameState.tabuleiro[line+2][column] == undefined
                &&
                (line == 1 || gameState.tabuleiro[line-1][column] == undefined)
            ) {
                // Checks
                // _
                // X
                // X
                // _X
                if (column < gameState.colunas && gameState.tabuleiro[line+2][column+1] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == 1 || gameState.tabuleiro[line+2][column-1] == undefined)
                        &&
                        (line > gameState.linhas-3 || gameState.tabuleiro[line+3][column] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks
                //  _
                //  X
                //  X
                // X_
                if (column > 1 && gameState.tabuleiro[line+2][column-1] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == gameState.colunas || gameState.tabuleiro[line+1][column+1] == undefined)
                        &&
                        (line > gameState.linhas-3 || gameState.tabuleiro[line+3][column] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks
                // _
                // X
                // X
                // _
                // X
                if (line <= gameState.linhas-3 && gameState.tabuleiro[line+3][column] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == 1 || gameState.tabuleiro[line+2][column-1] == undefined)
                        &&
                        (column == gameState.colunas || gameState.tabuleiro[line+1][column+1] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }
            }

            // Down up
            if (
                (line >= 3)
                &&
                // Checks it's a
                // _
                // X
                // X
                // _
                // situation (second piece selected)
                gameState.tabuleiro[line-1][column] == player
                &&
                gameState.tabuleiro[line-2][column] == undefined
                &&
                (line == gameState.linhas || gameState.tabuleiro[line+1][column] == undefined)
            ) {
                // Checks
                // _X
                // X
                // X
                // _
                if (column < gameState.colunas && gameState.tabuleiro[line-2][column+1] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == 1 || gameState.tabuleiro[line-2][column-1] == undefined)
                        &&
                        (line <= 3  || gameState.tabuleiro[line-3][column] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks
                // X_
                //  X
                //  X
                //  _
                if (column > 1 && gameState.tabuleiro[line-2][column-1] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == gameState.colunas || gameState.tabuleiro[line-1][column+1] == undefined)
                        &&
                        (line <= 3  || gameState.tabuleiro[line-3][column] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }

                // Checks
                // X
                // _
                // X
                // X
                // _
                if (line >= 4 && gameState.tabuleiro[line-3][column] == player) {
                    result[p] += 1;
                    // Checks there's no other piece around (to minimize risk and save pieces)
                    if (
                        (column == 1 || gameState.tabuleiro[line-2][column-1] == undefined)
                        &&
                        (column == gameState.colunas || gameState.tabuleiro[line-1][column+1] == undefined)
                    ) {
                        result[p] += 3;
                    }
                }
            }

            // Count instances of blocking the other player
            otherPlayer = "j"+(((p+1)%2) +1);

            // Left to right
            if (
                (column <= gameState.colunas-2)
                &&
                // Checks it's a XYY situation
                gameState.tabuleiro[line][column+1] == otherPlayer
                &&
                gameState.tabuleiro[line][column+2] == otherPlayer
            ) {
                result[p] += 1;
            }

            // Right to left
            if (
                (column >= 3)
                &&
                // Checks it's a YYX situation
                gameState.tabuleiro[line][column-1] == otherPlayer
                &&
                gameState.tabuleiro[line][column-2] == otherPlayer
            ) {
                result[p] += 1;
            }

            // Up down
            if (
                (line <= gameState.linhas-2)
                &&
                // Checks it's a
                // X
                // Y
                // Y
                // situation
                gameState.tabuleiro[line+1][column] == otherPlayer
                &&
                gameState.tabuleiro[line+2][column] == otherPlayer
            ) {
                result[p] += 1;
            }

            // Down up
            if (
                (line >= 3)
                &&
                // Checks it's a
                // Y
                // Y
                // X
                // situation (second piece selected)
                gameState.tabuleiro[line-1][column] == otherPlayer
                &&
                gameState.tabuleiro[line-2][column] == otherPlayer
            ) {
                result[p] += 1;
            }

        }
    }

    return result[1]-result[0];
}

function evaluateFase2( gameState ){
    // If j1 lost, it's infinite points (victory)
    if (gameState.game_finished() == 1) return Infinity;
    // If j2 lost, minus infinite points (defeat)
    if (gameState.game_finished() == 2) return -Infinity;

    return (gameState.peças_j2 - gameState.peças_j1)*10 + evaluateFase1(gameState);

}
games = new Array();

class gameState {
    constructor (hash, nick, size) {
        this.game = hash;
        this.white = nick;
        this.size = size;
        this.waiting = true;
    }

    init (nick) {
        this.waiting = false;
        this.black = nick;

        this.board = [];
        for (let i=0; i<this.size.rows; i++) {
            let row = [];
            for (let i=0; i<this.size.columns; i++) row.push("empty");
            this.board.push(row);
        }

        //console.log(this.board);

        this.turn = this.white;
        this.turnN = 0;

        this.phase = undefined;
        this.step = "from";
    }
}

module.exports.findGame = function(hash, nick, size) {

    // There's a game waiting with the same size
    let pos = checkForGame(games, size);
    if (pos != -1) {
        console.log("Join another game!");
        games[i].init(nick);

        return games[i].game;
    } else {
        //console.log("Adding game: "+hash);
        // Creates a new game
        let newGame = new gameState(hash, nick, size);

        games.push(newGame);

        return hash;
    }
}

module.exports.deleteGame = function(hash) {
    console.log(games);
    let pos = games.findIndex((game) => game.game == hash);
    if (pos>-1) games.splice(pos, 1);
    console.log(games);
}

module.exports.endGame = function(hash, nick) {
    let pos = games.findIndex((game) => game.game == hash);

    if (pos>-1) {
        if (games[pos].black != undefined) {
            games[pos].winner = games[pos].white == nick? games[pos].black : games[pos].white;
        } else {
            games[pos].winner = "null";
        }
    }
}

// Checks if there's an incomplete game with the same size
// Returns its pos if so, -1 otherwise
function checkForGame(games, size) {

    for (i in games) {

        if ((games[i]).waiting) {
            if (size.rows == games[i].size.rows && size.columns == games[i].size.columns) return i;
        }

    }

    return -1;
}

// Finds active game from hash
// Returns pos in array
// -1 otherwise 
module.exports.getGame = function(hash) {
    for (i in games) {
        if (games[i].game == hash) return games[i];
    }

    return -1;
}

// Applies move to gameState
module.exports.applyMove = function(nick, hash, move) {
    let pos = games.findIndex((game) => game.game == hash);

    if (pos>-1) {
        if (games[pos].turn == nick) {

            // Phase 1
            if (games[pos].turnN < 24) {
                games[pos].phase = games[pos].turnN <23 ? "drop": "move";

                // Update board
                // Naive update
                games[pos].move = move;
                
                games[pos].board[move.row][move.column] = games[pos].white == nick ? "white" : "black";

                games[pos].turnN++;
                games[pos].turn = games[pos].white == nick ? games[pos].black : games[pos].white;
            
            // Phase 2
            } else {
                games[pos].move = move;

                switch (games[pos].step) {
                    case "from":
                        games[pos].step = "to";
                        break;

                    case "to":
                        
                        break;

                }
                
                //games[pos].turnN++;
                //games[pos].turn = games[pos].white == nick ? games[pos].black : games[pos].white;
            }

        }
    }
}
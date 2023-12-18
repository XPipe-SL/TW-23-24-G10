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

        this.phase = "drop";
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
    let pos = games.findIndex((gh) => gh == hash);
    if (pos>-1) games.splice(pos, 1);
    console.log(games);
}

module.exports.endGame = function(hash) {
    let pos = games.findIndex((game) => game.game == hash);

    if (pos>-1) games[pos].winner = "null";
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
games = [];

class gameState {
    constructor (hash) {
        
    }
}

module.exports.addGame = function(hash) {
    console.log("Adding game: "+hash);

    let newGame = new gameState(hash);

    games.push(hash);
}

module.exports.deleteGame = function(hash) {
    console.log(games);
    let pos = games.findIndex((gh) => gh == hash);
    if (pos>-1) games.splice(pos, 1);
    console.log(games);
}
const gs = require('./gameState.js');

module.exports.f = function (query, request, response){
    console.log('update requested');
    let gamehash = query.substring(query.lastIndexOf('=')+1);

    // Find game from hash
    // console.log(gamehash);
    let game = gs.getGame(gamehash);
    // console.log(game);

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    });

    let data = "";

    if (game.waiting) {
        if (game.winner == "null") {
            data = JSON.stringify( {'winner':null} );
            response.write('data: ' + data + '\n\n');
        }
    }

    if (!game.waiting) {
        

        if (game.turnN == 0) {
            let players = JSON.parse('{"' + game.white + '":"white", "' + game.black + '":"black"}');

            data = JSON.stringify({
                'board':game.board,
                'phase':game.phase,
                'step':game.step,
                'turn':game.turn,
                'players':players
            });

        }
        
        response.write('data: ' + data + '\n\n');
    }
    
};

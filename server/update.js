const gs = require('./gameState.js');
let sentTwo = false;

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
            gs.deleteGame(game.game);
        }
    }

    if (!game.waiting) {
        if (game.winner == game.white || game.winner == game.black) {
            data = JSON.stringify( {'winner':game.winner } );

            // It has to be sent to both players
            if (!sentTwo) 
                sentTwo = true;
            else
                gs.deleteGame(game.game);
        
        } else {
            let players = JSON.parse('{"' + game.white + '":"white", "' + game.black + '":"black"}');

            if (game.turnN == 0) {
                data = JSON.stringify({
                    'board':game.board,
                    'phase':game.phase,
                    'step':game.step,
                    'turn':game.turn,
                    'players':players
                });
            } else {
                data = JSON.stringify({
                    'board':game.board,
                    'phase':game.phase,
                    'step':game.step,
                    'turn':game.turn,
                    'players':players,
                    'move':game.move
                });
            }

        }
        
        response.write('data: ' + data + '\n\n');
    }
    
};

const gs = require('./gameState.js');

module.exports.f = function (query, request, response){
    console.log('update requested');
    let gamehash = query.substring(query.lastIndexOf('=')+1);

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    });

    
};

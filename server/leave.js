// TODO: error checking
const gs = require('./gameState.js');

module.exports.f = function (request, response){
    console.log('leave requested');

    if (request.method == 'POST') {

        let data_req = "";

        //store the data send by request
        request.on('data', function(chunk) {
            //console.log("Received body data:");
            data_req += chunk;
            //console.log(data_req);
        });

        //process the data after everything is received
        request.on('end', function() {
            //console.log(data_req);
            //console.log("Sending back answer");
            let data = JSON.parse(data_req);
            response.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache'});
            response.end();

            // Mark the game as finished
            gs.endGame(data.game, data.nick);
        } );

        request.on('error', (err) => { console.log(err.message); } );
    }

    if (request.method == 'OPTIONS') {
        response.writeHead(204, {"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                            "Access-Control-Allow-Origin":"null",
                            "Access-Control-Allow-Headers":"content-type",
                            "Vary": "Accept-Encoding, Origin"
                            })
        response.end(); 

    }
};

const gs = require('./gameState.js');

module.exports.f = function (request, response){
    console.log('notify requested');

    if (request.method == 'POST') {
        // console.log("hey");

        let data_req = "";

        //store the data send by request
        request.on('data', function(chunk) {
            //console.log("Received body data:");
            data_req += chunk;
            //console.log(data_req);
        });

        //process the data after everything is received
        request.on('end', function() {
            let data = JSON.parse(data_req);
            // console.log(data);
            gs.applyMove(data.nick, data.game, data.move);

            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });

            response.end();
        });

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
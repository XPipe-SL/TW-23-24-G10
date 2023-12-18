// TODO: error checking

const crypto = require('crypto');
const gs = require('./gameState.js');

// Returns the hash if the game can be added
// Otherwise doesn't return
module.exports.f = function (request, response){
    console.log('join requested');

    if (request.method == 'POST') {
        //console.log("Is post");

        let data_req = "";

        //store the data send by request
        request.on('data', function(chunk) {
            //console.log("Received body data:");
            data_req += chunk;
            //console.log(data_req);
        });

        //process the data after everything is received
        request.on('end', function() {

            // console.log(data_req);
            let data = JSON.parse(data_req);
            //console.log(data.nick);
            
            let game_id = hashing(data_req+JSON.stringify(new Date()));

            // Add game to list of games
            // Or find already existing game
            game_id = gs.findGame(game_id, data.nick, data.size);

            let game_json = JSON.stringify({"game":game_id});
            //console.log(game_id);
            //console.log(game_json);

            console.log("writing headers");

            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });

            response.write(game_json);

            response.end();

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

}

function hashing(val) {
    let hash = crypto
               .createHash('md5')
               .update(val)
               .digest('hex');
    return hash;
}
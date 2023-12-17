// TODO: error checking, game logging

const crypto = require('crypto');

module.exports.f = function (request, response){
    console.log('join requested');

    if (request.method == 'POST') {
        console.log("Is post");

        let data_req = "";

        //store the data send by request
        request.on('data', function(chunk) {
            //console.log("Received body data:");
            data_req += chunk;
            //console.log(data_req);
        });

        //process the data after everything is received
        request.on('end', function(){

            //console.log(data_req);
            
            let game_id = JSON.stringify({"game":hashing(data_req)});
            console.log(game_id);

            console.log("writing headers");

            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });

            response.write(game_id);

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

}

function hashing(val) {
    let hash = crypto
               .createHash('md5')
               .update(val)
               .digest('hex');
    return hash;
}
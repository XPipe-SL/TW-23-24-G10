const fsp = require('fs').promises;

module.exports.f = function (request, response){
    console.log(request);
    console.log('ranking requested');
    if (request.method == 'POST') {
        let data_req = "";
        let data_j;
        let resp_stat;
        let size;
        let rows;
        let columns;
        //store the data send by request
        request.on('data', function(chunk) {
              data_req += chunk;
              console.log(data_req);
            });
        //process the data after everything is received
        request.on('end', function(){
            //console.log('request complete')
            data_j = JSON.parse(data_req);

            //deal with data in file 
            //data structured like:
            //{rowsxcollumns: [{"nick": nick1, "games": #games, "victories": #victories},
            //                  {"nick": nick2, "games": #games, "victories": #victories} ...
            //                  ]
            //}
            fsp.readFile('./files/ranking.txt','utf8')
                .then( (data) => { 
                    const data_file = JSON.parse(data.toString());
                    //get data for the right dimensions

                });

            /*Content-Type: application/json
            Transfer-Encoding: chunked
            Connection: keep-alive
            Cache-Control: no-cache
            Access-Control-Allow-Origin: * */
        });
    };
    if (request.method == 'OPTIONS') {
        response.writeHead(204, {"Access-Control-Allow-Methods": "GET, POST, OPTIONS"})
    };
};
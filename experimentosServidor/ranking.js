//missing: parts of error handling
const fsp = require('fs').promises;

module.exports.f = function (request, response){
    //console.log(request);
    console.log('ranking requested');
    if (request.method == 'POST') {
        let data_req = "";
        let data_j;
        let resp_stat=500;
        let rows;
        let columns;
        let dim;
        let to_write;
        //store the data send by request
        request.on('data', function(chunk) {
              data_req += chunk;
            });
        //process the data after everything is received
        request.on('end', function(){
            //console.log('request complete')
            data_j = JSON.parse(data_req);
            //data looks like: {"group":10,"size":{"rows":6,"columns":5}}
            rows = data_j.size.rows;
            columns = data_j.size.columns;
            dim = String(rows) + "x" + String(columns);
            //deal with data in file 
            //data structured like:
            //{rowsxcolumns: {"ranking": [{"nick": nick1, "games": #games, "victories": #victories},
            //                  {"nick": nick2, "games": #games, "victories": #victories} ...
            //                  ]}
            //}
            fsp.readFile('./files/ranking.txt','utf8')
                .then( (data) => { 
                    //console.log("File read complete");
                    const data_file = JSON.parse(data.toString());
                    //check if data for the right dimensions already exists
                    //if no, send back empty response (I guess?)
                    console.log("Checking dimensions");
                    if (data_file[dim]==undefined) {
                        console.log("no data for dimensions jet")
                        to_write = JSON.stringify({"ranking":[]});
                        //response.write(JSON.stringify({}))
                        resp_stat = 200;
                    }
                    //if yes, send back the data
                    else {
                        console.log("sending data for requested dimensions")
                        //limit response to 10 entries
                        let ranking = data_file[dim].ranking;
                        if (ranking.length > 10) {ranking = ranking.slice(0,10)}
                        to_write = JSON.stringify({"ranking":ranking});

                        resp_stat = 200;
                    }

                })
                .then(() => {
                    console.log("writing headers");
                    response.writeHead(resp_stat, {"Access-Control-Allow-Origin": "*",
                                                     "Cache-Control": "no-cache",
                                                     "Connection": "keep-alive"
                                                 });
                    response.write(to_write);
                    //console.log(response);
                })
                .then(()=>{
                    console.log("ending response");
                    response.end();})
                .catch( (err) => {console.log(err.message)  } )
        });
    };
    if (request.method == 'OPTIONS') {
        response.writeHead(204, {"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                            "Access-Control-Allow-Origin":"null",
                            "Access-Control-Allow-Headers":"content-type",
                            "Vary": "Accept-Encoding, Origin"
                            })
        response.end(); 

    };
};
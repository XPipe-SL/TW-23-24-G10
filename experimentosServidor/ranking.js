const fsp = require('fs').promises;

module.exports.f = function (request, response){
    console.log(request);
    console.log('ranking requested');
    if (request.method == 'POST') {
        let data_req = "";
        let data_j;
        let resp_stat;
        request.on('data', function(chunk) {
              data_req += chunk;
              //console.log(data_req);
            });
        request.on('end', function(){
            //console.log('request complete')
            data_j = JSON.parse(data_req);
            fsp.readFile('./files/ranking.txt','utf8')
                .then( (data) => { 
                    const data_file = JSON.parse(data.toString());
                }
        };
    };
};
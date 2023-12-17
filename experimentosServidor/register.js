//missing: parts of error handling
const crypto = require('crypto');
const fsp = require('fs').promises;

module.exports.f = function (request, response){
    console.log('register requested');
    if (request.method == 'POST') {
        let data_req = "";
        let data_j;
        let nick;
        let pw;
        let resp_stat;
        let pw_h;
        //store the data send by request
        request.on('data', function(chunk) {
              //console.log("Received body data:");
              data_req += chunk;
              //console.log(data_req);
            });
        //process the data after everything is received
        request.on('end', function(){
            //console.log('request complete')
            data_j = JSON.parse(data_req);
            //console.log(data_j);
            nick = data_j.nick;
            pw = data_j.password;
            //console.log(pw);
            //console.log(nick);
            pw_h = hashing(pw);
            //console.log(pw_h);
            //read file
            fsp.readFile('./files/login.txt','utf8')
                .then( (data) => { 
                    const data_file = JSON.parse(data.toString());
                    //console.log(data_file);
                    //check if nick exists as key                    
                    //if no, make new entry with nick as key and pw as value
                    if (data_file[nick] == undefined) {
                        console.log('no entry jet');
                        data_file[nick] = pw_h;
                        //console.log(data_file);
                        fsp.writeFile('./files/login.txt', JSON.stringify(data_file));
                        resp_stat = 200;
                    }
                    //if yes, check if pw is correct
                    else if(data_file[nick] == pw_h){
                        console.log('pw correct');
                        resp_stat = 200;
                    }
                    else{ 
                        console.log('pw wrong');
                        resp_stat = 400;
                    }
                })
                .then(() => {  //something weird is happening here
                    if (resp_stat == undefined) {resp_stat = 500;}
                    response.writeHead(resp_stat, {'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache'});
                })
                .then(()=>{response.end()})
                .catch( (err) => {console.log('Error while loading data')  } )

        });
        request.on('error', (err) => {console.log(err.message);})        

}};

function hashing(val){
    let hash = crypto
               .createHash('md5')
               .update(val)
               .digest('hex');
    return hash;
}
const http = require('http');
const path = require('path');
const url  = require('url');
const fs   = require('fs');
const conf = require('./conf.js'); 
const register = require('./register.js'); 
const join = require('./join.js'); 
const notify = require('./notify.js')
const update = require('./update.js')
const leave = require('./leave.js')
const ranking = require('./ranking.js')

http.createServer((request,response) => {
    // console.log(request.method);
    switch(request.url) { 
    case '/register':
        register.f(request,response);
        //response.end();
        break;
    case '/join':
        join.f(request, response);
        //response.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache'});
        //response.end('Joining not possible yet');
        break;
    case '/notify':
        notify.f(request, response);
        response.end('notify not possible yet');
        break;
    case '/update':
        update.f(request, response);
        response.end('update not possible yet');
        break;
    case '/leave':
        leave.f(request,response);
        response.end('leaving not possible yet');
        break;
    case '/ranking':
        ranking.f(request, response);
        //response.end('ranking not possible jet')
        break;
    default:
        response.writeHead(501); 
        response.end('Not implemented');    
    }

}).listen(conf.port);
console.log('Server listening on Port ' + conf.port); 	










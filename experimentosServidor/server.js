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
    switch(request.url) { 
    case '/register':
        register.f(request,response);
        //response.end();
        break;
    case '/join':
        join.f(request, response);
        response.end('Joining not possible jet');
        break;
    case '/notify':
        notify.f(request, response);
        response.end('notify not possible jet');
        break;
    case '/update':
        update.f(request, response);
        response.end('update not possible jet');
        break;
    case '/leave':
        leave.f(request,response);
        response.end('leaving not possible jet');
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










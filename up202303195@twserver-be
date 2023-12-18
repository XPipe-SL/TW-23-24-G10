const http = require('http');
const path = require('path');
const url  = require('url');
const fs   = require('fs');
const conf = require('./server/conf.js'); 
const register = require('./server/register.js'); 
const join = require('./server/join.js'); 
const notify = require('./server/notify.js')
const update = require('./server/update.js')
const leave = require('./server/leave.js')
const ranking = require('./server/ranking.js')

http.createServer((request,response) => {
    // console.log(request.method);
    //console.log(request.url);

    let parsedUrl = url.parse(request.url);
    let pathname = parsedUrl.pathname;
    let query = parsedUrl.query;

    //console.log(pathname);
    //console.log(query);

    switch(pathname) { 
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
        //response.end('notify not possible yet');
        break;
    case '/update':
        update.f(query, request, response);
        response.end('update not possible yet');
        break;
    case '/leave':
        leave.f(request,response);
        //response.end('leaving not possible yet');
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










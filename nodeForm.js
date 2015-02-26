var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring');
 
var server = http.createServer(function (req,res){
    var url_parts = url.parse(req.url,true);
    //console.log(url_parts);
    
    var body = '';
    //Need case possiblity for both registration and regular login
    if(req.method === 'POST'){
      // res.end('post');
      console.log('Request found with POST method');     
        req.on('data', function (data) {
            body += data;
            //console.log('got data:'+data);
        });
        req.on('end', function () {
            res.write('<!doctype html>\n<html lang="en">\n' +
               '<head>\n<meta charset="utf-8">');
            var POST = qs.parse(body);
            // use POST
            var arr= JSON.parse(POST.array);
            res.write('<h4>Array</h4>');
            for (var i=0; i<arr.length; i++){
                res.write(i+"th thing:{time: "+ arr[i].time+ " KeyUpDown: "+ arr[i].keyUpDown+", KeyPress: "+arr[i].keyPress+"}<br>"); 
            }
        res.end("<br>" +"Sent data are name:"+POST.username+" password:"+POST.password);

 
        });

       
    } else {
    console.log('Request found with GET method');     
    req.on('data',function(data){ res.end(' data event: '+data);});
    if(url_parts.pathname == '/')
        
    fs.readFile('./test.html',function(error,data){ 
    console.log('Serving the page test.html');
    res.end(data);    
    });
 
    else if(url_parts.pathname == '/getData'){
         console.log('Serving the Got Data.');
        getData(res,url_parts);
    }
    }
 
});
server.listen(8080);
console.log('Server listenning at localhost:8080');
 
 
 
function  getData(res,url_parts){

 console.log("Data submitted by the user username:"+url_parts.query.username+" and password:"+url_parts.query.password);
        res.end("Data submitted by the user username:"+url_parts.query.username+" and password:"+url_parts.query.password);
}

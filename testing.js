var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    file = "doubleCheckDatabase.db",
    exists = fs.existsSync(file);

//Check to see if the database already exists
if(!exists){
  console.log("Creating DB file.");
  fs.openSync(file,"w");
}

var sqlite3 = require("sqlite3").verbose(),
    db = new sqlite3.Database(file);

//If the database file does not exist it will create the user table for the database
if(!exists){
  db.run("create table users(id integer primary key not null, username varchar(20) not null, password varchar(20) not null, array varchar(400) not null)");
}
db.close();
var server = http.createServer(function (req,res){
  var url_parts = url.parse(req.url,true);
  //console.log(url_parts);

  var body = '';
  if(req.method === 'POST'){
    if(req.url == '/getData'){
      db2 = new sqlite3.Database(file);
 
      console.log('Request found with POST method');     
      req.on('data', function (data) {
        body += data;
        //console.log('got data:'+data);
        var POST = qs.parse(body);
        // use POST
        var arr= JSON.parse(POST.array);
        var str = 'Select password, array from users where username = "'  + POST.username + '"';  
        var dbOutput =0;
        res.write('<!doctype html>\n<html lang="en">\n' +
          '<head>\n<meta charset="utf-8">');
        db2.get(str, function(err, row) {
          if (err) {
            dbOutput = 4;
            console.log("Something went wrong");
            db2.close();
            res.write("<h1>SOMETHING WENT WRONG!!! NEED TO REDIRECT YOU BACK TO THE LOGIN PAGE</h1>");
            throw err;
          }
          if (row.length == 0){
            dbOutput = 3;
            console.log("Your username was incorrect");
            db2.close();
            res.write("<h1>YOUR USERNAME WAS INCORRECT!!! NEED TO REDIRECT YOU BACK TO THE LOGIN PAGE</h1>");
          }
          else if(row.password != POST.password) {
            dbOutput = 1;
            console.log("Your password is incorrect");
            db2.close();
            console.log("Before h1 tag");
            res.write("<h1>YOUR PASSWORD WAS INCORRECT!!! NEED TO REDIRECT YOU BACK TO THE LOGIN PAGE</h1>");
            console.log("After h1 tag");
          }
          else {
            var dbArray = JSON.parse(row.array);
            db2.close();
            console.log("dbArray:");
            console.log(dbArray);
            console.log ("Recent Array");
            console.log( arr);
            var keyPressDelta =0;
            var keyUpDownDelta = 0;
            if(dbArray.length == arr.length || arr.length > dbArray.length){
              for (var i=0; i<dbArray.length; i++){
                keyUpDownDelta += Math.abs(dbArray[i].keyUpDown - arr[i].keyUpDown); 
                keyPressDelta += Math.abs(dbArray[i].keyPress - arr[i].keyPress);
              }
              console.log("KeyPressDelta: " + keyPressDelta);
              console.log("KeyUpDownDelta " + keyUpDownDelta);
              if (keyUpDownDelta <= 300  && keyPressDelta <= 500){
                dbOutput=0;
                console.log("You have successfully logged in");
                res.write("<h1>You have successfully logged in</h1>");

              }
              else{
                dbOutput =1;
                console.log("Your times were too far off");
                res.write("<h1> Your times were too far off. You need to try to log back in again</h1>");
              }
            }
            else{
              dbOutput=2;
              res.write("<h1>Array length were not the same</h1>");
              console.log("Array lengths were not the same");
            }

              console.log("dbOutput: "+dbOutput);
          }
            });
          });

          req.on('end', function () {
            var POST = qs.parse(body);
            var arr = JSON.parse(POST.array);

            res.write('<h4>Array</h4>');
            for (var i=0; i<arr.length; i++){
              res.write(i+"th thing:{time: "+ arr[i].time+ " KeyUpDown: "+ arr[i].keyUpDown+", KeyPress: "+arr[i].keyPress+"}<br>"); 
            }

            setTimeout(function (){res.end("<br>" +"Sent data are name:"+POST.username+" password:"+POST.password);},2000);
            console.log("Last line of text");
          });
        }
        else if(req.url == '/getRegister'){
          console.log('We have hit the registration post page');
          req.on('data', function(data){
            body+= data;
          });
          req.on('end', function(){
            res.write('<!doctype html>\n<html lang="en">\n' +
              '<head>\n<meta charset="utf-8">');
            var POST = qs.parse(body);
            db2 = new sqlite3.Database(file);
            //Should have all the post data
            var arr1 = JSON.parse(POST.array1);
            var arr2 = JSON.parse(POST.array2);
            var arr3 = JSON.parse(POST.array3);
            var arr4 = JSON.parse(POST.array4);
            var arr5 = JSON.parse(POST.array5);
            var arr6 = JSON.parse(POST.array6);
            var arr7 = JSON.parse(POST.array7);
            var arr8 = JSON.parse(POST.array8);
            var arr9 = JSON.parse(POST.array9);
            var arr10 = JSON.parse(POST.array10);

            var listOfArrays = [];
            listOfArrays.push(arr1);
            listOfArrays.push(arr2);
            listOfArrays.push(arr3);
            listOfArrays.push(arr4);
            listOfArrays.push(arr5);
            listOfArrays.push(arr6);
            listOfArrays.push(arr7);
            listOfArrays.push(arr8);
            listOfArrays.push(arr9);
            listOfArrays.push(arr10);
            ;
            res.write('<h2> You have sucessfully registered for an account with double check</h2>');
            res.write('<h3> Here is what your typing looked like to the computer:</h3>');

            res.write('<br><h5>1st</h5>');
            for (var i=0; i<arr1.length; i++){
              res.write("{time: "+ arr1[i].time+ " KeyUpDown: "+ arr1[i].keyUpDown+", KeyPress: "+arr1[i].keyPress+"}");
            }
            res.write('<br><h5>2nd</h5>');
            for (var i=0; i<arr2.length; i++){
              res.write("{time: "+ arr2[i].time+ " KeyUpDown: "+ arr2[i].keyUpDown+", KeyPress: "+arr2[i].keyPress+"}");
            }
            res.write('<br><h5>3rd</h5>');
            for (var i=0; i<arr3.length; i++){
              res.write("{time: "+ arr3[i].time+ " KeyUpDown: "+ arr3[i].keyUpDown+", KeyPress: "+arr3[i].keyPress+"}");
            }
            res.write('<br><h5>4th</h5>');
            for (var i=0; i<arr4.length; i++){
              res.write("{time: "+ arr4[i].time+ " KeyUpDown: "+ arr4[i].keyUpDown+", KeyPress: "+arr4[i].keyPress+"}");
            }
            res.write('<br><h5>5th</h5>');
            for (var i=0; i<arr5.length; i++){
              res.write("{time: "+ arr5[i].time+ " KeyUpDown: "+ arr5[i].keyUpDown+", KeyPress: "+arr5[i].keyPress+"}");
            }
            res.write('<br><h5>6th</h5>');
            for (var i=0; i<arr6.length; i++){
              res.write("{time: "+ arr6[i].time+ " KeyUpDown: "+ arr6[i].keyUpDown+", KeyPress: "+arr6[i].keyPress+"}");
            }
            res.write('<br><h5>7th</h5>');
            for (var i=0; i<arr3.length; i++){
              res.write("{time: "+ arr7[i].time+ " KeyUpDown: "+ arr7[i].keyUpDown+", KeyPress: "+arr7[i].keyPress+"}");
            }
            res.write('<br><h5>8th</h5>');
            for (var i=0; i<arr4.length; i++){
              res.write("{time: "+ arr8[i].time+ " KeyUpDown: "+ arr8[i].keyUpDown+", KeyPress: "+arr8[i].keyPress+"}");
            }
            res.write('<br><h5>9th</h5>');
            for (var i=0; i<arr9.length; i++){
              res.write("{time: "+ arr9[i].time+ " KeyUpDown: "+ arr9[i].keyUpDown+", KeyPress: "+arr9[i].keyPress+"}");
            }
            res.write('<br><h5>10th</h5>');
            for (var i=0; i<arr10.length; i++){
              res.write("{time: "+ arr10[i].time+ " KeyUpDown: "+ arr10[i].keyUpDown+", KeyPress: "+arr10[i].keyPress+"}");
            }

            res.write("<br><p>Username:"+ POST.username+"</p>"); 

            var sumofKeyUp =0;
            var sumofKeyPress =0;
            var lastArray = [];
            for (var i=0; i<arr1.length; i++){
              for (var k=0; k<10; k++){
                var thing = listOfArrays[k];;
                sumofKeyUp +=  thing[i].keyUpDown;
                sumofKeyPress += thing[i].keyPress;
                console.log("SumofKeyUp: " + sumofKeyUp+ ", SumofKeyPress: "+ sumofKeyPress);
              }
              console.log(i+  "round through arrays");
              sumofKeyUp /= 10;
              sumofKeyPress /= 10;
              lastArray.push({keyUpDown: sumofKeyUp, keyPress: sumofKeyPress});  
              sumofKeyUp = 0;
              sumofKeyPress =0;
            }
            var dbArray = JSON.stringify(lastArray);
            //Insert lastArray into database
            db2.run("Insert into users (username,password,array) values ($username, $password,$array)",{
              $username: POST.username,
              $password: POST.password1,
              $array: dbArray
            });

            db2.close;
            res.write('<h4>Average Array</h4>');
            for (var i=0; i<lastArray.length;i++){
              res.write("{KeyUpDown: " +lastArray[i].keyUpDown + ", KeyPress: " + lastArray[i].keyPress+ "}");
            }
            console.log("Created user: "+ POST.username + " with password: " + POST.password1 + " and array: "+dbArray);
            res.end("");
          });


        }
        else{
          req.on('data', function(data){
            body+= data;
          });
          res.end("404 Not Found");
        }
      }
      else {
        console.log('Request found with GET method');     
        req.on('data',function(data){ res.end(' data event: '+data);});
        if(url_parts.pathname == '/'){

          fs.readFile('./test.html',function(error,data){ 
            console.log('Serving the page test.html');
            res.end(data);    
          });
        }
        else if(url_parts.pathname == '/registration'){
          fs.readFile('./register.html',function(error,data){
            console.log('Serving the page registration.html');
            res.end(data);
          }
          );}
        else if(url_parts.pathname == '/getRegister'){
          console.log('Sent registration data');
          getRegister(res,url_parts);
        }
        else if(url_parts.pathname == '/getData'){
          console.log('Serving the Got Data.');
          getData(res,url_parts);
        }
      }
    });
    server.listen(8000);
    console.log('Server listenning at localhost:8000');



    function  getData(res,url_parts){

      console.log("Data submitted by the user username:"+url_parts.query.username+" and password:"+url_parts.query.password);
      res.end("Data submitted by the user username:"+url_parts.query.username+" and password:"+url_parts.query.password);
    }

    function getRegister(res,url_parts){
      console.log("Data submitted by the user password 10 time:"+ url_parts.query.password1);
    }

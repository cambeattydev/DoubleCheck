function doubleCheck() {
  this.fs = require('fs');
  this.file = "doubleCheckDatabaseTest.db";
  this.exists = this.fs.existsSync(this.file);
  //Check to see if database already exists if it does not, create it
  //Create a user with the time array that was proided by the user
  //Array must have at least two times arrays inside of it
  this.createUser = function createUser(username,times, callback){
    console.log("Starting creating a user");
    var recievedArray = JSON.parse(times),
        sumofKeyUp =0,
        sumofKeyPress=0,
        dbArray=[],
        sqlite3 = require("sqlite3").verbose(),
        db = new sqlite3.Database(this.file);

    //Pick an indvidual array from the large array and use its length
    for (var i=0; i<recievedArray[0].length;i++){
      //Go through all arrays in the large array
      for (var j=0; j<recievedArray.length; j++){
        sumofKeyUp += recievedArray[j][i].keyUpDown;
        sumofKeyPress += recievedArray[j][i].keyPress;
      }
      //How many items in the array will be 
      sumofKeyUp /= recievedArray.length;
      sumofKeyPress /= recievedArray.length;
      //Add averaged times for item at postion i to the array to push to database
      dbArray.push({keyUpDown: sumofKeyUp, keyPress: sumofKeyPress});
      //Reset the sum for the next item in the array
      sumofKeyUp=0;
      sumofKeyPress=0;
    }
    console.log("dbArray: " + dbArray);
    //Create JSON String of Array to insert into database
    var sentArray = JSON.stringify(dbArray);
    //Send JSON string into array with username given
    db.run("Insert into users (username,array) values ($username, $array)",{
      $username: username,
      $array: sentArray
    },function(err){ //Return null if everything went ok, otherwise developer must try again
      if (err == null){
        db.close();
        callback(0);
        console.log("Added user: " + username + " to the database");
      }
      else{
        db.close();
        callback(1);
      }
    });
  }
  //Check to see if the user is in the time constraints on the database
  this.checkUser =  function(username, checkArray, callback){
    console.log("Checking user");
    var recievedArray = JSON.parse(checkArray),
        sqlite3 = require("sqlite3").verbose(),
        db =  new sqlite3.Database(this.file);
    var str = 'Select array from users where username = "'  + username + '"';
    //Return the array of the user described
    db.get(str, function(err,row){
      //Some error has resulted from the get function
      if (err){
        console.log(err);
        db.close();
        callback();
        return;
      }
      //The username specified is not in the database
      if (row == undefined){
        var errorNumber = 4;
        console.log("The username provided does not match any uernames in the database");
        db.close();
        callback(errorNumber);
        return;
      }
      //Array has been found and returned
      else{
        var sumofKeyUp = 0,
            sumofKeyPress = 0,
            dbArray = JSON.parse(row.array),
            keyPressDelta =0,
            keyUpDownDelta =0;
        //Check if the array are same size or the login array will have an enter key
        //pushed in there as well
        if (dbArray.length == recievedArray.length || recievedArray.length ==  dbArray.length + 1){
          for (var i=0; i<dbArray.length; i++){
            var keyUpDownSmall = Math.abs(dbArray[i].keyUpDown - recievedArray[i].keyUpDown);
            var keyPressSmall = Math.abs(dbArray[i].keyPress - recievedArray[i].keyPress);
            keyUpDownDelta += keyUpDownSmall;
            keyPressDelta += keyPressSmall;
            //Make sure that times each level is within time constraints
            if ( keyUpDownSmall > 250 || keyPressSmall > 150){
              var errorNumber = 2;
              console.log("Times between each level of the array are too far off");
              console.log("---------------------- "+ i+ "th time through ----------------------");
              console.log("KeyUpDownSmall: "+keyUpDownSmall);
              console.log("KeyPressSmall: "+keyPressSmall);
              db.close();
              callback(errorNumber);
              return;
            }
          }
          //The overall times of both keyPress and keyUpDown must be between the
          //numbers stated below
          if (keyUpDownDelta <= 500 && keyPressDelta <= 650){
            var errorNumber = 0;
            console.log("---------------------- Successfull Login ----------------------");
            console.log("KeyPressDelta: " + keyPressDelta);
            console.log("KeyUpDownDelta " + keyUpDownDelta);
            db.close();
            callback(errorNumber);
            return;
          }
          else{
            var errorNumber = 1;
            console.log("---------------------- Overall Times too Big ----------------------");
            console.log("KeyPressDelta: " + keyPressDelta);
            console.log("KeyUpDownDelta " + keyUpDownDelta);
            db.close();
            callback(errorNumber);
            return;
          }
        }
        else{
          var errorNumber = 3;
          console.log("The array lengths were not similar to each other");
          db.close();
          callback(errorNumber);
        }
      }
    });
  }
  //Allow developer to remove a user from the database
  this.deleteUser = function(username,callback){
    console.log("Deleteing " + username + " from database");
    var sqlite3 = require("sqlite3").verbose(),
        db =  new sqlite3.Database(this.file);
    //Delte user from database with the specified username
    db.run('Delete from users where username = $username', {
      $username: username},
      function(err) {
        // Everything went fine
        if (err == null) {
          console.log("Deleted " + username+ " from database,");
          db.close();
          callback(0);
        }
        //Some error happened let developer know
        else{
          console.log(err);
          db.close();
          callback(1);
        }
      });
  }

  //When a user resets a password, developer should use this function
  //Same as create except it will delete a previous instance of the user
  //Used with user already exists in the database system
  this.updateUser = function(username,array, callback){
    console.log("Modifying user: " + username);
    var recievedArray = JSON.parse(array),
        sumofKeyUp =0,
        sumofKeyPress=0,
        dbArray=[],
        sqlite3 = require("sqlite3").verbose(),
        db = new sqlite3.Database(this.file);

    //Pick an indvidual array from the large array and use its length
    for (var i=0; i<recievedArray[0].length;i++){
      //Go through all arrays in the large array
      for (var j=0; j<recievedArray.length; j++){
        sumofKeyUp += recievedArray[j][i].keyUpDown;
        sumofKeyPress += recievedArray[j][i].keyPress;
      }
      //How many items in the array will be 
      sumofKeyUp /= recievedArray.length;
      sumofKeyPress /= recievedArray.length;
      //Add averaged times for item at postion i to the array to push to database
      dbArray.push({keyUpDown: sumofKeyUp, keyPress: sumofKeyPress});
      //Reset the sum for the next item in the array
      sumofKeyUp=0;
      sumofKeyPress=0;
    }
    //Create JSON String of Array to insert into database
    var sentArray = JSON.stringify(dbArray);
    //Send JSON string into array with username given
    db.run('UPDATE users SET array = $array where username = $username',
        {
          $username: username,
          $array: sentArray
        }, function(err)
        {
          //Everything went fine
          if (err == null){
            console.log("Updated user: " + username + " to array: "+ array);
            db.close();
            callback(0);
          }
          //Might be a way to tell if the username exists?
          //Currently something went wrong
          else{
            console.log(err);
            db.close();
            callback(1);
          }
        });
  }

}

  var test = new doubleCheck();
  var jokeArray = [0,1,2,3];
  var jsonArray = JSON.stringify(jokeArray);
/*test.createUser("test",jsonArray, function(worked)
      {
        console.log("Create user error: "+ worked);
      });*/
 /* test.checkUser("test", jsonArray,function(err)
      { 
        console.log("Check user error: "+ err);
      });*/
/*test.deleteUser("test", function(err)
      {
        console.log("Delete user error: " + err);
      });*/
var newArray = [ [{ keyUpDown: 79.4, keyPress: 0 },
                  { keyUpDown: 95.9, keyPress: 153.2 },
                  { keyUpDown: 74.3, keyPress: 201.7 },
                  { keyUpDown: 79.9, keyPress: 152.9 },
                  { keyUpDown: 81.4, keyPress: 163.2 },
                  { keyUpDown: 67, keyPress: 142.4 },
                  { keyUpDown: 63, keyPress: 115.9 },
                  { keyUpDown: 79.7, keyPress: 213.8 } ],
                 [{ time: 1426805322065, keyUpDown: 112, keyPress: null },
                  { time: 1426805322233, keyUpDown: 96, keyPress: 168 },
                  { time: 1426805322369, keyUpDown: 96, keyPress: 136 },
                  { time: 1426805322529, keyUpDown: 72, keyPress: 160 },
                  { time: 1426805322673, keyUpDown: 88, keyPress: 144 },
                  { time: 1426805322769, keyUpDown: 72, keyPress: 96 },
                  { time: 1426805322913, keyUpDown: 72, keyPress: 144 },
                  { time: 1426805323057, keyUpDown: 80, keyPress: 144 } ]];
var newJsonArray = JSON.stringify(newArray);

/*test.updateUser("test", newJsonArray, function(err)
      {
          console.log("UpdateUser error: "+ err);
      });*/

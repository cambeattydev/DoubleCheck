window.onload = function (){
  var passwords = document.getElementsByClassName("password");
  //console.log("Passwords.length: " + passwords.length);
  //Walk through array containing elements with class="password"
  for (var i=0; i<passwords.length; i++){
    passwords[i].addEventListener("keydown", getFirstTimeStamp);
    passwords[i].addEventListener("keyup", getSecondTimeStamp);
    passwords[i].addEventListener("blur" , doubleCheck);
    //console.log(passwords[i]);
  }
  var buttons = document.getElementsByClassName("button");
  buttons[0].addEventListener("click", sendArray);
  var forms = document.getElementsByClassName("doubleCheckForm");
  forms[0].addEventListener("submit", checkEqual,true);
}

times1 = [];
time1=0;
bigArray = [];

function getFirstTimeStamp(){
  time1 = Date.now();
}

function getSecondTimeStamp(e){
  console.log("in Second time stamp functon with event " + e.keyCode);
  var time2 = Date.now();
  getTimeDifference(time1,time2,e);
}

function getTimeDifference(time1, time2,e){
  var difference = time2- time1;
  if (e.keyCode != 9){
    if (times1.length > 1){
      if (e.keyCode != 8 ){
        var thing = times1[times1.length-1].time;
        var diff = time1 - times1[times1.length -1].time;
        //console.log("Thing: " + thing);
        //console.log("Diff: " + diff);
        times1.push({time: time1, keyUpDown: difference, keyPress: diff});
      }
      else{
        times1.pop();
        console.log("Item has been deleted");
        times1[times1.length -1].time = time1;
      }
    }
    else if (times1.length ==1){
      if (e.keyCode != 8){
        var thing = times1[times1.length-1].time;
        var diff = time1-times1[times1.length-1].time;
        console.log("Diff: " + diff);
        times1.push({time: time1, keyUpDown: difference, keyPress: diff});
      }
      else{
        times1.pop();
        console.log("The last item has been removed");
      }
    }
    else{
      if(e.keyCode != 8){
        times1.push({time: time1, keyUpDown: difference, keyPress: null});
      }
      else{
        //console.log("There is nothing in the array to delete");
      }
    }
  }
  else{
    console.log("Tab was pressed");
  }
}

//Need better name
function doubleCheck(){
  //Push the times into the bigArray
  if (times1.length != 0){
    //console.log("-----------------------------------------");
    //console.log("{");
    /*for(var i=0; i< times1.length; i++){
      console.log("[times1["+i+"].keyUpDown: " + times1[i].keyUpDown+ ", times1["+i+"].keyPress: "+times1[i].keyPress+"]");
      }
      console.log("}");*/
    bigArray.push(times1);
    console.log("{");

    for (var i=0; i<bigArray.length;i++){
      console.log(bigArray[i].toString());
    }
    console.log("}");
    times1=[];
  }
  else{
    console.log("There was nothing there");
  }
}

function checkEqual(e) {
  //Check if the size of each array is equal
  if (bigArray.length < 2){
    alert('Nothing was put into the bigArray'); 
    e.preventDefault();
  }
  else{
    for (var i=1; i < bigArray.length; i++){
      if (bigArray[0].length != bigArray[i].length || bigArray[i].length == 0){
        alert('Passwords do not match. Re enter them or the bigArray contained nothing at some point');
        bigArray.length = 0;
        times1.length = [];      
        var passwords = document.getElementsByClassName("password");
        console.log("Passwords.length: " + passwords.length);
        //Walk through array containing elements with class="password" to clear the values in text box
        for (var i=0; i<passwords.length; i++){
          passwords[i].value = "";
        }
        e.preventDefault();
      }
    }
  }

}

function sendArray(){
  if (times1.length != 0){
    bigArray.push(times1);
  }
  //Create hidden field the form
  var forms = document.getElementsByClassName("doubleCheckForm");
  var form1 = forms[0];
  //console.log("form1: " + form1.innerHTML);
  //Make sure there is a form add hidden array
  if (form1 != null){
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "timesArray");
    input.setAttribute("id", "timesArray");
    form1.appendChild(input);
    //Create a array that contains all the small times array
    document.getElementById('timesArray').value = JSON.stringify(bigArray);
    //alert(JSON.stringify(bigArray));
  }

}

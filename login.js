window.onload = function (){
  var passwords = document.getElementsByClassName("password");
  console.log("Passwords.length: " + passwords.length);
  //Walk through array containing elements with class="password"
  for (var i=0; i<passwords.length; i++){
    passwords[i].setAttribute("onkeydown", "getFirstTimeStamp()");
    passwords[i].setAttribute("onkeyup", "getSecondTimeStamp(event)");
    passwords[i].setAttribute("onblur" , "doubleCheck()");
    console.log(passwords[i]);
  }
}

times = [];
time1=0;
function getFirstTimeStamp(){
  time1 = Date.now();
}

function getSecondTimeStamp(e){
  var time2 = Date.now();
  getTimeDifference(time1,time2,e);
}

function getTimeDifference(time1, time2,e){
  var difference = time2- time1;
  console.log("Time1: " + time1);
  console.log("Time2: " + time2);
  console.log("difference: " + difference);
  if (e.keyCode != 9){
    if (times.length > 1){
      if (e.keyCode != 8){
        var thing = times[times.length-1].time;
        var diff = time1 - times[times.length -1].time;
        //console.log("Thing: " + thing);
        console.log("Diff: " + diff);
        times.push({time: time1, keyUpDown: difference, keyPress: diff});
      }
      else{
        times.pop();
        console.log("Item has been deleted");
        //var oldTime = times[times.length -1 ].time;
        //console.log("OldTime: " + oldTime);
        times[times.length -1].time = time1;
        //console.log("New Time: "+ times[times.length -1].time);
      }
    }
    else if(times.length == 1){
      if(e.keyCode != 8){
        var thing = times[times.length-1].time;
        var diff = time1- times[times.length -1].time;
        //console.log("thing: " + thing);
        console.log("Diff: " + diff);
        times.push({time: time1, keyUpDown: difference, keyPress: diff});
      }
      else{
        times.pop()
          console.log("The last item has been removed");
      }

    }
    else{
      if(e.keyCode != 8){
        times.push({time: time1, keyUpDown: difference, keyPress: null});
      }
      else{
        console.log("There is nothing in the array to delete");
      }
    }
  }
  else{
    console.log("Tab was pressed");
  }
}
function sendArray(){
  //Create hidden field the form
  var forms = document.forms;
  var form1 = forms[0];
  console.log("form1: " + form1.innerHTML);
  //Make sure there is a form add hidden array
  if (form1 != null){
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "array");
    input.setAttribute("id", "array");
    form1.appendChild(input);
    document.getElementById('array').value = JSON.stringify(times);
  }
}


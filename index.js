"use strict";
/********************/
/****ServerCode*****/
/******************/
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
app.use('/dueapi/submitTime/:st/TAT/:tat', getInput);
app.listen(port);
console.log('The DueDate Calculator RESTful API listening on port: ' + port);

/**********************************************************/
/****Reusable constant Time variables, in milliseconds****/
/********************************************************/

const oneDay = 86400000;
const oneHour = 3600000;
const cd = new Date(Date.now());
//I know, i should use callback, but i don't have any async call.
var returnJSON = "";
function getInput(req, res) {

  //The input date must be a valid UNIX time (in seconds). This way we can avoid the timezones issues.
  var inputTime = req.params.st;
  //tat as TurnAroundTime
  var tat = req.params.tat;
  var submitTime = validateInputs(inputTime, tat);
  if (submitTime) CalculateDueDate(submitTime, tat);
  res.json(returnJSON);
}

function CalculateDueDate(submitTime, tat) {
  // When i first try to modify the dueTime.unix prop, it changed the submitTime.unix prop too. Found the "clone" solution on stackoverflow.
  var dueTime = clone(submitTime);
  var hoursLeft = 0;
  var daysLeft = 0;
  var remainingHoursFirstDay = 17 - dueTime.hour;
  var lastDayHours = 0;
  var beforeHoursFirstDay = dueTime.hour - 9;
  //If the issue must be resolved before the end of the working hours, we just simply add tat*1hour(in milisec) for the unix time;
  if (tat < remainingHoursFirstDay) dueTime.unix += 3600000 * tat;
  //if the work time takes more time, than the end of the working hours, it'll be shifted to the next day's first hour
  else if (tat == remainingHoursFirstDay) {
    //jump to the last hour
    dueTime.unix += oneHour * (tat - 1);
    //jump a day further, then substract 7 workhours, to get the work start hour (9am)
    dueTime.unix += oneDay - (oneHour * 7);
  } else if (tat > remainingHoursFirstDay) {
    /*Because we can't finish the job in the first day, first we jump to the start hour of the day (minutes stays).
    We couldn't jump to the next day, because it is possible to be non-working day. We check that later*/
    dueTime.unix -= oneHour * beforeHoursFirstDay;
    //Substract the first day hours of work on the issue
    hoursLeft = tat - remainingHoursFirstDay;
    //We need the +1 because of on line 51 we jump to the start of the day, not to the next day.
    daysLeft = Math.floor(hoursLeft / 8) + 1;
    lastDayHours = hoursLeft % 8;
    while (daysLeft > 0) {
      dueTime.unix += oneDay;
      dueTime = createTimeObject(dueTime.unix);
      if (dueTime.day != 0 && dueTime.day != 6)
        daysLeft--;
      }
    dueTime.unix += lastDayHours * oneHour;
  }

  dueTime = createTimeObject(dueTime.unix);
  returnJSON = {
    submitTime: submitTime.jstime.toLocaleString(),
    dueTime: dueTime.jstime.toLocaleString(),
    submitUnixTime: submitTime.unix,
    dueUnixTime: dueTime.unix,
    tat: tat
  };
}

function validateInputs(inputTime, tat) {
  var errorText = [];
  if (isNaN(inputTime)||inputTime.length!=10) {
    errorText.push("The submitTime value is not a valid UNIX number. You give it in seconds?");
  } else if (isNaN(tat)) {
    errorText.push("The TAT value is not a number! Use only numbers, that represent hours.");
  } else {
      //convert UNIX time in seconds to UNIX time in milliseconds
      var submitTime = new Date(inputTime * 1000);
      submitTime = createTimeObject(submitTime);
      //If the submitTime is later than the current time, it's obviously invalid.
      var submitTimeIsEarlier = cd.getTime() <= submitTime.unix;
      if (submitTimeIsEarlier) errorText.push("The Time is invalid. The Date is future date.");
      //If the issue sent before 9am, or after 16:59:59, it'll be not calculated..
      else if (submitTime.hour < 9 || submitTime.hour > 16) errorText.push("A problem can only be reported during working hours.");
      //Valid work day numbers = 1,2,3,4,5;  invalid (free) days 0 (sunday), 6 (saturday)
      else if (submitTime.day == 0 || submitTime.day == 6) errorText.push("A problem can only be reported during working days.");
      else return submitTime;
    }
  if (errorText[0]) returnJSON = {error: errorText};
}

function createTimeObject(unixdate) {
  var timeobj = new Date(unixdate);
  return {jstime: timeobj, unix: timeobj.getTime(), day: timeobj.getDay(), hour: timeobj.getHours()};
}
function clone(obj) {
  //source: https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
  if (null == obj || "object" != typeof obj)
    return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr))
      copy[attr] = obj[attr];
    }
  return copy;
}

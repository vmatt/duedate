"use strict";
var errorHandler = require('./errorHandler.js')
class dueDateCalculator {
	constructor(serverRequest) {
		this.oneDay = 86400000;
		this.oneHour = 3600000;
		this.cd=new Date(Date.now());
		this.returnJSON="";
		this.getInput(serverRequest);
	}

	getInput(req, res) {
		var inputTime = req.params.st;
		var tat = req.params.tat;
		var submitTime = this.validateInputs(inputTime, tat);
		if (submitTime) this.calculateDueDate(submitTime, tat);		
	}

	calculateDueDate(submitTime, tat) {
		var dueTime = Object.assign({}, submitTime);
		var hoursLeft,daysLeft,lastDayHours = 0;
		var remainingHoursFirstDay = 17 - dueTime.hour;
		var beforeHoursFirstDay = dueTime.hour - 9;
		if (tat < remainingHoursFirstDay) dueTime.unix += this.oneHour * tat;
		else if (tat == remainingHoursFirstDay) {
			dueTime.unix += this.oneHour * (tat - 1);
			dueTime.unix += this.oneDay - (this.oneHour * 7);
		} else if (tat > remainingHoursFirstDay) {
			dueTime.unix -= this.oneHour * beforeHoursFirstDay;
			hoursLeft = tat - remainingHoursFirstDay;
			daysLeft = Math.floor(hoursLeft / 8) + 1;
			lastDayHours = hoursLeft % 8;
			while (daysLeft > 0) {
				dueTime.unix += this.oneDay;
				dueTime = this.createTimeObject(dueTime.unix);
				if (dueTime.day != 0 && dueTime.day != 6)
					daysLeft--;
				}
			dueTime.unix += lastDayHours * this.oneHour;
		}

		dueTime = this.createTimeObject(dueTime.unix);
		this.returnJSON = {
			submitTime: submitTime.jstime.toLocaleString(),
			dueTime: dueTime.jstime.toLocaleString(),
			submitUnixTime: submitTime.unix,
			dueUnixTime: dueTime.unix,
			tat: tat
		};
	}

	validateInputs(inputTime, tat) {
		var errorCases = [];
		if (isNaN(inputTime)||inputTime.length!=10) errorCases.push(0);
		else if (isNaN(tat)) errorCases.push(1);
		else {
				var submitTime = new Date(inputTime * 1000);
				submitTime = this.createTimeObject(submitTime);
				var submitTimeIsEarlier = this.cd.getTime() <= submitTime.unix;
				if (submitTimeIsEarlier) errorCases.push(2);
				else if (submitTime.hour < 9 || submitTime.hour > 16) errorCases.push(3);
				else if (submitTime.day == 0 || submitTime.day == 6) errorCases.push(4);
				else return submitTime;
			}
		if (errorCases!="") {
			errorCases = new errorHandler(errorCases);
			console.log(errorCases);
			this.returnJSON = errorCases;
		}
	}

	createTimeObject(unixdate) {
		var timeobj = new Date(unixdate);
		return {jstime: timeobj, unix: timeobj.getTime(), day: timeobj.getDay(), hour: timeobj.getHours()};
	}
}
module.exports = dueDateCalculator;
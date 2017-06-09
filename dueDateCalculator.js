/**********************/
/****BusinessCode*****/
/********************/
"use strict";
const ONEDAY = 86400000,
    ONEHOUR = 3600000;

class dueDateCalculator {
    constructor(serverRequest) {
        this.cd = new Date(Date.now());
        this.returnJSON = "";
        this.getInput(serverRequest);
    }

    getInput(req, res) {
        var inputTime = req.params.st,
            tat = req.params.tat,
            submitTime = this.validateInputs(inputTime, tat);
        if (submitTime) this.calculateDueDate(submitTime, tat);
    }

    calculateDueDate(submitTime, tat) {
        var dueTime = Object.assign({}, submitTime),
            hoursLeft, daysLeft, lastDayHours = 0,
            remainingHoursFirstDay = 17 - dueTime.hour,
            beforeHoursFirstDay = dueTime.hour - 9;
        if (tat < remainingHoursFirstDay) dueTime.unix += ONEHOUR * tat;
        else if (tat == remainingHoursFirstDay) {
            dueTime.unix += ONEHOUR * (tat - 1);
            dueTime.unix += ONEDAY - (ONEHOUR * 7);
        } else if (tat > remainingHoursFirstDay) {
            dueTime.unix -= ONEHOUR * beforeHoursFirstDay;
            hoursLeft = tat - remainingHoursFirstDay;
            daysLeft = Math.floor(hoursLeft / 8) + 1;
            lastDayHours = hoursLeft % 8;
            while (daysLeft > 0) {
                dueTime.unix += ONEDAY;
                dueTime = this.createTimeObject(dueTime.unix);
                if (dueTime.day != 0 && dueTime.day != 6)
                    daysLeft--;
            }
            dueTime.unix += lastDayHours * ONEHOUR;
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
        if (isNaN(inputTime) || inputTime.length != 10) throw "The submitTime value is not valid UNIX time. You give it in seconds?";
        else if (isNaN(tat)) throw "The TAT value is not a number! Use only numbers, that represent hours."
        else {
            var submitTime = new Date(inputTime * 1000);
            submitTime = this.createTimeObject(submitTime);
            var submitTimeIsEarlier = this.cd.getTime() <= submitTime.unix;
            if (submitTimeIsEarlier) throw "The Time is invalid. The Date is future date.";
            else if (submitTime.hour < 9 || submitTime.hour > 16) throw "A problem can only be reported during working hours.";
            else if (submitTime.day == 0 || submitTime.day == 6) throw "A problem can only be reported during working days.";
            else return submitTime;
        }
    }

    createTimeObject(unixdate) {
        var timeobj = new Date(unixdate);
        return {
            jstime: timeobj,
            unix: timeobj.getTime(),
            day: timeobj.getDay(),
            hour: timeobj.getHours()
        };
    }
}
module.exports = dueDateCalculator;
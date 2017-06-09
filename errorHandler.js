"use strict";
class errorHandler {
	constructor (errorList) {
		this.errorCases(errorList);
	}
	errorCases (errorList){
		var errorText="";
		errorList.map(function(x) {
			switch (x){
				case 0:
					errorText+=("The submitTime value is not valid UNIX time. You give it in seconds? ");
					break;
				case 1:
					errorText+=("The TAT value is not a number! Use only numbers, that represent hours. ");
					break;
				case 2:
					errorText+=("The Time is invalid. The Date is future date. ");
					break;
				case 3:
					errorText+=("A problem can only be reported during working hours. ");
					break;
				case 4:
					errorText+=("A problem can only be reported during working days. ");
					break;
			}
		});
		console.log(errorText);
		this.error=errorText;
	 }
}

module.exports = errorHandler;
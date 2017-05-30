# DueDateCalculator RESTful API
A simple RESTful app, that calculates TurnAroundTime with the use of a inputTime, and maxWorkHours parameters. The app is listening on port 3000. 

## Usage
``` http://ip:3000/dueapi/submitTime/:st/TAT/:tat```
Where ":st" (submitTime) is a prevorious UNIX time (in **seconds**), ":tat" is the available work hours.

## Response
```
{
  "submitTime": "5/15/2017, 9:00:00 AM",
  "dueTime": "5/15/2017, 4:00:00 PM",
  "submitUnixTime": 1494856800000,
  "dueUnixTime": 1494856800000,
  "tat": "7"
}
```
Simple JSON object. **The UNIX times are now in milliseconds, not in seconds!**

## Testing
1. Use *npm run start* or *node index.js* command to start server.
2. Import *Emarsys tests.postman_collection.json* to Postman.
3. Run the tests :)

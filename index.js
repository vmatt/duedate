/********************/
/****ServerCode*****/
/******************/
"use strict";
var dueDateCalculator = require('./dueDateCalculator.js'),
    express = require('express');
var app = express(),
    port = process.env.PORT || 8080;
app.use('/dueapi/submitTime/:st/TAT/:tat', params)
app.listen(port);
console.log('The DueDate Calculator RESTful API listening on port: ' + port);

function params(req, res) {
    var dueData = new dueDateCalculator(req);
    res.json(dueData.returnJSON);
}
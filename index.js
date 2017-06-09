"use strict";
var dueDateCalculator = require('./dueDateCalculator.js');
var express = require('express');
/********************/
/****ServerCode*****/
/******************/
  let app = express();
  let port = process.env.PORT || 3000;
  app.use('/dueapi/submitTime/:st/TAT/:tat', params)
  app.listen(port);
  console.log('The DueDate Calculator RESTful API listening on port: ' + port);

function params(req,res){
  var dueData = new dueDateCalculator(req);
  res.json(dueData.returnJSON);
}
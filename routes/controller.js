var express = require('express');
var router = express.Router();
var ketUtils = require('./util');
var bodyParser = require('body-parser');

var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger('indexRoute');
//只有这个等级以上的等级才会被打印出来
logger.setLevel('DEBUG');


module.exports = router;

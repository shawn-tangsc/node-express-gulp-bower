var express = require('express');
var config = require('../config/config.js');
var serverBaseUrl = config.ADDRESS.url;
var router = express.Router();
var Utils = require('./util');
var groupHandlers = require('express-group-handlers');
var bodyParser = require('body-parser');
var requireStr =require('querystring');
var log4js = require('log4js');
log4js.configure('./config/log4js.json');

var logger = log4js.getLogger('indexRoute');
//只有这个等级以上的等级才会被打印出来
logger.setLevel('DEBUG');


groupHandlers.setup(router);

router.get('/*', function(req, res, next) {

    next();
});


module.exports = router;

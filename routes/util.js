var http = require("http");

var https = require('https');
var config = require('../config/config.js');
var serverAddress = config.ADDRESS.serverAddress;
var serverPort = config.ADDRESS.port;
var requireStr =require('querystring');
var extend = require('node.extend');
var log4js = require('log4js');

log4js.configure('./config/log4js.json');

var logger = log4js.getLogger('util');
    //只有这个等级以上的等级才会被打印出来
logger.setLevel('INFO');

var getSetCookie = function (str) {
    let set_cookie;
    let startIndex;
    let endIndex;
    startIndex = str.indexOf('set-cookie');
    if(startIndex==-1){
        return ''
    }
    set_cookie = str.substring(startIndex,str.length);
    startIndex = set_cookie.indexOf('[');
    endIndex = set_cookie.indexOf(']');
    set_cookie=set_cookie.substring(startIndex+1,endIndex);
    let result  = set_cookie.split("\",\"");
    for(let i =0;i<result.length;i++){
        result[i]=result[i].replace('"','');
    }
    return result
}


var  ajax = function (req, res, options,callBack) {
    const JSESSIONID = req.cookies.JSESSIONID;
    const KET_TOKEN = req.cookies.ket_token;
    this.defaultOptions={
        hostname:serverAddress,
        path:'',
        port:serverPort?serverPort:'',
        method:'GET',
        headers: {
             "Content-Type": 'application/json;charset=UTF-8',
        //     'Access-Control-Allow-Origin':'*',
        //     'Cookie':'JSESSIONID='+JSESSIONID+';ket_token='+KET_TOKEN
        },
        data:{}
    };

    options =extend(true, this.defaultOptions, options);
    var data=options.data;
    if(JSON.stringify(data)!="{}"){
        options.headers['Content-Length']=requireStr.stringify(data).length;
    }

    logger.info("call : ");
    logger.info(JSON.stringify(options))
    var  reqs=http.request(options,function(response){
        callBack(response);
    });
    reqs.write(requireStr.stringify(data));
    reqs.end();
}

exports.getSetCookie  =  getSetCookie ;
exports.ajax = ajax;
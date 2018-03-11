const path = require('path');
const fs = require('fs');
const request = require('request').defaults({'Connection':'Keep-Alive','Content-Type':'application/json; charset=UTF-8'});
const _config = JSON.parse(fs.readFileSync(__dirname+'/config.json','utf8'));


class configs{
    Address(option) {
        this.option = option;
        if (this.option == 'prod') {
            return {
                serverAddress: "prod.com",
                port: '',
                url:'http://www.baidu.com'
            }
        } else if (this.option == 'uat') {
            return {
                serverAddress: "uat.com",
                port: '',
                url:'http://www.baidu.com'
            }
        } else if (this.option == 'sit') {
            return {
//              serverAddress:"localhost",
                port: '80',
                url:'http://www.baidu.com'
            }
        } else{
            return {
                serverAddress:"localhost",
                port: '80',
                url:'http://localhost:80'
            }
        }
    };

    SET_SERVER(option){
            this.ADDRESS = this.Address(option);
        }
    }





const _configs = new configs();

// _configs.SET_SERVER(_config.environment);process.env.NODE_ENV
console.log('>>>>>>>>>'+process.env.NODE_ENV);
_configs.SET_SERVER(process.env.NODE_ENV);

module.exports = _configs;
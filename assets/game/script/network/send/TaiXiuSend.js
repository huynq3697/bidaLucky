// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var TaiXiuSend = {
    datcuoc(money, choice) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 12006 + SocketConstant.SEPERATOR.N4 + money + SocketConstant.SEPERATOR.ELEMENT + choice;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log('dat cuoc', tempString);
        cc.log('dat cuoc', arraySend);
        return JSON.stringify(arraySend);
    },
    
    chat(message){
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 12012 + SocketConstant.SEPERATOR.N4 + message;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log('chat', tempString);
        cc.log('chat', arraySend);
        return JSON.stringify(arraySend);
    }


};
module.exports = TaiXiuSend;

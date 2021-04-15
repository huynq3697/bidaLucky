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
var SlotSend = {
    spin(typeChoi, idHu, tienCuoc, line , lixi = 0) {
        var arraySend = {
        }
        var sendData = {
        };
        arraySend.r = [];
        var tempString = 1005 + SocketConstant.SEPERATOR.N4 + typeChoi + SocketConstant.SEPERATOR.ELEMENT + idHu + SocketConstant.SEPERATOR.ELEMENT
            + tienCuoc + SocketConstant.SEPERATOR.ELEMENT + line + SocketConstant.SEPERATOR.ELEMENT + lixi;
           
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    spinLarva(typeChoi, idHu, tienCuoc, line , lixi = 0) {
        var arraySend = {
        }
        var sendData = {
        };
        arraySend.r = [];
        var tempString = 10051 + SocketConstant.SEPERATOR.N4 + typeChoi + SocketConstant.SEPERATOR.ELEMENT + idHu + SocketConstant.SEPERATOR.ELEMENT
            + tienCuoc + SocketConstant.SEPERATOR.ELEMENT + line + SocketConstant.SEPERATOR.ELEMENT + lixi;
           
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    },
    lixi(idSpin, numberLixi) {
        var arraySend = {
        }
        var sendData = {
        };
        arraySend.r = [];
        var tempString = 1006 + SocketConstant.SEPERATOR.N4 + idSpin + SocketConstant.SEPERATOR.ELEMENT + numberLixi;

        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        cc.log(arraySend);
        return JSON.stringify(arraySend);
    }


};
module.exports = SlotSend;

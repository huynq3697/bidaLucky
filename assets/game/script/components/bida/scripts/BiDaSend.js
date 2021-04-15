var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var Linker = require('Linker');
var BiDaSend = {
    anBaiRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1126 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    bocBaiRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1125 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    guiBaiRequest(tableId, guiPlayerId, guiPhomId, cardServer, uidNguoiGui) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1128 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            guiPlayerId + SocketConstant.SEPERATOR.ELEMENT + cardServer + SocketConstant.SEPERATOR.ELEMENT + guiPhomId + SocketConstant.SEPERATOR.ELEMENT + uidNguoiGui;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    haPhomRequest(tableId, phomList = "", card = 0, uType = 0) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1127 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            + uType + SocketConstant.SEPERATOR.ELEMENT + phomList + SocketConstant.SEPERATOR.ELEMENT + card;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    phomSettingRequest(tableId, capacity, minMoney, isAn, isTai) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity
            + SocketConstant.SEPERATOR.ELEMENT + minMoney + SocketConstant.SEPERATOR.ELEMENT + isAn + SocketConstant.SEPERATOR.ELEMENT
            + 1 + SocketConstant.SEPERATOR.ELEMENT + isTai;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    turnCardRequest(zoneId, tableId, datas) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var clientErrorID = (datas.ballHit && datas.ballHit != undefined) ? datas.ballHit : 1;
        var ballTargetRotation = (datas.ballTargetRotation && datas.ballTargetRotation != undefined) ? datas.ballTargetRotation : null;
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + datas.cueStatus +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballX +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballY +
            SocketConstant.SEPERATOR.ELEMENT + datas.cueR +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballEat +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballList +
            SocketConstant.SEPERATOR.ELEMENT + clientErrorID;//nvm -1 la co loi
        if (isNaN(parseFloat(ballTargetRotation)) == false) {
            tempString = tempString + SocketConstant.SEPERATOR.ELEMENT + ballTargetRotation;
        }
        if (datas.otp) {
            tempString = tempString + SocketConstant.SEPERATOR.ELEMENT + datas.otp;
        }
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    uKhanRequest(tableId, phomList) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1127 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            + 2 + SocketConstant.SEPERATOR.ELEMENT + phomList + SocketConstant.SEPERATOR.ELEMENT + 0;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    getChatZonePage(pageIndex) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1303 + SocketConstant.SEPERATOR.N4 + 0 + SocketConstant.SEPERATOR.ELEMENT + pageIndex + SocketConstant.SEPERATOR.ELEMENT + "some"
            + SocketConstant.SEPERATOR.ELEMENT + 8;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendChatZone(message) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 1303 + SocketConstant.SEPERATOR.N4 + 1 + SocketConstant.SEPERATOR.ELEMENT + 0 + SocketConstant.SEPERATOR.ELEMENT + message + " "
            + SocketConstant.SEPERATOR.ELEMENT + 8;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    checkUserIsFriendByUID(message) {
        var arraySend = {}
        var sendData = {};
        arraySend.r = [];
        var tempString = 73 + SocketConstant.SEPERATOR.N4 + message.userId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendChatPrivate(str) {
        var data = { r: [] };
        data.r.push({ v: str });
        return JSON.stringify(data);
    },

    sendChangeMoneyType(money) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1243 + SocketConstant.SEPERATOR.N4 + money
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendRequestLuckyShot(typePlay, mucCuoc, lines, idSpin) {
        var arraySend = {};
        var sendData = {};
        arraySend.r = [];
        var tempString = 1005 + SocketConstant.SEPERATOR.N4 + typePlay + SocketConstant.SEPERATOR.ELEMENT + 901 + SocketConstant.SEPERATOR.ELEMENT + mucCuoc
            + SocketConstant.SEPERATOR.ELEMENT + lines + SocketConstant.SEPERATOR.ELEMENT + idSpin;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    }
}
module.exports = BiDaSend;
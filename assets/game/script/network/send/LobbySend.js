var SocketConstant = require('SocketConstant');
var LobbySend = {
    createTableRequest(tableIndex = 0, roomId = 0 , minMoney , takeMoney  ) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1100 + SocketConstant.SEPERATOR.N4 + tableIndex + SocketConstant.SEPERATOR.ELEMENT +
            roomId + SocketConstant.SEPERATOR.ELEMENT + minMoney;
        if (takeMoney > 0) {
            tempString + SocketConstant.SEPERATOR.ELEMENT + takeMoney;
        }
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    fastPlayRequest(zoneId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1246 + SocketConstant.SEPERATOR.N4 + zoneId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    getTableRequest(roomId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1241 + SocketConstant.SEPERATOR.N4 + roomId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    guestJoinRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 121007 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    joinTableRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1105 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        cc.log(tempString);
        return JSON.stringify(arraySend);
    },
    tableListReconnectionRequest(name, pass, id ,  zoneId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 3 + SocketConstant.SEPERATOR.N4 + 3 + SocketConstant.SEPERATOR.ELEMENT +
            name + SocketConstant.SEPERATOR.ELEMENT + pass + SocketConstant.SEPERATOR.ELEMENT + id + SocketConstant.SEPERATOR.ELEMENT
            + zoneId+ SocketConstant.SEPERATOR.DIFF_ARRAY + 1 +SocketConstant.SEPERATOR.ELEMENT +7 +SocketConstant.SEPERATOR.ELEMENT+ 0;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    }

}
module.exports = LobbySend;
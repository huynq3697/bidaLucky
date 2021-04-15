var ParseData = require('ParseData');
var SocketConstant = require('SocketConstant');
var SlotParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case SocketConstant.GAME.SLOT.SPIN: {
                return this.parse_1005_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 10051: {
                return this.parse_10051_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1006: {
                return this.parse_1006_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },
    parse_1005_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            //cc.log(tempArray);
            if (tempArray.length == 9) {
                message.id = tempArray[0];
                message.line = tempArray[1].split("#");
                message.lineWin = tempArray[2].split("#");
                message.moneyWin = tempArray[3];
                message.noHu = (tempArray[4] === 'true');
                message.bigWin = (tempArray[5] === 'true');
                message.lixi = tempArray[6];
                message.freeSpin = tempArray[7];
                message.idSpin = tempArray[8];
                // message.noHu = true;
                // message.bigWin = false;
                 // message.lineWin = ["1","2","3"];
                // message.lixi = 3;
                // message.freeSpin = 0;
               
            } else {
                message.thongBao = tempArray[0];
            }
            
        } else {
            message.error = data;
        }
        

        return message;
    },
    parse_10051_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            //cc.log(tempArray);
            if (tempArray.length == 9) {
                message.id = tempArray[0];
                message.line = tempArray[1].split("#");
                message.lineWin = tempArray[2].split("#");
                message.moneyWin = tempArray[3];
                message.noHu = (tempArray[4] === 'true');
                message.bigWin = (tempArray[5] === 'true');
                message.lixi = tempArray[6];
                message.freeSpin = tempArray[7];
                message.idSpin = tempArray[8];
                // message.noHu = true;
                // message.bigWin = false;
                 // message.lineWin = ["1","2","3"];
                // message.lixi = 3;
                // message.freeSpin = 0;
               
            } else {
                message.thongBao = tempArray[0];
            }
            
        } else {
            message.error = data;
        }
        

        return message;
    },
    parse_1006_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.idSpin = tempArray[0];
            message.lixi = tempArray[1];
            message.money = tempArray[2];

            // message.status = 1;
            // message.lixi = 2;
            // message.money = 10000;
        
        } else {
            message.error = data;
        }

        return message;
    },
}
module.exports = SlotParse;
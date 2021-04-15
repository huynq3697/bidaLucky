var ParseData = require('ParseData');
var SocketConstant = require('SocketConstant');
var TaiXiuParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case SocketConstant.GAME.TAI_XIU.UPDATE_TAI_XIU: {
                return this.parse_12005_message(tempData.messageId, tempData.status, tempData.data);
            }
            case SocketConstant.GAME.TAI_XIU.JOIN_TAI_XIU: {
                return this.parse_12004_message(tempData.messageId, tempData.status, tempData.data);
            }
            case SocketConstant.GAME.TAI_XIU.BET_TAI_XIU: {
                return this.parse_12006_message(tempData.messageId, tempData.status, tempData.data);
            }
            case SocketConstant.GAME.TAI_XIU.PHIEN_TX_STATE: {
                return this.parse_12009_message(tempData.messageId, tempData.status, tempData.data);
            }
            case SocketConstant.GAME.TAI_XIU.CHAT_TAI_XIU: {
                return this.parse_12012_message(tempData.messageId, tempData.status, tempData.data);

            }

        }
    },
    parse_12005_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        //cc.log("TEMP_ARRAY_12005", tempArray);
        
        message.join = Number(tempArray[0]);
        if (message.join == 1) {//moi join tx

            message.listPhienTX = tempArray[1];
            message.userCuocTai = tempArray[2];
            message.userCuocXiu = tempArray[3];
            message.personTai = tempArray[4];
            message.sumCoinTai = tempArray[5];
            message.personXiu = tempArray[6];
            message.sumCoinXiu = tempArray[7];
            message.state = Number(tempArray[8]);
            message.timeOut = tempArray[9];
            if (message.state > 1) {//khac play 
                message.ketqua = tempArray[10];
                message.totalMatch = tempArray[11];
                if(tempArray.length > 10){
                    message.seqWin = tempArray[12];
                    message.seqLose = tempArray[13];
                }
                
            } else {
                message.totalMatch = tempArray[10];
                if(tempArray.length > 9){
                    message.seqWin = tempArray[11];
                    message.seqLose = tempArray[12];
                }
            }
          
        } else {
            message.personTai = tempArray[1];
            message.sumCoinTai = tempArray[2];
            message.personXiu = tempArray[3];
            message.sumCoinXiu = tempArray[4];
            message.state = tempArray[5];
            message.timeOut = tempArray[6];
            if(tempArray.length > 6){
                message.ketqua = tempArray[7];
            }
          
        }

        return message;
    },
    parse_12004_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        //cc.log("TEMP_ARRAY_12004", tempArray);
        return message;
    },
    parse_12006_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        cc.log("TEMP_ARRAY_12006", tempArray);
        if (tempArray.length >= 2 && message.status == 1) {
            message.userMoney = tempArray[0];
            message.mess = tempArray[1];
            message.myTotalTai = tempArray[2];
            message.myTotalXiu = tempArray[3];
        }
        else if (message.status == 0) {
            message.mess = tempArray[0];
        }

        return message;
    },
    parse_12009_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        cc.log("TEMP_ARRAY_12009", tempArray, "LENGTH:" + tempArray.length);

        message.phienTXstate = tempArray[0];
        if (message.phienTXstate == 1) {//dang choi
            message.phienTXstate = tempArray[0];
            message.totalMatch = tempArray[1];
        } else {
            if (message.phienTXstate == 2) {//tra ve ket qua

                var ketqua = tempArray[1].split("#");
                message.kq1 = ketqua[0];
                message.kq2 = ketqua[1];
                message.kq3 = ketqua[2];
                message.personTai = tempArray[2];
                message.totalTai = tempArray[3];
                message.personXiu = tempArray[4];
                message.totalXiu = tempArray[5];
                message.totalMatch = tempArray[6];
            }
            else if (message.phienTXstate == 3) {
                message.boolean = tempArray[1];
                message.money = tempArray[2];
                message.winMoney = tempArray[3];
                message.totalMatch = tempArray[4];
                message.seqWin = tempArray[5];
                message.seqLose = tempArray[6];

            }
            else if (message.phienTXstate == 5) {//can cua

                message.isWin = tempArray[1];
                message.personTai = tempArray[2];
                message.totalTai = tempArray[3];
                message.personXiu = tempArray[4];
                message.totalXiu = tempArray[5];
                message.backMoney = tempArray[6];
                var ketqua = tempArray[7].split("#");
                message.kq1 = ketqua[0];
                message.kq2 = ketqua[1];
                message.kq3 = ketqua[2];
            }
        }

        return message;
    },
    parse_12012_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }

        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
        // tempArray = tempArray.split(SocketConstant.SEPERATOR.ELEMENT);
        //cc.log("TEMP_ARRAY_12012", tempArray);
        if (tempArray.length > 2) {
            //cc.log('message chat when join');
            // message.listChat = tempArray;
            message.listChat = [];
            tempArray.forEach(element => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                message.listChat.push({
                    username: tempArray1[0],
                    messchat: tempArray1[1],
                });
            });
        }
        else {
            var tempdata = data;
            var temp = tempdata.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userName = temp[0];
            message.mess = temp[1];
        }

        return message;
    },
}
module.exports = TaiXiuParse;
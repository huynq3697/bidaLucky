var SocketConstant = require('SocketConstant');
var Linker = require('Linker');
// var Player = require('Player');
// var CardUtils = require('CardUtils');
var LobbyParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1100:
                {
                    return this.parse_1100_message(tempData.messageId, tempData.status, tempData.data);
                }
            case 1246:
                {
                    return this.parse_1246_message(tempData.messageId, tempData.status, tempData.data);
                }
            case 1241:
                {
                    return this.parse_1241_message(tempData.messageId, tempData.status, tempData.data);
                }
            case 121007:
                {
                    return this.parse_121007_message(tempData.messageId, tempData.status, tempData.data);
                }
            
            case 3:
                {
                    return this.parse_3_message(tempData.messageId, tempData.status, tempData.data);
                }

        }
    },
    parse_1100_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.tableId = tempArray[0];
            message.minMoney = tempArray[1];
            message.selfMoney = tempArray[2];
            message.maxCapacity = tempArray[3];
            message.tableIndex = tempArray[4];
            message.isPlaying = 0;
            var player = new Player();
            player.userId = Linker.userData.userId;
            player.viewName = Linker.userData.displayName;
            player.avatarId = Linker.userData.avatar;
            player.exp = Linker.userData.userExp;
            player.userMoney = tempArray[2];
            player.state = 1;
            player.isMaster = 1;
            player.countryId = Linker.userData.countryId;
            message.player = player;
        } else {
            message.error = data;
        }

        cc.log("parse 1100 ", message);
        return message;
    },
     parse_1246_message(messageId, status, data) {
         cc.log("data",data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.tableId = tempArray[0];
            message.nTable = tempArray[1];
          
            

        } else {
            message.error = data;
        }


        return message;
    },
    parse_1241_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);


        } else {
            message.error = data;
        }

        return message;
    },
    parse_121007_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);


        } else {
            message.error = data;
        }

        return message;
    },
    parse_3_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[9];
            message.minMoney = gameInfo[0];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[10];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[1];
            message.isAn = gameInfo[3];
            message.isTaiGui = gameInfo[4];
            message.dutyType = gameInfo[3];
            message.currentPlayerId = gameInfo[5];
            message.cardLeft = gameInfo[6];
            // message.selfCardList = CardUtils.parsePhomCard(gameInfo[7]);
            // message.selfTurnedList = CardUtils.parsePhomCard(gameInfo[8]);

            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                cc.log(p);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = p[4];
                player.isObserver = p[5];
                if (i == 0) {
                    player.isMaster = 1;
                } else {
                    player.isMaster = 0;
                }
                if (message.isPlaying == 1) {
                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        player.state = 2;
                    } else {
                        player.state = 2;
                    }
                } else {
                    if (player.isReady == 1) {
                        player.state = 1;
                    } else {
                        player.state = 0;
                    }
                }
                if (p.length > 7 && message.isPlaying == 1) {
                    //card danh
                    // var turnedCardList = CardUtils.parsePhomCard(p[7]);
                    // if (turnedCardList != null) {

                        // player.turnedCardList = turnedCardList;
                    // }
                }
                if (p.length > 8 && message.isPlaying == 1) {
                    //card an
                    // var takenCardList = CardUtils.parsePhomCard(p[8]);
                    // if (takenCardList != null) {

                    //     player.takenCardList = takenCardList;
                    // }
                }
                if (p.length > 9 && message.isPlaying == 1) {
                    //list phom da ha
                    // var listPhom = CardUtils.parsePhom(p[9]);
                    // if (listPhom != null) {
                        // player.phomList = listPhom;
                    // }
                }
                message.listPlayer.push(player);
            }


        } else {
            message.error = data;
        }

        return message;
    },
}
module.exports = LobbyParse;
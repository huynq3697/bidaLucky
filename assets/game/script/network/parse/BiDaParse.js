var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var BiDaConstant = require('BiDaConstant');
// var Player = require('Player');
var Utils = require('Utils');
// var CardUtils = require('CardUtils');
// var PhomCard = require('PhomCard');

var BiDaParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1114: {
                //cc.log("BD: end game", tempData);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    return this.GameEndResponse14(tempData.messageId, tempData.status, tempData.data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    return this.GameEndResponse(tempData.messageId, tempData.status, tempData.data);

                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    return this.GameEndResponseBidaPhom(tempData.messageId, tempData.status, tempData.data);
                }
            }
            case 1112: {
                //cc.log("BD: boc bai", tempData);
                return this.GetPockerResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                cc.log("BD: join room", tempData);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    return this.JoinTableResponse1vs4(tempData.messageId, tempData.status, tempData.data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    return this.JoinTableResponse1vs1(tempData.messageId, tempData.status, tempData.data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    return this.JoinTableResponsePhom(tempData.messageId, tempData.status, tempData.data);
                }
            }
            case 1106: {
                //cc.log("BD: joined game", tempData);
                return this.PlayerJoinedResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                cc.log("BD: reconnect game", tempData);
                return this.ReconnectionResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1104: {
                //cc.log("BD: Turn response", tempData);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    return this.TurnCardResponse1vs4(tempData.messageId, tempData.status, tempData.data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    return this.TurnCardResponse1vs1(tempData.messageId, tempData.status, tempData.data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    return this.TurnCardResponsePhom(tempData.messageId, tempData.status, tempData.data);
                }
            }
            case 1242: {
                //cc.log("BD: Setting response", tempData);
                return this.SettingResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1303: {
                return this.parse_1303_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 73: {
                return this.parse_73_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },

    parse_73_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = Number(tempArray[0]);
            message.isFriend = (Number(tempArray[1]) == 1) ? true : false;
        }
        return message;
    },
    parse_1303_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.type = tempArray[0];
            message.listChat = [];
            var length = tempArray.length;
            for (let index = 1; index < length; index += 2) {
                message.listChat.push({
                    username: tempArray[index],
                    chat: Utils.Decoder.decode(tempArray[index + 1]),
                })
            }
        }
        return message;
    },
    parse_1108_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            cc.log("bat dau tran dau 1108", data);
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.turnId = tempArray1[0];
            var ballPos = [];
            var listPlayerIdInGame = [];
            message.listPlayer = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                var tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
                cc.log(tempArrayPlayer);
                for (let i = 0; i < tempArrayPlayer.length; i++) {
                    var player = tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    cc.log("player", player);
                    if (player.length >= 3) {
                        var playerId = Number(player[0]);
                        var playerType = player[1];
                        player.isBot = playerType != 0 ? true : false;
                        var listBall = player[2];
                        if (Number(Linker.userData.userId) == playerId) {
                            if (Utils.Malicious.isJsonString(listBall)) {
                                ballPos = JSON.parse(listBall);
                            }
                        }
                        if (listPlayerIdInGame.indexOf(playerId) == -1) {
                            listPlayerIdInGame.push(playerId);
                        }
                        player.playerId = playerId;
                        player.playerType = playerType;
                        message.listPlayer.push(player);
                    }
                }
                message.ballPos = ballPos;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                var tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
                for (let i = 0; i < tempArrayPlayer.length; i++) {
                    var player = tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    if (player.length >= 2) {
                        var playerId = Number(player[0])
                        var playerType = player[1];
                        player.isBot = playerType != 0 ? true : false;
                        if (listPlayerIdInGame.indexOf(playerId) == -1) {
                            listPlayerIdInGame.push(playerId);
                        }
                        player.playerId = playerId;
                        player.playerType = playerType;
                        message.listPlayer.push(player);
                    }
                }
                if (Utils.Malicious.isJsonString(tempArray1[1])) {
                    message.dataBall = tempArray1[1];
                }
                if (tempArray1.length > 2) {
                    message.isBotInTable = Number(tempArray1[2]) != 0 ? true : false;
                } else {
                    message.isBotInTable = false;
                }
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                cc.log("match start game phom", data);
                message.myCardTarget = [];

                if (tempArray1.length >= 3) {
                    if (Utils.Malicious.isJsonString(tempArray1[1])) {
                        message.dataBall = tempArray1[1];
                    }
                    if (tempArray1.length > 2) {
                        message.isBotInTable = Number(tempArray1[2]) != 0 ? true : false;
                    } else {
                        message.isBotInTable = false;
                    }
                    var _myCardTarget = tempArray1[3];
                    if (Utils.Malicious.isJsonString(_myCardTarget)) {
                        _myCardTarget = JSON.parse(_myCardTarget);
                        for (let i = 0; i < _myCardTarget.length; i++) {
                            var idBi = parseInt(_myCardTarget[i]);
                            if (isNaN(idBi) == false) {
                                message.myCardTarget.push(idBi);
                            }
                        }
                    }
                    var tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
                    for (let i = 0; i < tempArrayPlayer.length; i++) {
                        var player = tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                        if (player.length >= 2) {
                            var playerId = Number(player[0])
                            var playerType = player[1];
                            var cardTarget = player[2];
                            player.isBot = playerType != 0 ? true : false;
                            if (listPlayerIdInGame.indexOf(playerId) == -1) {
                                listPlayerIdInGame.push(playerId);
                            }
                            player.playerId = playerId;
                            player.playerType = playerType;
                            player.cardTarget = cardTarget;
                            message.listPlayer.push(player);

                        }
                    }
                }
            }
            message.listPlayerIdInGame = listPlayerIdInGame;
            cc.log('*** bai cua ai thi ng day choi', tempData, message);
        } else {
            message.error = data;
        }
        return message;
    },
    GameEndResponse(messageId, status, data) {
        cc.log("Bida_GameEndResponse 11", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, info: ", value, info);
            message.winPlayerId = info[0];
            message.userIdNohu = info[1];
            message.moneyNohu = info[2];
            message.newOwnerId = info[3];
            message.ballErrorId = info[4];
            //normal win bida
            message.winType = BiDaConstant.TYPE_WIN.NORMAL_WIN;
            var roomParam = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", roomParam);
            message.playerList = [];
            message.playerListID = [];
            for (var i = 0; i < roomParam.length; i++) {
                var playerResult = roomParam[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                var id = parseInt(playerResult[0]);
                if (message.playerListID.indexOf(id) == -1) {
                    message.playerListID.push(id);
                }
                player.userId = id;
                player.resultMoney = playerResult[1];
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.winMoney = player.resultMoney;
                } else {
                    message.loseMoney = player.resultMoney;
                }
                player.userMoney = Number(playerResult[2]);//cash
                player.countWin = Number(playerResult[3]);
                player.ballErrorId = Number(playerResult[4]);
                player.isOut = 0;
                player.isNotEnoughMoney = 0;
                if (playerResult[5] == 1) {
                    player.isOut = 1;
                }
                if (playerResult[6] == 1) {
                    player.isNotEnoughMoney = 1;
                }
                message.playerList.push(player);
            }
        }
        else {
            message.error = data;
        }
        return message;
    },
    GameEndResponseBidaPhom(messageId, status, data) {
        cc.log("Bida_GameEndResponse phom", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, info: ", value, info);
            message.winPlayerId = info[0];
            message.userIdNohu = info[1];
            message.moneyNohu = info[2];
            message.newOwnerId = info[3];
            message.lastTurn = info[4];
            message.ballErrorId = info[5];
            //normal win bida
            message.winType = BiDaConstant.TYPE_WIN.NORMAL_WIN;
            var roomParam = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", roomParam);
            message.playerList = [];
            message.playerListID = [];
            for (var i = 0; i < roomParam.length; i++) {
                var playerResult = roomParam[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                var id = parseInt(playerResult[0]);
                if (message.playerListID.indexOf(id) == -1) {
                    message.playerListID.push(id);
                }
                player.userId = id;
                player.resultMoney = playerResult[1];
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.winMoney = player.resultMoney;
                } else {
                    message.loseMoney = player.resultMoney;
                }
                player.userMoney = Number(playerResult[2]);//cash
                player.countWin = Number(playerResult[3]);
                player.ballErrorId = Number(playerResult[4]);
                player.isOut = 0;
                player.isNotEnoughMoney = 0;
                if (playerResult[5] == 1) {
                    player.isOut = 1;
                }
                if (playerResult[6] == 1) {
                    player.isNotEnoughMoney = 1;
                }
                player.player_list_ball_tren_tay = this.convertTextNumToNum(playerResult[7].split("#")),
                    message.playerList.push(player);
                player.viewName = playerResult[8];
            }
        }
        else {
            message.error = data;
        }
        return message;
    },
    GameEndResponse14(messageId, status, data) {
        cc.log("Bida_GameEndResponse 14", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, info: ", value, info);
            message.winPlayerId = info[0];
            message.userIdNohu = info[1];
            message.moneyNohu = info[2];
            message.newOwnerId = info[3];
            //normal win bida
            message.winType = BiDaConstant.TYPE_WIN.NORMAL_WIN;
            var roomParam = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", roomParam);
            message.playerList = [];
            message.playerListID = [];
            for (var i = 0; i < roomParam.length; i++) {
                var playerResult = roomParam[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                var id = parseInt(playerResult[0]);
                if (message.playerListID.indexOf(id) == -1) {
                    message.playerListID.push(id);
                }
                player.userId = id;
                player.resultMoney = playerResult[1];
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.winMoney = player.resultMoney;
                } else {
                    message.loseMoney = player.resultMoney;
                }
                player.userMoney = Number(playerResult[2]);//cash
                player.countWin = Number(playerResult[3]);
                player.ballErrorId = Number(playerResult[4]);
                player.isOut = 0;
                player.isNotEnoughMoney = 0;
                if (playerResult[5] == 1) {
                    player.isOut = 1;
                }
                if (playerResult[6] == 1) {
                    player.isNotEnoughMoney = 1;
                }
                message.playerList.push(player);
            }
        }
        else {
            message.error = data;
        }
        return message;
    },
    GetPockerResponse(messageId, status, data) {
        cc.log("TLMN_GetPockerResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.beginPlayerId = tempArray[0];
            // message.cardOwnerList = CardUtils.parsePhomCard(tempArray[1]);
            message.dutyType = tempArray[2];
            message.listPlayer = tempArray[3].split("#");


        } else {
            message.error = data;
        }
        return message;
    },

    JoinTableResponse1vs1: function (messageId, status, data) {
        cc.log("BIDA_JoinTableResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (Number(status) == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            // message.isAn = gameInfo[6];
            // message.isTaiGui = gameInfo[7];
            // message.dutyType = gameInfo[8];

            // message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            message.dataBall = [];
            message.ballEat = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            var listPlayerId = [];
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = Number(p[4]);
                player.isObserver = p[5];
                player.level = p[6];
                message.currentPlayerId = Number(p[7]);
                player.countryId = !!p[8] ? p[8] : "w";
                player.playerType = p[9];
                player.isBot = player.playerType != 0 ? true : false;
                player.player_list_ball_tren_tay = this.convertTextNumToNum(p[10].split("#"));
                player.player_list_ball_an = this.convertTextNumToNum(p[11].split("#"));
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                if (Number(message.isPlaying) == 1) {

                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        //chức năng dành cho người xem, list bi trên bàn chơi
                        if (Utils.Malicious.isJsonString(p[12])) {
                            var dataBallNum = [];
                            var dataBallPos = [];
                            var _tmpDataBall = JSON.parse(p[12]);
                            for (let k = 0; k < _tmpDataBall.length; k++) {
                                dataBallNum.push(parseInt(_tmpDataBall[k].num));
                                dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                            }
                            if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                                //vị trí các bi đang chơi dở
                                message.ballPos = _tmpDataBall;
                            } else {
                                // cc.log(dataBallPos, _tmpDataBall);
                            }
                            message.dataBall = JSON.stringify(dataBallNum);//data ball 
                        }
                        if (Utils.Malicious.isJsonString(p[13])) {
                            message.ballEat = p[13];
                        }
                        player.state = 0;
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
                player.socay = p[7];
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }

        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },
    JoinTableResponsePhom: function (messageId, status, data) {
        cc.log("BIDA_JoinTableResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (Number(status) == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            // message.isAn = gameInfo[6];
            // message.isTaiGui = gameInfo[7];
            // message.dutyType = gameInfo[8];

            // message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            message.dataBall = [];
            message.ballEat = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            var listPlayerId = [];
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = Number(p[4]);
                player.isObserver = p[5];
                player.level = p[6];
                message.currentPlayerId = Number(p[7]);
                player.countryId = !!p[8] ? p[8] : "w";
                player.playerType = p[9];
                player.isBot = player.playerType != 0 ? true : false;
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                if (Number(message.isPlaying) == 1) {

                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        //chức năng dành cho người xem, list bi trên bàn chơi
                        if (Utils.Malicious.isJsonString(p[10])) {
                            var dataBallNum = [];
                            var dataBallPos = [];
                            var _tmpDataBall = JSON.parse(p[10]);
                            for (let k = 0; k < _tmpDataBall.length; k++) {
                                dataBallNum.push(parseInt(_tmpDataBall[k].num));
                                dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                            }
                            if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                                //vị trí các bi đang chơi dở
                                message.ballPos = _tmpDataBall;
                            } else {
                                // cc.log(dataBallPos, _tmpDataBall);
                            }
                            message.dataBall = JSON.stringify(dataBallNum);//data ball 
                        }
                        if (Utils.Malicious.isJsonString(p[11])) {
                            message.ballEat = p[11];
                        }
                        player.state = 0;
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
                player.socay = p[7];
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }

        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },
    JoinTableResponse1vs4: function (messageId, status, data) {
        cc.log("BIDA_JoinTableResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (Number(status) == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            // message.isAn = gameInfo[6];
            // message.isTaiGui = gameInfo[7];
            // message.dutyType = gameInfo[8];

            // message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            message.dataBall = [];
            message.ballEat = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            var listPlayerId = [];
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = Number(p[4]);
                player.isObserver = p[5];
                player.level = p[6];
                message.currentPlayerId = Number(p[7]);
                player.countryId = !!p[8] ? p[8] : "w";
                player.playerType = p[9];
                player.isBot = player.playerType != 0 ? true : false;
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                if (Number(message.isPlaying) == 1) {

                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        //chức năng dành cho người xem, list bi trên bàn chơi
                        if (Utils.Malicious.isJsonString(p[10])) {
                            var dataBallNum = [];
                            var dataBallPos = [];
                            var _tmpDataBall = JSON.parse(p[10]);
                            for (let k = 0; k < _tmpDataBall.length; k++) {
                                dataBallNum.push(parseInt(_tmpDataBall[k].num));
                                dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                            }
                            if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                                //vị trí các bi đang chơi dở
                                message.ballPos = _tmpDataBall;
                            } else {
                                // cc.log(dataBallPos, _tmpDataBall);
                            }
                            message.dataBall = JSON.stringify(dataBallNum);//data ball 
                        }
                        if (Utils.Malicious.isJsonString(p[11])) {
                            message.ballEat = p[11];
                        }
                        player.state = 0;
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
                player.socay = p[7];
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }

        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },
    PlayerJoinedResponse(messageId, status, data) {
        cc.log("TLMN_PlayerJoinedResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            cc.log(tempArray, 'player joined');
            var player = new Player();
            player.userId = tempArray[0];
            player.viewName = tempArray[1];
            player.avatarId = tempArray[2];
            player.userMoney = tempArray[3];
            player.state = 0;
            player.isMaster = 0;
            player.countryId = tempArray[4];
            if (tempArray[5]) {
                player.level = tempArray[5];
            }
            message.player = player;

        } else {
            message.error = data;
        }
        return message;
    },

    ReconnectionResponse(messageId, status, data) {
        cc.log("TLMN_ReconnectionResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {

            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.minMoney = gameInfo[0];
            message.tableIndex = gameInfo[1];
            message.tableId = gameInfo[2];
            message.isPlaying = gameInfo[3];
            message.currentPlayerId = gameInfo[4];
            message.maxCapacity = gameInfo[5];
            if (gameInfo.length > 6) {
                message.isBotInTable = Number(gameInfo[6]) != 0 ? true : false;
            } else {
                message.isBotInTable = false;
            }
            message.listPlayer = [];
            message.ballEat = [];
            message.ballOnHand = [];
            message._isShoted = true;
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY).filter(Boolean);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2];
                player.userMoney = p[3];
                player.level = p[4];
                player.exp = p[5];
                player.player_list_ball_tren_tay = this.convertTextNumToNum(p[6].split("#"));
                player.player_list_ball_an = this.convertTextNumToNum(p[7].split("#"));
                player.ballErrorId = p[8];
                player.isObserver = p[9];
                player.countryId = !!p[10] ? p[10] : "w";
                player.playerType = p[11];
                player.isBot = player.playerType != 0 ? true : false;
                if (Number(Linker.userData.userId) == Number(player.userId)) {
                    if (Utils.Malicious.isJsonString(p[12])) {
                        var dataBallNum = [];
                        var dataBallPos = [];
                        var _tmpDataBall = JSON.parse(p[12]);
                        for (let k = 0; k < _tmpDataBall.length; k++) {
                            dataBallNum.push(parseInt(_tmpDataBall[k].num));
                            dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                        }
                        if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                            //vị trí các bi đang chơi dở
                            message.dataBall = p[12];
                        } else if (Utils.Malicious.isAllElementArrSame(0.0, dataBallPos) && dataBallNum.indexOf(0) == -1) {
                            message._isShoted = false;
                        }
                        message.dataPos = JSON.stringify(dataBallNum);//data ball

                    }
                    message.ballEat = p[13];
                    message.ballX = p[14];//them vi tri bi cai
                    message.ballY = p[15];
                    message.cueR = p[16];
                    message.cueStatus = p[17];
                    message.timeLeft = p[18];

                }
                if (i == 0) {
                    player.isMaster = 1;
                } else {
                    player.isMaster = 0;
                }
                message.listPlayer.push(player);
            }
        } else {
            message.error = data;
        }

        return message;
    },

    SettingResponse(messageId, status, data) {
        cc.log("TLMN_SettingResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var tempArray2 = tempArray[1];
            var setting = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            var result = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ARRAY) : null;
            cc.log(setting);
            message.minMoney = setting[0];
            message.capacity = setting[1];
            // message.isHiddenCard = setting[2];
            message.fastPlay = setting[2];
            message.totalError = setting[3];
            message.playTime = Number(setting[4]);
            message.leftTime = Number(setting[5]);
            message.maxError = Number(setting[6]);
            message.players = this.getPlayersSetting(result);
        } else {
            message.error = data;
        }
        Linker.settingTable = message;
        return message;
    },
    TurnCardResponse1vs4: function (messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            ballX: 0,
            ballY: 0,
            cueR: 0,
            nextID: 0,
            leftTime: 0
        }

        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var turnInfo = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            message.ballX = turnInfo[1];
            message.ballY = turnInfo[2];
            message.cueR = turnInfo[3];
            message.nextID = turnInfo[4];
            message.leftTime = turnInfo[5];
            message.cueStatus = Number(turnInfo[0]);
            switch (message.cueStatus) {
                case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    break;
                case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                    break;
                case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                    var tempArray2 = tempArray[1];
                    var listPlayer = tempArray2.split(SocketConstant.SEPERATOR.ARRAY);
                    message.players = [];
                    for (let i = 0; i < listPlayer.length; i++) {
                        var player_data = listPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                        var player = {
                            id: player_data[0],
                            player_list_ball_tren_tay: this.convertTextNumToNum(player_data[1].split("#")),
                            player_list_ball_an: this.convertTextNumToNum(player_data[2].split("#")),
                            player_percent_eat: parseFloat(Number(player_data[3])),
                            ballInTable: Utils.Malicious.isJsonString(player_data[4]) ? JSON.parse(player_data[4]) : [],
                            totalSeo: Number(player_data[5]),
                            ballErrorId: player_data[6]//pham luat -1 loi, 1 khong loi
                        }
                        message.players.push(player);
                    }
                    cc.log("Next turn normal ...");
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    cc.log("Auto next turn ...");
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    cc.log("Auto next turn ...");
                    break;
                default:
                    break;
            }
        } else {
            message.error = data;
        }
        return message;
    },
    TurnCardResponse1vs1: function (messageId, status, data) {
        cc.log("TLMN_TurnCardResponse Mode Play 1vs1", data);
        var message = {
            messageId: messageId,
            status: status,
            ballX: 0,
            ballY: 0,
            cueR: 0,
            ballEat: null,
            cueStatus: 0,
            cueP: cc.v2(0, 0),
            force: 0,
            cueAR: cc.v2(0, 0),
            dataBall: [],
            leftTime: 0
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var tempArray2 = tempArray[1];

            var cuepr = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            var result = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ARRAY) : null;

            //cc.log(tempArray);
            //khi status = 3 thì sẽ ball ăn
            message.cueStatus = Number(cuepr[0]);

            message.status = Number(status);
            switch (message.cueStatus) {
                case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                    message.turnId = cuepr[4];
                    message.ballEat = null;
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    message.turnId = cuepr[4];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    break;
                case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                    message.turnId = cuepr[4];
                    message.cueAR = Number(cuepr[3]);
                    message.force = cc.v2(Number(cuepr[1]), Number(cuepr[2]));
                    break;
                case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                    cc.log("Next turn normal ...");
                    var players = this.getPlayers(result);
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    cc.log("Auto next turn ...");
                    var players = this.getPlayers(result);
                    //tu dong danh boi server
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    // message.ballX = Number(cuepr[1]);
                    // message.ballY = Number(cuepr[2]);
                    // message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                case BiDaConstant.TABLE_STATUS.RECOVER_BALL_POSITION_RECONNECT:
                    cc.log("Reconnect reset ball turn ...");
                    var players = this.getPlayers(result);
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                default:
                    break;
            }
        } else {
            message.error = data;
        }
        return message;
    },
    TurnCardResponsePhom: function (messageId, status, data) {
        cc.log("TLMN_TurnCardResponse Mode Play phom", data);
        var message = {
            messageId: messageId,
            status: status,
            ballX: 0,
            ballY: 0,
            cueR: 0,
            ballEat: null,
            cueStatus: 0,
            cueP: cc.v2(0, 0),
            force: 0,
            cueAR: cc.v2(0, 0),
            dataBall: [],
            leftTime: 0
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var tempArray2 = tempArray[1];


            var cuepr = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            var result = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ARRAY) : null;

            //cc.log(tempArray);
            //khi status = 3 thì sẽ ball ăn
            message.cueStatus = Number(cuepr[0]);

            message.status = Number(status);
            switch (message.cueStatus) {
                case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                    message.turnId = cuepr[4];
                    message.ballEat = null;
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    message.turnId = cuepr[4];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    break;
                case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                    message.turnId = cuepr[4];
                    message.cueAR = Number(cuepr[3]);
                    message.force = cc.v2(Number(cuepr[1]), Number(cuepr[2]));
                    break;
                case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                    cc.log("Next turn normal ...");
                    var players = this.getPlayersPhom(result);
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    cc.log("Auto next turn ...");
                    var players = this.getPlayersPhom(result);
                    //tu dong danh boi server
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    // message.ballX = Number(cuepr[1]);
                    // message.ballY = Number(cuepr[2]);
                    // message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                case BiDaConstant.TABLE_STATUS.RECOVER_BALL_POSITION_RECONNECT:
                    cc.log("Reconnect reset ball turn ...");
                    var players = this.getPlayers(result);
                    message.turnId = cuepr[4];
                    message.ballEat = cuepr[7];
                    message.ballX = Number(cuepr[1]);
                    message.ballY = Number(cuepr[2]);
                    message.cueR = Number(cuepr[3]);
                    message.cueP = cc.v2(message.ballX, message.ballY);
                    message.players = players;
                    message.dataBall = this.getListBall(cuepr[6]);
                    message.leftTime = Number(cuepr[5]);
                    break;
                default:
                    break;
            }
        } else {
            message.error = data;
        }
        return message;
    },
    getListBall: function (listBallJson) {
        if (Utils.Malicious.isJsonString(listBallJson)) {
            var _tmpDataBall = JSON.parse(listBallJson);
            var dataBallPos = [];
            for (let k = 0; k < _tmpDataBall.length; k++) {
                dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
            }
            if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                //vị trí các bi đang chơi dở
                return listBallJson;
            } else {
                return [];
            }
        } else {
            return [];
        }
    },
    convertTextNumToNum: function (arr) {
        var _arr = [];
        for (let i = 0; i < arr.length; i++) {
            var id = parseInt(arr[i]);
            if (isNaN(id) == false) {
                _arr.push(id);
            }
        }
        return _arr;
    },
    getPlayers: function (result) {
        if (!result || (result && result.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < result.length; i++) {
            var player_data = result[i].split(SocketConstant.SEPERATOR.ELEMENT);
            var player = {
                id: player_data[0],
                player_list_ball_tren_tay: this.convertTextNumToNum(player_data[1].split("#")),
                player_list_ball_an: this.convertTextNumToNum(player_data[2].split("#")),
                totalSeo: Number(player_data[3]),
                ballErrorId: player_data[4]
            }
            players.push(player)
        }
        return players;
    },
    getPlayersPhom: function (result) {
        if (!result || (result && result.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < result.length; i++) {
            var player_data = result[i].split(SocketConstant.SEPERATOR.ELEMENT);
            if (player_data && Array.isArray(player_data) && player_data.length >= 6) {
                var player = {
                    id: player_data[0],
                    player_list_ball_tren_tay: this.convertTextNumToNum(player_data[1].split("#")),
                    player_list_ball_an: this.convertTextNumToNum(player_data[2].split("#")),
                    totalSeo: Number(player_data[3]),
                    isStop: Number(player_data[4]),
                    ballErrorId: player_data[5]
                }
                players.push(player);
            }
        }
        return players;
    },
    getPlayersSetting: function (result) {
        if (!result || (result && result.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < result.length; i++) {
            var player_data = result[i].split(SocketConstant.SEPERATOR.ELEMENT);
            var player = {
                id: player_data[0],
                totalSeo: Number(player_data[1])
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                player.isStop = Number(player_data[2]);
            }
            players.push(player)
        }
        return players;
    }
}
module.exports = BiDaParse;
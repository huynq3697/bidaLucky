var SocketConstant = require('SocketConstant');
var CommonParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case SocketConstant.COMMON.LOGIN: {
                return this.parse_1000_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 10001: {
                return this.parse_10001_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1: {
                return this.parse_1_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 14001: {
                return this.parse_14001_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1004: {
                return this.parse_1004_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1115: {
                return this.parse_1115_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121002: {
                return this.parse_121002_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 14002: {
                return this.parse_14002_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 83: {
                return this.parse_83_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1202: {
                return this.parse_1202_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 2: {
                return this.parse_2_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 2016020: {
                return this.parse_2016020_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400003: {
                return this.parse_400003_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400002: {
                return this.parse_400002_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 14003: {
                return this.parse_14003_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1203: {
                return this.parse_1203_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 7051: {
                return this.parse_7051_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1243: {
                return this.parse_1243_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 12017: {
                return this.parse_12017_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 8: {
                return this.parse_8_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1506: {
                return this.parse_1506_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 4000: {
                return this.parse_4000_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400004: {
                return this.parse_400004_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400005: {
                return this.parse_400005_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400006: {
                return this.parse_400006_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 400007: {
                return this.parse_400007_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121001: {
                return this.parse_121001_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1123: {
                return this.parse_1123_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1208: {
                return this.parse_1208_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 57: {
                return this.parse_57_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 58: {
                return this.parse_58_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 14000: {
                return this.parse_14000_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 12011: {
                return this.parse_12011_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 100001: {
                return this.parse_100001_message(tempData.messageId, tempData.status, tempData.data);

            }

            case 110701: {
                return this.parse_110701_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1103: {
                return this.parse_1103_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 75: {
                return this.parse_75_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1110: {
                return this.parse_1110_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1102: {
                return this.parse_1102_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1101: {
                return this.parse_1101_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1242: {
                return this.parse_1242_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1116: {
                return this.parse_1116_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1212: {
                return this.parse_1212_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 14004: {
                return this.parse_14004_message(tempData.messageId, tempData.status, tempData.data);

            }
            case 10901: { //:__: Change password
                return this.parse_10901_message(tempData.messageId, tempData.status, tempData.data);

            }
            case 110710: {
                return this.parse_110710_message(tempData.messageId, tempData.status, tempData.data);
            }
            case SocketConstant.COMMON.IAP: { //:__: Change password
                return this.parse_400001_message(tempData.messageId, tempData.status, tempData.data);

            }

        }
    },
    parse_400001_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: null
        };
        cc.log("data:", data);

        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        message.data = tempArray[0];

        return message;
    },
    //:__: Change password
    parse_10901_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: null
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.data = tempArray[0];
        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.error = tempArray[0];
        }
        return message;
    },
    parse_14004_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: null
        };
        if (status == 1) {
            var tempData = data;
            message.data = JSON.parse(tempData);
        } else {
            message.error = data;
        }

        return message;
    },
    parse_1_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: null
        };
        return message;
    },
    parse_1212_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listPlayer: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element, pos) => {
                if (element.length > 0) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    var data = {
                        pos: pos + 1,
                        userId: tempArray1[0],
                        playerName: tempArray1[1],
                        money: tempArray1[2],
                    }
                    message.listPlayer.push(data);
                }

            })
        } else {
            message.error = data;
        }

        return message;
    },
    parse_1103_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.userId = tempArray[0];
            message.newOwner = tempArray[1];
            message.cancelStatus = tempArray[2];
        } else {
            message.error = data;
        }

        return message;
    },
    parse_75_message(messageId, status, data) {
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
    parse_1110_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.userId = tempArray[0];
            message.isReady = tempArray[1];
        } else {
            message.error = data;
        }

        return message;
    },
    parse_1102_message(messageId, status, data) {
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
    parse_1101_message(messageId, status, data) {
        var message = {
            messageId: Number(messageId),
            status: status,
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            var playerdata = {};
            playerdata.playerInviteId = tempArray[0];
            playerdata.matchID = tempArray[1];
            playerdata.tableID = tempArray[2];
            playerdata.playerNameInvite = tempArray[3];
            playerdata.minBetCash = tempArray[4];
            playerdata.zoneID = tempArray[6];
            message.invite = playerdata;
        } else {
            message.error = data;
        }

        return message;
    },
    parse_1242_message(messageId, status, data) {
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
    parse_1108_message(messageId, status, data) {
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
    parse_1116_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.userName = tempArray[1];
            message.message = tempArray[2];
            message.outStatus = tempArray[3];
            message.newRoomOwner = tempArray[4];
            message.type = tempArray[5];

        } else {
            message.error = data;
        }

        return message;
    },

    parse_1000_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.userMoney = tempArray[1];
            message.userExp = tempArray[2];
            message.checkMail = tempArray[3];
            message.userLevel = tempArray[4];
            message.alertEmailContent = tempArray[5]; //used cho country
            if (message.alertEmailContent == "") {
                message.alertEmailContent = "null";
            }
            var authenCode = JSON.parse(message.alertEmailContent);
            message.countryId = "w"; //default
            message.cueId = 0; //default
            message.jobId = 0; //default
            if (authenCode) {
                message.countryId = authenCode.countryId;
                message.cueId = authenCode.cueId;
                message.jobId = authenCode.jobId;
            }
            message.alertEmailTitle = tempArray[6];
            message.isPhoneUpdate = tempArray[7];
            message.displayName = tempArray[8];
            message.avatar = tempArray[9];
            message.isPayment = tempArray[10];
            message.isActive = tempArray[11];
            message.isNewLoginDay = tempArray[12];

            message.userRealMoney = tempArray[13];
            if (tempArray.length > 13) {
                message.zoneId = tempArray[14];
                message.lastRoom = tempArray[15];
            }
            cc.log("message", message);
        } else {
            message.error = data;
        }

        return message;
    },

    parse_10001_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.userMoney = tempArray[1];
            message.userRealMoney = tempArray[2];
            message.userExp = tempArray[3];
            message.checkMail = tempArray[4];
            message.isPayment = tempArray[5];
            message.alertEmailContent = tempArray[6]; //used cho country
            if (message.alertEmailContent == "") {
                message.alertEmailContent = "null";
            }
            var authenCode = JSON.parse(message.alertEmailContent);
            message.countryId = "w"; //default
            message.cueId = 0; //default
            message.jobId = 0; //default
            if (authenCode) {
                message.countryId = authenCode.countryId;
                message.cueId = authenCode.cueId;
                message.jobId = authenCode.jobId;
            }
            message.alertEmailTitle = tempArray[7];
            message.isPhoneUpdate = tempArray[8];
            message.displayName = tempArray[9];
            message.avatar = tempArray[10];
            message.userLevel = tempArray[11];
            message.isActive = tempArray[12];
            message.isNewLoginDay = tempArray[12];

            if (tempArray.length > 13) {
                message.zoneId = tempArray[14];
                message.lastRoom = tempArray[15];
            }
            cc.log("message", message);
        } else {
            message.error = data;
        }

        return message;
    },

    parse_14001_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            game: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var data = {
                    idZone: tempArray1[0],
                    name: tempArray1[1],
                    ip: tempArray1[2],
                    ipIos: tempArray1[3],
                    port: tempArray1[4],
                    portWs: tempArray1[5],
                }
                message.game.push(data);
            })
        } else {
            message.error = data;
        }

        return message;
    },
    parse_1004_message(messageId, status, data) {
        // cc.log("parse_1004_message messageId",data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            message.listHu = [];
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach(element => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var listHuDetails = [];
                listHuDetails.push({
                    id: tempArray1[0],
                    moneyHu1: tempArray1[1],
                    moneyHu2: tempArray1[2],
                    moneyHu3: tempArray1[3],
                });
                message.listHu.push(listHuDetails);
            });
            // cc.log("message.listHu:",message.listHu);
        } else {
            message.error = data;
        }


        return message;
    },
    parse_1115_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];
        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];
        }


        return message;
    },
    parse_121002_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.userName = tempArray[1];
            message.money = tempArray[2];
            message.xumoney = tempArray[3];
            message.userExp = tempArray[4];
            message.isActive = tempArray[5];
        } else {
            message.error = data;
        }


        return message;
    },
    parse_14002_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.unReadMail = tempArray[0];
            message.apiEvent = tempArray[1];
            message.apiNew = tempArray[2];
            message.smsKH_VT = tempArray[3];
            message.smsNum_VT = tempArray[4];
            message.smsKH_VN = tempArray[5];
            message.smsNum_VN = tempArray[6];
            message.smsKH_MB = tempArray[7];
            message.smsNum_MB = tempArray[8];
            message.urlAvatar = tempArray[9];

        } else {
            message.error = data;
        }


        return message;
    },
    parse_83_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];
        }


        return message;
    },
    parse_1202_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            avatar: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var data = {
                    id: tempArray1[1],
                    name: tempArray1[2]
                };
                message.avatar.push(data);
            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_2_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];
        }


        return message;
    },
    parse_2016020_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.type = tempArray[0];
            message.message = tempArray[1];

        } else {
            message.error = data;
        }
        return message;
    },
    parse_400003_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.id = tempArray[0];
            message.content = tempArray[1];

        } else {
            message.error = data;
        }
        return message;
    },
    parse_400002_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listMail: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                if (element != "") {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    var data = {
                        id: tempArray1[0],
                        name: tempArray1[1],
                        title: tempArray1[2],
                        isRead: tempArray1[3],
                        time: tempArray1[4]
                    };
                    message.listMail.push(data);
                }

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_14003_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listHistory: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var data = {
                    time: tempArray1[0],
                    description: tempArray1[1],
                    money: tempArray1[2],
                    balanceAfter: tempArray1[3],
                    logTypeId: tempArray1[4],
                    matchId: tempArray1[5],
                    matchNum: tempArray1[6],
                    isWin: tempArray1[7],
                    bet: tempArray1[8],
                    ownerId: tempArray1[9]
                };
                message.listHistory.push(data);
            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_1203_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            listFriends: []
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                if (Array.isArray(tempArray1) && tempArray1.length >= 8) {
                    var data = {
                        uid: Number(tempArray1[0]),
                        userId: Number(tempArray1[0]),
                        viewname: tempArray1[1],
                        displayName: tempArray1[1],
                        avatarID: isNaN(tempArray1[2]) ? 0 : Number(tempArray1[2]),
                        level: tempArray1[3],
                        money: tempArray1[4],
                        playsNumber: tempArray1[5],
                        online: tempArray1[6],
                        utype: tempArray1[7],
                        isFindFriends: false,
                        isGetFriends: true,
                        isSendFriends: false
                    };
                    message.listFriends.push(data);
                }
            })

        } else {
            message.error = data;
        }
        return message;
    },

    parse_7051_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            listSendFriends: []
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                if (Array.isArray(tempArray1) && tempArray1.length >= 8) {
                    var data = {
                        uid: Number(tempArray1[0]),
                        userId: Number(tempArray1[0]),
                        viewname: tempArray1[1],
                        displayName: tempArray1[1],
                        avatarID: isNaN(tempArray1[2]) ? 0 : Number(tempArray1[2]),
                        level: tempArray1[3],
                        money: tempArray1[4],
                        playsNumber: tempArray1[5],
                        online: tempArray1[6],
                        utype: tempArray1[7],
                        isSendFriends: true,
                        isFindFriends: false,
                        isGetFriends: false,
                    };
                    message.listSendFriends.push(data);
                }
            })
        } else {
            message.error = data;
        }
        return message;
    },

    parse_1243_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            moneyType: null
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.moneyType = Number(tempArray[0]);
        } else {
            message.error = data;
        }
        return message;
    },

    parse_12017_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            userOnline: null
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userOnline = Number(data);
        } else {
            message.error = data;
        }
        return message;
    },

    parse_8_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: Number(status),
            listUsers: []
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                if (Array.isArray(tempArray1) && tempArray1.length >= 4) {
                    var data = {
                        uid: Number(tempArray1[0]),
                        userId: Number(tempArray1[0]),
                        viewname: tempArray1[1],
                        displayName: tempArray1[1],
                        isMale: tempArray1[2],
                        avatarID: isNaN(tempArray1[3]) ? 0 : Number(tempArray1[3]),
                        isFindFriends: true,
                        isGetFriends: false,
                        isSendFriends: false
                    };
                    message.listUsers.push(data);
                }
            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_1506_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listRate: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element) => {
                if (element != "") {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    var data = {
                        type: tempArray1[0],
                        title: tempArray1[1],
                        serviceCode: tempArray1[2],
                        vnd: tempArray1[3],
                        quan: tempArray1[4],
                        telNum: tempArray1[5],
                        rate: tempArray1[6],
                        logo: tempArray1[7],
                    };
                    message.listRate.push(data);
                }

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_4000_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.serviceId = tempArray[0];
            message.seriCard = tempArray[1];
            message.pinCard = tempArray[2];

        } else {
            message.error = data;
        }
        return message;
    },
    parse_400004_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            bonus: [],
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            tempArray.forEach((element, pos) => {

                if (pos == 0) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    message.type = tempArray1[0];
                }
                if (pos == 1) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ARRAY);
                    tempArray1.forEach((element1) => {
                        var tempArray2 = element1.split(SocketConstant.SEPERATOR.ELEMENT);
                        var data = {
                            itemId: tempArray2[0],
                            name: tempArray2[1],
                            price_change: tempArray2[2],
                            image: tempArray2[3],
                            price: tempArray2[4],
                        };
                        message.bonus.push(data);
                    })

                }

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_400005_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];
            message.error = data;
        }
        return message;
    },
    parse_400007_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            bonus: [],
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element, pos) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var data = {
                    id: tempArray1[0],
                    idItem: tempArray1[1],
                    name: tempArray1[2],
                    price: tempArray1[3],
                    status: tempArray1[4],
                    comment: tempArray1[5],
                    orderDate: tempArray1[6],

                };
                message.bonus.push(data);

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_400006_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];
            message.error = data;
        }
        return message;
    },
    parse_121001_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            history: [],
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            tempArray.forEach((element, pos) => {

                if (pos == 0) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    message.userId = tempArray1[0];
                    message.displayName = tempArray1[1];
                    message.userMoney = tempArray1[2];
                    message.userExp = tempArray1[3];
                    message.viewname = tempArray1[4];
                    // message.cmt = tempArray1[5];
                    message.email = tempArray1[5];
                    message.address = tempArray1[6];
                    message.phoneNumber = tempArray1[7];
                    message.avatar = tempArray1[8];
                    message.isFriend = tempArray1[9];
                    message.countryId = !!tempArray1[10] ? tempArray1[10] : "w";
                    message.cityId = tempArray1[11];
                    message.sex = tempArray1[12];
                    message.userRealMoney = tempArray1[13];
                    message.requestSize = tempArray1[14];
                }

                if (pos == 1) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ARRAY);
                    tempArray1.forEach((element1, pos) => {
                        var tempArray2 = element1.split(SocketConstant.SEPERATOR.ELEMENT);
                        var data = {
                            zoneId: tempArray2[0],
                            win: tempArray2[1],
                            lose: tempArray2[2],
                            exp: tempArray2[3],
                            totalplay: tempArray2[4]
                        };
                        message.history.push(data);
                    });

                }

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_1123_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];
            message.error = data;
        }
        return message;
    },
    parse_1208_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listRank: []
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);

            tempArray.forEach((element, pos) => {
                if (pos == 0) {
                    var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    message.type = tempArray1[0];
                    message.userName = tempArray1[2];
                    message.rank = tempArray1[1];
                    message.rankData = tempArray1[3];
                }
                if (pos == 1) {
                    var tempArray2 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                    var i = 0;
                    while (i < tempArray2.length) {
                        var data = {
                            userId: tempArray2[i],
                            userName: tempArray2[i + 1],
                            rank: tempArray2[i + 2],
                            avatarID: tempArray2[i + 3],
                        };

                        message.listRank.push(data);
                        i += 4;
                    }
                }
            })

        }

        return message;
    },
    parse_57_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listEvent: [],
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ARRAY);
            tempArray.forEach((element, pos) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var data = {
                    id: tempArray1[0],
                    title: tempArray1[1],
                    isThumb: tempArray1[2],

                };
                message.listEvent.push(data);

            })

        } else {
            message.error = data;
        }
        return message;
    },
    parse_58_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.idEvent = tempArray[0];
            message.detailEvent = tempArray[1]

        } else {

            message.error = data;
        }
        return message;
    },
    parse_14000_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.message = tempArray[0];
            message.error = data;
        }
        return message;
    },
    parse_12011_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];

        } else {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.text = tempArray[0];
            message.error = data;
        }
        return message;
    },
    parse_100001_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("tempArray",tempArray);
            message.userId = tempArray[0];
            message.userMoney = tempArray[1];
            message.userExp = tempArray[2];
            message.checkMail = tempArray[3];
            message.userLevel = message.checkEvent = tempArray[4];
            message.alertEmailContent = tempArray[5];

            if (message.alertEmailContent == "") {
                message.alertEmailContent = "null";
            }
            var authenCode = JSON.parse(message.alertEmailContent);
            message.countryId = "w"; //default
            message.cueId = 0; //default
            message.jobId = 0; //default
            if (authenCode) {
                message.countryId = authenCode.countryId;
                message.cueId = authenCode.cueId;
                message.jobId = authenCode.jobId;
            }

            message.alertEmailTitle = tempArray[6];
            message.isPhoneUpdate = tempArray[7];
            message.displayName = tempArray[8];
            message.name = tempArray[9];
            message.avatar = tempArray[13];
            message.userRealMoney = tempArray[14];
            message.isPayment = tempArray[10];
            message.isActive = tempArray[11];
            message.isNewLoginDay = tempArray[12];
            if (tempArray.length > 14) {
                message.zoneId = tempArray[15];
                message.lastRoom = tempArray[16];
            }
           
            
        } else {
            message.error = data;
        }

        return message;
    },
    parse_110701_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            rooms: [],
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            tempArray.forEach((element, pos) => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ARRAY);
                tempArray1.forEach((element1, pos1) => {
                    var tempArray2 = element1.split(SocketConstant.SEPERATOR.ELEMENT);
                    cc.log(tempArray2);
                    if (pos1 == 0) {
                        message.rooms.push({
                            roomLevel: tempArray2[0],
                            minCash: tempArray2[1],
                            phongId: tempArray2[2],
                            tables: [{
                                tableIndex: -1,
                                tableSize: 0,
                                firstCashBet: tempArray2[1],
                                matchId: -1,
                                maxNumberPlayer: 4,
                                name: "",
                                isPlaying: 0,
                                phongId: tempArray2[2],
                            }, {
                                tableIndex: -1,
                                tableSize: 0,
                                firstCashBet: tempArray2[1],
                                matchId: -1,
                                maxNumberPlayer: 4,
                                name: "",
                                isPlaying: 0,
                                phongId: tempArray2[2],
                            }],
                        });
                    } else {
                        if (pos1 == tempArray1.length - 1 && pos == tempArray.length - 1) {
                            //cc.log("AAAA");
                            message.currentZone = tempArray2[0];
                        } else {
                            //cc.log("AAAA");
                            message.rooms[pos].tables.push({
                                tableIndex: tempArray2[0],
                                tableSize: tempArray2[1],
                                firstCashBet: tempArray2[2],
                                matchId: tempArray2[3],
                                maxNumberPlayer: tempArray2[4],
                                name: tempArray2[5],
                                isPlaying: tempArray2[6],
                                phongId: tempArray2[3],
                            })
                        }
                    }

                });

            });

        } else {
            message.error = data;
        }

        return message;
    },
    parse_110710_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.tempArray = tempArray;

        } else {
            message.error = data;
        }

        return message;
    },

}
module.exports = CommonParse;
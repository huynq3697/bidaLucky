var Global = require("Global2");
var TQUtil = require('TQUtil');
var Constant = require("Constant");
var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var Utils = require('Utils');
var XocDiaParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1300: {
                return this.parse_1300_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13001: {
                return this.parse_13001_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13002: {
                return this.parse_13002_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13008: {
                return this.parse_13008_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1103: {
                return this.parse_1103_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.parse_3_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1100: {
                return this.parse_1100_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.parse_1105_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.parse_1106_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 2000: {
                return this.parse_2000_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1114: {
                return this.parse_1114_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13006: {
                return this.parse_13006_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13007: {
                return this.parse_13007_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 13004: {
                return this.parse_13004_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121002: {
                return this.parse_121002_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121007: {
                return this.parse_121007_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },
    parse_1300_message(messageId, status, data) {
        var message = {};

        var message = {
            messageId: messageId,
            status: status
        }

        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);

        if (tempArray.length > 1) {

            var messagerStr = tempArray[1] ? tempArray[1] : "";
            var tempArrayChats = messagerStr.split(SocketConstant.SEPERATOR.ARRAY);
            message.listChat = [];
            tempArrayChats.forEach(element => {
                var tempArray1 = element.split(SocketConstant.SEPERATOR.ELEMENT);
                message.listChat.push({
                    username: tempArray1[0],
                    message: Utils.Decoder.decode(tempArray1[1]),
                    userId: Number(tempArray1[2])
                });
            });
        }
        else {
            var tempdata = data;
            var temp = tempdata.split(SocketConstant.SEPERATOR.ELEMENT);
            message.username = temp[1];
            message.message = Utils.Decoder.decode(temp[0]);
            message.userId = Number(temp[2]);
        }

        return message;
    },
    parse_121007_message(messageId, status, data) {

    },
    parse_13001_message(messageId, status, data) {
        var message = {};
        if (status == 1) {
            if (!data) return;
            var values = data.split(Constant.SEPERATOR.ELEMENT);
            message.betside = TQUtil.parseInt(values[0]);
            message.message = values[1];
            return message;
        }
        else {
            if (!data) return;
            message.error = data;
            return message;
        }
    },
    parse_13002_message(messageId, status, data) {
        var message = {};
        if (status == 1) {
            if (!data) return;
            var values = data.split(Constant.SEPERATOR.ELEMENT);
            message.betside = TQUtil.parseInt(values[0]);
            message.idBuy = TQUtil.parseInt(values[1]);
            message.message = values[2];
            return message;
        } else {
            message.error = data;
            return message;
        }
    },
    parse_13008_message(messageId, status, data) {
        var message = {};
        if (status == 1) {
            if (!data) return;
            var values = data.split(Constant.SEPERATOR.ELEMENT);
            message.isOwner = TQUtil.parseInt(values[0]) === 1;
            message.ownerId = TQUtil.parseInt(values[1]);
            message.msg = values[2];
            return message;
        }
        else {
            message.error = data;
            return message;
        }
    },
    parse_1103_message(messageId, status, obj) {
        var data = {};;

        if (!status) {
            data.error = obj;
            return data;
        }

        var values = obj.split(Constant.SEPERATOR.ELEMENT);

        data.id = TQUtil.parseInt(values[0]);
        data.ownerId = TQUtil.parseInt(values[1]);
        data.cancelStatus = TQUtil.parseInt(values[2]);

        return data;
    },
    parse_3_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }
        //:__: Parse reconnect. edited at 2019-07-03 09:37
        data.status = status;
        var strUserAll = obj.split(Constant.SEPERATOR.DIFF_ARRAY)[1];
        var values = obj.split(Constant.SEPERATOR.ELEMENT);

        data.listUsers = [];
        data.minMoney = TQUtil.parseInt(values[0]);
        data.tableId = TQUtil.parseInt(values[1]);
        data.roomName = values[2];
        data.isPlaying = TQUtil.parseInt(values[3]) === 1;
        data.remainTime = TQUtil.parseInt(values[4]);
        data.state = TQUtil.parseInt(values[5]);
        data.capacity = TQUtil.parseInt(values[6]);
        data.totalLe = TQUtil.parseInt(values[7]);
        data.totalChan = TQUtil.parseInt(values[8]);
        data.white4 = TQUtil.parseInt(values[9]);
        data.black4 = TQUtil.parseInt(values[10]);
        data.white3black1 = TQUtil.parseInt(values[11]);
        data.black3white1 = TQUtil.parseInt(values[12]);
        data.isBanCuaChan = TQUtil.parseInt(values[13]) === 1;
        data.isBanCuaLe = TQUtil.parseInt(values[14]) === 1;
        data.ownerId = TQUtil.parseInt(values[15]);

        var arrUser = strUserAll.split(Constant.SEPERATOR.ARRAY);

        for (var i = 0; i < arrUser.length; i++) {
            var strUser = arrUser[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.id = TQUtil.parseInt(strUser[0]);
            user.name = strUser[1];
            user.avatar = strUser[2];
            user.money = TQUtil.parseInt(strUser[3]);
            user.totalLe = TQUtil.parseInt(strUser[4]);
            user.totalChan = TQUtil.parseInt(strUser[5]);
            user.white4 = TQUtil.parseInt(strUser[6]);
            user.black4 = TQUtil.parseInt(strUser[7]);
            user.white3black1 = TQUtil.parseInt(strUser[8]);
            user.black3white1 = TQUtil.parseInt(strUser[9]);

            data.listUsers.push(user);
        }

        //TODO
        // for (var i = 0; i < 18; i++) {
        //     var user = {};
        //     user.id = 3;
        //     user.name = 'dvmc 65';
        //     user.money = 500000;
        //
        //     data.listUsers.push(user);
        // }

        return data;
    },
    parse_1100_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var info = obj.split(Constant.SEPERATOR.ELEMENT);

        data.tableId = TQUtil.parseInt(info[0]);
        data.minMoney = TQUtil.parseInt(info[1]);
        if (info.length > 2) {

            data.selfMoney = TQUtil.parseInt(info[2]);
        }
        if (info.length > 3) {

            data.capacity = TQUtil.parseInt(info[3]);
        }
        if (info.length > 4) {

            data.index = TQUtil.parseInt(info[4]);
        }

        data.listUsers = [];
        this.addMyPlayerToList(data.listUsers, data.selfMoney);

        return data;
    },
    parse_1105_message(messageId, status, obj) {
        var data = {};

        data.status = status;
        if (!status) {
            data.error = obj;
            return data;
        }

        var strUserAll = obj.split(Constant.SEPERATOR.DIFF_ARRAY)[1];
        var info = obj.split(Constant.SEPERATOR.ELEMENT);

        data.listUsers = [];
        data.tableId = TQUtil.parseInt(info[0]);
        data.minMoney = TQUtil.parseInt(info[1]);
        data.isPlaying = TQUtil.parseInt(info[2]) === 1;
        data.capacity = TQUtil.parseInt(info[3]);
        data.roomName = info[4];
        data.tableIndex = TQUtil.parseInt(info[5]);
        var arrUser = strUserAll.split(Constant.SEPERATOR.ARRAY);
        for (var i = 0; i < arrUser.length; i++) {
            var value = arrUser[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.id = TQUtil.parseInt(value[0]);
            user.name = value[1];
            user.avatar = value[2];
            user.money = TQUtil.parseInt(value[3]);
            user.isReady = TQUtil.parseInt(value[4]) === 1;
            user.isObserver = TQUtil.parseInt(value[5]) === 1;
            user.level = TQUtil.parseInt(value[6]);

            data.listUsers.push(user);
        }

        this.addMyPlayerToList(data.listUsers);

        return data;
    },
    parse_1106_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var info = obj.split(Constant.SEPERATOR.ELEMENT);

        var user = {};
        user.id = TQUtil.parseInt(info[0]);
        user.name = info[1];
        user.avatar = info[2];
        user.money = TQUtil.parseInt(info[3]);

        data.listUsers = [];
        data.listUsers.push(user);

        return data;
    },
    parse_2000_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var strUser = obj.split(Constant.SEPERATOR.DIFF_ARRAY)[1];
        var values = obj.split(Constant.SEPERATOR.ELEMENT);
        data.listUsers = [];
        data.totalLe = TQUtil.parseInt(values[0]);
        data.totalChan = TQUtil.parseInt(values[1]);
        data.white4 = TQUtil.parseInt(values[2]);
        data.black4 = TQUtil.parseInt(values[3]);
        data.white3black1 = TQUtil.parseInt(values[4]);
        data.black3white1 = TQUtil.parseInt(values[5]);
        data.state = TQUtil.parseInt(values[6]);
        data.timeLeft = TQUtil.parseInt(values[7]);
        var temp = obj.split(Constant.SEPERATOR.DIFF_ARRAY);
        data.phienId = "#" + temp[0].split(Constant.SEPERATOR.ELEMENT)[8];

        var arrUser = strUser.split(Constant.SEPERATOR.ARRAY);

        for (var i = 0; i < arrUser.length; i++) {
            var value = arrUser[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.id = TQUtil.parseInt(value[0]);
            user.money = TQUtil.parseInt(value[1]);
            user.totalLe = TQUtil.parseInt(value[2]);
            user.totalChan = TQUtil.parseInt(value[3]);
            user.white4 = TQUtil.parseInt(value[4]);
            user.black4 = TQUtil.parseInt(value[5]);
            user.white3black1 = TQUtil.parseInt(value[6]);
            user.black3white1 = TQUtil.parseInt(value[7]);
            data.listUsers.push(user);
        }

        return data;
    },
    parse_1108_message(messageId, status, obj) {
        //Don't have
    },
    parse_1114_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var strUser = obj.split(Constant.SEPERATOR.DIFF_ARRAY)[1];
        var values = obj.split(Constant.SEPERATOR.ELEMENT);

        data.listUsers = [];
        data.ownerId = TQUtil.parseInt(values[0]);
        data.numWhite = TQUtil.parseInt(values[1]);
        data.numBlack = TQUtil.parseInt(values[2]);
        data.isChan = TQUtil.parseInt(values[3]) === 1;
        data.is4Trang = TQUtil.parseInt(values[4]) === 1;
        data.is4Den = TQUtil.parseInt(values[5]) === 1;
        data.is3Trang1Den = TQUtil.parseInt(values[6]) === 1;
        data.is3Den1Trang = TQUtil.parseInt(values[7]) === 1;

        var arrUser = strUser.split(Constant.SEPERATOR.ARRAY);

        for (var i = 0; i < arrUser.length; i++) {
            var value = arrUser[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.id = TQUtil.parseInt(value[0]);
            user.moneyWin = TQUtil.parseInt(value[1]);
            user.currMoney = TQUtil.parseInt(value[2]);
            user.isOut = TQUtil.parseInt(value[3]) === 1;
            user.name = value[5];
            data.listUsers.push(user);
        }

        cc.log(data);

        return data;
    },
    parse_13006_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var values = obj.split(Constant.SEPERATOR.ELEMENT);
        if (values.length == 4) {
            data.typeBet = TQUtil.parseInt(values[0]);
            data.betAdd = TQUtil.parseInt(values[1]);
            data.betTotal = TQUtil.parseInt(values[2]);
            data.remainMoney = TQUtil.parseInt(values[3]);
        } else {
            data.error = values[0];
        }

        return data;
    },
    parse_13007_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var userChan = [];
        var userLe = [];

        var values = obj.split(Constant.SEPERATOR.DIFF_ARRAY);
        cc.log(values);

        var objChan = values[0];
        var objLe = values[1];

        var arrUserChan = objChan.split(Constant.SEPERATOR.ARRAY);
        var arrUserLe = objLe.split(Constant.SEPERATOR.ARRAY);

        for (var i = 0; i < arrUserChan.length; i++) {
            var value = arrUserChan[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.isChan = true;
            user.id = TQUtil.parseInt(value[0]);
            user.moneyReturn = TQUtil.parseInt(value[1]);
            user.totalBetTC = TQUtil.parseInt(value[2]);
            user.currMoney = TQUtil.parseInt(value[3]);

            userChan.push(user);
        }

        for (var i = 0; i < arrUserLe.length; i++) {
            var value = arrUserLe[i].split(Constant.SEPERATOR.ELEMENT);

            var user = {};
            user.isChan = false;
            user.id = TQUtil.parseInt(value[0]);
            user.moneyReturn = TQUtil.parseInt(value[1]);
            user.totalBetTC = TQUtil.parseInt(value[2]);
            user.currMoney = TQUtil.parseInt(value[3]);

            userLe.push(user);
        }

        data.listUsers = userChan.concat(userLe);

        return data;
    },
    parse_13004_message(messageId, status, obj) {
        var data = {};
        if (!status) {
            data.error = obj;
            return data;
        }

        if (!obj) return;

        var values = obj.split(Constant.SEPERATOR.ELEMENT);
        var temp = obj.split(Constant.SEPERATOR.DIFF_ARRAY);
        var phien = "#" + temp[0].split(Constant.SEPERATOR.ARRAY)[1];

        var history = [];
        for (var i = 0; i < values.length; i++) {
            var kq = values[i].toString().split(":");
            if (kq.length == 3) {
                var chanle = TQUtil.parseInt(kq[0]);
                var nutchan = TQUtil.parseInt(kq[1]);
                var nutle = TQUtil.parseInt(kq[2]);
                //1 chan 0 le
                history.push({ type: (chanle == 0) ? "le" : "chan", sonutchan: nutchan, sonutle: nutle, isNewest: false });
            }

        }
        return { history: history, phienId: phien };
    },
    parse_121002_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }

        var content = obj;
        var values = content.split(Constant.SEPERATOR.ELEMENT);

        var user = Global.MySelf;
        user.id = TQUtil.parseInt(values[0]);
        user.name = values[1];
        user.money = TQUtil.parseInt(values[2]);
        user.exp = TQUtil.parseInt(values[3]);
        user.checkMail = TQUtil.parseInt(values[4]);

        Global.MySelf = user;

        return user;
    },
    addMyPlayerToList(listUsers, selfMoney) {
        var user = Linker.userData;
        var p = { id: user.userId, name: user.displayName, money: user.userMoney, exp: user.exp, avatar: user.avatar };
        if (selfMoney > 0) {
            p.money = selfMoney;
        }
        listUsers.push(p);
    },
}
module.exports = XocDiaParse;
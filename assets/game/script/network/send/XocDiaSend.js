var Constant = require('Constant');
var Global = require('Global');
var XocDiaParse = require('XocDiaParse');
var Linker = require('Linker');
var XocDiaSend = cc.Class({

    ctor: function () {
        this.ws = null;
        this.isOpen = false;
        this.url = '';
    },

    init() {
        if (cc.sys.isBrowser) {
            this.url = "wss://" + Global.configHost.host + "/websocket";
        }
        else {
            this.url = "ws://" + Global.configHost.hostIOS + ':' + Global.configHost.websocket + "/websocket";
        }

        cc.log('url: ', this.url);
        // this.url = "wss://xocdiado.com/websocket";
        // this.url = "wss://phe69.com/websocket";
    },

    open() {
        var self = this;
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = function (event) {
            cc.log("OPEN_SUCCES");
            self.isOpen = true;
        };

        this.ws.onerror = function (event) {
            cc.log("OPEN_ERROR");
        };
        this.ws.onclose = function (event) {
            cc.log("CLOSE_SOCKET");
            self.isOpen = false;
        };

        this.ws.onmessage = function (message) {
            self.onParse(message);
        };
    },

    closeSocket() {
        cc.log('mycalll close socket');
        this.ws.close();
    },

    sendRequest(str) {
        var data = {r: []};
        data.r.push({v: str});
        this.send(JSON.stringify(data));
    },

    send(message) {
        Linker.Socket.send(message);
        /*
        if (this.isOpen) {
            this.ws.send(message);
            cc.log("SEND_OK", message);
        } else {
            cc.log("SEND_ERROR", message);
        }
        */
    },

    onParse(message) {
        var parts = [];
        var header = [];
        // cc.log(message.data);
        var data = message.data;

        if (data instanceof ArrayBuffer) {
            data = this.arrayBufferToString(data.slice(12));
        }

        var array = JSON.parse(data).r;
        var length = array.length,
            value = null,
            content = null;

        for (var i = 0; i < length; i++) {
            value = array[i].v;
            parts = value.split(Constant.SEPERATOR.N4);
            header = parts[0].split(Constant.SEPERATOR.ELEMENT);

            if (header[0] === "1") {
                cc.log("Ping Response, Server know i still alive");
                continue;
            } else {
                // socketImpl.getStateMachine().resetFeedbackChecker();
            }

            if (parts.length < 2) {
                cc.log("Message response without content");
                continue;
            } else {
                content = parts[1];
            }

            var reponse = {status: header[1] === "1", content: content};

            if (header[0] !== "2000" && header[0] !== '13006' && header[0] !== '12005')
                cc.log("response: ", header[0], reponse);
            XocDiaParse.parse(header[0], reponse);
        }
    },

    arrayBufferToString(buffer) {
        var array = new Uint8Array(buffer);
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    },

    sendGetLog(page = 1) {
        var str = Constant.CMD.USER_LOG +
            Constant.SEPERATOR.N4 + page;

        this.sendRequest(str);
    },

    sendAdmob(type, comeplete) {
        var str = Constant.CMD.ADMOB +
            Constant.SEPERATOR.N4 + type +
            Constant.SEPERATOR.ELEMENT + comeplete;

        this.sendRequest(str);
    },

    requestGiftCode(code) {
        var str = Constant.CMD.GET_GIFT_CODE +
            Constant.SEPERATOR.N4 + code;

        this.sendRequest(str);
    },

    sendGetUserInfo(uid) {
        var str = Constant.CMD.GET_PLAYER_INFO +
            Constant.SEPERATOR.N4 + uid;

        this.sendRequest(str);
    },

    sendUpdatePhone(phone) {
        var str = Constant.CMD.UPDATE_PHONE_ACCOUNTKIT +
            Constant.SEPERATOR.N4 + phone;

        this.sendRequest(str);
    },

    sendFastLogin(version = 1) {
        var time = new Date().getTime();
        var sign = md5(Global.deviceID + cc.sys.os + time + "vas2@#$(_34#%^&*|})))*vbKLMLlJ");

        var str = Constant.CMD.FAST_LOGIN +
            Constant.SEPERATOR.N4 + Global.deviceID +
            Constant.SEPERATOR.ELEMENT + cc.sys.os +
            Constant.SEPERATOR.ELEMENT + version +
            Constant.SEPERATOR.ELEMENT + time +
            Constant.SEPERATOR.ELEMENT + sign;

        this.sendRequest(str);
    },

    sendLoginFB(socialId, token, version = 1) {
        var str = Constant.CMD.FB_LOGIN +
            Constant.SEPERATOR.N4 + socialId +
            Constant.SEPERATOR.ELEMENT + version +
            Constant.SEPERATOR.ELEMENT + cc.sys.os +
            Constant.SEPERATOR.ELEMENT + token +
            Constant.SEPERATOR.ELEMENT + Global.deviceID;

        this.sendRequest(str);
    },

    //TODO
    sendLogin(username, pass, version = 10) {
        // var message = {"r": [{"v": "1000\u0004" + name + "\u0001DE88E3E4AB202D87754078CBB2DF6063\u00012\u00018\u000196\u000196"}]};
        // var passMD5 = 'DE88E3E4AB202D87754078CBB2DF6063';
        var passMD5 = md5(pass);

        var str = Constant.CMD.LOGIN +
            Constant.SEPERATOR.N4 + username +
            Constant.SEPERATOR.ELEMENT + passMD5 +
            Constant.SEPERATOR.ELEMENT + version +
            Constant.SEPERATOR.ELEMENT + cc.sys.os +
            Constant.SEPERATOR.ELEMENT + Global.deviceID;

        this.sendRequest(str);
    },

    sendRegister(username, pass) {
        var registerTime = new Date().getTime();

        var str = Constant.CMD.REGISTER_ACCOUNT +
            Constant.SEPERATOR.N4 + username +
            Constant.SEPERATOR.ELEMENT + pass +
            Constant.SEPERATOR.ELEMENT + 96 +
            Constant.SEPERATOR.ELEMENT + 96 +
            Constant.SEPERATOR.ELEMENT + 4 +
            Constant.SEPERATOR.ELEMENT + '' +
            Constant.SEPERATOR.ELEMENT + 1 +
            Constant.SEPERATOR.ELEMENT + registerTime +
            Constant.SEPERATOR.ELEMENT + Global.deviceID;

        this.sendRequest(str);
    },

    sendQuickPlay(idZone = 10) {
        var str = Constant.CMD.FAST_PLAY +
            Constant.SEPERATOR.N4 + idZone;

        this.sendRequest(str);
    },

    sendEnterJoin(idZone = 10) {
        var str = Constant.CMD.NEW_ENTER_ZONE +
            Constant.SEPERATOR.N4 + idZone +
            Constant.SEPERATOR.ELEMENT + 0;

        this.sendRequest(str);
    },

    getLeaderboard(type = 1) {
        var str = Constant.CMD.TOP_EXPEST +
            Constant.SEPERATOR.N4 + type;

        this.sendRequest(str);
    },

    getListMail(page = 1) {
        var str = Constant.CMD.GET_MAIL_LIST +
            Constant.SEPERATOR.N4 + page;

        this.sendRequest(str);
    },

    getMailDetail(id) {
        var str = Constant.CMD.GET_MAIL_DETAIL +
            Constant.SEPERATOR.N4 + id;

        this.sendRequest(str);
    },

    sendCancelMatch(idMatch) {
        var str = Constant.CMD.MATCH_CANCEL +
            Constant.SEPERATOR.N4 + idMatch;

        this.sendRequest(str);
    },

    sendJoinZone(idZone) {
        var str = Constant.CMD.NEW_ENTER_ZONE +
            Constant.SEPERATOR.N4 + idZone +
            Constant.SEPERATOR.ELEMENT + "0";

        this.sendRequest(str);
    },

    sendJoinTable(idTable) {
        var str = Constant.CMD.GUEST_JOIN +
            Constant.SEPERATOR.N4 + idTable ;

        this.sendRequest(str);
    },

    sendNgoiTable(idTable) {
        // var str = Constant.CMD.MATCH_JOIN +
        //     Constant.SEPERATOR.N4 + idTable;
        // var str = Constant.CMD.MATCH_NEW +
        //     Constant.SEPERATOR.N4 + idTable + Constant.SEPERATOR.ELEMENT + idTable + Constant.SEPERATOR.ELEMENT + idTable;
        this.sendRequest("1105\u00041000000");
    },

    transferMoney(money, username, noidung, phone) {
        var str = 12011 + Constant.SEPERATOR.N4 + money + Constant.SEPERATOR.ELEMENT + username
            + Constant.SEPERATOR.ELEMENT + noidung
            + Constant.SEPERATOR.ELEMENT + phone;

        this.sendRequest(str);
    },

    sendGetItem(type = 1) {
        var str = Constant.CMD.GET_ITEM_SHOP +
            Constant.SEPERATOR.N4 + type;

        this.sendRequest(str);
    },

    sendPurchase(serviceId, seri, code, price) {
        var str = Constant.CMD.NAPTIEN +
            Constant.SEPERATOR.N4 + serviceId +
            Constant.SEPERATOR.ELEMENT + seri +
            Constant.SEPERATOR.ELEMENT + code +
            Constant.SEPERATOR.ELEMENT + 96 +
            Constant.SEPERATOR.ELEMENT + price;

        this.sendRequest(str);
    },

    sendItemOrder(idItem) {
        var str = Constant.CMD.ITEM_ORDER +
            Constant.SEPERATOR.N4 + idItem;

        this.sendRequest(str);
    },

    sendCancelOrder(id) {
        var str = Constant.CMD.CANCEL_ITEM_ORDER +
            Constant.SEPERATOR.N4 + id;

        this.sendRequest(str);
    },

    sendGetEvents() {
        var str = Constant.CMD.GET_EVENT;

        this.sendRequest(str);
    },

    sendJoinTaiXiu() {
        var str = Constant.CMD.JOIN_TAI_XIU;

        this.sendRequest(str);
    },

    sendGetOrders() {
        var str = Constant.CMD.GET_ORDER_HISTORY;

        this.sendRequest(str);
    },

    sendChangeAva(name) {
        var str = Constant.CMD.UPLOAD_AVATAR +
            Constant.SEPERATOR.N4 + name;

        this.sendRequest(str);
    },

    sendCreateTable(moneyBet, takenMoney = 0, idTable = 0, idRoom = 0) {
        var str = Constant.CMD.MATCH_NEW +
            Constant.SEPERATOR.N4 + idTable +
            Constant.SEPERATOR.ELEMENT + idRoom +
            Constant.SEPERATOR.ELEMENT + moneyBet;

        if (takenMoney > 0) {
            str = str + Constant.SEPERATOR.ELEMENT + takenMoney;
        }

        this.sendRequest(str);
    },
});

module.exports = new XocDiaSend();

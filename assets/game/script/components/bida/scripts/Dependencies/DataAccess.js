var Linker = require('Linker');
const CommonSend = require('CommonSend');
var BiDaConstant = require('BiDaConstant');

var DataAccess = cc.Class({
    extends: cc.Component,

    properties: {

    },

    statics: {
        Instance: null,
    },

    ctor: function () {
        this.userData = {};
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        DataAccess.Instance = this;
        Linker.Event.addEventListener(121001, this.onGetUserData, this);
        Linker.Event.addEventListener(121002, this.onUpdateCash, this);
    },

    onDestroy() {
        Linker.Event.removeEventListener(121001, this.onGetUserData, this);
        Linker.Event.removeEventListener(121002, this.onUpdateCash, this);
    },

    start() {

    },



    // update (dt) {},

    requestUserData() {

    },

    requestUserData(id) {
        if (id) {
            var data = CommonSend.getUserInfo(id);
        } else {
            var data = CommonSend.getUserInfo(Linker.userData.userId);
        }
        Linker.Socket.send(data);
    },

    onGetUserData: function (message) {
        if (message.status == 1) {
            cc.js.mixin(this.userData, message);
            this.updateData();
        }
    },

    onUpdateCash: function (message) {
        if (message.status == 1) {
            // cc.Global.ZONE_GAME: 0 la binh 1 thuong, 1 la minigame, 2 la vqmm
            if (cc.Global.ZONE_GAME == 1) {
                this.userData.userRealMoney = message.money;
            } else if (cc.Global.ZONE_GAME == 2) {
                this.userData.userMoney = message.money;
            } else {
                this.userData.userMoney = message.xumoney;
                this.userData.userRealMoney = message.money;
                this.updateData();
            }
        } else {
            cc.Global.showMessage(message.error);
        }
    },

    updateData() {
        this.node.emit("update-user-data", this.userData);
    },

    getCurrentBalance: function (moneyType) {
        if (moneyType === BiDaConstant.MONEY_TYPE.QUAN) {
            return this.userData.userRealMoney;
        } else if (moneyType === BiDaConstant.MONEY_TYPE.XU) {
            return this.userData.userMoney;
        }
    }
});

module.exports = DataAccess;
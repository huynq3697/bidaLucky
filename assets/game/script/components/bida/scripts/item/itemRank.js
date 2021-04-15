
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        stt: cc.Label,
        money: cc.Label,
        nameuser: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data, stt, checkMoney) {
        this.stt.string = stt;
        this.nameuser.string = data.userName;
        if (checkMoney) {
            this.money.string = Utils.Malicious.moneyWithFormat(data.rank, ".");
        } else {
            this.money.string = data.rank;
        }
    }

    // update (dt) {},
});

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

    init(data, stt) {
        this.stt.string = stt;
        this.money.string = Utils.Malicious.moneyWithFormat(data.moneynap, ".");
        this.nameuser.string = data.viewname;
    }

    // update (dt) {},
});

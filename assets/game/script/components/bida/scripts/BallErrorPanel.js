var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        timeCounter: cc.Node,
        textLoi: cc.Node,
    },
    setCounter: function(time){
        //
        this.textLoi.active = true;
        this.timeCounter.active = true;
        this.textLoi.getComponent(cc.Label).string = i18n.t("your_turn_invalid");
        this.timeCounter.getComponent(cc.Label).string = i18n.t("start_after_seconds") + ": " + time;
    }

    // update (dt) {},
});

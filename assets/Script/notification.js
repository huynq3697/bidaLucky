var Linker = require("Linker");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        txtNoti: cc.Label,
        txtCongra: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this.node.opacity = 0;
        this.node.on("touchstart", this.destroyNoti, this);
        cc.tween(this.node).to(0.18, {opacity: 255}).start();
        var setting = Linker._Home.func.getData("setting");
        this.txtCongra.string = i18n.t("Congratulations!");
    },
    onDisable () {
        this.node.off("touchstart", this.destroyNoti, this);
    },
    start () {
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 3);
    },
    destroyNoti() {
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.15);
    },
    // update (dt) {},
    setNotification(text) {
        this.txtNoti.string = text;
    }
});

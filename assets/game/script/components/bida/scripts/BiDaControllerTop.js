var Linker = require('Linker');
var Global = require("Global2");
cc.Class({
    extends: cc.Component,

    properties: {
        PopupDetailPlayer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.BiDaControllerTop = this;
        cc.director.preloadScene("BiDaHomeScene");
    },

    start() {

    },

    openPopupDetailPlayer() {
        if (this.PopupDetailPlayer) {
            this.PopupDetailPlayer.active = true;
        }
    },
    clickButtonMenu() {
        // this.node.active = false;
        // Linker.SharedLoginHall.showLoginHall();
    },

    clickBackHomeScene() {
        cc.Global.showLoading();

        var userData = Linker.Local.readUserData();
        userData.autoLogin = false;
        Linker.Local.saveUserData(userData);
        cc.Global.showLoading();
        cc.director.preloadScene("BiDaHomeScene", function (completedCount, totalCount, item) {
            var percent = completedCount / totalCount;
        }, function (err, data) {
            cc.Global.hideLoading();
            if (!err) {
                var userData = Linker.Local.readUserData();
                userData.autoLogin = false;
                Linker.Local.saveUserData(userData);
                cc.director.loadScene('BiDaHomeScene', () => {
                    cc.Global.hideLoading();
                });
            } else {
                cc.log("Không thể load lại homescene lỗi xảy ra...");
            }
        });
        Linker.GameManager.isPlayOffline = false;
    },

    clickOpenPopupSetting() {
        if (this.node.getChildByName("PopupOnOffSound")) {
            this.node.getChildByName("PopupOnOffSound").active = true;
        }
    },


    // update (dt) {},
});

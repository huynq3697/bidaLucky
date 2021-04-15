var PopupDisplay = require('PopupDisplay');
cc.Class({
    extends: PopupDisplay,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable() {
    },
    onDisable() {
    },
    start () {

    },
    exitGame() {
        cc.game.end();
    },
    // update (dt) {},
});

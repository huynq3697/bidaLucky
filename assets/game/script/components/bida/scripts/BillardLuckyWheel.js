var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        wheelPageNode: cc.Node,
        prizePageNode: cc.Node,
        historyPage: cc.Node,

        buttonOpenWheelPage: cc.Node,
        buttonOpenPrizePage: cc.Node,
        buttonOpenHistoryPage: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        this.clickOpenWheelPage(null, null);
    },

    // update (dt) {},

    clickOpenWheelPage(event, customEventData) {
        NewAudioManager.playClick();
        this.prizePageNode.active = false;
        this.wheelPageNode.active = true;
        this.historyPage.active = false;

        this.buttonOpenWheelPage.getChildByName("on").active = true;
        this.buttonOpenPrizePage.getChildByName("on").active = false;
        this.buttonOpenHistoryPage.getChildByName("on").active = false;
    },

    clickOpenPrizePage(event, customEventData) {
        NewAudioManager.playClick();
        this.prizePageNode.active = true;
        this.wheelPageNode.active = false;
        this.historyPage.active = false;

        this.buttonOpenWheelPage.getChildByName("on").active = false;
        this.buttonOpenPrizePage.getChildByName("on").active = true;
        this.buttonOpenHistoryPage.getChildByName("on").active = false;
    },

    clickOpenHistoryPage() {
        NewAudioManager.playClick();
        this.prizePageNode.active = false;
        this.wheelPageNode.active = false;
        this.historyPage.active = true;

        this.buttonOpenWheelPage.getChildByName("on").active = false;
        this.buttonOpenPrizePage.getChildByName("on").active = false;
        this.buttonOpenHistoryPage.getChildByName("on").active = true;
    }
});

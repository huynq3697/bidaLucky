var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    start () {

    },

    // update (dt) {},

    onClickButton(event, customEventData) {
        NewAudioManager.playClick();
        switch (customEventData) {
            case 'item-chat': {
                // gán content item chat vào chat box => emit event
                var string = this.node.getChildByName("content").getComponent(cc.Label).string;
                var eventDispatch = new cc.Event.EventCustom('content-quick-chat', true);
                eventDispatch.chat = string;
                this.node.dispatchEvent(eventDispatch);
                // close popup chat nhanh

                break;
            }
        }
    },

    setTextQuickChat(text) {
        this.node.getChildByName("content").getComponent(cc.Label).string = text;
    }
});

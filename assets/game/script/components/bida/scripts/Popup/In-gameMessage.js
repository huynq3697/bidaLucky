// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        messageLabel: cc.RichText
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        var self = this;
        setTimeout(function() {
            self.node.active = false;
        }, 2000);
    },

    start () {

    },

    // update (dt) {},

    setMessage(message) {
        this.messageLabel.string = message;
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        messageLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        this.scheduleOnce(this.removeMessageNode, 2);
    },
    removeMessageNode: function () {
        if (this.node && cc.isValid(this.node)) {
            cc.tween(this.node).to(0.5, { y: this.node.y + this.node.height }, { easing: "sineOut" }).call(() => {
                this.node.destroy();
            }).start()
        } else {
            this.unschedule(this.removeMessageNode);
        }
    },
    start() {

    },

    // update (dt) {},

    initMessage(message) {
        this.messageLabel.string = message;
    }
});

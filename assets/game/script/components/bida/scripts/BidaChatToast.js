cc.Class({
    extends: cc.Component,

    properties: {
       chatString: cc.Label
    },
    showContent: function (data) {
        this.node.opacity = 0;
        this.node.active = true;
        this.chatString.string = data.text;
        this.node.runAction(
            cc.sequence(
                cc.fadeIn(0.3),
                cc.delayTime(2),
                cc.removeSelf()
            )
        )
    }
});

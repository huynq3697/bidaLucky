cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0.3,
    },

    // use this for initialization
    onLoad: function () {
        // this.outOfWorld = cc.v2(3000, 0);
        // this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
    },

    startFadeIn: function () {
        this.node.pauseSystemEvents(true);
        if (this.node.name == "listLevelPro") {
            this.node.position = cc.v2(0, -110);
        } else {
            this.node.position = cc.v2(0, 0);
        }

        this.node.setScale(2);
        this.node.opacity = 0;
        this.node.runAction(this.actionFadeIn);
    },

    startFadeOut: function () {
        this.node.pauseSystemEvents(true);
        this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {
        this.node.resumeSystemEvents(true);
    },

    onFadeOutFinish: function () {
        // this.node.position = this.outOfWorld;
        this.node.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

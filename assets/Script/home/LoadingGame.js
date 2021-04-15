
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Node,
        percentLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this.scheduleOnce(function() {
            if (this && this.node) {
                this.node.active = false;
            }
        }.bind(this), 5);
    },

    start () {
        this.icon.runAction(cc.rotateBy(10, 360).repeatForever());
    },

    setPrecent(str){
        this.percentLabel.string = str;
    }

    // update (dt) {},
});

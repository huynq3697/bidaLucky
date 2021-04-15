// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        logo: cc.Node,
        loading: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.logo.opacity = 0;
        this.loading.opacity = 0;
        this.node.zIndex = cc.macro.MAX_ZINDEX;
    },

    start () {
        this.scheduleOnce(() => {
            cc.tween(this.logo).to(0.8, {opacity: 255}).start();
        }, 1);
        this.scheduleOnce(() => {
            cc.tween(this.loading).to(0.8, {opacity: 255}).start();
        }, 2);
        this.scheduleOnce(() => {
            cc.tween(this.node).to(0.2, {opacity: 0})
                                .call(() => {
                                this.node.destroy();
            }).start();
        }, 5);
    },

    // update (dt) {},
});

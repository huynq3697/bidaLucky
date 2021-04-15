// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0.3,
        scaleRange : 0.1,
        isPlay: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //cc.log(this.node.getScale());
        var range1 = this.node.scale + this.scaleRange;
        var range2 = 1;
        var action1 = cc.scaleTo(this.duration, range1);
        var action2 = cc.scaleTo(this.duration, range2);
        var seq = cc.sequence(action1, action2 );
        this.repeat = cc.repeatForever(seq);
        
        
    },
    onEnable() {
        if (this.isPlay) {
            this.node.runAction(this.repeat);
        }
    },
    onDisable() {
        this.node.stopAllActions();
        this.node.scale = 1;
    },

    start () {

    },

    update (dt) {},
});

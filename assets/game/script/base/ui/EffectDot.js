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
        duration: 0.5,
        scaleRange : 2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //cc.log(this.node.getScale());
        
    },

    start () {

    },
    playEffect(){
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.node.scale = 1;
        var fadeIn = cc.fadeIn(0);
        var fadeOut = cc.fadeOut(this.duration);
        var range1 = 1+ this.scaleRange;
        var range2 = 1;
        var action1 = cc.scaleTo(this.duration, range1);
        var action2 = cc.scaleTo(0, range2);
        var seq = cc.sequence(action1, action2 );
        var seq1 = cc.sequence(fadeOut,fadeIn);
        var spawn = cc.spawn(seq,seq1);
        var repeat = cc.repeat(spawn,1);
        this.node.runAction(repeat);
    },

    update (dt) {},
});

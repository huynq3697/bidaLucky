// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        titleDenLuotBan: cc.Node,
        titleCombo: cc.Node,
        listNum: [cc.SpriteFrame],
        numberCombo: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setDenLuotBan () {
        var aniTurn = this.titleDenLuotBan.getComponent(cc.Animation);
        aniTurn.play("turnPlayer");
    },

    setCombo (count) {
        this.numberCombo.spriteFrame = this.listNum[count - 2];
        var aniCombo = this.titleCombo.getComponent(cc.Animation);
        aniCombo.play("combo");
    }

    // update (dt) {},
});

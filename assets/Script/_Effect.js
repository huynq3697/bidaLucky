// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    scaleNode(node) {
        cc.tween(node).to(0.15, {scale: 1.05}).to(0.15, {scale: 1}).start();
    },

    //left: 1 la chay tu phai sang trai, 2 la chay tu trai sang phai
    showButton(node, isShow, left) {
        if (isShow && left == 1)
            cc.tween(node).to(0.3, {position: cc.v2(350, -85)}, {easing: "easeInQuint"}).start();
        else if (isShow && left == 2)
            cc.tween(node).to(0.3, {position: cc.v2(-350, -85)}, {easing: "easeInQuint"}).start();
        else if (!isShow && left == 1)
            cc.tween(node).to(0.3, {position: cc.v2(1000, -85)}, {easing: "easeOutQuint"}).start();
        else if (!isShow && left == 2)
            cc.tween(node).to(0.3, {position: cc.v2(-1000, -85)}, {easing: "easeOutQuint"}).start();
    },
});

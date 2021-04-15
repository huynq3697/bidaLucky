// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        cardPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.scheduleOnce(() => {
        //     this.init(13);
        // }, 3);
    },

    // update (dt) {},

    init(number) {
        this.node.angle = number;
        for (var i = 0; i < number; ++i)
        {
            var card = cc.instantiate(this.cardPrefab);
            this.node.addChild(card);
        }
        var angle = 0;
        this.node.children.forEach(element => {
            cc.tween(element).to(0.3, {angle: angle}).start();
            angle -= 3;
        });
    },
    remove() {
        this.node.removeAllChildren();
    }
});

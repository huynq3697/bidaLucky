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
        itemBetPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:


    initListBtnBet (arr) {
        this.node.removeAllChildren(true);
        for (let i = 0; i < arr.length; i ++) {
            var itemBetPrefab = cc.instantiate(this.itemBetPrefab);
            itemBetPrefab.active = true;
            // if (i == 0) {
            //     itemBetPrefab.getChildByName("on").active = true;
            // }
            var betSettingItem = itemBetPrefab.getComponent("itemBetSprite");
            betSettingItem.updateCell({ label: arr[i] });
            this.node.addChild(itemBetPrefab);
        }
    },

    start () {

    },

    // update (dt) {},
});

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var PopupDisplay = require('PopupDisplay');
cc.Class({
    extends: PopupDisplay,

    properties: {
        contentScrollView: cc.Node,
        itemPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
    },

    onEnable(){
        this._super();
    },

    start () {

    },

    // update (dt) {},
});

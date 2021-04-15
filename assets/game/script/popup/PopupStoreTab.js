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
        buttonTab : [cc.Button],
        listPrefabItem: [cc.Prefab],
        contentScrollView: cc.Node,
        scrollView: cc.ScrollView
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

    showTabIndex(tabIndex){
        this.show();
        this.chosenTab(tabIndex);
        //,todo chuyen tab
    },

    //overide
    chosenTab(tabIndex){

    }
    // update (dt) {},
});

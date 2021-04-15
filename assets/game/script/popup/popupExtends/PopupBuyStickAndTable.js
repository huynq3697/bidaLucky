// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var PopupStoreTab = require('PopupStoreTab');
var PopupManager = require('PopupManager');
cc.Class({
    extends: PopupStoreTab,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        // this.createTab(PopupManager.PopupBuyStickAndTableConfig.TAB_STICK_INDEX);
    },

    onEnable(){
        this._super();
    },

    start () {
        
    },

    onClickChangeTab(event, data){
        this.createTab(data);
    },

    createTab(tabIndex){
        console.log("create tab   " + PopupManager.PopupBuyStickAndTableConfig.ITEM_WITH_TAB[tabIndex])
        this.listItemNode = [];
        this.contentScrollView.removeAllChildren();
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToLeft();
        var prefabInit = this.listPrefabItem[tabIndex];
        if(prefabInit){
            for(var i =0;i<PopupManager.PopupBuyStickAndTableConfig.ITEM_WITH_TAB[tabIndex];i++){
                var nodeInit = cc.instantiate(prefabInit);
                this.contentScrollView.addChild(nodeInit);
                // nodeInit.getComponent("ItemTab").initItem(i);
            }
        }
    },

    //overide
    chosenTab(tabIndex){
        // console.log("PopupBuyStickj  chosenTab " )
        this.createTab(tabIndex);
    }
    // update (dt) {},
});

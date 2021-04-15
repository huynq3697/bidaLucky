// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var PopupStore = require('PopupStore');
var PopupManager = require('PopupManager');
var DataManger = require('DataManger');
cc.Class({
    extends: PopupStore,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.initData();
    },

    onEnable(){
        this._super();
    },

    start () {
        // add event vao day
        this.node.on(PopupManager.PopupBuyStickConfig.ON_CHANGE_EVENT_CLICK, this.onHandleEvent, this);
        DataManger.signalUpdateUserInfo.add(this.reLoadData.bind(this));
    },

    reLoadData(){
        for(var i =0;i<this.listItemNode.length;i++){
            this.listItemNode[i].getComponent("ItemTab").initItem(i);
        }
    },

    onHandleEvent(event){
        for(var i =0;i<this.listItemNode.length;i++){
            this.listItemNode[i].getComponent("ItemStick").activeEventClick(event.index);
        }
    },
    initData(){
        this.listItemNode = [];
        this.contentScrollView.removeAllChildren();
        
        var prefabInit = this.itemPrefab;
        if(prefabInit){
            for(var i =0;i<PopupManager.PopupBuyStickConfig.NUMBER_ITEM;i++){
                this.listItemNode[i] = cc.instantiate(prefabInit);
                this.contentScrollView.addChild(this.listItemNode[i]);
                this.listItemNode[i].getComponent("ItemTab").initItem(i);
            }
        }
    },
    // update (dt) {},
});

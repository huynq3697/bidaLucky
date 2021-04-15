// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var ItemTab = require('ItemTab');
var DataManger = require('DataManger');
var PopupManager = require('PopupManager');
var TQUtil = require('TQUtil');

cc.Class({
    extends: ItemTab,

    properties: {
        labelDescription:cc.Label,
        spriteItem: cc.Sprite,
        buttonBuy:cc.Node,
        labelMoney:cc.Label,
        selected: cc.Node,
        btnSelect: cc.Node,
        starContent: cc.Node,
        starFrame: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initItem(index){
        this.index = index;
        this.setSpriteTable(index);
        this.selected.active = false;
        this.btnSelect.active = false;
        var activeTable = DataManger.UserData.getTableActive();
        for(var i =0;i<activeTable.length;i++){
            if(this.index === activeTable[i]){
                this.buttonBuy.active = false;
                this.btnSelect.active = true;
            }
        }
        if(this.index === DataManger.UserData.getCurrentTable()){
            this.selected.active = true;
            this.btnSelect.active = false;
        }
        this.dataConfig = PopupManager.PopupBuyTableConfig.DATA[this.index];
        this.labelMoney.string = TQUtil.abbreviate(this.dataConfig.money);
        this.labelDescription.string =  this.dataConfig.description

        this.buttonBuy.getComponent(cc.Button).interactable = DataManger.UserData.getUserMoney() >= this.dataConfig.money;
        this.setStar(index);
    },

    setStar(index) {
        var stars = this.starContent.children;
        var numberStar = this.getNumberStar(index, stars.length);
        for (var i = 0; i < stars.length; i++) {
            if (stars[i]) {
                var starSprite = stars[i].getChildByName("icon").getComponent(cc.Sprite);
                if (starSprite) {
                    if (i < parseInt(numberStar)) { // set ảnh cho các sao đủ sao
                        starSprite.spriteFrame = this.starFrame[2];
                    } else if (i > parseInt(numberStar)) { // set ảnh cho các sao 0 sao
                        starSprite.spriteFrame = this.starFrame[0];
                    } else if (i < numberStar) { // set ảnh cho 1 sao còn lại
                        starSprite.spriteFrame = this.starFrame[1];
                    } else if (i == numberStar) { // set ảnh cho 1 sao còn lại
                        starSprite.spriteFrame = this.starFrame[0];
                    }
                }
            }
        }
    },

    getNumberStar(index, length) {
        var numberStar = 1.5;
        for (var i = 0; i < index; i++) {
            numberStar += 0.5;
        }
        if (numberStar > length) {
            numberStar = length;
        }
        return numberStar;
    },

    setSpriteTable(index) {
        var spriteFrame = cc.Global.tableArray[index];
        if (spriteFrame) {
            this.spriteItem.spriteFrame = spriteFrame;
        }
    },

    onClickButtonBuy(){
        if( DataManger.UserData.getUserMoney() >= this.dataConfig.money){            
            DataManger.UserData.addTableActive(this.index);
            this.buttonBuy.active = false;
            this.btnSelect.active = true;           
            DataManger.UserData.addUserMoney(-this.dataConfig.money)
        }       
    },

    onClickCheckBox(){
        var customEvent = new cc.Event.EventCustom(PopupManager.PopupBuyTableConfig.ON_CHANGE_EVENT_CLICK, true);
        customEvent.index = this.index;
        this.node.dispatchEvent(customEvent);
        DataManger.UserData.setCurrentTable(this.index);
    },

    activeEventClick(index){
        this.selected.active = index == this.index;
        this.btnSelect.active = (index == this.index || DataManger.UserData.getTableActive().indexOf(this.index) == -1) ? false : true;
    }
});

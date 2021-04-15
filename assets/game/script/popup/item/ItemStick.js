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
        spriteAtlas: cc.SpriteAtlas,
        spriteItem: cc.Sprite,
        buttonBuy:cc.Node,
        labelMoney:cc.Label,
        labelDescription:cc.Label,
        spineArr: [sp.SkeletonData],
        effect: sp.Skeleton,
        selected: cc.Node,
        btnSelect: cc.Node,
        starContent: cc.Node,
        starFrame: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initItem(index){
        this.index = index;
        this.spriteItem.spriteFrame = this.spriteAtlas.getSpriteFrame(index);
        this.selected.active = false;
        this.btnSelect.active = false;
        var activeStick = DataManger.UserData.getStickActive();
        for(var i =0;i<activeStick.length;i++){
            if(this.index === activeStick[i]){
                this.buttonBuy.active = false;
                this.btnSelect.active = true;
            }
        }
        if(this.index === DataManger.UserData.getCurrentStick()){
            this.selected.active = true;
            this.btnSelect.active = false;
        }
        this.dataConfig = PopupManager.PopupBuyStickConfig.DATA[this.index];
        this.labelMoney.string = TQUtil.abbreviate(this.dataConfig.money);;
        this.labelDescription.string =  this.dataConfig.description
        // if()
        this.buttonBuy.getComponent(cc.Button).interactable = DataManger.UserData.getUserMoney() >= this.dataConfig.money;
        this.setEffect(index);
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
        var numberStar = 0.5;
        for (var i = 0; i < index; i++) {
            numberStar += 0.5;
        }
        if (numberStar > length) {
            numberStar = length;
        }
        return numberStar;
    },
    
    setEffect(index) {
        this.effect.node.active = false;
        if (index > 0) {
            this.effect.node.active = true;
            var skeletonData = this.spineArr[index-1];
            this.effect.skeletonData = skeletonData;
            this.effect.animation = "animation";
            // this.effect.clearTracks(0);
            // this.effect.addAnimation(0, "animation", true);
        }
    },

    onClickButtonBuy(){
        if( DataManger.UserData.getUserMoney() >= this.dataConfig.money){   
            DataManger.UserData.addStickActive(this.index);
            this.buttonBuy.active = false;
            this.btnSelect.active = true;  
            DataManger.UserData.addUserMoney(-this.dataConfig.money)
        }       
    },

    onClickCheckBox(){
        var customEvent = new cc.Event.EventCustom(PopupManager.PopupBuyStickConfig.ON_CHANGE_EVENT_CLICK, true);
        customEvent.index = this.index ;
        this.node.dispatchEvent(customEvent);
        DataManger.UserData.setCurrentStick(this.index);
    },

    activeEventClick(index){
        this.selected.active = index == this.index;
        this.btnSelect.active = (index == this.index || DataManger.UserData.getStickActive().indexOf(this.index) == -1) ? false : true;
    }
});

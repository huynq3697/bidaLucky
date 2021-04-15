// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var PopupDisplay = require('PopupDisplay');

var PopupManager = require('PopupManager');
var DataManger = require('DataManger');
var TQUtil = require('TQUtil');
var PopupShowManager = require('PopupShowManager');
cc.Class({
    extends: PopupDisplay,

    properties: {
        userName:cc.Label,
        money:cc.Label,
        avatar:cc.Sprite,
        avatarAtlas:cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();  
        DataManger.signalUpdateUserInfo.add(this.onUpdateUserInfo.bind(this));   
        this.onUpdateUserInfo();
    },

    onEnable(){
        this._super();
    },

    start () {
        DataManger.signalUpdateUserInfo.add(this.reLoadData.bind(this));
    },

    onUpdateUserInfo() {
        this.userName.string = DataManger.UserData.getUserName();
        this.money.string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());
        this.setAvatar();
    },

    setAvatar() {
        var spriteFrame = this.avatarAtlas.getSpriteFrame("avatar_" + (DataManger.UserData.getUserAvatar() + 1));
        if (spriteFrame) {
            this.avatar.spriteFrame = spriteFrame;
        }
    },

    reLoadData(){

    },

    onBtnChangeName() {
        PopupShowManager.Instance.showPopupChangeName();
    },

    onBtnChangeAvatar() {
        PopupShowManager.Instance.showPopupChangeAvatar();
    },
    // update (dt) {},
});

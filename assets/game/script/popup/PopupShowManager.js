// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var PopupManager = require('PopupManager');

var PopupShowManager = cc.Class({
    extends: cc.Component,

    properties: {
        popupStoreFrefab: cc.Prefab,
        popupStickPrefab: cc.Prefab,
        popupTablePrefab: cc.Prefab,
        vqmmPrefab: cc.Prefab,
        userInforPrefab: cc.Prefab,
        changeNamePrefab: cc.Prefab,
        changeAvatarPrefab: cc.Prefab,
        iapPrefab: cc.Prefab,
        settingPrefab: cc.Prefab,
        moreGamePrefab: cc.Prefab,
        exitPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:
    statics: {
        Instance: null,
    },
    onLoad () {
        PopupShowManager.Instance = this;
    },

    start () {

    },

    showPopupStick(){
        if(!this.popupBuyStick){
            this.popupBuyStick = cc.instantiate(this.popupStickPrefab);
            this.node.addChild(this.popupBuyStick, PopupManager.POPUP_ZORDER);
        }
        this.popupBuyStick.getComponent("PopupDisplay").show();
    },

    showPopupTable(){
        if(!this.popupBuyTable){
            this.popupBuyTable = cc.instantiate(this.popupTablePrefab);
            this.node.addChild(this.popupBuyTable, PopupManager.POPUP_ZORDER);
        }
        this.popupBuyTable.getComponent("PopupDisplay").show();
    },

    showPopupStore(tabIndex){
        if(!this.popupStore){
            this.popupStore = cc.instantiate(this.popupStoreFrefab);
            this.node.addChild(this.popupStore, PopupManager.POPUP_ZORDER);
        }
        this.popupStore.getComponent("PopupStoreTab").showTabIndex(tabIndex);
    },

    showPopupVQMM(){
        if(!this.vqmm){
            this.vqmm = cc.instantiate(this.vqmmPrefab);
            this.node.addChild(this.vqmm, PopupManager.POPUP_ZORDER);
        }
        this.vqmm.position = cc.v2(0, 0);
        this.vqmm.getComponent("PopupDisplay").show();
    },

    showPopupUserInfor(){
        if(!this.userInfor){
            this.userInfor = cc.instantiate(this.userInforPrefab);
            this.node.addChild(this.userInfor, PopupManager.POPUP_ZORDER);
        }
        this.userInfor.position = cc.v2(0, 0);
        this.userInfor.getComponent("PopupDisplay").show();
    },

    showPopupChangeName(){
        if(!this.changeName){
            this.changeName = cc.instantiate(this.changeNamePrefab);
            this.node.addChild(this.changeName, PopupManager.POPUP_ZORDER);
        }
        this.changeName.position = cc.v2(0, 0);
        this.changeName.getComponent("PopupDisplay").show();
    },

    showPopupChangeAvatar(){
        if(!this.changeAvatar){
            this.changeAvatar = cc.instantiate(this.changeAvatarPrefab);
            this.node.addChild(this.changeAvatar, PopupManager.POPUP_ZORDER);
        }
        this.changeAvatar.position = cc.v2(0, 0);
        this.changeAvatar.getComponent("PopupDisplay").show();
    },

    showPopupIAP(isShowAds){
        if(!this.iap){
            this.iap = cc.instantiate(this.iapPrefab);
            this.node.addChild(this.iap, PopupManager.POPUP_ZORDER);
        }
        this.iap.position = cc.v2(0, 0);
        this.iap.getComponent("PopupDisplay").show();
        this.iap.getComponent("IAP").showBtnAds(isShowAds);
    },

    showPopupSetting(){
        if(!this.setting){
            this.setting = cc.instantiate(this.settingPrefab);
            this.node.addChild(this.setting, PopupManager.POPUP_ZORDER);
        }
        this.setting.position = cc.v2(0, 0);
        this.setting.getComponent("PopupDisplay").show();
    },

    showPopupMoreGame(){
        if(!this.moreGame){
            this.moreGame = cc.instantiate(this.moreGamePrefab);
            this.node.addChild(this.moreGame, PopupManager.POPUP_ZORDER);
        }
        this.moreGame.position = cc.v2(0, 0);
        this.moreGame.getComponent("PopupDisplay").show();
    },

    showPopupExit(){
        if(!this.exit){
            this.exit = cc.instantiate(this.exitPrefab);
            this.node.addChild(this.exit, PopupManager.POPUP_ZORDER);
        }
        this.exit.position = cc.v2(0, 0);
        this.exit.getComponent("PopupDisplay").show();
    },
    // update (dt) {},
});

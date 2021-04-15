
var Api = require('Api');
var Linker = require('Linker');
const BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
var DataAccess = require('DataAccess');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    ctor () {
        this.data = {}
    },
    properties: {
        nameCue: cc.Label,
        cue: cc.Sprite,
        price: cc.Label,
        btnChange: cc.Node,
        btnBuy: cc.Node,
        cueSpriteFrame: cc.SpriteAtlas,
        cueUsingNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.onReceiveCueId(Linker.userData);
    },

    onEnable() {
        this.node.parent.on(BiDaConstant.POPUP_EVENT.CUE_STORE.SEND_CUEID, this.onReceiveCueId, this);
    },

    onReceiveCueId(event) {
        cc.log(event);
        if (event.cueId == this.data.cueId) {
            this.cueUsingNode.active = true;
        } else {
            this.cueUsingNode.active = false;
        }
    },

    onClickBtn (event) {
        var target = event.currentTarget;
        NewAudioManager.playClick();
        if (target == this.btnBuy) {
            var url = Linker.Config.APP_API +"/ApiBidaCateCue/changeCue";
            this.handleBtnBuy(url);
        } else if (target == this.btnChange) {
            var url = Linker.Config.APP_API +"/ApiBidaCateCue/changeMyCue";
            this.handleBtnChange(url);
        } 
    },

    init(data, buy, change) {
        this.data = data;
        // this.node.opacity = 255;
        this.nameCue.string = this.data.title;
        this.price.string = Utils.Malicious.moneyWithFormat(this.data.moneybuy, ".");
        this.btnBuy.active = buy;
        this.btnChange.active = change;
        this.cue.spriteFrame = this.cueSpriteFrame.getSpriteFrame(this.data.cueId);
    },

    handleBtnBuy (url) {
        var userId  = DataAccess.Instance.userData.userId;
        var username = DataAccess.Instance.userData.viewname;
        var cueId = this.data.cueId;
        var data = `uid=${userId}&username=${username}&cueId=${cueId}&lang=${Linker.gameLanguage}`;
        // var url = Linker.Config.APP_API +"/ApiBidaCateCue/changeCue";
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            if (result.error == 1) {
                //TODO: Xử lý mua gậy thành công ở đây
                cc.Global.showMessage(i18n.t(result.msg));
            } else {
                cc.Global.showMessage(i18n.t(result.msg));
            }
        });
    },

    handleBtnChange (url) {
        var userId  = DataAccess.Instance.userData.userId;
        var username = DataAccess.Instance.userData.viewname;
        var cueId = this.data.cueId;
        var data = `uid=${userId}&username=${username}&cueId=${cueId}&lang=${Linker.gameLanguage}`;
        var that = this;
        // var url = Linker.Config.APP_API +"/ApiBidaCateCue/changeCue";
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            cc.Global.showMessage(i18n.t(result.msg));
            if (result.error == 1) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.CUE_STORE.SEND_CUEID, true);
                customEvent.cueId = cueId;
                Linker.userData.cueId = cueId;
                that.node.dispatchEvent(customEvent);
            }
        });
    }

    // update (dt) {},
});

var PopupDisplay = require('PopupDisplay');
var DataManger = require('DataManger');
var i18n = require('i18n');
var Linker = require('Linker');
var Constant = require('Constant');
var TQUtil = require('TQUtil');
var Utils = require('Utils');
cc.Class({
    extends: PopupDisplay,

    properties: {
        iap1Label: cc.Label,
        iap2Label: cc.Label,
        iap3Label: cc.Label,
        btnGetAds: cc.Node,
        moneyAds: cc.Label,
    },

    // onLoad () {},

    start () {
        Linker.IAP = this;
        this.moneyAds.string = Utils.Malicious.moneyWithFormat(DataManger.MoneyConfig.ADS, ".");

        this.iap1Label.string = "0.99$ = " + TQUtil.abbreviate(Constant.IAP_MONEY.IAP1);
        this.iap2Label.string = "1.99$ = " + TQUtil.abbreviate(Constant.IAP_MONEY.IAP2);
        this.iap3Label.string = "2.99$ = " + TQUtil.abbreviate(Constant.IAP_MONEY.IAP3);
    },

    onEnable() {
        this.isClickAds = false;
    },

    onShowQC(event) {
        if (!this.isClickAds) {
            this.isClickAds = true;
            Linker.eventGetMoney = event;
            if(Linker.MySdk){
                Linker.MySdk.showRewarded();
            }
        } else {
            cc.Global.showMessage(i18n.t("Loading data please wait a second"));
        }
    },

    onBtnClickVideoAds() {

    },

    showBtnAds(isShow) {
        this.btnGetAds.active = (isShow) ? true : false;
    },

    iap1() {
        if (cc.sys.isNative) {
            Linker.MySdk.iap1();
        } else {
            cc.Global.showMessage(i18n.t("Not support device"));
        }
    },

    iap2() {
        if (cc.sys.isNative) {
            Linker.MySdk.iap2();
        } else {
            cc.Global.showMessage(i18n.t("Not support device"));
        }
    },

    iap3() {
        if (cc.sys.isNative) {
            Linker.MySdk.iap3();
        } else {
            cc.Global.showMessage(i18n.t("Not support device"));
        }
    },

    // update (dt) {},
});

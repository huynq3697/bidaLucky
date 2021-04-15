var Linker = require('Linker');
var LoginCache = require('LoginCache');
var Global = require("Global2");
const BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        billardAuthenGatePrefab: cc.Prefab,//chua dang nhap, dang ky panel
        billardHomeMid: cc.Node,
        billardHomeTop: cc.Node,
        runChoosePlayerPrefab: cc.Prefab,
    },

    onLoad: function () {
        this.billardAuthenGate = this.node.getChildByName("BillardAuthenGate");
    },

    onEnable: function () {
        this.addEventButtonToNode();
        this.initAuthenGate();
    },
    addEventButtonToNode: function () {
        this.node.on(BiDaConstant.POPUP_EVENT.SIGN_UP.CLOSE, this.showPortalLoginGate, this);
    },
    showPortalLoginGate: function () {
        if (this.billardAuthenGate != null || (this.billardAuthenGate && cc.isValid(this.billardAuthenGate))) {
            this.billardAuthenGate.active = true;
            this.onResize();
        }
        this.billardHomeMid.active = false;
        this.billardHomeTop.active = false;
        this.node.active = true;
    },
    showPanelSignUpAuthenGate: function (enable) {
        this.billardAuthenGate.active = true;
    },
    clearPasswordCache: function () {
        //LoginCache.remove();
        //cc.log("Remove password remember ...");
    },
    onResize: function () {
        if (this.billardAuthenGate && cc.isValid(this.billardAuthenGate)) {
            var bg = this.billardAuthenGate.getChildByName("background");
            if (bg) {
                var bgResize = bg.getComponent("BgResize");
                if (bgResize) {
                    bgResize.onResize();
                }
            }
        }
    },
    initAuthenGate() {
        // if (this.billardAuthenGate == null || (this.billardAuthenGate && !cc.isValid(this.billardAuthenGate))) {
        //     if (cc.find("BillardAuthenGate", this.node))
        //     {

        //     }
        //     Utils.Malicious.removeNodeByNameFromParent("BillardAuthenGate", this.node);
        //     var billardAuthenGate = cc.instantiate(this.billardAuthenGatePrefab);
        //     this.node.addChild(billardAuthenGate);
        //     this.billardAuthenGate = billardAuthenGate;

        // } else if (this.billardAuthenGate && cc.isValid(this.billardAuthenGate)) {
        //     this.billardAuthenGate.active = true;
        //     this.onResize();
        // }
        if (this.billardAuthenGate && cc.isValid(this.billardAuthenGate)) {
                this.billardAuthenGate.active = true;
                this.onResize();
        }
    }
});

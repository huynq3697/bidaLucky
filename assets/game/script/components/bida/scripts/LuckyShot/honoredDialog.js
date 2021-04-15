var Utils = require('Utils');
var Linker = require('Linker');
var GameConstant = require('GameConstant');
var Api = require('Api');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
       content: cc.Node,
       itemHonoredPrefab: cc.Prefab,
    },

    // onLoad () {},

    onEnable() {
        var self = this;
        Api.get(Global.configPurchase.API_URL + "api-hu-rong-history?slot="+GameConstant.IDHUSLOT.idLuckyShot, (data) => {
            if (data) {
                self.updateHonoredJackpot(data.array);
            }
        });
    },

    updateHonoredJackpot(array) {
        var self = this;
        this.content.destroyAllChildren();
        array.forEach((element, pos) => {
            var honored = cc.instantiate(self.itemHonoredPrefab);
            var ItemHonored = honored.getComponent(require('ItemHistory'));
            if (ItemHonored) {
                cc.log("ItemHonored element:", element);
                ItemHonored.init(element);
            }
            self.content.addChild(honored);
        });

    },

    onBtnCloseHonored: function () {
        this.node.active = false;
    },

    start () {

    },

    // update (dt) {},
});

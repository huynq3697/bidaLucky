var Constant = require('Constant2').Constant;
var functionAll = require("functionAll");
cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getModeGame: function () {
        for (var i = 0; i < this.node.childrenCount; ++i)
        {
            var checkMark = this.node.children[i].getChildByName("checkmark");
            if (checkMark.active)
            {
                if (this.node.children[i].name == "toggle1")
                    return Constant.GameMode.CoinMode;
                else if (this.node.children[i].name == "toggle2")
                    return Constant.GameMode.NhatAnTatMode;
                else if (this.node.children[i].name == "toggle3")
                    return Constant.GameMode.DemLaMode;
            }
        }
    },
    // update (dt) {},
});

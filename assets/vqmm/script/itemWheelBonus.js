var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        amount: cc.Label,
        lineVe: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker.VQMM.node.on("result", this.onResult, this);
    },

    start () {

    },

    init(data) {
        this.amount.string = data;
    },

    onResult(message) {
        if (Utils.Malicious.moneyWithFormat(message.data[1], ".") == this.amount.string) {
            this.lineVe.active = true;
            var tween = cc.tween().repeat(6, 
                cc.tween().to(0.1, {scale: 1.05}, {easing: "smooth"}).to(0.1, {scale: 0.9}, {easing: "smooth"})
                ).to(0.1, {scale: 1});
            tween.clone(this.lineVe).start();
        }
    },
});

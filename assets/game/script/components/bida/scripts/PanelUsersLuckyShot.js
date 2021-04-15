
cc.Class({
    extends: cc.Component,

    properties: {
        billardPointTo: cc.Node,
        redPointNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    getRedPointNode: function (params) {
        return this.redPointNode;
    },
    getBillardPointTo: function () {
        return this.billardPointTo;
    },
    // update (dt) {},
});

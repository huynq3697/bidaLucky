
cc.Class({
    extends: cc.Component,

    properties: {
        iconNhat : cc.Node,
        iconNhi : cc.Node,
        iconBa : cc.Node,
        iconBet : cc.Node,
        vongSang1 : cc.Node,
        vongSang2 : cc.Node,
        iconTitle : cc.Node
    },

    EnableIcon(){
        this.iconNhat.active = false;
        this.iconNhi.active = false;
        this.iconBa.active = false;
        this.iconBet.active = false;
        this.vongSang1.active = false;
        this.vongSang2.active = false;
        this.iconTitle.active = false;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // },

    start () {

    },

    // update (dt) {},
});


cc.Class({
    extends: cc.Component,

    properties: {
        numPage: cc.Label,
        spriteActivePage: cc.SpriteFrame,
        spriteDeactivePage: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setNumPage(num) {
        this.numPage.string = num;
    },

    setActivePage() {
        //this.numPage.node.color = new cc.Color(255, 163, 0);
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteActivePage;
    },

    setDeactivePage() {
        //this.numPage.node.color = new cc.Color(255, 255, 255);
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteDeactivePage;
    }
});

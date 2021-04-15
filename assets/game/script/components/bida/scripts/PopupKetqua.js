var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        resultMoneyWin: cc.Node,
        resultMoneyLost: cc.Node,
        titleWin: cc.Node,
        titleLost: cc.Node,
        namePlayer1: cc.Label,
        namePlayer2: cc.Label,
        avatarPlayer1: cc.Sprite,
        avatarPlayer2: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init( resultMoney, setActiveWin, setActiveLost, data1, data2) {
        if (setActiveWin) {
            this.resultMoneyWin.getComponent(cc.Label).string = resultMoney;
            this.resultMoneyWin.active = true;
            this.titleWin.active = true;
        }
        if (setActiveLost) {
            this.titleLost.active = true;
            this.resultMoneyLost.getComponent(cc.Label).string = resultMoney;
            this.resultMoneyLost.active = true;
        }
        this.namePlayer1.string = data1.name;
        this.namePlayer2.string = data2.name;
        var spriteAvatar1 = Linker.listAvatar[Number(data1.avatar) - 1];
        if (spriteAvatar1) {
            this.avatarPlayer1.spriteFrame = Linker.listAvatar[Number(data1.avatar) - 1];
        } else {
            this.avatarPlayer1.spriteFrame = Linker.listAvatar[Number(0)];
        }
        var spriteAvatar2 = Linker.listAvatar[Number(data2.avatar) - 1];
        if (spriteAvatar2) {
            this.avatarPlayer2.spriteFrame = Linker.listAvatar[Number(data2.avatar) - 1];
        } else {
            this.avatarPlayer2.spriteFrame = Linker.listAvatar[Number(0)];
        }
    },
    start () {

    },

    // update (dt) {},
});

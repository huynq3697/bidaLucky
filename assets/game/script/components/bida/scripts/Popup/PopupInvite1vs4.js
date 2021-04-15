
var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        avatar: cc.Sprite,
        level: cc.Label,
        money: cc.Label,
        txtBet: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    updateInfo () {
        this.level.string = Linker.userData.userLevel;
        this.money.string = Utils.Number.format(Linker.userData.userMoney);
        this.txtBet.string = Utils.Number.format(Linker.valueBetSprite);
        this.updateAvatar();
    },

    updateAvatar() {
        var id = Linker.userData.avatar;
        this.setAvatarAsId(id);
    },

    setAvatarAsId: function (id) {
        if (isNaN(id)) {
            id = 1;
        }
        id = Number(id);
        var frame = this.avatarAtlas.getSpriteFrame("avatar (" + id + ")");
        if (!frame) {
            frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
        }
        if (Linker.avatarFbFrame) {
            frame = Linker.avatarFbFrame;
        }
        this.avatar.spriteFrame = frame;
    },

    clickButtonBack () {
        Linker.BillardsGameTableController.leaveTableRequest();
        
    },
    
    moiChoiBtnClick() {
        this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.INVITE_SEND.OPEN, true));
    },
    // update (dt) {},
});

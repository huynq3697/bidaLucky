
var DataManger = require('DataManger');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarSprite: cc.Sprite,
        bgActive: cc.Node,
        avatarAtlas: cc.SpriteAtlas,
    },

    // onLoad () {},
    initItem(index) {
        this.itemId = index;
        this.avatarSprite.spriteFrame = this.avatarAtlas.getSpriteFrame("avatar_" + (index + 1));
        this.bgActive.active = (DataManger.UserData.getUserAvatar() == index) ? true : false;
        DataManger.signalUpdateUserInfo.add(this.onUpdateUserInfo.bind(this));
    },

    start () {

    },

    onUpdateUserInfo () {
        this.bgActive.active = (DataManger.UserData.getUserAvatar() == this.itemId) ? true : false;
    },

    onBtnAccept () {
        DataManger.UserData.setUserAtavar(this.itemId);
    }

    // update (dt) {},
});

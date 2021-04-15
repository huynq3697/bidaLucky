var PopupDisplay = require('PopupDisplay');
var DataManger = require('DataManger');
var i18n = require('i18n');
cc.Class({
    extends: PopupDisplay,

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        itemAvatarPrefab: cc.Prefab,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.createListAvatar();
    },

    onEnable() {

    },

    createListAvatar() {
        this.content.removeAllChildren();
        var avatarArr = this.avatarAtlas.getSpriteFrames();
        for (var i = 0; i < avatarArr.length; i++) {
            var avatar = cc.instantiate(this.itemAvatarPrefab);
            this.content.addChild(avatar);
            var avatarJs = avatar.getComponent("itemAvatar");
            if (avatarJs) {
                avatarJs.initItem(i);
            }
        }
    },

    onBtnAccept() {
        if (!this.nameEditbox.string) {
            cc.Global.showMessage(i18n.t("Please input username !"));
        } else {
            DataManger.UserData.setUserName(this.nameEditbox.string);
            this.onClickExit();
        }
    }

    // update (dt) {},
});


var BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        PopupPlayWithFriend: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:


    start() {

    },
    clickBtnClose() {
        this.node.active = false;
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.OPEN_HOME_MID, true);
        this.node.dispatchEvent(customEvent);
    },

    showPopupChooseTypeGame() {
        var contentPopup = this.node.getChildByName("contentNode");
        if (contentPopup && cc.isValid(contentPopup)) {
            contentPopup.active = true;
            const checkPopup = this.getPoupPlayerWithFriend();
            if (checkPopup) {
                checkPopup.active = true;
            }
        }

    },
    getPoupPlayerWithFriend: function () {
        var contentPopup = this.node.getChildByName("contentNode");
        var _popupChoosePlayWithFriend = null;
        if (contentPopup && cc.isValid(contentPopup)) {
            if (contentPopup && cc.isValid(contentPopup)) {
                _popupChoosePlayWithFriend = contentPopup.getChildByName("PopupChoosePlayWithFriend");
                if (!_popupChoosePlayWithFriend || (_popupChoosePlayWithFriend && !cc.isValid(_popupChoosePlayWithFriend))) {
                    _popupChoosePlayWithFriend = cc.instantiate(this.PopupPlayWithFriend);
                    contentPopup.addChild(_popupChoosePlayWithFriend);
                }
            }
        }
        return _popupChoosePlayWithFriend;
    },
    hidePopupChooseTypeGame() {
        var popupPlayWithFriend = this.getPoupPlayerWithFriend();
        if (popupPlayWithFriend) {
            popupPlayWithFriend.active = false;
        }
    },
    showPopupBetButon(listArrBet) {
        const popupPlayWithFriend = this.getPoupPlayerWithFriend();
        if (popupPlayWithFriend) {
            popupPlayWithFriend.active = true;
            var popupPlayWithFriendJS = popupPlayWithFriend.getComponent("PopupChoosePlayWithFriend");
            popupPlayWithFriendJS.initListBtnBet(listArrBet);
        }
    },

    // update (dt) {},
});

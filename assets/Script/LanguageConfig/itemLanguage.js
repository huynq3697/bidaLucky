
cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label
    },

    // onLoad () {},

    start () {

    },

    onBtnClick () {
        var customEvent = new cc.Event.EventCustom("EVENT_SELECTED_LANGUAGE_CONFIG", true);
        customEvent.idLanguage = this.idLanguage;
        customEvent.nameLanguage = this.nameLanguage;
        customEvent.itemJs = this;
        this.node.dispatchEvent(customEvent);
    },

    setName (str) {
        this.nameLabel.string = str;
        this.nameLanguage = str;
    },

    setId (id) {
        this.idLanguage = id;
    }

    // update (dt) {},
});

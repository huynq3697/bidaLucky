var NewAudioManager = require("NewAudioManager");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onCopy, this);
    },
    onCopy: function (event) {
        NewAudioManager.playClick();
        if (cc.sys.isNative) {
            jsb.copyTextToClipboard(this.copyText);
            cc.Global.showMessage(i18n.t("Đã copy"));
        } else {
            cc.Global.showMessage(i18n.t("Không hỗ trợ trên web"));
        }
    },
    setCopyText: function (text) {
        this.copyText = text;
    }

    // update (dt) {},
});

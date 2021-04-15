var Utils = require('Utils');
var i18n = require("i18n");
cc.Class({
    extends: cc.Component,
    properties: {
        alertPrefab: {
            default: null,
            type: cc.Prefab
        },
        nodePrint: cc.Node,
    },
    alert: function (msg, type, okCallback, cancelCallback) {
        Utils.Malicious.removeNodeByNameFromParent("Alert", this.node);
        let alert = cc.instantiate(this.alertPrefab);
        let alertJS = alert.getComponent('Alert');

        this.node.addChild(alert, cc.macro.MAX_ZINDEX);
        this.node.zIndex = Utils.Malicious.getMaxZindex();
        if (type == G.AT.OK_CANCEL_BUTTON) {
            var tmpData = msg;
            msg = tmpData.msg;
            var btn = tmpData.btn;
            var msgCopy = tmpData.msgCopy;
            alertJS.setCopyViewname({text: msgCopy, btn: btn});
        }else{
            alertJS.hideCopyViewname();
        }
        alertJS.setString(i18n.t(msg));
        alertJS.setType(type);
        alertJS.setCallBack(okCallback, cancelCallback);
    },
    print: function (msg) {
        this.nodePrint.opacity = 255;
        this.nodePrint.setPosition(0, 0);
        this.nodePrint.getComponent(cc.Label).string = msg;
        let spawn = cc.spawn(cc.moveBy(3, 0, 150), cc.fadeOut(3.0));
        this.nodePrint.runAction(spawn);
    },
});

var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onEnable: function () {
        if (this.nodeIndex === undefined) {
            this.nodeIndex = this.node.zIndex;
        }
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // self.node.opacity = 255;
            self.time = Date.now();
            var cvas = cc.find("Canvas/MiniGame/Container");
            self.node.zIndex = Utils.Malicious.getMaxZindex(cvas);
            // self.blurMiniGameCanvas();
            self.curPosTouched = new cc.Vec2(event.getLocation().x - self.node.position.x, event.getLocation().y - self.node.position.y);
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

            if (self.curPosTouched && self.time - Date.now() < -100) {
                var pos = new cc.Vec2(event.getLocation().x - self.curPosTouched.x, event.getLocation().y - self.curPosTouched.y);
                self.node.position = pos;
            }

        });

        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            self.onEndOrCancelTouch();
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            self.onEndOrCancelTouch();
        });
    },

    onDisable: function () {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
    },

    onEndOrCancelTouch: function () {
        this.time = Date.now();
        var cvas = cc.find("Canvas/MiniGame/Container");
        this.node.zIndex = Utils.Malicious.getMaxZindex(cvas);
        // this.blurMiniGameCanvas();
        this.curPosTouched = null;
    },


    turnOn() {
        this.onEnable();
    },

    turnOff() {
        this.onDisable();
    },
    blurMiniGameCanvas: function () {
        var cvas = cc.find("Canvas/MiniGame/Container");
        if (cvas) {
            for (var i = 0; i < cvas.children.length; i++) {
                var child = cvas.children[i];
                if (child.name != this.node.name) {
                    child.opacity = 250;
                } else {
                    child.opacity = 255;
                }
            }
        }
    }
});

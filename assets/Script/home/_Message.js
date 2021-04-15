cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this.node.opacity = 0;
        cc.tween(this.node).to(0.18, {opacity: 255}).start();
        var func = this.node.getComponent("functionAll");
        var setting = func.getData("setting");
        switch (setting.language)
        {
            case "en":
                this.node.getChildByName("popup").getChildByName("txtMessage").getComponent(cc.Label).string = "Message";
                this.node.getChildByName("content").getComponent(cc.Label).string = "You don't have any messages";
                break;
            case "vn":
                this.node.getChildByName("popup").getChildByName("txtMessage").getComponent(cc.Label).string = "Tin nhắn";
                this.node.getChildByName("content").getComponent(cc.Label).string = "Bạn chưa có thư nào";
                break;
        }
    },
    start () {

    },

    // update (dt) {},

    onClose: function() {
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            var home = cc.find("Canvas/_Home");
            if (home)
            {
                home.getComponent("_Home").onClick();
            }
            this.node.destroy(true);
        }, 0.15);
    }
});

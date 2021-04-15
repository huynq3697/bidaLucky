var functionAll = require("functionAll");

cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        content: cc.Node,
        txtTitle: cc.Label,
        txtVN: {
            type: cc.Sprite,
            default: []
        },
        txtEN: {
            type: cc.Sprite,
            default: []
        },
        soundMp3: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        cc.tween(this.node).to(0.2, {opacity: 255}).start();
    },

    onEnable: function () {
        this.content.children.forEach(element => {
            element.active = false;
        })
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if (setting.language == "en")
        {
            this.txtEN.forEach(element => {
                element.node.active = true;
            });

            this.txtTitle.string = "Rules";
        }
        else
        {
            this.txtVN.forEach(element => {
                element.node.active = true;
            });
            this.txtTitle.string = "Tính cược";
        }

    },

    start () {

    },

    // update (dt) {},

    onClose: function() {
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.destroy(true);    
        }, 0.15);
    },
});

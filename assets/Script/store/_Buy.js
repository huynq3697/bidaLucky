var functionAll = require("functionAll");

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        tablePrefab: cc.Prefab,
        func: functionAll,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    onEnable () {
        this.node.zIndex = cc.macro.MAX_ZINDEX - 100;
        this.btnOn;
        this.effectShowPopup();
        var setting = this.func.getData("setting");
        if (setting)
        {
            this.initListTable(setting.listTable);
        }
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
    },
    onDisable () {
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            var mucCuoc = home.getChildByName("_MucCuoc");
            if (mucCuoc)
            {
                mucCuoc.getComponent("_MucCuoc").activeMoney();
            }
        }
    },
    start () {

    },

    update (dt) {
    },

    initListTable: function(listTable) {
        var language = this.func.getData("setting").language;
        for (var i = 0; i < listTable.length; ++i)
        {
           // var btn = cc.instantiate(this.tablePrefab);
            var activeTable = this.content.children[i].getComponent("activeTable");
            //this.content.addChild(btn);
            if (activeTable)
            {
                language == "en" ?
                listTable[i].content = "Chance to x2, x3 WIN BET" :
                listTable[i].content = "Phần trăm cơ hội x2, x3 cược KHI THẮNG";
                activeTable.activeComponent(this, listTable[i], i + 1);
            }
        }
    },

    onClose () {
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        this.hidePopup();
        this.scheduleOnce(() => {
            var mucCuoc = cc.find("Canvas/_Home/_MucCuoc");
            if (mucCuoc)
            {
                if (mucCuoc.active)
                {
                    cc.tween(mucCuoc).to(0.18, {opacity: 255}).start();
                    mucCuoc.getComponent("_MucCuoc").updateTableImage();
                    mucCuoc.getComponent("_MucCuoc").activeMoney();
                    this.node.active = false;
                }
            }
            else
            {
                this.node.active = false;
            }
            this.node.active = false;
        }, 0.1);
    },
    hidePopup() {
        var table = this.node.getChildByName("table");
        cc.tween(table).to(0.18, {opacity: 0}).start();
    },
    effectShowPopup() {
        var table = this.node.getChildByName("table");
        table.opacity = 0;
        cc.tween(table).to(0.18, {opacity: 255}).start();
    }
});

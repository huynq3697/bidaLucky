var functionAll = require("functionAll");
cc.Class({
    extends: cc.Component,

    properties: {
        btnPrice: cc.Node,
        toggle: cc.Node,
        tick: cc.Node,
        txtPercent: cc.Label,
        text: cc.Label,
        txtMoney: cc.Label,
        table: cc.Sprite,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        },
        func: functionAll
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.url = null;
        this._active = null;
    },
    onEnable () {
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
    },
    start () {

    },

    update (dt) {
        
    },

    activeComponent: function (that, message, count) {
        var _this = this;
        this._active = 
        cc.resources.load("store/bannho", cc.SpriteAtlas, (err, atlas) => {
            if (!err)
            {
                var frame = atlas.getSpriteFrame("ban" + count);
                this.table.spriteFrame = frame;
            }
        });
        this.node.name = "" + message.price;
        this.btnPrice.active = !message.active;
        this.toggle.active = message.active;
        this.tick.active = message.select;
        if (this.btnPrice.active)
        {
            this.txtMoney.string = "$" + that.func.moneyWithFormat(message.price, ".");
            cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                if (!err)
                {
                    var frame = atlas.getSpriteFrame("box_chonban");
                    _this.node.getComponent(cc.Sprite).spriteFrame = frame;
                }
            });
        }
        else
        {
            if (message.select)
            {
                cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                    if (!err)
                    {
                        var frame = atlas.getSpriteFrame("box_chonban2");
                        _this.node.getComponent(cc.Sprite).spriteFrame = frame;
                    }
                });
                cc.find("Canvas/_Buy").getComponent("_Buy").btnOn = _this.node;
            }
            else
            {
                cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                    if (!err)
                    {
                        var frame = atlas.getSpriteFrame("box_chonban");
                        _this.node.getComponent(cc.Sprite).spriteFrame = frame;
                    }
                });
            }
        }
        this.text.string = message.content;
        this.txtPercent.string = message.percent;
    },

    unBlock: function(event) {
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var functionAll = cc.find("Canvas/_Buy/functionAll").getComponent("functionAll");
        var tableGame2 = functionAll.getData("tableGame2");
        var setting = functionAll.getData("setting");
        var price = parseInt(event.target.parent.name);
        
        if (tableGame2.computer3.Money >= price)
        {
            tableGame2.computer3.Money -= price;

            for (var i = 0; i < setting.listTable.length; ++i)
            {
                var element = setting.listTable[i];
                if (element.price == price)
                {
                    element.active = true;
                }
            }
            this.btnPrice.active = false;
            this.toggle.active = true;
        }


        functionAll.setData("tableGame2", tableGame2);
        functionAll.setData("setting", setting);
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            var _home = home.getComponent("_Home");
            _home.updateMoney2();
        }
    },

    selectTable(event) {
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var content = event.target.parent;
        var _this = this;
        var btnOn = cc.find("Canvas/_Buy").getComponent("_Buy").btnOn;
        content.children.forEach(element => {
            if (element.getChildByName("btn_price").active && btnOn)
            {
                btnOn = element;
            }
            element.getComponent("activeTable").tick.active = false;
        });
        event.target.getComponent("activeTable").tick.active = true;
        content.children.forEach(element => {
            if (element.name == event.target.name)
            {
                cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                    if (!err)
                    {
                        var frame = atlas.getSpriteFrame("box_chonban2");
                        element.getComponent(cc.Sprite).spriteFrame = frame;
                    }

                });
                if (_this.btnPrice.active)
                {
                    cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                        if (!err)
                        {
                            var frame = atlas.getSpriteFrame("box_chonban2");
                            btnOn.getComponent(cc.Sprite).spriteFrame = frame;
                        }
                    });
                    this.scheduleOnce(() => {
                        cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                            if (!err)
                            {
                                var frame = atlas.getSpriteFrame("box_chonban");
                                element.getComponent(cc.Sprite).spriteFrame = frame;
                            }
                        });
                    }, 0.1);
                }
            }
            else
            {
                cc.resources.load("store/store", cc.SpriteAtlas, (err, atlas) => {
                    if (!err)
                    {
                        var frame = atlas.getSpriteFrame("box_chonban");
                        element.getComponent(cc.Sprite).spriteFrame = frame;
                    }
                });
            }
        });

        var functionAll = cc.find("Canvas/_Buy/functionAll").getComponent("functionAll");
        var setting = functionAll.getData("setting");
        var length = setting.listTable.length;
        for (var i = 0; i < length; ++i)
        {
            if (setting.listTable[i].price == event.target.name)
            {
                if (this.btnPrice.active)
                {
                    continue;
                }
                else
                    setting.listTable[i].select = true;
            }
            else
            {
                setting.listTable[i].select = false;
            }
        }

        functionAll.setData("setting", setting);
    }
});

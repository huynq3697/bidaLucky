var functionAll = require('functionAll');
var _Home = require("_Home");
var DataManger = require("DataManger");
var TQUtil = require('TQUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        home: _Home,
        func: functionAll,
        changeName: cc.Node,
        changeAvatar: cc.Node,
        realMoney: cc.Label,
        avatar: cc.Sprite,
        textChangeName: cc.EditBox,
        namePlayer: cc.Label,
        khungAvatar: cc.Node,
        txtTotal: cc.Label,
        txtWin: cc.Label,
        txtPercent: cc.Label,
        txtTitle: cc.Label,
        txtChangeName: cc.Label,
        txtChangeAvatar: cc.Label,
        txtConfirm: [cc.Label]
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        DataManger.signalUpdateUserInfo.add(this.onUpdateUserInfo.bind(this));
    },

    onUpdateUserInfo(){
        this.realMoney.string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());
        this.namePlayer.string = DataManger.UserData.getUserName();
    },

    onEnable() {
        this.setting = this.home.func.getData("setting");
        this.tableGame2 = this.home.func.getData("tableGame2");
        var _this = this;
        if (this.tableGame2)
        {
            this.namePlayer.string = DataManger.UserData.getUserName();
            this.realMoney.string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());
            cc.resources.load("banchoi/" + this.tableGame2.computer3.urlAvatar, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    _this.avatar.spriteFrame = spriteFrame;
            });
        }
        if (this.setting.language == "en")
        {
            this.txtTitle.string = "PROFILE";
            this.txtChangeName.string = "Change name";
            this.txtChangeAvatar.string = "Change avatar";
            this.txtConfirm.forEach(element => {
                element.string = "Confirm";
            });
        }
        else if (this.setting.language == "vn")
        {
            this.txtTitle.string = "THÔNG TIN NGƯỜI CHƠI";
            this.txtChangeName.string = "Đổi tên";
            this.txtChangeAvatar.string = "Đổi avatar";
            this.txtConfirm.forEach(element => {
                element.string = "Xác nhận";
            });
        }
        this.setting = this.func.getData("setting");
        var avatar = this.node.getChildByName("container1").getChildByName("avatar").getComponent(cc.Sprite);
        if (this.setting)
        {
            this.setting.avatar = this.tableGame2.computer3.urlAvatar;
            cc.resources.load("banchoi/" + this.tableGame2.computer3.urlAvatar, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                {
                    avatar.spriteFrame = spriteFrame;
                    avatar.node.width = 110;
                    avatar.node.height = 110;
                }
            });
        }
        this.updateChiSo(this.setting.language);
    },
    onDisable() {
        var name = this.node.parent.getChildByName("UI_Button").getChildByName("topContainer").getChildByName("avatar").getChildByName("info").getChildByName("label_name");
        if (name && this.tableGame2)
        {
            name.getComponent(cc.Label).string = DataManger.UserData.getUserName();;
        }
        var avatar = this.node.parent.getChildByName("UI_Button").getChildByName("topContainer").getChildByName("avatar").getChildByName("btn_avatar").getComponent(cc.Sprite);
        if (avatar)
        {
            cc.resources.load("banchoi/" + this.setting.avatar, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                {
                    avatar.spriteFrame = spriteFrame;
                }
            });
        }
        this.node.parent.getComponent("_Home").updateInfo();
    },
    start () {

    },

    // update (dt) {},

    clickBack: function(event) {
        this.node.parent.getComponent("_Home").namePlayer.string = DataManger.UserData.getUserName();;
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 0.15);
    },
    clickChangeName: function(event) {
        if (this.home.sound) {
            cc.audioEngine.play(this.home.soundMp3, false, 1);
        }
        this.changeName.active = true;
    },
    clickChangAvatar: function(event) {
        if (this.home.sound) {
            cc.audioEngine.play(this.home.soundMp3, false, 1);
        }
        this.changeAvatar.active = true;
    },
    confirmChangeName: function() {
        if (this.home.sound) {
            cc.audioEngine.play(this.home.soundMp3, false, 1);
        }
        if (this.textChangeName.string == "")
        {
            this.home.func.setData("tableGame2", this.tableGame2);
            this.changeName.active = false;
            return;
        }
        if (this.tableGame2)
        {
            this.node.getChildByName("container1").getChildByName("txt_name").getComponent(cc.Label).string = this.textChangeName.string;
            var txtName = cc.find("Canvas/_Home/UI_Button/topContainer/avatar/info/label_name");
            if (txtName)
            {
                txtName.getComponent(cc.Label).string = this.textChangeName.string;
            }
            DataManger.UserData.setUserName(this.textChangeName.string);
            this.changeName.active = false;
        }
        this.home.func.setData("tableGame2", this.tableGame2);
    },
    clickAvatar: function (EventTouch) {
        if(this.setting.sound){
            //cc.audioEngine.play(this.soundMp3,false,1);
        }
        this.khungAvatar.position = EventTouch.target.position;
        this.setting.avatar = EventTouch.target.name;
        this.tableGame2.computer3.urlAvatar = EventTouch.target.name;
        this.func.setData("setting", this.setting);
        this.func.setData("tableGame2", this.tableGame2);

    },
    confirmChangeAvatar: function() {
        if (this.home.sound) {
            cc.audioEngine.play(this.home.soundMp3, false, 1);
        }
        var avatar = this.node.getChildByName("container1").getChildByName("avatar").getComponent(cc.Sprite);
        var avatarHome = cc.find("Canvas/_Home/UI_Button/topContainer/avatar/btn_avatar").getComponent(cc.Sprite);
        cc.resources.load("banchoi/" + this.setting.avatar, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err)
            {
                avatar.spriteFrame = spriteFrame;
                avatarHome.spriteFrame = spriteFrame;
                avatarHome.node.width = 62;
                avatarHome.node.height = 62;
            }
        });
        this.func.setData("setting", this.setting);
        this.changeAvatar.active = false;
    },
    updateChiSo: function (lang) {
        var tableGame2 = this.func.getData("tableGame2");
        var total = tableGame2.computer3.total;
        var win = tableGame2.computer3.win;
        var percent = ((win / (total == 0 ? 1 : total)) * 100).toFixed(2) + "%";
        switch (lang)
        {
            case "en":
                this.txtTotal.string = "Total: " + total;
                this.txtWin.string = "Win: " + win;
                this.txtPercent.string = "Percent: " + percent;
                break;
            case "vn":
                this.txtTotal.string = "Tổng: " + total;
                this.txtWin.string = "Thắng: " + win;
                this.txtPercent.string = "Tỉ lệ thắng: " + percent;
                break;
        }
    }
});


var functionAll = require('functionAll');
cc.Class({
    extends: cc.Component,
    ctor(){
        this.setting = null;
        this.load = false;
        this.parent = "home";
    },
    properties: {
        func: functionAll,
        nhacNen: cc.Node,
        amThanh: cc.Node,
        hienThiSoBai: cc.Node,
        doKho : cc.Node,
        ngonNgu : cc.Node,
        spriteAl : cc.SpriteAtlas,
        titleSetting: cc.Label,
        txtHDD : cc.Label,
        txtHN : cc.Label,
        txtHTSBCL : cc.Label,
        txtHTSBCL2 : cc.Label,
        txtNN : cc.Label,
        txtAT : cc.Label,
        txtDK : cc.Label,
        txtDK2 : cc.Label,
        txtNgonNgu : cc.Label,
        khungAvatar : cc.Node,
        khungAvatarBg : cc.Node,
        musicMp3 : {
            default : null,
            type : cc.AudioClip
        },
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        game : cc.Prefab,
        home : cc.Prefab,
        txtPolicy : cc.Label,
        title : cc.Node,
        spriteAtlas : cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.func.createSettingData();
        this.func.createTable2();
        this.setting = this.func.getData("setting");
        if(this.setting.music){
            this.music = cc.audioEngine.play(this.musicMp3,true,0.7);
        }
        var avatar = this.node.getChildByName("popup").getChildByName(this.setting.avatar);
        var bg = this.node.getChildByName("popup").getChildByName(this.setting.backGround);
        this.khungAvatar.position = avatar.position;
        // this.khungAvatarBg.position = bg.position;
        if(this.setting.language != "vn"){
            this.title.getComponent(cc.Label).string = "Setting";       
        }


    },
    onEnable () {
        var _this = this;
        this.setting = this.func.getData("setting");
        if(this.setting.music){
            this.music = cc.audioEngine.play(this.musicMp3,true,0.7);
        }
        var avatar = this.node.getChildByName("popup").getChildByName(this.setting.avatar);
        var bg = this.node.getChildByName("popup").getChildByName(this.setting.backGround);
        if (avatar)
            this.khungAvatar.position = avatar.position;
        if (bg)
            this.khungAvatarBg.position = bg.position;
        if(this.setting.language != "vn"){
            this.title.getComponent(cc.Label).string = "Setting";       
        }
        this.node.zIndex = 1;

        if (this.setting)
        {
            cc.resources.load("banchoi/" + this.setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                {
                    _this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }
        
    },
    onDisable () {
        var home = this.node.parent.getChildByName("_Home");
        if (home)
        {
            home.getComponent("_Home").updateInfo();
        }
        var gameControler = this.node.parent.getChildByName("_GameController");
        if (gameControler)
        {
            gameControler.getComponent("_GameController").updateGame();
        }
    },
    start () {
        //
        if(this.setting.language == "en"){
            this.ngonNgu.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("icon_co_anh");
            this.txtHDD.string = "Avatar";
            this.txtHN.string = "Background";
            this.txtHTSBCL.string = "Display remaining cards";
            this.txtNN.string = "Music";
            this.txtAT.string = "Sound";
            this.txtDK.string = "Difficulty";
            this.txtNgonNgu.string = "Language";
            this.txtPolicy.string = "Policy";
            this.titleSetting.string = "SETTING";
            if(!this.setting.lock){
                this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat");
                this.txtHTSBCL2.string = "Off";
            }else{
                this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat_chon");
                this.txtHTSBCL2.string = "On";
            }
            //
            if(this.setting.level > 0){
                this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000_chon");
                this.txtDK2.string = "Pro";
            }else{
                this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000");
                this.txtDK2.string = "Normal";
            }

        }else{
            if(!this.setting.lock){
                this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat");
                this.txtHTSBCL2.string = "Tắt";
            }else{
                this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat_chon");
                this.txtHTSBCL2.string = "Bật";
            }
            //
            if(this.setting.level > 0){
                this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000_chon");
                this.txtDK2.string = "Khó";
            }else{
                this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000");
                this.txtDK2.string = "Dễ";
            }
        }
        //
        if(!this.setting.music){
            this.nhacNen.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_tatloa");
        }else{
            this.nhacNen.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_batloa_chon");
        }
        //
        if(!this.setting.sound){
            this.amThanh.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_tatloa");
        }else{
            this.amThanh.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_batloa_chon");
        }
    },
    exit(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        setTimeout(()=>{
            // cc.audioEngine.stopAll();
            // if(this.parent == "home"){
            //     var home = cc.instantiate(this.home);
            //     this.node.parent.addChild(home);
            // }else{
            //     var game = cc.instantiate(this.game);
            //     this.node.parent.addChild(game);
            // }
            // this.node.destroy();
            this.node.active = false;
            var home = this.node.parent.getChildByName("_Home");
            if (home)
                home.active = true;
        },100);
    },
    clickPolicy(){
        cc.sys.openURL("http://play.google.com/intl/vi/about/developer-content-policy/index.html#!?modal_active=none");
    },
    clickAmThanh(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
            this.setting.sound = false;
            this.amThanh.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_tatloa");
        }else{
            this.setting.sound = true;
            this.amThanh.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_batloa_chon");
        }
        this.updateSetting();
    }, 
    clickNhacNen(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        if(this.setting.music){
            cc.audioEngine.stop(this.music);
            this.setting.music = false;
            this.nhacNen.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_tatloa");
        }else{
            this.music = cc.audioEngine.play(this.musicMp3,true,0.7);
            this.setting.music = true;
            this.nhacNen.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_batloa_chon");
        }
        this.updateSetting();
    },
    clickHienThiSoBai(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        if(this.setting.lock){
            this.setting.lock = false;
            this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat");
            if(this.setting.language == "vn") {
                this.txtHTSBCL2.string = "Tắt";
            }else{
                this.txtHTSBCL2.string = "Off";
            }
        }else{
            this.setting.lock = true;
            this.hienThiSoBai.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_bat_chon");
            if(this.setting.language == "vn") {
                this.txtHTSBCL2.string = "Bật";
            }else{
                this.txtHTSBCL2.string = "On";
            }
        }
        this.updateSetting();
    },
    clickDokho(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        if(this.setting.level > 0){
            this.setting.level = 0;
            this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000");
            if(this.setting.language == "vn") {
                this.txtDK2.string = "Dễ";
            }else{
                this.txtDK2.string = "Normal";
            }
        }else{
            this.setting.level = 1;
            this.doKho.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("bt_000_chon");
            if(this.setting.language == "vn") {
                this.txtDK2.string = "Khó";
            }else{
                this.txtDK2.string = "Pro";
            }
        }
        this.updateSetting();
    },
    clickNgonNgu(){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        if(this.setting.language == "vn"){
            this.setting.language = "en";
            this.txtHDD.string = "Avatar";
            this.txtHN.string = "Background";
            this.txtHTSBCL.string = "Display remaining cards";
            this.txtNN.string = "Music";
            this.txtAT.string = "Sound";
            this.txtDK.string = "Difficulty";
            this.txtNgonNgu.string = "Language";
            this.txtPolicy.string = "Policy";
            this.titleSetting.string = "SETTING";
            if(this.setting.level > 0){
                this.txtDK2.string = "Pro";
            }else{
                this.txtDK2.string = "Normal";
            }
            if(this.setting.lock){
                this.txtHTSBCL2.string = "On";
            }else{
                this.txtHTSBCL2.string = "Off";
            }
            this.ngonNgu.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("icon_co_anh");
            this.title.getComponent(cc.Label).string = "Setting";
        }else{
            this.setting.language = "vn";
            this.txtHDD.string = "Hình đại diện";
            this.txtHN.string = "Hình nền";
            this.txtHTSBCL.string = "Hiển thị số bài còn lại";
            this.txtNN.string = "Nhạc nền";
            this.txtAT.string = "Âm thanh";
            this.txtDK.string = "Độ khó";
            this.txtNgonNgu.string = "Ngôn ngữ";
            this.txtPolicy.string = "Chính sách";
            this.titleSetting.string = "CÀI ĐẶT";
            if(this.setting.level > 0){
                this.txtDK2.string = "Khó";
            }else{
                this.txtDK2.string = "Dễ";
            }
            if(this.setting.lock){
                this.txtHTSBCL2.string = "Bật";
            }else{
                this.txtHTSBCL2.string = "Tắt";
            }
            this.ngonNgu.getComponent(cc.Sprite).spriteFrame = this.spriteAl.getSpriteFrame("icon_co_VN");
            this.title.getComponent(cc.Label).spriteFrame = "Tùy Chọn";
        }
        this.updateSetting();
    },
    clickAvatar(EventTouch){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        this.khungAvatar.position = EventTouch.target.position;
        this.setting.avatar = EventTouch.target.name;

        this.updateSetting();
    },
    clickBackGround(EventTouch){
        if(this.setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        this.khungAvatarBg.position = EventTouch.target.position;
        this.setting.backGround = EventTouch.target.name;
        var gameController = this.node.parent.getChildByName("_GameController");
        if (gameController)
        {
            cc.resources.load("banchoi/" + this.setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    gameController.getChildByName("bt").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        var home = this.node.parent.getChildByName("_Home");
        if (home)
        {
            cc.resources.load("banchoi/" + this.setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    home.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }
        this.updateSetting();
    },
    updateSetting(){
        var tableGame2 = this.func.getData("tableGame2");
        if (tableGame2)
        {
            tableGame2.computer3.urlAvatar = this.setting.avatar;
            this.func.setData("tableGame2", tableGame2);
        }
        this.func.updateSetting(this.setting);
    }
    
    // update (dt) {},
});

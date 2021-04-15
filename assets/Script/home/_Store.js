// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var functionAll = require('functionAll');
cc.Class({
    extends: cc.Component,
    ctor(){
        this.sound = true;
        this.tableGame = null;
        this.lstCoins = [
            {coins : 2000000 , menhgia: "10.000đ"},
            {coins : 4000000 , menhgia: "20.000đ"},
            {coins : 10000000 , menhgia: "50.000đ"},
            {coins : 20000000 , menhgia: "100.000đ"},
            {coins : 200000000 , menhgia: "1.000.000đ"}
        ];
    },
    properties: {
        func: functionAll,
        content : cc.Node,
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        title : cc.Node,
        spriteAtlas : cc.SpriteAtlas,
        txtCoins : cc.Label

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var tableGame2 = this.func.getData("tableGame2");
        this.tableGame2 = tableGame2;
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if(setting.language != "vn"){
            this.title.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame("tt_shopEN");       
        }
        this.updateMoney();
        var index = 0;
        this.content.children.forEach(item => {
            item.children[0].getChildByName("price").getComponent(cc.Label).string = this.lstCoins[index].menhgia; 
            item.getChildByName("txtMenhGia").getComponent(cc.Label).string = "$" + this.func.moneyWithFormat(parseInt(this.lstCoins[index].coins), ".");
            index++;
        });
        this.initIAP();
    },
    updateMoney(){
        var money = this.tableGame2.computer3.Money;
        if(money > 999){
            this.txtCoins.string = "$" + this.func.moneyWithFormat(parseInt(money), ".");
        }else{
            this.txtCoins.string = money;
        }
    },
    onEnable () {
        var setting = this.func.getData("setting");
        var _this = this;
        if (setting)
        {
            cc.resources.load("banchoi/" + setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    _this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    },
    start () {

    },
    exit(){
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var home = this.node.parent.getChildByName('_Home');
        home.active = true;
        home.getComponent("_Home").isPopUp = false;
        home.getComponent("_Home").updateMoney(this.tableGame2.computer3.Money);
        this.node.destroy();
    },
    clickMua(node){
        
        if (cc.sys.isMobile) {
            if (sdkbox.IAP) {
                // sdkbox.IAP.purchase("iap1");
                switch(node.target.name){
                    case "bt_001" : 
                        this.iap(1); 
                    break;
                    case "bt_002" : 
                        this.iap(2); 
                    break;
                    case "bt_003" : 
                    this.iap(3); 
                    break;
                    case "bt_004" : 
                    this.iap(4); 
                    break;
                    case "bt_005" : 
                    this.iap(5); 
                    break;
                }

            }
        }
    },
    congTien(index){
        this.tableGame2.computer3.Money += this.lstCoins[index].coins;
        this.func.setData("tableGame2",this.tableGame2);
        this.updateMoney();
    },
    initIAP() {
        var self = this;
        if (cc.sys.isMobile) {
            sdkbox.IAP.init();
            sdkbox.IAP.setDebug(true);
            sdkbox.IAP.setListener({
                onSuccess: function (product) {
                    //Purchase success
                    self.iapListener(product.name);
                },
                onFailure: function (product, msg) {
                    //Purchase failed
                    //msg is the error message
                },
                onCanceled: function (product) {
                    //Purchase was canceled by user
                },
                onRestored: function (product) {
                    //Purchase restored
                    self.iapListener(product.name);
                },
                onRestoreComplete(ok, msg) {

                },
                onProductRequestSuccess: function (products) {
                    //Returns you the data for all the iap products
                    //You can get each item using following method
                    for (var i = 0; i < products.length; i++) {
                        // loop
                    }
                },
                onProductRequestFailure: function (msg) {
                    //When product refresh request fails.
                }
            });
        }
    },
    iap(id) {
        if (cc.sys.isMobile) {
            if (sdkbox.IAP) {
                sdkbox.IAP.purchase("iap"+id);
            }
        }


    },
   
    // update (dt) {},
});

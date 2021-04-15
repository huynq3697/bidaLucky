var functionAll = require('functionAll'); // lưu dữ liệu
var LogicComputer = require("LogicComputer");
var _Effect = require("_Effect");
var XoeBai = require("XoeBai");

import {Constant} from "./../lib/Constant2";
import {
    singlePatternMoney
} from "./../lib/singlePatternMoney";
cc.Class({
    extends: cc.Component,
    ctor(){
        this.timer = 1000;
        this.playerName ="";
        this.urlAvatar =  "avatar_banchoi_04";
        this.Money = 0;
        this.Point = 0,
        this.listCard =  [];
        this.isBoLuot = false;
        this.isWin = false;
        this.isTurn = false;
        this.isRank = 0;
        this.lstDanh = [];
        this.suggest = false;
        this.winRank = 0;
        this.arrTransCard = {
            y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    properties: {       
        logic: LogicComputer,
        func:functionAll,
        KhungDanh : cc.Node,
        avatar : cc.Node,
        txtName : cc.Label,
        txtMoney : cc.Label,
        Card :cc.Prefab,
        Card001 :cc.Prefab,
        cardSprite: cc.SpriteAtlas,
        btDanh: cc.Node,
        btBoLuot: cc.Node,
        baiUp : cc.Node,
        table: cc.Node,
        iconBoLuot: cc.Node,
        iconCoHang :cc.Prefab,
        bgAvatarBanChoi: cc.Node,
        effect: _Effect,
        xoeBai: XoeBai,
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        amThanh: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.onLoadGame();
    },
    onLoadGame(){
        this.func.getByName(this,"computer3", null);
        this.node.active = false;
        this.KhungDanh.active = false;
        this.iconBoLuot.active = false;
        this.butonEnable();
        cc.loader.loadRes("banchoi/" + this.urlAvatar ,cc.SpriteFrame,(err,spriteFrame)=>{
            this.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    onEnable () {
        // this.node.getChildByName("bg_avatar_banchoi").zIndex = 255;
        this.tableGame2 = this.func.getData("tableGame2");
        this.iconBoLuot.zIndex = 10;
        this.txtMoney.string = this.func.moneyWithFormat(this.func.getMoney(), ".");
    },
    onDisable () {
        this.node.children.forEach(element => {
            if (element.name == "card")
            {
                element.destroy();
            }
        });
    },
    start () {
    },
    butonEnable(){
        this.isTurn = false;
        this.effect.showButton(this.btDanh, false, 1);
        this.effect.showButton(this.btBoLuot, false, 2);
        this.KhungDanh.active = false;
        var lstCard = this.node.children.filter(x=>x.name.indexOf("card") > -1);
        lstCard.forEach(card=>{
            card.getChildByName("white_card").active = true;    
        });
    },
    resetPlayer(){
        this.KhungDanh.active = false;
        this.iconBoLuot.active = false;
        //
        this.listCard =  [];
        this.isBoLuot = false;
        this.isWin = false;
        this.isTurn = false;
        this.isRank = 0;
        this.lstDanh = [];
        this.suggest = false;
    },
    Active(that){
        if (this.tableGame2)
        {
            this.Money = this.func.getMoney();
        }
        this.node.active = true;
        this.timer = that.timer;
        // this.node.y -= 200;
        this.reloadCard(that.sound);
        this.node.runAction(cc.moveTo(5*(this.timer/10000),0,0));
        if(this.isBoLuot){
            this.iconBoLuot.active = true;
        }
        this.txtMoney.string =  (this.func.getMoney() > 999 ? this.func.moneyWithFormat(parseInt(this.func.getMoney()), ".") : this.func.getMoney());
    },
    DanhBai(that){
        //that.btRefresh.active = true;
        var setting = that.func.getData("setting");
        this.sound = setting.sound;
        that.turn = 3;
        this.isTurn = true;
        this.suggest = false;
        this.chekcDanhBai(that.lastCard,that.firstTurn);
        this.butonGame();
    },
    chekcDanhBai(lastCard,firstTurn){
        var lstSuggest = this.logic.checkDanhBai(this.listCard,lastCard,firstTurn);
        var lstCard = this.node.children.filter(x=>x.name.indexOf("card") > -1);
        lstCard.forEach(card=>{
            var value =  card.getChildByName("cardAction").getComponent("cardAction").value;
            if(lstSuggest.indexOf(value) > -1){        
                card.getChildByName("white_card").active = false;
            }     
        });
    },
    reloadCard(isSound){
        var findDoiThong = this.logic.findDoiThong(this.listCard);
        var findTuQuy = this.logic.findTuQuy(this.listCard);
        var listCard = this.converToName(this.listCard);
        var index = 0;
        var number = parseInt((13 / listCard.length - 1) * 60) + 60;
        if(number > 100) number = 100;
        while(index < listCard.length){
            var card = cc.instantiate(this.Card);
            var component = card.getChildByName("cardAction").getComponent("cardAction");
            component.value = this.listCard[index];
            component.sound = isSound;
            card.getComponent(cc.Sprite).spriteFrame = this.cardSprite.getSpriteFrame(listCard[index]); 
            this.node.addChild(card);
            card.position = new cc.Vec2(index * 65 - 400, this.arrTransCard.y[index] - 220);
            card.angle = this.arrTransCard.rotation[index];
            index++;
        }
        // if(findDoiThong.length > 0 || findTuQuy.length > 0){
        //     // bài có hàng
        //     var  icon = cc.instantiate(this.iconCoHang);
        //     icon.position = new cc.Vec2(index * 65 - 400, this.arrTransCard.y[index] - 220);
        //     this.node.addChild(icon);
        // }

    },
    converToName(list){
        var listCard = [];
        var index = 0;
        while(index < list.length){
            var name = parseInt(list[index] / 4);         
            if(name === 14) name = 1;
            else if(name === 15) name = 2;

            switch(list[index] % 4){
                case 0: name += "b" ; break;
                case 1: name += "t" ; break;
                case 2: name += "r" ; break;
                case 3: name += "c" ; break;
            }
         
            listCard.push(name);
            index++;
        }
        return listCard;
    },
    SapXep(listCard){
        var i = 0;
        while(i < listCard.length){
            var j =  i + 1;
            while( j < listCard.length){
                if(listCard[i] > listCard[j]){
                    var value = listCard[i];
                    listCard[i] = listCard[j];
                    listCard[j] = value;
                }
                j++;
            }
            i++;
        }
        return listCard;
    },
    suggestActive(lstSuggest){
        var list = this.node.children.filter(x=>x.name.indexOf('card') > -1);
        list.forEach(item=>{
            var cardAction = item.getChildByName("cardAction").getComponent("cardAction");
            if(lstSuggest.indexOf(cardAction.value) > -1 && cardAction.value != this.lstDanh[0]){
                item.y = -180;
                cardAction.action = !cardAction.action;
            }
        });
        this.lstDanh = this.SapXep(lstSuggest); // sắp xếp lại lại trước khi đánh
        this.showArrow();
        this.btDanh.opacity = 255;
    },
    butonGame(){
        var gamecontroller = this.node.parent.getComponent("_GameController");
        // this.KhungDanh.active = true;
        this.effect.showButton(this.btDanh, true, 1);
        var lastCard = gamecontroller.lastCard;
        if(lastCard && lastCard.length > 0){
            this.effect.showButton(this.btBoLuot, true, 2);
        }
        var is3Bich = false;


        if(this.lstDanh.length === 1 && !this.suggest && gamecontroller.firstTurn != null){
            this.suggest = true;
            // gợi ý đánh nếu ng chơi nhấc 1 lá bài lên
            var lstSuggest = this.logic.suggest(this.listCard,gamecontroller.lastCard,this.lstDanh[0]);
            if(lstSuggest.length > 0){
                this.suggestActive(lstSuggest);
                return;
            }
        }
        if(this.lstDanh.length === 1 && !this.suggest && this.lstDanh[0] == 12 && gamecontroller.firstTurn == null){
            this.suggest = true;
            var lstSuggest = this.logic.firstTurn(this.listCard,12);
            if(lstSuggest.length > 0){
                this.suggestActive(lstSuggest);
                return;
            }
        }
        if(gamecontroller.firstTurn == null && this.listCard.indexOf(12) < 0){
            gamecontroller.firstTurn = 3;
        }
        this.lstDanh = this.SapXep(this.lstDanh); // sắp xếp lại lại trước khi đánh
        if(gamecontroller.firstTurn == null && this.listCard.indexOf(12) > -1){
            is3Bich = true;
        }
        if(this.logic.CheckDanhBaiPlayer(lastCard,this.lstDanh,is3Bich)){
            this.showArrow();
            this.btDanh.opacity = 255;
        }else{
            this.showArrow();
            this.btDanh.opacity = 155;
        }

    },
    KetThucVanBai(that, rank, money){
        if (rank == 1)
        {
            this.func.isWin(true);
        }
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if(this.sound){
            cc.audioEngine.play(that.amThanh.win, false, 1);
        }
        if(!rank) rank = that.winRank;
        this.isRank = rank;
        this.isWin = true;
        this.node.active = false;
        this.Money += money;
        if(this.Money < 0) this.Money = 0;
        this.iconBoLuot.active = false;
        that.btTuaNhanh.active = true;
        if(that.coinsMode == Constant.GameMode.ScoreMode && money){
            var point = 4 - rank;
            if(rank == 5) point = 0;
            this.Point += point;
        }
        that.computer3.listCard = this.listCard;
        that.computer3.node.active = true;
        that.computer3.KetThucVanBai(that, rank, money);
    },
    hienThiCongTien(that,money){
        if (that.coinsMode) {
            this.Money += money;
            this.func.setMoney(this.func.getMoney() + money);
            that.computer3.Money += money;
            if(this.Money < 0){
                this.Money = 0;
                that.computer3.Money = 0;
            }
            if(this.func.getMoney() > 999){
                this.txtMoney.string =  (this.func.getMoney() > 999 ? this.func.moneyWithFormat(parseInt(this.func.getMoney()), ".") : this.func.getMoney());
                that.computer3.txtMoney.string =  (this.func.getMoney() > 999 ? this.func.moneyWithFormat(parseInt(this.func.getMoney()), ".") : this.func.getMoney());
            }else{
                this.txtMoney.string = this.func.moneyWithFormat(this.func.getMoney(), ".");
                that.computer3.txtMoney.string = this.txtMoney.string;
            }
            this.handleAnimationMoney(this.node, money, "congtrutien");
        }
    },
    handleAnimationMoney: function (node, money, type) {
        // debugger
        const nodeMoney = node.getChildByName("Money+-");
        nodeMoney.active = true;
        nodeMoney.zIndex = cc.macro.MAX_ZINDEX;
        nodeMoney.getChildByName("MoneyTxt").getComponent(cc.Label).string =  (money > 0) ? ((money > 999 ? "+" + this.func.moneyWithFormat(money, ".") : "+" + money)) : ((money > 999 ? this.func.moneyWithFormat(money, ".") : money));
        const ani = nodeMoney.getComponent(cc.Animation);
        ani.play(type);

    },
    clickDanhBai(that){
        var lstCardAll = this.node.children.filter(x=>x.name.indexOf('card') > -1 || x.name.indexOf('iconCoHang') > -1); 
        lstCardAll.forEach(item=>{
            item.destroy();
        })
        var lstLocal = this.listCard;
        var lstDanh = this.lstDanh; // danh sách các lá bài dc chọn để đánh
        var lstCard = this.logic.lstCardFind(lstDanh,lstLocal); // danh sách lá bài còn lại
        this.ReMoveCard(lstDanh,lstCard,that.lastCard); // người chơi đánh bài ra ngoài  (3)
        this.reloadCard(that.sound); // load lại bài trên tay
        if(lstCard.length == 0){
            cc.log("**Người chơi hết bài**");
            this.isWin = true;
        }
        this.lstDanh = [];
        that.setTableCard(lstDanh,this);
    },
    ReMoveCard(lstDanh,lstCard,lastCard){
        this.listCard = lstCard;
        var vec = this.baiUp.position;
        // lấy tạo độ của thằng bài up để làm vị trí xuất hiện của các quân bài sắp đánh
        var listCard = this.converToName(lstDanh);
        lastCard = this.converToName(lastCard);
        this.table.children.forEach((item)=>{
            if(lastCard.indexOf(item.getComponent(cc.Sprite).spriteFrame.name) > -1){
                if (this.func.left)
                {
                    item.runAction(cc.moveTo(2*(this.timer/10000),item.x - 40,item.y + 40));
                    item.getChildByName("white_card").active = true;
                }
                else
                {
                    item.runAction(cc.moveTo(2*(this.timer/10000),item.x + 40,item.y + 40));
                    item.getChildByName("white_card").active = true;
                }
            }else{
                item.destroy();
            }
        });

        this.func.left = !this.func.left;
        // Thêm các lá bài vào table (chỉ chứa)

        var index = 0;
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        while(index < listCard.length){
            var  card = cc.instantiate(this.Card001); 
            card.width = 90;
            card.height = 130; 
            card.angle = this.Random(0,11) - 5; // độ lệch    
            card.getComponent(cc.Sprite).spriteFrame = this.cardSprite.getSpriteFrame(listCard[index]); 
            this.table.addChild(card);
            card.position = vec; // tạo độ hiển thị ban đầu
            card.runAction(cc.moveTo(2*(this.timer/10000),index * 50 - parseInt(listCard.length/2) * 50,0)); // tọa độ xuất hiện trên bàn
            card.runAction(cc.rotateBy(2*(this.timer/10000),360));
            index++;
        }
        this.butonEnable();
    },
    checkCardPlayer(value){
        var index = this.lstDanh.indexOf(value);
        if(index < 0){
            this.lstDanh.push(value);
        }else{
            this.lstDanh.splice(index,1);
        }
        if(this.isTurn){
            // đang lượt đánh của người chơi
            this.butonGame();
        }
    },
    Random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    update (dt) {

    },
    showArrow() {
        var offAll = true;
        for (var i = 0; i < this.node.childrenCount; ++i)
        {
            var element = this.node.children[i];
            if (element.name == "card")
            {
                if (!element.getChildByName("white_card").active)
                {
                    offAll = false;
                }
            }
        }
        if (offAll)
        {
            this.scheduleOnce(() => {
                this.btBoLuot.getChildByName("arrow").active = true;
            }, 0.2);
        }
        else
        {
            this.btBoLuot.getChildByName("arrow").active = false;
        }
    }
});

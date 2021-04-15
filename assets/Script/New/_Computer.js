var LogicComputer = require("LogicComputer");
var functionAll = require('functionAll'); // lưu dữ liệu
var IconRank = require('IconRank');
var XoeBai = require("XoeBai");
import {
    Constant
} from "../lib/Constant2";

cc.Class({
    extends: cc.Component,
    ctor(){
        this.indexName = null;
        this.timer = 1000;
        this.playerName ="";
        this.urlAvatar =  "avatar_banchoi_01";
        this.Money = 0;
        this.Point = 0,
        this.listCard =  [];
        this.isBoLuot = false;
        this.isWin = false;
        this.isTurn = false;
        this.isRank = 0;
    },
    properties: {
        logic: LogicComputer,
        func: functionAll,
        iconRank: IconRank,
        KhungDanh : cc.Node,
        avatar : cc.Node,
        txtName : cc.Label,
        txtMoney : cc.Label,
        baiUp : cc.Node,
        txtCountCard : cc.RichText,
        table: cc.Node,
        Card :cc.Prefab,
        cardSprite: cc.SpriteAtlas,
        iconBoLuot: cc.Node,
        xoeBai: XoeBai,
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                {
                    switch(this.node.name)
                    {
                        case "_Computer1" : this.indexName = 0; break;
                        case "_Computer3" : this.indexName = 1; break;
                    }
                }
                break;
            case Constant.PLAYER._3:
                {
                    switch(this.node.name)
                    {
                        case "_Computer0" : this.indexName = 0; break;
                        case "_Computer1" : this.indexName = 1; break;
                        case "_Computer3" : this.indexName = 3; break;
                    }
                }
                break;
            case Constant.PLAYER._4:
                {
                    switch(this.node.name)
                    {
                        case "_Computer0" : this.indexName = 0; break;
                        case "_Computer1" : this.indexName = 1; break;
                        case "_Computer2" : this.indexName = 2; break;
                        case "_Computer3" : this.indexName = 3; break;
                    }
                }
                break;
        }
        this.func.getByName(this,"computer" + this.indexName, null);
        this.KhungDanh.active = false;
        this.iconRank.node.active = false;
        this.iconBoLuot.active = false;
        this.baiUp.active = false;
        this.iconRank.EnableIcon();

        this.tableGame2 = this.func.getData("tableGame2");
        this.txtMoney.string =  (this.func.getMoney() > 999 ? this.func.moneyWithFormat(this.func.getMoney(), ".") : this.func.getMoney());
        this.txtName.string = this.tableGame2.computer3.playerName == "" ? "Tôi" : this.tableGame2.computer3.playerName;
        cc.loader.loadRes("banchoi/" + this.urlAvatar ,cc.SpriteFrame,(err,spriteFrame)=>{
            this.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    onEnable () {
        if (this.node.name == "_Computer3")
        {
            this.node.zIndex = 10;
        }
        this.node.getChildByName("bg_avatar_banchoi").active = true;
        this.txtMoney.string = this.func.moneyWithFormat(this.func.getMoney(), ".");
    },
    onDisable () {
        this.node.getChildByName("bg_avatar_banchoi").active = false;
    },
    start () {
        if (this.node.name == "_Computer3")
        {
            this.Money = this.func.getMoney();
        }
    },
    resetComputer(){
        this.iconRank.EnableIcon();
        this.KhungDanh.active = false;
        this.baiUp.active = false;
        this.iconBoLuot.active = false;
        
        this.listCard =  [];
        this.isBoLuot = false;
        this.isWin = false;
        this.isTurn = false;
        this.isRank = 0;
        var lstCard  = this.node.children.filter(x=>x.name.indexOf('card') > -1);
        lstCard.forEach(item=>{
            item.destroy();
        });
    },
    KetThucVanBai(that, rank, money,spriteFrame){
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if(!rank) rank = that.winRank;
        this.isWin = true;
        this.isRank = rank;
        this.node.active = true;
        this.baiUp.active = false;
        this.iconRank.node.active = true;
        this.iconBoLuot.active = false;
        var name;
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                if(rank == 1){
                    name = spriteFrame ? spriteFrame : "nhat";
                    name = that.language == "vn" ? name : name +"EN";
                    this.iconRank.iconNhat.active = true; 
                    this.iconRank.vongSang1.active = true; 
                }else if(rank == 2){
                    name = that.language == "vn" ? "bet" : "betEN";
                    this.iconRank.iconBet.active = true;
                }else{
                    name = that.language == "vn" ? "tt_cong" : "tt_congEN";
                    this.iconRank.iconBet.active = true;
                }
                break;
            case Constant.PLAYER._3:
                if (that.gameMode == Constant.GameMode.CoinMode)
                {
                    if(rank == 1){
                        name = spriteFrame ? spriteFrame : "nhat";
                        name = that.language == "vn" ? name : name +"EN";
                        this.iconRank.iconNhat.active = true; 
                        this.iconRank.vongSang1.active = true; 
                    }else if(rank == 2){
                        name = that.language == "vn" ? "nhi" : "nhiEN";
                        this.iconRank.iconNhi.active = true; 
                        this.iconRank.vongSang2.active = true;
                    }else if(rank == 3){
                        name = that.language == "vn" ? "bet" : "betEN";
                        this.iconRank.iconBet.active = true;
                    }else{
                        name = that.language == "vn" ? "tt_cong" : "tt_congEN";
                        this.iconRank.iconBet.active = true;
                    }
                }
                else if (that.gameMode == Constant.GameMode.NhatAnTatMode || that.gameMode == Constant.GameMode.DemLaMode)
                {
                    if(rank == 1){
                        name = spriteFrame ? spriteFrame : "nhat";
                        name = that.language == "vn" ? name : name +"EN";
                        this.iconRank.iconNhat.active = true; 
                        this.iconRank.vongSang1.active = true; 
                    }else if(rank == 2){
                        name = that.language == "vn" ? "bet" : "betEN";
                        this.iconRank.iconBet.active = true;
                    }else{
                        name = that.language == "vn" ? "tt_cong" : "tt_congEN";
                        this.iconRank.iconBet.active = true;
                    }
                }
                break;
            case Constant.PLAYER._4:
                if (that.gameMode == Constant.GameMode.CoinMode)
                {
                    if(rank == 1){
                        name = spriteFrame ? spriteFrame : "nhat";
                        name = that.language == "vn" ? name : name +"EN";
                        this.iconRank.iconNhat.active = true; 
                        this.iconRank.vongSang1.active = true; 
                    }else if(rank == 2){
                        name = that.language == "vn" ? "nhi" : "nhiEN";
                        this.iconRank.iconNhi.active = true; 
                        this.iconRank.vongSang2.active = true;
                    }else if(rank == 3){
                        name = that.language == "vn" ? "ba" : "baEN";
                        this.iconRank.iconBa.active = true;
                    }else if (rank == 4){
                        name = that.language == "vn" ? "bet" : "betEN";
                        this.iconRank.iconBet.active = true;
                    }else{
                        name = that.language == "vn" ? "tt_cong" : "tt_congEN";
                        this.iconRank.iconBet.active = true;
                    }
                }
                else if (that.gameMode == Constant.GameMode.NhatAnTatMode || that.gameMode == Constant.GameMode.DemLaMode)
                {
                    if(rank == 1){
                        name = spriteFrame ? spriteFrame : "nhat";
                        name = that.language == "vn" ? name : name +"EN";
                        this.iconRank.iconNhat.active = true; 
                        this.iconRank.vongSang1.active = true; 
                    }else if(rank == 2){
                        name = that.language == "vn" ? "bet" : "betEN";
                        this.iconRank.iconBet.active = true;
                    }else{
                        name = that.language == "vn" ? "tt_cong" : "tt_congEN";
                        this.iconRank.iconBet.active = true;
                    }
                }
                break;
        }
        
        this.iconRank.iconTitle.getComponent(cc.Sprite).spriteFrame = that.spriteAtlasTT.getSpriteFrame(name); 
        this.iconRank.iconTitle.active = true;
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                if(rank == 1){
                    that.firstTurn = this.indexName;
                    // lưu lại để biết ai là người được đánh đầu tiên của ván sau
                    if(this.indexName == 3 && money){
                        this.func.setReport("thang");
                        this.openLstCard();
                    }
                }else if(rank == 2 || rank == 3){
                    this.openLstCard();
                    if(this.indexName == 1 && money){
                        this.func.setReport("thua");
                        this.openLstCard();
                    }
                }
                break;
            case Constant.PLAYER._3:
                if (that.gameMode == Constant.GameMode.CoinMode)
                {
                    if(rank == 1){
                        that.firstTurn = this.indexName;
                        // lưu lại để biết ai là người được đánh đầu tiên của ván sau
                        if(this.indexName == 3 && money){
                            this.func.setReport("thang");
                            this.openLstCard();
                        }
                    }else if(rank == 3 || rank == 4){
                        this.openLstCard();
                        if(this.indexName == 2 && money){
                            this.func.setReport("thua");
                            this.openLstCard();
                        }
                    }
                }
                else if (that.gameMode == Constant.GameMode.NhatAnTatMode || that.gameMode == Constant.GameMode.DemLaMode)
                {
                    if(rank == 1){
                        that.firstTurn = this.indexName;
                        // lưu lại để biết ai là người được đánh đầu tiên của ván sau
                        if(this.indexName == 3 && money){
                            this.func.setReport("thang");
                            this.openLstCard();
                        }
                    }else if(rank == 2 || rank == 3){
                        this.openLstCard();
                        if(this.indexName == 2 && money){
                            this.func.setReport("thua");
                            this.openLstCard();
                        }
                    }
                }
                break;
            case Constant.PLAYER._4:
                if (that.gameMode == Constant.GameMode.CoinMode)
                {
                    if(rank == 1){
                        that.firstTurn = this.indexName;
                        // lưu lại để biết ai là người được đánh đầu tiên của ván sau
                        if(this.indexName == 3 && money){
                            this.func.setReport("thang");
                            this.openLstCard();
                        }
                    }else if(rank == 4 || rank == 5){
                        this.openLstCard();
                        if(this.indexName == 3 && money){
                            this.func.setReport("thua");
                            this.openLstCard();
                        }
                    }
                }
                else if (that.gameMode == Constant.GameMode.NhatAnTatMode || that.gameMode == Constant.GameMode.DemLaMode)
                {
                    if(rank == 1){
                        that.firstTurn = this.indexName;
                        // lưu lại để biết ai là người được đánh đầu tiên của ván sau
                        if(this.indexName == 3 && money){
                            this.func.setReport("thang");
                            this.openLstCard();
                        }
                    }else if(rank == 2 || rank == 3)
                    {
                        this.openLstCard();
                        if(this.indexName == 3 && money){
                            this.func.setReport("thua");
                            this.openLstCard();
                        }
                    }
                }
                break;
        }
        
        if(money){
            switch (Constant.CurrentGameMode)
            {
                case Constant.PLAYER._2:
                    break;
                case Constant.PLAYER._3:
                    break;
                case Constant.PLAYER._4:
                    break;
            }
            this.hienThiCongTien(that,money);
            if(rank < 4 && that.sound && this.indexName == 3)
                cc.audioEngine.play(that.amThanh.win,false,(10 - 2*rank) /10);
            else if(that.sound && this.indexName == 3)
                cc.audioEngine.play(that.amThanh.lose,false,0.8);
        }
        if(that.coinsMode == "ScoreMode" && money){
            if(rank > 3) rank = 4;
            var point = 4 - rank;
            this.Point += point;
            var node = new cc.Node("txtCongDiem");
            node.addComponent(cc.Label);
            node.position = new cc.Vec2(this.avatar.x, this.avatar.y)
            var hienThi = "+" + point;
            node.getComponent(cc.Label).string = hienThi;
            node.runAction(cc.moveTo(that.timer/1000,this.avatar.x + 40, this.avatar.y + 60));
            this.avatar.addChild(node);
            setTimeout(()=>{
                node.destroy();
            },that.timer * 1.5);
        }
        if(this.indexName == 3 && money){
            if(this.Money <= 0 && that.coinsMode){
                that.exitGameWhenOutOfMoney(); /// nguoi choi het tien roi cho ve home
            }
        }

    },
    hienThiCongTien(that,money){
        if(that.coinsMode){
            this.Money += money;
            // this.func.setMoney(this.func.getMoney() + money);
            if (this.node.name != "_Computer3")
            {
                this.txtMoney.string =  (this.Money > 999 ? this.func.moneyWithFormat(this.Money, ".") : this.Money);
            }
            else
            {
                this.func.setMoney(this.func.getMoney() + money);
                this.txtMoney.string = (this.func.getMoney() > 999 ? this.func.moneyWithFormat(parseInt(this.func.getMoney()), ".") : 0);
                this.func.setMoney(this.func.getMoney() > 999 ? parseInt(this.func.getMoney()) : 0);

            }
            switch(this.node.name) {
                case "_Computer0": {
                    this.handleAnimationMoney(this.node, money, "congtrutien0");
                    break;
                }
                case "_Computer1": {
                    this.handleAnimationMoney(this.node, money, "congtrutien1");
                    break;
                }
                case "_Computer2": {
                    this.handleAnimationMoney(this.node, money, "congtrutien2");
                    break;
                }
                case "_Computer3": {
                    this.handleAnimationMoney(this.node, money, "congtrutien");
                    break;
                }
            }
            // var node = new cc.Node("txtCongTien");
            // // node.scale = 1.5;
            // node.addComponent(cc.Label);
            // node.position = new cc.Vec2(this.avatar.x + 100, this.avatar.y + 100)
            // var hienThi = money;
            // that.Money += money;
            // if(money > 0){
            //     hienThi = "+" + money;
            // }
            // node.getComponent(cc.Label).string = hienThi;
            
            // node.runAction(cc.moveTo(that.timer/1000,this.avatar.x + 100, this.avatar.y).easing(cc.easeSineOut()));
            // this.avatar.addChild(node);
            // setTimeout(()=>{
            //     node.destroy();
            // },that.timer * 1.5);
        }
    },

    handleAnimationMoney: function (node, money, type) {
        // debugger
        const nodeMoney = node.getChildByName("Money+-");
        nodeMoney.active = true;
        nodeMoney.getChildByName("MoneyTxt").getComponent(cc.Label).string =  (money > 0) ? ((money > 999 ? "+" + this.func.moneyWithFormat(money, ".") : "+" + money)) : ((money < -999 ? this.func.moneyWithFormat(money, ".") : money));
        const ani = nodeMoney.getComponent(cc.Animation);
        ani.play(type);

    },

    openLstCard(){
        // bét ngửa bài
        var listCard = this.converToName(this.listCard);
        var index = 0;
        while(index < listCard.length){
            var  card = cc.instantiate(this.Card);
            card.width = 85;
            card.height = 115;
            card.zIndex = -1;
            card.getComponent(cc.Sprite).spriteFrame = this.cardSprite.getSpriteFrame(listCard[index]); 
            this.node.addChild(card);
            card.scale = 0.9;
            switch (Constant.CurrentPlayer)
            {
                case Constant.PLAYER._2:
                    this.openLstCard2Nguoi(card, listCard, index);
                    break;
                case Constant.PLAYER._3:
                    this.openLstCard3Nguoi(card, listCard, index);
                    break;
                case Constant.PLAYER._4:
                    this.openLstCard4Nguoi(card, listCard, index);
                    break;
            }
            index++;
        }
    },
    openLstCard2Nguoi(card, listCard, index) {
        if(this.indexName == 0){
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, 115);
        } else{
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, -160);
        }
    },
    openLstCard3Nguoi(card, listCard, index) {
        if(this.indexName == 0){
            card.angle = 0;
            card.position = new cc.Vec2( -600 + (index * 30), -90);
        } else if(this.indexName == 1){
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, 115);
        } else{
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, -160);
        }
    },
    openLstCard4Nguoi(card, listCard, index) {
        if(this.indexName == 0){
            card.angle = 0;
            card.position = new cc.Vec2( -600 + (index * 30), -90);
        }else if(this.indexName == 1){
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, 115);
        }else if(this.indexName == 2){
            card.angle = 0;
            card.position = new cc.Vec2( 600 - (listCard.length - index) * 30, -90);
        }else{
            card.angle = 0;
            card.position = new cc.Vec2( index * 30 - parseInt(listCard.length/2) * 30, -160);
        }
    },
    RandomComputer(that){
        // if (this.node.name == "_Computer3")
        // {
        //     debugger
        // }
        var rd1 = this.Random(0,that.lstName.length);
        var rd2 = this.Random(0,that.lstAvatar.length);
        var money = this.Random(that.betting * 100,that.betting * 500);
        this.txtName.string = that.lstName[rd1];
        this.playerName = that.lstName[rd1];
        cc.loader.loadRes("banchoi/" + that.lstAvatar[rd2] ,cc.SpriteFrame,(err,spriteFrame)=>{
            if (!err)
                this.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        this.txtMoney.string =  this.func.moneyWithFormat(parseInt(money), ".");
        this.Money = money;
        this.urlAvatar = that.lstAvatar[rd2];
        //
        that.lstName.splice(rd1,1);
        that.lstAvatar.splice(rd2,1);
    },
    DanhBai(that){
        that.turn = this.indexName;
        this.timer = that.timer;
        // this.KhungDanh.active = true;

        // học hỏi từ người chơi
        // var memory = this.func.getData("ComputerMemory");
        // if(memory && memory[that.lastCard]){
            
        //     cc.log("memory",memory);
        // }
        var lstDanh = this.logic.DanhBai(this.listCard, that.lastCard); 
        var lstCard = this.logic.lstCardFind(lstDanh,this.listCard); 
        // các lá bài được đánh ra ở lượt chơi trước đó là đầu vào để máy tính toán đánh bài
        setTimeout(function() {
            var setting = this.func.getData("setting");
            this.sound = setting.sound;
            if(lstDanh.length > 0){
                if(this.sound){
                    cc.audioEngine.play(this.soundMp3,false,1);
                }
                this.ReMoveCard(lstDanh,lstCard,that.lastCard);
                that.setTableCard(lstDanh,this);
            }else{
                this.isBoLuot = true;
                this.KhungDanh.active = false;
                this.iconBoLuot.active = true;
            }
            that.NextTurn(this); // chuyển turn bình thường
        }.bind(this),this.timer);
    },
    ReMoveCard(lstDanh,lst,lastCard){
        this.listCard = lst;
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
        while(index < listCard.length){
            var  card = cc.instantiate(this.Card); 
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
        this.txtCountCard.string = "<color=#000>"+ lst.length +"</c>";
        this.xoeBai.remove();
        this.xoeBai.init(lst.length);
        this.KhungDanh.active = false;
        if(lst.length ==0){
            cc.log("*Máy đánh hết bài*",this.node.name);
            this.isWin = true;
        }
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
    Random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    //  update (dt) {
    //  },
});

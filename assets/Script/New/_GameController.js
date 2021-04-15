var Computer = require('_Computer');
var PlayerGame = require('_PlayerGame');
var functionAll = require('functionAll');
var LogicComputer = require("LogicComputer");
var AmThanh = require("amThanh");
var _Effect = require("_Effect");
var Linker = require("Linker");
import {
    Constant
} from "../lib/Constant2";
cc.Class({
    extends: cc.Component,
    ctor() {
        this.initGame();
    },
    properties: {
        logic: LogicComputer,
        computer0: Computer,
        computer1: Computer,
        computer2: Computer,
        computer3: Computer,
        playerGame: PlayerGame,
        func: functionAll,
        Card: cc.Prefab,
        table: cc.Node,
        btTangCuoc: cc.Node,
        btChoiTiep: cc.Node,
        btTuaNhanh: cc.Node,
        txtMode: cc.Label,
        txtBetting: cc.Label,
        setting: cc.Prefab,
        khungTienBanChoi: cc.Node,
        muaCuoc: cc.Prefab,
        btRefresh: cc.Node,
        tablePoint: cc.Node,
        moveCollider: cc.Node,
        bgPoint: cc.Prefab,
        amThanh: AmThanh,
        spriteAtlasTT: cc.SpriteAtlas,
        backGround: cc.Node,
        home: cc.Prefab,
        game: cc.Prefab,
        rulesPrefab: cc.Prefab,
        effect: _Effect,
        txtBoLuot: [cc.Node],
        tableSprite: cc.Sprite,
        tableSpriteFrame: [cc.SpriteFrame],
        soundMp3: {
            default: null,
            type: cc.AudioClip
        },
        soundMp3_2: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        cc.tween(this.node).to(0.15, {opacity: 255}).start();
        if (Constant.CurrentGameMode == Constant.GameMode.NhatAnTatMode || Constant.CurrentGameMode == Constant.GameMode.DemLaMode)
        {
            switch (Constant.CurrentPlayer)
            {
                case Constant.PLAYER._2:
                    this.computer0.node.active = false;
                    this.computer1.node.active = true;
                    this.computer2.node.active = false;
                    this.computer3.node.active = true;
                    break;
                case Constant.PLAYER._3:
                    this.computer0.node.active = true;
                    this.computer1.node.active = true;
                    this.computer2.node.active = false;
                    this.computer3.node.active = true;
                    break;
                case Constant.PLAYER._4:
                    this.computer0.node.active = true;
                    this.computer1.node.active = true;
                    this.computer2.node.active = true;
                    this.computer3.node.active = true;
                    break;
            }
        }
        else
        {
            this.computer0.node.active = true;
            this.computer1.node.active = true;
            this.computer2.node.active = true;
            this.computer3.node.active = true;
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
            if (event.keyCode === cc.macro.KEY.back || event.keyCode === cc.macro.KEY.backspace || event.keyCode === cc.macro.KEY.escape) {
                this.SaveGame();
                this.amThanh.stopAll();
                this.ketThucAll = true;
                this.sound = false;
                var home = cc.instantiate(this.home);
                this.node.parent.addChild(home);
                this.node.active = false;
                setTimeout(() => {
                    this.node.destroy();
                }, this.timer * 2);
            }
        }, this);

        this.btRefresh.active = false;
        this.coinsMode = this.func.getData("playGame"); // == "CoinsMode" ? true : false;
        this.gameMode = this.func.getData("playGame");
        var tableGame = this.func.getData("tableGame2");
        var setting = this.func.getData("setting");
        this.func.getByName(this, "table", this.coinsMode);
        this.btTuaNhanh.active = false;
        this.btChoiTiep.active = false;
        this.btTangCuoc.active = false;
        this.updateText(setting);
        this.betting = tableGame.table.betting;
        this.language = setting.language;
        this.sound = setting.sound;
        cc.loader.loadRes("banchoi/" + setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
            this.backGround.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        if (this.coinsMode == Constant.GameMode.CoinMode)
        {
            if (this.betting > 999) {
                this.txtBetting.string = setting.language == "en" ? "Bet: $" + this.func.moneyWithFormat(this.betting, ".") : "Cược: $" + this.func.moneyWithFormat(this.betting, ".");
            } else {
                this.txtBetting.string = setting.language == "en" ? "Bet: $" + this.betting : "Cược: $" + this.betting;
            }
            this.tablePoint.active = false;
            this.khungTienBanChoi.active = true;
        }
        else if (this.coinsMode == Constant.GameMode.ScoreMode) {
            // chơi điểm nên bỏ hiển thị phần tiền
            this.computer0.txtMoney.node.active = false;
            this.computer1.txtMoney.node.active = false;
            this.computer2.txtMoney.node.active = false;
            this.computer3.txtMoney.node.active = false;
            this.playerGame.txtMoney.node.active = false;
            ///
            this.tablePoint.active = true;
            this.khungTienBanChoi.active = false;
        }
        else if (this.coinsMode == Constant.GameMode.NhatAnTatMode || this.coinsMode == Constant.GameMode.DemLaMode) {
            if (this.betting > 999) {
                this.txtBetting.string = setting.language == "en" ? "Bet: $" + this.func.moneyWithFormat(this.betting, ".") : "Cược: $" + this.func.moneyWithFormat(this.betting, ".");
            } else {
                this.txtBetting.string = setting.language == "en" ? "Bet: $" + this.betting : "Cược: $" + this.betting;
            }
            this.tablePoint.active = false;
            this.khungTienBanChoi.active = true;
        }
        this.amThanh.playMusic(setting.music);
        if (!setting.lock) {
            this.computer0.txtCountCard.node.active = false;
            this.computer1.txtCountCard.node.active = false;
            this.computer2.txtCountCard.node.active = false;
            this.computer3.txtCountCard.node.active = false;
        }
    },
    
    onEnable () {
        this.tableGame2 = this.func.getData("tableGame2");
        var _this = this;

        this.Money = this.tableGame2.computer3.Money;
        cc.resources.load("banchoi/" + this.tableGame2.computer3.urlAvatar, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err)
            {
                _this.playerGame.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                _this.computer3.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });

        var setting = this.func.getData("setting");
        switch (this.gameMode)
        {
            case Constant.GameMode.NhatAnTatMode:
                this.txtMode.string = setting.language == "en" ? "Rules: First win" : "Luật: Nhất ăn tất";
                break;
            case Constant.GameMode.CoinMode:
                this.txtMode.string = setting.language == "en" ? "Rules: Classic" : "Luật: Truyền thống";
                break;
            case Constant.GameMode.DemLaMode:
                this.txtMode.string = setting.language == "en" ? "Rules: Count left" : "Luật: Đếm lá";
                break;
        }

        var length = setting.listTable.length;
        for (var i = 0; i < length; ++i)
        {
            var element = setting.listTable[i];
            if (element.select)
            {
                this.tableSprite.spriteFrame = this.tableSpriteFrame[i];
            }
        }
    },
    onDisable () {
        var tableGame2 = this.func.getData("tableGame2");
        tableGame2.computer3.Money = this.func.getMoney();
        tableGame2.computer3.total = this.func.getTotal();
        tableGame2.computer3.win = this.func.getWin();
        this.func.setData("tableGame2", tableGame2);
    },
    start() {
        this.computer3.txtName.string = this.language == "vn" ? "Tôi" : "Me";
        this.playerGame.txtName.string = this.language == "vn" ? "Tôi" : "Me";

        var coinsMode = this.func.getData("coinsMode");
        var scoreMode = this.func.getData("scoreMode");
        var demLaMode = this.func.getData("demLaMode");
        var nhatAnTatMode = this.func.getData("nhatAnTatMode");
        //cc.log(coinsMode,scoreMode,this.coinsMode );
        if (coinsMode || scoreMode || demLaMode || nhatAnTatMode)
        {
            coinsMode = false;
            nhatAnTatMode = false;
            demLaMode = false;
            coinsMode = false;
            this.lstName = ["Trinh Anh", "Cường Tỏi", "Khá Chuẩn", "Văn Tý", "Vân Anh", "Thu Thảo", "Minh Hải", "Tà Thần"];
            this.lstAvatar = ["avatar_banchoi_01", "avatar_banchoi_02", "avatar_banchoi_03", "avatar_banchoi_04", "avatar_banchoi_05", "avatar_banchoi_01", "avatar_banchoi_02", "avatar_banchoi_03"];
            this.table.removeAllChildren();
        }
        if ((this.coinsMode == Constant.GameMode.CoinMode && !coinsMode) || (!scoreMode && this.coinsMode == Constant.GameMode.ScoreMode) ||
            (this.coinsMode == Constant.GameMode.DemLaMode && !demLaMode) || (this.coinsMode == Constant.GameMode.NhatAnTatMode && !nhatAnTatMode)) {
            if (this.coinsMode == Constant.GameMode.CoinMode) this.func.setData("coinsMode", true); // chơi xu
            else if (this.coinsMode == Constant.GameMode.ScoreMode) this.func.setData("scoreMode", true); // chơi điểm
            else if (this.coinsMode == Constant.GameMode.DemLaMode) this.func.setData("demLaMode", true); // chơi đếm lá
            else if (this.coinsMode == Constant.GameMode.NhatAnTatMode) this.func.setData("nhatAnTatMode", true); // chơi nhất ăn tất
            // chơi mới
            this.firstTurn = null;
            this.computer0.RandomComputer(this);
            this.computer1.RandomComputer(this);
            this.computer2.RandomComputer(this);
            this.computer3.node.getChildByName("bg_avatar_banchoi").active = false;
            this.newGame();
        } else {
            //cc.log(this,this.func.getData("tableGame"));        
            this.lastGame();
            if (!this.playerGame.isWin) {
                this.playerGame.Active(this);
            } else {
                this.btTuaNhanh.active = true;
            }
            this.checkLastWin();
            this.checkLastBoLuot();
            if (this.winMember < 3) {
                this.TurnPlay(null); // 0->3
            } else {
                // this.btRefresh.active = true;
                this.btTuaNhanh.active = false;
                this.btChoiTiep.active = true;
                if (this.coinsMode == Constant.GameMode.CoinMode) {
                    this.btTangCuoc.active = true;
                } else if (this.coinsMode == Constant.GameMode.ScoreMode) {
                    this.btChoiTiep.x = 0;
                    this.btTangCuoc.active = false;
                } else if (this.coinsMode == Constant.GameMode.DemLaMode) {
                    this.btTangCuoc.active = true;
                } else if (this.coinsMode == Constant.GameMode.Nhat) {
                    this.btTangCuoc.active = true;
                }
            }
        }
        if (this.coinsMode == Constant.GameMode.ScoreMode) {
            this.reloadTablePoint();
        }
    },
    initGame: function() {
        this.winMember = 0; // số người đã đánh hết bài
        this.boLuotMember = 0;
        this.timer = 1000;
        this.winRank = 0; // rank hiển thị khi kết thúc bài
        this.lstName = ["Trinh Anh", "Cường Tỏi", "Khá Chuẩn", "Văn Tý", "Vân Anh", "Thu Thảo", "Minh Hải", "Tà Thần"];
        this.lstAvatar = ["avatar_banchoi_01", "avatar_banchoi_02", "avatar_banchoi_03", "avatar_banchoi_04", "avatar_banchoi_05", "avatar_banchoi_01", "avatar_banchoi_02", "avatar_banchoi_03"];
        this.turn = null;
        this.firstTurn = null;
        this.lastCard = [];
        this.lastCardOld = [];
        this.timeUpdate = 0;
        this.betting = 0; // tiền cược
        this.dut3Bich = false;
        this.lstnextTurn = [];
        this.level = 0;
        this.anHang = 0;
        this.coinsMode = "";
        this.ketThucAll = false;
        this.language = "vn";
        this.sound = true;
        this.arrTransCard = {
            y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            rotation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    updateText: function(setting) {
        var language = setting.language;
        this.btTuaNhanh.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtTuaNhanh;
        this.btChoiTiep.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtChoiTiep;
        this.btTangCuoc.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtTangCuoc;
        this.playerGame.btDanh.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtDanh;
        //this.playerGame.btBoLuot.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtBoLuot;
        this.txtBoLuot.forEach(element => {
            element.getChildByName("txtButton").getComponent(cc.Label).string = setting[language].txtBoLuot;
        });
    },
    reloadTablePoint() {
        this.tablePoint.removeAllChildren();
        var tableMark = [];
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                tableMark = [
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 0
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 1
                    }
                ];  
                break;
            case Constant.PLAYER._3:
                    tableMark = [{
                        name: this.computer0.playerName,
                        point: this.computer0.Point,
                        indexName: 0
                    },
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 1
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 2
                    }
                ];
                break;
            case Constant.PLAYER._4:
                    tableMark = [{
                        name: this.computer0.playerName,
                        point: this.computer0.Point,
                        indexName: 0
                    },
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 1
                    },
                    {
                        name: this.computer2.playerName,
                        point: this.computer2.Point,
                        indexName: 2
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 3
                    }
                ];
                break;
        }
        tableMark = this.SapXepBangDiem(tableMark);

        var i = 0;
        tableMark.forEach(item => {
            var bgPoint = cc.instantiate(this.bgPoint);
            this.tablePoint.addChild(bgPoint);
            var component = bgPoint.getComponent("bg_point");
            component.txtName.string = item.name;
            component.txtPoint.string = item.point;
            component.indexName = item.indexName;
            bgPoint.position = new cc.Vec2(0, 0 - i * 33);
            i++;
        });
    },
    updateTable() {
        var tableMark = [];
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                tableMark = [
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 0
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 1
                    }
                ];  
                break;
            case Constant.PLAYER._3:
                    tableMark = [{
                        name: this.computer0.playerName,
                        point: this.computer0.Point,
                        indexName: 0
                    },
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 1
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 2
                    }
                ];
                break;
            case Constant.PLAYER._4:
                    tableMark = [{
                        name: this.computer0.playerName,
                        point: this.computer0.Point,
                        indexName: 0
                    },
                    {
                        name: this.computer1.playerName,
                        point: this.computer1.Point,
                        indexName: 1
                    },
                    {
                        name: this.computer2.playerName,
                        point: this.computer2.Point,
                        indexName: 2
                    },
                    {
                        name: this.language == "vn" ? "Tôi" : "Me",
                        point: this.playerGame.Point,
                        indexName: 3
                    }
                ];
                break;
        }
        tableMark = this.SapXepBangDiem(tableMark);

        this.tablePoint.children.forEach(item => {
            var component = item.getComponent("bg_point");
            for (let j = 0; j < tableMark.length; j++) {
                if (tableMark[j].indexName == component.indexName) {
                    var y = 0 - j * 33;
                    component.txtName.string = tableMark[j].name;
                    component.txtPoint.string = tableMark[j].point;
                    item.runAction(cc.moveTo(this.timer / 2000, 0, y));
                    break;
                }
            }
        });
    },
    SapXepBangDiem(lst) {
        for (let i = 0; i < lst.length; i++) {
            for (let j = i; j < lst.length; j++) {
                if (lst[i].point < lst[j].point) {
                    var item = lst[i];
                    lst[i] = lst[j];
                    lst[j] = item;
                }
            }
        }
        return lst;
    },
    hienThiChat(nameSprite, player) {
        if (player.node.name == "_PlayerGame") player = this.computer3;
        if (nameSprite) {
            var node = new cc.Node("chatHang");
            node.addComponent(cc.Sprite);
            node.getComponent(cc.Sprite).spriteFrame = this.spriteAtlasTT.getSpriteFrame(nameSprite);
            this.table.addChild(node);
            node.position = player.baiUp.position;
            node.runAction(cc.sequence(cc.moveTo(2 * (this.timer / 10000), 0, 0), cc.callFunc(() => {
                setTimeout(() => {
                    node.destroy();
                }, this.timer);
            })));
        }
    },
    setTableCard(lst, player) {
        if (lst.length === 1 && lst[0] === 12 && player.isWin && this.winMember === 0) {
            // trường hợp đút 3 bích
            this.dut3Bich = true;
            if (this.sound) {
                cc.audioEngine.play(this.amThanh.aDu, false, 1);
            }
            if (player.node.name == "_PlayerGame") {
                this.func.setReport("dutBaBich");
            }
        } else if (this.lastCard.length > 0) {
            var type = this.logic.kiemTraTinhHopLeCuaBoBai(lst);
            if (type > 2) { // bị tứ quý hoặc đôi thông chặt bài
                if (parseInt(this.lastCard[0] / 4) == 15) {
                    // chặt 2
                    this.lastCard.forEach(item => {
                        if (item % 4 < 2) this.anHang += 1; // heo đen
                        else this.anHang += 2; // heo đỏ
                    });
                    if (player.node.name == "_PlayerGame") {
                        this.func.setReport("chatHeo");
                    }
                } else {
                    if (this.lastCard.length === 4) {
                        // chặt tứ quý 
                        this.anHang = 4;
                    } else {
                        // chặt đôi thông
                        this.anHang = 3;
                    }
                }
                if (player.node.name !== "_PlayerGame" && this.sound) {
                    // không phải người chơi
                    this.amThanh.chanBai(0);
                }
                var name = "";
                if (type == 3 && lst.length === 6) {
                    // 3 đôi thông
                    name = "tt_3doithong";
                } else if (type == 3 && lst.length === 8) {
                    // 4 đôi thông
                    name = "tt_4doithong";
                } else if (type == 4) {
                    name = "tt_tuquy";
                }
                if (this.language != "vn") {
                    name += "EN";
                }
                this.hienThiChat(name, player);
                ///
            } else if (parseInt(lst[0] / 4) == 15 && player.node.name !== "_PlayerGame" && this.sound) {
                if (lst.length === 1) {
                    cc.audioEngine.play(this.amThanh.heoNe, false, 1);
                } else if (lst.length === 2) cc.audioEngine.play(this.amThanh.doiHeoNe, false, 1);
            } else if (player.node.name !== "_PlayerGame" && this.sound && (parseInt(lst[0] / 4) > 9 || lst.length > 4)) {
                this.amThanh.chanBai(5);
            }
        }
        this.lastCardOld = this.lastCard;
        this.lastCard = lst;
        this.lstnextTurn.push(player.node.name);
    },
    checkLastBoLuot() {
        if (this.computer0.isBoLuot && !this.computer0.isWin) {
            this.computer0.iconBoLuot.active = true;
        }
        if (this.computer1.isBoLuot && !this.computer1.isWin) {
            this.computer1.iconBoLuot.active = true;
        }
        if (this.computer2.isBoLuot && !this.computer2.isWin) {
            this.computer2.iconBoLuot.active = true;
        }
        if (this.playerGame.isBoLuot && !this.playerGame.isWin) {
            this.playerGame.iconBoLuot.active = true;
        }
    },
    checkLastWin() {
        if (this.computer0.isWin) {
            this.computer0.KetThucVanBai(this, this.computer0.isRank);
        }
        if (this.computer1.isWin) {
            this.computer1.KetThucVanBai(this, this.computer1.isRank);
        }
        if (this.computer2.isWin) {
            this.computer2.KetThucVanBai(this, this.computer2.isRank);
        }
        if (this.computer3.isWin) {
            this.playerGame.node.active = false;
            this.computer3.node.active = true;
            this.computer3.KetThucVanBai(this, this.computer3.isRank);
        }
    },
    lastGame() {
        // lấy dữ liệu cũ của ván trước đổ vào
        this.computer3.node.active = false;
        this.table.removeAllChildren();
        var index = 0;
        this.lastCardOld.forEach(item => {
            var card = cc.instantiate(this.Card);
            card.width = 90;
            card.height = 130;
            card.angle = this.Random(0, 11) - 5; // độ lệch    
            card.position = new cc.Vec2((index - parseInt(this.lastCardOld.length / 2)) * 50, 40);
            card.getComponent(cc.Sprite).spriteFrame = this.playerGame.cardSprite.getSpriteFrame(this.converCardToName(item));
            this.table.addChild(card);
            index++;
        });
        index = 0;
        this.lastCard.forEach(item => {
            var card = cc.instantiate(this.Card);
            card.width = 90;
            card.height = 130;
            card.angle = this.Random(0, 11) - 5; // độ lệch    
            card.position = new cc.Vec2((index - parseInt(this.lastCard.length / 2)) * 50, 0);
            card.getComponent(cc.Sprite).spriteFrame = this.playerGame.cardSprite.getSpriteFrame(this.converCardToName(item));
            this.table.addChild(card);
            index++;
        });

        this.computer0.txtCountCard.string = "<color=#000>" + this.computer0.listCard.length + "</c>";
        this.computer1.txtCountCard.string = "<color=#000>" + this.computer1.listCard.length + "</c>";
        this.computer2.txtCountCard.string = "<color=#000>" + this.computer2.listCard.length + "</c>";
        this.computer0.baiUp.active = true;
        this.computer1.baiUp.active = true;
        this.computer2.baiUp.active = true;
    },
    converCardToName(value) {
        var name = parseInt(value / 4);
        if (name === 14) name = 1;
        else if (name === 15) name = 2;

        switch (value % 4) {
            case 0:
                name += "b";
                break;
            case 1:
                name += "t";
                break;
            case 2:
                name += "r";
                break;
            case 3:
                name += "c";
                break;
        }
        return name;
    },
    resetController() {
        this.playerGame.butonEnable();
        this.btTangCuoc.active = false;
        this.btChoiTiep.active = false;
        this.btTuaNhanh.active = false;
        this.winMember = 0;
        this.winRank = 0;
        this.boLuotMember = 0;
        this.lastCard = [];
        this.lastCardOld = [];
        this.turn = null;
        this.dut3Bich = false;
        this.lstnextTurn = [];
        this.anHang = 0;
        this.timer = 1000;
    },
    ClickNewGame() {
        this.amThanh.bt_click(this.sound);
        if (this.coinsMode == Constant.GameMode.CoinMode && (this.computer0.Money < 0 || this.computer1.Money < 0 || this.computer2.Money < 0)) {
            this.reSetGame();
        } else {
            this.table.removeAllChildren();
            var lstCardAll = this.playerGame.node.children.filter(x => x.name.indexOf('card') > -1);
            lstCardAll.forEach(item => {
                item.destroy();
            });
            this.lastCard = [];
            this.lastCardOld = [];
            this.newGame();
        }
    },
    newGame() {

        this.func.addTotal(true);

        this.playerGame.txtMoney.string = (this.func.getMoney() > 999 ? this.func.moneyWithFormat(this.func.getMoney(), ".") : this.func.getMoney());
        cc.error(Constant.CurrentPlayer);
        switch(Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                // thực hiện chia bài cho ván chơi mới
                this.btRefresh.active = false;
                this.resetController();
                this.computer0.node.active = false;
                this.computer1.resetComputer();
                this.computer2.node.active = false;
                this.computer3.resetComputer();
                this.playerGame.resetPlayer();
                var Card = cc.instantiate(this.Card);
                this.table.addChild(Card);
                this.ChiaBai(); // chia bài mặt dữ liệu
                this.HienThiChiaBai();
                break;
            case Constant.PLAYER._3:
                // thực hiện chia bài cho ván chơi mới
                this.btRefresh.active = false;
                this.resetController();
                this.computer0.resetComputer();
                this.computer1.resetComputer();
                this.computer2.node.active = false;
                this.computer3.resetComputer();
                this.playerGame.resetPlayer();
                var Card = cc.instantiate(this.Card);
                this.table.addChild(Card);
                this.ChiaBai(); // chia bài mặt dữ liệu
                this.HienThiChiaBai();
                break;
            case Constant.PLAYER._4:
                // thực hiện chia bài cho ván chơi mới
                this.btRefresh.active = false;
                this.resetController();
                this.computer0.resetComputer();
                this.computer1.resetComputer();
                this.computer2.resetComputer();
                this.computer3.resetComputer();
                this.playerGame.resetPlayer();
                var Card = cc.instantiate(this.Card);
                this.table.addChild(Card);
                this.ChiaBai(); // chia bài mặt dữ liệu
                this.HienThiChiaBai();
                break;
        }
    },
    HienThiChiaBai() {
        // this.scheduleOnce(() => {
            var setting = this.func.getData("setting");
            this.sound = setting.sound;
            switch (Constant.CurrentPlayer)
            {
                case Constant.PLAYER._2:
                    this.HienThiChiaBai2Nguoi();
                    break;
                case Constant.PLAYER._3:
                    this.HienThiChiaBai3Nguoi();
                    break;
                case Constant.PLAYER._4:
                    this.HienThiChiaBai4Nguoi();
                    break;
            }
        // }, 0.2);
    },
    HienThiChiaBai2Nguoi: function() {
        var dem = 0; // vị trí chia bài đầu tiên computer1 0->51
        var dem1 = 0;
        var dem3 = 0;
        var _this = this;
        var arrCard = [];
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        var time = setInterval(() => {
            if (_this.ketThucAll) {
                clearInterval(time);
            }
            var Card = cc.instantiate(_this.Card); // thêm các lá bài để chia
            var Computer = null;
            switch (dem % 2) {
                case 0:
                    Computer = _this.computer1;
                    dem1++;
                    break;
                case 1:
                    Computer = _this.computer3;
                    dem3++;
                    break;
            }
            _this.table.addChild(Card);
            arrCard.push(Card);
            var anim;
            if (Computer == _this.computer1) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer1.baiUp.x, _this.computer1.baiUp.y);

                // debugger
            } else if (Computer == _this.computer3) {
                // cc.log(`x${dem3}: ` + Number(Computer.baiUp.x + ((dem3 - 1)* 50)));
                // cc.log(`y${dem3}: ` + Number(Computer.baiUp.y + this.arrTransCard.y[dem3 - 1]));
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), Number(Computer.baiUp.x + ((dem3 - 1) * 65)), Number(Computer.baiUp.y + _this.arrTransCard.y[dem3 - 1]));
                
            }

            var callback = new cc.callFunc(() => {
                // Card.destroy(); // hủy bỏ lá bài vừa dc chia
                // Computer.baiUp.active = true; // hiển thị quân bài úp
                if (Computer != _this.computer3)
                {
                    this.scheduleOnce(() => {
                        Card.destroy();
                    }, 0.3);
                }
            });
            var anim2;
            if (Computer == _this.computer1) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem1 - 1]);
            } else if (Computer == _this.computer3) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem3 - 1]);
            }
            
            var anim3;
            if (Computer == _this.computer1) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer3) {
                anim3 = cc.scaleTo(2 * (_this.timer / 5000), 1);
                
            }
            
            Card.runAction(anim);
            Card.runAction(anim3);
            Card.runAction(new cc.sequence(anim2, callback));
            
            // Card.runAction(cc.spawn(anim, anim2));
            Computer.txtCountCard.string = "<color=#000>" + parseInt((dem / 2) + 1) + "</c>"; // cập nhật chỉ số quân bài
            dem++;
            if (dem > 25) {
                _this.table.children[0].destroy();
                clearInterval(time);
                setTimeout(() => {
                    cc.log(_this.table);
                    // for(let i = 0; i < this.table.children.length; i ++) {
                    //     // setTimeout(() => {
                    //     //     this.table.children[i].destroy();
                    //     // }, 100 * i);
                    //     // cc.tween(this.table.children[i]).to(1, { scale: 0 })
                    // }
                    var cb = () => {
                        if (!_this.node.active)
                        {
                            clearTimeout(cb);
                            return;
                        }
                        _this.computer3.node.active = false;
                        _this.lastCard = [];
                        _this.lastCardOld = [];
                        arrCard.forEach(element => {
                            element.destroy();
                        })
                        _this.computer1.xoeBai.init(dem1);

                        var lstC = [_this.computer1.listCard, _this.computer3.listCard];
                        var check = _this.computer1.logic.CheckAnTrang(lstC, _this.firstTurn);
                        if (check) {
                            // ăn trắng hoặc chia lại bài
                            _this.isAnTrang(check[0], check[1]);
                            _this.computer1.xoeBai.remove();
                        } else {
                            _this.playerGame.Active(_this);
                            // ai có 3 bích thì được đánh trước
                            _this.TurnPlay(_this.firstTurn);
                        }
                    }
                    setTimeout(cb, 1000);

                }, _this.timer);
                
            }
        }, 60 * (_this.timer / 1000));
        
    },
    HienThiChiaBai3Nguoi: function() {
        var dem = 0; // vị trí chia bài đầu tiên computer1 0->51
        var dem1 = 0;
        var dem0 = 0;
        var dem3 = 0;
        var _this = this;
        var arrCard = [];
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        var time = setInterval(() => {
            if (_this.ketThucAll) {
                clearInterval(time);
            }
            var Card = cc.instantiate(_this.Card); // thêm các lá bài để chia
            var Computer = null;
            switch (dem % 3) {
                case 0:
                    Computer = _this.computer0;
                    ++dem0;
                    break;
                case 1:
                    Computer = _this.computer1;
                    ++dem1;
                    break;
                case 2:
                    Computer = _this.computer3;
                    ++dem3;
                    break;
            }
            _this.table.addChild(Card);
            arrCard.push(Card);
            var anim;
            if (Computer == _this.computer0) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer0.baiUp.x, _this.computer0.baiUp.y);
            }
            else if (Computer == _this.computer1) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer1.baiUp.x, _this.computer1.baiUp.y);
            }
            else if (Computer == _this.computer3) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), Number(Computer.baiUp.x + ((dem3 - 1) * 65)), Number(Computer.baiUp.y + _this.arrTransCard.y[dem3 - 1]));
                
            }
            // var anim = cc.moveTo(2 * (_this.timer / 10000), Computer.baiUp.x, Computer.baiUp.y);
            var callback = new cc.callFunc(() => {
                // Card.destroy(); // hủy bỏ lá bài vừa dc chia
                // Computer.baiUp.active = true; // hiển thị quân bài úp
                if (Computer != _this.computer3)
                {
                    this.scheduleOnce(() => {
                        Card.destroy();
                    }, 0.3);
                }
            });
            var anim2;
            if (Computer == _this.computer1) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem1 - 1]);
            }
            else if (Computer == _this.computer0) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem0 - 1]);
            }
            else if (Computer == _this.computer3) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem3 - 1]);
            }
            var anim3;
            if (Computer == _this.computer0) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer1) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer3) {
                anim3 = cc.scaleTo(2 * (_this.timer / 5000), 1);
                
            }
            Card.runAction(anim);
            Card.runAction(anim3);
            Card.runAction(new cc.sequence(anim2, callback));

            Computer.txtCountCard.string = "<color=#000>" + parseInt((dem / 3) + 1) + "</c>"; // cập nhật chỉ số quân bài
            dem++;
            if (dem > 38) {
                _this.table.children[0].destroy();
                clearInterval(time);
                var cb = () => {
                    if (!_this.node.active)
                    {
                        clearTimeout(cb);
                        return;
                    }
                    _this.computer3.node.active = false;
                    _this.lastCard = [];
                    _this.lastCardOld = [];
                    
                    _this.computer0.xoeBai.init(dem0);
                    _this.computer1.xoeBai.init(dem1);
                    
                    arrCard.forEach(element => {
                        element.destroy();
                    })
                    var lstC = [_this.computer0.listCard, _this.computer1.listCard, _this.computer3.listCard];
                    var check = _this.computer0.logic.CheckAnTrang(lstC, _this.firstTurn);
                    if (check) {
                        // ăn trắng hoặc chia lại bài
                        _this.isAnTrang(check[0], check[1]);
                        _this.computer0.xoeBai.remove();
                        _this.computer1.xoeBai.remove();
                    } else {
                        _this.playerGame.Active(_this);
                        // ai có 3 bích thì được đánh trước
                        _this.TurnPlay(_this.firstTurn);
                    }
                }
                setTimeout(cb, _this.timer);
            }
        }, 60 * (_this.timer / 1000));
    },
    HienThiChiaBai4Nguoi: function () {
        var dem = 0; // vị trí chia bài đầu tiên computer1 0->51
        var dem0 = 0;
        var dem1 = 0;
        var dem2 = 0;
        var dem3 = 0;
        var _this = this;
        var arrCard = [];
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        var time = setInterval(() => {
            if (_this.ketThucAll) {
                clearInterval(time);
            }
            var Card = cc.instantiate(_this.Card); // thêm các lá bài để chia
            var Computer = null;
            switch (dem % 4) {
                case 0:
                    Computer = _this.computer0;
                    ++dem0;
                    break;
                case 1:
                    Computer = _this.computer1;
                    ++dem1;
                    break;
                case 2:
                    Computer = _this.computer2;
                    ++dem2;
                    break;
                case 3:
                    Computer = _this.computer3;
                    ++dem3;
                    break;
            }
            _this.table.addChild(Card);
            arrCard.push(Card);
            var anim;
            if (Computer == _this.computer0) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer0.baiUp.x, _this.computer0.baiUp.y);
            }
            else if (Computer == _this.computer1) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer1.baiUp.x, _this.computer1.baiUp.y);
            }
            else if (Computer == _this.computer2) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), _this.computer2.baiUp.x, _this.computer2.baiUp.y);
            }
            else if (Computer == _this.computer3) {
                if (this.sound)
                {
                    cc.audioEngine.play(this.soundMp3_2, false, 1);
                }
                anim = cc.moveTo(2 * (_this.timer / 5000), Number(Computer.baiUp.x + ((dem3 - 1) * 65)), Number(Computer.baiUp.y + _this.arrTransCard.y[dem3 - 1]));
            }
            var callback = new cc.callFunc(() => {
                // Card.destroy(); // hủy bỏ lá bài vừa dc chia        
                // Computer.baiUp.active = true; // hiển thị quân bài úp
                if (Computer != _this.computer3)
                {
                    this.scheduleOnce(() => {
                        Card.destroy();
                    }, 0.3);
                }
            });
            var anim2;
            if (Computer == _this.computer1) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem1 - 1]);
            }
            else if (Computer == _this.computer0) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem0 - 1]);
            }
            else if (Computer == _this.computer2) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem2 - 1]);
            }
            else if (Computer == _this.computer3) {
                anim2 = cc.rotateBy(2 * (_this.timer / 5000), -180 + _this.arrTransCard.rotation[dem3 - 1]);
            }

            var anim3;
            if (Computer == _this.computer0) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer1) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer2) {
                anim3 = cc.scaleTo((_this.timer / 5000), 0.5);
            }
            else if (Computer == _this.computer3) {
                anim3 = cc.scaleTo(2 * (_this.timer / 5000), 1);
            }

            Card.runAction(anim);
            Card.runAction(anim3);
            Card.runAction(new cc.sequence(anim2, callback));

            Computer.txtCountCard.string = "<color=#000>" + parseInt((dem / 4) + 1) + "</c>"; // cập nhật chỉ số quân bài
            dem++;
            if (dem > 51) {
                _this.table.children[0].destroy();
                clearInterval(time);
                var cb = () => {
                    if (!_this.node.active)
                    {
                        clearTimeout(cb);
                        return;
                    }
                    _this.computer3.node.active = false;
                    _this.lastCard = [];
                    _this.lastCardOld = [];

                    _this.computer0.xoeBai.init(dem0);
                    _this.computer1.xoeBai.init(dem1);
                    _this.computer2.xoeBai.init(dem2);

                    arrCard.forEach(element => {
                        element.destroy();
                    })
                    var lstC = [_this.computer0.listCard, _this.computer1.listCard, _this.computer2.listCard, _this.computer3.listCard];
                    var check = _this.computer0.logic.CheckAnTrang(lstC, _this.firstTurn);
                    if (check) {
                        // ăn trắng hoặc chia lại bài
                        _this.isAnTrang(check[0], check[1]);
                        _this.computer0.xoeBai.remove();
                        _this.computer1.xoeBai.remove();
                        _this.computer2.xoeBai.remove();
                    } else {
                        _this.playerGame.Active(_this);
                        // ai có 3 bích thì được đánh trước
                        _this.TurnPlay(_this.firstTurn);
                    }
                }
                setTimeout(cb, _this.timer);
            }
        }, 60 * (_this.timer / 1000));
    },
    TurnPlay(firstTurn) {
        switch(Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                this.TurnPlay2Nguoi(firstTurn);
                break;
            case Constant.PLAYER._3:
                this.TurnPlay3Nguoi(firstTurn);
                break;
            case Constant.PLAYER._4:
                this.TurnPlay4Nguoi(firstTurn);
                break;
        }
    },
    TurnPlay2Nguoi: function(firstTurn) {
        // this.btRefresh.active = true;
        if (firstTurn != null) {
            this.turn = firstTurn;
        }
        //Neu this.turn null thi random cho nguoi choi ngau nhien di truoc
        if (!this.turn)
            this.turn = Math.floor(Math.random() * Math.floor(2));
        switch (this.turn) {
            case 1:
                this.effect.scaleNode(this.computer1.node.getChildByName("bg_avatar_banchoi"));
                this.computer1.DanhBai(this);
                break;
            default:
                setTimeout(() => {
                    this.effect.scaleNode(this.playerGame.bgAvatarBanChoi);
                    this.playerGame.DanhBai(this);
                }, this.timer);
                break;
        }
    },
    TurnPlay3Nguoi: function(firstTurn) {
        // this.btRefresh.active = true;
        if (firstTurn != null) {
            this.turn = firstTurn;
        }
        //Neu this.turn null thi random cho nguoi choi ngau nhien di truoc
        if (!this.turn)
            this.turn = Math.floor(Math.random() * Math.floor(3));
        switch (this.turn) {
            case 0:
                this.effect.scaleNode(this.computer0.node.getChildByName("bg_avatar_banchoi"));
                this.computer0.DanhBai(this);
                break;
            case 1:
                this.effect.scaleNode(this.computer1.node.getChildByName("bg_avatar_banchoi"));
                this.computer1.DanhBai(this);
                break;
            default:
                setTimeout(() => {
                    this.playerGame.DanhBai(this);
                }, this.timer);
                break;
        }
    },
    TurnPlay4Nguoi: function(firstTurn) {
        // this.btRefresh.active = true;
        if (firstTurn != null) {
            this.turn = firstTurn;
        }
        //Neu this.turn null thi random cho nguoi choi ngau nhien di truoc
        if (!this.turn)
            this.turn = Math.floor(Math.random() * Math.floor(4));
        switch (this.turn) {
            case 0:
                this.effect.scaleNode(this.computer0.node.getChildByName("bg_avatar_banchoi"));
                this.computer0.DanhBai(this);
                break;
            case 1:
                this.effect.scaleNode(this.computer1.node.getChildByName("bg_avatar_banchoi"));
                this.computer1.DanhBai(this);
                break;
            case 2:
                this.effect.scaleNode(this.computer2.node.getChildByName("bg_avatar_banchoi"));
                this.computer2.DanhBai(this);
                break;
            default:
                setTimeout(() => {
                    this.playerGame.DanhBai(this);
                }, this.timer);
                break;
        }
    },
    ChiaBai() {
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                this.ChiaBai2Nguoi();
                break;
            case Constant.PLAYER._3:
                this.ChiaBai3Nguoi();
                break;
            case Constant.PLAYER._4:
                this.ChiaBai4Nguoi();
                break;
        }
        
    },
    ChiaBai2Nguoi: function() {
        // thực hiện việc chia bài và lưu lại dữ liệu
        var bobai = [];
        var listCard1 = [];
        var listCard3 = [];

        // thêm 52 lá vào bộ bài 12 -> 63
        var max = 12;
        while (max < 64) {
            bobai.push(max);
            max++;
        }
        // tráo 52 lá bài 
        max = 51;
        while (max >= 0) {
            var index = this.Random(0, 52);
            var value = bobai[max];
            bobai[max] = bobai[index];
            bobai[index] = value;
            max--;
        }

        // chia ra thành 4 mô bài
        max = 0;
        while (max < 52) {
            if (max > 13 * 2 - 1)
                break;
            switch (max % 2) {
                case 0:
                    listCard1.push(bobai[max]);
                    break;
                case 1:
                    listCard3.push(bobai[max]);
                    break;
            }
            if (bobai[max] == 13) {
                this.turn = (max % 2);
            }
            max++;
        }

        // chuyển tới sắp xếp lại 4 mô bài và lưu dữ liệu vào local
        listCard1 = this.SapXep(listCard1);
        listCard3 = this.SapXep(listCard3);
        
        // listCard1 = [18, 13, 17, 22, 27, 28, 33, 38, 41, 46, 49, 56, 57];
        // listCard3 = [12, 13, 17, 22, 27, 29, 34, 41, 46, 49, 54, 61, 62];
        // listCard3 = [14, 17, 18, 22, 23, 33, 39, 43, 47, 56, 57, 61, 62];
        // listCard1 = [];
        // for (var i = 0; i < 64; ++i)
        // {
        //     listCard1.push(i);
        // }
        cc.log("*Độ khó*", this.level);
        if (this.level > 0) {

            // tráo bài cho người chơi
            var maxRankPlayer = this.checkMaxRank(listCard3);
            var lst = [];
            var maxRank0 = this.checkMaxRank(listCard1);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard1;
                listCard1 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank0;
            }
            var maxRank1 = this.checkMaxRank(listCard1);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard1;
                listCard1 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank1;
            }
        }
        var findDoiThong = this.logic.findDoiThong(listCard3);
        if (findDoiThong.length > 0 && findDoiThong[0].length >= 8) {
            var lss = listCard3;
            listCard3 = listCard1;
            listCard1 = lss;
        }
        //cc.log(maxRank0,maxRank1,maxRank2,maxRankPlayer);
        this.SaveListCard(null, listCard1, null, listCard3);
    },
    ChiaBai3Nguoi: function() {
        // thực hiện việc chia bài và lưu lại dữ liệu
        var bobai = [];
        var listCard0 = [];
        var listCard1 = [];
        var listCard3 = [];

        // thêm 52 lá vào bộ bài 12 -> 63
        var max = 12;
        while (max < 64) {
            bobai.push(max);
            max++;
        }
        // tráo 52 lá bài 
        max = 51;
        while (max >= 0) {
            var index = this.Random(0, 52);
            var value = bobai[max];
            bobai[max] = bobai[index];
            bobai[index] = value;
            max--;
        }

        // chia ra thành 4 mô bài
        max = 0;
        while (max < 52) {
            if (max > 13 * 3 - 1)
                break;
            switch (max % 3) {
                case 0:
                    listCard0.push(bobai[max]);
                    break;
                case 1:
                    listCard1.push(bobai[max]);
                    break;
                case 2:
                    listCard3.push(bobai[max]);
                    break;
            }
            if (bobai[max] == 13) {
                this.turn = (max % 3);
            }
            max++;
        }

        // chuyển tới sắp xếp lại 4 mô bài và lưu dữ liệu vào local
        listCard0 = this.SapXep(listCard0);
        listCard1 = this.SapXep(listCard1);
        listCard3 = this.SapXep(listCard3);

        // listCard0 = [12, 13, 14, 16, 17, 18, 25, 26, 27, 30, 31, 32, 36];
        // // listCard1 = [12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36];
        // listCard3 = [12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 53, 62];
        // listCard1 = [];
        // for (var i = 0; i < 64; ++i)
        // {
        //     listCard1.push(i);
        // }
        // this.level = 1;
        cc.log("*Độ khó*", this.level);
        if (this.level > 0) {

            // tráo bài cho người chơi
            var maxRankPlayer = this.checkMaxRank(listCard3);
            var lst = [];
            var maxRank0 = this.checkMaxRank(listCard0);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard0;
                listCard0 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank0;
            }
            var maxRank1 = this.checkMaxRank(listCard1);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard1;
                listCard1 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank1;
            }
        }
        var findDoiThong = this.logic.findDoiThong(listCard0);
        if (findDoiThong.length > 0 && findDoiThong[0].length >= 8) {
            var lss = listCard0;
            listCard0 = listCard1;
            listCard1 = lss;
        }
        //cc.log(maxRank0,maxRank1,maxRank2,maxRankPlayer);
        this.SaveListCard(listCard0, listCard1, null, listCard3);
    },
    ChiaBai4Nguoi: function () {
        // thực hiện việc chia bài và lưu lại dữ liệu
        var bobai = [];
        var listCard0 = [];
        var listCard1 = [];
        var listCard2 = [];
        var listCard3 = [];

        // thêm 52 lá vào bộ bài 12 -> 63
        var max = 12;
        while (max < 64) {
            bobai.push(max);
            max++;
        }
        // tráo 52 lá bài 
        max = 51;
        while (max >= 0) {
            var index = this.Random(0, 52);
            var value = bobai[max];
            bobai[max] = bobai[index];
            bobai[index] = value;
            max--;
        }

        // chia ra thành 4 mô bài
        max = 0;
        while (max < 52) {
            switch (max % 4) {
                case 0:
                    listCard0.push(bobai[max]);
                    break;
                case 1:
                    listCard1.push(bobai[max]);
                    break;
                case 2:
                    listCard2.push(bobai[max]);
                    break;
                case 3:
                    listCard3.push(bobai[max]);
                    break;
            }
            if (bobai[max] == 13) {
                this.turn = (max % 4);
            }
            max++;
        }

        // chuyển tới sắp xếp lại 4 mô bài và lưu dữ liệu vào local
        listCard0 = this.SapXep(listCard0);
        listCard1 = this.SapXep(listCard1);
        listCard2 = this.SapXep(listCard2);
        listCard3 = this.SapXep(listCard3);

        // listCard0 = [12, 13, 16, 19, 23, 31, 33, 34, 35, 41, 43, 45, 53];
        // listCard1 = [14, 18, 20, 27, 28, 36, 40, 42, 46, 48, 56, 57, 59];
        // listCard2 = [15, 17, 24, 26, 29, 32, 37, 38, 39, 47, 53, 54, 55];
        // listCard3 = [21, 22, 25, 30, 44, 49, 50, 51, 58, 60, 61, 62, 63];
        // this.level = 1;

        //Toi trang
        // listCard1 = [12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36];
        cc.log("*Độ khó*", this.level);
        if (this.level > 0) {

            // tráo bài cho người chơi
            var maxRankPlayer = this.checkMaxRank(listCard3);
            var lst = [];
            var maxRank0 = this.checkMaxRank(listCard0);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard0;
                listCard0 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank0;
            }
            var maxRank1 = this.checkMaxRank(listCard1);
            if (maxRank1 < maxRankPlayer) {
                lst = listCard1;
                listCard1 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank1;
            }
            var maxRank2 = this.checkMaxRank(listCard2);
            if (maxRank2 < maxRankPlayer) {
                lst = listCard2;
                listCard2 = listCard3;
                listCard3 = lst;
                maxRankPlayer = maxRank2;
            }

        }
        var findDoiThong = this.logic.findDoiThong(listCard3);
        if (findDoiThong.length > 0 && findDoiThong[0].length >= 8) {
            var lss = listCard3;
            listCard3 = listCard1;
            listCard1 = lss;
        }
        //cc.log(maxRank0,maxRank1,maxRank2,maxRankPlayer);
        this.SaveListCard(listCard0, listCard1, listCard2, listCard3);
    },
    checkMaxRank(lst) {
        var maxRank = 0;
        lst.forEach(item => {
            maxRank += item;
        });
        return maxRank;
    },
    isAnTrang(index, type) {
        this.updateSound();
        if (this.sound) {
            cc.audioEngine.play(this.amThanh.win, false, 1);
        }
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                this.isAnTrang2Nguoi(index, type);
                break;
            case Constant.PLAYER._3:
                this.isAnTrang3Nguoi(index, type);
                break;
            case Constant.PLAYER._4:
                this.isAnTrang4Nguoi(index, type);
                break;
        }
    },

    isAnTrang2Nguoi(index, type) {
        if (this.sound) {
            cc.audioEngine.play(this.amThanh.win, false, 1);
        }
        this.winMember = 2;
        var money = 0;
        var totalMoney = 0;
        this.table.removeAllChildren();
        var lst = [this.computer1, this.computer3];
        var anTrang = ["tt_6doithong", "tt_6doi", "tt_5doithong", "tt_tuquy3", "tt_tuquy2", "tt_sanhrong", "tt_dongchat"];
        if (type > 0) {
            for (let i = 0; i < 2; i++) {
                if (i == index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            if (index == 0)
                            {
                                money = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -2;
                            }
                            else if (index == 1)
                            {
                                money = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -2;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            if (index == 0)
                            {
                                money = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                            }
                            else if (index == 1)
                            {
                                money = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            if (index == 0)
                            {
                                money = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                            }
                            else if (index == 1)
                            {
                                money = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                    }
                } else {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -2 + this.betting * xetHang * -1;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * xetHang * -1 + this.betting * lst[i].listCard.length * -2;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                    }
                }
            }
        } else {
            // 6 đôi thông -> xét hàng
            var obj = null;
            var anT = 0;
            for (let i = 0; i < 2; i++) {
                if (i != index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -2 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 3;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 3;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.DemLaMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * lst[i].listCard.length * -2 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 3;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                    }
                } else {
                    obj = lst[i];
                }
            }

            obj.KetThucVanBai(this, 1, money * -1, anTrang[type]);
            obj.openLstCard();
            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
            setTimeout(() => {
                this.btChoiTiep.active = true;
                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                //     this.btTangCuoc.active = true;
                // } else {
                //     this.btTangCuoc.active = false;
                // }
                this.btTangCuoc.active = true;
            }, this.timer);
            if (obj.indexName == 1) {
                this.playerGame.isWin = true;
                this.playerGame.isRank = 1;
                if (this.coinsMode != Constant.GameMode.CoinMode) {
                    this.playerGame.Point += 3;
                } else {
                    this.playerGame.Money += this.betting * anT;
                }
                this.func.setReport("toiTrang");
            }
        }
        this.active = false;
        // this.btRefresh.active = true;
        if (this.coinsMode != Constant.GameMode.CoinMode) this.updateTable();
    },
    isAnTrang3Nguoi(index, type) {
        if (this.sound) {
            cc.audioEngine.play(this.amThanh.win, false, 1);
        }
        this.winMember = 3;
        var money = 0;
        var totalMoney = 0;
        this.table.removeAllChildren();
        var lst = [this.computer0, this.computer1, this.computer3];
        var anTrang = ["tt_6doithong", "tt_6doi", "tt_5doithong", "tt_tuquy3", "tt_tuquy2", "tt_sanhrong", "tt_dongchat"];
        if (type > 0) {
            for (let i = 0; i < 3; i++) {
                if (i == index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                money = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money1;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                money = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money1;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                money = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                money = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                money = money0 + money1;
                            }

                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                    }
                } else {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * xetHang * -1 + this.betting * lst[i].listCard.length * -2;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                    }
                }
            }
        } else {
            // 6 đôi thông -> xét hàng
            var obj = null;
            var anT = 0;
            for (let i = 0; i < 3; i++) {
                if (i != index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.DemLaMode: 
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * lst[i].listCard.length * -2 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                    }
                } else {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money1;
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money1;
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                totalMoney = money1 + money2;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                totalMoney = money0 + money2;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                totalMoney = money0 + money1;
                            }
                            break;
                    }
                    obj = lst[i];
                }
            }

            obj.KetThucVanBai(this, 1, totalMoney * -1, anTrang[type]);
            obj.openLstCard();
            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
            setTimeout(() => {
                this.btChoiTiep.active = true;
                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                //     this.btTangCuoc.active = true;
                // } else {
                //     this.btTangCuoc.active = false;
                // }
                this.btTangCuoc.active = true;
            }, this.timer);
            if (obj.indexName == 2) {
                this.playerGame.isWin = true;
                this.playerGame.isRank = 1;
                if (this.coinsMode != Constant.GameMode.CoinMode) {
                    this.playerGame.Point += 3;
                } else {
                    this.playerGame.Money += this.betting * anT;
                }
                this.func.setReport("toiTrang");
            }
        }
        this.active = false;
        // this.btRefresh.active = true;
        if (this.coinsMode != Constant.GameMode.CoinMode) this.updateTable();
    },
    isAnTrang4Nguoi(index, type) {
        if (this.sound) {
            cc.audioEngine.play(this.amThanh.win, false, 1);
        }
        this.winMember = 4;
        var money = 0;
        var totalMoney = 0;
        this.table.removeAllChildren();
        var lst = [this.computer0, this.computer1, this.computer2, this.computer3];
        var anTrang = ["tt_6doithong", "tt_6doi", "tt_5doithong", "tt_tuquy3", "tt_tuquy2", "tt_sanhrong", "tt_dongchat"];
        if (type > 0) {
            for (let i = 0; i < 4; i++) {
                if (i == index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                money = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                money = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                money = money0 + money2 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                money = money0 + money1 + money2;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                money = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money1 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                money = money0 + money1 + money2;
                            }
                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                money = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                money = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                money = money0 + money1 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                money = money0 + money1 + money2;
                            }

                            lst[i].KetThucVanBai(this, 1, money * -1, anTrang[type]);
                            lst[i].openLstCard();
                            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
                            setTimeout(() => {
                                this.btChoiTiep.active = true;
                                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                                //     this.btTangCuoc.active = true;
                                // } else {
                                //     this.btTangCuoc.active = false;
                                // }
                                this.btTangCuoc.active = true;
                            }, this.timer);
                            if (i == 2) {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 1;
                                if (this.coinsMode != Constant.GameMode.CoinMode) {
                                    this.playerGame.Point += 3;
                                } else {
                                    this.playerGame.Money += this.betting * 4;
                                }
                                this.func.setReport("toiTrang");
                            }
                            break;
                    }
                } else {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -4 + this.betting * xetHang * -1;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 5, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * xetHang * -1 + this.betting * lst[i].listCard.length * -2;
                            totalMoney += money;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * 2;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            break;
                    }
                }
            }
        } else {
            // 6 đôi thông -> xét hàng
            var obj = null;
            var anT = 0;
            for (let i = 0; i < 4; i++) {
                if (i != index) {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -4 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 5, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * -3 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                        case Constant.GameMode.DemLaMode:
                            var xetHang = this.logic.xetHang(lst[i].listCard, 0);
                            money = this.betting * lst[i].listCard.length * -2 + this.betting * xetHang * -1;
                            lst[i].KetThucVanBai(this, 3, money);
                            if (lst[i].node.name == "_Computer3") {
                                this.playerGame.isWin = true;
                                this.playerGame.isRank = 4;
                                if (this.coinsMode == Constant.GameMode.CoinMode) {
                                    this.playerGame.Money -= this.betting * xetHang;
                                    if (this.playerGame.Money < 0) this.playerGame.Money = 0;
                                }
                            }
                            anT += xetHang;
                            break;
                    }
                }
                else
                {
                    switch (Constant.CurrentGameMode)
                    {
                        case Constant.GameMode.CoinMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                totalMoney = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                totalMoney = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -4;
                                totalMoney = money0 + money2 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -4;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -4;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -4;
                                totalMoney = money0 + money1 + money2;
                            }
                            break;
                        case Constant.GameMode.NhatAnTatMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money1 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * -3;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * -3;
                                var money3 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * -3;
                                totalMoney = money0 + money1 + money2;
                            }
                            break;
                        case Constant.GameMode.DemLaMode:
                            if (index == 0)
                            {
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                totalMoney = money1 + money2 + money3;
                            }
                            else if (index == 1)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                totalMoney = money0 + money2 + money3;
                            }
                            else if (index == 2)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money3 = this.betting * this.logic.xetHang(lst[3].listCard, 0) * -1 + this.betting * lst[3].listCard.length * -2;
                                totalMoney = money0 + money1 + money3;
                            }
                            else if (index == 3)
                            {
                                var money0 = this.betting * this.logic.xetHang(lst[0].listCard, 0) * -1 + this.betting * lst[0].listCard.length * -2;
                                var money1 = this.betting * this.logic.xetHang(lst[1].listCard, 0) * -1 + this.betting * lst[1].listCard.length * -2;
                                var money2 = this.betting * this.logic.xetHang(lst[2].listCard, 0) * -1 + this.betting * lst[2].listCard.length * -2;
                                totalMoney = money0 + money1 + money2;
                            }
                            break;
                    }
                    
                    obj = lst[i];
                }
            }

            obj.KetThucVanBai(this, 1, totalMoney * -1, anTrang[type]);
            obj.openLstCard();
            if (this.coinsMode != Constant.GameMode.CoinMode) this.btChoiTiep.x = 0;
            setTimeout(() => {
                this.btChoiTiep.active = true;
                // if (this.coinsMode == Constant.GameMode.CoinMode) {
                //     this.btTangCuoc.active = true;
                // } else {
                //     this.btTangCuoc.active = false;
                // }
                this.btTangCuoc.active = true;
            }, this.timer);
            if (obj.indexName == 3) {
                this.playerGame.isWin = true;
                this.playerGame.isRank = 1;
                if (this.coinsMode != Constant.GameMode.CoinMode) {
                    this.playerGame.Point += 3;
                } else {
                    this.playerGame.Money += this.betting * anT;
                }
                this.func.setReport("toiTrang");
            }
        }
        this.active = false;
        // this.btRefresh.active = true;
        if (this.coinsMode != Constant.GameMode.CoinMode) this.updateTable();
    },

    SapXep(listCard) {
        var i = 0;
        while (i < listCard.length) {
            var j = i + 1;
            while (j < listCard.length) {
                if (listCard[i] > listCard[j]) {
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
    SaveListCard(listCard0, listCard1, listCard2, listCard3) {
        if (!listCard0)
        {
            this.computer1.listCard = listCard1;
            this.computer3.listCard = listCard3;
            this.playerGame.listCard = listCard3;
        } else if (!listCard2)
        {
            this.computer0.listCard = listCard0;
            this.computer1.listCard = listCard1;
            this.computer3.listCard = listCard3;
            this.playerGame.listCard = listCard3;
        } else
        {
            this.computer0.listCard = listCard0;
            this.computer1.listCard = listCard1;
            this.computer2.listCard = listCard2;
            //
            this.computer3.listCard = listCard3;
            this.playerGame.listCard = listCard3;
        }
    },
    EndGame3Bich(obj) {
        if (this.coinsMode == Constant.GameMode.CoinMode) this.btRefresh.active = false;
        else this.btChoiTiep.x = 0;
        var money = 0;
        var totalMoney = 0;
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                if (Constant.CurrentGameMode != Constant.GameMode.DemLaMode)
                {
                    this.winMember = 2;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * -2;
                        next.KetThucVanBai(this, 2, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                else if (Constant.CurrentGameMode == Constant.GameMode.DemLaMode)
                {
                    this.winMember = 2;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * next.listCard.length * -2;
                        next.KetThucVanBai(this, 4, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                break;
            case Constant.PLAYER._3:
                if (Constant.CurrentGameMode == Constant.GameMode.CoinMode)
                {
                    this.winMember = 3;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * -2;
                        next.KetThucVanBai(this, 3, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                else if (Constant.CurrentGameMode == Constant.GameMode.NhatAnTatMode)
                {
                    this.winMember = 3;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * -2;
                        next.KetThucVanBai(this, 2, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                else if (Constant.CurrentGameMode == Constant.GameMode.DemLaMode)
                {
                    this.winMember = 3;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * next.listCard.length * -2;
                        next.KetThucVanBai(this, 2, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                break;
            case Constant.PLAYER._4:
                if (Constant.CurrentGameMode == Constant.GameMode.CoinMode)
                {
                    this.winMember = 4;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * -2;
                        next.KetThucVanBai(this, 4, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                else if (Constant.CurrentGameMode == Constant.GameMode.NhatAnTatMode)
                {
                    this.winMember = 4;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * -2;
                        next.KetThucVanBai(this, 4, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                else if (Constant.CurrentGameMode == Constant.GameMode.DemLaMode)
                {
                    this.winMember = 4;
                    // đút 3 bích ăn có xét hàng
                    var next = this.nextObj(obj);
                    var xetHang = 0;
                    var kq = 0;
                    while (next.node.name !== obj.node.name) {
                        xetHang = this.logic.xetHang(next.listCard, 2);
                        money = this.betting * xetHang * -1 + this.betting * next.listCard.length * -2;
                        next.KetThucVanBai(this, 4, money);
                        kq += xetHang;
                        totalMoney += money;
                        next = this.nextObj(next);
                    }
                    obj.KetThucVanBai(this, 1, totalMoney * -1);
                    this.btTuaNhanh.active = false;
                }
                break;
        }
        setTimeout(() => {
            this.btChoiTiep.active = true;
            // if (this.coinsMode == Constant.GameMode.CoinMode) {
            //     this.btTangCuoc.active = true;
            // } else {
            //     this.btTangCuoc.active = false;
            // }
            this.btTangCuoc.active = true;
            cc.log("*Kết thúc ván đút 3 bích*");
        }, this.timer);
    },
    EndGame() {
        if (this.coinsMode == Constant.GameMode.CoinMode) this.btRefresh.active = false;
        else if (this.coinsMode == Constant.GameMode.ScoreMode) this.btChoiTiep.x = 0;
        else if (this.coinsMode == Constant.GameMode.NhatAnTatMode) {
            this.btRefresh.active = false; 
        }
        else if (this.coinsMode == Constant.GameMode.DemLaMode) {
            this.btRefresh.active = false; 
        }
        else {
            this.btChoiTiep.x = 0;
        }
        this.btTuaNhanh.active = false;
        setTimeout(() => {
            this.computer0.xoeBai.remove();
            this.computer1.xoeBai.remove();
            this.computer2.xoeBai.remove();

            this.btChoiTiep.active = true;
            // if (this.coinsMode == Constant.GameMode.CoinMode || this.coinsMode == Constant.GameMode.DemLaMode || Constant.GameMode.NhatAnTatMode) {
            //     this.btTangCuoc.active = true;
            // } else {
            //     this.btTangCuoc.active = false;
            // }
            this.btTangCuoc.active = true;
            cc.log("*Kết thúc ván bài*");

            var tableGame2 = this.func.getData("tableGame2");
            tableGame2.computer3.total = this.func.getTotal();
            tableGame2.computer3.win = this.func.getWin();
            this.func.setData("tableGame2", tableGame2);

        }, this.timer);
        // this.func.setData("tableGame2", this.tableGame2);
    },
    resetVongChoi() {
        //obj đây là người bỏ lượt cuối cùng của vòng đánh
        // nếu obj có đánh bài và chưa bỏ lượt
        this.lastCard = [];
        this.lastCardOld = [];
        this.table.removeAllChildren();
        var lstnextTurn = this.lstnextTurn;
        var length = lstnextTurn.length - 1;
        var next = this.getObjByName(lstnextTurn[length]);
        while (next.isWin && length > 0) {
            length--;
            next = this.getObjByName(lstnextTurn[length]);
        }
        if (next.isWin) {
            next = this.getObjByName(lstnextTurn[lstnextTurn.length - 1]);
            // hưởng sái từ người đánh cuối cùng
            while (next.isWin) {
                next = this.nextObj(next);
            }
        }
        if (this.anHang > 0 && lstnextTurn.length > 1) {
            // chặt bài
            var objAn = this.getObjByName(lstnextTurn[lstnextTurn.length - 1]);
            var objbiAn = this.getObjByName(lstnextTurn[lstnextTurn.length - 2]);
            if (!objbiAn.isWin) {
                // nếu người bị ăn đã về thì không được cộng tiền nữa
                objAn.hienThiCongTien(this, this.betting * this.anHang); // cộng tiền
                objbiAn.hienThiCongTien(this, this.betting * this.anHang * -1); // trừ tiền
            }
            this.anHang = 0;
        }
        setTimeout(() => {
            this.boLuotMember = 0;
            this.playerGame.iconBoLuot.active = false;
            this.computer0.iconBoLuot.active = false;
            this.computer1.iconBoLuot.active = false;
            this.computer2.iconBoLuot.active = false;
            this.playerGame.isBoLuot = false;
            this.computer0.isBoLuot = false;
            this.computer1.isBoLuot = false;
            this.computer2.isBoLuot = false;
            this.lstnextTurn = [];
            if (next == this.playerGame)
                this.effect.scaleNode(next.bgAvatarBanChoi);
            else
                this.effect.scaleNode(next.node.getChildByName("bg_avatar_banchoi"));
            this.updateSound();
            next.DanhBai(this);
        }, this.timer);
    },
    checkWin(obj) {
        this.updateSound();
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                this.checkWin2Nguoi(obj);
                break;
            case Constant.PLAYER._3:
                this.checkWin3Nguoi(obj);
                break;
            case Constant.PLAYER._4:
                this.checkWin4Nguoi(obj);
                break;
        }
    },
    checkWin2Nguoi(obj) {
        var kq = 0;
        var next = this.nextObj(obj);
        var xetHang = 0;
        var money;
        while (next.node.name !== obj.node.name) {
            if (next.listCard.length === 13 && !next.isWin) {
                kq += 3;
                xetHang = this.logic.xetHang(next.listCard, 0);
                switch (this.gameMode)
                {
                    case Constant.GameMode.CoinMode:
                        money = this.betting * (xetHang + 2) * -1;
                        next.KetThucVanBai(this, 3, money);
                        break;
                    case Constant.GameMode.NhatAnTatMode:
                        money = this.betting * (xetHang + 3) * -1;
                        next.KetThucVanBai(this, 3, money);
                        break;
                    case Constant.GameMode.DemLaMode:
                        money = this.betting * xetHang * -1 + this.betting * next.listCard.length * -2;
                        next.KetThucVanBai(this, 3, money);
                        break;
                }
                if (next.isBoLuot) this.boLuotMember -= 1;
                this.winMember += 1;
                kq += xetHang;
            }
            next = this.nextObj(next);
        }
        if (this.winMember > 0 && this.gameMode == Constant.GameMode.CoinMode)
        {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                // đây là thằng còn chưa kết thúc bài
                if (this.winRank == 1) {
                    // là trường hợp bình thường obj về ba và next bét, xét hàng next
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    if (this.coinsMode == Constant.GameMode.CoinMode) {
                        money = this.betting * (xetHang + 1) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                    } 
                }
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.NhatAnTatMode)
        {
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                // đây là thằng còn chưa kết thúc bài
                if (this.winRank == 1) {
                    // obj đã ăn 2 cóng -> còn lại next về nhì, next không được cộng tiền
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    if (this.gameMode) {
                        money = this.betting * (xetHang + 1) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                    }
                }
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.DemLaMode)
        {
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                // đây là thằng còn chưa kết thúc bài
                if (this.winRank == 1) {
                    // obj đã ăn 2 cóng -> còn lại next về nhì, next không được cộng tiền
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    if (this.gameMode) {
                        money = this.betting * (xetHang + next.listCard.length) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                    }
                }
            }
        }
        else {
            // nhất hoặc nhì
            var congTien = 0;
            switch (this.winRank) {
                case 1:
                    congTien = 1;
                    break;
                case 2:
                    congTien = -1;
                    break;
            }
            if (kq == 0) kq = congTien;
        }
        if (this.coinsMode == Constant.GameMode.ScoreMode) this.updateTable();
        else if (this.coinsMode == Constant.GameMode.DemLaMode) {
            obj.KetThucVanBai(this, 1, money * -1);
        } else if (this.coinsMode == Constant.GameMode.CoinMode) {
            obj.KetThucVanBai(this, this.winRank, money * -1);
        } else if (this.coinsMode == Constant.GameMode.NhatAnTatMode)
        {
            obj.KetThucVanBai(this, 1, money * -1);
        }
    },
    checkWin3Nguoi(obj) {
        var kq = 0;
        var next = this.nextObj(obj);
        var xetHang = 0;
        var totalMoney = 0;
        var money = 0;
        var tienHang = null;
        while (next.node.name !== obj.node.name) {
            //Cóng thì sẽ chạy vào đây
            if (next.listCard.length === 13 && !next.isWin) {
                kq += 3;
                xetHang = this.logic.xetHang(next.listCard, 0);
                switch (this.gameMode)
                {
                    case Constant.GameMode.CoinMode:
                        money = this.betting * (xetHang + 3) * -1;
                        next.KetThucVanBai(this, 4, money);
                        break;
                    case Constant.GameMode.NhatAnTatMode:
                        money = this.betting * (xetHang + 3) * -1;
                        next.KetThucVanBai(this, 3, money);
                        break;
                    case Constant.GameMode.DemLaMode:
                        money = this.betting * xetHang * -1 + this.betting * next.listCard.length * -2;
                        next.KetThucVanBai(this, 3, money);
                        break;
                }
                totalMoney += money; 

                if (next.isBoLuot) this.boLuotMember -= 1;
                this.winMember += 1;
                kq += xetHang;
            }
            next = this.nextObj(next);
        }
        if (this.winMember > 1 && this.gameMode == Constant.GameMode.CoinMode)
        {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                // đây là thằng còn chưa kết thúc bài
                if (this.winRank == 1) {
                    // obj đã ăn 2 cóng -> còn lại next về nhì, next không được cộng tiền
                    next.KetThucVanBai(this, 2, 0);
                } else if (this.winRank == 2) {
                    // nhất đã ăn 1 cóng trước đó -> obj về nhì, next về 3 xét hàng next
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang + 2;
                    money = this.betting * kq * -1;
                    if (xetHang != 0)
                    {
                        tienHang = this.betting * xetHang;
                    }
                    else
                    {
                        tienHang = 0;
                    }
                    next.KetThucVanBai(this, 3, money);
                    if (next.node.name == "_PlayerGame") {
                        this.computer3.listCard = this.playerGame.listCard;
                        this.computer3.openLstCard();
                    } else {
                        next.openLstCard();
                    }
                    kq = 0;
                } else {
                    // là trường hợp bình thường obj về ba và next bét, xét hàng next
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 1;
                    money = this.betting * (xetHang + 2) * -1;
                    if (this.coinsMode == Constant.GameMode.CoinMode) {
                        next.KetThucVanBai(this, 4, money);
                    }
                }
                totalMoney += money;
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.NhatAnTatMode)
        {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                while (!next.isWin)
                {
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 1;
                    if (this.gameMode) {
                        money = this.betting * (xetHang + 1) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                        totalMoney += money;
                    }
                    next = this.nextObj(next);
                }
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.DemLaMode)
        {
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                while (!next.isWin)
                {
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 1;
                    if (this.gameMode) {
                        money = this.betting * (xetHang + next.listCard.length) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                        totalMoney += money;
                    }
                    next = this.nextObj(next);
                }
            }
        }
        else {
            // nhất hoặc nhì
            var congTien = 0;
            switch (this.winRank) {
                case 1:
                    congTien = 2;
                    break;
                case 2:
                    congTien = 0;
                    break;
            }
            if (kq == 0) kq = congTien;
        }
        if (this.coinsMode == Constant.GameMode.ScoreMode)
            this.updateTable();
        else if (this.coinsMode == Constant.GameMode.DemLaMode)
        {
            obj.KetThucVanBai(this, 1, totalMoney * -1);
        }
        else if (this.coinsMode == Constant.GameMode.CoinMode)
        {
            if (totalMoney == 0)
            {
                totalMoney = this.betting * -2;
            }
            if (tienHang !== null)
            {
                obj.KetThucVanBai(this, this.winRank, tienHang);
            }
            else
            {
                obj.KetThucVanBai(this, this.winRank, totalMoney * -1);
            }
        }
        else if (this.coinsMode == Constant.GameMode.NhatAnTatMode)
        {
            obj.KetThucVanBai(this, 1, totalMoney * -1);
        }
    },
    checkWin4Nguoi(obj) {
        var kq = 0;
        var next = this.nextObj(obj);
        var xetHang = 0;
        var totalMoney = 0;
        var money = 0;
        var tienHang = null;
        while (next.node.name !== obj.node.name) {
            if (next.listCard.length === 13 && !next.isWin) {
                kq += 3;
                xetHang = this.logic.xetHang(next.listCard, 0);
                switch (this.gameMode)
                {
                    case Constant.GameMode.CoinMode:
                        money = this.betting * (xetHang + 4) * -1;
                        next.KetThucVanBai(this, 5, money);
                        break;
                    case Constant.GameMode.NhatAnTatMode:
                        money = this.betting * (xetHang + 3) * -1;
                        next.KetThucVanBai(this, 3, money);
                        break;
                    case Constant.GameMode.DemLaMode:
                        money = this.betting * (xetHang + next.listCard.length) * -2;
                        next.KetThucVanBai(this, 3, money);
                        break;
                }
                totalMoney += money;
                if (next.isBoLuot) this.boLuotMember -= 1;
                this.winMember += 1;
                kq += xetHang;
            }
            next = this.nextObj(next);
        }
        if (this.winMember > 2 && this.gameMode == Constant.GameMode.CoinMode) {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                // đây là thằng còn chưa kết thúc bài
                if (this.winRank == 1) {
                    // obj đã ăn 2 cóng -> còn lại next về nhì, next không được cộng tiền
                    next.KetThucVanBai(this, 2, 0);
                } else if (this.winRank == 2) {
                    // nhất đã ăn 1 cóng trước đó -> obj về nhì, next về 3 xét hàng next
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang + 1;
                    money = this.betting * kq * -2;
                    next.KetThucVanBai(this, 3, money);
                    if (next.node.name == "_PlayerGame") {
                        this.computer3.listCard = this.playerGame.listCard;
                        this.computer3.openLstCard();
                    } else {
                        next.openLstCard();
                    }
                } else {
                    // là trường hợp bình thường obj về ba và next bét, xét hàng next
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 2;
                    money = this.betting * (xetHang + 3) * -1;
                    tienHang = xetHang * this.betting;
                    if (this.coinsMode == Constant.GameMode.CoinMode) {
                        next.KetThucVanBai(this, 4, money);
                    }
                }
                totalMoney += money;
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.NhatAnTatMode)
        {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                while (!next.isWin)
                {
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 1;
                    if (this.gameMode) {
                        money = this.betting * (xetHang + 1) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                        totalMoney += money;
                    }
                    next = this.nextObj(next);
                }
            }
        }
        else if (this.winMember > 0 && this.gameMode == Constant.GameMode.DemLaMode)
        {
            // kết thúc ván bài
            // xét hàng của thằng bét
            next = this.nextObj(obj);
            while (next.node.name !== obj.node.name && next.isWin) {
                next = this.nextObj(next);
            }
            if (!next.isWin) {
                while (!next.isWin)
                {
                    xetHang = this.logic.xetHang(next.listCard, 0);
                    kq = xetHang - 1;
                    if (this.gameMode) {
                        money = this.betting * (xetHang + next.listCard.length) * -1;
                        next.KetThucVanBai(this, this.winRank + 1, money);
                        totalMoney += money;
                    }
                    next = this.nextObj(next);
                }
            }
        }
        else {
            // nhất hoặc nhì
            var congTien = 0;
            switch (this.winRank) {
                case 1:
                    congTien = 3;
                    break;
                case 2:
                    congTien = 2;   
                    break;
            }

            if (kq == 0)
                kq = congTien;
        }
        if (this.coinsMode == Constant.GameMode.ScoreMode)
            this.updateTable();
        else if (this.coinsMode == Constant.GameMode.DemLaMode)
        {
            obj.KetThucVanBai(this, 1, totalMoney * -1);
        }
        else if (this.coinsMode == Constant.GameMode.CoinMode)
        {
            if (totalMoney == 0)
            {
                totalMoney = this.winMember == 1 ? this.betting * -3 : this.betting * -2;
            }
            if (this.winMember == 3 && this.winRank == 3)
            {
                obj.KetThucVanBai(this, this.winRank, tienHang + this.betting * -2);
                return;
            }
            obj.KetThucVanBai(this, this.winRank, totalMoney * -1);
        }
        else if (this.coinsMode == Constant.GameMode.NhatAnTatMode)
        {
            obj.KetThucVanBai(this, 1, totalMoney * -1);
        }
    },
    getObjByName(objName, isComputer) {
        if (objName === this.computer2.node.name) {
            return this.computer2;
        } else if (objName === this.computer1.node.name) {
            return this.computer1;
        } else if (objName === this.computer0.node.name) {
            return this.computer0;
        } else {
            if (isComputer) {
                return this.computer3
            } else {
                return this.playerGame;
            }
        }
    },
    nextObj(obj) {
        switch (Constant.CurrentPlayer)
        {
            case Constant.PLAYER._2:
                return this.nextObj2Nguoi(obj);
            case Constant.PLAYER._3:
                return this.nextObj3Nguoi(obj);
            case Constant.PLAYER._4:
                return this.nextObj4Nguoi(obj);
        }
    },
    nextObj2Nguoi: function(obj) {
        if (obj.node.name === this.computer1.node.name) {
            return this.playerGame;
        } else {
            return this.computer1;
        }
    },
    nextObj3Nguoi: function(obj) {
        if (obj.node.name === this.computer1.node.name) {
            return this.computer0;
        } else if (obj.node.name === this.computer0.node.name) {
            return this.playerGame;
        } else {
            return this.computer1;
        }
    },
    nextObj4Nguoi: function(obj) {
        if (obj.node.name === this.computer2.node.name) {
            return this.computer1;
        } else if (obj.node.name === this.computer1.node.name) {
            return this.computer0;
        } else if (obj.node.name === this.computer0.node.name) {
            return this.playerGame;
        } else {
            return this.computer2;
        }
    },
    prevObj(obj) {
        if (obj.node.name === this.computer0.node.name) {
            return this.playerGame;
        } else if (obj.node.name === this.computer1.node.name) {
            return this.computer0;
        } else if (obj.node.name === this.computer2.node.name) {
            return this.computer1;
        } else {
            return this.computer2;
        }
    },
    NextTurn(obj) {
        if (this.ketThucAll) {
            return;
        }
        if (this.dut3Bich) {
            // đút 3 bích
            this.EndGame3Bich(obj);
            return;
        }
        if (obj.isWin) {
            this.winMember += 1;
            this.winRank += 1;
            if (this.coinsMode == Constant.GameMode.CoinMode) {
                this.checkWin(obj); // hàm kiểm tra xem có thằng nào chưa đánh dc cây nào ko -> bét xét hàng
            } else if (this.coinsMode == Constant.GameMode.NhatAnTatMode) {
                this.checkWin(obj);
                this.EndGame();
                return;
            } else if (this.coinsMode == Constant.GameMode.DemLaMode)
            {
                this.checkWin(obj);
                this.EndGame();
                return;
            }
            if ((this.winMember > 2 && Constant.CurrentPlayer == Constant.PLAYER._4) || this.gameMode == Constant.GameMode.DemLaMode) {
                this.EndGame(); // đã có 3 người chơi hết bài hoặc --> kết thúc ván bài  
                return;
            } else if ((this.winMember > 1 && Constant.CurrentPlayer == Constant.PLAYER._3) || this.gameMode == Constant.GameMode.DemLaMode) {
                this.EndGame(); // đã có 3 người chơi hết bài hoặc --> kết thúc ván bài  
                return;
            } else if ((this.winMember > 0 && Constant.CurrentPlayer == Constant.PLAYER._2) || this.gameMode == Constant.GameMode.DemLaMode) {
                this.EndGame(); // đã có 3 người chơi hết bài hoặc --> kết thúc ván bài  
                return;
            }

        } else if (obj.isBoLuot) {
            this.boLuotMember += 1;
        }
        var next = this.nextObj(obj);
        while ((next.isWin || next.isBoLuot) && next.node.name !== obj.node.name) {
            next = this.nextObj(next);
        }
        if (next.node.name == obj.node.name && !next.isBoLuot) {
            // người chặn cuối
            setTimeout(() => {
                this.resetVongChoi();
            }, this.timer)
        } else if ((next.isWin || next.isBoLuot || this.boLuotMember + this.winMember > 3 || this.boLuotMember > 2 || this.boLuotMember + this.winMember > 2 && next.node.name == this.lstnextTurn[this.lstnextTurn.length - 1]) && Constant.CurrentPlayer == Constant.PLAYER._4) {
            // có 3 người đã bỏ lượt cần tìm người chưa bỏ lượt và cho đánh bài sau đó reset lại vòng đánh mới
            this.resetVongChoi();
        } else if ((next.isWin || next.isBoLuot || this.boLuotMember + this.winMember > 2 || this.boLuotMember > 1 || this.boLuotMember + this.winMember > 1 && next.node.name == this.lstnextTurn[this.lstnextTurn.length - 1]) && Constant.CurrentPlayer == Constant.PLAYER._3) {
            // có 3 người đã bỏ lượt cần tìm người chưa bỏ lượt và cho đánh bài sau đó reset lại vòng đánh mới
            this.resetVongChoi();
        } else if ((next.isWin || next.isBoLuot || this.boLuotMember + this.winMember > 1 || this.boLuotMember > 0 || this.boLuotMember + this.winMember > 0 && next.node.name == this.lstnextTurn[this.lstnextTurn.length - 1]) && Constant.CurrentPlayer == Constant.PLAYER._2) {
            // có 3 người đã bỏ lượt cần tìm người chưa bỏ lượt và cho đánh bài sau đó reset lại vòng đánh mới
            this.resetVongChoi();
        }
        else {
            if (next == this.playerGame)
                this.effect.scaleNode(next.bgAvatarBanChoi);
            else
                this.effect.scaleNode(next.node.getChildByName("bg_avatar_banchoi"));
            next.DanhBai(this); // như thế là next này vừa chưa win và cũng chưa bỏ lượt
        }
    },
    clickBoLuot(event) {
        event.target.getChildByName("arrow").active = false;
        this.amThanh.bt_click(this.sound);
        this.playerGame.isBoLuot = true;
        this.playerGame.iconBoLuot.active = true;
        this.playerGame.butonEnable();
        //this.btRefresh.active = false;

        this.NextTurn(this.playerGame);
    },
    clickDanhBai(event) {
        // this.amThanh.bt_click(this.sound);
        if (this.playerGame.btDanh.opacity === 255) { // khá ngu :))
            this.playerGame.isBoLuot = false;
            this.playerGame.isTurn = false;
            //this.btRefresh.active = false;
            this.playerGame.clickDanhBai(this);
            this.NextTurn(this.playerGame);
        }
    },

    clickTuaNhanh() {
        this.amThanh.bt_click(this.sound);
        this.timer = 500;
        this.btTuaNhanh.active = false;
    },
    Random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    exitGame() {
        var shadow = cc.find("Canvas/_GameController/shadow");
        shadow.zIndex = cc.macro.MAX_ZINDEX;
        cc.tween(shadow).to(0.1, {opacity: 255}).start();
        this.scheduleOnce(() => {
            var setting = this.func.getData("setting");
            this.sound = setting.sound;
            if(this.sound){
                cc.audioEngine.play(this.soundMp3,false,1);
            }
            this.SaveGame();
            this.amThanh.bt_click(this.sound);
            this.ketThucAll = true;
            this.sound = false;
            this.amThanh.stopAll();
            setTimeout(() => {
                var home = cc.instantiate(this.home);
                this.node.parent.addChild(home);
                this.node.active = false;
                setTimeout(() => {
                    this.node.destroy();
                }, this.timer * 2);
            }, 100);
        }, 0.1);
        var randomAds = Math.floor(Math.random() * 5);
        console.log("randomAds:",randomAds);
        if(randomAds == 0){
            Linker.MySdk.showBanner();
        }
        
    },
    exitGameWhenOutOfMoney() {
        this.SaveGame();
        this.ketThucAll = true;
        this.sound = false;
        this.amThanh.stopAll();
        this.func.setData("coinsMode", false); // het tien
        var home = cc.instantiate(this.home);
        this.node.parent.addChild(home);
        this.node.active = false;
        setTimeout(() => {
            this.node.destroy();
        }, this.timer * 2);

    },
    clickSetting() {
        this.amThanh.bt_click(this.sound);
        this.SaveGame();
        // this.ketThucAll = true;
        this.sound = false;
        this.amThanh.stopAll();
        setTimeout(() => {
            var setting = this.node.parent.getChildByName("_Setting");
            if (setting)
                setting.active = true;
            else
            {
                var setting = cc.instantiate(this.setting);
                setting.getComponent("_SettingNew").parent = "game";
                this.node.parent.addChild(setting);
                // this.node.active = false;
                // setTimeout(() => {
                //     this.node.destroy();
                // }, this.timer * 2);
            }
        }, 100);

    },
    clickTangCuoc() {
        this.amThanh.bt_click(this.sound);
        this.active = false;
        this.khungTienBanChoi.active = false;
        var muaCuoc = cc.find("Canvas/_GameController/_MucCuoc");
        if (muaCuoc)
        {
            muaCuoc.active = true;
            muaCuoc.zIndex = 100;
        }
        else
        {
            muaCuoc = cc.instantiate(this.muaCuoc);
            muaCuoc.zIndex = cc.macro.MAX_ZINDEX;
            this.node.addChild(muaCuoc);
        }
    },
    updateTangCuoc(betting) {
        if (betting) {
            this.betting = betting;
            if (this.betting > 999) {
                this.txtBetting.string = "Cược: $" + this.func.moneyWithFormat(this.betting, ".");
            } else {
                this.txtBetting.string = "Cược: $" +this.betting;
            }
        }
        this.khungTienBanChoi.active = true;
    },
    reSetGame() {
        this.SaveGame();
        this.ketThucAll = true;
        this.updateSound();
        if (this.coinsMode == Constant.GameMode.CoinMode) {
            this.playerGame.Money -= this.betting * 2;
            if (this.playerGame.Money < 0) {
                this.playerGame.Money = 0;
            }
            this.func.setData("coinsMode", false); // chơi xu
        } else {
            // reset lại điểm
            this.computer0.Point = 0;
            this.computer1.Point = 0;
            this.computer2.Point = 0;
            this.computer3.Point = 0;
            this.playerGame.Point = 0;
            this.func.setData("scoreMode", false); // chơi điểm
        }
        this.firstTurn = null;
        this.amThanh.stopAll();
        this.func.SaveDataAll(this, this.computer0, this.computer1, this.computer2, this.playerGame, this.coinsMode);
        if (this.coinsMode == Constant.GameMode.CoinMode && this.playerGame.Money == 0) {
            var home = cc.instantiate(this.home);
            this.node.parent.addChild(home);
            this.node.active = false;
            setTimeout(() => {
                this.node.destroy();
            }, this.timer * 2);
        } else {
            var game = cc.instantiate(this.game);
            this.node.parent.addChild(game);
            setTimeout(() => {
                this.node.destroy();
            }, this.timer * 2);
        }
    },
    SaveGame() {
        this.func.SaveDataAll(this, this.computer0, this.computer1, this.computer2, this.playerGame, this.coinsMode);
    },
    update(dt) {
        if (this.timeUpdate > 100 && !this.ketThucAll) {
            this.timeUpdate = 0;
            this.SaveGame();
        }
        this.timeUpdate++;
    },

    EndGameDemLa(listPlayer, curPlayer) {
        var totalLeftCard = 0;
        for (let player of listPlayer) {
            if (player.listCard.length > 0) {
                totalLeftCard += player.listCard.length;
                player.KetThucVanBai(this, 4, this.betting * player.listCard.length * -1);
            }
        }
        curPlayer.KetThucVanBai(this, 1, this.betting * totalLeftCard);
        this.NextTurn(curPlayer);
    },

    updateGame: function() {
        var setting = this.func.getData("setting");
        var _this = this;
        if (setting)
        {
            cc.resources.load("banchoi/" + setting.avatar, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    _this.playerGame.avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            cc.resources.load("banchoi/" + setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err)
                    _this.node.getChildByName("bt").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    },
    onClickRules: function () {
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var rules = cc.instantiate(this.rulesPrefab);
        rules.opacity = 0;
        this.node.parent.addChild(rules);
    },
    updateSound() {
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
    },
});
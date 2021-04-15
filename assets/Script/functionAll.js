
var tableGame = { 
    computer0 : {
        playerName:"Cường Tỏi",
        urlAvatar :  "avatar_banchoi_01",
        Money : 0,
        Point: 0,
        listCard :  [],
        isBoLuot : false,
        isWin : false,
        isTurn : false,
        isRank : 0
    },
    computer1: {
        playerName:"Cường Tỏi",
        urlAvatar :  "avatar_banchoi_02",
        Money : 0,
        Point: 0,
        listCard :  [],
        isBoLuot : false,
        isWin : false,
        isTurn : false,
        isRank : 0
    },
    computer2: {
        playerName:"Cường Tỏi",
        urlAvatar :  "avatar_banchoi_03",
        Money : 0,
        Point: 0,
        listCard :  [],
        isBoLuot : false,
        isWin : false,
        isTurn : false,
        isRank : 0
    },
    computer3 : {
        playerName:"",
        urlAvatar :  "avatar_banchoi_04",
        Money : 100000,
        Point: 0,
        listCard :  [],
        isBoLuot : false,
        isWin : false,
        isTurn : false,
        isRank : 0,
        total: 0,
        win: 0,
        level: 0
    },
    table : {
        turn: null,
        firstTurn : null,
        lastCard : [],
        lastCardOld : [],
        winRank: 0,
        winMember: 0,
        boLuotMember: 0,
        betting : 1000,
        lstnextTurn : [],
        anHang : 0
    }
};
var setting = {
    language : "vn",
    vn : {
        txtDanh : "Đánh",
        txtBoLuot: "Bỏ Lượt",
        txtTuaNhanh: "Tua Nhanh",
        txtTangCuoc: "Tăng Cược",
        txtChoiTiep:"Chơi tiếp",
    },
    en : {
        txtDanh : "Play",
        txtBoLuot: "Pass",
        txtTuaNhanh: "Fast forward",
        txtTangCuoc: "Raise bet",
        txtChoiTiep:"Continue",  
    },
    sound: true,
    music: true,
    lock: true,  
    level: 0,
    avatar : "avatar_banchoi_04",
    backGround : "back",
    date : null,
    time: null,
    listTable: [
        {
            active: true,
            price: 200000,
            select: true,
            name: "1",
            percent: "3.0 %"
        },
        {
            active: false,
            price: 500000,
            select: false,
            name: "2",
            percent: "4.0 %"
        },
        {
            active: false,
            price: 1000000,
            select: false,
            name: "3",
            percent: "5.0 %"
        },
        {
            active: false,
            price: 2000000,
            select: false,
            name: "4",
            percent: "6.0 %"
        },
        {
            active: false,
            price: 5000000,
            select: false,
            name: "5",
            percent: "7.0 %"
        },
        {
            active: false,
            price: 10000000,
            select: false,
            name: "6",
            percent: "8.0 %"
        },
        {
            active: false,
            price: 20000000,
            select: false,
            name: "7",
            percent: "9.0 %"
        },
        {
            active: false,
            price: 50000000,
            select: false,
            name: "8",
            percent: "10.0 %"
        }
    ],

    unBlockTable: [
        true,  false, false
    ]
};
//1 la co the nhan, 2 la da nhan, 0 la khong duoc nhan
var dailyGift = {
    gift: [
        {
            status: 1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 50000
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 100000
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 150000
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 200000
        },
        {
            status: -1,
            time: null,
            deltaTime: 1800000, //don vi: miliseconds
            nextTime: null,
            money: 1000000
        },
    ],
    today: null,
    consecutiveLogin: {
        count: 1,
        date: null,
        money: 1000000
    },
    get: {
        time: 0,
        xMoney: 1,
        money: 1000000,
    }
}


cc.Class({
    extends: cc.Component,
    ctor(){
        this.coinsMode = null;
    },
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.left = true;
        var tableGame2 = this.getData("tableGame2");
        if (tableGame2)
        {
            this.total = tableGame2.computer3.total;
            this.win = tableGame2.computer3.win;
        }
        else
        {
            this.total = 0;
            this.win = 0;
        }
    },

    onEnable () {
        this.Money = this.getData("tableGame2").computer3.Money;
    },
    onDisable () {
    },
    addTotal(bool) {
        if (bool)
        {
            ++this.total;
        }
    },
    getTotal() {
        return this.total;
    },
    isWin(bool) {
        if (bool)
        {
            ++this.win;
        }
    },
    getWin() {
        return this.win;
    },
    setMoney(money) {
        this.Money = money;
        var tableGame2 = this.getData("tableGame2");
        tableGame2.computer3.Money = this.Money;
        this.callSubmitCore()
        this.setData("tableGame2", tableGame2);
    },
    getMoney() {
        return this.Money;
    },
    start () {
    },
    setData(key, value){
        if (key == "tableGame2" && "undefined" != typeof (sdkbox))
        {
            this.moneyCurrent = value.computer3.Money;
        }
        // lưu dữ liệu
        cc.sys.localStorage.setItem([key],JSON.stringify(value));
    },
    getData( key){
        // lấy dữ liệu
       return JSON.parse(cc.sys.localStorage.getItem([key]));
    },
    removeData(key) {
        cc.sys.localStorage.removeItem(key);
    },
    createTable(){
        var tableGame1 = this.getData("tableGame");
        if (tableGame1)
        {
            return tableGame1;
        }
        else
        {
            this.setData("tableGame",tableGame);
            return tableGame;
        }
    },
    createTable2(){
        var tableGame2 = this.getData("tableGame2");
        if (tableGame2)
        {
            return tableGame2;
        }
        else
        {
            this.setData("tableGame2",tableGame);
            return tableGame;
        }
    },
    createTable3() {
        var tableGame3 = this.getData("tableGame3");
        if (tableGame3)
        {
            return tableGame3;
        }
        else
        {
            this.setData("tableGame3",tableGame);
            return tableGame;
        }
    },
    createSettingData(){
        var setting1 = this.getData("setting");
        if (setting1)
        {
            return setting1;
        }
        else
        {
            this.setData("setting",setting);
            this.setData("scoreMode",false);
            this.setData("coinsMode",false);
            this.setData("demLaMode", false);
            this.setData("nhatAnTatMode", false);
            return setting;
        }
    },
    createDailyGift() {
        var dailyGift1 = this.getData("dailyGift");
        if (dailyGift1)
        {
            return dailyGift1;
        }
        else
        {
            var cur = new Date().toString().split(" ");
            cur[4] = "00:00:00";
            cur = cur.join(" ");
            dailyGift.today = new Date(cur).getTime() + 86400000;
            dailyGift.consecutiveLogin.date = new Date(cur).getTime();
            dailyGift.get.time = Date.now();
            this.setData("dailyGift", dailyGift);
            return dailyGift;
        }
    },
    createReport(){
        var report = {
            thang : 0,
            thua : 0,
            chatHeo : 0,
            toiTrang : 0,
            dutBaBich : 0
        };
        this.setData("report",report);
        return report;
    },
    setReport(type){
        var report = this.getData("report");
        report[type] += 1;
        this.setData("report",report);
    },
    getByName(obj , Name,coinsMode){
        if(coinsMode != null){
            this.coinsMode = coinsMode;
        }
        var tableGame = "tableGame2";
        if(this.coinsMode == "CoinsMode") tableGame = "tableGame2";
        else if (this.coinsMode == "DemLaMode") tableGame = "tableGame2";
        else if (this.coinsMode == "NhatAnTatMode") tableGame = "tableGame2";
        var objName = this.getData(tableGame)[Name];
        if (!objName)
        {
            return;
        }
        if(Name == "table"){
            obj.winMember = objName.winMember;
            obj.boLuotMember = objName.boLuotMember;
            obj.betting = objName.betting;
            obj.winRank = objName.winRank;
            obj.turn = objName.turn;
            obj.firstTurn = objName.firstTurn;
            obj.lastCard = objName.lastCard;
            obj.lastCardOld = objName.lastCardOld;
            obj.lstnextTurn = objName.lstnextTurn;
            obj.anHang = objName.anHang;
            obj.level = this.getData("setting").level;
        }else{
            obj.playerName = objName.playerName;
            obj.Money = objName.Money;
            obj.Point = objName.Point;
            obj.listCard = objName.listCard;
            obj.isBoLuot = objName.isBoLuot;
            obj.isWin = objName.isWin;
            obj.isTurn = objName.isTurn;
            obj.isRank = objName.isRank;
            if(Name == "computer3"){
                obj.urlAvatar = this.getData("setting").avatar;
            }else{
                obj.urlAvatar = objName.urlAvatar;
            }
        }
    },
    SaveDataAll(table, computer0,computer1,computer2,computer3,coinsMode){
   
        tableGame.table.turn = table.turn;
        tableGame.table.firstTurn = table.firstTurn;
        tableGame.table.lastCard = table.lastCard;
        tableGame.table.lastCardOld = table.lastCardOld;
        tableGame.table.winRank = table.winRank;
        tableGame.table.winMember = table.winMember;
        tableGame.table.boLuotMember = table.boLuotMember;
        tableGame.table.betting = table.betting;
        tableGame.table.lstnextTurn = table.lstnextTurn;
        tableGame.table.anHang = table.anHang;

        //
        tableGame.computer0.playerName = computer0.playerName;
        tableGame.computer0.urlAvatar = computer0.urlAvatar;
        tableGame.computer0.Money = computer0.Money;
        tableGame.computer0.Point = computer0.Point;
        tableGame.computer0.listCard = computer0.listCard;
        tableGame.computer0.isBoLuot = computer0.isBoLuot;
        tableGame.computer0.isWin = computer0.isWin;
        tableGame.computer0.isTurn = computer0.isTurn;
        tableGame.computer0.isRank = computer0.isRank;
        //
        tableGame.computer1.playerName = computer1.playerName;
        tableGame.computer1.urlAvatar = computer1.urlAvatar;
        tableGame.computer1.Money = computer1.Money;
        tableGame.computer1.Point = computer1.Point;
        tableGame.computer1.listCard = computer1.listCard;
        tableGame.computer1.isBoLuot = computer1.isBoLuot;
        tableGame.computer1.isWin = computer1.isWin;
        tableGame.computer1.isTurn = computer1.isTurn;
        tableGame.computer1.isRank = computer1.isRank;
        //
        tableGame.computer2.playerName = computer2.playerName;
        tableGame.computer2.urlAvatar = computer2.urlAvatar;
        tableGame.computer2.Money = computer2.Money;
        tableGame.computer2.Point = computer2.Point;
        tableGame.computer2.listCard = computer2.listCard;
        tableGame.computer2.isBoLuot = computer2.isBoLuot;
        tableGame.computer2.isWin = computer2.isWin;
        tableGame.computer2.isTurn = computer2.isTurn;
        tableGame.computer2.isRank = computer2.isRank;
        //
        tableGame.computer3.playerName = computer3.playerName;
        tableGame.computer3.urlAvatar = computer3.urlAvatar;
        tableGame.computer3.Money = computer3.Money;
        tableGame.computer3.Point = computer3.Point;
        tableGame.computer3.listCard = computer3.listCard;
        tableGame.computer3.isBoLuot = computer3.isBoLuot;
        tableGame.computer3.isWin = computer3.isWin;
        tableGame.computer3.isTurn = computer3.isTurn;
        tableGame.computer3.isRank = computer3.isRank;
        //cc.log(tableGame);
        if(coinsMode == "CoinsMode"){
            this.setData("tableGame2",tableGame);
        }else if (coinsMode == "ScoreMode") {
            this.setData("tableGame2",tableGame);
        } else if (coinsMode == "DemLaMode") {
            this.setData("tableGame3", tableGame);
        } else if (coinsMode == "NhatAnTatMode") {
            this.setData("tableGame2", tableGame);
        }
    },
    updateSetting(setting){
        this.setData("setting",setting);
    },
    moneyWithFormat: function (money, formatter) {
        if (!money) {
            return "";
        }
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, formatter)
    },
    // update (dt) {},

    callSubmitCore() {
        var node = cc.find("Canvas/_Home");
        if (!node)
        {
            node = cc.find("Canvas/_GameController");
        }
        var pluginSdkboxPlay = node.getComponent("PluginSdkboxPlay");
        if (pluginSdkboxPlay)
        {
            pluginSdkboxPlay.submitCore(this.moneyCurrent);
        }
    }
});

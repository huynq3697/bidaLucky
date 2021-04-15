
var Linker = require('Linker');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
var CommonSend = require('CommonSend');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        listHistory: cc.Node,
        itemHistory: cc.Prefab,
        scrollView: cc.ScrollView,

        date1Sprite: cc.Sprite,
        date2Sprite: cc.Sprite,
        date3Sprite: cc.Sprite,
        date4Sprite: cc.Sprite,
        date5Sprite: cc.Sprite,

        date1TextNodeButton: cc.Node,
        date2TextNodeButton: cc.Node,
        date3TextNodeButton: cc.Node,
        date4TextNodeButton: cc.Node,
        date5TextNodeButton: cc.Node,
        //
        onDateButtonSpriteFrame: cc.SpriteFrame,
        offDateButtonSpriteFrame: cc.SpriteFrame,

        popupNode: cc.Node,
        quan: cc.Node,
        xu: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.HistoryTab = this;
        this.MaxPage = 1;
        this.CurrentPage = 1;
        this.resetAllButton();
        this.addSocketEvent();
        this.typeMoney = 1; // 1 la quan, 0 la xu
        if (this.quan) { // dung chung script cua vqmm, history user nen phai check
            if (this.typeMoney == 1) {
                this.quan.getChildByName('check').active = true;
                this.xu.getChildByName('check').active = false;
            } else {
                this.quan.getChildByName('check').active = false;
                this.xu.getChildByName('check').active = true;
            }
        } else {
            this.typeMoney = 1;
        }
        this.itemHistoryPool = new cc.NodePool();
        for (let index = 0; index < 20; index++) {
            let item = cc.instantiate(this.itemHistory);
            this.itemHistoryPool.put(item);
        }

    },
    onEnable() {
        cc.Global.showLoading();
        this.setActiveDateButton();
        var request = CommonSend.getHistory(this.CurrentPage, this.typeMoney);
        Linker.Socket.send(request);
        if (cc.find("Loading")) cc.find("Loading").active = true;
        // this.popupNode.scale = 0.1;
        // var that = this;
        // var tweenOpen = cc.tween().call(() => {
        //     that.popupNode.active = true;
        // }).to(0.25, {scale: 1.2}, {easing: "sineOut"}).to(0.15, {scale: 1.0}, {easing: "sineIn"});
        // tweenOpen.clone(this.popupNode).start();
    },
    onDisable: function () {
        this.InitPool();
    },
    start() {
        // this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(14003, this.onGetListHistory, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(14003, this.onGetListHistory, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },

    onCheckBox(event) {
        NewAudioManager.playClick();
        switch (event.currentTarget) {
            case this.quan:
                this.typeMoney = 1;
                this.quan.getChildByName('check').active = true;
                this.xu.getChildByName('check').active = false;
                break;

            case this.xu:
                this.typeMoney = 0;
                this.quan.getChildByName('check').active = false;
                this.xu.getChildByName('check').active = true;
                break;
            default:
                break;
        }
        var request = CommonSend.getHistory(this.CurrentPage, this.typeMoney);
        Linker.Socket.send(request);
    },

    onGetListHistory(message) {
        cc.Global.hideLoading();
        if (message.status == 1) {
            this.createListHistory(message.listHistory);
        }
        if (cc.find("Loading")) cc.find("Loading").active = false;
    },
    createListHistory(array) {
        if (array[0]["matchId"] !== undefined) {
            var that = this;
            if (this.itemHistoryPool.size() == 0) {
                Linker.HistoryTab.listHistory.removeAllChildren();
                array.forEach((element, pos) => {
                    var item = cc.instantiate(Linker.HistoryTab.itemHistory);
                    var ItemEvent = item.getComponent(require('ItemHistoryUser'));
                    item.data = element;
                    item.data.pos = (that.CurrentPage - 1)*array.length + pos + 1;
                    item.data.type = this.typeMoney;
                    if (ItemEvent) {
                        ItemEvent.init();
                    }
                    Linker.HistoryTab.listHistory.addChild(item);
                });
            } else {
                array.forEach((element, pos) => {
                    var item = this.itemHistoryPool.get();
                    if (!item) {
                        item = cc.instantiate(Linker.HistoryTab.itemHistory);
                    }
                    var ItemEvent = item.getComponent(require('ItemHistoryUser'));
                    item.data = element;
                    item.data.pos = (that.CurrentPage - 1)*array.length + pos + 1;
                    item.data.type = this.typeMoney;
                    if (ItemEvent) {
                        ItemEvent.init();
                    }
                    Linker.HistoryTab.listHistory.addChild(item);
                });
            }
        } else {
            Linker.HistoryTab.listHistory.removeAllChildren();
        }
    },
    clickEvent(event) {

    },
    InitPool() {
        var length = Linker.HistoryTab.listHistory.childrenCount;
        for (let index = 0; index < length; index++) {
            this.itemHistoryPool.put(Linker.HistoryTab.listHistory.children[0]);
        }
    },
    nextDate: function (event) {
        NewAudioManager.playClick();
        if (this.CurrentPage > this.MaxPage) {
            this.CurrentPage -= 1;
        } else if (this.CurrentPage < 1) {
            this.CurrentPage = 1;
        }
        this.InitPool();
        var test1 = CommonSend.getHistory(this.CurrentPage, this.typeMoney);
        Linker.Socket.send(test1);
        cc.Global.showLoading();
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    prevDate: function (event) {
        NewAudioManager.playClick();
        this.CurrentPage += 1;
        this.InitPool();
        var test1 = CommonSend.getHistory(this.CurrentPage, this.typeMoney);
        Linker.Socket.send(test1);
        cc.Global.showLoading();
        if (cc.find("Loading")) cc.find("Loading").active = true;
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    getDate: function (number) {
        this.InitPool();
        var test1 = CommonSend.getHistory(number, this.typeMoney);
        Linker.Socket.send(test1);
        cc.Global.showLoading();
        if (cc.find("Loading")) cc.find("Loading").active = true;
    },
    reorderNumberDate: function () {
        //o day phai set lai string hix
        if (this.CurrentPage % 5 == 0) {
            var j = this.CurrentPage;
            for (var i = 0, j; i < 5; i++) {
                var nameid = i + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = j.toString();
                j++;
            }
        } else if (this.CurrentPage < 5) {
            //khoang ban dau
            for (var i = 0; i < 5; i++) {
                var nameid = i + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = nameid.toString();
            }
        } else if (this.CurrentPage % 5 != 0) {
            var rangeValueData = this.getRangeValue();

            var indexArr = 0;
            for (var i = 0; i < rangeValueData.length; i++) {
                var nameid = indexArr + 1;
                var buttonNode = "date" + nameid + "TextNodeButton";
                this[buttonNode].getComponent("cc.Label").string = rangeValueData[i].toString();
                indexArr++;
            }
            
        }
    },
    getRangeValue: function () {
        var maxLimit = this.CurrentPage + 10;
        var minLimit = this.CurrentPage - 10;
        var range = {
            start: 0,
            end: 0
        };
        for (var i = this.CurrentPage; i > minLimit; i--) {
            if (i % 5 == 0) {
                range.start = i;
                break;
            }
        };
        for (var j = this.CurrentPage; j < maxLimit; j++) {
            if (j % 5 == 0) {
                range.end = j;
                break;
            }
        }
        var rangeVData = [];
        for(var k = range.start; k<range.end; k++){
            rangeVData.push(k);
        }
        return rangeVData;
    },
    resetAllButton: function () {
        for (var i = 0; i < 5; i++) {
            var nameid = i + 1;
            var buttonName = "date" + nameid + "Sprite";
            var buttonNode = "date" + nameid + "TextNodeButton";
            this[buttonName].spriteFrame = this.onDateButtonSpriteFrame;
            // this[buttonNode].color = cc.color("#3D200C");
            this[buttonNode].getComponent("cc.Label").string = nameid;
        }
    },
    setActiveDateButton: function () {
        for (var i = 0; i < 5; i++) {
            var nameid = i + 1;
            var buttonName = "date" + nameid + "Sprite";
            var buttonNode = "date" + nameid + "TextNodeButton";
            var stringValue = Number(this[buttonNode].getComponent("cc.Label").string);
            if (stringValue == this.CurrentPage) {
                this[buttonName].spriteFrame = this.offDateButtonSpriteFrame;
                // this[buttonNode].color = cc.color("#FFFF00");
            } else {
                this[buttonName].spriteFrame = this.onDateButtonSpriteFrame;
                // this[buttonNode].color = cc.color("#3D200C");
            }
        }
    },
    dateClick: function (event) {
        NewAudioManager.playClick();
        var ctarget = event.currentTarget;
        var name = ctarget.name;
        switch (name) {
            case "d1":
                var page = Number(this.date1TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();
                break;

            case "d2":

                var page = Number(this.date2TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();
                break;
            case "d3":
                var page = Number(this.date3TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            case "d4":
                var page = Number(this.date4TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            case "d5":
                var page = Number(this.date5TextNodeButton.getComponent(cc.Label).string);
                this.CurrentPage = page;
                this.getDate(page);
                this.setActiveDateButton();

                break;
            default:
                break;
        }
    },

    clickClosePopup () {
        NewAudioManager.playClick();
        // var that = this;
        // var tweenClose = cc.tween().to(0.15, {scale: 1.2}, {easing: "sineOut"}).to(0.25, {scale: 0.1}, {easing: "sineIn"}).call(() => {
        //     that.popupNode.scale = 1;
        //     that.node.active = false; 
        // });
        // tweenClose.clone(this.popupNode).start();
        this.node.active = false;
        this.node.parent.getChildByName("infoPanel").active = true;
    }
    // update (dt) {},
});

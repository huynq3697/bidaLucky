var Linker = require('Linker');
var Utils = require('Utils');
var CommonSend = require('CommonSend');
var Api = require('Api');
var GameConstant = require('GameConstant');
var Global = require('Global');
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
        offDateButtonSpriteFrame: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Linker.historyDialog = this;
        this.MaxPage = 1;
        this.CurrentPage = 1;
        this.resetAllButton();
    },

    onEnable() {
        this.setActiveDateButton();
        this.sendApiHistory();
    },

    sendApiHistory: function () {
        if (this.idGame) {
            var self = this;
            cc.Global.showLoading();
            Api.get(Global.configPurchase.API_URL + "ApiHuRongHistory/myHistory?uid=" + Linker.userData.userId + "&slot=" + this.idGame + "&page=" + this.CurrentPage, (data) => {
                if (data) {
                    self.listHistory.removeAllChildren();
                    self.createListHistory(data);
                }
                cc.Global.hideLoading();
            });
        } else {
            cc.Global.showMessage("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    },

    start () {

    },

    onBtnClose: function () {
        this.node.active = false;
    },
    createListHistory(array) {
        array.forEach((element) => {
            var item = cc.instantiate(this.itemHistory);
            var ItemEvent = item.getComponent(require('ItemHistoryGame'));
            item.data = element;
            if (ItemEvent) {
                ItemEvent.init();
            }
            this.listHistory.addChild(item);
        });
    },
    clickEvent(event) {

    },
    nextDate: function (event) {
        if (this.CurrentPage > this.MaxPage) {
            this.CurrentPage -= 1;
        } else if (this.CurrentPage < 1) {
            this.CurrentPage = 1;
        }
        this.sendApiHistory();this.sendApiHistory();
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    prevDate: function (event) {
        this.CurrentPage += 1;
        this.sendApiHistory();
        this.reorderNumberDate();
        this.setActiveDateButton();
    },
    getDate: function (number) {
        if (number) {
            this.CurrentPage = parseInt(number);
            this.sendApiHistory();
        }
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
    }
    // update (dt) {},
});

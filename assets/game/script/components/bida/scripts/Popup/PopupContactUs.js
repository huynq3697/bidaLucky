var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
var Linker = require('Linker');
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        emailBox: cc.EditBox,
        issueList: cc.Node,
        issueDetail: cc.Label,
        buttonOpenIssueList: cc.Button,
        moreInfoBox: cc.EditBox,
    },

    ctor:function() {
        this.type = null;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.originalLocation = this.issueList.position;
    },
    onEnable () {
        this.reset();
    },
    onDisable () {
        this.reset();
    },

    start () {

    },

    // update (dt) {},

    clickOnIssueList(event, customEventData) {
        NewAudioManager.playClick();
        this.issueDetail.string = event.target.children[1].getComponent(cc.Label).string;
        this.type = customEventData;
        this.closeIssueList();
    },

    openIssueList() {
        NewAudioManager.playClick();
        this.issueList.y = -1*this.issueList.parent.height/2 + this.issueList.height/2;
        var toPosY = -1 * this.issueList.parent.height/2 - this.issueList.height/2;
        this.issueList.active = true;
        var tweenOpen = cc.tween().to(0.5, {y: toPosY}, {easing: "quadIn"});
        tweenOpen.clone(this.issueList).start();
        this.changeFunctionButton("closeIssueList");
    },

    closeIssueList() {
        var toPosY = -1*this.issueList.parent.height/2 + this.issueList.height/2;
        var tweenClose = cc.tween().to(0.5, {y: toPosY}, {easing: "quadOut"}).call(() => {this.issueList.active = false});
        tweenClose.clone(this.issueList).start();
        this.changeFunctionButton("openIssueList");
    },

    changeFunctionButton(callback) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "PopupContactUs";
        clickEventHandler.handler = callback;
        clickEventHandler.customEventData = "";

        this.buttonOpenIssueList.clickEvents.pop();
        this.buttonOpenIssueList.clickEvents.push(clickEventHandler);
    },

    clickClosePopup () {
        NewAudioManager.playClick();
        this.node.active = false;
    },

    clickSendRequest() {
        NewAudioManager.playClick();
        var self = this;
        this.SendRequest(function(err, data) {
            if (!err) {
                cc.Global.showMessage(data.msg);
            }
            self.reset();
        })
    },

    SendRequest(cb) {
        if (this.checkValdEmail() && this.checkValidIssue() ) {
            var url = Linker.Config.APP_API +"ApiFeadback";
            var obj = "?uid=" + Linker.userData.userId + "&username=" + DataAccess.Instance.userData.viewname + "&email=" + this.emailBox.string
            + "&content=" + this.moreInfoBox.string + "&type=" + this.type;
            this.postData(url, obj, function(error, data) {
                if (!error) {
                    if (cb) {
                        cb(null, data);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            })
        } else {
            cc.Global.showMessage(i18n.t("Vui lòng điền đầy đủ thông tin"));
        }
    },
    
    checkValdEmail() {
        if (this.emailBox.string == "" || !this.emailBox.string.includes("@") || !this.emailBox.string.includes(".com") || this.emailBox.string.includes(" ")) {
            return false;
        }
        return true;
    },

    checkValidIssue() {
        if (this.issueDetail.string == "") {
            return false;
        }
        return true;
    },

    reset() {
        this.emailBox.string = "";
        this.issueDetail.string = "";
        this.moreInfoBox.string = "";
        this.issueList.position = this.originalLocation;
    },

    postData(url, obj, cb) {
        var self = this;
        self.postNoJson(url, obj, (data) => {
            var err = null;
            if (data) {
                cb(err, data);
            } else {
                err = "Lỗi không thể load API sự kiện ...";
                cb(err, data);
            }
        });
    },

    postNoJson(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var json = JSON.parse(xhr.responseText);
                cc.log(xhr.responseText);
                if (callback) {
                    callback(json);
                }

            } else {
                //cc.log("ERROR")
            }
        }
        // xhr.send(JSON.stringify(data));
        xhr.send(data);
        cc.log("URL", url, "SENT", data);
    },
});

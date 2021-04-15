var Linker = require('Linker');
var CommonSend = require('CommonSend');
var Api = require('Api');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    ctor () {
        this.username = "";
        this.currentGay = null;
    },

    properties: {
        btnClose: cc.Node,
        contentScrollView: cc.Node,
        itemCuePrefab: cc.Prefab,
        btnCuahang: cc.Node,
        btnKhogay: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.requestDataUser();
        this.addSocketEvent();
        this.btnCuahang.getChildByName("on").active = true;
    },
    onEnable () {
        if (!!this.username) {
            this.getDataListCueStore();
        }
        // this.node.stopAllActions();
        // this.node.setScale(0.3);
        // this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
    },
    requestDataUser: function (){
        DataAccess.Instance.requestUserData();
    },
    onGetUserData: function (message) {
        if (message.userId != Linker.userData.userId) return;
        this.username = message.viewname;
        if (!!this.username) {
            this.getDataListCueStore();
        }
    },
    addSocketEvent() {
        DataAccess.Instance.node.on("update-user-data", this.onGetUserData, this);
    },
    removeSocketEvent() {
        DataAccess.Instance.node.off("update-user-data", this.onGetUserData, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onClickBtn (event) {
        var target = event.currentTarget;
        if (target == this.btnClose) {
            this.node.destroy();
        } else if (target == this.btnCuahang) {
            this.getDataListCueStore();
            this.btnCuahang.getChildByName("on").active = true;
            this.btnKhogay.getChildByName("on").active = false;
        } else if (target == this.btnKhogay) {
            this.getDataListCueKhoGay();
            this.btnCuahang.getChildByName("on").active = false;
            this.btnKhogay.getChildByName("on").active = true;
        } 
    },

    getDataListCueKhoGay () {
        var username = this.username;
        var userId = Number(Linker.userData.userId);
        var data = `uid=${userId}&username=${username}`;
        var url = Linker.Config.APP_API +"/ApiBidaCateCue/listMyCue";
        Api.postNoJson(url, data, (result) => {
            this.showListCue(result, false, true);
        });
    },


    getDataListCueStore () {
        var user = Linker.userData;
        var data = `uid=${user.userId}&viewname=${user.viewname}`;
        var url = Linker.Config.APP_API +"/ApiBidaCateCue";
        Api.postNoJson(url, data, (result) => {
            this.showListCue(result, true, false);
        });
    },

    
    showListCue(result, buy, change) {
        cc.log(result);
        NewAudioManager.PlayUrl(Linker.gameLanguage=="vi"?NewAudioManager.SOUND.VI.OPEN_BUY_CUE:NewAudioManager.SOUND.EN.OPEN_BUY_CUE);
        var data = result.data;
        this.contentScrollView.removeAllChildren(true);
        var childrenListCue = [];
        childrenListCue = this.createListChildNodeByPrefab(data.length,this.itemCuePrefab);
        for (let i = 0; i < childrenListCue.length; i++) {
            var itemCuePrefabJs = childrenListCue[i].getComponent("itemGay");
            if (itemCuePrefabJs) {
                itemCuePrefabJs.init(data[i], buy, change);
            }
        }
        this.addContentToNode(this.contentScrollView, childrenListCue);
    },

    createListChildNodeByPrefab: function (quantity, prefab) {
        var l = [];
        for (let i = 0; i < quantity; i++) {
            var c = cc.instantiate(prefab);
            l.push(c);
        }
        return l;
    },
    addContentToNode: function (node, children) {
        for (let i = 0; i < children.length; i++) {
            node.addChild(children[i]);
        }
    },

    // update (dt) {},
});

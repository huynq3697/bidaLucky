var Api = require('Api');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        itemPrefab: cc.Prefab,
        contentScrollView: cc.Node,
        btnTopDay: cc.Node,
        btnTopWeek: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this.btnTopDay.getChildByName("on").active = true;
        this.btnTopWeek.getChildByName("on").active = false;
    },

    start () {

    },

    onClickBtn (event) {
        var target = event.currentTarget;
        if (target == this.btnClose) {
            this.node.active = false;
        } else if (target == this.btnTopDay) {
            this.getDataListRank(2);
            this.btnTopDay.getChildByName("on").active = true;
            this.btnTopWeek.getChildByName("on").active = false;
        } else if (target == this.btnTopWeek) {
            this.getDataListRank(1);
            this.btnTopDay.getChildByName("on").active = false;
            this.btnTopWeek.getChildByName("on").active = true;
        }
    },

    getDataListRank (param = 2) {
        var data = `type=${param}&lang=${Linker.gameLanguage}`;
        var url = Linker.Config.APP_API +"/ApiTopCharging";
        Api.postNoJson(url, data, (result) => {
            this.showListRank(result);
        });
    },

    
    showListRank(result) {
        this.contentScrollView.removeAllChildren(true);
        var childrenTopNap = [];
        childrenTopNap = this.createListChildNodeByPrefab(result.length,this.itemPrefab);
        for (let i = 0; i < childrenTopNap.length; i++) {
            var itemPrefabJs = childrenTopNap[i].getComponent("itemTopNap");
            if (itemPrefabJs) {
                itemPrefabJs.init(result[i], i + 1);
            }
        }
        this.addContentToNode(this.contentScrollView, childrenTopNap);
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
    update (dt) {

    },
});

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var BiDaOfflineController = require('BiDaOfflineController');
var BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        cheatMenu: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.BiDaOfflineController = BiDaOfflineController.instance;
    },

    // update (dt) {},

    /* ----------------------- BUTTON EVENT CALLBACKS ----------------------- */
    clickPlayer1Win() {
        Linker.BiDaOfflineController.onEndGame(Linker.BiDaOfflineController.tableInfo.listPlayer[0], Linker.BiDaOfflineController.tableInfo.listPlayer[1]);
    },

    clickPlayer2Win() {
        Linker.BiDaOfflineController.onEndGame(Linker.BiDaOfflineController.tableInfo.listPlayer[1], Linker.BiDaOfflineController.tableInfo.listPlayer[0]);
    },

    clickOpenCheatMenu() {
        var click = new ClickCommand(this.cheatMenu);
        click.Execute();
    }
});

var ClickCommand = cc.Class({
    __ctor__(node) {
        this.node = node;
    },

    Execute() {
        this.node.active = !this.node.active;
    }
})
var Global = require('Global');
var CommonSend = require('CommonSend');
var PageHandler = cc.Class({
    extends: cc.Component,

    properties: {
        listPage: cc.Node,
        itemPage: cc.Prefab,
    },

    ctor() {
        this.currentPage = null;
        this.prevPage = null;
        this.pageIndex = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable () {
        if (this.prevPage) {
            this.prevPage.getComponent("itemPage").setDeactivePage();
        }
        this.currentPage = this.listPage.children[0];
        this.currentPage.getComponent("itemPage").setActivePage();
    },

    onDisable: function () {
        this.prevPage = this.currentPage;
        this.pageIndex = 0;
    },

    start() {
        
    },

    setNextPage() {
        this.prevPage = this.currentPage;
        this.currentPage = this.listPage.children[++this.pageIndex % 5];
        this.currentPage.getComponent("itemPage").setActivePage();
        this.prevPage.getComponent("itemPage").setDeactivePage();
        this.reorderNumberPage();
        //#region Gọi hàm cần xử lý khi chuyển page ở đây

        //#endregion
    },

    setPrevPage() {
        if (this.pageIndex > 0) {
            this.prevPage = this.currentPage;
            this.currentPage = this.listPage.children[--this.pageIndex % 5];
            this.currentPage.getComponent("itemPage").setActivePage();
            this.prevPage.getComponent("itemPage").setDeactivePage();
            this.reorderNumberPage();
            //#region Gọi hàm cần xử lý khi chuyển page ở đây

            //#endregion
        }
    },

    setPage(e) {
        var index = Number(e.currentTarget.getComponent(cc.Label).string);
        this.pageIndex = index;
        if (this.pageIndex > 0) {
            this.currentPage = this.listPage.children[--this.pageIndex % 5];
            this.reorderNumberPage();
        }
        this.setActiveListPage(e.currentTarget.parent);
    },

    reorderNumberPage: function () {
        var offset = Math.floor(this.pageIndex / 5);
        var result = 5 * offset;
        for (let index = 0; index < this.listPage.childrenCount; ++index) {
            this.listPage.children[index].getComponent("itemPage").setNumPage(result + index + 1);
        }
    },

    setActiveListPage: function (node) {
        for (var index = 0; index < this.listPage.childrenCount; ++index) {
            if (this.listPage.children[index] == node) {
                this.listPage.children[index].getComponent("itemPage").setActivePage();
            } else {
                this.listPage.children[index].getComponent("itemPage").setDeactivePage();
            }
        }
    }
});

module.exports = PageHandler;
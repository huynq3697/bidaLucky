var Global = {};
Global.KEY_USER_LAST_LOGIN = "LAST_LOGIN";

Global.TypeLogin = {
    Normal: 1,
    Facebook: 2
};

Global.versionName = '';
Global.vNotification = null;
Global.vMiniButton = null;
Global.vToast = null;
Global.vLoading = null;
Global.vTopBar = null;

Global.backToLogin = false;
Global.configHost = {};

Global.IDGame = {
    haila: "2la",
    bala: "3la",
};

Global.IDScene = {
    LOADING: "LoadingScene",
    LOGIN: "LoginScene",
    CHOOSE_GAME: "ChooseGameScene",
    LOBBY: "LobbyScene",
    XOCDIA_BOARD: "XocDiaScene",
};

Global.currScene = "LoadingScene";
Global.Announcement = {
    AnnouncePrefab: null,
    ParentBelongs: null,
    GlobalNodePrefab: null,
    AnnounceNode: null,
    _init: function () {
        if (!this.AnnounceNode || !this.AnnounceNode.isValid) {
            if (this.AnnouncePrefab && this.AnnouncePrefab.isValid) {
                this.AnnounceNode = cc.instantiate(this.AnnouncePrefab);
            } else {
                var urls = ['bida/prefabs/BillardAnnoucement', 'prefabs/LobbyPrefabs/GlobalNode'];
                cc.resources.load(urls, cc.Prefab, function (err, prefabs) {
                    if (!err) {
                        cc.log("Announcement Prefab Loaded ...", prefabs);
                        Global.Announcement.AnnouncePrefab = prefabs[0];
                        Global.Announcement.GlobalNodePrefab = prefabs[1];
                        Global.Announcement.AnnounceNode = cc.instantiate(Global.Announcement.AnnouncePrefab);
                    } else {
                        cc.log("Announcement Prefab Loaded Faild ...", err);
                        Global.Announcement.AnnouncePrefab = null;
                        Global.Announcement.GlobalNodePrefab = null;
                    }
                });
            }
        }
        if (!this.ParentBelongs || !this.ParentBelongs.isValid) {
            this.ParentBelongs = cc.find("Canvas");
        }
        if (this.ParentBelongs && this.ParentBelongs.isValid) {
            if (!this.AnnounceNode || !this.AnnounceNode.parent) {
                for (let i = 0; i < this.ParentBelongs.children.length; i++) {
                    if (this.ParentBelongs.children[i].name == "BillardAnnoucement") {
                        cc.log("destroyed!");
                        this.ParentBelongs.children[i].destroy();
                    }
                }
                this.ParentBelongs.addChild(this.AnnounceNode, cc.macro.MAX_ZINDEX);
            } else {
                this.AnnounceNode.active = true;
            }
        }
        if (this.AnnounceNode && cc.isValid(this.AnnounceNode)) {
            // cc.error("Show loading...");
        }
    },
    _addChild: function (child) {
        this._init();
        var announceNodeComponent = this.AnnounceNode.getComponent("BillardAnnoucement");
        if (announceNodeComponent) {
            announceNodeComponent.addContent(child);
        }
    },
    _showLoading: function (str) {
        this._init();
        if (this.AnnounceNode && this.AnnounceNode.isValid) {
            var announceNodeComponent = this.AnnounceNode.getComponent("BillardAnnoucement");
            if (announceNodeComponent) {
                announceNodeComponent.showLoading(str);
                if (this.timeOutHide) {
                    clearTimeout(this.timeOutHide);
                }
                this.timeOutHide = setTimeout(function () {
                    this._hideLoading();
                }.bind(this), 5000);
            }
        } else {
            cc.log("Can not show loading ...");
        }
    },
    _hideLoading: function () {
        this._init();
        if (this.AnnounceNode && this.AnnounceNode.isValid) {
            var announceNodeComponent = this.AnnounceNode.getComponent("BillardAnnoucement");
            if (announceNodeComponent) {
                announceNodeComponent.hideLoading();
                this._removeAllChild();
                this.AnnounceNode.active = false;
            }
        } else {
            cc.log("Can not hide loading ...");
        }
    },
    _removeAllChild: function () {
        this._init();
        var announceNodeComponent = this.AnnounceNode.getComponent("BillardAnnoucement");
        if (announceNodeComponent) {
            announceNodeComponent.removeAllContent();
        }
    }
};
Global.LoginHandler = {
    IS_REM_PASSWORD: false
}
Global.data = {
    tokenFB: "",
    tablesData: [],
};

Global.MySelf = {
    id: 0,
    money: 0,
    expr: 0,
    chkMail: 0,
    chkEvent: 0,
    alertEmailContent: "",
    alertEmailTitle: "",
    isPhoneUpdate: false,
    displayName: "",
    avatar: "",
    isPayment: false,
    isActive: false,
};

Global.XocDiaMini = {
    soundData: {}
};
Global.avatarAtlas = {};
Global.ASSETMANAGE = {
    SCENES: {}
}
module.exports = Global;
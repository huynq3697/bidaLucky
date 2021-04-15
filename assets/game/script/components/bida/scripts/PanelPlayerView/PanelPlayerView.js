
var BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        itemPlayerView: cc.Prefab,
        listPlayerNode: cc.Node,

    },
    resetContentNode: function () {
        this.listPlayerNode.removeAllChildren(true);
    },
    onCloseButton: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.PANEL_PLAYER_VIEW.CLOSE, true);
        this.node.dispatchEvent(customEvent);
    },
    removePlayerById: function (id) {
        id = parseInt(id);
        if (isNaN(id) == false) {
            for (let i = 0; i < this.listPlayerNode.children.length; i++) {
                var player = this.listPlayerNode.children[i];
                var playerJs = player.getComponent("itemPlayerView");
                if (playerJs) {
                    if (playerJs.getUserID() == id) {
                        player.removeFromParent(true);
                    }
                }
            }
        }
    },
    getPlayerById: function (id) {
        var players = [];
        id = parseInt(id);
        if (isNaN(id) == false) {
            for (let i = 0; i < this.listPlayerNode.children.length; i++) {
                var player = this.listPlayerNode.children[i];
                var playerJs = player.getComponent("itemPlayerView");
                if (playerJs) {
                    if (playerJs.getUserID() == id) {
                        players.push(player);
                    }
                }
            }
        }
        return players;
    },
    getAllUserViewing: function () {
        var listPlayers = [];
        var listPlayersWithData = [];
        var listPlayersWithIds = [];
        for (let i = 0; i < this.listPlayerNode.children.length; i++) {
            var player = this.listPlayerNode.children[i];
            var playerJs = player.getComponent("itemPlayerView");
            if (playerJs && cc.isValid(playerJs) && cc.isValid(player)) {
                var id = parseInt(playerJs.getUserID());
                if (isNaN(id) == false && id != 0) {
                    if (listPlayersWithIds.indexOf(id) == -1) {
                        listPlayers.push(player);
                        listPlayersWithData.push({
                            userAvatarFrame: playerJs.getUserAvatarFrame(),
                            userMoney: playerJs.getUserMoney(),
                            userName: playerJs.getUserName(),
                            userID: id,
                            userNationFrame: playerJs.getNationFrame(),
                            userCountryId: playerJs.getUserCountryId(),
                            userLevel: playerJs.getUserLevel(),
                            isMaster: false,
                            waitingStatus: false,
                            isReady: playerJs.getReady()
                        });
                        listPlayersWithIds.push(id);
                    }
                }
            }
        }
        return { listPlayers: listPlayers, listPlayersWithData: listPlayersWithData, listPlayersWithIds: listPlayersWithIds };
    },
    addExistPlayerToViewSit: function (data) {
        //them nguoi choi voi chuc nang co san
        this.removePlayerById(Number(data.userID));
        var player = cc.instantiate(this.itemPlayerView);
        this.listPlayerNode.addChild(player);
        var playerCmp = player.getComponent("itemPlayerView");
        if (playerCmp && playerCmp.isValid == true) {
            playerCmp.initExist(data);
        } else {
            player.removeFromParent(true);
        }

    },
    addPlayerToViewSit: function (data) {
        this.removePlayerById(Number(data.userId));
        var player = cc.instantiate(this.itemPlayerView);
        this.listPlayerNode.addChild(player);
        var playerCmp = player.getComponent("itemPlayerView");
        if (playerCmp && playerCmp.isValid == true) {
            playerCmp.init(data);
        } else {
            player.removeFromParent(true);
        }
    }
});

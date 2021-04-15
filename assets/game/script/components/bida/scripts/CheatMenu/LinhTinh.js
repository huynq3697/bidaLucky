var Linker = require('Linker');

cc.Class({
    extends: cc.Component,

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        player1: cc.Node,
        avatarPlayer1: cc.Sprite,
        player2: cc.Node,
        avatarPlayer2: cc.Sprite
    },
    runRandomPlayerAvatar: function () {
        this.loadGameNow = true;
    },
    start: function () {
        this.isLoadedBefore = true;
        this.loadStartNow = true;
    },
    update(dt) {
        // this.currentTime += dt;
        // if (this.currentTime >= 0.15) {
        //     ++this.otherPlayerIdAvatar;
        //     if (this.otherPlayerIdAvatar > 15) {
        //         this.otherPlayerIdAvatar = 1;
        //     }
        //     this.avatarPlayer2.spriteFrame = this.getFrameById(this.avatarAtlas, this.otherPlayerIdAvatar);
        //     this.currentTime = 0;
        // }
        if (this.loadGameNow && this.loadStartNow) {
            this.loadStartNow = false;
            this.isLoadOfflineGame = false;
            this.listAvatar = [];
            this.otherPlayerIdAvatar = null;
            this.currentTime = 0;
            this.avatarPlayer2.unscheduleAllCallbacks();
            this.listAvatar = this.avatarAtlas.getSpriteFrames();
            cc.log("this.listAvatar", this.listAvatar);
            if (Linker.userData) {
                this.avatarPlayer1.spriteFrame = this.getFrameById(this.avatarAtlas, Number(Linker.userData.avatar));
            } else {
                this.avatarPlayer1.spriteFrame = this.getFrameById(this.avatarAtlas, 1);
            }
            var _this = this;
            cc.director.preloadScene("BiDaOffline", function (completedCount, totalCount, item) {
                var percent = completedCount / totalCount;
            }, function (err, data) {
                if (!err) {
                    _this.node.active = true;
                    _this.node.opacity = 255;
                    var i = 0;
                    var count = 0;
                    _this.otherPlayerIdAvatar = Math.floor((Math.random() * 15) + 1);
                    Linker.otherPlayerIdAvatar = _this.otherPlayerIdAvatar;
                    var self = _this;
                    _this.avatarPlayer2.schedule(function (dt) {
                        i++;
                        count++;
                        if (i > 15) {
                            i = 1;
                        }
                        self.avatarPlayer2.spriteFrame = self.getFrameById(self.avatarAtlas, i);
                        if (count >= self.otherPlayerIdAvatar) {
                            self.avatarPlayer2.unscheduleAllCallbacks();
                            self.loadOfflineGame();
                        }
                    }, 0.15, _this.otherPlayerIdAvatar);
                } else {
                    cc.log("Không thể load lại game offline lỗi xảy ra...");
                }
            });
        }
    },
    loadOfflineGame: function () {
        if (this.isLoadOfflineGame == false) {
            this.isLoadOfflineGame = true;
            cc.log("Load scene offline");
            cc.director.loadScene('BiDaOffline', () => {
                var gameTable = cc.find("Canvas/BillardsGameTable");
                if (gameTable) {
                    var gameTableComponent = gameTable.getComponent("BiDaOfflineController");
                    if (gameTableComponent) {
                        gameTableComponent.initGameOffline()
                    }
                }
            });
        }
    },
    getFrameById: function (atlas, id) {
        if (!atlas) {
            return null;
        }
        var idframe = Number(id);
        if (isNaN(idframe)) {
            idframe = 1;
        }
        var frame = atlas.getSpriteFrame("avatar (" + idframe + ")");
        if (!frame) {
            frame = atlas.getSpriteFrame("avatar (1)");
        }
        return frame;
    }
});

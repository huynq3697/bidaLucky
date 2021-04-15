var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        GBallRaillingPrefab: cc.Prefab,
        RailChuaBiNode: cc.Node,
        VitriBatDauDatBi: {
            default: cc.v2(-41, 180),
            readonly: true
        },
        Pocket: cc.Node
    },
    ctor: function () {
        this.delayTime = 0;
    },
    onLoad: function () {
        // this.removeAllBiInBag();
        this.dataBallPrevious = null;
    },
    removeAllBiInBag: function () {
        this.dataBallPrevious = null;
        this.Pocket.removeAllChildren(true);
    },
    themMotBiRoiXuongLo: function (data) {
        if (this.dataBallPrevious === data.id) {
            return;
        }
        this.dataBallPrevious = data.id;
        cc.log("___________Them mot bi roi xuong lo", data.id);
        var self = this;
        if (this.checkDuplicated(this.Pocket, data.id) == false && this.checkDuplicated(this.RailChuaBiNode, data.id) == false) {
            this.scheduleOnce(function () {
                if (self.checkDuplicated(self.Pocket, data.id) == false && self.checkDuplicated(self.RailChuaBiNode, data.id) == false) {
                    var aBi = cc.instantiate(self.GBallRaillingPrefab);
                    aBi.position = cc.v2(0, 0);
                    var aBiJS = aBi.getComponent("GBallRailing");
                    self.RailChuaBiNode.addChild(aBi);
                    if (aBiJS) {
                        data.realParent = self.Pocket;
                        aBiJS.initGballRailing(data);
                    } else {
                        cc.log("Khong the them bi da roi vao lo ...", aBi, aBiJS);
                    }
                }
            }, this.delayTime);
            this.delayTime += 0.5;
            this.scheduleOnce(() => { self.delayTime = 0 }, 1);
        }
    },
    addHardListBiInRail: function (listBi) {
        cc.log("hard list", listBi);
        for (let i = 0; i < listBi.length; i++) {
            var b = cc.instantiate(this.GBallRaillingPrefab);
            var bjs = b.getComponent("GBallRailing");
            if (bjs) {
                var data = {
                    idBi: listBi[i]
                }
                bjs.initHard(data);
                this.Pocket.addChild(b);
            }
        }
    },
    removeBallWithId: function (id) {
        //xoa parent
        for (var i = 0; i < this.RailChuaBiNode.children.length; i++) {
            var ballJS = this.RailChuaBiNode.children[i].getComponent("GBallRailing");
            if (ballJS && ballJS.getIdBi() == id) {
                this.RailChuaBiNode.children[i].destroy();

            }
        }
        //xoa layout
        for (var j = 0; j < this.Pocket.children.length; j++) {
            var ballJS = this.Pocket.children[j].getComponent("GBallRailing");
            if (ballJS && ballJS.getIdBi() == id) {
                this.Pocket.children[j].removeFromParent(true);
            }
        }
    },
    checkDuplicated(target, id) {
        for (let i = 0; i < target.children.length; i++) {
            let b = target.children[i];
            let bjs = b.getComponent("GBallRailing");
            if (bjs) {
                let idBi = bjs.getIdBi();
                if (isNaN(parseInt(idBi)) == false) {
                    if (idBi == id) {
                        cc.log("Duplicated, khong duoc them...");
                        return true;
                    }
                }

            }
        };
        return false;
    },
    checkListRailBi: function (newListBi) {
        var oldListBi = [];
        for (var i = 0; i < this.Pocket.children.length; i++) {
            var ballJS = this.Pocket.children[i].getComponent("GBallRailing");
            if (ballJS) {
                oldListBi.push(ballJS.getIdBi());
            }
        }
        for (var j = 0; j < this.RailChuaBiNode.children.length; j++) {
            var ballJS = this.RailChuaBiNode.children[j].getComponent("GBallRailing");
            if (ballJS) {
                oldListBi.push(ballJS.getIdBi());
            }
        }
        var isSameArray = Utils.Malicious.isArraySameArray(oldListBi, newListBi);
        if ((oldListBi.length != newListBi.length) || !isSameArray) {
            this.removeAllBiInBag();
            this.addHardListBiInRail(newListBi);
        }else{
            // cc.error("khong xoa")
        }
    },
    update(dt) {

    },
});

var BiDaConstant = require('BiDaConstant');
var Linker = require("Linker");
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        blockNode: cc.Node,
        handNode: cc.Node,
        confirmNode: cc.Node,
    },
    start() {
        if (this.data) {
            var data = this.data;
            this.node.position = data.position;
            this.blockNode.opacity = 0;
            this.confirmNode.active = false;
            this.validPosition = this.node.position;
            this.allposcurrentinvalid = data.allposcurrentinvalid;
            this.bounderx = data.bounder.x;
            this.boundery = data.bounder.y;
            this.bidaTableComponent = data.bidaTableComponent;
            if (data.isBegin) {
                this.whiteBackCollider = data.boxCollider;
                this.whiteBackBounderX = data.bounder._xBegin;
                this.whiteBackBounderY = data.bounder._yBegin;
                
            }
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
            this.node.name = data.name;
            this.blocked = data.blocked;
            if (this.blocked) {
                this.onActiveBlock();
            } else {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.NGUOI_CHOI_KHAC_DANG_CHON_VI_TRI_DAT_BI_CAI, true);
                customEvent.pos = this.node.position;
                this.node.dispatchEvent(customEvent);
                //thêm một block tạm thời sau đó xóa đi
                this._tmpBlockInputEventComponent = Utils.Malicious.addNewBlockInputEventNode(this.node.parent);
                if (this._tmpBlockInputEventComponent && cc.isValid(this._tmpBlockInputEventComponent)) {
                    Utils.Malicious.setMaxZindex(this.node.parent, this._tmpBlockInputEventComponent.node);
                    this._tmpBlockInputEventComponent.enabled = true;
                }
                Utils.Malicious.setMaxZindex(this.node.parent, this.node);
                //cho phép drag bóng trắng
                if (this.bidaTableComponent) {
                    this.bidaTableComponent.unBlockCueRotation();
                }
                this.onDeactiveBlock();
                this.confirmNode.active = true;
            }
            this.node.on(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_NGUOI_DUNG_THAY_DOI_VI_TRI_BI_TRANG, this.onDeactiveBlock, this);
            this.node.on(BiDaConstant.GAME_TABLE_EVENT.KHONG_CHO_PHEP_NGUOI_DUNG_THAY_DOI_VI_TRI_BI_TRANG, this.onActiveBlock, this);
            this.node.on(BiDaConstant.GAME_TABLE_EVENT.DA_DAT_XONG_VI_TRI_BI_TRANG, this.onFinishReposition, this);
            this.node.on(BiDaConstant.GAME_TABLE_EVENT.DANG_DAT_LAI_VI_TRI_BI_TRANG_TMP_TU_SERVER, this.onTmpPosition, this);
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                this.scheduleOnce(this.autoPickPosition, 10);//10s tu dong dat bi trang
            }
        }
    },
    initWBall: function (data) {
        if (data) {
            this.data = data;
        }
    },
    onTmpPosition: function (pos) {
        if (this && this.isValid && this.node && this.node.isValid) {
            this.node.position = pos;
        }
    },
    onDeactiveBlock: function () {
        this.blocked = false;
        this.node.opacity = 255;
    },
    onActiveBlock: function () {
        this.blocked = true;
        this.node.opacity = 200;
    },
    autoPickPosition: function () {
        this.validPosition = this.node.position;
        this.guiToaDoYeuCauPosBiTrang()
    },
    onTouchStart: function (event) {
        if (this.blocked) {
            return;
        }
        this.blockNode.opacity = 0;
        this.confirmNode.active = false;
        this.checkLocationNow(event);
    },
    onTouchMove: function (event) {
        if (this.blocked) {
            return;
        }
        this.confirmNode.active = false;
        this.checkLocationNow(event);
    },
    checkLocationNow: function (event) {
        //check position
        var location = event.getLocation();
        var locNode = this.node.position;
        var locationNodeSpace = this.node.parent.convertToNodeSpaceAR(location);
        var exLoc = locNode.sub(locNode.sub(locationNodeSpace));
        if (this.checkValidPosWhiteBall(this.allposcurrentinvalid, exLoc)) {
            if (
                exLoc.x >= this.bounderx.start &&
                exLoc.x <= this.bounderx.end &&
                exLoc.y >= this.boundery.start &&
                exLoc.y <= this.boundery.end && this.checkWhiteBackBegin(event)
            ) {
                this.node.position = exLoc;
                this.validPosition = exLoc;
                this.blockNode.opacity = 0;
            } else {
                this.blockNode.opacity = 255;
                this.validPosition = null;
            }
        } else {
            this.validPosition = null;
            this.blockNode.opacity = 255;
        }
    },
    checkWhiteBackBegin: function (event) {
        if (this.whiteBackCollider) {
            var loc = event.getLocation();
            if (cc.Intersection.pointInPolygon(loc, this.whiteBackCollider.world.points)) {
                return true;
            } else {
                return false;
            }
        } else {
            //khong phai la bat dau tran dau
            return true;
        }
    },
    checkValidPosWhiteBall: function (positions, pos) {
        var valid = true;
        for (var i = 0; i < positions.length; i++) {
            var width = positions[i].width;
            var height = positions[i].height;
            var rectA = new cc.Rect(positions[i].pos.x - (width * 0.5), positions[i].pos.y - (height * 0.5), width, height);
            var rectB = new cc.Rect(pos.x - (width * 0.5), pos.y - (height * 0.5), width, height);
            if (rectA.intersects(rectB)) {
                valid = false;
            }
        }
        return valid;
    },
    onTouchEnd: function (event) {
        if (this.blocked) {
            return;
        }
        if (!this.validPosition) {
            this.blockNode.opacity = 255;
        } else {
            this.confirmNode.active = true;
            this.blockNode.opacity = 0;
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.NGUOI_CHOI_KHAC_DANG_CHON_VI_TRI_DAT_BI_CAI, true);
            customEvent.pos = this.validPosition;
            this.node.dispatchEvent(customEvent);
        }
    },
    onTouchCancle: function (event) {
        this.onTouchEnd();
    },
    onButtonOkClick: function () {
        this.unschedule(this.autoPickPosition);
        if (this.validPosition) {
            this.guiToaDoYeuCauPosBiTrang();
        } else {
            // cc.log("Vui long chon lai vi tri bi trang, vi tri hien tai khong hop le ...");
        }

    },
    guiToaDoYeuCauPosBiTrang: function () {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.YEU_CAU_DAT_LAI_BI_CAI, true);
        customEvent.position = this.validPosition;
        customEvent._isValidPushWhiteBall = true;
        this.node.dispatchEvent(customEvent);
        //ban su kien cho phep dat bi
        this.onFinishReposition();
    },
    onFinishReposition: function () {
        if (this && this.isValid && this.node && this.node.isValid) {
            if (this._tmpBlockInputEventComponent && cc.isValid(this._tmpBlockInputEventComponent)) {
                this._tmpBlockInputEventComponent.node.destroy();
            }
            this._tmpBlockInputEventComponent = null;
            if (this.bidaTableComponent && cc.isValid(this.bidaTableComponent)) {
                this.bidaTableComponent.unBlockTouchEvent();
            }
            this.node.destroy();
        }
    }
});

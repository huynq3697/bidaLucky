var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        redPointWhiteBall: cc.Node,
        whiteBall: cc.Node
    },
    onLoad() {
        //
        this.node.getComponent(cc.Widget).target = cc.find("Canvas");
        //type mode click
        this.chooseRange = cc.Enum({
            WHITE_BALL_RANGE: 0,
            BACKGROUND_RANGE: 1
        });
        this.node.opacity = 0;
        
        this.whiteBall.setAnchorPoint(cc.v2(0.5, 0.5));
        this.choosingRange = this.chooseRange.BACKGROUND_RANGE;
        this.initView();
        this.registerTouchHandler();
    },
    onEnable: function(){
        this.redPointWhiteBall.position = cc.v2(0, 0);
        this.sendPullForce();
    },
    registerTouchHandler: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded, this);
    },
    onTouchBegan: function (touch) {
        var curPos = this.node.convertToNodeSpaceAR(touch.getLocation());
        var circleX = this.whiteBall.position.x;
        var circleY = this.whiteBall.position.y;
        if (Math.sqrt((curPos.x - circleX) * (curPos.x - circleX) + (curPos.y - circleY) * (curPos.y - circleY)) < this.whiteBall.width * 0.5 - 30) {
            this.redPointWhiteBall.position = this.whiteBall.convertToNodeSpaceAR(curPos);
            this.choosingRange = this.chooseRange.WHITE_BALL_RANGE;
            // this.onTouchMoved(touch);
            // cc.log("dang click vao bi trang")
        } else {
            this.choosingRange = this.chooseRange.BACKGROUND_RANGE;
            // cc.log("dang click ngoai bi trang")
        }
    },
    onTouchMoved: function (touch) {
        if (this.choosingRange == this.chooseRange.WHITE_BALL_RANGE) {
            var curPos = this.node.convertToNodeSpaceAR(touch.getLocation())
            var circleX = this.whiteBall.position.x;
            var circleY = this.whiteBall.position.y;
            if (Math.sqrt((curPos.x - circleX) * (curPos.x - circleX) + (curPos.y - circleY) * (curPos.y - circleY)) > (this.whiteBall.width * 0.5 - 30)) {
                let pos = touch.getLocation();
                let wballPos = this.whiteBall.parent.convertToWorldSpaceAR(this.whiteBall.position);
                let radius = pos.sub(wballPos).mag();
                let radiusMax = this.whiteBall.width * 0.5 - (this.redPointWhiteBall.width);
                if (radius >= radiusMax) {
                    radius = radiusMax;
                }
                let v = pos.sub(wballPos);
                let nPos = wballPos.add(v.normalize().mul(radius));
                this.redPointWhiteBall.position = this.whiteBall.convertToNodeSpaceAR(nPos);

            } else {
                this.redPointWhiteBall.position = this.whiteBall.convertToNodeSpaceAR(curPos);
            }
        }
    },
    sendPullForce: function () {
        var _posX = this.redPointWhiteBall.position.x / (this.whiteBall.width * 0.5 - 35);
        var _posY = this.redPointWhiteBall.position.y / (this.whiteBall.width * 0.5 - 35);
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.SET_LUC_PULL_BI_TU_WHITE_BALL_VIEW, true);
        customEvent._pos = cc.v2(_posX, _posY);
        this.node.dispatchEvent(customEvent);
    },
    onTouchEnded: function (touch) {
        NewAudioManager.playClick();
        switch (this.choosingRange) {
            case this.chooseRange.WHITE_BALL_RANGE:
                this.sendPullForce();
                break;
            case this.chooseRange.BACKGROUND_RANGE:
                this.clearWithEffect();
                break;
            default:
                break;
        }
    },
    clearWithEffect: function () {
        this.node.active = true;
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(0.2),
                cc.callFunc(function () {
                    this.sendPullForce();
                    this.node.parent.active = false;
                    this.node.parent.removeAllChildren(true);
                }.bind(this))
            )
        )
    },
    initView: function () {
        this.node.position = cc.v2(0, 0);
        this.node.parent.active = true;
        this.node.active = true;
        this.node.runAction(
            cc.fadeIn(0.1)
        )
    }
    // update (dt) {},
});

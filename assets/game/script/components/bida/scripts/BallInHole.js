var BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        RollingNode: cc.Node,
        Ball: cc.Node,
        maskC: cc.Mask
    },
    getIdBi: function () {
        return this.idBi;
    },
    setIdBi: function (id) {
        this.idBi = id;
    },
    init: function (data) {
        if (data) {
            this.data = data;
        }
    },
    start: function () {
        if (this && this.node && cc.isValid(this) && cc.isValid(this.node)) {
            if (this.data) {
                this.maskC.enabled = false;
                this.node.position = this.data.pos;
                var _GballRailingScript = this.Ball.getComponent("GBallRailing");
                if (_GballRailingScript) {
                    //set material
                    _GballRailingScript.setMaterial3DBall(this.data.id);
                    _GballRailingScript.ball3DNode.eulerAngles = cc.v3(Utils.Number.random(0, 180), Utils.Number.random(0, 180), Utils.Number.random(0, 180));
                }
            }
        }
    },
    runBallInHole: function (data) {
        var timeStep1 = 0.25;
        var timeStep2 = 0.5;
        this.Ball.position = this.Ball.parent.convertToNodeSpaceAR(data.startPoint);
        data.destination.holeColiderPosition = this.Ball.parent.convertToNodeSpaceAR(data.destination.holeColiderPosition);
        data.destination.disappearPosition = this.Ball.parent.convertToNodeSpaceAR(data.destination.disappearPosition);
        this.maskC.enabled = false;
        var _GballRailingScript = this.Ball.getComponent("GBallRailing");
        if (_GballRailingScript) {
            //set material
            _GballRailingScript.setMaterial3DBall(data.idBi);
            this.RollingNode.active = true;
            var rigid3D = this.RollingNode.getComponent(cc.RigidBody3D);
            if (rigid3D) {
                var velocity = data.linearVelocity;
                var angularVelocity = data.angularVelocity;
                var rotation3D = cc.v3(
                    - velocity.y,
                    velocity.x,
                    angularVelocity
                );
                var rotation3D2 = cc.v3(
                    -rotation3D.x,
                    rotation3D.y,
                    rotation3D.z
                );
                rotation3D.mulSelf(5);
                rotation3D.divSelf(100);
                rigid3D.setAngularVelocity(rotation3D);
                this.Ball.runAction(
                    cc.sequence(
                        cc.moveTo(timeStep1, data.destination.holeColiderPosition),
                        cc.callFunc(function () {
                            this.maskC.enabled = true;
                        }.bind(this)),
                        cc.spawn(
                            cc.moveTo(timeStep2, data.destination.disappearPosition),
                            cc.scaleTo(timeStep2, 0.7),
                            cc.callFunc(function () {
                                rigid3D.setAngularVelocity(rotation3D2);
                            }.bind(this))
                        ),
                        cc.callFunc(function () {
                            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.BALL_IN_HOLE_FINISH_ANIMATION, true);
                            customEvent.idBi = data.idBi;
                            customEvent.fx_position = this.node.position;
                            this.node.dispatchEvent(customEvent);
                            this.node.destroy();
                        }.bind(this))
                    )
                )
            }

        }
    }

    // update (dt) {},
});

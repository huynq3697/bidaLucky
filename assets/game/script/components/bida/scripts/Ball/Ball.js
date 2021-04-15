var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        rigidBody: cc.RigidBody,
        blurNode: cc.Node,
        tip: cc.Node,
        shadow: cc.Node,
        ball3DMaterial: cc.Material,
        ball3DMeshRendered: cc.RenderComponent,
        ball3DTextTureArr: {
            type: cc.Texture2D, // use 'type:' to declare an array of Texture2D objects
            default: []
        },
        ball3DNode: cc.Node,
        bong: cc.Node,
    },
    onLoad: function () {
        this.stopTipFx();
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
    },
    getMaterial3DBall: function () {
        if (this.ball3DMeshRendered && this.ball3DMeshRendered.isValid) {
            return this.ball3DMeshRendered.getMaterial();
        }
        return null;
    },
    setMaterial3DBall: function (idBi) {
        idBi = parseInt(idBi);
        if (isNaN(idBi) == true) {
            idBi = this.idBi;
        }
        if (this.ball3DMeshRendered && this.ball3DMeshRendered.isValid) {
            var _material = this.ball3DMeshRendered.getMaterial(0);
            if (idBi >= 0 && idBi <= this.ball3DTextTureArr.length - 1) {
                _material.setProperty("diffuseTexture", this.ball3DTextTureArr[idBi]);
            }
        }
    },
    runTipFx: function () {
        if (this.tip && this.tip.isValid) {
            this.tip.opacity = 0;
            this.tip.scale = 0;
            this.tip.active = true;
            this.tip.stopAllActions();
            this.tip.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.spawn(
                            cc.fadeIn(1.5),
                            cc.scaleTo(1.5, 1.05)
                        ),
                        cc.spawn(
                            cc.fadeOut(2.5),
                            cc.scaleTo(2.5, 0.5)
                        )
                    )
                )
            )
        }
    },
    stopTipFx: function () {
        if (this.tip && this.tip.isValid) {
            this.tip.opacity = 0;
            this.tip.scale = 0;
            this.tip.active = true;
            this.tip.stopAllActions();
        }
    },
    checkBallHitByTarget: function (nodeAC, nodeBC, ballTarget) {
        if (ballTarget && Array.isArray(ballTarget) && ballTarget.length > 0) {
            var idBiList = [nodeAC.getIdBi(), nodeBC.getIdBi()];
            for (let k = 0; k < idBiList.length; k++) {
                if (ballTarget.indexOf(idBiList[k]) != -1) {
                    return true;
                }
            }
        }
        return false;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.tag == BiDaConstant.PHYSIC_TAGS.BALL && otherCollider.tag == BiDaConstant.PHYSIC_TAGS.BALL) {
            //bong va cham voi bong
            var nodeA = selfCollider.node;
            var nodeB = otherCollider.node;
            var nodeAC = nodeA.getComponent("Ball");
            var nodeBC = nodeB.getComponent("Ball");
            if (nodeAC && nodeBC) {
                //xet xem id muc tiêu có va chạm với bất cứ bi nào không
                var _table = this.node.parent;
                if (_table && cc.isValid(_table)) {
                    var _desk = _table.parent;
                    if (_desk && cc.isValid(_desk)) {
                        var _deskScript = _desk.getComponent("Desk");
                        if (_deskScript) {
                            var ballTarget = _deskScript.getListMyBallTarget();
                            if (this.checkBallHitByTarget(nodeAC, nodeBC, ballTarget)) {
                                //đã va chạm với một trong bất kỳ bi mục tiêu của bạn
                                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_MOT_BI_BAT_KY, true);
                                this.node.dispatchEvent(customEvent);
                                console.error("va cham ne")
                            }
                            var ballBotTarget = _deskScript.getListBallBotTarget();
                            if (this.checkBallHitByTarget(nodeAC, nodeBC, ballBotTarget)) {
                                //đã va chạm với một trong bất kỳ bi mục tiêu của bạn
                                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_MOT_BI_BAT_KY_BOT, true);
                                this.node.dispatchEvent(customEvent);
                            }

                            //check va cham khi choi 2 bi lucky shot
                            if (nodeAC.idBi !== 0 && nodeBC.idBi !== 0) {
                                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_BI_8_LUCKY_SHOT, true);
                                this.node.dispatchEvent(customEvent);
                            }
                        }
                    }
                }
                //nếu bi mục tiêu rơi mà không chạm bi nào thì
                var tempV = nodeAC.rigidBody.linearVelocity;
                var velocityA = Math.abs(tempV.x) + Math.abs(tempV.y)
                tempV = nodeBC.rigidBody.linearVelocity;
                var velocityB = Math.abs(tempV.x) + Math.abs(tempV.y)
                var force = (velocityA + velocityB) / 2;
                this.playSoundBallFx(nodeAC.getIdBi(), force, this.BallHit, 1, false);
            }
        }
    },
    playSoundBallFx: function (idBi, force, audiosource, volume, loop) {
        if (force) {
            if (force > 1000) {
                volume = 1.0;
            } else {
                volume = force / 1000;
            }
            if (isNaN(force)) {
                volume = 1;
            }
        }
        if (!volume) {
            volume = 1;
        }
        NewAudioManager.playEffectBallHit(idBi, audiosource, volume, loop);
    },
    start: function () {
        if (this && this.node && cc.isValid(this) && cc.isValid(this.node)) {
            var data = this.data;
            if (data) {
                // this.rigidBody.awake = false;
                this.rigidBody3D = this.ball3DNode.getComponent(cc.RigidBody3D);
                if (this.rigidBody3D && cc.isValid(this.rigidBody3D) && this.rigidBody3D._body && this.rigidBody3D._body._rigidBody && this.rigidBody3D._body._sharedBody) {
                    this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
                    this.node.getComponent(cc.PhysicsCircleCollider).tag = BiDaConstant.PHYSIC_TAGS.BALL;
                    this.node.position = data.pos;
                    this.idBi = data.id;
                    this.node.name = "ball_" + this.idBi;
                    this.mode = data.mode;
                    this.init({ color_tag: data.color_tag });
                    this.node.zIndex = BiDaConstant.ZINDEX.ball;
                    this.setMaterial3DBall(this.idBi);
                    this.ball3DNode.is3DNode = true;
                    if (this.data.ball3dAngle) {
                        this.ball3DNode.eulerAngles = this.data.ball3dAngle;
                    } else {
                        this.ball3DNode.eulerAngles = cc.v3(Utils.Number.random(0, 180), Utils.Number.random(0, 180), Utils.Number.random(0, 180));
                    }

                    this.rigidBody3D.setAngularVelocity(cc.v3(0.0, 0.0, 0.0));
                    this.rigidBody3D.setLinearVelocity(cc.v3(0, 0, 0));
                    this.activeGayBanBiByBallId();
                    if (this.idBi == 0 && data.isReposition) {
                        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.HIEN_CUE_KHI_BI_TRANG_BI_ROI_XUONG_LO, true);
                        this.node.dispatchEvent(customEvent);
                    }
                } else {
                    // this.node.destroy();
                }
            }
        }

    },
    initBall: function (data) {
        this.loadAudioSource();
        this.data = data;
        this.idBi = data.id;
        this.node.name = "ball_" + this.idBi;
        this.node.position = data.pos;
        this.init({ color_tag: data.color_tag });
        return this.node;
    },
    init: function (data) {
        if (this.mode && this.mode == BiDaConstant.PLAY_MODE.ONLINE) {
            this.myUserId = Linker.userData.userId;
        } else {
            this.myUserId = 6789;
        }
        this.turnUserId = null;
        if (!data.color_tag) {
            this.setColorTag(BiDaConstant.COLOR_TAG.ME);
        } else {
            this.setColorTag(data.color_tag);
        }

    },
    setColorTag: function (color) {
        this.color_tag = color;
    },
    activeGayBanBiByBallId: function (id) {
        if (!id && isNaN(id)) {
            id = this.idBi;
        }
        switch (id) {
            case 0:
                this.configBiTrang();
                break;
            default:
                this.configBian();
                break;
        }
    },
    configBiTrang: function () {
        //config color tag
        this.setColorTag(BiDaConstant.COLOR_TAG.WHITE_BALL);
        //config vat ly        
        this.configPhysics();
        //end config vat ly
        var cue = this.node.parent.getChildByName("CueObj");
        if (cue && cc.isValid(cue)) {
            cue.position = this.node.position;
        }
    },
    configBian: function () {
        //config color tag
        this.setColorTag(BiDaConstant.COLOR_TAG.ME);
        //config vat ly
        this.configPhysics();
        //end config vat ly
    },
    getIdBi: function () {
        return this.idBi;
    },
    getColorTag: function () {
        return this.color_tag;
    },
    configPhysics: function (id) {
        if (!id && isNaN(id)) {
            id = this.idBi;
        }
        switch (id) {
            case 0:
                this.fixedRotation = false;
                this.rigidBody.allowSleep = true;
                this.rigidBody.linearDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballLinearDamping;
                this.rigidBody.gravityScale = 1;
                this.rigidBody.angularDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballAngularDamping;
                this.rigidBody.bullet = true;
                this.rigidBody.awakeOnLoad = true;
                this.physicsCircleCollider = this.rigidBody.getComponent(cc.PhysicsCircleCollider);
                if (this.physicsCircleCollider) {
                    this.physicsCircleCollider.density = BiDaConstant.PHYSICS.BALLS.PHYSIC.ballDensity;
                    this.physicsCircleCollider.friction = BiDaConstant.PHYSICS.BALLS.PHYSIC.whiteBallFiction;
                    this.physicsCircleCollider.restitution = BiDaConstant.PHYSICS.BALLS.PHYSIC.ballRestiution;

                }
                break;
            default:
                this.fixedRotation = false;
                this.rigidBody.allowSleep = true;
                this.rigidBody.linearDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballLinearDamping;
                this.rigidBody.gravityScale = 1;
                this.rigidBody.angularDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballAngularDamping;
                this.rigidBody.bullet = true;
                this.rigidBody.awakeOnLoad = true;
                this.physicsCircleCollider = this.rigidBody.getComponent(cc.PhysicsCircleCollider);
                if (this.physicsCircleCollider) {
                    this.physicsCircleCollider.density = BiDaConstant.PHYSICS.BALLS.PHYSIC.ballDensity;
                    this.physicsCircleCollider.friction = BiDaConstant.PHYSICS.BALLS.PHYSIC.ballFriction;
                    this.physicsCircleCollider.restitution = BiDaConstant.PHYSICS.BALLS.PHYSIC.ballRestiution;
                }
                break;
        }
        this.isRolling = false;

    },
    checkIsStop: function () {
        if (cc.isValid(this.node) && cc.isValid(this)) {
            var velocity = this.rigidBody.linearVelocity;
            var angularVelocity = this.rigidBody.angularVelocity;
            var v = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            if (v <= 10) {
                return true;
            }
        }
        return false
    },
    // update: function (dt) {},
    sendToaDoBi: function () {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.LUCKY_SHOT_EVENT.SEND_COORD_BI, true);
        customEvent.detail = {
            position: this.node.position,
            radius: this.node.getComponent(cc.PhysicsCircleCollider).radius
        }
        this.node.dispatchEvent(customEvent);
    },
    loadAudioSource: function () {
        var audioS = this.node.getComponents(cc.AudioSource);
        if (audioS) {
            for (let i = 0; i < audioS.length; i++) {
                var nClip = audioS[i].clip.name;
                this[nClip] = audioS[i];
            }
        }
    },
    setShadowBall: function () {
        var lightPos = cc.v2(480, 280);
        var maxDeltaAnchorX = 0.09;
        var maxDeltaAnchorY = 0.09;
        var maxDeltaX = 200;
        var maxDeltaY = 150;
        var deltaX = lightPos.x - this.node.x;
        var deltaY = lightPos.y - this.node.y;
        var isLeft = (this.node.x < lightPos.x) ? true : false;
        var isBottom = (this.node.y < lightPos.y) ? true : false;
        if (Math.abs(deltaX) > maxDeltaX) {
            this.bong.anchorX = (isLeft) ? 0.5 + maxDeltaAnchorX : 0.5 - maxDeltaAnchorX;
        } else {
            var deltaAnchorRatioX = maxDeltaAnchorX * Math.abs(deltaX) / maxDeltaX ;
            this.bong.anchorX = (isLeft) ? 0.5 + deltaAnchorRatioX : 0.5 - deltaAnchorRatioX;
        }
        if (Math.abs(deltaY) > maxDeltaY) {
            this.bong.anchorY = (isBottom) ? 0.5 + maxDeltaAnchorY : 0.5 - maxDeltaAnchorY;
        } else {
            var deltaAnchorRatioY = maxDeltaAnchorY * Math.abs(deltaY) / maxDeltaY ;
            this.bong.anchorY = (isBottom) ? 0.5 + deltaAnchorRatioY : 0.5 - deltaAnchorRatioY;
        }
    }
});

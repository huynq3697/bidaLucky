var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');

cc.Class({
    extends: cc.Component,

    properties: {
        rigidBody: cc.RigidBody,
        rigidBody3D: cc.RigidBody3D,
        blurNode: cc.Node,
        ball3DMaterial: cc.Material,
        ball3DMeshRendered: cc.RenderComponent,
        ball3DTextTureArr: {
            type: cc.Texture2D, // use 'type:' to declare an array of Texture2D objects
            default: []
        },
        ball3DNode: cc.Node
    },
    onLoad: function () {
        this.stopTipFx();
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
        this.tip = this.node.getChildByName("tip");
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
                            cc.scaleTo(1.5, 1.1)
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
        this.tip = this.node.getChildByName("tip");
        if (this.tip && this.tip.isValid) {
            this.tip.opacity = 0;
            this.tip.scale = 0;
            this.tip.active = true;
            this.tip.stopAllActions();
        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.tag == BiDaConstant.PHYSIC_TAGS.BALL && otherCollider.tag == BiDaConstant.PHYSIC_TAGS.BALL) {
            //bong va cham voi bong
            var nodeA = selfCollider.node;
            var nodeB = otherCollider.node;
            // var nodeAC = nodeA.getComponent("Ball");
            // var nodeBC = nodeB.getComponent("Ball");
            var nodeAC = nodeA.getComponent("Ball3D");
            var nodeBC = nodeB.getComponent("Ball3D");
            if (nodeAC && nodeBC) {
                var tempV = nodeAC.rigidBody.linearVelocity;
                var velocityA = Math.abs(tempV.x) + Math.abs(tempV.y)
                tempV = nodeBC.rigidBody.linearVelocity;
                var velocityB = Math.abs(tempV.x) + Math.abs(tempV.y)
                var force = (velocityA + velocityB) / 2;
                this.playSoundBallFx(force, this.BallHit, 1, false);
            }
        }
    },
    playSoundBallFx: function (force, audiosource, volume, loop) {
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
        NewAudioManager.playEffectADS(audiosource, volume, loop);
    },
    initBall: function (data) {
        this.loadAudioSource();
        this.node.getComponent(cc.PhysicsCircleCollider).tag = BiDaConstant.PHYSIC_TAGS.BALL;
        this.node.position = data.pos;
        this.idBi = data.id;
        this.node.name = "ball_" + this.idBi;
        this.mode = data.mode;
        this.init();
        this.node.zIndex = BiDaConstant.ZINDEX.ball;
        // this.node.parent = data.parent;
        this.activeGayBanBiByBallId();
        // this.ball3DNode = ;
        // this.
        // Texture3D:setRotation3D(cc.vec3(math.random(0,180),math.random(0,180),math.random(0,180)))
        //         rigidBody:setAngularVelocity(cc.vec3(0.0, 0.0, 0.0))
        return this.node;
    },
    init: function () {
        if (this.mode && this.mode == BiDaConstant.PLAY_MODE.ONLINE) {
            this.myUserId = Linker.userData.userId;
            this.turnUserId = null;
        } else {
            this.myUserId = 6789;
        }
        this.turnUserId = null;
        this.setColorTag(BiDaConstant.COLOR_TAG.ME);
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
                this.rigidBody.awakeOnLoad = false;
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
        var _velocity = this.rigidBody.linearVelocity;
        if (Math.abs(_velocity.x) > BiDaConstant.PHYSICS.BALLS.RIGID.ballVelocityLimit
            || Math.abs(_velocity.y) > BiDaConstant.PHYSICS.BALLS.RIGID.ballVelocityLimit) {
            return false
        } else if (Math.abs(_velocity.x) == BiDaConstant.PHYSICS.BALLS.RIGID.ballVelocityLimit
            && Math.abs(_velocity.y) == BiDaConstant.PHYSICS.BALLS.RIGID.ballVelocityLimit) {
            return true
        }
        return false
    },
    loadAudioSource: function () {
        var audioS = this.node.getComponents(cc.AudioSource);
        if (audioS) {
            for (let i = 0; i < audioS.length; i++) {
                var nClip = audioS[i].clip.name;
                this[nClip] = audioS[i];
            }
        }
    }

    // update (dt) {},
});

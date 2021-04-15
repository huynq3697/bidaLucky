var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,
    properties: {

    },
    onLoad: function () {
        this.loadAudioSource();
        this.init();
    },
    init: function () {
        var holes = this.node.getComponents(cc.PhysicsCircleCollider);
        for (let i = 0; i < holes.length; i++) {
            holes[i].tag = BiDaConstant.PHYSIC_TAGS.HOLE;
        }
        var walls = this.node.getComponents(cc.PhysicsPolygonCollider);
        for (let j = 0; j < walls.length; j++) {
            walls[j].tag = BiDaConstant.PHYSIC_TAGS.WALL;
            walls[j].density = BiDaConstant.PHYSICS.TABLE.PHYSIC.borderDensity;
            walls[j].friction = BiDaConstant.PHYSICS.TABLE.PHYSIC.borderFriction;
            walls[j].restitution = BiDaConstant.PHYSICS.TABLE.PHYSIC.borderRestiution;
        }

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
    //listener su kien va cham bi
    onBeginContact(contact, selfCollider, otherCollider) {
        if (selfCollider.tag === BiDaConstant.PHYSIC_TAGS.HOLE && otherCollider.tag === BiDaConstant.PHYSIC_TAGS.BALL) {
            // tag 2 = circle
            // tag 0 = wall
            // tag 1 = ball
            var ball = otherCollider.node;
            var ballJs = ball.getComponent("Ball");
            if (ballJs) {
                cc.log("BD: Bi roi xuong lo ...", ballJs.getIdBi());
                //play audio bi
                if (this.Pocket) {
                    NewAudioManager.playEffectADS(this.Pocket, 1, false);
                }
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.CO_BI_ROI_XUONG_LO, true);
                customEvent.positionBall = otherCollider.node.position;
                customEvent.holeColider = selfCollider;
                customEvent.idBi = ballJs.getIdBi();
                customEvent.linearVelocity = ballJs.rigidBody.linearVelocity;
                customEvent.angularVelocity = ballJs.rigidBody.angularVelocity;
                otherCollider.node.removeFromParent(true);
                otherCollider.node.destroy();
                this.node.dispatchEvent(customEvent);
            }
        }
    }
})

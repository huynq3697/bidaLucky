// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        ballInHoleParticle: cc.ParticleSystem,
    },
    runEffectStar: function () {
        this.ballInHoleParticle.resetSystem();
        this.ballInHoleParticle.node.active = true;
        this.ballInHoleParticle.node.opacity = 255;
    },
    onFinishEffectStar: function () {
        this.node.destroy();
    },
    start: function () {
        var animation = this.node.getComponent(cc.Animation);
        if (animation) {
            animation.play("ball_in_hole_fx");
        }
    }
});

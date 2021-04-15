

cc.Class({
    extends: cc.Component,
    ctor(){
        this.sound = true;
    },
    properties: {
        musicMp3 : {
            default : null,
            type : cc.AudioClip
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.audioEngine.play(this.musicMp3,false,1);
        this.node.runAction(cc.rotateBy(0.1,360));
    },

    // start () {

    // },
    // update (dt) {},
});

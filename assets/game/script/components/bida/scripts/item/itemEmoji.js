const path_animation = "bida/anim/emoji";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {},

    start() {

    },

    // update (dt) {},

    setKey(key) {
        this.key = key;
    },

    setSpriteFrame(spriteFrame) {
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    setClip(idClip) {
        var clipName = "Clip" + idClip;
        var clip = cc.Global.findClip(clipName);
        clip.speed = 0.2;
        this.node.getComponent(cc.Animation).addClip(clip);
        this.node.getComponent(cc.Animation).play(clipName);
        this.setKey(clipName);
    },

    getKey() {
        return this.key;
    },


    /* ----------------------- BUTTON EVENT ---------------------- */
    onClickButton(event, customEventData) {
        switch (customEventData) {
            case 'emoji': {
                // gán key emoji vào chat box => emit event
                var string = this.key;
                var eventDispatch = new cc.Event.EventCustom('content-emoji', true);
                eventDispatch.chat = string;
                this.node.dispatchEvent(eventDispatch);
                break;
            }
        }
    }
});
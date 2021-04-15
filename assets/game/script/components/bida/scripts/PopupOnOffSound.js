var Linker = require('Linker');

var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        checkedAmThanh: cc.Toggle,
        checkedNhacNen: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
        }, this);
    },

    onEnable () {
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        this.userData = Linker.Local.readUserData();
        if (this.userData) {
            this.checkedAmThanh.isChecked = this.userData.isSound;
            this.checkedNhacNen.isChecked = this.userData.isMusic;
        }

    },

    clickClosePopupOnOffSound () {
        this.node.active = false;
    },

    clickBtnOnOffAmThanh (toggle) {
        this.userData.isSound = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        if(toggle.isChecked) {
            NewAudioManager.muteSound(false);
        } else{
            NewAudioManager.muteSound(true);
        }
    },

    clickBtnOnOffNhacNen (toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        if(toggle.isChecked) {
            NewAudioManager.playBackground(NewAudioManager.sound.background);
        } else{
            NewAudioManager.stopSoundBackground();
        }
    },
    start () {

    },

    update (dt) {

    },
});

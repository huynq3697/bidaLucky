var PopupDisplay = require('PopupDisplay');
var DataManger = require('DataManger');
var i18n = require('i18n');
var Linker = require('Linker');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
var PopupShowManager = require('PopupShowManager');
cc.Class({
    extends: PopupDisplay,

    properties: {
        soundToggle: cc.Toggle,
        musicToggle: cc.Toggle,
    },

    // onLoad () {},

    start () {
        this.musicToggle.isChecked = DataManger.UserData.getMusic();
        this.soundToggle.isChecked = DataManger.UserData.getSound();
    },

    onEnable() {

    },

    onMusicToggle(event){
        var isMusic = event.isChecked;
        DataManger.UserData.setMusic(isMusic);
        NewAudioManager.playBackground();
    },

    onSoundToggle(event) {  
        var isSound = event.isChecked;
        DataManger.UserData.setSound(isSound);
        NewAudioManager.playClick();
    },

    onBtnExit() {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupExit();
    }
    // update (dt) {},
});

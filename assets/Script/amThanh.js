// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        musicMp3 : {
            default : null,
            type : cc.AudioClip
        },
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        aDu : {
            default : null,
            type : cc.AudioClip
        },
        win : {
            default : null,
            type : cc.AudioClip
        },
        lose : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai0 : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai1 : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai2 : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai3 : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai4 : {
            default : null,
            type : cc.AudioClip
        },
        amDanhBai5 : {
            default : null,
            type : cc.AudioClip
        },
        heoNe : {
            default : null,
            type : cc.AudioClip
        },
        doiHeoNe : {
            default : null,
            type : cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    playMusic(music){
        if(music){
            cc.audioEngine.play(this.musicMp3,true,0.7);
        }
    },
    bt_click(sound){
        if(sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
    },
    stopAll(){
        cc.audioEngine.stopAll();
    },
    chanBai(max){
        if(this.Random(0,max) === 0){
            var lst = [this.amDanhBai0,this.amDanhBai1,this.amDanhBai2,this.amDanhBai3,this.amDanhBai4,this.amDanhBai5];
            var index = this.Random(0,lst.length);
            cc.audioEngine.play(lst[index],false,1);
        }
    },
    Random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    // update (dt) {},
});

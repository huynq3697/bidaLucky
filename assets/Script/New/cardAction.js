var functionAll = require("functionAll");
cc.Class({
    extends: cc.Component,
    ctor(){
        this.value  = 0;
        this.action = false;
        this.sound = true;
    },
    properties: {
        card: cc.Node,
        whiteCard: cc.Node,
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        func: functionAll,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    //     var setting = this.func.getData("setting");
    //     this.sound = setting.sound;
    // },

    start () {
    },
    click(){
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        var playerGame = this.card.parent.getComponent('_PlayerGame');
        if(playerGame){
            playerGame.checkCardPlayer(this.value);
            if(this.action){
                this.card.runAction(cc.moveTo(0.1,this.node.parent.x,-220));    
                //this.whiteCard.active = true;    
    
            }else{
                if(this.sound){
                    cc.audioEngine.play(this.soundMp3,false,1);
                }
                this.card.runAction(cc.moveTo(0.1,this.node.parent.x,-180));
                //this.whiteCard.active = false;   
            }
            this.action = !this.action;
        }

    },

    // update (dt) {},
});

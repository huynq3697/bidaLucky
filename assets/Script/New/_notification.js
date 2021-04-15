

cc.Class({
    extends: cc.Component,
    ctor(){
        this.sound = true;
    },
    properties: {
        txtNo: cc.Label,
        txtYes: cc.Label,
        txtNotification : cc.Label,
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var gameController = this.node.parent.getChildByName("_GameController").getComponent("_GameController");
        if(gameController){
            this.sound = gameController.sound;
            if(gameController.coinsMode){
                var txt = gameController.betting * 2;
                if(txt > 999){
                    txt = parseInt(txt/1000) + "K";
                }
                if(gameController.language == "vn"){
                    this.txtNotification.string = "Nếu hủy ván chơi\nbạn sẽ bị trừ " + txt + " Xu";
                }else{
                    this.txtNotification.string = "Are you sure?\nyou will be subtracted " + txt + " coins";
                }
            }else{
                if(gameController.language == "vn"){
                    this.txtNotification.string = "Bạn có chắc muốn\nhủy ván chơi?";
                }else{
                    this.txtNotification.string = "Are you sure?";
                }
            }
            if(gameController.language == "vn"){
                this.txtYes.string = "Có";
                this.txtNo.string = "Không";
            }else{
                this.txtYes.string = "Yes";
                this.txtNo.string = "No";
            }
        }
    },

    start () {

    },
    clickNo(){
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var gameController = this.node.parent.getChildByName("_GameController");
        if(gameController){
            gameController.getComponent("_GameController").btRefresh.active = true;
        }
        this.node.destroy();
    },
    clickYes(){
        if(this.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        var gameController = this.node.parent.getChildByName("_GameController");
        if(gameController){
            gameController.getComponent("_GameController").reSetGame(); // thiết lập lại giá trị cược
        }
        this.node.destroy();
    }
    // update (dt) {},
});

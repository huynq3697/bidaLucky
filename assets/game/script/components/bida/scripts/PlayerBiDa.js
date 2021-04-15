
cc.Class({
    ctor() {
        this.point = 0;
        this.isWin = 0;
        this.rank = 0;
        this.takenCount = 0;
        this.timeResume = 20;
        this.userId;
        this.viewName = "zeptest";
        this.userMoney = 0;
        this.state = 0;
        this.isMaster = 0;
        this.isOut = 0;
        this.exp = 0;
        this.avatarId = "1";
        this.isReady = 0;
        this.isObserver = 0;

    },
    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    
    },

    start() {

    },
    create(data) {
        
    },
    resetPlayer() {
        this.point = 0;
        this.isHaPhom = 0;
        this.isTai = 0;
        this.isMom = 0;
        this.needHaPhom = 0;
        this.isWin = 0;
        this.rank = 0;
        this.takenCount = 0;
        this.timeResume = 20;
        this.userId;
        this.viewName = "zeptest";
        this.userMoney = 0;
        this.state = 0;
        this.isMaster = 0;
        this.isOut = 0;
        this.exp = 0;
        this.avatarId = "1";
        this.phomList = [];
        this.takenCardList = [];
        this.turnedCardList = [];
        this.cardOwnerList = [];
    }

    // update (dt) {},
});

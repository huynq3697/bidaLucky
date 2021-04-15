var AT = cc.Enum({
    OK: 0,
    OK_CANCEL: 1,
    OK_CANCEL_BUTTON: 2
});
window.G = {
    AT: AT,
    userInfo: {},
    entityID: -1,
    rotationDelta: 20,
    gameStartTime: -1,
    accountType: -1,
    code: null,
    openID: null,
    alert: function (msg, type, okCallback, cancelCallback) {
        if(this.globalNode){
            this.globalNode.alert(msg, type, okCallback, cancelCallback);
        }
        
    },

    loading: function () {
        if(this.globalNode){
            this.globalNode.loading();
        }
        
    },

    print: function (msg) {
        if(this.globalNode){
            this.globalNode.print(msg);
        }
        
    },
}

module.exports = {
    debugMode: false,
    //logonHost: "ws://192.168.0.100",
   
    speed: 50,
}

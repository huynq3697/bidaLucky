var Constant = require('Constant');
var Linker = require('Linker');
var vqmmSend = cc.Class({

    sendRequest(str) {
        var data = { r: []};
        data.r.push({v: str});

        this.send(JSON.stringify(data));
    },

    send(message) {
        cc.log('SEND_DATA:'+message);
        Linker.Socket.send(message);
    },
    sendGetValuesVQMM() {
        var str = Constant.CMD.CONFIG_DATA;
        
        this.sendRequest(str);
    },
    sendGetLog(page = 1) {
        var str = Constant.CMD.USER_LOG +
            Constant.SEPERATOR.N4 + page;

        this.sendRequest(str);
    },
})
module.exports = new vqmmSend();
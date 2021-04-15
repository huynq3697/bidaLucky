var ParseData = require('ParseData');
var SocketConstant = require('SocketConstant');
var MiniPokerParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case SocketConstant.GAME.MINIPOKER.SPIN: {
                return this.parse_1008_message(tempData.messageId, tempData.status, tempData.data);
            } 
            case SocketConstant.GAME.MINIPOKER.INFO: {
                return this.parse_1009_message(tempData.messageId, tempData.status, tempData.data);
            }
            
            
        }
    },
    parse_1008_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        cc.log("tempArray", tempArray);
       
        
        return tempArray;
    },
    parse_1009_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        var tempData = data;
        var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
        // cc.log("tempArray", tempArray);
       
        
        return tempArray;
    },
    
}
module.exports = MiniPokerParse;
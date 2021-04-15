var SocketConstant = require('SocketConstant');
var ParseData = {
    arrayBufferToString(buffer) {

        var bufView = new Uint8Array(buffer);
        var length = bufView.length;
        var result = '';
        var addition = Math.pow(2, 16) - 1;

        for (var i = 0; i < length; i += addition) {

            if (i + addition > length) {
                addition = length - i;
            }
            result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
        }

        return result;

    },
    parse(data) {
        var self = this;
        var rawData;
        var rawJsonData;
        var arrayJsonData = [];
        if (data instanceof ArrayBuffer) {
            rawData = this.arrayBufferToString(data.slice(12));
        } else {
            rawData = data;
        }
        //cc.log("RAW_DATA", rawData);
        if (rawData) {
            rawJsonData = JSON.parse(rawData);
        }
        var length = rawJsonData.r.length;
        //cc.log("LENGTH",length);
        if (length == 0) {
            return [];
        } else {
            rawJsonData.r.forEach((r, pos) => {
                var jsonData = {
                };
                if (r.v) {
                    var arraySplit = r.v.split(SocketConstant.SEPERATOR.N4);
                    var arraySplit1 = arraySplit[0].split(SocketConstant.SEPERATOR.ELEMENT);
                    var messageId = arraySplit1[0];
                    var status = arraySplit1[1];
                    var data = arraySplit[1];
                    jsonData.messageId = messageId;
                    jsonData.status = status;
                    jsonData.data = data;
                    arrayJsonData.push(jsonData);
                    
                } else {
                    cc.log("ERROR");
                }
                
                
            });
        }
        return arrayJsonData;
        
        
    },
    
}
module.exports = ParseData;
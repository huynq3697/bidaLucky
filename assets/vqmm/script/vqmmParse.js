var Constant = require('Constant');
var Linker = require('Linker');

var vqmmParse = {
    parse(tempData) {
        switch (Number(tempData.messageId)) {
            case Constant.CMD.CONFIG_DATA: {
                return this.parse_14004_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },
    parse_14004_message(message, status, data){
        return data;
    }
}
module.exports = vqmmParse;
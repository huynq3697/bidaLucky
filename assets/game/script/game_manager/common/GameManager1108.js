var Linker = require('Linker');
var CommonParse = require('CommonParse');
var BiDaParse =  require('BiDaParse');
var XocDiaParse = require('XocDiaParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1108 = {
    load: function (tempData) {
        cc.log("chay vao day", tempData);
        switch (Linker.ZONE) {
            case 4: {
                var response = CommonParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 37: {
                var response = CommonParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS1: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS4: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
        }
    }
}
module.exports = GameManager1108;
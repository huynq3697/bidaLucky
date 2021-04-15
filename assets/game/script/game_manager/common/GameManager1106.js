var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var XocDiaParse = require('XocDiaParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1106 = {
    load: function (tempData) {

        switch (Linker.ZONE) {
            case BiDaConstant.ZONE_ID.ZONEID_1VS1: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1106, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS4: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1106, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1106, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1106, response);
                break;
            }
            case 22: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1106, response);
                break;
            }
        }
    }
}
module.exports = GameManager1106;
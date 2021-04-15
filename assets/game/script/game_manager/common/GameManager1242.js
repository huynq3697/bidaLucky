var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1242 = {
    load: function (tempData) {


        switch (Linker.ZONE) {
            case BiDaConstant.ZONE_ID.ZONEID_1VS1: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                // Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS4: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                // Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                // Linker.Event.dispatchEvent(1242, response);
                break;
            }
        }
    }
}
module.exports = GameManager1242;

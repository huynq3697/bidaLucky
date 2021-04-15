var Linker = require('Linker');
var LobbyParse = require('LobbyParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1246 = {
    load: function (tempData) {

        switch (Linker.ZONE) {
            case 4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 9: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 10: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 22: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS1: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
        }
    }
}
module.exports = GameManager1246;
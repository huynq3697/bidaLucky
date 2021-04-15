var Linker = require('Linker');
var ParseData = require('ParseData');
var CommonParse = require('CommonParse');
var LobbyParse = require('LobbyParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1100 = {
    load: function (tempData) {
        cc.log("chay vao day", tempData);
        switch (Linker.ZONE) {
            case 4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 5: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 14: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 11: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case 9: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS1: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_1VS4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1100, response);
                // SceneManager.loadScene('BiDaScene', function () { });
                break;
            }
        }
    }
}
module.exports = GameManager1100;
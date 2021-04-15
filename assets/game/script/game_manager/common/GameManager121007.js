var Linker = require('Linker');
var LobbyParse = require('LobbyParse');
var BiDaConstant = require('BiDaConstant');
var GameManager121007 = {
    load: function (tempData) {


        switch (Linker.ZONE) {
            case 4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
            case 22: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
            case 14: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(121007, response);
                break;
            }
        }
    }
}
module.exports = GameManager121007;

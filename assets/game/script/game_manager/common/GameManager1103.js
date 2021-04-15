var Linker = require('Linker');
var ParseData = require('ParseData');
var BiDaParse =  require('BiDaParse');
var CommonParse = require('CommonParse');
var LobbyParse = require('LobbyParse');
var BiDaConstant = require('BiDaConstant');
var GameManager1103 = {
    load: function (tempData) {

        // switch (Linker.ZONE) {
        //     case 4: {
        //         var response = CommonParse.parse(tempData);
        //         cc.log(response);
        //         Linker.Event.dispatchEvent(1103, response);
        //         break;
        //     }
        //     case 10: {
        //         var response = XocDiaParse.parse(tempData);
        //         cc.log(response);
        //         Linker.Event.dispatchEvent(1103, response);
        //     }
        //     case 22: {
        //         var response = XocDiaParse.parse(tempData);
        //         cc.log(response);
        //         Linker.Event.dispatchEvent(1103, response);
        //     }
        //     // case 8: {
        //     //     var response = BiDaParse.parse(tempData);
        //     //     Linker.Event.dispatchEvent(1103, response);
        //     //     break;
        //     // }
        // }
        var response = CommonParse.parse(tempData);
        cc.log(response);
        Linker.Event.dispatchEvent(1103, response);
    }
}
module.exports = GameManager1103;
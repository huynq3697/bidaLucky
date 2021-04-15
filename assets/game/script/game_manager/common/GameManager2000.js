var Linker = require('Linker');
var XocDiaParse = require('XocDiaParse');
var BiDaConstant = require('BiDaConstant');
var GameManager2000 = {
    load: function (tempData) {
     
        switch (Linker.ZONE) {
            case 10:
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(2000, response);
                break;
            case 22:
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(2000, response);
                break;

        }
    }
}
module.exports = GameManager2000;
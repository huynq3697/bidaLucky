
var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    
    init: function(){
        Utils.Malicious.addPhysicManagement();
    },
    configLogin: function(){
        this.node.active = false;
    }
    // update (dt) {},
});

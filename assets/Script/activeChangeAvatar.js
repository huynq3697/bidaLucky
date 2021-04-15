var functionAll = require("functionAll");
cc.Class({
    extends: cc.Component,

    properties: {
        khungAvatar: cc.Node,
        func: functionAll,
        avatarNode: [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable() {
        var tableGame2 = this.func.getData("tableGame2");
        var nameAvatar = tableGame2.computer3.urlAvatar;
        this.avatarNode.forEach(element => {
            if (element.name == nameAvatar)
            {
                this.khungAvatar.position = element.position;
            }
        });
    },
    start () {

    },

    // update (dt) {},
});

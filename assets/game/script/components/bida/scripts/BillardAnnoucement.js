cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        loadingPrefab: cc.Prefab
    },
    onLoad() {
        this.contentNode.on(cc.Node.EventType.CHILD_ADDED, this.onChildAdded, this);
    },
    onEnable: function () {
        this.unschedule(this.hidePopup);
        this.scheduleOnce(this.hidePopup, 20);
    },
    hidePopup: function () {
        this.node.active = false;
    },
    onChildAdded: function () {
        if (this.node && cc.isValid(this.node)) {
            var _size = cc.size(this.node.width, this.node.height);
            var _dsize = cc.view.getFrameSize();
            var _scale = Math.max(_size.width / _dsize.width, _size.height / _dsize.height);
            this.node.width = _dsize.width * _scale;
            this.node.height = _dsize.height * _scale;
        }
    },
    addContent: function (child) {
        this.removeAllContent();
        this.contentNode.addChild(child);
    },
    showLoading: function (str) {
        str = (str) ? str : "";
        this.removeAllContent();
        this.loadingLayer = cc.instantiate(this.loadingPrefab);
        this.loadingLayer.active = true;
        var lcpn = this.loadingLayer.getComponent("FriendLoading");
        if (lcpn) {
            lcpn.setString(str);
            this.contentNode.addChild(this.loadingLayer);
        }

    },
    hideLoading: function () {
        if (this.loadingLayer && this.loadingLayer.isValid) {
            this.loadingLayer.active = true;
            this.loadingLayer.runAction(
                cc.sequence(
                    cc.fadeOut(0.5),
                    cc.callFunc(function () {
                        this.contentNode.removeAllChildren(true);
                        this.loadingLayer.destroy();
                    }.bind(this))
                )
            )
        }
    },
    removeAllContent: function () {
        this.contentNode.removeAllChildren(true);
    }
});

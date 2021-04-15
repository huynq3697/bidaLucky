// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },
    getBgSpriteGame: function () {
        var canvas = cc.find("Canvas");
        if (canvas) {
            for (let i = 0; i < canvas.children.length; i++) {
                var child = canvas.children[i];
                var childName = child.name;
                if (childName == "Bg" || childName == "bg" || childName == "background") {
                    var sprite = child.getComponent(cc.Sprite);
                    if (sprite) {
                        return sprite;
                    } else {
                        cc.error("Tìm thấy background nhưng không có component sprite...");
                    }
                }
            }
        }
        var bgSprite = this.node.getComponent(cc.Sprite);
        if (bgSprite) {
            return bgSprite;
        }
        return null;
    },
    start() {
        this.bgSprite = this.getBgSpriteGame();
        if (this.bgSprite && cc.isValid(this.bgSprite)) {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this.onResize.bind(this));
            } else {
                cc.view.on('canvas-resize', this.onResize, this);
            }
            this.onResize();
        }

    },
    onEnable: function(){
        this.onResize();
    },
    onResize: function () {
        if (this.bgSprite && cc.isValid(this.bgSprite)) {
            var _texture = this.bgSprite.spriteFrame.getTexture();
            if (_texture) {
                var _size = cc.size(_texture.width, _texture.height);
                var _dsize = cc.view.getFrameSize();
                var _scale = Math.max(_size.width / _dsize.width, _size.height / _dsize.height);
                this.node.width = _dsize.width * _scale;
                // this.node.height = _dsize.height * _scale;
            }
        }
    }
    // update (dt) {},
});

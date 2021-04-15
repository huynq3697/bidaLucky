
cc.Class({
    extends: cc.Component,

    properties: {
        listBallSpriteFrame: [cc.SpriteFrame],
        list7BallNode: [cc.Node],
    },
    // LIFE-CYCLE CALLBACKS:
    setBallList(balls) {
        for (var i = 0; i < balls.length; i++) {
            var number = Number(balls[i]);
            if (number >= 0 && number <= this.listBallSpriteFrame.length - 1) {
                var sprite = this.list7BallNode[i].getComponent(cc.Sprite);
                sprite.spriteFrame = this.listBallSpriteFrame[number];
                this.list7BallNode[i].active = true;
                this.list7BallNode[i].opacity = 255;
            } else {
                this.list7BallNode[i].active = true;
                this.list7BallNode[i].opacity = 0;
            }

        }
        this.loaded = true;
    },
    setMyBallList: function (listMyBall) {
        var sprite;
        var spriteFrame;
        var child;
        for (let i = 0; i < this.list7BallNode.length; i++) {
            child = this.list7BallNode[i]
            sprite = child.getComponent(cc.Sprite);
            if (sprite) {
                var number = listMyBall[i];
                if (number >= 0 && number <= this.listBallSpriteFrame.length - 1) {
                    spriteFrame = this.listBallSpriteFrame[number];
                    if (spriteFrame) {
                        child.active = true;
                        sprite.spriteFrame = spriteFrame;
                        child.opacity = 255;
                    } else {
                        child.active = false;
                        child.opacity = 0;
                    }
                } else {
                    child.active = false;
                    child.opacity = 0;
                }

            } else {
                child.opacity = 0;
                child.active = false;
            }
        }
    }
});

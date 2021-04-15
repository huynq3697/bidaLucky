var NewAudioManager = require('NewAudioManager');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        blurNode: cc.Node,
        tip: cc.Node,
        shadow: cc.Node,
        ball3DMaterial: cc.Material,
        ball3DMeshRendered: cc.RenderComponent,
        ball3DTextTureArr: {
            type: cc.Texture2D, // use 'type:' to declare an array of Texture2D objects
            default: []
        },
        ball3DNode: cc.Node
    },
    onLoad() {
        this.offset = 24 / 2;
        this.speed = 160;
        //toc do sau khi be cua 2.2
        //toc do ban dau 1.3
    },
    start: function () {
        if (this && this.node && cc.isValid(this) && cc.isValid(this.node)) {
            if (cc.director._scene.name == "BiDaSplash" || cc.Global.getSceneName() == "BiDaSplash") {
                this.setMaterial3DBall(8);
                var animation = this.node.getComponent(cc.Animation);
                if (animation) {
                    this.ball3DNode.eulerAngles = cc.v3(0, 0, 0);
                    var animation = this.node.getComponent(cc.Animation);
                    if (animation) {
                        animation.play("ball_rotate_self");
                    }
                }
            }
            if (this.data) {
                if (!this._isInitHard) {
                    this.isUpdate = false;
                    this.setMaterial3DBall(this.idBi);
                    this.realParent = this.data.realParent;
                    this.updateStopPoint();
                    var animation = this.node.getComponent(cc.Animation);
                    if (animation) {
                        this.ball3DNode.eulerAngles = cc.v3(Utils.Number.random(0, 180), Utils.Number.random(0, 180), Utils.Number.random(0, 180));
                        this.animation = animation;
                        var rigid3D = this.getRidgidBody3D();
                        if (rigid3D) {
                            const v = cc.v3(10, 0, 0);
                            var rotation3D = cc.v3(
                                - v.y,
                                v.x,
                                0
                            );
                            rigid3D.setAngularVelocity(rotation3D);
                        }
                        animation.play();
                        this.isUpdate = true;
                    }
                } else {
                    this.isUpdate = false;
                    this.setMaterial3DBall(this.idBi);
                    this.ball3DNode.eulerAngles = cc.v3(Utils.Number.random(0, 180), Utils.Number.random(0, 180), Utils.Number.random(0, 180));
                }
            }
        }
    },
    initGballRailing: function (data) {
        this._isInitHard = false;
        this.data = data;
        this.idBi = data.id;

    },
    onRailingChangeVelocity: function () {
        var rigid3D = this.getRidgidBody3D();
        if (rigid3D) {
            const v = cc.v3(5, 4, 0);
            // v.mulSelf(2);
            rigid3D.setAngularVelocity(v);
        }
    },
    onRailingChangeLastVelocity: function () {
        var rigid3D = this.getRidgidBody3D();
        if (rigid3D) {
            const v = cc.v3(7, -0.1, 0);
            v.mulSelf(2);
            rigid3D.setAngularVelocity(v);
        }
    },
    getRidgidBody3D: function () {
        var rigid3D = this.ball3DNode.getComponent(cc.RigidBody3D);
        if (rigid3D && cc.isValid(rigid3D)) {
            return rigid3D;
        }
        return null;
    },
    setMaterial3DBall: function (idBi) {
        idBi = parseInt(idBi);
        if (isNaN(idBi) == true) {
            idBi = this.idBi;
        }
        if (this.ball3DMeshRendered && this.ball3DMeshRendered.isValid) {
            var _material = this.ball3DMeshRendered.getMaterial(0);
            if (idBi >= 0 && idBi <= this.ball3DTextTureArr.length - 1) {
                _material.setProperty("diffuseTexture", this.ball3DTextTureArr[idBi]);
            }
        }
    },
    initHard: function (data) {
        cc.log(data);
        this._isInitHard = true;
        this.data = data;
        this.idBi = data.idBi;

    },
    getIdBi: function () {
        return this.idBi;
    },
    playSoundBallFx: function (force, audiosource, volume, loop) {
        if (force) {
            if (force > 1000) {
                volume = 1.0;
            } else {
                volume = force / 1000;
            }
            if (isNaN(force)) {
                volume = 1;
            }
        }
        if (!volume) {
            volume = 1;
        }
        NewAudioManager.playEffectADS(audiosource, volume, loop);
    },
    updateStopPoint: function () {
        this.stopPoint = this.realParent.position.y + this.realParent.children.length * (this.offset * 2 + this.realParent.getComponent(cc.Layout).spacingY) + this.offset;
    },
    isExist: function () {
        for (let i = 0; i < this.node.parent.children.length; i++) {
            var b = this.node.parent.children[i];
            var bjs = b.getComponent("GBallRailing");
            if (bjs) {
                var idBi = bjs.getIdBi()
                if (isNaN(parseInt(idBi)) == false) {
                    if (idBi == this.idBi) {
                        this.node.destroy();
                        return true;
                    }
                }
            }
        }
        return false;
    },
    update(dt) {
        //update 3d
        var angle = -(360 + this.node.angle);
        this.blurNode.angle = angle;
        this.shadow.angle = angle;
        this.tip.angle = angle;
        if (this.isUpdate) {
            this.updateStopPoint();
            if (this.node.y <= this.stopPoint) {
                this.isUpdate = false;
                var audiosource = this.node.getComponent(cc.AudioSource);
                if (audiosource) {
                    this.playSoundBallFx(null, audiosource, 0.05, false);
                }
                if (this.animation) {
                    this.animation.stop();
                }
                var rigid3D = this.getRidgidBody3D();
                if (rigid3D) {
                    rigid3D.setAngularVelocity(cc.v3(0, 0, 0));
                }
                for (let i = 0; i < this.realParent.children.length; i++) {
                    var c = this.realParent.children[i];
                    if (c == this.node) {
                        c.destroy();
                    }
                }
                if (this.realParent && cc.isValid(this.realParent)) {
                    this.node.parent = this.realParent;
                    var layout = this.node.parent.getComponent(cc.Layout);
                    this.node.position = cc.v2(0, this.node.position.y);
                    if (layout) {
                        layout.updateLayout();
                    }
                }

            }
        }
    },
});

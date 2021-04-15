// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        targetAction: cc.Node,
        enabledAnim: false,
        time_show:  0.2,
        time_hide:  0.2,
        init_fog:  true, 
        opacity_fog:  150,
        touchFogToHide:  false,
        btn_close: cc.Node,
        fog: cc.Node,
        graphics: cc.Graphics,
    },

    onLoad() {
        cc.log("PopupDisplay onLoad");
        this.fadeInCallback = null;
        if (!this.targetAction){
            this.targetAction = this.node;
        }        

        if (this.btn_close !== null) {
            this.addClickListener(this.btn_close, this.node, 'PopupDisplay', 'onClickExit');
        }

        if (this.init_fog) {
            this.fog = new cc.Node();
            this.fog.width = cc.visibleRect['width'];
            this.fog.height = cc.visibleRect['height'];
            this.node.addChild(this.fog,-1);
            this.fog.addComponent(cc.BlockInputEvents);

            let graphics = this.fog.addComponent(cc.Graphics);
            graphics.lineWidth = 0;
            graphics.fillColor = new cc.Color(0, 0, 0, this.opacity_fog);
            let width = cc.visibleRect['width'];
            let height = cc.visibleRect['height'];
            graphics.fillRect(-width / 2, -height / 2, width, height);
            this.graphics = graphics;

            if (this.touchFogToHide){
                let btn = this.fog.addComponent(cc.Button);
                this.addClickListener(btn, this.node, 'PopupDisplay', 'onClickExit');
            }
        }
    },

    onEnable() {
        this.show();
    },

    // can Overide
    onClickExit() {
        NewAudioManager.playClick();
        this.hide();
        if (this.exitCallback) {
            this.exitCallback();
        }
    },

    setExitCallback(cb) {
        this.exitCallback = cb;
    },

    show() {
        this.node.active = true;
        if (!this.enabledAnim){
            return;
        }
        this.targetAction.stopAllActions();
        this.targetAction.opacity = 0;
        this.targetAction.scale = 0.4;
        this.targetAction.runAction(cc.sequence(
            cc.show(),
            cc.spawn(
                cc.fadeIn(this.time_show),
                cc.scaleTo(this.time_show, 1.0).easing(cc.easeBackInOut()),
                cc.sequence(
                    cc.delayTime(this.time_show * 0.75),
                    cc.callFunc(()=>{
                        this.fadeInFog();
                    })
                )
            )
        ));
    },

    fadeInFog() {
        if (!this.fog){
            return;
        }

        this.fog.active = true;
        if (this.fadeInCallback) {
            this.unschedule(this.fadeInCallback);
        }

        let opacity = 0;
        let dt = this.time_show / this.opacity_fog;
        this.fadeInCallback = () => {
            opacity++;
            this.graphics.fillColor = new cc.Color(0, 0, 0, opacity);
            if (opacity === this.opacity_fog) {
                this.unschedule(this.fadeInCallback);
                this.fadeInCallback = null;
            }
        };
        this.schedule(() => {
            if (this.fadeInCallback) {
                this.fadeInCallback();
            }
        }, dt);
    },

    hide() {
        if (!this.enabledAnim){
            this.node.active = false;
            return;
        }

        if (!this.node.active) {
            return;
        }

        if (this.fog){
            this.fog.active = false;
        }

        if (this.fadeInCallback) {
            this.unschedule(this.fadeInCallback);
        }

        this.targetAction.stopAllActions();
        this.targetAction.runAction(cc.sequence(
            cc.spawn(
                cc.fadeOut(this.time_hide),
                cc.scaleTo(this.time_hide, 0.4)
            ),
            cc.hide(),
            cc.callFunc(() => {
                this.node.active = false;
            })
        ));
    },

    addClickListener(button, node, component,
        callback, params = "") {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = node;
        clickEventHandler.component = component;
        clickEventHandler.handler = callback;
        clickEventHandler.customEventData = params;
        button.getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }   
});

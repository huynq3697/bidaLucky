var Linker = require('Linker');
var Global = require('Global');
var LoginCache = require('LoginCache');
var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var CommonSend = require('CommonSend');

cc.Class({
    extends: cc.Component,
    properties: {
        btnSettingSound: cc.Toggle,
        btnSettingVibrate: cc.Toggle,
        btnInvitation: cc.Toggle,
        btnAutoReady: cc.Toggle,
        btnFast: cc.Toggle,
        btnSlow: cc.Toggle,
        btnError1: cc.Toggle,
        btnError2: cc.Toggle,
        btnSettingSupport: cc.Node,
        btnSettingLogout: cc.Node,
        btnCloseSetting: cc.Node,
        btnChangeLanguage: cc.Node,
        billardChangeLanguage: cc.Node,
        contactUs: cc.Node,
    },
    onLoad() {
        this.addEventButtonToNode();
    },
    checkShowLogout: function () {
        if (Linker.BiDaOfflineController || Linker._sceneTag == BiDaConstant.TAG.scenes.GAME || !Linker.isLogin) {
            return false;
        }
        return true;
    },
    checkShowAutoReady: function () {
        if (Linker.BiDaOfflineController || Linker._sceneTag != BiDaConstant.TAG.scenes.GAME || !Linker.isLogin) {
            return false;
        }
        return true;
    },
    onEnable: function () {
        this.showLogoutBtn(this.checkShowLogout());
        this.showAutoReady(this.checkShowAutoReady());
        this.updateSetup();
    },
    addEventButtonToNode: function () {
        this.btnSettingSound.node.on('toggle', this.onMusicBtnClick, this);
        this.btnSettingVibrate.node.on('toggle', this.onVibrationBtnClick, this);
        this.btnFast.node.on('toggle', this.onFastBtnClick, this);
        this.btnSlow.node.on('toggle', this.onSlowBtnClick, this);
        this.btnError1.node.on('toggle', this.onTotalError1BtnClick, this);
        this.btnError2.node.on('toggle', this.onTotalError2BtnClick, this);
        this.btnSettingSupport.on(cc.Node.EventType.TOUCH_END, this.onBillardPanelSettingClick, this);
        this.btnSettingLogout.on(cc.Node.EventType.TOUCH_END, this.onBillardPanelSettingClick, this);
        this.btnCloseSetting.on(cc.Node.EventType.TOUCH_END, this.onBillardPanelSettingClick, this);
        this.btnChangeLanguage.on(cc.Node.EventType.TOUCH_END, this.onBillardPanelSettingClick, this);
    },
    logOut: function () {
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                gNodeC.alert("message_confirm_logout", G.AT.OK_CANCEL, () => {
                    Linker.Socket.close();
                    Linker.isLogin = false;
                    if (Linker.isFb) {
                        Linker.MySdk.logoutFb();
                        Linker.isFb = false;
                    }
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    // if (!Global.LoginHandler.IS_REM_PASSWORD) {
                    //     LoginCache.remove();
                    //     cc.log("Remove password remember ...");
                    // }

                    //logout thanh cong
                    var customEvent = new cc.Event.EventCustom(BiDaConstant.LOGIN_EVENT.LOGOUTED_SUCCESS, true);
                    this.node.dispatchEvent(customEvent);
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    cc.log("Huy logout ...");
                });
            }
        }
    },
    showLogoutBtn: function (enable) {
        this.btnSettingLogout.active = enable;
    },
    showAutoReady: function (enable) {
        this.btnAutoReady.node.parent.active = enable;
    },
    onBillardPanelSettingClick: function (event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            if (target === this.btnSettingSound) {
                this.userData.isMusic = event.isChecked;
                Linker.Local.saveUserData(this.userData);
                // if(event.isChecked) {
                //     NewAudioManager.playBackground(NewAudioManager.sound.background);
                // } else{
                //     NewAudioManager.stopSoundBackground();
                // }
            } else if (target === this.btnSettingVibrate) {
                this.userData.isVibration = event.isChecked;
                Linker.Local.saveUserData(this.userData);
            } else if (target === this.btnSettingSupport) {

            } else if (target === this.btnSettingLogout) {
                cc.log("log out now ?");
                this.logOut();
            } else if (target === this.btnCloseSetting) {
                this.node.active = false;
                this.showLogoutBtn(Linker.isLogin);
            } else if (target === this.btnChangeLanguage) {
                this.billardChangeLanguage.active = true;
            }
        }
    },
    onMusicBtnClick(toggle) {
        this.userData.isMusic = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
        NewAudioManager.playClick();
        if (toggle.isChecked == true) {
            NewAudioManager.playBackground(NewAudioManager.sound.background);
        } else {
            NewAudioManager.playBackground(NewAudioManager.sound.background);
        }

    },
    onToggleInvitation(event) {
        NewAudioManager.playClick();
        this.userData.isInvite = event.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onToggleAutoReady(event) {
        NewAudioManager.playClick();
        this.userData.isAutoReady = event.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onVibrationBtnClick(toggle) {
        NewAudioManager.playClick();
        this.userData.isVibration = toggle.isChecked;
        Linker.Local.saveUserData(this.userData);
    },
    onFastBtnClick(toggle) {
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            var isFastPlay = 1;
        } else {
            var isFastPlay = 0;
        }
        if (Linker.ZONE && Linker.BillardsGameTableController && Linker.BillardsGameTableController.isValid) {
            var test = CommonSend.sendSettingRequest(Linker.ZONE, Linker.BillardsGameTableController.tableId, isFastPlay, Linker.BillardsGameTableController.isTotalError);
            Linker.Socket.send(test);
        }
    },
    onSlowBtnClick(toggle) {
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            var isFastPlay = 0;
        } else {
            var isFastPlay = 1;
        }
        if (Linker.ZONE && Linker.BillardsGameTableController && Linker.BillardsGameTableController.isValid) {
            var test = CommonSend.sendSettingRequest(Linker.ZONE, Linker.BillardsGameTableController.tableId, isFastPlay, Linker.BillardsGameTableController.isTotalError);
            Linker.Socket.send(test);
        }
    },
    onTotalError1BtnClick(toggle) {
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            var isTotalError = 1;
        } else {
            var isTotalError = 0;
        }
        if (Linker.ZONE && Linker.BillardsGameTableController && Linker.BillardsGameTableController.isValid) {
            var test = CommonSend.sendSettingRequest(Linker.ZONE, Linker.BillardsGameTableController.tableId, Linker.BillardsGameTableController.isFastPlay, isTotalError);
            Linker.Socket.send(test);
        }
    },
    onTotalError2BtnClick(toggle) {
        NewAudioManager.playClick();
        if (toggle.isChecked) {
            var isTotalError = 0;
        } else {
            var isTotalError = 1;
        }
        if (Linker.ZONE && Linker.BillardsGameTableController && Linker.BillardsGameTableController.isValid) {
            var test = CommonSend.sendSettingRequest(Linker.ZONE, Linker.BillardsGameTableController.tableId, Linker.BillardsGameTableController.isFastPlay, isTotalError);
            Linker.Socket.send(test);
        }
    },

    onClickButton(event, customEventData) {
        NewAudioManager.playClick();
        switch (customEventData) {
            case 'support-request': {
                this.contactUs.active = true;
                break;
            }
        }
    },
    updateSetup() {
        this.userData = Linker.Local.readUserData();
        this.billardChangeLanguage.active = false;
        var BillardsMainLayer = cc.find('Canvas/BillardPortalHandler/BillardsMainLayer');
        if (BillardsMainLayer) {
            if (BillardsMainLayer.active) {
                this.btnChangeLanguage.parent.active = false;
                this.btnFast.node.parent.active = true;
                this.btnError1.node.parent.active = true;
                if (Linker.BillardsGameTableController.isFastPlay == 1) {
                    this.btnFast.isChecked = true;
                    // this.btnSlow.isChecked = false;
                } else {
                    // this.btnFast.isChecked = false;
                    this.btnSlow.isChecked = true;
                }
                if (Linker.BillardsGameTableController.isTotalError == 1) {
                    this.btnError1.isChecked = true;
                    // this.btnError2.isChecked = false;
                } else {
                    // this.btnError1.isChecked = false;
                    this.btnError2.isChecked = true;
                }

                if (Linker.BillardsGameTableController.isMaster == 1) {
                    this.btnFast.node.parent.getChildByName("block").active = false;
                    this.btnError1.node.parent.getChildByName("block").active = false;
                } else {
                    this.btnFast.node.parent.getChildByName("block").active = true;
                    this.btnError1.node.parent.getChildByName("block").active = true;
                }
            }
            else {
                this.btnChangeLanguage.parent.active = true;
                this.btnFast.node.parent.active = false;
                this.btnError1.node.parent.active = false;
            }
        } else {
            this.btnChangeLanguage.parent.active = true;
            this.btnFast.node.parent.active = false;
            this.btnError1.node.parent.active = false;
        }
        if (this.userData) {
            this.btnSettingSound.isChecked = this.userData.isMusic;
            this.btnSettingVibrate.isChecked = this.userData.isVibration;
            // this.soundToggle.isChecked = this.userData.isSound;
            this.btnInvitation.isChecked = this.userData.isInvite;
            this.btnAutoReady.isChecked = this.userData.isAutoReady;
        }
    }
});

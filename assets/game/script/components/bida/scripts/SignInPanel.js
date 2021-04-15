var LoginCache = require('LoginCache');
var Global = require("Global2");
var Utils = require('Utils');
var Linker = require('Linker');
const BiDaConstant = require('BiDaConstant');
var FacebookSDK = require('FacebookSDK');
var CommonSend = require('CommonSend');
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,
    properties: {
        userNameEditBox: cc.EditBox,
        userPswEditBox: cc.EditBox,
        toggleNode: cc.Node,
        btnLogin: cc.Node,
        btnSignUp: cc.Node,
        btnOfflinePlay: cc.Node,
        btnQuickPlay: cc.Node,
        btnLoginFB: cc.Node,
        runChoosePlayerPrefab: cc.Prefab,
    },

    onLoad() {
        this.addButtonEvent();
        this.activeToggle();
    },

    onEnable: function () {
        this.toggleNode.on("toggle", this.onRememberPws, this);
        var cache = LoginCache.get();
        if (Utils.Malicious.getLengthObj(cache) < 2) {
            cache.username = "";
            cache.password = "";
        }
        var username = cache.username;
        var password = cache.password;
        this.userNameEditBox.string = username;
        this.userPswEditBox.string = password;
        if (this.toggleNode.getComponent(cc.Toggle).isChecked) {
            Global.LoginHandler.IS_REM_PASSWORD = true;
        } else {
            Global.LoginHandler.IS_REM_PASSWORD = false;
        }
    },
    start() {
        if (this.toggleNode.getComponent(cc.Toggle).isChecked)
            Linker.LoginController.loginBtnClick();
        cc.log("tien hanh dang nhap");
    },
    onRememberPws: function (toggle) {
        NewAudioManager.playClick();
        Global.LoginHandler.IS_REM_PASSWORD = toggle.isChecked;
        LoginCache.set(this.userNameEditBox.string, this.userPswEditBox.string);
        var userData = Linker.Local.readUserData();
        userData.autoLogin = toggle.isChecked;
        Linker.Local.saveUserData(userData);
    },

    addButtonEvent() {
        this.btnLogin.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
        this.btnSignUp.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
    },

    onButtonClick(event) {
        var target = event.currentTarget;
        switch (target) {
            case this.btnLogin: {
                NewAudioManager.playClick();
                Linker.LoginController.loginBtnClick();
                cc.log("tien hanh dang nhap");
                break;
            }
            case this.btnSignUp: {
                NewAudioManager.playClick();
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SIGN_UP.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }
            default: break;
        }
    },
    onLoginTopClick: function (event) {
        switch (event.target.name) {
            case "btnSignIn":
                NewAudioManager.playClick();
                Linker.LoginController.loginBtnClick();
                cc.log("tien hanh dang nhap");
                break;
            case "btnbtnSignUp":
                NewAudioManager.playClick();
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SIGN_UP.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            case "btnOfflinePlay":
                NewAudioManager.playClick();
                Utils.Malicious.removeNodeByNameFromParent("TestSwitchPlayer", this.node);
                var test = cc.instantiate(this.runChoosePlayerPrefab);
                this.node.addChild(test);
                test.active = true;
                //run
                var linhTinhComponent = test.getComponent("LinhTinh");
                if (linhTinhComponent) {
                    linhTinhComponent.runRandomPlayerAvatar();
                }
                break;
            case "btnQuickPlay":
                NewAudioManager.playClick();
                Linker.LoginController.btnFastPlayClick();
                break;
            case "btnLoginFB":
                NewAudioManager.playClick();
                cc.log("tien hanh dang nhap voi face book");
                Linker.isLogin = false;
                if (cc.sys.isNative) {
                    Linker.MySdk.loginFb();
                } else {
                    // Linker.LoginController.loginFbWeb();
                    FacebookSDK.login(function (response) {
                        cc.log("response", response)
                        if (response.status === 200) {
                            Linker.GameManager.prepareGame((isCanLogin) => {
                                if (isCanLogin) {
                                    var login = CommonSend.loginFb("fb_" + response.data.authResponse.userID, 1, ApplicationConfig.PLATFORM, response.data.authResponse.accessToken, Global.deviceID);
                                    Linker.Socket.send(login);

                                    Linker.TOKEN = {
                                        token: response.data.authResponse.accessToken,
                                        userId: response.data.authResponse.userID
                                    }
                                    cc.Global.loginType = LoginType.FB;
                                } else {
                                    Linker.LoginController.node.getComponent("LoginManager").hideLoadingLayer();

                                }
                            })
                        } else {
                            cc.Global.showMessage("Vui lòng thử lại sau");
                        }
                    }, '');
                }
                break;
            default:
                cc.log("???????????");
                break;
        }
    },
    activeToggle() {
        var userData = Linker.Local.readUserData();
        this.toggleNode.getComponent(cc.Toggle).isChecked = userData.autoLogin;
    },
    onForgetPassword() {
        NewAudioManager.playClick();
        if (Linker.Config.APP_API) {
            //this.btnTeleActive.active = false;
            var url = Linker.Config.KHTELE;
            if (url.length > 0) {
                cc.sys.openURL(url);
            } else {
                cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
            }
        } else {
            //this.btnTeleActive.active = true;
            cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
        }
    },
});

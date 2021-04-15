var Global = require("Global2");
var FacebookSDK = require("FacebookSDK");
window.onPhoneNumber = function (phone) {
    // var scene = cc.director.getScene().getComponentInChildren("BaseScene");
    // scene.onPhoneNumber(phone);
    //cc.log("vao phone roi window.onPhoneNumber: "+phone);
    FacebookSDK.onPhoneNumber(phone);
    
};

var NativeBridge = {

    androidActivity: "org/cocos2dx/javascript/AppActivity",

    getDeviceIDNative: function () {
        var deviceID;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            deviceID = jsb.reflection.callStaticMethod(this.androidActivity, "getDeviceID", "()Ljava/lang/String;");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            deviceID = jsb.reflection.callStaticMethod("AppController", "getDeviceID");
        }

        return deviceID;
    },

    getVersionNative: function () {
        var version;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            version = jsb.reflection.callStaticMethod(this.androidActivity, "getVersionName", "()Ljava/lang/String;");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            version = jsb.reflection.callStaticMethod("AppController", "getVersionName");
        }

        return version;
    },

    smsLogin: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidActivity, "phoneLogin", "()V");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "phoneLogin");
        }
    },

    openURL: function (url) {
        if(cc.sys.isBrowser) {
            cc.sys.openURL(url);
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidActivity, "openNativeUrl", "(Ljava/lang/String;)V", url);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "openNativeUrl:", "http://www.facebook.com/");
        }
    },
    signInByGoogle() {
        console.log("signInByGoogle to native");
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "signInByGoogle", "()V");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "signInByGoogle:", JSON.stringify(""));
        }
    }
};

module.exports = NativeBridge;
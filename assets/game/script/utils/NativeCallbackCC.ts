

export var NativeCallbackCC = {
    joinMeetByLink: function (str) {
        cc.log("joinMeetByLink:", str);
        if (str.length > 0) {
            var res = str.split('/');
            if (res.length > 2) {
                var roomKey = res[3] ? res[3] : "";
                var url = res[0] + "//" + res[2];
                var domain = url;
                var displayName = LoginCache.getName();
                if (domain && roomKey) {
                    Global.showPasswordLayer({ domain: domain, roomKey: roomKey, displayName: displayName });
                    // NativeBridge.joinStream(domain, roomKey, displayName);
                } else {
                    cc.log("not have domain, roomky");
                }
            }
        }
    },
    checkExistLink: function () {
        // this.joinMeetByLink("https://s4.saomeet.com/8182389549#userInfo.displayName=%22winwinwin4%22");
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            // jsb.reflection.callStaticMethod(this.androidActivity, "checkExistLink", "(Ljava/lang/String;)V",str);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkExistLink", "(Ljava/lang/String;)V", "");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "checkExistLink:", "");
        }
    },
    callbackListContact: function (data) {
        cc.log("callbackListContact:", data);
    },
    loginGGSuccess: function (id, displayname, photourl, email) {
        console.log("id goole:", id);
        console.log("photourl:", photourl);
        console.log("displayname:", displayname);
        console.log("loginGGSuccess:", email);
        if (cc.Canvas.instance.node) {
            var data = {
                id: id,
                displayname: displayname,
                photourl: photourl,
                email: email
            };
            cc.Canvas.instance.node.emit("LOGIN_GOOGLE", data);
            LoginCache.setGG(JSON.stringify(data));
        }
    }
}

export var iosNativeCallJS = {
    func: function (str) {
        cc.log("vaoday calback", str)
    }
}

declare global {
    interface Window {
        NativeCallbackCC: any,
        iosNativeCallJS: any,
        callbackListContact: any,
    }
}

window.NativeCallbackCC = window.NativeCallbackCC || NativeCallbackCC
window.iosNativeCallJS = window.iosNativeCallJS || iosNativeCallJS






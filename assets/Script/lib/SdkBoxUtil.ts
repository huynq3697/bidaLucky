var Linker = require("Linker");
// import { Global, LoginType } from "./../../../script/base/Global";

module.exports = {
    initSDK: function () {
        console.log("initSDK");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        // this.sdkboxPlayInit();
        this.facebookInit();

    },
    

    googleLogin: function () {
        console.log("googleLogin");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay;
            if(Linker.PluginSdkboxPlay){
                Linker.PluginSdkboxPlay
            }
            console.log("PluginSdkboxPlay isConnected", plugin.isConnected());
            if (plugin.isSignedIn()) {
                console.log("PluginSdkboxPlay isSignedIn");
                //plugin.signout();
            } else {
                console.log("PluginSdkboxPlay signin");
                plugin.signin();
            }
            console.log("PluginSdkboxPlay getPlayerId", plugin.getPlayerId());
        }
    },
    loginFb() {
        console.log("loginFb");
        //test loginfb
        // var datasss = '{"id":"2702504596730602","name":"Nguyễn Thúy Hằng","email":"thienychan@gmail.com","first_name":"Nguyễn Thúy","installed":true,"last_name":"Hằng","picture":{"data":{"url":"https:\/\/platform-lookaside.fbsbx.com\/platform\/profilepic\/?asid=2702504596730602&height=50&width=50&ext=1611977659&hash=AeTfvXBCdQ9MLD1puZo"}}}';
        // this.onAPI("ok",datasss);
        //end test loginfb
        if (typeof sdkbox !== "undefined") {
            //sdkbox.PluginFacebook.requestReadPermissions(["public_profile"]);
            if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
                console.log("vao dayloginFb:" + sdkbox.PluginFacebook.isLoggedIn());

                sdkbox.PluginFacebook.requestReadPermissions(["public_profile", "email"]);


                if (sdkbox.PluginFacebook.isLoggedIn()) {


                    var token = sdkbox.PluginFacebook.getAccessToken();
                    var userId = sdkbox.PluginFacebook.getUserID();
                    var params = new Object();
                    params["fields"] = "id,name,email,first_name,installed,last_name,picture{url}";
                    sdkbox.PluginFacebook.api("/me", "GET", params, "/me");

                    // Linker.system.Event.DispatchEvent("token", {
                    //     token: token,
                    //     userId: userId
                    // });
                } else {
                    sdkbox.PluginFacebook.login();
                }
            }
        } else {
            console.log("sdkbox is not exist")
        }
    },
    logoutFb() {
        if (typeof sdkbox !== "undefined") {
            sdkbox.PluginFacebook.logout();
        }
        Linker.isFb = false;


    },
    onAPI: function (tag, data) {//test login fb
        console.log("onAPI");
        console.log("tag:", tag);
        console.log("data:", data);
        console.log("data:", JSON.stringify(data));
        var token = "2134223423523534";
        var userId = 13432543463456;
        Linker.system.Event.DispatchEvent("token", {
            token: token,
            userId: userId,
            data: data
        });
    },
    submitCore: function (money) {
        console.log("submitCore:" + money);
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("ok send submitCore");
            sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
    },
    facebookInit: function () {
        console.log("facebookInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof (sdkbox.PluginFacebook)) {
            sdkbox.PluginFacebook.init();
            sdkbox.PluginFacebook.setListener({
                onLogin: function (isLogin, msg) {
                    if (isLogin) {
                        console.log("login successful");

                    }
                    else {
                        console.log("login failed");
                    }
                },
                onAPI: function (tag, data) {
                    console.log("onAPI:",data)
                },
                onSharedSuccess: function (data) {
                    console.log("share successful");
                },
                onSharedFailed: function (data) {
                    console.log("share failed");
                },
                onSharedCancel: function () {
                    console.log("share canceled");
                },
                onPermission: function (isLogin, msg) {
                    if (isLogin) {
                        console.log("request permission successful");
                    }
                    else {
                        console.log("request permission failed");
                    }
                },
                onFetchFriends: function (ok, msg) {
                   

                },
                onRequestInvitableFriends: function (friendsData) {
                    // console.log(JSON.stringify(friendsData));

                    // var friends = friendsData["data"];
                    // if (friends.length > 0) {
                    //     self.invitableFBUserID = friends["uid"];
                    // }
                },
                onInviteFriendsWithInviteIdsResult: function (result, description) {
                    // console.log("onInviteFriendsWithInviteIdsResult result=" + (result ? "ok" : "error") + " " + description);
                },
                onInviteFriendsResult: function (result, description) {
                    // console.log("onInviteFriendsResult result=" + (result ? "ok" : "error") + " " + description);
                }

            });
        }
    }
}
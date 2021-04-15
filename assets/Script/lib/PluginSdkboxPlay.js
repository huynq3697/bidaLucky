var SdkBoxUtil = require('SdkBoxUtil');
var Linker = require("Linker");
import NativeBridge from "./../../game/script/utils/NativeBridge";
// /Users/mac/Projects/tlmn_offline/assets/game/script/utils/NativeBridge.js
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("initSDK");
        NativeBridge.signInByGoogle();
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        this.sdkboxPlayInit();
        
        
    },

    onEnable() {

    },
    onDisable() {

    },
    start() {
        if(cc.Canvas.instance && cc.Canvas.instance.node){
            cc.Canvas.instance.node.on("LOGIN_GOOGLE", this.onGoogleResponse, this);
        }
        
    },
    onDestroy() {
        
    },
    onGoogleResponse(message) {
        console.log("onGoogleResponse");
        console.log(message);
        // GameManager.Instance.PrepareGame(function (isCanLogin) {
        //     if (isCanLogin) {
        //         if (message) {
        //             this.enableLoginLoading(true);
        //             this.enablAllLoadingProgress(false);
        //             var login = CommonSend.loginGG("gg_" + message.id, 1, Global.applicationConfig.Platform, "", Global.Config.DeviceId, message.displayname, message.email, message.photourl);
        //             Linker.system.socket.send(login);
        //             Global.Config.loginType = LoginType.GG;
        //         }
        //     }
        // }.bind(this));
    },

    sdkboxPlayInit: function () {
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay;
            Linker.PluginSdkboxPlay = plugin;
            plugin.setListener({
                onConnectionStatusChanged: function (connection_status) {
                    console.log("connection status change: " + connection_status + " connection_status");
                    if (connection_status == 1000) {
                        console.log('Player id: ' + plugin.getPlayerId());
                        console.log('Player name: ' + plugin.getPlayerAccountField("name"));
                        // me.info.setString("connection status: " + connection_status + " " + plugin.getPlayerId() + " " + plugin.getPlayerAccountField("name") + "(" + plugin.getPlayerAccountField("display_name") + ")");
                    } else {
                        console.log('Not connected. Status: ' + connection_status);
                        // me.info.setString("Not connected. Status: " + connection_status);
                    }
                },
                onScoreSubmitted: function (leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                    console.log('onScoreSubmitted trigger leaderboard_name:' + leaderboard_name + ' score:' + score + ' maxScoreAllTime:' + maxScoreAllTime + ' maxScoreWeek:' + maxScoreWeek + ' maxScoreToday:' + maxScoreToday);
                },
                onMyScore: function (leaderboard_name, time_span, collection_type, score) {
                    console.log('onMyScore trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' score:' + score);
                },
                onMyScoreError: function (leaderboard_name, time_span, collection_type, error_code, error_description) {
                    console.log('onMyScoreError trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onPlayerCenteredScores: function (leaderboard_name, time_span, collection_type, json_with_score_entries) {
                    console.log('onPlayerCenteredScores trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' json_with_score_entries:' + json_with_score_entries);
                },
                onPlayerCenteredScoresError: function (leaderboard_name, time_span, collection_type, error_code, error_description) {
                    console.log('onPlayerCenteredScoresError trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onIncrementalAchievementUnlocked: function (achievement_name) {
                    console.log("incremental achievement " + achievement_name + " unlocked.");
                },
                onIncrementalAchievementStep: function (achievement_name, step) {
                    console.log("incremental achievent " + achievement_name + " step: " + step);
                },
                onIncrementalAchievementStepError: function (name, steps, error_code, error_description) {
                    console.log('onIncrementalAchievementStepError trigger leaderboard_name:' + name + ' steps:' + steps + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onAchievementUnlocked: function (achievement_name, newlyUnlocked) {
                    console.log('onAchievementUnlocked trigger achievement_name:' + achievement_name + ' newlyUnlocked:' + newlyUnlocked);
                },
                onAchievementUnlockError: function (achievement_name, error_code, error_description) {
                    console.log('onAchievementUnlockError trigger achievement_name:' + achievement_name + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onAchievementsLoaded: function (reload_forced, json_achievements_info) {
                    console.log('onAchievementsLoaded trigger reload_forced:' + reload_forced + ' json_achievements_info:' + json_achievements_info);
                },
                onSetSteps: function (name, steps) {
                    console.log('onSetSteps trigger name:' + name + ' steps:' + steps);
                },
                onSetStepsError: function (name, steps, error_code, error_description) {
                    console.log('onSetStepsError trigger name:' + name + ' steps:' + steps + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onReveal: function (name) {
                    console.log('onReveal trigger name:' + name);
                },
                onRevealError: function (name, error_code, error_description) {
                    console.log('onRevealError trigger name:' + name + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onGameData: function (action, name, data, error) {
                    if (error) {
                        // failed
                        console.log('onGameData failed:' + error);
                    } else {
                        //success
                        if ('load' == action) {
                            console.log('onGameData load:' + name + ':' + data);
                        } else if ('save' == action) {
                            console.log('onGameData save:' + name + ':' + data);
                        } else {
                            console.log('onGameData unknown action:' + action);
                        }
                    }
                }
            });
            plugin.init();

            // ref to http://discuss.cocos2d-x.org/t/sdkbox-play-savegamedata-error/39367
            //plugin.saveGameData("name", 'test'); // crash here ?

        } else {
            // printf("no plugin init")
        }


    },

    showLeaderboard: function () {
        console.log("showLeaderboard");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("vao showLeaderboard");
            var plugin = sdkbox.PluginSdkboxPlay;
            if (!plugin.isSignedIn()) {
                SdkBoxUtil.googleLogin();
            }
            plugin.showLeaderboard("ldb1");
        }
    },
    submitCore: function (money) {
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("ok send submitCore");
            sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
    },
    btnShareFB: function () {
        Linker.showMessage("Share game....");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        // if ("undefined" != typeof (sdkbox.PluginFacebook)) {
        //     var info = new Object();
        //     info.type = "link";
        //     info.link = "https://play.google.com/store/apps/details?id=com.zepplay.tienlenoffline";
        //     info.title = "Tiến lên Miền Nam";
        //     info.text = "Zep Tiến lên - Tien Len Mien Nam";
        //     info.image = "https://i.ibb.co/jk1YYt4/playstore-icon.png";
        //     sdkbox.PluginFacebook.dialog(info);
        // }
       
      
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var str = "Chơi TLMN Miễn Phí: https://play.google.com/store/apps/details?id=zepplay.eightpool.ballslot";
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareData", "(Ljava/lang/String;)V",str);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            //jsb.reflection.callStaticMethod("AppController", "shareData");
        }
    
           
      
    }
});

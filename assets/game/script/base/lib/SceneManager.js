var SceneManager = {
    // Control Scene
    loadScene: function (sceneName, handler) {
        // First time loading
        //Duplicated loading
        if (sceneName == cc.Global.kCurrScene) {
            // Toast("Vui lòng thử lại", {});
            cc.log('Duplicated loading scene exception.');
            // return;
            // cc.director.preloadScene(sceneName, function () {
            //     cc.director.loadScene(sceneName);
            // });
        } else if (cc.Global.kCurrScene == -1) {
            cc.director.loadScene(sceneName, handler);
            cc.Global.kCurrScene = sceneName;
        } else {
            cc.director.loadScene(sceneName, handler);
            cc.Global.kPrevScene = cc.Global.kCurrScene;
            cc.Global.kCurrScene = sceneName;
        }
        cc.log('kCurrScene:', cc.Global.kCurrScene);
    },
    getCurrentScene: function () {
        return cc.Global.kCurrScene;
    },
    preloadScene: function (sceneName, handler) {
        if (sceneName == cc.Global.kCurrScene) {
            // cc.log('Duplicated preload scene exception.');
            // return;
            cc.director.preloadScene(sceneName, function () {
                cc.director.loadScene(sceneName);
            });
        } else {
            cc.director.preloadScene(sceneName, handler);
        }
    }

}
module.exports = SceneManager;
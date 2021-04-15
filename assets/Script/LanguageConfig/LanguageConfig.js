var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var DataManger = require('DataManger');
cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        itemPrefab: cc.Prefab,
        dropDown: cc.Node,
        nameSelectLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.languageArray = [
            
            {
                name: "English",
                id: BiDaConstant.LANGUAGE.ENGLISH
            },
            {
                name: "Deutsch",
                id: BiDaConstant.LANGUAGE.DEUTSCH
            },
            {
                name: "Français",
                id: BiDaConstant.LANGUAGE.FRENCH
            },
            {
                name: "Indonesia",
                id: BiDaConstant.LANGUAGE.INDONESIAN
            },
            {
                name: "Italiano",
                id: BiDaConstant.LANGUAGE.ITALIAN
            },
            {
                name: "Português",
                id: BiDaConstant.LANGUAGE.PORTUGUES
            },
            {
                name: "Pyccknñ",
                id: BiDaConstant.LANGUAGE.RUSSIAN
            },
            {
                name: "Türkçe",
                id: BiDaConstant.LANGUAGE.TURKEY
            },
            {
                name: "Tiếng Việt",
                id: BiDaConstant.LANGUAGE.VIETNAMESE
            },
            {
                name: "中文",
                id: BiDaConstant.LANGUAGE.CHINESE
            },
            {
                name: "한국어",
                id: BiDaConstant.LANGUAGE.KOREAN
            },
            {
                name: "भारत",
                id: BiDaConstant.LANGUAGE.INDIAN
            }

        ]
        this.createList();
        this.dropDown.active = false;
        this.node.on("EVENT_SELECTED_LANGUAGE_CONFIG", this.onSelectedLanguage, this);
        // this.nameSelectLabel.string = this.getNameLanguage();
    },

    onEnable () {
        this.nameSelectLabel.string = this.getNameLanguage();
    },

    getNameLanguage () {
        for (var i = 0; i < this.languageArray.length; i++) {
            if (Linker.gameLanguage == this.languageArray[i].id) {
                return this.languageArray[i].name;
            }
        }
        return "";
    },

    createList () {
        this.contentNode.removeAllChildren(true);
        for (var i = 0; i < this.languageArray.length; i++) {
            var node = cc.instantiate(this.itemPrefab);
            var js = node.getComponent("itemLanguage");
            js.setName(this.languageArray[i].name);
            js.setId(this.languageArray[i].id);
            this.contentNode.addChild(node);
        }
    },

    onSelectClick () {
        this.dropDown.active = !this.dropDown.active;
    },

    onSelectedLanguage (e) {
        if (e && e.idLanguage) {
            this.nameSelectLabel.string = e.nameLanguage;

            i18n.init(e.idLanguage);
            Linker.gameLanguage = e.idLanguage;
            BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
            DataManger.UserData.setLanguage(e.idLanguage);
            // cc.sys.localStorage.setItem("languageCode", e.idLanguage);
            NewAudioManager.LoadSound(e.idLanguage);
        }
        this.dropDown.active = false;
    },

    // start () {

    // },

    // update (dt) {},
});

var Local = {
    removeUserData() {
        cc.sys.localStorage.removeItem('userData');
    },
    saveUserData(userData) {
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
    },
    readUserData() {
        var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));


        if (userData) {
            return userData;
        }
        else {
            var userData = {
                isSound: true,
                isMusic: true,
                isVibration: false,
                isInvite: true,
                cofferMoney: 6493676,
                isGameType: 3,
                autoLogin: false,
            };
            cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
            return userData;
        }

    },


}
var Toast = require('Toast');
var showMessage = function (text) {
    Toast(text, {});
}
var showMessageOption = function (text,option) {
    Toast(text, option);
}
var EventDispatcher = require('EventDispatcher');
var Socket = require('Socket');
var BASE_API = "";
var BASE_SOCKET = "s1.kingbida.com";
module.exports = {
    Local: Local,
    DEBUG: false,
    isInitAdmod: false,
    isMySdkLoad: false,
    BASE_API: BASE_API,
    BASE_SOCKET: BASE_SOCKET,
    showMessage: showMessage,
    showMessageOption: showMessageOption,
    Event: EventDispatcher.create(false),
    Socket: new Socket(),
    reconnect: 0,
    reconnecting: false,
    firstGoToHome: true,
    reconnetByInPlayGameCard:-1,
    CHAT_MESSAGE:[],
    version: 1,
    versionIOS: 1,
    versionHotUpdate: "1.0.5",
    LoadedFromHallScene:{},
    HallEventData:[],
    isGameSlotHall: false,
    TaiXiuController: null,
    HallView: null,
    TaiXiuView: null,
    MiniGame: null,
    LoginController: null,
    TopHuController: null,
    pingCountResponse:0,
    NationFlag: null,
    settingTable: null,
    DataSuKien: {
        common: {
            taixiu_event: {},
            nohubai_event: {}
        },
        taixiu_event: {
            isOpenData: null,
            vinhdanh: {
                today_data: null,
                date_data: []
            },
            homqua: {
                today_data: null,
                date_data: []

            }
            
        },
        nohubai_event: {
            mylisthu: null,
            commonlisthu: null
        }
    },
    LixiHandler: {
        auto_click: false
    },
    LoadedHallScene: false,
    ListMail: {
        MessageDialog: null,
        ListMailData: null
    },
    RankData: {
        listRank: null
    }
   
};

/**
 * Created by kk on 7/6/2016.
 */

var TEST_MODE = false;
//var URL_CONFIG = "http://ip40.api1chan.info/configchanktc.php";
//var URL_CONFIG = "http://chanbachthu.com/configchanktc.php";
//var URL_CONFIG = "http://125.212.207.71/config/index.php";
// var URL_CONFIG = "http://chanhoaroi.com/chr.txt";
var URL_CONFIG = "http://api.faco.club/api-config";

var VERSION_CHANBT = "version 1.3";

var HostConfig = HostConfig || {};
HostConfig.authenZone = -1;
HostConfig.host = -1;
HostConfig.websocketPort = -1;
HostConfig.portMobile = -1;
HostConfig.facebookLink = -1;
HostConfig.smsVT = -1;
HostConfig.smsVNPVMS = -1;
HostConfig.smsKH = -1;
HostConfig.invite = false;

var LoginConfig = LoginConfig || {};
LoginConfig.ready = false;
LoginConfig.popup = false;
LoginConfig.popupUrl = "";
LoginConfig.kick = false;
LoginConfig.providers = [];

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
};

//"{0} is dead, but {1} is alive!".format("ASP", "ASP.NET")
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

cc.Global = cc.Global || {};
cc.Global.TourInfo = {};
cc.Global.designGame = cc.size(1280, 720);
cc.Global.getCardName = function (cardId) {
    //cc.log('cardId '+cardId);
    if (cardId === 0) return 0;
    return (Math.floor(cardId / 3) + 1) * 10 + cardId % 3 + 1;
};
cc.Global.getCardObj = function (cardId) {
    //cc.log('cardId obj '+cardId);
    if (cardId === 0) return { idGroup: 0, idCard: 0, index: -1 };
    var id = Math.floor(cardId / 3) + 1;//2-> 9
    var group = cardId % 3 + 1;// van van sach
    return { idGroup: group, idCard: id, index: -1 };
};
cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if (pret.length > 3) {
        for (var i = pret.length - 3; i > 0; i -= 3) {
            pret = pret.insertAt(i, ".");
        }
    }
    if (number < 0) {
        return "-" + pret;
    }
    return pret;
};

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number) {
    var i = 0;
    while (number >= 1000) {
        number = Math.floor(number / 1000);
        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};


cc.Global.getSceneName = function () {
    var sceneName;
    var _sceneInfos = cc.game._sceneInfos
    for (var i = 0; i < _sceneInfos.length; i++) {
        if (_sceneInfos[i].uuid == cc.director._scene._id) {
            sceneName = _sceneInfos[i].url
            sceneName = sceneName.substring(sceneName.lastIndexOf('/') + 1).match(/[^\.]+/)[0]
        }

    }
    return sceneName;
};



cc.Global.isReconnectTable = false;
cc.Global.data = null;
cc.Global.dataRec = null;
cc.Global.dataChauRia = null;
cc.Global.onSFSLoginHandlerDataZn = null;
cc.Global.gameState = null;
cc.Global.dataSetting = null;
cc.Global.roomGroup = null;
cc.Global.roomBk = null;
cc.Global.dataRoomHandler = null;



cc.Global.COLOR_MAIN = cc.Color.BLACK;
cc.Global.COLOR_QUAN = new cc.Color("#f9f112");
cc.Color.ORANGE//new cc.Color(255, 255, 0);
cc.Global.COLOR_XU = new cc.Color(0, 255, 255);
cc.Global.COLOR_POINT = new cc.Color(102, 255, 51);
cc.Global.COLOR_PAGE1 = new cc.Color(100, 100, 100);
cc.Global.COLOR_PAGE2 = new cc.Color(220, 220, 220);
cc.Global.listEvent = cc.Global.listEvent || [];

cc.Global.zoneData = JSON.parse('{"xu":[{"index":1,"zoneName":"NhaTranh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":2,"zoneName":"SanDinh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":3,"zoneName":"VuongPhu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":7,"zoneName":"SoLoXu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":9,"zoneName":"Authen","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1}],"quan":[{"index":4,"zoneName":"NhaTranhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":5,"zoneName":"SanDinhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":6,"zoneName":"VuongPhuQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":8,"zoneName":"SoLoQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":10,"zoneName":"AutoTourKTC","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2}]}');

cc.Global.zoneDataDefault = JSON.parse('{"xu":[{"index":1,"zoneName":"NhaTranh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":2,"zoneName":"SanDinh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":3,"zoneName":"VuongPhu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":7,"zoneName":"SoLoXu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":9,"zoneName":"Authen","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1}],"quan":[{"index":4,"zoneName":"NhaTranhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":5,"zoneName":"SanDinhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":6,"zoneName":"VuongPhuQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":8,"zoneName":"SoLoQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":10,"zoneName":"AutoTourKTC","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2}]}');
cc.Global.xuDeafault = '[{"index":1,"zoneName":"NhaTranh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":2,"zoneName":"SanDinh","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":3,"zoneName":"VuongPhu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":7,"zoneName":"SoLoXu","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1},{"index":9,"zoneName":"Authen","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":1}]';
cc.Global.quanDeafault = '[{"index":4,"zoneName":"NhaTranhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":5,"zoneName":"SanDinhQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":6,"zoneName":"VuongPhuQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":8,"zoneName":"SoLoQuan","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2},{"index":10,"zoneName":"AutoTourKTC","zoneIpIos":"wschan.faco.club","zoneIp":"wschan.faco.club","zonePort":9339,"zoneStatus":1,"typeMoney":2}]'


cc.Global.roomData = cc.Global.roomData || {};
cc.Global.tableData = cc.Global.tableData || {};
cc.Global.lobbyData = cc.Global.lobbyData || {};
cc.Global.roomJoin = cc.Global.roomJoin || {};
cc.Global.tableJoin = cc.Global.tableJoin || {};
cc.Global.ZoneConfigJoin = cc.Global.ZoneConfigJoin || {};
cc.Global.cuocData = cc.Global.cuocData || {};//cuoc cua van choi khi minh join phong
cc.Global.bettingData = cc.Global.bettingData || {};//ds cuoc cua 1 zone sau khi vao`
//cc.Global.reconnectTable = cc.Global.reconnectTable || {}; //info table reconnect when mat mang,...
cc.Global.socketStatus = "NotConnected";
cc.Global.fbLoginToken = "";
cc.Global.cofferMoney = 0;
cc.Global.currentRoomName = "";
cc.Global.chargingProvider = "";
cc.Global.alreadySuggestedActivate = false;
cc.Global.currentScene = -1;
//:__: SceneManager added at 2019-07-03 09:57
cc.Global.kCurrScene = -1;
cc.Global.kPrevScene = -1;
var LoginType = LoginType || {};
LoginType.FB = 0;
LoginType.Normal = 1;
LoginType.FastLogin = 2;
cc.Global.loginType = LoginType.Normal;

var MoneyType = MoneyType || {};
MoneyType.Xu = 0;//!=2
MoneyType.Quan = 1;//2;
cc.Global.moneyType = 1;//MoneyType.Xu;

var ZoneConfig = ZoneConfig || {};
ZoneConfig.index = "1";
ZoneConfig.zoneName = "NhaTranh";
ZoneConfig.zoneIpIos = "ip40.api1chan.info";
ZoneConfig.zoneIp = "43.249.39.172";
ZoneConfig.zoneName = "NhaTranh";
ZoneConfig.zonePort = "8888";
ZoneConfig.zoneStatus = "1";
ZoneConfig.typeMoney = "1";
cc.Global.getZone = function (index, type) {
    //{"index":1,"zoneName":"NhaTranh","zoneIpIos":"chanvuong2.info","zoneIp":"chanhoaroi.com","zonePort":843,"zoneStatus":1,"typeMoney":1}
    var data = null;
    if (!cc.Global.zoneData || !cc.Global.zoneData.xu || !cc.Global.zoneData.quan) {
        //Api call. this will unnecessary.
        cc.Global.zoneData = cc.Global.zoneDataDefault;
        //cc.Global.zoneData.xu = cc.Global.xuDeafault;
        //cc.Global.zoneData.quan = cc.Global.quanDeafault;
    }
    data = cc.Global.zoneData.xu[index];
    if (type === MoneyType.Quan) {
        //quan
        data = cc.Global.zoneData.quan[index];
    }
    return data;
};

var ResultCode = ResultCode || {};
ResultCode.REGISTER_OK = 48;
ResultCode.UPDATE_NAME_ERROR = 50;
ResultCode.UPDATE_NAME_OK = 51;
//cc.winSize.screenScale = cc.winSize.width / 1280.0;
cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
if (cc.sys.isNative) {
    cc.res.font.UTM_AZUKI = "res/fonts/UTM_AZUKI.ttf";
    cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed.ttf";
    cc.res.font.Roboto_CondensedBold = "res/fonts/Roboto-BoldCondensed.ttf";
    cc.res.font.UTM_AvoBold = "res/fonts/UTM-AvoBold.ttf";
    cc.res.font.guanine = "res/fonts/guanine.ttf";
    cc.res.font.arialbd = "res/fonts/arialbd.ttf";
    cc.res.font.arial = "res/fonts/arial.ttf";
    cc.res.font.staccato = "res/fonts/staccato.ttf";
    cc.res.font.aristote = "res/fonts/aristote.ttf";
    cc.res.font.aurora = "res/fonts/aurora.ttf";
}
else {
    cc.res.font.UTM_AZUKI = "UTM_AZUKI";
    cc.res.font.Roboto_Condensed = "Roboto-Condensed";
    cc.res.font.Roboto_CondensedBold = "Roboto-BoldCondensed";
    cc.res.font.UTM_AvoBold = "UTM-AvoBold";
    cc.res.font.guanine = "guanine";
    cc.res.font.arialbd = "arialbd";
    cc.res.font.arial = "arial";
    cc.res.font.staccato = "staccato";
    cc.res.font.aristote = "aristote";
    cc.res.font.aurora = "aurora";
}
cc.res.font.font_thanga = "res/fonts/font_thanga.fnt";
cc.res.font.font_thuaa = "res/fonts/font_thuaa.fnt";

var LogOut = LogOut || {};
LogOut.back_to_login = 0;
LogOut.change_zone = 1;

var GameType = GameType || {};
GameType.NhaTranh = 0;
GameType.SanDinh = 1;
GameType.VuongPhu = 2;
GameType.SoLo = 3;

//{canU: false, cardStilt: 0, idUVanTruoc:84,listCards:arr[{idCard, idGroup, index},{}] ,turnID:84}
var StartGameData = StartGameData || {};
StartGameData.canU = false;
StartGameData.cardStilt = -1;
StartGameData.idUVanTruoc = -1;
StartGameData.turnID = -1;
StartGameData.listCards = [];

var PlayerMe = PlayerMe || {};
PlayerMe.exp = 11000;
PlayerMe.vipExp = 1000;
PlayerMe.level = 100;
PlayerMe.money = 10000;
PlayerMe.name = "hiep1";
PlayerMe.playTypeMoney = MoneyType.Quan;
PlayerMe.realMoney = 1000;
PlayerMe.total = 23213;
PlayerMe.uid = 1;
PlayerMe.viewname = "kaka167";
PlayerMe.win = 2289;
PlayerMe.SFS = {};
PlayerMe.activated = 0;
PlayerMe.dataReady = false;

var GameConfig = GameConfig || {};
GameConfig.email = "chanbachthu@gmail.com";
GameConfig.hotline = "09000123";
GameConfig.broadcastMessage = "Thông báo";
GameConfig.DeviceIDKey = "";

var GameSetting = GameSetting || {};
GameSetting.sound = "sound";
GameSetting.rejectInvite = "rejectInvite";
GameSetting.u411 = "u411";
GameSetting.fast = "fast";
GameSetting.slow = "slow";
GameSetting.autoReady = "autoReady";

var LevelData = [{
    "exp": 0,
    "content": "Chưa đổi thưởng"
},
{
    "exp": 1000,
    "content": "test"
},
{
    "exp": 2000,
    "content": "test content"
},
{
    "exp": 3000,
    "content": "test content"
},
{
    "exp": 4000,
    "content": "test content"
},
{
    "exp": 5000,
    "content": "test content"
},
{
    "exp": 6000,
    "content": "test content"
},
{
    "exp": 7000,
    "content": "test content"
},
{
    "exp": 8000,
    "content": "test content"
},
{
    "exp": 9000,
    "content": "test content"
},
{
    "exp": 10000,
    "content": "test content"
},
{
    "exp": 11000,
    "content": "max level"
}
];
var VipData = [{
    "exp": 0,
    "content": "test"
},
{
    "exp": 1000,
    "content": "test"
},
{
    "exp": 2000,
    "content": "test content"
},
{
    "exp": 3000,
    "content": "test content"
},
{
    "exp": 4000,
    "content": "test content"
},
{
    "exp": 5000,
    "content": "test content"
},
{
    "exp": 6000,
    "content": "test content"
},
{
    "exp": 7000,
    "content": "test content"
},
{
    "exp": 8000,
    "content": "test content"
},
{
    "exp": 9000,
    "content": "test content"
},
{
    "exp": 10000,
    "content": "test content"
},
{
    "exp": 11000,
    "content": "test content"
}
];
cc.Global.GetLevel = function (exp) {
    var preLevel = LevelData[0];
    for (var i = 1; i < LevelData.length; i++) {
        var obj = LevelData[i];
        if (exp >= preLevel.exp && exp < obj.exp) {
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level: i - 1,
                expPer: expPer,
                content: preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level: LevelData.length - 1,
        expPer: 100.0,
        content: preLevel.content
    };
};
cc.Global.GetVip = function (exp) {
    var preLevel = VipData[0];
    for (var i = 1; i < VipData.length; i++) {
        var obj = VipData[i];
        if (exp >= preLevel.exp && exp < obj.exp) {
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level: i - 1,
                expPer: expPer,
                content: preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level: VipData.length - 1,
        expPer: 100.0,
        content: preLevel.content
    };
};

cc.Global.GetLevelMe = function () {
    return cc.Global.GetLevel(PlayerMe.exp);
};
cc.Global.GetVipMe = function () {
    return cc.Global.GetVip(PlayerMe.vipExp);
};

cc.Global.GetSetting = function (setting, defaultValue) {
    var value = cc.sys.localStorage.getItem(JSON.stringify(setting));
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
};
cc.Global.SetSetting = function (setting, value) {
    cc.sys.localStorage.setItem(JSON.stringify(setting), JSON.stringify(value));
    cc.log("localStorage: ", cc.sys.localStorage);
};

var ApplicationConfig = ApplicationConfig || {};
ApplicationConfig.VERSION = "1.0.0";
ApplicationConfig.BUNBLE = "com.gts.chan";
(function () {
    if (cc.sys.os === cc.sys.OS_IOS) {
        ApplicationConfig.PLATFORM = 1;
    }
    else if (cc.sys.os === cc.sys.OS_ANDROID) {
        ApplicationConfig.PLATFORM = 2;
    }
    else if (cc.sys.os === cc.sys.OS_WINRT) {
        ApplicationConfig.PLATFORM = 3;
    }
    else if (cc.sys.os === cc.sys.OS_WINDOWS) {
        ApplicationConfig.PLATFORM = 3;
    }
    else {
        ApplicationConfig.PLATFORM = 3;
    }
})();

cc.Global.NodeIsVisible = function (node) {
    while (node) {
        if (!node.visible) {
            return false;
        }
        node = node.getParent();
    }
    return true;
};

cc.Global.Appellations = [{ level: 1, name: "Dân Đen", color: new cc.Color(200, 0, 0) }, { level: 2, name: "Phụ Hồ", color: new cc.Color(255, 0, 0) }, { level: 3, name: "Tiểu Nhị", color: new cc.Color(255, 0, 60) },
{ level: 4, name: "Cai Đội", color: new cc.Color(255, 0, 120) }, { level: 5, name: "Phú Ông", color: new cc.Color(255, 0, 180) }, { level: 6, name: "Địa Chủ", color: new cc.Color(255, 0, 240) },
{ level: 7, name: "Hương Trưởng", color: new cc.Color(210, 0, 255) }, { level: 8, name: "Lý Trưởng", color: new cc.Color(0, 200, 255) }, { level: 9, name: "Tri Huyện", color: new cc.Color(0, 255, 255) },
{ level: 10, name: "Tri Phủ", color: new cc.Color(0, 255, 200) }, { level: 13, name: "Tuần Phủ", color: new cc.Color(0, 255, 140) }, { level: 18, name: "Tổng Đốc", color: new cc.Color(0, 255, 80) },
{ level: 28, name: "Đề Đốc", color: new cc.Color(0, 255, 20) }, { level: 40, name: "Thượng Thư", color: new cc.Color(30, 255, 0) }, { level: 53, name: "Đô Đốc", color: new cc.Color(80, 255, 0) },
{ level: 70, name: "Thái Sư", color: new cc.Color(130, 255, 0) }, { level: 162, name: "Thừa Tướng", color: new cc.Color(80, 255, 0) }, { level: 287, name: "Tể Tướng", color: new cc.Color(225, 255, 0) },
{ level: 662, name: "Vương Gia", color: new cc.Color(255, 225, 0) }];

cc.Global.GetAppellationByLevel = function (level) {
    var i = 0;
    while (i < cc.Global.Appellations.length && level >= cc.Global.Appellations[i].level) i++;
    return cc.Global.Appellations[level == 0 ? 0 : i - 1];
};

cc.Global.getFeedbackUrl = function () {
    var key = "#asa367GH!@$^^#})pQ";
    var suid = "?uid=" + PlayerMe.uid;
    var sname = "&username=" + PlayerMe.name;
    var smd5 = "&sign=" + md5(suid + PlayerMe.name + key);
    var url = FEEDBACK_URL + suid + sname + smd5;
    return url;
};

cc.Global.isMobileRunning = function () {
    // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent) ) {
    //
    // }
    var ua = navigator.userAgent;
    return ua.match(/(iPhone|iPod|iPad)/) || ua.match(/Android/);
};

cc.Global.openSMSActive = function () {
    if (cc.Global.isMobileRunning()) {
        var index1 = HostConfig.smsKH.indexOf("uid");
        var index2 = HostConfig.smsKH.lastIndexOf(' ');
        var content1 = HostConfig.smsKH.substring(0, index1);
        var content2 = HostConfig.smsKH.substring(index2);
        cc.sys.openURL("sms:" + content2 + "?body=" + content1 + PlayerMe.uid);
    }
};

cc.Global.cropLabel = function (label, width, concise) {
    var isCut = false;
    var str = label.getString();
    while (label.getContentSize().width > width) {
        str = str.substr(0, str.length - 1);
        label.setString(str);
        isCut = true;
    }
    if (isCut) {
        if (!concise) str += "..";
        label.setString(str);
    }
};

cc.Global.getLocalTimeStringByMillis = function (millis) {
    var d = new Date();
    d.setTime(millis);
    return d.toTimeString().substring(0, 8);
};

cc.Global.getCountTimeStringByMillis = function (millis) {
    if (millis <= 0) return "00:00:00";
    var lsecs = Math.round(millis / 1000).toFixed(0);
    // var hour = (lsecs / 3600).toFixed(0);
    var hour = Math.floor(lsecs / 3600);
    lsecs %= 3600;
    // var min = (lsecs / 60).toFixed(0);
    var min = Math.floor(lsecs / 60);
    var test = lsecs / 60;

    var sec = lsecs % 60;
    var shour = (hour < 10 ? "0" : "") + hour;
    var smin = (min < 10 ? "0" : "") + min;
    var ssec = (sec < 10 ? "0" : "") + sec;
    return smin + ":" + ssec; //m:s
    // return shour + ":" + smin + ":" + ssec; //H:m:s
};

cc.Global.isTourGame = function () {
    return cc.Global.gameId == 4;
};
cc.Global.getDeviceName = function () {
    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
        device = "android";
    } else {
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            device = "ios";
        } else {
            if (cc.sys.isBrowser) {
                device = "web";
            }
        }

    }
}

//Bida
cc.Global.tableArray = [];
cc.Global.typeCard = "";
cc.Global.ZONE_GAME = 0; //0 la binh 1 thuong, 1 la minigame, 2 la vqmm
cc.Global.bidaMoneyType = 1;
cc.Global.unSeenMail = 0;
cc.Global.userOnline = null;
cc.Global.goldColor = cc.Color.YELLOW;
cc.Global.silverColor = cc.color("#07ACFF");
cc.Global.setColorMoney = function (node) {
    if (cc.Global.bidaMoneyType == 1) {
        node.color = cc.Global.goldColor;
    } else {
        node.color = cc.Global.silverColor;
    }
}
cc.Global.instanceLoading = function (cb) {
    if (!cc.Global.loadingPrefab) {
        cc.resources.load("chan/prefab/dialog/LoadingDialog", cc.Prefab, function (completedCount, totalCount, item) {
        }, function (err, prefab) {
            if (!err) {
                cc.Global.loadingPrefab = prefab;
                if (cb) {
                    cb(null, prefab);
                }
            } else {
                if (cb) {
                    cb(true, null);
                }
            }
        });
    }
}

cc.Global.showLoading = function () {
    if (cc.Global.loadingPrefab) {
        var dialog = cc.instantiate(cc.Global.loadingPrefab);
        dialog.setPosition(0, 0);
        cc.find('Canvas').addChild(dialog, cc.macro.MAX_ZINDEX);
    }
}

cc.Global.hideLoading = function () {
    var nodes = cc.find('Canvas').children;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name == "LoadingDialog") {
            nodes[i].removeFromParent(true);
            i--;
        }
    }
}

cc.Global.initSystemMessage = function (cb) {
    if (!cc.Global.systemMessagePrefab) {
        cc.resources.load("bida/prefabs/Home/SystemMessage", cc.Prefab, function (completedCount, totalCount, item) {
        }, function (err, prefab) {
            if (!err) {
                cc.Global.systemMessagePrefab = prefab;
                if (cb) {
                    cb(null, prefab);
                }
            } else {
                if (cb) {
                    cb(true, null);
                }
            }
        })
    }
}

cc.Global.showMessage = function (message) {
    if (cc.Global.systemMessagePrefab) {
        var popup = cc.instantiate(cc.Global.systemMessagePrefab);
        popup.getComponent("SystemMessage").initMessage(message);
        cc.Canvas.instance.node.addChild(popup, cc.macro.MAX_ZINDEX);
        popup.y = cc.Canvas.instance.node.height / 2;
    } else {
        cc.Global.initSystemMessage(function (err2, prefab2) {
            if (!err2) {
                var popup = cc.instantiate(cc.Global.systemMessagePrefab);
                popup.getComponent("SystemMessage").initMessage(message);
                cc.Canvas.instance.node.addChild(popup, cc.macro.MAX_ZINDEX);
                popup.y = cc.Canvas.instance.node.height / 2;
            }
        });
    }
}

cc.Global.EmojiClip = [];
cc.Global.findClip = function (name) {
    var foundClip;
    for (var clip of cc.Global.EmojiClip) {
        if (clip.name == name) {
            foundClip = clip;
            break;
        }
    }
    return foundClip;
}
cc.Global.loadClip = function () {
    cc.resources.loadDir("bida/anim/emoji", cc.AnimationClip, (error, clipArr, urlArr) => {
        if (!error) {
            cc.Global.EmojiClip = clipArr;
        } else {
            cc.error("Fail to load clip");
        }
    })
}
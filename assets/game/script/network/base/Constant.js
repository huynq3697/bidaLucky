var Constant = {};

Constant.TableStatus = {
    PLAY: 1,
    FULL: 2,
    WAIT: 3,
    NEW: 4,
};

Constant.IAP_MONEY = {
    IAP1: 20000000,
    IAP2: 50000000,
    IAP3: 100000000,
};

Constant.PLAY_TYPE = {
    BALL_1: 0,
    BALL_2: 1,
};

Constant.SEPERATOR = {
    ELEMENT: '\u0001',
    ARRAY: '\u0002',
    DIFF_ARRAY: '\u0003',
    N4: '\u0004',
    N5: '\u0005',
};

Constant.TAI_XIU = {
    JOIN_TAI_XIU: "12004",
    UPDATE_TAI_XIU: "12005",
    BET_TAI_XIU: "12006",
    PHIEN_TX_STATE: "12009",
    CHAT_TAI_XIU: "12012",
    API_SOI_CAU: "http://apic100.chan100.net/api-soicau",
    API_aLICH_SU: "http://apic100.chan100.net/api-tx-my-fire",
};

Constant.CMD = {

    ON_CONNECTION: "ON_CONNECTION",
    LOST_CONNECTION: "LOST_CONNECTION",
    ONCHANGE_AVATAR: "ONCHANGE_AVATAR",
    ON_GET_PHONE_NUMBER: "ON_GET_PHONE_NUMBER",

    CONFIG_DATA: "14004",
    XOCDIA_BET: "13006",
    XOCDIA_CANCUA: "13007",
    XOCDIA_REQUEST_OWNER: "13008",
    XOCDIA_DUOICUA: "13009",
    XOCDIA_BANCUA: "13001",
    XOCDIA_MUACUA: "13002",
    XOCDIA_OWNER_CANCUA: "13003",
    XOCDIA_HISTORY: "13004",
    XOCDIA_LOST_CONNECT: "132203",
    AGENCY_LIST: "12011",
    CHANGE_NAME: "14000",
    ZONE_LIST: "14001",
    DATA_EVENT: "14002",

    CANCEL_TAIXIU: "12008",
    LAST_MATCH_TX: "12010",
    BET_MONEY_TX: "12006",
    IAP: "12003",
    GET_XU: "203",
    QUANG_CAO: "51",
    GET_PI: "50",
    GET_GUITANG: "54",
    CACHE_ROOM: "55",
    GET_EVENT: "57",
    JOIN_TAI_XIU: "12004",
    GET_MAIL_LIST: "400002",
    GET_MAIL_DETAIL: "400003",
    GET_EVENT_DETAIL: "58",
    GET_EVENT_IMAGE: "59",
    ALTP_CAUHOI: "60",
    ALTP_ANSWER: "62",
    ALTP_HELP: "61",
    ALTP_OK: "63",
    DHBC_XONG: "65",
    MOI_CHOI: "71",
    ACCEP_MOI_CHOI: "72",
    TU_CHOI_ALL: "75",
    CACHE_IMAGE: "76",
    GET_ACCOUNT: "78",
    DELETE_MESSAGE: "79",
    VONG_QUAY: "80",
    LIST_ACHIEVEMENT: "81",
    LIST_DETAIL: "82",
    GET_GIFT_CODE: "83",
    LOTO_LIST_XS: "90",
    LOTO_CONTENT: "91",
    LOTO_PUT: "92",
    LOTO_HISTORY: "93",
    QUAY_LAI_GD: "200",
    CHAT_GD: "201",
    HISTORY_GD: "202",
    LOGIN: "1000",
    FAST_LOGIN: "10001",
    FB_LOGIN: "100001",
    DELETE_ACCOUNT: "1001",
    CHANGE_PSW: "10901",
    INVITE_INSTALL: "12001",
    GIFT_CODE: "12000",
    UPDATE_PHONE_ACCOUNTKIT: "12014",
    USER_LOG: "14003",
    ADMOB: "12015",
// 1100
    REGISTER_ACCOUNT: "1115",
    MATCH_NEW: "1100",
    MATCH_INVITED: "1101",
    MATCH_REPLY: "1102",
    MATCH_CANCEL: "1103",
    MATCH_TURN: "1104",
    MATCH_JOIN: "1105",
    MATCH_JOINED: "1106",
    NEW_ENTER_ZONE: "110701",
    ENTER_ZONE: "1107",
    TRANSFER: "12010",
// send and get back from server game's start if true game started
    MATCH_START: "1108",
    MATCH_STARTED: "1109",
    MATCH_READY: "1110",
    GET_POKER: "1112",
    MATCH_RESTART: "1113",
    MATCH_END: "1114",
    OUT: "1116",
    KICK_OUT: "1117",
    ADD_FRIEND_BY_NAME: "1122",
    UPDATE_USER_INFO: "1123",
    SUGGESTION: "1124",
// Phom - book
    BOC_PHOM: "1125",
    AN_PHOM: "1126",
    HA_PHOM: "1127",
    GUI_PHOM: "1128",
    MATCH_TIMEOUT: "1129",
    SET_MINBET: "1130",
// 1200
// lists
    GET_AVATAR_LIST: "1202",
    GET_FRIEND_LIST: "1203",
    ADD_FRIEND: "1204",
    REMOVE_FRIEND: "1205",
    TRANSFER_CASH: "1206",
    GET_RICHESTS: "1207",
    TOP_EXPEST: "1208",
    GET_MOST_PLAYING: "1209",
    GET_USER_INFO: "1210",
    GET_FREE_USER_LIST: "1212",
    JOIN_PLAYER: "1213",
    ACCEPT_JOIN_PLAYER: "1214",
    MATCH_PEACE: "1215",
    MATCH_PEACE_ACCEPT: "1216",
    MATCH_LOST: "1217",
    PING: "1",
    EXPIRE: "9999",
    ENTER_ZONE_NEW: "1240",
    GET_TABLES: "1241",
    FAST_PLAY: "1246",
    SETTING_GAME: "1242",
    SEND_MESSAGE: "1247",
    GET_MESSAGE: "1248",
    UPLOAD_AVATAR: "2",
    GET_IMAGE: "1250",
    OUT_TABLE: "1252",
// 1300
// chat
    CHAT: "1300",
    CHAT_PRIVATE: "1301",
// 1400
// Buy
    BUY_AVATAR: "1400",
// 1500
    POST_LIST: "1500",
    POST_DETAIL: "1501",
    POST_NEW: "1502",
    COMMENT_POST: "1503",
    OFFLINE_MESSAGE: "1504",
    LOGOUT: "1505",
    GET_CHARGING: "1506",
    READ_MESSAGE: "1507",
    CONFIRM: "1508",
    WARNING: "1509",
// 1600
// LINE
// update game
    LINE_EAT: "1600",// match id, so quan an number
    SEND_MY_LINE: "1601",// gui man hinh cua minh

    LINE_END_MATCH: "1602",// match id, man hinh cua no,
// thang thua,
    REQUEST_LINE: "1603",// request Line: match_id, tra
    // ve chinh la man hinh cua doi
    // phuong
    PIKACHU_HELP: "1604",
// for News
    FINISH_PUT_MONEY: "2000",
    QUAY_DIA: "1245",
    Challenge: "2001",
    NAPTIEN: "4000",
    CANCEL_TO: "2003",
    REJECTPUTMONEY_TO_BIEN: "2004",
    GET_BEST_EVENT: "3000",
// EURO
    BEST_EURO: "3501",
    HISTORY_BEST_EURO: "3504",
    DETAIL_BEST_EURO: "3505",
    LIST_TRAN_BD: "3500",
    KQ_GIAI_BD: "3506",
    LIST_GIAI_BD: "3507",
    TOP_RICH_EURO: "3503",
    LIST_GIAI_DAU: "17000",
    DK_GIAI_DAU: "17001",
    LG_GIAI_DAU: "17002",
    TOP_GIAI_DAU: "17003",
    INFO_GIAI_DAU: "17004",
    RECONNECTION: "3",
// for VIVU
    VIVU_SET_AREA: "8001",
    VIVU_MOVE: "8003",
    VIVU_STATUS: "8004",
    VIVU_CHAT: "8005",
    VIVU_TRADE: "8006",
    VIVU_REMOVE_USER: "8007",
    VIVU_GET_GROUP: "8008",
    VIVU_CHANGE_GROUP: "8009",
    VIVU_APPEAR: "8010",
    VIVU_GET_ITEMS: "5",
    VIVU_BUY_ITEMS: "6",
// EURO
    GET_BEST_EURO: "3500",
    TOP_EURO: "3502",
// MXH
    LIST_BLOG: "7000",
    GET_BLOG: "7001",
    GET_POST: "7002",
    CREATE_POST: "7003",
    UPDATE_POST: "7004",
    INSERT_COMMENT: "7020",
    GET_LIST_ALBUM: "7030",
    GET_ALBUM: "7031",
    GET_ICON: "7032",
    GET_IMAGE_ALBUM: "7034",
    GET_IMAGE_DETAIL: "7035",
    NEW_ALBUM: "7033",
// chat
    CHAT_GET_LIST: "7036",
    CHAT_ENTER: "7037",
    CHAT_SEND_MESS_ROOM: "7038",
    CHAT_LIST_USER: "7039",
    CHAT_OUT_ROOM: "70",
// common
    SET_AVATAR: "7040",
    GET_AVATAR: "7041",
    ADD_FRIEND_BLOG: "7010",
    GET_LIST_REQUEST_FRIEND: "7051",
    GET_WALL: "7045",
    ADD_LIKE: "7047",
    GET_LIST_COMMENT: "7046",
    GET_TOP_ALBUM: "7055",
    GET_TOP_BLOG: "7054",
    GET_TOP_BLOGER: "7053",
    GET_NEW_BLOG: "7052",
    GET_NEW_ALBUM: "94",
    FLOW_USER: "95",
    GET_BOARD: "96",
    LIST_DUTIES: "97",
    DETAIL_DUTIES: "98",
    ReceiveDuty: "103",
    ResultDuty: "100",
    DoneDuty: "99",
    GAME_OTHER: "101",
    Recommend: "102",

    GET_TOP_IMAGE: "7056",
    GET_FRIEND_LIST_BLOG: "7057",
    DELETE_ITEM: "7050",
    GET_NUM_MESS: "7062",
    UPDATE_USER_MXH: "7063",
    UPDATE_CASH_AFTER_CHARGED: "121002",
    UPDATE_WHEN_WITHDRAW_MONEY: "121010",
// news
    NEWS_CATEGORY: "7058",
    NEWS_TITLES: "7059",
    NEWS_DETAIL: "7060",
    NEWS_IMAGE: "7061",
// boi
    VIVU_BOI: "251",
// city,job
    VIVU_CITY: "4",
    GET_USER_VIVU: "7",
    FIND_USER_VIVU: "8",
    POST_WALL: "7044",
// SWITCH :"9003",
    BAO_SAM: "1131",

    RE_PASSWORK: "109",

    PIKA_TOPIC: "262",
    PIKA_DETAIL_TOPIC: "263",

    REWARD_LIST: "253",
    GET_REWARD_CASH: "254",

    PARNER_ID: "1",

    GET_LIST_FREE: "1212",
    GET_PLAYER_INFO: "121001",
    CHANGE_PLAYER_INFO: "1123",
    UPDATE_FB_SHARE: "121003",
    GIFT_BOX: "5701",

    OVER_ASK: "160401",
    ITEM_VATPHAM: "2",
    ITEM_CARD: 1,
    GET_ITEM_SHOP: "400004",
    GET_ORDER_HISTORY: "400007",
    UPDATE_PHONE: "400008",
    ITEM_ORDER: "400005",
    CANCEL_ITEM_ORDER: "400006",

    SORT_DONE: "1245",
    BAO_MAU_BINH: "121005",
    SO_CHI: "121006",
    SO_SAP_HAM: "121009",

    GUEST_JOIN: "121007",
    GUEST_STAND: "121008",
// VQMM
    VQMM_PLAY: "80",
};

module.exports = Constant;


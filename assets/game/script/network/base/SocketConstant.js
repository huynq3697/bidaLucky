const COMMON = {
    LOGIN: 1000,
    LOGIN_FB: 100001,
    REGISTER: 1115,
    PLAY_ENTER_ZONE: 110701,
    NEW_ROOM: 1100,
    GUEST_JOIN: 121007,  
    RECONNECT: 3,
    GET_BEST_PLAYER: 1208,
    GET_LIST_EVENT: 57,
    GET_USER_DATA: 121001,
    UPDATE_USER_INFO: 1123,
    UPDATE_CRASH: 121002,
    OUT: 1116,
    CHANGE_SETTING: 1242,
    CHANGE_VIEW_NAME: 14000,
    LIST_ZONE_GAME: 14001,
    UNSEEN_MAIL: 14002,
    LIST_CARD_SMS: 1506,
    RECHARGE_CARD: 4000,
    LIST_ITEM_BONUS: 400004,
    BONUS: 400005,
    ORDER_HISTORY: 400007,
    CANCEL_ORDER: 400006,
    FAST_LOGIN: 10001,
    PLAY_HISTORY: 14003,
    LIST_MAIL: 400002,
    READ_MAIL: 400003,
    GIFT_CODE: 254,
    LIST_AVATAR: 1202,
    CHANGE_AVATAR: 2,
    SYSTEM_MESSAGE : 2016020,
    CONFIG_DATA: 14004,//add by zep, get 
    UPDATE_PHONE: 12014,//add by zep
    SESSION_EXPIRED: 9999,
    IAP: 400001,

};
const CONFIG = {
    SOCKET_URL: "",
    SOCKET_PORT: 80,
};
const GAME = {
    TAI_XIU: {
        JOIN_TAI_XIU: 12004,
        UPDATE_TAI_XIU: 12005,
        BET_TAI_XIU: 12006,
        PHIEN_TX_STATE: 12009,
        CHAT_TAI_XIU: 12012,
        API_SOI_CAU: "http://apic100.chan100.net/api-soicau",
        API_aLICH_SU: "http://apic100.chan100.net/api-tx-my-fire",
        
        
    },
    SLOT: {
        LIST_TONG_TIEN_HU: 1004,
        SPIN: 1005,
        LIXI: 1006,
        API_HISTORY_HU: "http://api.chanhoaroi.com/api-hu-rong-history",
        API_EVENT_HOME: "http://apiking.king52.club/api-events",
        GET_ALL_LIXI: 1000000,
        GET_ONE_LIXI: 1
    },
    XOC_DIA: {
        JOIN_SOC_DIA: 110701,
        BET_XOC_DIA: 13006,
        XIN_LAM_NHA_CAI: 13008,
        DUOI_CUA: 13009,
        BAN_CUA: 13001,
        MUA_CUA: 13002,
        NHA_CAI_CAN_CUA: 13003,
        TONG_TIEN: 2000,
        BAT_DAU_CHOI: 1108,
        KHI_DAT_CUA: 13006,
        CAN_CUA: 13007,
        END_MATCH: 1114,
        MATCH_HISTORY: 13004,
        
    },
    PHOM: {
        TURN: 1104,
        BOC_PHOM: 1125,
        AN_PHOM: 1126,
        HA_PHOM: 1127,
        CANCEL: 1103,
        GUI_PHOM: 1128,
        GET_POKER: 1112,
        END_MATCH: 1114,
        JOIN: 1105,
        READY: 1110,
        START: 1108,
        JOINED: 1106,

    },
    MINIPOKER: {
        SPIN: 1008,
        INFO: 1009,
    },
    MAU_BINH: {
        
    }
};
const TABLE_USER = {
    THUONG: 0,
    KHOA: 6,
    DAI_LY_CAP_1: 7,
    DAI_LY_CAP_2: 8,
    BOT: 9
    
};
const SEPERATOR = {
    ELEMENT: "\u0001",
    ARRAY: "\u0002",
    DIFF_ARRAY: "\u0003",
    N4: "\u0004",
    N5:"\u0005",
}


module.exports = {
    COMMON: COMMON,
    CONFIG: CONFIG,
    SEPERATOR: SEPERATOR,
    TABLE_USER: TABLE_USER,
    GAME: GAME
}
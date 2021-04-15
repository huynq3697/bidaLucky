var PopupBuyStickAndTableConfig= {
    TAB_STICK_INDEX: 0,
    TAB_TABLE_INDEX: 1,
    ITEM_WITH_TAB: [10,10]
}

var PopupBuyStickConfig= {
    ON_CHANGE_EVENT_CLICK: "ON_CHANGE_EVENT_CLICK_PopupBuyStickConfig",
    NUMBER_ITEM: 10,
    DATA:[
        {
            money:0,
            description:"Normal"
        },
        {
            money:10*1000*1000,
            description:"Alien"
        },
        {
            money:20*1000*1000,
            description:"Viking"
        },
        {
            money:50*1000*1000,
            description:"Love"
        },
        {
            money:100*1000*1000,
            description:"Lucky"
        },
        {
            money:200*1000*1000,
            description:"Light"
        },
        {
            money:500*1000*1000,
            description:"Frozen"
        },
        {
            money:1000*1000*1000,
            description:"Thunder"
        },
        {
            money:2*1000*1000*1000,
            description:"Sun"
        },
        {
            money:5*1000*1000*1000,
            description:"Dragon"
        },
    ]
}

var PopupBuyTableConfig = {
    ON_CHANGE_EVENT_CLICK: "ON_CHANGE_EVENT_CLICK_PopupBuyTableConfig",
    NUMBER_ITEM: 8,
    DATA:[
        {
            money:0,
            description:"Normal"
        },
        {
            money:10*1000*1000,
            description:"Wood"
        },
        {
            money:20*1000*1000,
            description:"Bronze"
        },
        {
            money:50*1000*1000,
            description:"Silver"
        },
        {
            money:100*1000*1000,
            description:"Asia"
        },
        {
            money:200*1000*1000,
            description:"Viking"
        },
        {
            money:500*1000*1000,
            description:"Alien"
        },
        {
            money:1000*1000*1000,
            description:"Joker"
        },       
    ]
}

var POPUP_ZORDER = 1000;
module.exports = {
    POPUP_ZORDER:POPUP_ZORDER,
    PopupBuyStickAndTableConfig:PopupBuyStickAndTableConfig,
    PopupBuyStickConfig:PopupBuyStickConfig,
    PopupBuyTableConfig:PopupBuyTableConfig
};
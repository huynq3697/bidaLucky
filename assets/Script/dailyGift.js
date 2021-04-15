var functionAll = require('functionAll');
var DataManger = require('DataManger');
var i18n = require('i18n');
var startTimer = function(duration, display) {
    var start = Date.now();
    var minutes, seconds, hour, diff;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);
        minutes = (diff / 60) | 0;
        hour = Math.floor(minutes / 60) | 0;
        // minutes = (minutes / 60) | 0;
        seconds = (diff % 60) | 0;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.string = i18n.t("Bonus in ") + hour + ":" + minutes + ":" + seconds;

        if (diff <= 0)
        {
            start = Date.now() + 1000;
        }
    };
    timer();
    setInterval(timer, 1000);
}
cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        textTime: cc.Label,
        btnGet: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        var setting = this.func.getData("setting");
        var date = setting.time;
        var curDate = {
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        }
        if (!date)
        {
            this.btnGet.active = true;
            return;
        }
        if (date.hour <= curDate.hour && date.minutes <= curDate.minutes && date.seconds < curDate.seconds)
        {
            this.btnGet.active = true;
        }
        else
        {
            this.btnGet.active = false;
            this.countdown();
        }
    },

    onDisable() {
        clearInterval(this.x);
    },
    start () {
    },

    // update (dt) {},

    getMoney: function (event) {
        //startTimer(60 * 60 * 24, this.textTime);
        this.btnGet.active = false;
        var setting = this.func.getData("setting");
        var date = {
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        }

        setting.time = date;
        DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY);
        this.dailyGift.active = false;
    },

    countdown: function () {
        var setting = this.func.getData("setting");
        var date = setting.time;
        cc.error(date.hour + ":" + date.minutes + ":" + date.seconds);
        var curDate = {
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        };
        cc.error(curDate.hour + ":" + curDate.minutes + ":" + curDate.seconds);
        var seconds = 60 - (parseInt(curDate.seconds) + parseInt(date.seconds)),
        minutes = 59 - (parseInt(curDate.minutes) - parseInt(date.minutes)),
        hour = 23 - (parseInt(curDate.hour) - parseInt(date.hour));
        this.x = setInterval(() => {
            if (minutes == 60 && seconds == 60 && hour == 23)
            {
                this.btnGet.active = true;
                clearInterval(x);
                return;
            }
            if (date.hour <= curDate.hour && date.minutes <= curDate.minutes && date.seconds < curDate.seconds)
            {
                this.btnGet.active = true;
                clearInterval(this.x);
                return;
            }
            else
            {
                seconds = parseInt(seconds) - 1;
                if (seconds < 0)
                {
                    seconds = 59;
                    minutes = parseInt(minutes) - 1;
                    if (minutes < 0)
                    {
                        minutes = 59;
                        hour = parseInt(hour) - 1;
                        if (hour < 0)
                        {
                            hour = "00";
                        }
                        else if (hour < 10)
                        {
                            hour = "0" + hour;
                        }
                    }
                    else if (minutes < 10)
                    {
                        minutes = "0" + minutes;
                    }
                }
                else if (seconds < 10)
                {
                    seconds = "0" + seconds;
                }

            }
            this.textTime.string = i18n.t("Bonus in ") + hour + ":" + minutes + ":" + seconds;
        }, 1000);
    },
    clickGet: function() {
        this.dailyGift.active = true;
        this.btnGet.active = true;
    }
});

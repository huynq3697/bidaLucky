export var singlePatternMoney = (function() {
    var instance;
    function init() {
        var money = 0;
        return {
            setMoney: function (x) {
                money = x;
            },
            getMoney: function() {
                return money;
            }
        };

    }
    return {
        getInstance: function() {
            if (!instance)
                instance = init();
                return instance;
        }
    }
})();



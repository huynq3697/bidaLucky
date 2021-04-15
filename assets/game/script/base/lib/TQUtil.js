var TQUtil = {

    trimUsername: function (str, leng) {
        if (str === undefined) {
            return "";
        }
        if (leng === undefined) {
            leng = 12;
        }

        if (str.length > leng) {
            str = str.slice(0, leng);
        }

        return str;
    },

    loadAvatar(avaSprite, filename) {
        cc.log('ava: ', filename);
        if (filename === undefined) {
            filename = '';
        }

        var idAva = filename.split('.').slice(0, -1).join('.');
        var ava = parseInt(idAva);
        if (isNaN(ava)) {
            ava = 0;
        }
        const path = 'avatar/' + ava;

        cc.resources.load(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                avaSprite.spriteFrame = spriteFrame;
            }
        });
    },

    dec2hex(dec) {
        return ('0' + dec.toString(16)).substr(-2)
    },

    generateId(len) {
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, this.dec2hex).join('')
    },

    getWebDeviceID() {
        var did = cc.sys.localStorage.getItem("web_device_id");
        if (did == null) {
            did = this.generateId();
        }

        cc.sys.localStorage.setItem("web_device_id", did);

        return did;
    },

    parseInt: function (digits) {
        var num = parseInt(digits);

        if (isNaN(num)) {
            num = 0;
        }

        return num;
    },

    addDot: function (value) {
        var i = 3;
        var longMoney = value | 0;
        var absMoney = Math.abs(longMoney);
        var temp = absMoney.toString();

        while (i < temp.length) {
            var position = temp.length - i;
            temp = [temp.slice(0, position), ".", temp.slice(position)].join('');
            i = i + 3 + 1;
        }

        if (longMoney < 0) {
            var txtArray = temp.split('');
            txtArray.splice(0, 0, "-");
            temp = txtArray.join('');
        }

        return temp;
    },

    abbreviate: function (number, decPlaces) {
        // 2 decimal places => 100, 3 => 1000, etc
        decPlaces = Math.pow(10, decPlaces || 2);

        // Enumerate number abbreviations
        var abbrev = ['K', 'M', 'B', 'T'],
            str = (number < 0) ? '-' : '',
            size;

        number = Math.abs(number);

        // Go through the array backwards, so we do the largest first
        for (var i = abbrev.length - 1; i >= 0; i -= 1) {
            // Convert array index to '1000', '1000000', etc
            size = Math.pow(10, (i + 1) * 3);
            // If the number is bigger or equal do the abbreviation
            if (size <= number) {
                // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                // This gives us nice rounding to a particular decimal place.
                number = Math.floor(number * decPlaces / size) / decPlaces;
                // Handle special case where we round up to the next abbreviation
                if ((number === 1000) && (i < abbrev.length - 1)) {
                    number = 1;
                    i += 1;
                }
                // Add the letter for the abbreviation
                number += abbrev[i];
                // We are done... stop
                break;
            }
        }
        return str + number;
    },
};

module.exports = TQUtil;
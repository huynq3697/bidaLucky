const Polyglot = require('polyglot');

let data = cc.sys.language === 'en' ? require('en') : require('vi');
// let polyglot = null;
let polyglot = new Polyglot({phrases: data, allowMissing: true});


module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init (language) {
        var lang = language;
        // switch(lang) {
        //     case 'vi': {
        //         data = require(lang);
        //         break;
        //     }
        //     case 'en': {
        //         data = require(lang);
        //         break;
        //     }
        //     case 'ru': {
        //         data = require(lang);
        //         break;
        //     }
        //     case 'zh': {
        //         data = require(lang);
        //         break;
        //     }
        //     default: {
        //         data = require('vi');
        //         break;
        //     }
        // }
        data = require(lang);
        polyglot.replace(data);
    },
    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     *
     * var myText = i18n.t('MY_TEXT_KEY');
     *
     * // if your data source is defined as
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t (key, opt) {
        return polyglot.t(key, opt);
    }
};
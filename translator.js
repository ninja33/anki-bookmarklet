class Translator {
    constructor() {
        this.word = "";
        this.defs = {};
    }

    isEmpty() {
        return (!this.word);
    }

    isShortandNum() {
        let numReg = /\d/;
        return (this.word.length < 3 || numReg.test(this.word))
    }

    isEnglish() {
        let enReg = /^[^\u4e00-\u9fa5]+$/i;
        return (enReg.test(this.word));
    }

    getResouceURL() {
        let appSecret = 'xYLvWBzCupw3nTpUcBwG6dvjZZT2RGD6';
        let appKey = '49557dccdded6747';
        let salt = (new Date).getTime();
        let from = 'en';
        let to = 'zh-CHS';

        let sign = md5(appKey + this.word + salt + appSecret);
        let base = 'http://openapi.youdao.com/api?'
        let param = `q=${this.word}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`;
        return (base + param);
    }

    getDefinition(word) {
        this.word = word;
        return new Promise((resolve, reject) => {

            if (this.isEmpty() || this.isShortandNum() || !this.isEnglish())
                reject(null);

            let url = this.getResouceURL();

            Translator.loadJsonp(url, function (data) {
                if (!data.basic) {
                    reject(null);
                } else {
                    var def = '';
                    for (let i = 0; i < data.basic.explains.length; i++)
                        def = def + data.basic.explains[i] + '<br>';
                    resolve(def);
                }
            });
        });
    }

    static loadData(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => callback(xhr.responseText));
        xhr.open('GET', chrome.extension.getURL(url), true);
        xhr.send();
    }

    static loadJsonp(url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };

        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }
}
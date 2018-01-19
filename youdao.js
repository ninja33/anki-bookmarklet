class Youdao {
    constructor() {
        this.word = '';
        this.appSecret = 'xYLvWBzCupw3nTpUcBwG6dvjZZT2RGD6';
        this.appKey = '49557dccdded6747';
        this.salt = (new Date).getTime();
        this.from = 'en';
        this.to = 'zh-CHS';
        this.base = 'https://openapi.youdao.com/api?'

    }

    buildAPIURL() {
        let sign = md5(this.appKey + this.word + this.salt + this.appSecret);
        let param = `q=${this.word}&appKey=${this.appKey}&salt=${this.salt}&from=${this.from}&to=${this.to}&sign=${sign}`;
        return (this.base + param);
    }

    findTerm(word) {
        this.word = word;
        let url = this.buildAPIURL();
        return loadJSONP(url).promise.then(data => {
            if (!data.basic) {
                return Promise.reject('Translation not found!');
            } else {
                var defs = "";
                for (let i = 0; i < data.basic.explains.length; i++) {
                    defs += data.basic.explains[i] + '<br>';
                    return Promise.resolve(defs);
                }
            }
        }).catch(error => Promise.reject(error));
    }

}
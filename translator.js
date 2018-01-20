class Translator {
    constructor() {
        this.word = "";
        this.defs = {};
        this.dictionary = new Youdao();
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

    isInvalid() {
        return (this.isEmpty() || this.isShortandNum() || !this.isEnglish());
    }

    getTranslation(word) {
        this.word = word;
        return this.isInvalid() ? Promise.reject("invalid word") : this.dictionary.findTerm(word);
    }
}
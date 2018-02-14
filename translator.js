class Translator {
    constructor() {
        this.word = "";
        this.defs = {};
        this.dictionary = new YoudaoEC();
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

    async getTranslation(word) {
        this.word = word;
        return this.isInvalid() ? Promise.reject("invalid word") : await this.dictionary.findTerm(word);
    }
}
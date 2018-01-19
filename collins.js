class Collins {
    constructor() {
        this.word = '';
        this.base = 'https://www.collinsdictionary.com/zh/dictionary/english/'

    }

    findTerm(word) {
        this.word = word;
        let url = this.base + this.word;
        return Collins.loadData(url);
    }

    static loadData(url) {
        return new Promise((resolve, reject)=>{
            try {
                let xhr = new XMLHttpRequest();
                xhr.addEventListener('loadend', ()=>{
                    let div = document.createElement("div");
                    div.innerHTML = xhr.responseText;
                    let content = div.querySelector(".content").innerHTML;
                    resolve(content);
                });
                xhr.open('GET', 'http://www.laohuang.net/proxy.php');
                xhr.setRequestHeader('X-Proxy-URL', url);
                xhr.send();
            } catch (error) {
                reject(error);
            }
        });
    }
}
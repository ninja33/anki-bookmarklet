class YoudaoEC {
    constructor() {
        this.word = '';
        this.base = 'http://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&dicts={"count":99,"dicts":[["ec"]]}&xmlVersion=5.1&q='

    }

    resourceURL(word) {
        return this.base + encodeURIComponent(word);
    }

    async findTerm(word) {
        this.word = word;
        return this.findEC(word);
    }

    async onlineQuery(url) {
        return new Promise((resolve, reject) => {
            try {
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType("application/json");
                xhr.addEventListener('loadend', () => {
                    if (xhr.responseText == 'preflight')
                        resolve(null);
                    resolve(xhr.responseText);
                });
                xhr.open('GET', 'http://www.laohuang.net/proxy.php');
                xhr.setRequestHeader('X-Proxy-URL', url);
                xhr.send();
            } catch (error) {
                resolve(null);
            }
        });
    }

    async findEC(word) {
        if (!word) return null;
        let url = this.base + encodeURIComponent(word);
        let data = null;
        try {
            data = JSON.parse(await this.onlineQuery(url));
        } catch (err) {
            return null;
        }

        if (!data.ec) return null;
        let expression = data.ec.word[0]['return-phrase'].l.i;
        let reading = data.ec.word[0].phone || data.ec.word[0].ukphone;

        let extrainfo = '';
        let types = data.ec.exam_type || [];
        for (const type of types) {
            extrainfo += `<span class="examtype">${type}</span>`
        }

        let definition = '<ul class="ec">';
        const trs = data.ec.word ? data.ec.word[0].trs : [];
        for (const tr of trs)
            definition += `<li class="ec"><span class="ec_chn">${tr.tr[0].l.i[0]}</span></li>`;
        definition += '</ul>';
        let css = `
        <style>
            span.examtype {margin: 0 3px;padding: 0 3px;color: white;background-color: #5cb85c;border-radius: 3px;}
            ul.ec, li.ec {list-style: none;margin:0;padding:0}
        </style>`;
        return {
            css,
            expression,
            reading,
            extrainfo,
            definition,
        };
    }

}
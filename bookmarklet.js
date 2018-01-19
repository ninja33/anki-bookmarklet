(function () {
    _bklOptions = {
        deck: "Antimoon",
        type: "Antimoon",
        word: "expression",
        defs: "glossary",
        sent: "sentence",
        base: "https://rawgit.com/ninja33/anki-bookmarklet/master/",
    };
    if (window.showIndicator !== undefined) {
        showIndicator(_bklOptions);
    } else {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://cdn.rawgit.com/muicss/loadjs/3.5.2/dist/loadjs.min.js";
        s.onload = () => {
            let libs = [
                "main.css",
                "lib/jsonp.js",
                "lib/md5.js",
                "popup.js",
                "util.js",
                "youdao.js",
                "translator.js",
                "ankiconnect.js",
                "ankimobile.js",
                "main.js"
            ];
            lib = libs.map((x) => _bklOptions.base + x);
            loadjs(libs, () => {
                window.ankibookmarklet = new Ankibookmarklet();
                showIndicator(_bklOptions);
            });
        };
        document.body.appendChild(s);
    }
})()
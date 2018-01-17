(function () {
    _bklOptions = {
        deck: "Antimoon",
        type: "Antimoon",
        word: "expression",
        defs: "glossary",
        sent: "sentence",
        base: "https://rawgit.com/ninja33/anki-bookmarklet/master/",
        prod: "https://rawgit.com/ninja33/anki-bookmarklet/master/",
        libs: ["main.css", "lib/md5.js", "translator.js", "popup.js", "util.js", "ankiconnect.js", "ankimobile.js", "main.js"],
    };
    if (window.showIndicator !== undefined) {
        showIndicator(_bklOptions);
    } else {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://cdn.rawgit.com/muicss/loadjs/3.5.2/dist/loadjs.min.js";
        s.onload = function () {
            let libs = _bklOptions.libs.map((x) => _bklOptions.base + x + "?bust="+new Date().getTime()) ;
            loadjs(libs, () => {
                window.ankibookmarklet = new Ankibookmarklet();
                showIndicator(_bklOptions);
            });
        };
        document.body.appendChild(s);
    }
})()
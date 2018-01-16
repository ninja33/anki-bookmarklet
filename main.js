const abkl_base = !(typeof abkl_options == 'undefined') ? `https://rawgit.com/${abkl_options.user}/${abkl_options.repo}/master/` : "";

function initBookmartlet() {
    if (typeof abkl_options == "undefined")
        abkl_options = {};

    abkl_options.deck = abkl_options.deck || 'Antimoon';
    abkl_options.type = abkl_options.type || 'Antimoon';
    abkl_options.word = abkl_options.word || 'expression';
    abkl_options.defs = abkl_options.defs || 'glossary';
    abkl_options.sent = abkl_options.sent || 'sentence';

    popup = new Popup();
    window.addEventListener('touchstart', onMouseDown);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('message', onFrameMessage);
    showIndicator();
}

function onMouseDown(e) {
    popup.hide();
}

function onMouseUp(e) {
    const selection = window.getSelection();
    const word = (selection.toString() || '').trim();
    const trans = new Translator()
    trans.getDefinition(word).then(definition => {
        var sentence = getSentence(word);
        abkl_word = word;
        abkl_sentence = sentence;
        abkl_definition = definition;
        let content = renderContent({
            word,
            sentence,
            definition
        })
        popup.showNextTo({
            x: e.clientX,
            y: e.clientY
        }, content);
    });
}

function onFrameMessage(e) {
    const target = new Ankiconnect();
    target.addNote(abkl_options,{word:abkl_word, sent:abkl_sentence, defs:abkl_definition});
}

function loadLibrary() {

    var libs = ["lib/md5.js", "popup.js", "translator.js", "util.js", "ankiconnect.js","main.css"];
    libs = libs.map(x => abkl_base + x);
    loadjs(libs, {
        success: function () {
            initBookmartlet();
            (window.abklTODO = function () {
                console.log("typeof MD5 : " + typeof md5);
                console.log("typeof Popup : " + typeof Popup);
            })();
        }
    });

}

(function () {
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://rawgit.com/muicss/loadjs/master/dist/loadjs.min.js';
    script.onload = script.onreadystatechange = function () {
        if (!(readystate = this.readyState) || readystate == 'loaded' || readystate == 'complete')
            loadLibrary();
    };
    document.documentElement.childNodes[0].appendChild(script);

})();

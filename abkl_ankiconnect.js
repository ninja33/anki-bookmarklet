abkl_deck='Antimoon';
abkl_type='Antimoon';
abkl_wordfield='expression';
abkl_definitionfield='glossary';
abkl_sentencefield='sentence';

let blockTags = ['LI', 'P', 'DIV', 'BODY'];
const enReg = /^[^\u4e00-\u9fa5]+$/i;
const numReg = /\d/;

function sanitizeOptions(options) {
    const defaults = {
        deck       : 'Antimoon',
        type       : 'Antimoon',
        word       : 'expression',
        definition : 'glossary',
        sentence   : 'sentence'
    };

    for (let key in defaults) {
        if (!(key in options)) {
            options[key] = defaults[key];
        }
    }

    return options;
}

function loadOptions(callback) {
    Cookies.get("abkl_option");
    callback();
}

function saveOptions(opts, callback) {
    Cookies.set("abkl_option",sanitizeOptions(opts));
    callback
}

function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}
    
function getBlock(node, deep) {
    if (blockTags.indexOf(node.nodeName.toUpperCase()) !== -1 || deep === 0) {
        return node;
    } else {
        return getBlock(node.parentElement, deep - 1);
    }
}

function cutSentence(word, sentence) {
    var autocut = true;
    var sentenceNum = 3;

    if (autocut && sentenceNum > 0) {
        let puncts = sentence.match(/[\.\?!;]/g) || [];
        let arr = sentence.split(/[\.\?!;]/).filter(s => s.trim() !== '').map((s, index) => s.trim() + `${puncts[index] || ''} `);
        let index = arr.findIndex(s => s.indexOf(word) !== -1);
        let left = Math.ceil((sentenceNum - 1) / 2);
        let start = index - left;
        let end = index + ((sentenceNum - 1) - left);

        if (start < 0) {
            start = 0;
            end = sentenceNum - 1;
        } else if (end > (arr.length - 1)) {
            end = arr.length - 1;

            if ((end - (sentenceNum -1)) < 0) {
                start = 0;
            } else {
                start = end - (sentenceNum - 1);
            }
        }

        return arr.slice(start, end + 1).join('').replace(word,'<b>'+word+'</b>');
    } else {
        return sentence.replace(word,'<b>'+word+'</b>');
    }
}

function getSentence(word, elem) {
    let wordContent = '';
    let upNum = 4;

    elem = getBlock(elem, upNum);

    if (elem !== document) {
        wordContent = elem.innerText;
    }

    return cutSentence(word, wordContent);
}

function getDefinition(word, sentence) {

    var query = word;

    var appSecret = 'xYLvWBzCupw3nTpUcBwG6dvjZZT2RGD6';
    var appKey = '49557dccdded6747';
    var salt = (new Date).getTime();

    var from = 'en';
    var to = 'zh-CHS';
    var sign = md5(appKey + query + salt +appSecret);

    var base = 'http://openapi.youdao.com/api?'
    var param = `q=${query}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`;
    var url = base + param;

    jsonp(url, function(data) {
        if (!data.basic.explains) {
            return '';
        } else {
            var def = '';
            for (i = 0; i < data.basic.explains.length; i++)
                def = def + data.basic.explains[i] + '<br>';
            addNote(word, sentence, def)
        }
    });
}

function addNote(word, sentence, definition){
    var note = {fields: {}, tags:['chrome']};
    note.deckName  = abkl_deck;
    note.modelName = abkl_type;
    note.fields[abkl_wordfield] = word;
    note.fields[abkl_sentencefield] = sentence;
    note.fields[abkl_definitionfield] = definition;

    var newnote = {action:'addNote',params: {note}};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify(newnote));
}

function clickAnkibutton(){
    var selection = window.getSelection();
    var word = (selection.toString() || '').trim();
    if (selection.rangeCount > 0)
        var node = selection.getRangeAt(0).commonAncestorContainer;

    if (!word) {
        alert('No word selected!');
        return;
    }

    if (word.length < 3 || numReg.test(word)) {
        return;
    }

    if (!enReg.test(word)) {
        return;
    }

    if (['INPUT', 'TEXTAREA'].indexOf(node.tagName) !== -1) {
        return;
    }

    var expression = word;
    var sentence = getSentence(word, node);
    getDefinition(word, sentence)
}

function initMyBookmarklet() {

    var base_url = "https://rawgit.com/ninja33/anki-bookmarklet/master/"
    var md5_js = base_url + "util/md5.js"
    var cookies_js = base_url + "util/cookies.js"
    loadjs([md5_js, cookies_js], {
        success: function() {
            var elemDiv = document.createElement('div');
            elemDiv.innerHTML = "\
                <div id='ankiframe'>\
                    <div id='ankiframe_veil' style=''>\
                        <img id='ankibutton' src=\"https://raw.githubusercontent.com/ninja33/anki-bookmarklet/master/akbl_plus_32.png\">\
                    </div>\
                    <style type='text/css'>\
                        #ankiframe { float: right; }\
                        #ankiframe_veil { display: block; position: fixed; bottom: 10px; right: 10px; cursor: pointer; z-index: 900; }\
                    </style>\
                </div>";
            document.body.appendChild(elemDiv);

            document.getElementById("ankibutton").addEventListener('click', function(event) {
                clickAnkibutton();
            },false);

            (window.myBookmarklet = function() {
                //code need to run everytime when click 
            })();
        }
    });

}

(function(){
    script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = 'https://rawgit.com/muicss/loadjs/master/dist/loadjs.min.js';
    script.onload = script.onreadystatechange = function() {
        if (!( readystate = this.readyState ) || readystate == 'loaded' || readystate == 'complete' )
            initMyBookmarklet();
    };
    document.documentElement.childNodes[0].appendChild( script );  

})();
const blockTags = ['LI', 'P', 'DIV', 'BODY'];
const enReg = /^[^\u4e00-\u9fa5]+$/i;
const numReg = /\d/;

function initOptions() {
    if (typeof abkl_options == "undefined")
        abkl_options = {};
    
    abkl_options.deck = abkl_options.deck || 'Antimoon';
    abkl_options.type = abkl_options.type || 'Antimoon';
    abkl_options.word = abkl_options.word || 'expression';
    abkl_options.defs = abkl_options.defs || 'glossary';
    abkl_options.sent = abkl_options.sent || 'sentence';
}

function initPopup(){
    popup = new Popup();
    
    var elemDiv = document.createElement('div');
    elemDiv.innerHTML = "\
        <div id='ankiframe'>\
            <div id='ankiframe_veil' style=''>\
                <img id='ankibutton' src=\"https://rawgit.com/ninja33/anki-bookmarklet/master/akbl_plus_32.png\">\
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
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
}
    
function onMouseDown(e) {
    popup.hide();
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

function getDefinition(word) {
    return new Promise(function(resolve, reject){
        var appSecret = 'xYLvWBzCupw3nTpUcBwG6dvjZZT2RGD6';
        var appKey = '49557dccdded6747';
        var salt = (new Date).getTime();

        var from = 'en';
        var to = 'zh-CHS';
        var sign = md5(appKey + word + salt +appSecret);

        var base = 'http://openapi.youdao.com/api?'
        var param = `q=${word}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`;
        var url = base + param;

        jsonp(url, function(data) {
            if (!data.basic) {
                reject(null);
            } else {
                var def = '';
                for (i = 0; i < data.basic.explains.length; i++)
                    def = def + data.basic.explains[i] + '<br>';
                resolve(def);
            }
        });
    });
}

function addNote(word, sentence, definition){
    var note = {fields: {}, tags:['chrome']};
    note.deckName  = abkl_options.deck;
    note.modelName = abkl_options.type;
    note.fields[abkl_options.word] = word;
    note.fields[abkl_options.sent] = sentence;
    note.fields[abkl_options.defs] = definition;

    var newnote = {action:'addNote',params: {note}};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify(newnote));
}

function onMouseUp(e) {
    var selection = window.getSelection();
    var word = (selection.toString() || '').trim();
    if (selection.rangeCount > 0)
        var node = selection.getRangeAt(0).commonAncestorContainer;

    if (!word) {
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

    var sentence = getSentence(word, node);
    getDefinition(word).then(definition=>{
        var RangeRect = document.caretRangeFromPoint(e.clientX, e.clientY).getBoundingClientRect();
        var content = `\
            <html lang="zh-CN">\
                <head><meta charset="UTF-8"><title></title>\
                    <link rel="stylesheet" href="util/frame.css">\
                </head>\
                <body>\
                <div class="abkl-content">\
                    <div class="abkl-sect abkl-word">${word}</div>\
                    <div class="abkl-sect abkl-sent">${sentence}</div>\
                    <div class="abkl-sect abkl-defs">${definition}</div>\
                </div>\
                <!--script src="frame.js"></script-->\
                </body>\
            </html>\
            `;
        popup.showNextTo(RangeRect, content);
    });
}

function clickAnkibutton(){
        //addNote(word, sentence, definition);
}

function initMyBookmarklet() {

    var base_url = "https://rawgit.com/ninja33/anki-bookmarklet/master/";
    var md5_js = base_url + "util/md5.js";
    var popup_js = base_url + "util/popup.js";
    loadjs([md5_js, popup_js], {
        success: function() {

            initOptions();
            initPopup();

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
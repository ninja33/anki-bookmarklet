const blockTags = ['LI', 'P', 'DIV', 'BODY'];
const enReg = /^[^\u4e00-\u9fa5]+$/i;
const numReg = /\d/;
const abkl_base = "https://rawgit.com/ninja33/anki-bookmarklet/master/";

function initBookmartlet() {
    if (typeof abkl_options == "undefined")
        abkl_options = {};
    
    abkl_options.deck = abkl_options.deck || 'Antimoon';
    abkl_options.type = abkl_options.type || 'Antimoon';
    abkl_options.word = abkl_options.word || 'expression';
    abkl_options.defs = abkl_options.defs || 'glossary';
    abkl_options.sent = abkl_options.sent || 'sentence';

    popup = new Popup();
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('message', onFrameMessage);
    var elemDiv = document.createElement('div');
    elemDiv.innerHTML = `\
        <div id='ankiframe'>\
            <div id='ankiframe_veil' style=''>\
                <img id='ankibutton' src="${abkl_base}util/greenlight.gif">\
            </div>\
            <style type='text/css'>\
                #ankiframe { float: right; }\
                #ankiframe_veil { display: block; position: fixed; bottom: 5px; right: 5px; cursor: pointer; z-index: 900; }\
            </style>\
        </div>`;
    document.body.appendChild(elemDiv);
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


function onMouseDown(e) {
    popup.hide();
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
        abkl_word = word;
        abkl_sentence = sentence;
        abkl_definition = definition;
        var RangeRect = document.caretRangeFromPoint(e.clientX, e.clientY).getBoundingClientRect();
        var content = `\
            <html lang="zh-CN">\
                <head><meta charset="UTF-8"><title></title>\
                    <link rel="stylesheet" href="${abkl_base}util/frame.css">\
                </head>\
                <body style="margin:3px;">\
                <div class="abkl-content">\
                    <div class="abkl-sect abkl-word">${word}<span class="abkl-addnote"><img src="${abkl_base}util/add.png"/></span></div>\
                    <div class="abkl-sect abkl-defs">${definition}</div>\
                    <div class="abkl-sect abkl-sent">${sentence}</div>\
                </div>\
                <script src="${abkl_base}util/frame.js"></script>\
                </body>\
            </html>`;
        popup.showNextTo(RangeRect, content);
    });
}

function onFrameMessage(e) {
    addNote(abkl_word, abkl_sentence, abkl_definition);
}

function loadLib() {

    var libs = [];
    libs.push(abkl_base + "util/md5.js");
    libs.push(abkl_base + "util/popup.js");
    libs.push(abkl_base + "common.css");
    loadjs(libs, {
        success: function() {
            initBookmartlet();
            (window.myBookmarklet = function() {
                console.log("typeof MD5 : " + typeof md5);
                console.log("typeof Popup : " + typeof Popup);
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
            loadLib();
    };
    document.documentElement.childNodes[0].appendChild(script);  

})();
//let profile = encodeURIComponent('User 1');
//let deckName = 'Antimoon';
//let typeName = 'Antimoon';
//let fieldWord = 'expression';
//let fieldSentence = 'sentence';

let blockTags = ['LI', 'P', 'DIV', 'BODY'];
const enReg = /^[^\u4e00-\u9fa5]+$/i;
const numReg = /\d/;
    
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

function addNote(word, sentence){
    var note = {fields: {}, tags:['chrome']};
    note.deckName  = deckName;
    note.modelName = typeName;
    note.fields[fieldWord] = word;
    note.fields[fieldSentence] = sentence;

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

    addNote(expression,sentence)
}

function initMyBookmarklet() {
    (window.myBookmarklet = function() {
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
    })();

    document.getElementById("ankibutton").addEventListener('click', function(event) {
        clickAnkibutton();
    },false);
        
}

(function(){
    initMyBookmarklet();
})();

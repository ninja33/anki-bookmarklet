function showIndicator(){
    var elemDiv = document.createElement('div');
    elemDiv.innerHTML = `\
        <div id='ankiframe'>\
            <div id='ankiframe_veil' style=''>\
                <img id='ankibutton' src="${abkl_base}img/greenlight.gif">\
            </div>\
            <style type='text/css'>\
                #ankiframe { float: right; }\
                #ankiframe_veil { display: block; position: fixed; bottom: 5px; right: 5px; cursor: pointer; z-index: 900; }\
            </style>\
        </div>`;
    document.body.appendChild(elemDiv);
}

function getBlock(node, deep) {
    const blockTags = ['LI', 'P', 'DIV', 'BODY'];
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

            if ((end - (sentenceNum - 1)) < 0) {
                start = 0;
            } else {
                start = end - (sentenceNum - 1);
            }
        }

        return arr.slice(start, end + 1).join('').replace(word, '<b>' + word + '</b>');
    } else {
        return sentence.replace(word, '<b>' + word + '</b>');
    }
}

function getSentence(word) {
    let wordContent = '';
    const upNum = 4;
    const selection = window.getSelection();

    if (selection.rangeCount < 1)
        return;

    var node = selection.getRangeAt(0).commonAncestorContainer;

    if (['INPUT', 'TEXTAREA'].indexOf(node.tagName) !== -1) {
        return;
    }

    node = getBlock(node, upNum);

    if (node !== document) {
        wordContent = node.innerText;
    }

    return cutSentence(word, wordContent);
}

function renderContent(info) {
    var {
        word,
        definition,
        sentence
    } = info;
    var content = `\
    <html lang="zh-CN">\
        <head><meta charset="UTF-8"><title></title>\
            <link rel="stylesheet" href="${abkl_base}frame.css">\
        </head>\
        <body style="margin:3px;">\
        <div class="abkl-content">\
            <div class="abkl-sect abkl-word">${word}<span class="abkl-addnote"><img src="${abkl_base}img/add.png"/></span></div>\
            <div class="abkl-sect abkl-defs">${definition}</div>\
            <div class="abkl-sect abkl-sent">${sentence}</div>\
        </div>\
        <script src="${abkl_base}frame.js"></script>\
        </body>\
    </html>`;
    return content;
}
# Translation Bookmarklet for Ankiconnect/Ankimobile 

## Introduction

It's a simple and all in one bookmarklet to help language learner to translate word and make anki note while reading web page.

## Usage

1. Save a bookmark for your browser. Next, edit this bookmark, copy and paste below source to bookmark's `url` field, and then save.
2. Click this bookmarklet while browsing web. After loading, a green light LED will keep flashing at right/bottom of the bowser which means `ready`.
3. Select web page text by dragging or double clicking mouse left button. It will popup a window to display 3 fields as below:
- Selected Text(Word) 
- Translated Text(Definition)
- Context(Sentence)
4. Click green "plus" icon top/right of the window. Based on below option, it will add a note to anki deskptop client through ankiconnect addon.

## Bookmarklet Source to be Copied

```javascript
javascript:(function () { _bklOptions = { deck: "Antimoon", type: "Antimoon", word: "expression", defs: "glossary", sent: "sentence", base: "https://rawgit.com/ninja33/anki-bookmarklet/master/", }; if (window.showIndicator !== undefined) { showIndicator(_bklOptions); } else { var s = document.createElement("script"); s.type = "text/javascript"; s.src = "https://cdn.rawgit.com/muicss/loadjs/3.5.2/dist/loadjs.min.js"; s.onload = function () { let libs = [ "main.css", "lib/jsonp.js", "lib/md5.js", "popup.js", "util.js", "youdao.js", "translator.js", "ankiconnect.js", "ankimobile.js", "main.js" ]; lib = libs.map((x) => _bklOptions.base + x); loadjs(libs, () => { window.ankibookmarklet = new Ankibookmarklet(); showIndicator(_bklOptions); }); }; document.body.appendChild(s); } })()
```

## Options

Because it's bookmarklet, so basically, it's client side script which can not store any information in cookies(cross-domain) or browser local storage.
So, all options must be hardcode and passed by above bookmarklet code itself.

### Anki options

If you want to use this bookmarklet to make note by using ankiconnect, you may change below option in above source of variable `abkl_options` to match your anki deck/type/fields

- deck:"Antimoon";    //define anki deck name
- type:"Antimoon";    //define anki note type name
- word:"expression";  //define word field of above note type
- defs:"glossary";    //define definition field of above note type
- sent:"sentence";    //define sentence field of above note type

## Customization

This bookmark is written by javascript and the source actually is stored on Github and loaded as git raw data. That means you can fork or clone this repository, then change above bookmarklet source to point to your new Github repository, and do whatever change you want(e.g change part of translation script for other new language learning purpose), .

### Git options

you may change below option in above source of variable `abkl_options` to match your git user name and repository. It will be used to make script/css/images  base url

- base: "https://rawgit.com/{user}/{repo}/{branch}/"; //replace `{user}`, `{repo}`, `{branch}` to your git username, repository and branch name.
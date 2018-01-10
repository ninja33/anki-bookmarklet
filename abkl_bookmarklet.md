
Bookmarklet Sourcecode:
```
javascript:(function(){var deckName='Default';var typeName='Basic';var fieldWord='Front';var fieldSentence='Back';if(window.myBookmarklet!==undefined){myBookmarklet();}else{var s=document.createElement("script");s.type="text/javascript",s.src="https://rawgit.com/ninja33/anki-excel-helper/master/Java/ankibutton.js?bust="+new Date().getTime(),document.body.appendChild(s)}})();
```

修改上述书签中相应字符串
```
deckName='Default';       //将单引号内的Default改成牌组名称
typeName='Basic';         //将单引号内的Basic改成模板名称
fieldWord='Front';        //将单引号内的Front改成你存放单词的字段
fieldSentence='Back';     //将单引号内的Back改成你存放句子的字段
```


Bookmarklet Sourcecode:
```
javascript:(function(){abkl_deck='Default';abkl_type='Basic';abkl_wordfield='Front';abkl_sentencefield='Back';if(window.myBookmarklet!==undefined){myBookmarklet();}else{var s=document.createElement("script");s.type="text/javascript",s.src="https://rawgit.com/ninja33/anki-bookmarklet/master/abkl_ankiconnect.js?bust="+new Date().getTime(),document.body.appendChild(s)}})();
```

修改上述书签中相应字符串
```
abkl_deck='Default';          //将单引号内的Default改成牌组名称
abkl_type='Basic';            //将单引号内的Basic改成模板名称
abkl_wordfield='Front';       //将单引号内的Front改成你存放单词的字段
abkl_sentencefield='Back';    //将单引号内的Back改成你存放句子的字段

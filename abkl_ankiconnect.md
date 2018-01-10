
#Ankiconnect Bookmarklet Sourcecode:
```
javascript:(function(){abkl_deck='Default';abkl_type='Antimoon';abkl_wordfield='expression';abkl_definitionfield='glossary';abkl_sentencefield='sentence';if(window.myBookmarklet!==undefined){myBookmarklet();}else{var s=document.createElement("script");s.type="text/javascript",s.src="https://rawgit.com/ninja33/anki-bookmarklet/master/abkl_ankiconnect.js?bust="+new Date().getTime(),document.body.appendChild(s)}})();
```

修改上述书签中相应字符串
```
abkl_deck='Default';                    //将单引号内的 Default 改成牌组名称
abkl_type='Antimoon';                   //将单引号内的 Antimoon 改成模板名称
abkl_wordfield='expression';            //将单引号内的 expression 改成单词字段名称
abkl_definitionfield='glossary';        //将单引号内的 glossary 改成单词字段名称
abkl_sentencefield='sentence';          //将单引号内的 sentence 改成句子字段名称
```

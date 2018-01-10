
#AnkiMobile Bookmarklet Sourcecode:
```
javascript:(function(){abkl_profile='User 1';abkl_deck='Default';abkl_type='Basic';abkl_wordfield='Front';abkl_sentencefield='Back';if(window.myBookmarklet!==undefined){myBookmarklet();}else{var s=document.createElement("script");s.type="text/javascript",s.src="https://rawgit.com/ninja33/anki-bookmarklet/master/abkl_ankimobile.js?bust="+new Date().getTime(),document.body.appendChild(s)}})();
```

修改上述书签中相应字符串
```
abkl_profile='User 1';        //将单引号内的 User 1 改成档案名称
abkl_deck='Default';          //将单引号内的 Default 改成牌组名称
abkl_type='Basic';            //将单引号内的 Basic 改成模板名称
abkl_wordfield='Front';       //将单引号内的 Front 改成单词字段名称
abkl_sentencefield='Back';    //将单引号内的 Back 改成句子字段名称
```

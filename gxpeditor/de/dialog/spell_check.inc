<html>
<head>
<script language="javascript" type="text/javascript">
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
/* word object that stores the id, word and the bookmark */
var rng;

function getE(id){return d.getElementById(id)}

// Begin spell check functions

/* word object that stores the id, word and the bookmark */
function oWord(pos, wrd, bkmrk){
    this.id = pos;
    this.word = wrd;
    this.bookmark = bkmrk;
    this.getWord = getWord;
    this.fixWord = fixWord;
}

function getWord(){
    var r=aed.body.createTextRange();
    r.move("word",this.id);
    r.moveEnd("word",1);
    if(r.text.match(/[\ \n\r]+$/)) r.moveEnd("character",-1); // strip out any trailing line feeds and spaces
    r.select();
    return true;
}

function fixWord(wrd, num){
    var r=aed.body.createTextRange();
    r.move("word",this.id);
    r.moveEnd("word",1);
    if(r.text.match(/[\ \n\r]+$/)) r.moveEnd("character",-1); // strip out any trailing line feeds and spaces
    r.text = wrd;

    for(i=this.id;i<ae.arr.length;i++) ae.arr[i].id = ae.arr[i].id + (num - 1);     // update word positioning
    return true;
}

function getRange(){
    var sr = null;
    if(aed.selection.type.toLowerCase() == "text"){
        sr = aed.selection.createRange();
    } else {
        sr = aed.body.createTextRange();
    }
    return sr;
}

function getWordsIE(){
    var sr = null;
    if(aed.selection.type.toLowerCase() == "text"){
        sr = aed.selection.createRange();
        sr.expand("word");
        sr.select();
    };

    var r=aed.body.createTextRange();
    // get first word
    r.move("word",0);
    rEnd = r.expand("word");
    var wordpos=0;
    var idpos=0;
    var wordblock="";
    var aWords = new Array();
    // loop until I run out of words
    while(rEnd){
        if(r.text.match(/[\ \n\r]+$/)) r.moveEnd("character",-1); // strip out any trailing line feeds and spaces
        t=r.text; // grab the text
        if((t!="." || t!="!" || t!="?") && (rEnd!=0 && t.match("[A-Za-z]"))) {
            if((sr!=null)?sr.inRange(r):true){
                r.collapse();
                aWords[idpos] = new oWord(wordpos, t, r.getBookmark());
                idpos++;
            }
        }

        /* grab the next word */
        r.move("word",1);
        rEnd = r.expand("word");
        wordpos++;
    }
    return aWords;
}

// End spell check functions

function searchWord(s, word) {
	var r = new RegExp(word+";","gi");
	if (s.search(r)>=0) return true;
		else return false;
}

function getAllWords(){
	cw = opener.GetCookie("spellwords");
	if (opener.browser.IE) ae.arr = getWordsIE();
		else ae.arr = getWordsNS();
		
    var wrds = "";
    for(var i=0; i<ae.arr.length; i++){
		if (cw && searchWord(cw, ae.arr[i].word))continue;
        wrds += i + ',' + ae.arr[i].word;
        if (i<ae.arr.length-1) wrds += ",";
    }
    getE("words").value = wrds;
    getE("lang").value = window.opener.spellLang;
	getE("myRef").value = document.location
    getE("frm").submit();
}

 function traverse(node) {    
	if (node.tagName && node.tagName.toLowerCase()=="br") {  
 		words+=" ";
 	}	
	if (node.nodeType == 3) { 
		words+=node.nodeValue;
	}  
            
	if (node.childNodes != null) {  
		for ( var i=0; i < node.childNodes.length; i++) {  
			traverse(node.childNodes.item(i));  
		}  
	}
 }

var words = "";

function setCursorToStart(){
    var selection = ae._window.getSelection();
    var range = ae._frame.createRange();    
    selection.removeAllRanges();
    range.setStart(ae._frame.body.firstChild,0);
	range.collapse(true);
	selection.addRange(range);
}	

function getWordsNS(){
    var wnc = new Array();
	traverse(aed.documentElement);

	setCursorToStart();

	wc = words.match(/\b[\w|']+\b/g);
	var wcs="";
	for (var i=0;i<wc.length;i++){
		var bCase = true ;
		var bWord = true ;
		setCursorToStart();
		bFound = ae._window.find( wc[i], bCase, false, false, bWord, false, false );
		if (bFound) wnc[wnc.length] = new oWord(null,wc[i]);
		wcs+=wc[i]+" ";
	}
	setCursorToStart();
	
    return wnc;
}

</script>
<script type="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
</head>
<body class="dialogWindow" onload="getAllWords();">
<form name="frm" id="frm" method="post" action="http://www.spellcheckme.com/suggestions_wep.php">
<input type="hidden" id="words" name="words" value="">
<input type="hidden" id="myRef" name="myRef" value="">
<input type="hidden" id="lang" name="lang" value="">
<font face=verdana size=2><b>Checking spelling. Please wait...</b>

<br><br>
Incorrectly spelled words will be <span style="background-color: yellow;">highlighted</span>. You can then click on each incorrectly spelled word to show a list of suggested spellings.
</font>

</form>

</body>
</html>

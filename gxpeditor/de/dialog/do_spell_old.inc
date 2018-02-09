<html>
<head>
<script language="javascript" type="text/javascript">
d = document;
ae = window.opener.activeEditor;
aew = ae._window;
aed = ae._frame;	
wordcount=0;

function getE(id){return d.getElementById(id)}

function QueryString(key)
{
	var value = null;
	for (var i=0;i<QueryString.keys.length;i++)
	{
		if (QueryString.keys[i]==key)
		{
			value = QueryString.values[i];
			break;
		}
	}
	return value;
}
QueryString.keys = new Array();
QueryString.values = new Array();

function QueryString_Parse()
{
	var query = window.location.search.substring(1);
	var pairs = query.split("&");
	
	for (var i=0;i<pairs.length;i++)
	{
		var pos = pairs[i].indexOf('=');
		if (pos >= 0)
		{
			var argname = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos+1);
			QueryString.keys[QueryString.keys.length] = argname;
			QueryString.values[QueryString.values.length] = value;		
		}
	}

}

QueryString_Parse();

var win = window.opener.activeEditor;
var nw = new Array(); // array that stores wrong words
var ec = -1;
var currec = 0;
var init = false;

function word(pos) {
	this.position=pos;
	this.addSuggestion=addSuggestion;
	this.suggestions=new Object();
	this.suggCount=0;
	this.status=0; // 0 = unchanged, 1 = ignored, 2 = changed, 3 = not found
	try{
	    this.word = win.arr[pos].word;
	}
	catch(e){
	    this.word = null;
	    this.status = 3;
	}
}

function addSuggestion(s) {
	this.suggestions[this.suggCount]=s;
	this.suggCount++;
}

function initForm(){
    /* set up initial form values */
    setWord(0);
    init=true;
}

function setWord(idx){
    var oOption;
    if (currec > ec || ec == -1) {
        alert("Spelling check is complete");
        window.close();
    }else{
        if(nw[idx].status != 0){
            setWord(++currec);
            return;
        }
            getE("notWord").value = nw[idx].word;
			Find();
            if(nw[idx].suggCount > 0) {
                getE("sugg").innerHTML = ""; // clear all options then repopulate
                for(j=0; j<nw[idx].suggCount;j++){
                    oOption = document.createElement("OPTION");
                    getE("sugg").options.add(oOption);
                    oOption.text = nw[idx].suggestions[j];
                    oOption.value = nw[idx].suggestions[j];
                }

				if (nw[idx].suggestions[0] != "(no suggestions)")
				{
	                getE("repWord").value = nw[idx].suggestions[0];
					getE("sugg").disabled = false
				} else {
					getE("repWord").value = nw[idx].word
					getE("repWord").select()
					getE("repWord").focus()
					getE("sugg").disabled = true
				}

            }
    }
   checkChange();
}

function selectSuggestion(obj){
    getE("repWord").value = getE("sugg").options[obj.selectedIndex].value;
}

function ignore(){
    nw[currec].status=1;
    setWord(++currec);
}
function ignoreAll(){
    var ic = currec;
    nw[currec].status=1;
    for(i=currec;i<ec;i++){
        if(nw[ic].word == nw[i].word) nw[i].status=1;
    }
    setWord(++currec);
}

function isvalid(wrd){
	for(i=0;i<getE("sugg").options.length;i++) if(getE("sugg").options[i].value==wrd) return true;
	return false;
}

function change(){
    var newword = getE("repWord").value;
    var numwords;
    nw[currec].status=2;
    // change code
    Replace();
    setWord(++currec);
    window.opener.buffer[ae.mode].saveHistory();
}

function changeAll(){
    var ic = currec;
    var newword = getE("repWord").value;
    nw[currec].status=2;
    for(i=ic;i<=ec;i++){
        if(nw[ic].word == nw[i].word){
            nw[i].status=2;
            // change code
            Replace();
        }
    }
    setWord(++currec);
    window.opener.buffer[ae.mode].saveHistory();
}

// Include the JavaScript suggestions file
document.write("<\script language=javascript type=text/javascript src=http://www.spellcheckme.com/delete_js.php?file=" + QueryString('JS') + "></\script>");

if (window.opener.browser.IE)var oRange = aed.body.createTextRange() ;

function Find()
{
	if ( window.opener.browser.IE )FindIE();
	else FindGecko();
}

function FindIE()
{
	var iFlags = 0 ;

	iFlags = iFlags | 4 ;
	iFlags = iFlags | 2 ;

	var bFound = oRange.findText( getE("notWord").value, 1, iFlags ) ;

	if ( bFound )
	{
		oRange.scrollIntoView() ;
		oRange.select() ;
		oRange.collapse(false) ;
		oLastRangeFound = oRange ;
		checkChange();		
	}
}

function FindGecko()
{
	var bCase = true ;
	var bWord = true ;
	bFound = ae._window.find( getE('notWord').value, bCase, false, false, bWord, false, false );
	checkChange();
}

function checkChange()
{
	if (ae.Editable()){
		getE("change_letters").disabled  = false;
		getE("change_all_letters").disabled  = false;		
	} else {
		getE("change_letters").disabled  = true;
		getE("change_all_letters").disabled  = true;		
	}	
}

function ReplaceTextNodes( parentNode, regex, replaceValue, replaceAll, hasFound )
{
	for ( var i = 0 ; i < parentNode.childNodes.length ; i++ )
	{
		var oNode = parentNode.childNodes[i] ;
		if ( oNode.nodeType == 3 )
		{
			var sReplaced = oNode.nodeValue.replace( regex, replaceValue ) ;
			if ( oNode.nodeValue != sReplaced )
			{
				oNode.nodeValue = sReplaced ;
				if ( ! replaceAll )
					return true ;
				hasFound = true ;
			}
		}

		hasFound = ReplaceTextNodes( oNode, regex, replaceValue, replaceAll, hasFound ) ;
		if ( ! replaceAll && hasFound )
			return true ;
	}
	
	return hasFound ;
}

function Replace()
{
	var oRegex = new RegExp( '\\b' + getE('notWord').value + '\\b', "" ) ;
	ReplaceTextNodes( aed.body, oRegex, getE('repWord').value, false, false ) ;
}

function ReplaceAll()
{
	var oRegex = new RegExp( '\\b' + getE('notWord').value + '\\b', 'g' ) ;
	ReplaceTextNodes( aed.body, oRegex, getE('repWord').value, true, false ) ;
}

window.onload=function(){
	initForm();
	this.focus();
}	

// Add to dictionary

function searchWord(s, word) {
	var r = new RegExp(word+";","gi");
	if (s.search(r)>=0) return true;
		else return false;
}

function addToDic(){
	var expDate = new Date;
	expDate.setTime (expDate.getTime() + (10*356*24*60*60*1000));
	cw = opener.GetCookie("spellwords");
	if (!cw || !searchWord(cw, getE('notWord').value)){
		opener.SetCookie("spellwords",cw+getE('notWord').value+";",expDate);
		ignoreAll();
	}	
}

</script>


<style type="text/css">
	div     { font-family:Tahoma; font-size:11px; }
	.btn    { width:110px; height:22px; font-family:Tahoma; font-size:11px; margin-top:7px; }
</style>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
</head>

<body class="dialogWindow">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td valign="top">
<div><label for="notWord">Not in Dictionary</label></div>
<div><input type="text" id="notWord" style="width:200px;" disabled></div>

<div style="margin-top:7px;"><label for="repWord">Replace with</label></div>
<div><input type="text" id="repWord" style="width:200px;"></div>

<div style="margin-top:7px;"><label for="sugg">Suggestions</label></div>
<select id="sugg" size="5" style="width:200px;" onclick="selectSuggestion(this);">
</select>
</td><td valign="top" align="right">

<button onclick="ignore();" class="btn">Ignore</button><br>
<button onclick="ignoreAll();" class="btn">Ignore All</button><br>
<button id="change_letters" onclick="change();" class="btn" style="margin-top:15px;">Change</button><br>
<button id="change_all_letters" onclick="changeAll();" class="btn">Change All</button><br>
<button alt="Add word to local Dictionary" id="add_to_dic" onclick="addToDic();" class="btn">Add to Dictionary</button><br>
<button onclick="window.close();" class="btn" style="margin-top:40px;">Cancel</button>

</td>
</tr></table>
</body>
</html>
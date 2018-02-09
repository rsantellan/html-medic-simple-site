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
    setWord();
    init=true;
}

var cword = null;

function setWord(){
    var z = window.opener.createArray();
    for (var i = 0;i <= ec; i++) {
		var idx = i;
        cword = nw[idx].word;
        z[i] = window.opener.createArray();
        z[i][0] = nw[idx].word;
		FindAndHighlight(i);
        if(nw[idx].suggCount > 0) {
           for(var j=0; j<nw[idx].suggCount;j++){
              z[i][j+1] = nw[idx].suggestions[j];
           }
		}	
    }
   window.opener.window._de_spell_words = z;
   window.close(); 
}

// Include the JavaScript suggestions file
document.write("<\script language=javascript type=text/javascript src=http://www.spellcheckme.com/delete_js.php?file=" + QueryString('JS') + "></\script>");

if (window.opener.browser.IE)var oRange = aed.body.createTextRange() ;

var wcount=0;
function FindAndHighlight(id){
	if ( window.opener.browser.IE )FindIE();
	else FindGecko();
	if (!ae.Editable())return;
	ae = window.opener.activeEditor;
	sptext = "<span id='_de_spell_word_"+id+"' style='background-color:yellow'>" + ae.GetSelection() + "</span>";
	wcount++;
	ae._inserthtml(sptext);
}

function FindIE()
{
	var iFlags = 0 ;

	iFlags = iFlags | 4 ;
	iFlags = iFlags | 2 ;

	var bFound = oRange.findText( cword, 1, iFlags ) ;

	if ( bFound )
	{
		oRange.scrollIntoView() ;
		oRange.select() ;
		oRange.collapse(false) ;
		oLastRangeFound = oRange ;
	}
}

function FindGecko()
{
	var bCase = true ;
	var bWord = true ;
	bFound = ae._window.find( cword, bCase, false, false, bWord, false, false );
	if (!bFound)bFound = ae._window.find( cword, bCase, true, false, bWord, false, false );
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
}	

</script>
</head>
<body></body>
</html>
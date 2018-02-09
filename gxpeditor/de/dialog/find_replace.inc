<HTML>
<HEAD>
<TITLE>Find / Replace</TITLE>
<script language="JavaScript">
d = document;
ae = window.opener.activeEditor;
aew = ae._window;
aed = ae._frame;	
var wordcount=0;

window.onload = function(){
	if (ae.isbegin && ae.isend)	getE("btnReplaceall").disabled  = false;
	this.focus();
	getE("strSearch").focus();
}	

function getE(id){
	return d.getElementById(id)
}

function checkInput(){
    if (getE("strSearch").value.length < 1) {
        alert("[sTxtFindError]");
        return false;
    } else {
        return true;
    }
}

function ReplaceTextNodes( parentNode, regex, replaceValue, replaceAll, hasFound )
{
	for ( var i = 0 ; i < parentNode.childNodes.length ; i++ )
	{
		var oNode = parentNode.childNodes[i] ;
		if ( oNode.nodeType == 3 )
		{
			var arr = oNode.nodeValue.match(regex);
			if (arr)wordcount+=arr.length;
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

function GetRegexExpr()
{
	if ( getE('blnMatchWord').checked )
		var sExpr = '\\b' + getE('strSearch').value + '\\b' ;
	else
		var sExpr = getE('strSearch').value ;
		
	return sExpr ;
}

function GetCase() 
{
	return ( getE('blnMatchCase').checked ? '' : 'i' ) ;
}

function Replace()
{
    if (checkInput()) {
	if (ae.GetSelection()==""){Find();}
	else {
		var oRegex = new RegExp( GetRegexExpr(), GetCase() ) ;
		ReplaceTextNodes( aed.body, oRegex, getE('strReplace').value, false, false ) ;
		Find();
	}	
	}
}

function ReplaceAll()
{
    if (checkInput()) {
	var oRegex = new RegExp( GetRegexExpr(), GetCase() + 'g' ) ;
    wordcount=0;
	ReplaceTextNodes( aed.body, oRegex, getE('strReplace').value, true, false ) ;
    if (wordcount == 0) msg = "[sTxtFindNotReplaced]";
        else msg = wordcount + "[sTxtFindReplaced]";
    alert(msg);
    }
}

if (window.opener.browser.IE)var oRange = aed.body.createTextRange() ;

function Find()
{
    if (checkInput()) {

	if ( window.opener.browser.IE )
		FindIE() ;
	else
		FindGecko() ;
	tops=0;	
	}
	checkReplace();
}

function checkReplace()
{
	if (ae.Editable()){
		getE("btnReplace").disabled  = false;
		getE("btnReplaceall").disabled  = false;		
	} else {
		getE("btnReplace").disabled  = true;
		getE("btnReplaceall").disabled  = true;		
	}	
}

function FindIE()
{
	var iFlags = 0 ;

	if ( getE('blnMatchCase').checked )
		iFlags = iFlags | 4 ;

	if ( getE('blnMatchWord').checked )
		iFlags = iFlags | 2 ;

	var bFound = oRange.findText( getE('strSearch').value, 1, iFlags ) ;

	if ( bFound )
	{
		oRange.scrollIntoView() ;
		oRange.select() ;
		oRange.collapse(false) ;
		oLastRangeFound = oRange ;
	}
	else
	{
		var startfromtop = confirm("[sTxtFindNotFound]");
		if (startfromtop) {  
			oRange = aed.body.createTextRange() ;
			FindIE();
		}	
	}
}

function FindGecko()
{
	var bCase = getE('blnMatchCase').checked ;
	var bWord = getE('blnMatchWord').checked ;
	var bFound = ae._window.find( getE('strSearch').value, bCase, false, false, bWord, true, false );

	if ( !bFound )
	{
		var startfromtop = confirm("[sTxtFindNotFound]");
		if (startfromtop) {  
	        var sel = aew.getSelection();
		    //var range = sel.getRangeAt(0);
		    var range = aed.createRange();
		    sel.removeAllRanges();
			FindGecko();
		}
	}
	
}

</script>
<script type="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
</HEAD>
<BODY class="dialogWindow">
<FORM NAME="frmSearch" method="post" action="">
<TABLE CELLSPACING="0" cellpadding="1" border="0">
<TR><TD VALIGN="top" align="left" nowrap style="font-family:Arial; font-size:11px;">
    <label for="strSearch" id="TxtFindFindWhat">[sTxtFindFindWhat]</label><br>
    <INPUT TYPE=TEXT SIZE=40 id="strSearch" style="width : 280px;"><br>
    <label for="strReplace" id="TxtFindReplaceWith">[sTxtFindReplaceWith]</label><br>
    <INPUT TYPE=TEXT SIZE=40 id="strReplace" style="width : 280px;"><br>
    <INPUT TYPE=Checkbox SIZE=40 id="blnMatchCase"><label for="blnMatchCase" id="TxtFindMatchCase">[sTxtFindMatchCase]</label><br>
    <INPUT TYPE=Checkbox SIZE=40 id="blnMatchWord"><label for="blnMatchWord" id="TxtFindMatchWord">[sTxtFindMatchWord]</label>
</td>
<td rowspan="2" valign="top">
    <input type="button" id="btnFind" style="width:75px; height:22px; font-family:Tahoma; font-size:11px; margin-top:15px" onClick="Find();" value="[sTxtFindNext]"><br>
    <input type="button" id="btnCancel" style="width:75px; height:22px; font-family:Tahoma; font-size:11px; margin-top:7px" onClick="window.close();" value="[sTxtFindClose]"><br>
    <input type="button" id="btnReplace" style="width:75px; height:22px; font-family:Tahoma; font-size:11px; margin-top:7px" onClick="Replace();" value="[sTxtFindReplaceText]"><br>
    <input type="button" id="btnReplaceall" style="width:75px; height:22px; font-family:Tahoma; font-size:11px; margin-top:7px" onClick="ReplaceAll();" value="[sTxtFindReplaceAll]"></button><br>
</td>
</tr>
</table>
</FORM>
</BODY>
</HTML>
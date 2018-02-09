<?php include_once("../de_lang/language.php"); ?>
<script language=JavaScript>

d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	this.focus();
	if (opener.browser.NS)getE("_mt").width="100%"
	doLoad();
}	

function getE(id){
	return d.getElementById(id)
}

function doLoad() {
	var ta = getE("edittag_html");
	ae.tempnode = ae.selectedtag;
	var html="";
	if (ae.selectedtag.outerHTML){	
		html = ae.selectedtag.outerHTML;
	} else {
		html = ae.outerHTML(ae.selectedtag);
	}	
	if (opener.browser.IE) html=window.opener.fix_bug_03(html);
	ta.value = window.opener.img2embed(html)
	ta.focus()
}

function InsertHtml() {
	var val = getE("edittag_html").value;
	ae._inserthtml(window.opener.embed2img(val));
	self.close();
}

</script>
<title>[sTxtEditTag]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=anchorForm>

<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtEditTagInst">[sTxtEditTagInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="90" id="TxtEditTagName">[sTxtEditTagName]:</td>
	<td class="body">
	  <textarea id="edittag_html" rows=4 class="edittag_textarea"></textarea>
  </td>
  </tr>
</table>
	
</div>
<div style="padding-top: 6px; float: right;">
	<input type="button" name="insertHtml" id="TxtOk" value="[sTxtOK]" class="Text75" onClick="javascript:InsertHtml();">
	<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
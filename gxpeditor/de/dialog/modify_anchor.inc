<script language=JavaScript>

d = document;
ae = window.opener.activeEditor;
aed = ae._frame;	

window.onload = function(){
	if (opener.browser.NS)getE("_mt").width="100%"
	setValues();
}	

function getE(id){return d.getElementById(id);}

function setValues() {
	this.focus();
	getE("anchor_name").value = ae.GetSelectedElement().name;
	getE("anchor_name").focus();
}


function InsertAnchor() {
	error = 0

	name = getE("anchor_name").value

   	if (error != 1) {
	if (name == "") {
		alert("[sTxtInsertAnchorErr]")
		getE("anchor_name").focus
		error = 1
	} else {
		el = ae.GetSelectedElement();
		el.name = name;
	}
	}
	
	if (error != 1) {
		self.close();
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:"";
	if (evt.keyCode == 13) {	// ENTER
		InsertAnchor();
	}
};

</script>
<title>[sTxtModifyAnchor]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=anchorForm>

<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyAnchorInst">[sTxtModifyAnchorInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="90" id="TxtInsertAnchorName">[sTxtInsertAnchorName]</td>
	<td class="body">
	  <input type="text" id="anchor_name" size="10" class="Text150" maxlength="150">
  </td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertAnchor();">
<input type="button" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
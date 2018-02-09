<script language=JavaScript>

d = document;
ae = window.opener.activeEditor;
aed = ae._frame;	
window.onload = function(){
	this.focus();
	if (opener.browser.NS)getE("_mt").width="100%"
	getE("anchor_name").focus();
}	

function getE(id){
	return d.getElementById(id);
}

function InsertAnchor() {
	error = 0

	name = getE("anchor_name").value

   	if (error != 1) {
		if (name == "") {
			alert("[sTxtInsertAnchorErr]")
			getE("anchor_name").focus();
			error = 1
		} else {
			selectedText = ae.GetSelection();
			ae._inserthtml("<a id=__de__anchor name=" + getE("anchor_name").value + ">" + selectedText + "</a>")
			if (ae.showborders==1)ae.commands.getCommand("Showborders").set(false);
			aed.getElementById('__de__anchor').removeAttribute("id");
		}
	}
	
	if (error != 1) {
		self.close();
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertAnchor()
	}
};


</script>
<title>[sTxtInsertAnchor]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=anchorForm>

<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertAnchorInst">[sTxtInsertAnchorInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="90" id="TxtInsertAnchorName">[sTxtInsertAnchorName]:</td>
	<td class="body">
	  <input type="text" id="anchor_name" size="10" class="Text150" maxlength="150">
  </td>
  </tr>
</table>
	
</div>
<div style="padding-top: 6px; float: right;">
	<input type="button" name="insertAnchor" id="TxtOk" value="[sTxtOK]" class="Text75" onClick="javascript:InsertAnchor();">
	<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
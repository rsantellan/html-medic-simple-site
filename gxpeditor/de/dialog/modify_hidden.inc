<script language=JavaScript>
d=document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = setValues;

selectedHidden= ae.GetSelectedElement();

var hiddenName = selectedHidden.name;
var hiddenValue = selectedHidden.value;

function getE(id){
	return d.getElementById(id)
}

function setValues() {
	getE("hidden_value").value = hiddenValue;
	getE("hidden_name").value = hiddenName;
	this.focus();
	getE("hidden_name").focus();
}

function doModify() {

	name = getE("hidden_name").value
	value = getE("hidden_value").value

	sh = selectedHidden;
	sh.name = name;
	sh.value = value;
	window.close()
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyField]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=hiddenForm>

<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyFieldInst">[sTxtModifyFieldInst]</span>
</div>
<br>

<table border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]:</td>
	<td class="body" width="200">
	  <input type="text" id="hidden_name" size="10" class="Text150" maxlength="50">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body">
	  <input type="text" id="hidden_value" size="10" class="Text150">
	</td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyHiddenField" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
</form>
<script language=javascript>
d = document;
var myPage = window.opener.activeEditor;
window.onload = setValues;

var al = myPage.parentNode("FORM");

var formName = al.name;
var formAction = al.action;
var formMethod = al.method;

function getE(id){
	return d.getElementById(id)
}

function setValues() {

	getE("form_name").value = formName;
	getE("form_action").value = formAction;
	getE("method").selectedIndex=0;
	for (var i=0;i<getE("method").options.length;i++) {
		if (getE("method").options[i].text.toUpperCase()==formMethod.toUpperCase()) getE("method").selectedIndex=i;
	}
	this.focus();
	getE("form_name").focus();
}

function doModify() {

	if (getE("form_name").value != "") {
		al.name = getE("form_name").value
	} else {
		al.removeAttribute('name',0)
	}

	if (getE("form_action").value != "") {
		al.action = getE("form_action").value
	} else {
		al.removeAttribute('action',0)
	}

	if (getE("method").options[getE("method").selectedIndex].text != "None") {
    	al.method = getE("method").options[getE("method").selectedIndex].text
    } else {
		al.removeAttribute('method',0)
    }
        
    window.close()
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyForm]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form id="formForm">
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyFormInst">[sTxtModifyFormInst]</span>
</div>
<br>

<table border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]:</td>
	<td class="body">
	  <input type="text" id="form_name" size="10" class="Text70" maxlength="50">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtAction">[sTxtAction]:</td>
	<td class="body">
	  <input type="text" id="form_action" size="50" class="Text250">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtMethod">[sTxtMethod]:</td>
	<td class="body">
	  <SELECT class=text70 id=method>
		<option>None
		<option>Post
		<option>Get</option>
	  </select>
  </td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyForm" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="Cancel" class="Text75" onClick="javascript:window.close()">
</div>

</form>
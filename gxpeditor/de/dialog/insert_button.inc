<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	this.focus();
	getE("button_name").focus();
}	

function printStyleList() {
	ae.doStyles();

	d.write(' <select id="sStyles" class = "text70"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

function getE(id){
	return d.getElementById(id)
}

function InsertButton() {
	error = 0
	
	name = getE("button_name").value
	value = getE("button_value").value
	type = getE("button_type")[getE("button_type").selectedIndex].text
	styles = getE("sStyles")[getE("sStyles").selectedIndex].text

	if (value != "") {
		value = ' value="' + value + '"'
	} else {
		value = ""
	}

	if (name != "") {
		name = ' name="' + name + '"'
	} else {
		name = ""
	}

	if (styles != "") {
		styles = " class=" + styles
	} else {
		styles = ""
	}

	HTMLTextField = '<input type="' + type + '"' + name + value + styles + '/>'
	window.opener.activeEditor._inserthtml(HTMLTextField);

	if (error != 1) {
		self.close();
	}
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertButton()
	}
};

</script>
<title>[sTxtInsertButton]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=buttonForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertButtonInst">[sTxtInsertButtonInst]</span>
</div>
<br>

<div style="width:100%">
<table border="0" cellspacing="0" cellpadding="5" style="width:100%">
  <tr>
	<td class="body" id="TxtName">[sTxtName]:</td>
	<td class="body"> <input type="text" id="button_name" size="10" class="Text70" maxlength="50"></td>
  <td width="10">&nbsp;</td>
	<td class="body" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body"><input type="text" id="button_value" size="10" class="Text70"></td>
  </tr>
  <tr>
	<td class="body" id="TxtType">[sTxtType]:</td>
	<td class="body">
	  <select id="button_type" class=text70>
		<option selected>Submit
		<option>Reset
		<option>Button</option>
	  </select>
	</td>
	<td width="20">&nbsp;</td>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body"><script>printStyleList()</script></td>
  </tr>
</table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertButton" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertButton();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
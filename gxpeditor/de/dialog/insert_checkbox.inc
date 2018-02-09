<script language=JavaScript>
ae = window.opener.activeEditor;
aed = ae._frame;
d = document;
window.onload = function(){
	this.focus();
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

var error
function InsertCheckbox() {
	name = getE("checkbox_name").value
	value = getE("checkbox_value").value
	checked = getE("checkbox_type")[getE("checkbox_type").selectedIndex].text
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

	if (checked == "Unchecked"){
		checked = ""
	}

	if (styles != "") {
		styles = " class=" + styles
	} else {
		styles = ""
	}

	HTMLTextField = '<input type=checkbox ' + checked + name + value + styles + '/>'
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
<title>[sTxtInsertCheckBox]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=checkboxForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertCheckBoxInst">[sTxtInsertCheckBoxInst]</span>
</div>
<br>
	  
<div id="_mt" style="width:100%">
<table border="0" cellspacing="0" cellpadding="5" width="100%">
<tbody>
	  <tr>
		<td class="body" id="TxtName"><div style="width:60">[sTxtName]:</div></td>
		<td class="body">
		  <input type="text" id="checkbox_name" size="10" class="Text70" maxlength="50">
	  	</td>
	  	<td width="100%">&nbsp;</td>
		<td class="body" id="TxtInitialValue"><div style="width:60">[sTxtInitialValue]:</div></td>
		<td class="body">
		  <input type="text" id="checkbox_value" size="10" class="Text70">
		</td>
	  </tr>
	  <tr>
		<td class="body" id="TxtInitialState">[sTxtInitialState]:</td>
		<td class="body">
		  <select id="checkbox_type" class=text70>
			<option>Checked</option>
			<option selected>Unchecked</option>
		  </select>
		</td>
	  	<td width="100%">&nbsp;</td>
		<td class="body" id="TxtStyle">[sTxtStyle]:</td>
		<td class="body"><script>printStyleList()</script></td>
	  </tr>
</tbody>	  
</table></div>
</div>

<div style="padding-top: 6px; float: right;">
<input type="button" name="insertCheckbox" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertCheckbox();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
</form>
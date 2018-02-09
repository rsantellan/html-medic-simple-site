<script language=JavaScript>
d = document;
window.onload = function(){
	this.focus();
	getE("text_name").focus();
}

ae = window.opener.activeEditor;
aed = ae._frame;

function getE(id){
	return d.getElementById(id)
}

function printStyleList() {
	ae.doStyles();

	d.write(' <select id="sStyles" class = "text70"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

var error
function InsertTextArea() {
		name = getE("text_name").value
		rows = getE("text_lines").value
		cols = getE("text_width").value
		value = getE("text_value").value
		styles = getE("sStyles")[getE("sStyles").selectedIndex].text

		error = 0
		if (isNaN(cols) || cols < 0) {
				alert("[sTxtCharWidthErr]")
				error = 1
				textForm.text_width.select()
				textForm.text_width.focus()
		} else if (isNaN(rows) || rows < 0) {
				alert("[sTxtLinesErr]")
				error = 1
				textForm.text_lines.select()
				textForm.text_lines.focus()
		}

		if (error != 1) {
				if (value != "") {
					value = value
				} else {
					value = ""
				}

				if (name != "") {
					name = ' name="' + name + '"'
				} else {
					name = ""
				}

				if (cols != "") {
					cols = ' cols="' + cols + '"'
				} else {
					cols = ""
				}

				if (rows != "") {
					rows = ' rows="' + rows + '"'
				} else {
					rows = ""
				}

				if (styles != "") {
					styles = " class=" + styles
				} else {
					styles = ""
				}

       			HTMLTextField = '<textarea' + name + cols + rows + styles + '>' + value + '</textarea>'
	   			window.opener.activeEditor._inserthtml(HTMLTextField);

		} // End if

	if (error != 1) {
		self.close();
	}
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertTextArea()
	}
};

</script>
<title>[sTxtInsertTextArea]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=textForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertTextAreaInst">[sTxtInsertTextAreaInst]</span>
</div>
<br>

<div style="width:100%">	  
<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
  <tr>
  <td valign=top><table border="0" cellspacing="0" cellpadding="5" style="width:100%">
	<tr>
	<td class="body" width="85" id="TxtName">[sTxtName]:</td>
	<td class="body" width="160"><input type="text" id="text_name" size="10" class="Text70" maxlength="50"></td>
	</tr>
  <tr>
	<td class="body" id="TxtCharWidth">[sTxtCharWidth]:</td>
	<td class="body">
	  <input type="text" id="text_width" size="3" class="Text70" maxlength="3">
	</td>
	</tr>
	<tr>
		<td class="body" id="TxtStyle">[sTxtStyle]:</td>
		<td class="body"><script>printStyleList()</script></td>
	</tr>	
	</table></td><td valign=top align=right><table border="0" cellspacing="0" cellpadding="5" style="width:100%">
	<tr>
		<td class="body" width="85" id="TxtInitialValue">[sTxtInitialValue]:</td>
		<td class="body"><input type="text" id="text_value" size="10" class="Text70"></td>
	</tr>
	<tr>
		<td class="body" id="TxtLines">[sTxtLines]:</td>
		<td class="body"><input type="text" id="text_lines" size="3" class="Text70" maxlength="3"></td>
	</tr> 
	<tr>
		<td class=body>&nbsp;</td>
		<td class=body>&nbsp;</td>
	</tr>
</table></td></tr></table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertTextField" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertTextArea();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
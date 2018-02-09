<script language=JavaScript>
d = document;
window.onload = function(){
	this.focus();
	getE("text_name").focus();
	if (opener.browser.NS)getE("_mt").width="100%"
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
function InsertTextField() {

		name 	= getE("text_name").value
		width 	= getE("text_width").value
		max 	= getE("text_max").value
		value 	= getE("text_value").value
		type 	= getE("text_type").options[getE("text_type").selectedIndex].text
		stylesel = getE("sStyles");
		styles 	= stylesel.options[stylesel.selectedIndex].text

		error = 0
		if (isNaN(width) || width < 0) {
				alert("[sTxtCharWidthErr]")
				error = 1
				textForm.text_width.select()
				textForm.text_width.focus()
		} else if (isNaN(max) || max < 0) {
				alert("[sTxtMaxCharsErr]")
				error = 1
				textForm.text_max.select()
				textForm.text_max.focus()
		}

		if (error != 1) {
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

				if (width != "") {
					width = ' size="' + width + '"'
				} else {
					width = ""
				}

				if (max != "") {
					max = ' maxlength="' + max + '"'
				} else {
					max = ""
				}

				if (styles != "") {
					styles = " class=" + styles
				} else {
					styles = ""
				}

        	HTMLTextField = '<input type="' + type + '"' + name + styles + value + width + max + '/>'
   			window.opener.activeEditor._inserthtml(HTMLTextField);
         	
		} // End if

	if (error != 1) {
		self.close();
	}
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertTextField()
	}
};

</script>
<title>[sTxtInsertTextField]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=textForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertTextFieldInst">[sTxtInsertTextFieldInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]:</td>
	<td class="body" width="200">
	  <input type="text" id="text_name" size="10" class="Text70" maxlength="50">
  </td>
	<td class="body" width="80" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body">
	  <input type="text" id="text_value" size="10" class="Text70">
	</td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtCharWidth">[sTxtCharWidth]:</td>
	<td class="body">
	  <input type="text" id="text_width" size="3" class="Text70" maxlength="3">
	</td>
	<td class="body" width="80" id="TxtMaxChars">[sTxtMaxChars]:</td>
	<td class="body">
	  <input type="text" id="text_max" size="3" class="Text70" maxlength="3">
	</td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtType">[sTxtType]:</td>
	<td class="body">
	  <select id="text_type" class=text70>
	  <option selected>Text
	  <option>Password</option>
	  </select>
	</td>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body"><script>printStyleList()</script></td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertTextField" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertTextField();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
</form>
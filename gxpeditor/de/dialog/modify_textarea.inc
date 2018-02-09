<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	setValues();
	this.focus();
	getE("text_name").focus();
}	

selectedTextArea = ae.GetSelectedElement();

var textName = selectedTextArea.name;
var textWidth = selectedTextArea.cols;
var textLines = selectedTextArea.rows;
var textValue = selectedTextArea.value;

function getE(id){
	return d.getElementById(id)
}

function  setSelectedClass(oSel){
	if (!oSel)return;
	var s = d.getElementById("sStyles");
	for (var i=0;i<s.options.length;i++){
		if (opener.browser.NS) var attr=oSel.getAttribute("class");
			else var attr=oSel.getAttribute("className");
		if (attr&&attr.toLowerCase()==s.options[i].value.toLowerCase())s.options[i].selected = true;
	}
}

function printStyleList() {
	ae.doStyles();

	d.write(' <select id="sStyles" class = "text70"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

function setValues() {

	if (textWidth == "-1"){
		textWidth = ""
	}
	if (textLines == "-1"){
		textLines =" "
	}

	getE("text_lines").value = textLines;
	getE("text_value").value = textValue;
	getE("text_name").value = textName;
	getE("text_width").value = textWidth;
	setSelectedClass(selectedTextArea);
	this.focus();
}

function doModify() {
		name = getE("text_name").value
		rows = getE("text_lines").value
		cols = getE("text_width").value
		value = getE("text_value").value
		styles = getE("sStyles")[getE("sStyles").selectedIndex].text

		error = 0
		ta = selectedTextArea
		if (isNaN(cols) || cols < 0) {
				alert(sTxtCharWidthErr)
				error = 1
				getE("text_width").select()
				getE("text_width").focus()
		} else if (isNaN(rows) || rows < 0) {
				alert(sTxtLinesErr);
				error = 1;
				getE("text_lines").select();
				getE("text_lines").focus();
		}

		if (error != 1) {
				if (value != "") {
					ta.value = value;
				} else {
					ta.value = "";
				}

				if (name != "") {
					ta.name = name;
				} else {
					ta.name = "";
				}

				if (cols != "") {
					ta.cols = cols;
				}else {
					if (ta.getAttribute("cols"))ta.removeAttribute("cols");
				}

				if (rows != "") {
					ta.rows = rows;
				}else {
					if (ta.getAttribute("rows"))ta.removeAttribute("rows");
				}

				if (styles != "") {
					ta.clessName = styles;
				}

		} // End if:
   
    window.close()
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyTextArea]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=textForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyTextAreaInst">[sTxtModifyTextAreaInst]</span>
</div>
<br>
<div style="width:100%">
<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
  <tr>
  <td><table border="0" cellspacing="0" cellpadding="5" style="width:50%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]:</td>
	<td class="body" width="200"><input type="text" id="text_name" size="10" class="Text70" maxlength="50"></td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtCharWidth">[sTxtCharWidth]:</td>
	<td class="body">
	  <input type="text" id="text_width" size="3" class="Text70" maxlength="3">
	</td>
	</tr>  
  <tr>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body"><script>printStyleList()</script></td>
	</tr>	
  </table></td><td align=right><table border="0" cellspacing="0" cellpadding="5" style="width:50%">
  <tr>
	<td class="body" width="80" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body">
	  <input type="text" id="text_value" size="10" class="Text70">
	</td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtLines">[sTxtLines]:</td>
	<td class="body">
	  <input type="text" id="text_lines" size="3" class="Text70" maxlength="3">
	</td>
  </tr>
	<tr>  
	<td>&nbsp;</td>
	<td>&nbsp;</td>
  </tr>
</table></td></tr></table>
</div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertTextField" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
<script language=JavaScript>
d=document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	setValues();
}	

selectedCheckbox	= ae.GetSelectedElement();
var checkboxName = selectedCheckbox.name;
var checkboxValue = selectedCheckbox.value;
var checkboxType = selectedCheckbox.checked; // true or false
var checkboxClass = selectedCheckbox.className;

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

function getE(id){
	return d.getElementById(id)
}

function setValues() {

	getE("checkbox_value").value = checkboxValue;
	getE("checkbox_name").value = checkboxName;
	setSelectedClass(selectedCheckbox);
	this.focus();
	getE("checkbox_name").focus();
}

function doModify() {

	name = getE("checkbox_name").value
	value = getE("checkbox_value").value
	checked = getE("checkbox_type")[getE("checkbox_type").selectedIndex].text
	styles = getE("sStyles")[getE("sStyles").selectedIndex].text

	sc = selectedCheckbox
	if (value != "") {
		sc.value = value
	} else {
	}
	if (name != "") {
		sc.name = name
	} else {
	}

	if (checked == "Unchecked"){
		sc.checked = false
	} else {
		sc.checked = true
	}

	if (styles != "") {
		sc.className = styles
	} else {
	}

    window.close()
}

function printType() {
	if ((checkboxType != undefined) || (checkboxType != "")) {
		if (checkboxType == false) { 
			checkboxType = "Unchecked"
		}

		if (checkboxType == true) {
			checkboxType = "Checked"
		}

		document.write('<option selected>' + checkboxType)
		document.write('<option>Checked')
		document.write('<option>Unchecked</option>')
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyCheckBox]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=checkboxForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyCheckBoxInst">[sTxtModifyCheckBoxInst]</span>
</div>
<br>
<div id="_mt" style="width:100%">
<table border="0" cellspacing="0" cellpadding="5" style="width:100%">
  <tr>
	<td class="body" id="TxtName"><div style="width:60">[sTxtName]:</div></td>
	<td class="body" width="190">
	  <input type="text" id="checkbox_name" size="10" class="Text70" maxlength="50">
  </td>
  	<td></td>
	<td class="body" id="TxtInitialValue"><div style="width:60">[sTxtInitialValue]:</div></td>
	<td class="body">
	  <input type="text" id="checkbox_value" size="10" class="Text70">
	</td>
  </tr>
  
  <tr>
	<td class="body" width="90" id="TxtInitialState">[sTxtInitialState]:</td>
	<td class="body">
	  <select id="checkbox_type" class=text70>
		<script>printType()</script>
	  </select>
	</td>
	<td></td>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body">
	<script>printStyleList()</script></td>
  </tr>
</table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyCheckbox" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
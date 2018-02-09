<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	setValues();
}	

selectedRadio	= ae.GetSelectedElement();

var radioName = selectedRadio.name;
var radioValue = selectedRadio.value;
var radioType = selectedRadio.checked; // true or false

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

	d.write('<select id="sStyles" class="text70"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

function setValues() {
	getE("radio_value").value = radioValue;
	getE("radio_name").value = radioName;
	setSelectedClass(selectedRadio);
	this.focus();
	getE("radio_name").focus();
}

function getE(id){
	return d.getElementById(id)
}

function replaceText(){
	d.title = sTxtModifyRadio
	getE("TxtModifyRadioInst").innerHTML = sTxtModifyRadioInst;
	getE("TxtName").innerHTML = sTxtName;
	getE("TxtInitialValue").innerHTML = sTxtInitialValue;
	getE("TxtInitialState").innerHTML = sTxtInitialState;
	getE("TxtStyle").innerHTML = sTxtStyle;
	getE("TxtOK").value = sTxtOK
	getE("TxtCancel").value = sTxtCancel
}

function doModify() {
	name = getE("radio_name").value
	value = getE("radio_value").value
	checked = getE("radio_type").options[getE("radio_type").selectedIndex].text
	styles = getE("sStyles").options[getE("sStyles").selectedIndex].text

	sr	= ae.GetSelectedElement();
	if (value != "") {
		sr.value = value
	}

	if (name != "") {
		sr.name = name
	}

	if (checked == "Unchecked"){
		sr.checked = false
	} else {	
		sr.checked = true
	}

	if (styles != "") {
		sr.className = styles
	}

    window.close()
}

function printType() {
	if ((radioType != undefined) || (radioType != "")) {
		if (radioType == false) { 
			radioType = "Unchecked"
		}

		if (radioType == true) {
			radioType = "Checked"
		}

		document.write('<option selected>' + radioType)
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
<title>[sTxtModifyRadio]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=radioForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyRadioInst">[sTxtModifyRadioInst]</span>
</div>
<br>
<div style="width:100%">
<table border="0" cellspacing="0" cellpadding="5" style="width:100%">
  <tr>
	<td class="body" id="TxtName">[sTxtName]:</td>
	<td class="body" ><input type="text" id="radio_name" size="10" class="Text70" maxlength="50"></td>
  <td width=20>&nbsp;</td>
	<td class="body" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body">
	  <input type="text" id="radio_value" size="10" class="Text70">
	</td>
  </tr>
  <tr>
	<td class="body" id="TxtInitialState">[sTxtInitialState]:</td>
	<td class="body"><select id="radio_type" class=text70><script>printType()</script></select></td>
  <td width=20>&nbsp;</td>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body"><script>printStyleList()</script></td>
</tr>
</table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyRadio" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
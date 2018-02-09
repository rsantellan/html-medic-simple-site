<script language=JavaScript>
d=document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	setValues();
}	

selectedButton 	= ae.GetSelectedElement();
var buttonName 	= selectedButton.name;
var buttonValue = selectedButton.value;
var buttonType 	= selectedButton.type;
var buttonClass = selectedButton.className;

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

	getE("button_value").value = buttonValue;
	getE("button_name").value = buttonName;
	setSelectedClass(selectedButton);
	this.focus();
	getE("button_name").focus();
}

function doModify() {
	error = 0
	
	name = getE("button_name").value
	value = getE("button_value").value
	type = getE("button_type").options[getE("button_type").selectedIndex].text
	styles = getE("sStyles").options[getE("sStyles").selectedIndex].text

	sb = selectedButton;
	if (opener.browser.NS){
		sb.value = value
		sb.name = name
		sb.setAttribute("type",type)
		if (styles != "")sb.className = styles;
	} else {
	
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

   		HTMLTextField = '<input type="' + type + '"' + name + value + styles + '>'
   		sb.outerHTML = HTMLTextField
	}

    window.close()
}

function printType() {
	if ((buttonType != undefined) && (buttonType != "")) {
		document.write('<option selected>' + buttonType)
		document.write('<option>Submit')
		document.write('<option>Reset')
		document.write('<option>Button')
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyButton]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=buttonForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyButtonInst">[sTxtModifyButtonInst]</span>
</div>
<br>
<div style="width:100%">
<table border="0" cellspacing="0" cellpadding="5" style="width:100%">
	  <tr>
		<td class="body" id="TxtName">[sTxtName]:</td>
		<td class="body"><input type="text" id="button_name" size="10" class="Text70" maxlength="50"></td>
	  <td width=20>&nbsp;</td>
		<td class="body" ihd="TxtInitialValue">[sTxtInitialValue]:</td>
		<td class="body"><input type="text" id="button_value" size="10" class="Text70"></td>
	  </tr>
	  <tr>
		<td class="body" id="TxtType">[sTxtType]:</td>
		<td class="body">
		  <select id="button_type" class=text70>
			<script>printType()</script>
		  </select>
		</td>
	  <td width=20>&nbsp;</td>
		<td class="body" id="TxtStyle">[sTxtStyle]:</td>
		<td class="body"><script>printStyleList()</script></td>
	  </tr>
</table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyButton" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
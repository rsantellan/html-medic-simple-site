<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	if (opener.browser.NS)getE("_mt").width="100%"
	setValues();
}	

function getE(id){
	return d.getElementById(id)
}

selectedSelectBox	= ae.GetSelectedElement();

var selectName = selectedSelectBox.name;
var selectValue = selectedSelectBox.innerHTML;
var selectClass = selectedSelectBox.className;
var selectSize = selectedSelectBox.size;
var selectType = selectedSelectBox.type;

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

	d.write(' <select id="sStyles" class = "text90"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

function setValues() {
	getE("selectbox_name").value = selectName;
	getE("selectSize").value = selectSize;
	setSelectedClass(selectedSelectBox);
	selectType == "select-one" ? getE("selectType").options[0].selected = true : textForm.selectType.options[1].selected = true
	this.focus();
	getE("selectbox_name").focus();
}

var error
function InsertSelectBox(){

	name = getE("selectbox_name").value
	styles = getE("sStyles").options[getE("sStyles").selectedIndex].text
	multiple = getE("selectType").selectedIndex;
	size = getE("selectSize").value;

	if (name)selectedSelectBox.setAttribute("name",name)
	if (styles)selectedSelectBox.setAttribute("className",styles)
	if (multiple)selectedSelectBox.setAttribute("multiple",true)
	if (size){
		selectedSelectBox.setAttribute("size",size)
	}else {
		if (selectedSelectBox.getAttribute("size"))selectedSelectBox.removeAttribute("size");
	}	
	for (var i=selectedSelectBox.options.length-1;i>=0;i--){
		selectedSelectBox.remove(i);
	}

	for (var i=0; i < selectObj.options.length; ++i)
	{
		var newElem = aed.createElement("OPTION")
		newElem.text = selectObj.options[i].text;
		newElem.value = selectObj.options[i].value;
		if (optionArray[i][2] == true) newElem.selected = true;
		selectedSelectBox.options.add(newElem)
	}

	if (error != 1)self.close();
	
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertSelectBox()
	}
};

</script>
<title>[sTxtModifySelect]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=textForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span>[sTxtModifySelectInst]</span>
</div>:
<br>
	  
<script>
	optionArray = new Array();
	for (i=0; i < selectedSelectBox.options.length; ++i)
		{optionArray[optionArray.length] = new Array(selectedSelectBox.options[i].text, selectedSelectBox.options[i].value, selectedSelectBox.options[i].getAttribute("selected"));}
	
	function addOption(textObj,valueObj,selectObj)
		{
		if (textObj.value.replace(/[ ]/g,"") != "")
			{selectObj.options[selectObj.length] = new Option(textObj.value,valueObj.value);}
		}
	
	function editOption(optionObj,formObj)
	{
		getE("optionText").value = optionObj[optionObj.selectedIndex].text;
		getE("optionValue").value = optionObj[optionObj.selectedIndex].value;
		getE("optionSelected").checked = optionArray[optionObj.selectedIndex][2];
		getE("formUpdate").disabled = false;
		getE("removeOption").disabled = false;
	}
		
	function updateOption(textTextObj,textValueObj,selectObj)
		{
		selectObj.options[selectObj.selectedIndex].text = textTextObj.value;
		selectObj.options[selectObj.selectedIndex].value = textValueObj.value;
		selectObj.options[selectObj.options.length] = new Option();
		selectObj.options[selectObj.options.length - 1].selected = true;
		selectObj.options[selectObj.options.length - 1] = null;
		selectObj.form.removeOption.disabled = true;
		}
	
	function deleteOption(selectObj, formObj)
		{
		//options[selectObj.selectedIndex] = null
		selectObj.remove(selectObj.selectedIndex);
		clearForm(formObj);
		}
		
	
	function doOption(formObj, currentAction)
		{
		if (currentAction.indexOf("add") == 0)
			{
			addOption(formObj.optionText, formObj.optionValue,formObj.tmpSelect);
			optionArray[optionArray.length] = new Array(formObj.optionText.value, formObj.optionValue.value, formObj.optionSelected.checked);
			getE("optionText").focus();
			clearForm(formObj);
			}
		else if (currentAction.indexOf("update") == 0)
			{
			thisItem = formObj.tmpSelect.selectedIndex;
			updateOption(formObj.optionText, formObj.optionValue,formObj.tmpSelect);
			optionArray[thisItem] = new Array(formObj.optionText.value, formObj.optionValue.value, formObj.optionSelected.checked);
			clearForm(formObj);
			}
		else if (currentAction.indexOf("remove") == 0)
			{
			optionArray.splice(formObj.tmpSelect.selectedIndex,1)
			deleteOption(formObj.tmpSelect);
			clearForm(formObj);
			}
		else
			{}	
		}

	function doOption(formObj, currentAction)
		{
		if (currentAction.indexOf("add") == 0)
			{
			addOption(formObj.optionText, formObj.optionValue,formObj.tmpSelect);
			optionArray[optionArray.length] = new Array(formObj.optionText.value, formObj.optionValue.value, formObj.optionSelected.checked);
			getE("optionText").focus();
			clearForm(formObj);
			}
		else if (currentAction.indexOf("update") == 0)
			{
			thisItem = formObj.tmpSelect.selectedIndex;
			updateOption(formObj.optionText, formObj.optionValue,formObj.tmpSelect);
			optionArray[thisItem] = new Array(formObj.optionText.value, formObj.optionValue.value, formObj.optionSelected.checked);
			clearForm(formObj);
			}
		else if (currentAction.indexOf("remove") == 0)
			{
			optionArray.splice(formObj.tmpSelect.selectedIndex,1)
			deleteOption(formObj.tmpSelect);
			clearForm(formObj);
			}
		else
			{}	
		}

	function doSize(selectObj, formObj) {
		if (selectObj.selectedIndex == 1)
			getE("selectSize").disabled = false
		else
			getE("selectSize").disabled = true
	}
	
	function clearForm(formObj)
	{
		getE("optionText").value = "";
		getE("optionValue").value = "";
		getE("optionSelected").checked = false;
		getE("tmpSelect").selectedIndex = -1;
		getE("formUpdate").disabled = true;
		getE("removeOption").disabled = true;
	}
</script>	  

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="85">[sTxtName]:</td>
	<td class="body" width="160"><input type="text" id="selectbox_name" size="20" class="Text150" maxlength="50"></td>
	<td>&nbsp;</td>
	<td class="body" width="85" colspan="2">[sTxtMaintainOptions]:</td>
  </tr>
  <tr><!--- Current Options --->
	<td class="body" valign="top">[sTxtCurrentOptions]:</td>
	<td class="body"><select id="tmpSelect" size="5" onchange="editOption(this, this.form);"  class=text150><script>document.write(selectValue)</script></select></td>
	<td>&nbsp;</td>
	<!--- Add / Mod Options --->
	<td class="body" valign="top" colspan="2" valign="top"rowspan=2>
		<table cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td class="body" nowrap>[sTxtText]:</td>
				<td><input type="text" id="optionText" size="15" class="Text70"></td>
			</tr>
			<tr>
				<td class="body" nowrap>[sTxtValue]:</td>
				<td><input type="text" id="optionValue" size="15" class="Text70"></td>
			</tr>
			<tr>
				<td class="body" nowrap>[sTxtSelected]:</td>
				<td><input type="Checkbox" id="optionSelected"></td>
			</tr>
			<tr>
				<td colspan=2>&nbsp;</td>
			</tr>
			<tr>
				<td align="right"><input id="formAction" type="Button" value="[sTxtAdd]" onclick="doOption(this.form, 'add');" class=text75>&nbsp;&nbsp;</td>
				<td><input id="formUpdate" type="Button" value="[sTxtUpdate]" onclick="doOption(this.form, 'update');" class=text75 disabled>&nbsp;&nbsp;<input id="removeOption" type="Button" onclick="deleteOption(this.form.tmpSelect, this.form);" value="[sTxtDelete]" class=text75 disabled></td>
			</tr>
		</table>
	</td>
  </tr>
  <tr>
  	<td class="body">[sTxtType]:</td>
	<td><select class="Text150" id="selectType" onchange="doSize(this, this.form);"><option value="">[sTxtSingle]</option><option value="multiple">[sTxtMultiple]</option></select></td>
	<td>&nbsp;</td>
  </tr>
  <tr>
  	<td class="body">[sTxtSize]:</td>
	<td><input type="Text" class="text150" id="selectSize"></td>
	<td>&nbsp;</td>
	<td colspan="2">&nbsp;</td>
  </tr>
  <tr>
  	<td class="body">[sTxtStyle]:</td>
	<td><script>printStyleList()</script></td>
	<td>&nbsp;</td>
	<td colspan="2">&nbsp;</td>
  </tr>
</table>


</div>
<div style="padding-top: 6px; float: right;">
<input type="button" id="insertSelectbox" value="[sTxtOK]" class="Text75" onClick="javascript:InsertSelectBox();">
<input type="button" id="Submit" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
<script>
selectObj = getE("tmpSelect");
selectObj.options[selectObj.options.length] = new Option();
selectObj.options[selectObj.options.length - 1].selected = true;
selectObj.options[selectObj.options.length - 1] = null;
</script>
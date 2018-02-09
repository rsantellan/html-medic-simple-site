<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;
window.onload = function(){
	if (opener.browser.NS)getE("_mt").width="100%"
	this.focus();
	getE("selectbox_name").focus();
}	

function getE(id){
	return d.getElementById(id)
}

function printStyleList() {
	ae.doStyles();

	d.write(' <select id="sStyles" class = "text90"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}

function getE(id){
	return d.getElementById(id)
}

var error
function InsertSelectBox() 
	{
	
	var error = 0
			name = getE("selectbox_name").value
			tmpOptions = "";
			for (i=0; i < optionArray.length; ++i)
				{
				optionArray[i][2] == true ? itemSelected = " selected" : itemSelected = ""
				tmpOptions = tmpOptions + "<option value=\"" + optionArray[i][1] + "\"" + itemSelected + ">" + optionArray[i][0] + "</option>";
				}
			//alert(tmpOptions);
			styles = getE("sStyles")[getE("sStyles").selectedIndex].text
			multiple = getE("selectType").selectedIndex;
			size = getE("selectSize").value;
			if (isNaN(size)) {
				error = 1
				getE("selectSize").focus()
				getE("selectSize").select()
				alert("Size must contain a valid, positive number")
			}
	
			if (error != 1) 
				{
				name != "" ? name = ' name="' + name + '"' : name = ""
				multiple == 1 ? multiple = " multiple " : multiple = ""
				styles != "" ? styles = " class=" + styles : styles = ""
				size != 0 ? size = "size=" + size : size = ""
				if (multiple != 1)
					size = ""
				HTMLSelectBox = "<select" + name + styles + multiple + size + ">" + tmpOptions + "</select>"	
				window.opener.activeEditor._inserthtml(HTMLSelectBox);
			} // End if

	if (error != 1) {
		self.close();
	}
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertSelectBox()
	}
};

</script>
<title>[sTxtInsertSelect]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=textForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertSelectInst">[sTxtInsertSelectInst]</span>
</div>
<br>
	  
<script>
	optionArray = new Array();
	
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
		//optionTag = optionObj[optionObj.selectedIndex].outerHTML.replace(optionObj[optionObj.selectedIndex].text,"");
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
		selectObj.options[selectObj.selectedIndex] = null;
		clearForm(formObj);
		}
		
	
	function doOption(formObj, currentAction)
		{
		if (currentAction.indexOf("add") == 0)
			{
			addOption(formObj.optionText, formObj.optionValue,formObj.tmpSelect);
			optionArray[optionArray.length] = new Array(formObj.optionText.value, formObj.optionValue.value, formObj.optionSelected.checked);
			formObj.optionText.focus();
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
			formObj.selectSize.disabled = false
		else
			formObj.selectSize.disabled = true
	}
	
	function clearForm(formObj)
	{
		getE("optionValue").value = "";
		getE("optionSelected").checked = false;
		getE("tmpSelect").selectedIndex = -1;
		try{
			getE("optionText").value = "";
		} catch(e)	{}
		getE("formUpdate").disabled = true;
		getE("removeOption").disabled = true;
	}
</script>	  

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="85" id="TxtName">[sTxtName]:</td>
	<td class="body" width="160"><input type="text" id="selectbox_name" size="20" class="Text150" maxlength="50"></td>
	<td>&nbsp;</td>
	<td class="body" width="85" colspan="2" id="TxtMaintainOptions">[sTxtMaintainOptions]:</td>
  </tr>
  <tr><!--- Current Options --->
	<td class="body" valign="top" id="TxtCurrentOptions">[sTxtCurrentOptions]:</td>
	<td class="body"><select style="width:150px" id="tmpSelect" size="5" onchange="editOption(this, this.form);" class=text150></select></td>
	<!--- Add / Mod Options --->
	<td>&nbsp;</td>
	<td class="body" valign="top" colspan="2" valign="top" rowspan=2>
		<table cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td class="body" nowrap id="TxtText">[sTxtText]:</td>
				<td><input type="text" id="optionText" size="15" class="Text70"></td>
			</tr>
			<tr>
				<td class="body" nowrap id="TxtValue">[sTxtValue]:</td>
				<td><input type="text" id="optionValue" size="15" class="Text70"></td>
			</tr>
			<tr>
				<td class="body" nowrap id="TxtSelected">[sTxtSelected]:</td>
				<td><input type="Checkbox" id="optionSelected"></td>
			</tr>
			<tr>
				<td colspan=2>&nbsp;</td>
			</tr>
			<tr>
				<td align="right"><input id="formAction" type="Button" value="[sTxtAdd]" onclick="doOption(this.form, 'add');" class=text75>&nbsp;&nbsp;</td>
				<td><input id="formUpdate" type="Button" value="[sTxtUpdate]" onclick="doOption(this.form,'update');" class=text75 disabled>&nbsp;&nbsp;<input id="removeOption" type="Button" onclick="deleteOption(this.form.tmpSelect, this.form);" id="TxtDelete" value="[sTxtDelete]" class=text75 disabled></td>
			</tr>
		</table>
	</td>
  </tr>
  <tr>
  	<td class="body" id ="TxtType">[sTxtType]:</td>
	<td><select class="Text150" id="selectType" onchange="doSize(this, this.form);"><option value="">Single Select</option><option value="multiple">Multiple Select</option></select></td>
	<td>&nbsp;</td>
  </tr>
  <tr>
  	<td class="body" id="TxtSize" id="TxtSize">[sTxtSize]:</td>
	<td><input type="Text" class="text150" id="selectSize" disabled value=0></td>
	<td>&nbsp;</td>
	<td colspan="2">&nbsp;</td>
  </tr>
  <tr>
  	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td><script>printStyleList()</script></td>
	<td>&nbsp;</td>
	<td colspan="2">&nbsp;</td>
  </tr>
</table>


</div>
<div style="padding-top: 6px; float: right;">
<input type="button" id="TxtOK" id="insertSelectbox" value="[sTxtOK]" class="Text75" onClick="javascript:InsertSelectBox();">
<input type="button" id="TxtCancel" id="Submit" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
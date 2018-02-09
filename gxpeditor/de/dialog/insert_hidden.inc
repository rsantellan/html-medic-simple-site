<script language=JavaScript>
d = document;
window.onload = function(){
	if (opener.browser.NS)getE("_mt").width="100%"
	this.focus();
	getE("hidden_name").focus();
}	
ae = window.opener.activeEditor;
aed = ae._frame;

function getE(id){
	return d.getElementById(id)
}

var error
function InsertHiddenField() {
		name = getE("hidden_name").value
		value = getE("hidden_value").value

		error = 0

		if (error != 1) {
				if (value != "None") {
					value = ' value="' + value + '"'
				} else {
					value = ""
				}

				if (name != "") {
					name = ' name="' + name + '"'
				} else {
					name = ""
				}

        		HTMLTextField = '<input id=ewp_element_to_style type=hidden' + name + value + '/>'
	   			ae=window.opener.activeEditor
	   			ae._inserthtml(HTMLTextField);
	   			
				oHidden = window.opener.activeEditor._frame.getElementById("ewp_element_to_style")
				ae.commands.getCommand("Showborders").set();
	
				oHidden.removeAttribute("id")


		} // End if

	if (error != 1) {
		self.close();
	}
} // End function

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertHiddenField()
	}
};

</script>
<title>[sTxtInsertHidden]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=hiddenForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertHiddenInst">[sTxtInsertHiddenInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]:</td>
	<td class="body" width="200">
	  <input type="text" id="hidden_name" size="10" class="Text150" maxlength="50">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtInitialValue">[sTxtInitialValue]:</td>
	<td class="body">
	  <input type="text" id="hidden_value" size="10" class="Text150">
	</td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertHiddenField" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertHiddenField();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
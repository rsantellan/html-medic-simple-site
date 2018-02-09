<script language=JavaScript>
d = document;
window.onload = this.focus

function getE(id){
	return d.getElementById(id)
}

function InsertForm() {
	error = 0

			name = document.getElementById("form_name").value
			action = document.getElementById("form_action").value
			m = document.getElementById("form_method")
			method = m[m.selectedIndex].text

        		if (error != 1) {

				if (method != "None") {
					method = ' method="' + method + '"'
				} else {
					method = ""
				}

				if (name != "") {
					name = ' name="' + name + '"'
				} else {
					name = ""
				}

				if (action != "") {
					action = ' action="' + action + '"'
				} else {
					action = ""
				}

        			HTMLForm = "<form " + name + action + method +">&nbsp;</form>"
        			ae = window.opener.activeEditor;
        			aed = ae._frame;
        			ae._inserthtml(HTMLForm);
        			ae.Focus();
        		}
	
	window.close();
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertForm()
	}
};

</script>
<title>[sTxtInsertForm]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=formForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertFormInst">[sTxtInsertFormInst]</span>
</div>
<br>

<table border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr>
	<td class="body" width="80" id="TxtName">[sTxtName]</td>
	<td class="body">
	  <input type="text" id="form_name" size="10" class="Text70" maxlength="50">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtAction">[sTxtAction]:</td>
	<td class="body">
	  <input type="text" id="form_action" size="50" class="Text250">
  </td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtMethod">[sTxtMethod]:</td>
	<td class="body">
	  <select class=text70 id=form_method>
		<option selected>None
		<option>Post
		<option>Get</option>
		</select>
	</td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertForm" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertForm();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
</form>
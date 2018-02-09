<script language=JavaScript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;

window.onload = doLoad

function getE(id){
	if (id=="foo"){
		if (opener.browser.NS) return d.getElementById(id).contentDocument;
		 else return d.frames[id].document;
	} else return d.getElementById(id);
}

function doLoad() {
	ci = window.opener.customInserts
	
	for (i = 0; i < ci.length; i++) {
		newOption = document.createElement("option");
		newOption.value = ci[i][1]
		newOption.text = ci[i][0]
		document.getElementById("myCi").options.add(newOption)
	}
	this.focus();
}

re = /&lt;/g
re2 = /&gt;/g
function doPreview(myForm) {
	customHTML = getE("myCi").value
	previewPane = document.getElementById("p1")
	if (customHTML == "") {
		getE("foo").body.innerHTML = ""
	} else {
		customHTML = customHTML.replace(re,"<")
		customHTML = customHTML.replace(re2,">")
		getE("foo").body.innerHTML = customHTML
	}
}

function InsertHTML() {
	error = 0
	customHTML = getE("foo").body.innerHTML

   	if (error != 1) {
		if (customHTML == "") {
			alert("[sTxtCustomInsertErr]")
			error = 1
		} else {
			ae._inserthtml(customHTML)
		}
	}

	if (error != 1)self.close();
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertSelectBox()
	}
};
</script>

<title>[sTxtCustomInserts]</title>
<script type="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow">
<form name=customForm>

<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span>[sTxtCustomInsertInst]</span>
</div>
<br>

<table border="0" cellspacing="0" cellpadding="5" style="width:92%">
  <tr> 
	<td class="body" width="90" valign=top>[sTxtCustomInsert]:</td>
	<td class="body"> 
	  <select name="customInserts" id=myCi size="4" class=text220 onChange="doPreview(this.form)" style="width:300px">
	  </select>
	</td>
  </tr>
  <tr>
	<td class="body" width="90" valign=top>[sTxtPreview]:</td>
	<td class="body"><iframe id="foo" src="" border="1" style="width:300px;height:100px;"></iframe></td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertHTML" value="[sTxtOK]" class="Text75" onClick="javascript:InsertHTML();">
<input type="button" name="Submit" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

</form>
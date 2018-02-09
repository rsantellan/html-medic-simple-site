<script language=javascript>

d = document;
ae = window.opener.activeEditor;
aed = ae._frame;	

var myTable = ae.GetSelectedElement();
if (myTable&&myTable.tagName.toUpperCase()!="TABLE") myTable = ae.parentNode("TABLE");
	else if(!myTable) myTable = ae.parentNode("TABLE");
var tableBgColor = myTable.bgColor;
var tableSpacing = myTable.cellSpacing;
var tablePadding = myTable.cellPadding;
var tableBorder = myTable.border;
var tableWidth = myTable.width;
var tableHeight = myTable.height;
var tableAlign = myTable.align;


window.onload = function(){
	setValues();
	c = new ColorCommand("dialog/colormenu.php");
}

document.onclick = function(){
	getE("colormenu").style.visibility="hidden"
}

function getE(id){
	return d.getElementById(id)
}

var tempObj = function(id){
	this.id = id;
}

tempObj.prototype.SetColor = function(color){
	if (color.substr(0,1)!="#"){
		pos1 = color.indexOf(",")
		pos2 = color.lastIndexOf(",")
		color = RGBtoHex(color.substring(4,pos1),color.substring(pos1+1,pos2),color.substring(pos2+1,color.length-1))
	}
	getE(this.id).value = color;
	getE("colormenu").style.visibility="hidden"
}

function RGBtoHex(R,G,B) {return "#"+toHex(R)+toHex(G)+toHex(B)}
function toHex(N) {
 if (N==null) return "00";
 N=parseInt(N); 
 if (N==0 || isNaN(N)) return "00";
 N=Math.max(0,N); 
 N=Math.min(N,255); 
 N=Math.round(N);
 return "0123456789ABCDEF".charAt((N-N%16)/16)+"0123456789ABCDEF".charAt(N%16);
}

function showColorMenu(e,button,y,id) {
	e = (e)?e:(window.event)?window.event:""
	t = new tempObj(id);
	window.tempcolorbut = t;
	c.execute(button,y)
	if (e.stopPropagation){
		e.stopPropagation();
	} else {
		e.cancelBubble=true;
	}
	return false;
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

	if (tableSpacing == "") tableSpacing = 2;
	if (tablePadding == "") tablePadding = 1;
	if (tableBorder == "") tableBorder = 0;

	getE("table_bgcolor").value = tableBgColor;
	getE("table_padding").value = tablePadding;
	getE("table_spacing").value = tableSpacing;
	getE("table_border").value = tableBorder;
	getE("table_width").value = tableWidth;
	getE("table_height").value = (tableHeight==undefined?"":tableHeight);
	setSelectedClass(myTable);
	this.focus();
	getE("table_bgcolor").focus();
}

function doModify() {

	var error = 0;
	if (isNaN(getE("table_padding").value) || getE("table_padding").value < 0 || getE("table_padding").value == "") {
		alert("[sTxtTablePaddingErr]")
		error = 1
		getE("table_padding").select()
		getE("table_padding").focus()
	} else if (isNaN(getE("table_spacing").value) || getE("table_spacing").value < 0 || getE("table_spacing").value == "") {
		alert("[sTxtTableSpacingErr]")
		error = 1
		getE("table_spacing").select()
		getE("table_spacing").focus()
	} else if (isNaN(getE("table_border").value) || getE("table_border").value < 0 || getE("table_border").value == "") {
		alert("[sTxtTableBorderErr]")
		error = 1
		getE("table_border").select()
		getE("table_border").focus()
	}

	if (error != 1) {
        	myTable.cellPadding = getE("table_padding").value
        	myTable.cellSpacing = getE("table_spacing").value
        	myTable.border = getE("table_border").value
			myTable.width = getE("table_width").value
			myTable.height = getE("table_height").value

        	if (getE("table_bgcolor").value != "") {
        		myTable.bgColor = getE("table_bgcolor").value
        	} else {
        		myTable.removeAttribute('bgColor',0)
        	}

			styles = getE("sStyles")[getE("sStyles").selectedIndex].text

			if (styles != "") {
				myTable.className = styles
			} else {
				myTable.removeAttribute('className',0)
			}
        
			if (getE("table_align")[getE("table_align").selectedIndex].text != "None") {
       			myTable.align = getE("table_align")[getE("table_align").selectedIndex].text
			} else {
       			myTable.removeAttribute('align',0)
			}
			window.opener.buffer[ae.mode].saveHistory();
        	window.close()
	}
}

function printAlign() {
	if ((tableAlign != undefined) && (tableAlign != "")) {
		document.write('<option selected>' + tableAlign)
		document.write('<option>')
	} else {
		document.write('<option selected>')
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()					
	}
};

</script>
<title>[sTxtModifyTable]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<script language=javascript src="colorcommand.js"></script>
<body class="dialogWindow">
<form name=tableForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyTableInst">[sTxtModifyTableInst]</span>
</div>
<br>
	 	  
<div id="_mt" style="width:100%">
<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
  <tr>
  <td><table border="0" cellspacing="0" cellpadding="5" width:"50%">
  <tr>
		<td class="body" width="90" id="TxtBgColor">[sTxtBgColor]:</td>
		<td class="body"><table border="0" cellspacing="0" cellpadding="0"><tr><td>
		  <input type="text" id="table_bgcolor" size="2" class="text70" maxlength="7" value=""></td><td><img onClick="showColorMenu(event,this,-80,'table_bgcolor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" class=toolbutton>
		  </td></tr></table></td>
	</tr>
	  <tr>
		<td class="body" width="80" id="TxtBorder">[sTxtBorder]:</td>
		<td class="body">
		  <input type="text" id="table_border" size="2" class="text70" value="1" maxlength="2">
	  </td>
	</tr>
	  <tr>
		<td class="body" width="80" id="TxtWidth">[sTxtWidth]:</td>
		<td class="body">
		  <input type="text" id="table_width" size="3" class="text70" value="" maxlength="4">
		</td>
	</tr>
	  <tr>
		  <td class="body" id="TxtAlignment">[sTxtAlignment]:</td>
		  <td class="body">
			<select id="table_align" class="text70">
				<script>printAlign()</script>
				<option value="Left">Left</option>
				<option value="Center">Center</option>
				<option value="Right">Right</option>
			</select>
		  </td>
	</tr>		
</table></td><td align=right><table border="0" cellspacing="0" cellpadding="5" width:"50%">
	<tr>
		<td class="body" width="80" id="TxtPadding">[sTxtPadding]:</td>
		<td class="body">
		  <input type="text" id="table_padding" size="2" class="text70" maxlength="2">
	  </td>
	 </tr>
	 <tr>
		<td class="body" width="80" id="TxtSpacing">[sTxtSpacing]:</td>
		<td class="body">
		  <input type="text" id="table_spacing" size="2" class="text70" value="2" maxlength="2">
	  </td>
	  </tr>
	<tr>
		<td class="body" width="80" id="TxtHeight">[sTxtHeight]:</td>
		<td class="body">
		  <input type="text" id="table_height" size="3" class="text70" value="" maxlength="4">
		</td>
	  </tr>
	  <tr>
		  <td class="body" id="TxtStyle">[sTxtStyle]:</td>
		  <td class="body">
				<script>printStyleList()</script>
		  </td>
		</tr>
	</table></td></tr></table></div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" id="TxtOK" name="modifyTable" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
<input type="button" id="TxtCancel" name="Submit" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>
</form>
<script>
	document.write( '<div id="colormenu" style="position:absolute;left:-500;top:-500;visibility:hidden">')
	if (document.all){
		document.write( '<iframe id="color_frame" width=156 height=156 src="colormenu.php" frameborder="no" scrolling="no"></iframe>')
	} else {
		document.write( '<iframe id="color_frame" width=172 height=146 src="colormenu.php" frameborder="no" scrolling="no"></iframe>')
	}	
	document.write( '</div>')
</script>
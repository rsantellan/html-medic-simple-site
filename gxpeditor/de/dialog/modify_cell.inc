<script language=javascript>
d = document;
ae = window.opener.activeEditor;
aed = ae._frame;	

var selectedTD = ae.parentNode("TD");
var selectedTable = ae.parentNode("TABLE");
var cellBgColor = selectedTD.bgColor;
var cellWidth = selectedTD.width;
var cellHeight = selectedTD.height;
var cellAlign = selectedTD.align;
var cellvAlign = selectedTD.vAlign;
var tablePadding = selectedTable.cellPadding;

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

function doMoreColors() {
	colorWin = window.open(window.opener.popupColorWin,'','width=420,height=370,scrollbars=no,resizable=no,titlebar=0,top=' + (screen.availHeight-400) / 2 + ',left=' + (screen.availWidth-420) / 2)
}

// End functions

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

	getE("table_bgcolor").value = cellBgColor;
	getE("cell_width").value = cellWidth;
	getE("cell_height").value = cellHeight;	
	setSelectedClass(selectedTD);
	this.focus();
	getE("table_bgcolor").focus();
}

function doModify() {

	var error = 0;
	if (getE("cell_width").value < 0) {
		alert("[sTxtCellWidthErr]")
		error = 1
		getE("cell_width").select()
		getE("cell_width").focus()
	}


	if (getE("cell_height").value < 0) {
		alert("[sTxtCellHeightErr]")
		error = 1
		getE("cell_height").select()
		getE("cell_height").focus()
	}

	if (error != 1) {
        	selectedTD.width = getE("cell_width").value;
        	selectedTD.height = getE("cell_height").value;

			if (getE("table_bgcolor").value != "") {
        		selectedTD.bgColor = getE("table_bgcolor").value;
        	} else {
        		selectedTD.removeAttribute('bgColor');
        	}

			styles = getE("sStyles")[getE("sStyles").selectedIndex].text

			if (styles != "") {
				selectedTD.className = styles;
			} else {
				selectedTD.removeAttribute('className');
			}

			if (getE("align")[getE("align").selectedIndex].text != "None") {
        		selectedTD.align = getE("align")[getE("align").selectedIndex].text;
        	} else {
        		selectedTD.removeAttribute('align');
        	}

			if (getE("valign")[getE("valign").selectedIndex].text != "None") {
        		selectedTD.vAlign = getE("valign")[getE("valign").selectedIndex].text;
        	} else {
        		selectedTD.removeAttribute('valign');
        	}
			window.opener.buffer[ae.mode].saveHistory();			
        	window.close();
	}
}

function printAlign() {
	if ((cellAlign!=null) && (cellAlign != undefined) && (cellAlign != "")) {
		document.write('<option selected>' + cellAlign)
		document.write('<option>None')
	} else {
		document.write('<option selected>None')
	}
}

function printvAlign() {
	if ((cellvAlign!=null) && (cellvAlign != undefined) && (cellvAlign != "")) {
		document.write('<option selected>' + cellvAlign)
		document.write('<option>None')
	} else {
		document.write('<option selected>None')
	}
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		doModify()
	}
};

</script>
<title>[sTxtModifyCell]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<script language=javascript src="colorcommand.js"></script>
<body class="dialogWindow">
<form name=tableForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtModifyCellInst">[sTxtModifyCellInst]</span>
</div>
<br>
	 	  
<div id="_mt" style="width:100%">
<table border="0" cellspacing="0" cellpadding="0" width:"50%">
  <tr>
  <td align="top"><table border="0" cellspacing="0" cellpadding="5" style="width:50%">
  <tr>
	<td class="body" width="90" id="TxtBgColor">[sTxtBgColor]:</td>
		<td class="body"><table border="0" cellspacing="0" cellpadding="0"><tr><td>
		  <input type="text" id="table_bgcolor" size="2" class="text70" maxlength="7" value=""></td><td><img onClick="showColorMenu(event,this,-80,'table_bgcolor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" class=toolbutton>
		  </td></tr></table></td>
	</tr>
  <tr> 
	<td class="body" width="80" id="TxtHorizontalAlign">[sTxtHorizontalAlign]:</td>
	<td class="body"> 
	  <SELECT class=text70 id=align>
		<script>printAlign()</script>
		<option>Left 
		<option>Center 
		<option>Right</option>
	  </select>
	</td>
	</tr>
  <tr> 
	<td class="body" width="80" id="TxtVerticalAlign">[sTxtVerticalAlign]:</td>
	<td class="body"> 
	  <select class=text70 id=valign>
		<script>printvAlign()</script>
		<option>Top 
		<option>Middle 
		<option>Bottom</option>
	  </select>
	</td>
	</tr>
  </table></td><td valign=top align=right><table border="0" cellspacing="0" cellpadding="5" width:"50%">
  	<tr>
	<td class="body" width="80" id="TxtCellWidth">[sTxtCellWidth]:</td>
	<td class="body"> 
	  <input type="text" id="cell_width" size="3" class="Text70" maxlength="3">
	</td>
  </tr>
  <tr>
	<td class="body" width="80" id="TxtCellHeight">[sTxtCellHeight]:</td>
	<td class="body"> 
	  <input type="text" id="cell_height" size="3" class="Text70" maxlength="3">
	</td>
  </tr>
  <tr>
	<td class="body" id="TxtStyle">[sTxtStyle]:</td>
	<td class="body"><script>printStyleList()</script>
	</td>
  </tr>
</table></td></tr></table>
</div>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" id="TxtOK" name="modifyCell" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
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

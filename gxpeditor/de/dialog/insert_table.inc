<script language=JavaScript>
d 	= document;
ae 	= window.opener.activeEditor;
aed = ae._frame;

window.onload = function(){
	this.focus();
	getE("rows").focus();
	c = new ColorCommand("dialog/colormenu.php");
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
 return "0123456789ABCDEF".charAt((N-N%16)/16)+ "0123456789ABCDEF".charAt(N%16);
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

document.onclick = function(){
	getE("colormenu").style.visibility="hidden"
}

function setValues() {
	imageForm.image_width.value = imageWidth;
	imageForm.image_height.value = imageHeight;

	if (imageBorder == "") {
		imageBorder = "0"
	}

	imageForm.border.value = imageBorder;
	imageForm.alt_tag.value = imageAltTag;
	imageForm.hspace.value = imageHspace;
	imageForm.vspace.value = imageVspace;
	// tableForm.cell_width.value = cellWidth;
	this.focus();
}

function doMoreColors() {
	colorWin = window.open(window.opener.popupColorWin,'','width=420,height=370,scrollbars=no,resizable=no,titlebar=0,top=' + (screen.availHeight-400) / 2 + ',left=' + (screen.availWidth-420) / 2)
}
// End functions

function printStyleList() {
	ae.doStyles();

	d.write(' <select id="sStyles" class="text70"><option selected></option>')
	for (i=0;i<ae.Styles.length;i++){
		d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
	}
	d.write('</select>')
}


function InsertTable() {
	error = 0

	//window.activeEditor._frame.focus();
	border = getE("border").value
	columns = getE("columns").value
	padding = getE("padding").value
	rows = getE("rows").value
	spacing = getE("spacing").value
	width = getE("width").value
	height = getE("height").value
	bgcolor = getE("bgcolor").value
	align = getE("align")[getE("align").selectedIndex].text
	styles = getE("sStyles")[getE("sStyles").selectedIndex].text

			if (isNaN(rows) || rows < 0 || rows == "") {
			 	alert("[sTxtTableRowErr]")
				getE("rows").select()
				getE("rows").focus()
				error = 1
			} else if (isNaN(columns) || columns < 0 || columns == "") {
			 	alert("[sTxtTableColErr]")
				getE("columns").select()
				getE("columns").focus()
				error = 1
			} else if (width < 0 || width == "") {
			 	alert("[sTxtTableWidthErr]")
				getE("width").select()
				getE("width").focus()
				error = 1
			} else if (isNaN(padding) || padding < 0 || padding == "") {
			 	alert("[sTxtTablePaddingErr]")
				getE("padding").select()
				getE("padding").focus()
				error = 1
			} else if (isNaN(spacing) || spacing < 0 || spacing == "") {
			 	alert("[sTxtTableSpacingErr]")
				getE("spacing").select()
				getE("spacing").focus()
				error = 1
			} else if (isNaN(border) || border < 0 || border == "") {
			 	alert("[sTxtTableBorderErr]")
				getE("border").select()
				getE("border").focus()
				error = 1
			}
			

        		if (error != 1) {
				if (bgcolor != "None") {
					bgcolor = " bgcolor =" + bgcolor
				} else {
					bgcolor = ""
				}
				
					if (height != "") {
						height = " height=" + height
					} else {
						height = ""
					}

					if (align != "") {
						align = " align=" + align
					} else {
						align = ""
					}

					if (styles != "") {
						styles = " class=" + styles
					} else {
						styles = ""
					}

        			HTMLTable = "<Table width=" + width + height + align + styles + " border=" + border + " cellpadding=" + padding + " cellspacing=" + spacing + bgcolor + ">"
        
        			for (i=0; i<rows; i++) {
        				HTMLTable = HTMLTable + "<tr>"
        				for (j=0; j<columns; j++) {
        					HTMLTable = HTMLTable + "<td>&nbsp;</td>"
        				}
        			
        				HTMLTable = HTMLTable + "</tr>"
        			}
        			
       			HTMLTable = HTMLTable + "</table>"
				window.opener.activeEditor._inserthtml(HTMLTable);
        			
			}
	
	if (error != 1)self.close();
}

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertTable()
	}
};

function getE(id){
	return d.getElementById(id)
}

</script>
<title>[sTxtInsertTable]</title>
<script type="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<script language=javascript src="colorcommand.js"></script>
<body class="dialogWindow">
<form name=tableForm>
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtInsertTableInst">[sTxtInsertTableInst]</span>
</div>
<br>
<table border="0" cellspacing="0" cellpadding="0" width="92%">
<tr>
	<td width="50%"><table border="0" cellspacing="0" cellpadding="5">
	<tr>
		  <td class="body" id="TxtRows">[sTxtRows]:</td>
		  <td class="body"><input type="text" id="rows" size="2" class="text70" value="1" maxlength="2"></td>
	</tr>
	<tr>
		  <td class="body" id="TxtCols">[sTxtCols]:</td>
		  <td class="body">
			<input type="text" id="columns" size="2" class="text70" value="1" maxlength="2">
		  </td>
	</tr>
	<tr>
		  <td class="body" id="TxtWidth">[sTxtWidth]:</td>
		  <td class="body">
			<input type="text" id="width" size="2" class="text70" maxlength="4" value="100%">
		  </td>
	</tr>
	<tr>
		  <td class="body" id="TxtBgColor">[sTxtBgColor]:</td>
		  <td class="body"><table border="0" cellspacing="0" cellpadding="0"><tr><td><input type="text" id="bgcolor" size="2" class="text70" maxlength="7" value=""></td><td><img onClick="showColorMenu(event,this,-80,'bgcolor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" class=toolbutton>
		  </td></tr></table></td>
	</tr>	
	<tr>
		  <td class="body" id="TxtAlignment">[sTxtAlignment]:</td>
		  <td class="body">
			<select id="align" class="text70">
				<option value=""></option>
				<option value="Left">Left</option>
				<option value="Center">Center</option>
				<option value="Right">Right</option>
			</select>
		  </td>
	</tr>	
</table></td><td align="right" width="50%"><table border="0" cellspacing="0" cellpadding="5">
	<tr>
		  <td class="body" id="TxtPadding">[sTxtPadding]:</td>
		  <td class="body"><input type="text" id="padding" size="2" class="text70" value="2" maxlength="2"></td>
	</tr>

		  <td class="body" id="TxtSpacing">[sTxtSpacing]:</td>
		  <td class="body"><input type="text" id="spacing" size="2" class="text70" maxlength="2" value="2"></td>
	</tr>
	<tr>
		  <td class="body" id="TxtHeight">[sTxtHeight]:</td>
		  <td class="body"><input type="text" id="height" size="2" class="text70" maxlength="4" value=""></td>
	</tr>
	<tr>
		  <td class="body" id="TxtBorder">[sTxtBorder]:</td>
		  <td class="body"><input type="text" id="border" size="2" class="text70" maxlength="2" value="1"></td>
	</tr>
	<tr>
		  <td class="body" id="TxtStyle">[sTxtStyle]:</td>
		  <td class="body">
				<script>printStyleList()</script>
		  </td>
		</tr></table></td></tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="insertTable" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:InsertTable();">
<input type="button" name="Submit" id="TxtCancel" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
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

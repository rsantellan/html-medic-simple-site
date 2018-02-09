<?php
	require_once(dirname(__FILE__)."/de_lang/language.php");
?>

<HTML>
<HEAD>
<title>Colour Picker</title>
<script type="text/javascript">
	if (document.all){
		document.write('<style>.c{border:solid 1px #808080;width:12px;height:12px;font-size: 3px;}<\/style>')
	} else {
		document.write('<style>.c{border:solid 1px #808080;width:10px;height:10px;font-size: 3px;}<\/style>')
	}
</script>
<script  type="text/javascript" language=javascript>
d = document;

function moreColors(){
	d.write('<tr>');
	d.write('<td colspan="10" style="height:23px; font-family: arial; font-size:11px;" onMouseOver="button_over(this)" onMouseOut="button_out(this)" onClick="doMoreColors()" align=center id="TxtMoreColors" class="coloritem_off"><?php echo sTxtMoreColors; ?><\/td>');
	d.write('<\/tr>')
}
function getE(id){return d.getElementById(id)}

</script>
<script type="text/javascript">
if (!parent.skinPath){
	document.write('<link rel="stylesheet" href="'+parent.opener.activeEditor.skinPath+'styles.css" type="text/css">');
}else{
	document.write('<link rel="stylesheet" href="'+parent.skinPath+'styles.css" type="text/css">');
}
</script>
</HEAD>
<BODY class="colorpopup" style="background-image: none; padding: 0px; margin:0px" leftMargin=0 topMargin=0 marginheight="0" marginwidth="0">
<table id="colormenuwin"  cellpadding="0" cellspacing="0"><tr><td>
<table cellpadding="0" cellspacing="5" style="cursor: pointer;font-family: Verdana; font-size: 6px;"><tr><td>
<table cellpadding="0" cellspacing=0 style="font-size: 3px;">
  <tr>
	<td colspan="10" style="border: solid 1px #d4d0c8;" onMouseOver="button_over(this)" onMouseOut="button_out(this)" onClick="doColor()"><div style="border: solid 1px #808080; padding: 2px; margin: 2px;">
	<table cellspacing=0 cellpadding=0 border=0 width=90% style="font-size:3px">
	<tr><td><div style="background-color:#000000" class="c"></div></td><td align=center style="font-size:11px" id="TxtNone"><?php echo sTxtNone; ?></td></tr>
	</table>
	</div>
	</td>
  </tr>
  <tr><td>&nbsp;</td></tr>
  <tr>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#000000;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#993300;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#333300;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#003300;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#003366;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#000099;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#333399;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#333333;" class="c">&nbsp;</div></td>
  </tr>
  <tr>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#990000;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FF6600;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#999900;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#009900;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#009999;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#0000FF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#666699;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#808080;" class="c">&nbsp;</div></td>
  </tr>
  <tr>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FF0000;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FF9900;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#99CC00;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#339966;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#33CCCC;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#3366FF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#990099;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#999999;" class="c">&nbsp;</div></td>
  </tr><tr>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FF00FF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FFCC00;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FFFF00;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#00FF00;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#00FFFF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#00CCFF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#993366;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#CCCCCC;" class="c">&nbsp;</div></td>
  </tr>
  <tr>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FF99CC;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FFCC99;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FFFF99;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#CCFFCC;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#CCFFFF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#99CCFF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#CC99FF;" class="c">&nbsp;</div></td>
	<td onClick="doColor(this)" onMouseOver="button_over(this)" onMouseOut="button_out(this)" class="coloritem_off"><div style="background-color:#FFFFFF;" class="c">&nbsp;</div></td>
  </tr>
  <tr><td>&nbsp;</td></tr><script>moreColors();</script>
</table></td></tr></table></td></tr></table>
<SCRIPT  type="text/javascript" language="javascript">

	function button_over(eButton){
		if (eButton.className == "coloritem_off") {
			eButton.className = "coloritem_on"
		}
	}

	function button_out(eButton){
		if (eButton.className == "coloritem_on")
			eButton.className = "coloritem_off"
	}

	function getParameter(str,par){
		var idx=str.indexOf(par+"=",1);
		var idx2=str.indexOf("&",idx+1);
		if((idx>=0)&&(idx2==-1))idx2=str.length;
		return str.substring(idx+par.length+1,idx2)
}

function hex(i) {
  if (i < 0)return "00";
  else if (i > 255) return "ff";
  else return "" + hexa[Math.floor(i/16)] + hexa[i%16];
}

hexa = new Array(16);
for(var i = 0; i < 10; i++)hexa[i] = i;
hexa[10]="a";
hexa[11]="b";
hexa[12]="c";
hexa[13]="d";
hexa[14]="e";
hexa[15]="f";

	function doColor(td) {


		if (typeof td =="string"){
			oColor = td;
		} else if (td){
			oColor = td.childNodes[0].style.backgroundColor.toUpperCase();
			if (oColor && oColor.toLowerCase().indexOf("rgb")>=0){
				oColor = oColor.replace(/ /g,"");
				var new_color = oColor.match(/(\d+)/gi);
				oColor = "#" + hex(new_color[0]) + hex(new_color[1]) + hex(new_color[2]);
			}
		} else {
			oColor = '';
		}

		var name=getParameter(document.location.search,"name")
		if (!name||name==""){
			var w = parent;
		} else {
			var aID = name + 'level0';
			if (document.all){
				var w = parent.document.frames[aID];
			} else {
				var w = parent.document.getElementById(aID).contentWindow;
			}
		}
		w.tempcolorbut.SetColor(oColor);
		if(w.activeEditor)w.activeEditor.Redraw();
		if (parent.document.getElementById("colormenu"+name)){
			parent.document.getElementById("colormenu"+name).style.visibility="hidden";
			parent.document.getElementById("colormenu"+name).style.top="-500px";
			parent.document.getElementById("colormenu"+name).style.left="-500px";
		}
		return false;
	}

	function doMoreColors() {
		var x=null;
		if (parent.activeEditor) x = parent.activeEditor;
			else if (parent.opener && parent.opener.activeEditor)x = parent.opener.activeEditor;
			else {
				var name=getParameter(document.location.search,"name")
				var aID = name + 'level0';
				if (document.all){
					var w = parent.document.frames[aID];
				} else {
					var w = parent.document.getElementById(aID).contentWindow;
				}
				x = w.activeEditor;
			}
		if (x!==null){
			x.tempWin = window;
			x.commands.getCommand("MoreColors").execute();
		} else {
			alert('Error 1')
		}
	}
</SCRIPT>

</BODY>

</HTML>
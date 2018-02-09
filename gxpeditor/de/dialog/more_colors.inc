<script type="text/javascript" src="dialog/colors.js"></script>
<script language=javascript>
var myPage = window.opener;

document.onkeydown = function (evt) { 
	evt = (evt)?evt:(window.event)?window.event:""
	if (evt.keyCode == 13) {	// ENTER
		InsertRadio()
	}
};

function doColors() {
	var myColor = document.getElementById("hexBox").value;
	if (window.opener.activeEditor.tempWin)window.opener.activeEditor.tempWin.doColor("#"+myColor);
	window.close();
}

</script>

<style>
.outerSlideContainer	{width: 210; height: 14;  margin-top: 3px; margin-bottom: 0; border: 0px solid #FFFFFF; position:relative; }
.sliderHandle			{width: 9; height: 12; cursor: pointer; border: 0 outset white; overflow: hidden; z-index: 5;}
.lineContainer1			{width: 199; height: 6; z-index: 0; margin-left: 5px;}
.lineContainer2			{width: 66; height: 6; z-index: 0; }
.line1				{width: 199; height: 14; z-index: 0; overflow: hidden; }
.line2				{width: 66; height: 14; z-index: 0; overflow: hidden; }
#colorBox			{width: 20; height: 20; border: 1px solid #000000; margin-left: 2px;}
#colorImage			{width: 164; height: 20; border: 1px solid #000000; cursor: pointer;}
body	{ margin: 10px;}
</style>

<title>[sTxtColors]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<body class="dialogWindow" onload="init()">
<div class="appOutside">
<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span>[sTxtColorsInst]</span>
</div>
<br>
<table border="0" cellspacing="0" cellpadding="0" style="width:93%">
  <tr>
	<td valign=top><div class="appInside1">
	<div class="appInside2" style="width:225px;height:250px" >
		<div class="appInside3" style="padding:11px;">
<div style="background-color:#000000;width:200px;height:200px"><img id=colorImg galleryimg="no" src="images/color.jpg" width=200 border=0 height=200 onClick="doColor(event)"><img id=cursorImg width=11 height=11 src="images/cursor.gif" style="position:absolute;" onmousedown="drags(event)" galleryimg="no"></div>
<div class="outerSlideContainer">
	<div style="width:199px;height:14px" onmousedown="dragSlider(event)" id="gradline" onclick="clickOnGrad(event)"></div>
	<div onmousedown="dragSlider(event)" style="position:absolute;z-index:100" id="vSlider"><img src="images/arrow.gif" width=9 height=12></div>
</div>
</div>
</div>

</td><td width="10px" valign=top>&nbsp;</td>
	<td valign=top >
<div class="appInside1">
	<div class="appInside2" style="height:250px">
		<div class="appInside3" style="padding:11px">
		<table cellspacing=0 cellpadding=5 border=0>
		<tr>
		<td class=body>Red:</td>
		<td><input type=text id=rBox onkeydown="checkInputRGB(this,event)" maxlength=3 onChange="doRGB()" class=Text50></td>
		</tr>
		<tr>
		<td class=body>Green:</td>
		<td><input type=text id=gBox onkeydown="checkInputRGB(this,event)" maxlength=3 onChange="doRGB()" class=Text50></td>
		<tr>
		<td class=body>Blue:</td>
		<td><input type=text id=bBox onkeydown="checkInputRGB(this,event)" maxlength=3 onChange="doRGB()" class=Text50></td>
		</tr>
		<tr>
		<td class=body>HEX:</td>
		<td class=body><input type=text id=hexBox onChange="HexToRGB(this.value)" onkeydown="checkInputHex(this,event)" maxlength=6 class=Text50></td>
		</tr>
		<tr><td colspan=2>
			<div id=myColor><div id=colorBox style="width:100px; height:90px; border: 1px solid #000000"></div></div>
		</td></tr>
		</table>
		</div>
	</div>
</div>

	</td>
  </tr>
</table>

</div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="doColors" value="[sTxtOK]" class="Text75" onClick="javascript:doColors();">
<input type="button" name="Submit" value="[sTxtCancel]" class="Text75" onClick="javascript:window.close()">
</div>

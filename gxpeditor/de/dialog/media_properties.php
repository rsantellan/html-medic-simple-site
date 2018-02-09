<?php
	require_once("../de_lang/language.php");
	
?>
<HTML>
<HEAD>
<TITLE></TITLE>
</HEAD>
<script type="text/javascript">
document.write('<link rel="stylesheet" href="'+parent.openerwin.skinPath2+parent.openerwin.main_css_file+'" type="text/css">');

window.onload = function(){
	if (parent.oSel)setAllProperties(parent.oSel);
}

	var real_src_obj;
	var currObj = null;
	var imgSrc = null;		
		
	sel1 = parent.oSel;		
	if (sel1 && sel1.getAttribute("name2")) {
		real_src_obj = unescape(sel1.getAttribute("name2"));
	}
	
	function getMediaProp(name){
		if (real_src_obj){
			var r = new RegExp("("+name+"=)(\\S+)","gi");
			var r1 = new RegExp(name+"\\s*?=","gi");	
			var a = real_src_obj.match(r);
			if (!a) return "";
			a = a[0].replace(r1,"");
			a = a.replace(/\"/gi,"");			
			return a;
		} else{
			switch (name){
				case "width":
					return "100";
				case "height":
					return "100";
				case "autostart":
					return document.getElementById("autostart").checked;
				default:
					return "";		
			}
		}
	}
	
	function setAllProperties(f) {
		setProp();
	}
	
	function setProp() {

		document.getElementById("image_width").value = parent.sel?parent.sel.width : getMediaProp("width");
		document.getElementById("image_height").value = parent.sel?parent.sel.width : getMediaProp("height");
			
		if (getMediaProp("autostart")=="true") {
			document.getElementById("autostart").checked=true;
		}
		if (getMediaProp("showcontrols")=="true") {
			document.getElementById("showcontrols").checked = true;
		}
		if (getMediaProp("showstatusbar")=="true") {
			document.getElementById("showstatusbar").checked = true;
		}
		
	}

	function clear() {
		document.getElementById("image_width").value = "";
		document.getElementById("image_height").value = "";
		document.getElementById("autostart").checked=false;
		document.getElementById("showcontrols").checked = false;
		document.getElementById("showstatusbar").checked = false;
	}
		
	var src="";

		function refreshState() {
			imageWidth = document.getElementById("image_width").value
			imageHeight = document.getElementById("image_height").value
			var addstr = "";
			if (document.getElementById("autostart").checked){
				addstr+= ' autostart="1" ';
			} else {
				addstr+= ' autostart="0" ';
			}	
			if (document.getElementById("showcontrols").checked){
				addstr+= ' showcontrols="1" ';
			} else {
				addstr+= ' showcontrols="0" ';			
			}	
			if (document.getElementById("showstatusbar").checked){
				addstr+= ' showstatusbar="1" ';
			}  else {
				addstr+= ' showstatusbar="0" ';			
			}	
			
			src = parent.currentImage.src;
			HTMLTextField = '<embed width="'+imageWidth+'" height="'+imageHeight +'" '+ addstr + ' pluginspage="http://www.microsoft.com/Windows/MediaPlayer" type="application/x-mplayer2" src=' + src.replace(/ /g, "%20") + ' name="MediaPlayer1" />';
			parent.refreshPreview(HTMLTextField);
		}

		
	function createObj(imgSrc) {

		var error = 0;

		if (!imgSrc)imgSrc = getMediaProp("src");

		imageWidth = document.getElementById("image_width").value
		imageHeight = document.getElementById("image_height").value

		if (isNaN(imageWidth) || imageWidth < 0) {
			alert("<?php echo sTxtImageWidthErr; ?>")
			error = 1
			document.getElementById("image_width").select()
			document.getElementById("image_width").focus()
		} else if (isNaN(imageHeight) || imageHeight < 0) {
			alert("<?php echo sTxtImageHeightErr; ?>")
			error = 1
			document.getElementById("image_height").select()
			document.getElementById("image_height").focus()
		}

	if (error == 1) return false;
			
	var addstr = "";

	if (getMediaProp("autostart")==true)
		addstr+= ' autostart="true" ';
	else
		addstr+= ' autostart="false" ';

	if (document.getElementById("showcontrols").checked) {
		addstr+= ' showcontrols="true" ';
	}
	if (document.getElementById("showstatusbar").checked) {
		addstr+= ' showstatusbar="true" ';
	}

	HTMLEmbedField = '<embed width="'+imageWidth+'" height="'+imageHeight +'" '+ addstr + ' pluginspage="http://www.microsoft.com/Windows/MediaPlayer" type="application/x-mplayer2" src="' + imgSrc.replace(/ /g, "%20") + '" name="MediaPlayer1" />';
	HTMLTextField = '<img alt="'+imgSrc+'" width="' + imageWidth + '" height="' + imageHeight + '" name2="'+escape(HTMLEmbedField)+'" class="de_media_file">';
	parent.opener.activeEditor._inserthtml(HTMLTextField)
		
	return true;

}
		
</script>
<BODY leftMargin=0 topMargin=0 marginheight="0" marginwidth="0">
<table style="font-family: Arial; font-size: 11px" border="0" cellspacing="0" cellpadding="3">
<tr>
<td class="body"><?php echo sTxtMediaWidth; ?>:</td>
<td class="body">
<input type="text" id="image_width" size="3" class="Text50" maxlength="5">
</td>
<td class="body"><?php echo sTxtMediaHeight; ?>:</td>
<td class="body">
<input type="text" id="image_height" size="3" class="Text50" maxlength="5">
</td>
</tr>
<tr>
<td class="body"><?php echo sTxtAutoStart; ?>:</td>
<td class="body"><input onClick="refreshState()" type=checkbox id=autostart></td><td></td><td></td>
</tr>	
<tr>
<td class="body"><?php echo sTxtShowControls; ?>:</td>
<td class="body"><input onClick="refreshState()" type=checkbox id=showcontrols></td><td></td><td></td>
</tr>	
<tr>
<td class="body"><?php echo sTxtShowStatusBar; ?>:</td>
<td class="body"><input onClick="refreshState()" type=checkbox id=showstatusbar></td><td></td><td></td>
</tr>	
<tr><td colspan=4>
<a href="javascript:setProp()" style="color:gray">[Reset Properties]</a>
</td></tr>
</table>
</BODY>
</HTML>

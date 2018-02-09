<?php require_once("../de_lang/language.php"); ?>
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
	sel1 = parent.oSel;
	
	if (sel1 && sel1.getAttribute("name2")) {
		real_src_obj = unescape(sel1.getAttribute("name2"));
	}
	
	function getFlashProp(name){
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
				default:
					return "";		
			}
		}
	}
	
	function setAllProperties(sel) {
		setProp(sel);
	}
	
	function setProp(sel) {

		if(!sel)
			sel = currObj;

		if(sel == null)
		{
			alert("Please choose a flash movie first.");
		}
		else
		{		
			document.getElementById("image_width").value = sel?sel.width : getFlashProp("width");
			document.getElementById("image_height").value = sel?sel.width : getFlashProp("height");
			document.getElementById("hspace").value = getFlashProp("hspace");
			document.getElementById("vspace").value = getFlashProp("vspace");
				
			var l = document.getElementById("loop")
			l.selectedIndex = 0;
			for (var i=0;i<l.length;i++){
				if(getFlashProp("loop").toLowerCase()==l.options[i].value.toLowerCase())l.selectedIndex = i;
			}
			var l = document.getElementById("align1")
			l.selectedIndex = 0;
			var a = getFlashProp("align");
			if (a!="")
			for (var i=0;i<l.length;i++){
				if(a.toLowerCase()==l.options[i].value.toLowerCase())l.selectedIndex = i;
			}
			currObj = sel;
		}
	}

	function clear() {
		document.getElementById("image_width").value = "";
		document.getElementById("image_height").value = "";
		document.getElementById("hspace").value = "";
		document.getElementById("vspace").value = "";
		document.getElementById("loop").selectedIndex = 0;
		document.getElementById("align1").selectedIndex = 0;
	}
	
	function printLoop() {
		if (real_src_obj != undefined) {
			document.write('<option value="' + getFlashProp("loop") + '" selected>' + getFlashProp("loop") + '</option>')
			document.write('<option value=""></option>')
		}
	}
	
	function printAlign() {
		if ((real_src_obj != undefined) && (getFlashProp("align") != "")) {
			document.write('<option selected>' + getFlashProp("align"))
			document.write('<option>')
		} else {
			document.write('<option selected>')
		}
	}

	function createObj(imgSrc) {

		var error = 0;
		if (!imgSrc)imgSrc = getFlashProp("src");
		if (!imgSrc){
			alert("Please select flash file")
			return;
		}	

		imageWidth = document.getElementById("image_width").value
		imageHeight = document.getElementById("image_height").value
		imageHspace = document.getElementById("hspace").value
		imageVspace = document.getElementById("vspace").value

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
		} else if (isNaN(imageHspace) || imageHspace < 0) {
			alert("<?php echo sTxtHorizontalSpacingErr; ?>")
			error = 1
			document.getElementById("hspace").select()
			document.getElementById("hspace").focus()
		} else if (isNaN(imageVspace) || imageVspace < 0) {
			alert("<?php echo sTxtVerticalSpacingErr; ?>")
			error = 1
			document.getElementById("vspace").select()
			document.getElementById("vspace").focus()
		}

		if (error == 1) return false;
			var addstr="";
			addstr+=" loop="+document.getElementById("loop")[document.getElementById("loop").selectedIndex].value;
				
			if (document.getElementById("hspace").value != "") {
				addstr+=" hspace=" + document.getElementById("hspace").value;
			}

			if (document.getElementById("vspace").value != "") {
				addstr+= " vspace="+document.getElementById("vspace").value;
			}

			if (document.getElementById("align1")[document.getElementById("align1").selectedIndex].text != "None" && document.getElementById("align1")[document.getElementById("align1").selectedIndex].text != "") {
				addstr+= " align="+ document.getElementById("align1")[document.getElementById("align1").selectedIndex].text;
			}
				
			HTMLEmbedField = '<embed '+addstr+' width=' + imageWidth + ' height=' + imageHeight + ' src="' + imgSrc + '" type="application/x-shockwave-flash">';
			HTMLTextField = '<img alt="' + imgSrc + '" width=' + imageWidth + ' height=' + imageHeight + ' name2="'+escape(HTMLEmbedField)+'" class="de_flash_file">';
					
			parent.opener.activeEditor._inserthtml(HTMLTextField)
			return true;
		}
		
</script>
<BODY leftMargin=0 topMargin=0 marginheight="0" marginwidth="0">
		<table style="font-family: Arial; font-size: 11px" border="0" cellspacing="0" cellpadding="3">
		  <tr>
			<td class="body" width="70"><?php echo sTxtLoop; ?>:</td>
			<td class="body" width="88">
				<select class="Text70" id=loop>
					<script>printLoop()</script>
					<option value="true">True</option>
					<option value="false">False</option>
				</select>
			</td>
			<td class="body"><?php echo sTxtAlignment; ?>:</td>
				<td class="body">
				  <SELECT class=text70 id="align1">
					<script>printAlign()</script>
					<option>Baseline
					<option>Top
					<option>Middle
					<option>Bottom
					<option>TextTop
					<option>ABSMiddle
					<option>ABSBottom
					<option>Left
					<option>Right</option>
				  </select>
				</td>
		  </tr>
		  <tr>
			<td class="body"><?php echo sTxtFlashWidth; ?>:</td>
			<td class="body">
			  <input type="text" id="image_width" size="3" class="Text70" maxlength="3">
		  </td>
			<td class="body"><?php echo sTxtFlashHeight; ?>:</td>
			<td class="body">
			  <input type="text" id="image_height" size="3" class="Text70" maxlength="3">
			</td>
		  </tr>
		  <tr>
			<td class="body"><?php echo sTxtHorizontalSpacing; ?>:</td>
			<td class="body">
			  <input type="text" id="hspace" size="3" class="Text70" maxlength="3">
			</td>
			<td class="body"><?php echo sTxtVerticalSpacing; ?>:</td>
			<td class="body">
			  <input type="text" id="vspace" size="3" class="Text70" maxlength="3">
			</td>
		  </tr>
			<tr><td colspan=2>
				<a href="javascript:setProp()" style="color:gray">[Reset Properties]</a>
			</td></tr>
		</table>
	
	</BODY>
</HTML>

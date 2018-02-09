<?php
	require_once("../de_lang/language.php");

?>
<HTML>
<HEAD>
<TITLE></TITLE>
</HEAD>
<script type="text/javascript">
	document.write('<link rel="stylesheet" href="'+parent.openerwin.skinPath2+parent.openerwin.main_css_file+'" type="text/css">');

	window.onload = function()
	{
		if (parent.oSel) {
			setAllProperties(parent.oSel);
		}
	}
	var currObj = null;

	function  setSelectedClass(oSel)
	{
		if (!oSel) {
			return;
		}
		var s = d.getElementById("sStyles");
		for (var i=0;i<s.options.length;i++){
			if (!document.all) {
				var attr=oSel.getAttribute("class");
			} else {
				var attr=oSel.getAttribute("className");
			}
			if (attr&&attr.toLowerCase()==s.options[i].value.toLowerCase()) {
				s.options[i].selected = true;
			}
		}
	}

	function clear()
	{
		document.getElementById("image_width").value = "";
		document.getElementById("image_height").value = "";
		document.getElementById("border").value = "";
		document.getElementById("alt_tag").value = "";
		document.getElementById("image_title").value = "";
		document.getElementById("hspace").value = "";
		document.getElementById("vspace").value = "";
		document.getElementById("sStyles").options[i].selected = 0;
	}

	function setAllProperties(oImage)
	{
		document.getElementById("image_width").value = oImage.width;
		document.getElementById("image_height").value = oImage.height;
		document.getElementById("border").value = oImage.border;
		document.getElementById("alt_tag").value = oImage.alt;
		document.getElementById("image_title").value = oImage.title;
		document.getElementById("hspace").value = (oImage.hspace>0)?oImage.hspace:0;
		document.getElementById("vspace").value = (oImage.vspace>0)?oImage.vspace:0;
		setSelectedClass(oImage);
		currObj = oImage;
	}

	function setProp(oImage)
	{
		if (!oImage) {
			oImage = currObj;
		}

		if (oImage == null) {
			alert("Please select an image first.");
		} else {
			document.getElementById("image_width").value = oImage.width;
			document.getElementById("image_height").value = oImage.height;
			document.getElementById("border").value = 0;
			document.getElementById("alt_tag").value = "";
			document.getElementById("image_title").value = "";
			document.getElementById("hspace").value = "";
			document.getElementById("vspace").value = "";
			document.getElementById("align").selectedIndex = 0;
			document.getElementById("sStyles").selectedIndex = 0;
		}

		currObj = oImage;
	}

	function printAlign()
	{
		if (!parent.oSel) {
			return;
		}
		imageAlign = parent.oSel.align;
		if ((imageAlign != undefined) && (imageAlign != "")) {
			document.write('<option selected>' + imageAlign);
			document.write('<option>');
		} else {
			document.write('<option selected>');
		}
	}

	function printStyleList()
	{
		ae = parent.opener.activeEditor;
		ae.doStyles();
		d = document;
		d.write(' <select id="sStyles" class = "text70"><option selected></option>');
		for (i=0;i<ae.Styles.length;i++) {
			d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>');
		}
		d.write('</select>');
	}

	function createObj(imgSrc)
	{
		var error = 0;

		imageWidth = document.getElementById("image_width").value;
		imageHeight = document.getElementById("image_height").value;
		imageBorder = document.getElementById("border").value;
		imageHspace = document.getElementById("hspace").value;
		imageVspace = document.getElementById("vspace").value;

		if (isNaN(imageWidth) || imageWidth < 0) {
			alert("<?php echo sTxtImageWidthErr; ?>");
			error = 1;
			document.getElementById("image_width").select();
			document.getElementById("image_width").focus();
		} else if (isNaN(imageHeight) || imageHeight < 0) {
			alert("<?php echo sTxtImageHeightErr; ?>");
			error = 1;
			document.getElementById("image_height").select();
			document.getElementById("image_height").focus();
		} else if (isNaN(imageBorder) || imageBorder < 0 ) {
			alert("<?php echo sTxtImageBorderErr; ?>");
			error = 1;
			document.getElementById("border").select();
			document.getElementById("border").focus();
		} else if (isNaN(imageHspace) || imageHspace < 0) {
			alert("<?php echo sTxtHorizontalSpacingErr; ?>");
			error = 1;
			document.getElementById("hspace").select();
			document.getElementById("hspace").focus();
		} else if (isNaN(imageVspace) || imageVspace < 0) {
			alert("<?php echo sTxtVerticalSpacingErr; ?>");
			error = 1;
			document.getElementById("vspace").select();
			document.getElementById("vspace").focus();
		}

		if (error == 1) {
			return false;
		}
		sel = parent.oSel;

		if (parent.window.opener.setRealSrc(imgSrc)){
			sel.setAttribute("realsrc",imgSrc);
			imgSrc = parent.window.opener.setRealSrc(imgSrc);
		} else {
			if (sel) {
				sel.removeAttribute("realsrc");
			}
		}

		if (sel && sel.tagName && sel.tagName=="IMG") {
			oImage = sel;
			oImage.src = imgSrc;
		} else {
			HTMLTextField = '<img id="de_element_image" src="' + imgSrc + '" />';
			parent.opener.activeEditor._inserthtml(HTMLTextField);
			oImage = parent.opener.activeEditor._frame.getElementById("de_element_image");
		}

		if (imageWidth != "") {
			oImage.width = imageWidth;
		}

		if (imageHeight != "") {
			oImage.height = imageHeight;
		}

		oImage.alt = document.getElementById("alt_tag").value;
		if (document.getElementById("border").value) {
			oImage.border = document.getElementById("border").value;
		}
		oImage.title = document.getElementById("image_title").value;

		if (document.getElementById("hspace").value != "") {
			oImage.hspace = document.getElementById("hspace").value;
		}

		if (document.getElementById("vspace").value != "") {
			oImage.vspace = document.getElementById("vspace").value;
		} else {
			oImage.removeAttribute('vspace',0);
		}

		if (document.getElementById("align")[document.getElementById("align").selectedIndex].text != "None") {
			oImage.align = document.getElementById("align")[document.getElementById("align").selectedIndex].text;
		} else {
			oImage.removeAttribute('align',0);
		}

		styles = document.getElementById("sStyles")[document.getElementById("sStyles").selectedIndex].text;

		if (styles != "") {
			oImage.className = styles;
		} else {
			oImage.removeAttribute('className',0);
		}

		if (sel) {
			// do nothing
		} else {
			oImage.removeAttribute("id");
		}

		if (imgSrc.indexOf("http://") == -1) {
			oImage.src = imgSrc;
		}

		return true;

	} // End function

</script>
<body leftmargin=0 topmargin=0 marginheight="0" marginwidth="0">
	<table style="font-family: Arial; font-size: 11px" border="0" cellspacing="0" cellpadding="3">
	<tr>
		<td class="body" width="70">Alt text:</td>
		<td class="body" width="88">
			<input type="text" id="alt_tag" size="50" class="Text70">
		</td>
		<td class="body" width="80"><?php echo sTxtBorder; ?>:</td>
		<td class="body" width="80">
		<input type="text" id="border" size="3" class="Text70" maxlength="3" value="0">
		</td>
	</tr>
	<tr>
		<td class="body">Width:</td>
		<td class="body">
			<input type="text" id="image_width" size="4" class="Text70" maxlength="5">
		</td>
		<td class="body">Height:</td>
		<td class="body">
			<input type="text" id="image_height" size="4" class="Text70" maxlength="5">
		</td>
	</tr>
	<tr>
		<td class="body">Horiz Space:</td>
		<td class="body">
			<input type="text" id="hspace" size="3" class="Text70" maxlength="3">
		</td>
		<td class="body">Vert Space:</td>
		<td class="body">
			<input type="text" id="vspace" size="3" class="Text70" maxlength="3">
		</td>
	</tr>
	<tr>
		<td class="body"><?php echo sTxtAlignment; ?>:</td>
		<td class="body">
			<SELECT class="text70" id="align">
				<script type="text/javascript">printAlign();</script>
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
		<td class="body"><?php echo sTxtStyle; ?>:</td>
		<td class="body"><script type="text/javascript">printStyleList();</script></td>
	</tr>
	<tr>
		<td class="body"><?php echo sTxtTitle; ?>:</td>
		<td class="body"><input type="text" id="image_title" class="Text70"></td>
		<td colspan="2"><a href="javascript:setProp()" style="color:gray">[Reset Properties]</a></td>
	</tr>
	</table>
</body>
</html>
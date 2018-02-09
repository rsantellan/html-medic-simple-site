<script language=javascript>

alert_title = "[sTxtDisableField]";
d = document;
var all = true;
ae = window.opener.activeEditor;
aed = window.opener.activeEditor._frame;

function getE(id){
	return d.getElementById(id)
}

var pageTitle="";
if(opener.browser.IE){
	pageTitle = aed.title;
} else {
	var oHead = aed.getElementsByTagName('HEAD');
	pT = oHead[0].innerHTML.match(/(?:<title>)([\s\S]*)(?:<\/title>)/gi);
	if(pT)pageTitle = pT[0].replace(/<[^>]+>/gi,"");
}

var pageBgColor = aed.body.bgColor;
var pageLinkColor = aed.body.link;
var pageTextColor = aed.body.text;
var backgroundImage = aed.body.background;
var metaKeywords = ""
var metaDescription = ""
var oDescription
var oKeywords = null;

//if(opener.browser.IE){
var metaData = aed.getElementsByTagName('META');
for (var m = 0; m < metaData.length; m++) {
	if (metaData[m].name.toUpperCase() == "KEYWORDS") {
      metaKeywords = metaData[m].content
	  oKeywords = metaData[m]
	}

	if (metaData[m].name.toUpperCase() == 'DESCRIPTION') {
      metaDescription = metaData[m].content
	  oDescription = metaData[m]
	}
}

// Functions for color popup
var colorType = 0

document.onclick = function(){
	getE("colormenu").style.visibility="hidden"
}

var tempObj = function(id){
	this.id = id;
}

tempObj.prototype.SetColor = function(color){
	if (color=="more"){
		ae.commands.getCommand("MoreColors").execute();
	} else {
	if (color.substr(0,1)!="#"){
		pos1 = color.indexOf(",")
		pos2 = color.lastIndexOf(",")
		color = RGBtoHex(color.substring(4,pos1),color.substring(pos1+1,pos2),color.substring(pos2+1,color.length-1))
	}
	getE(this.id).value = color;
	getE("colormenu").style.visibility="hidden"
	}
}

function RGBtoHex(R,G,B) {return "#"+toHex(R)+toHex(G)+toHex(B)}
function toHex(N) {
 if (N==null) return "00";
 N=parseInt(N);
 if (N==0 || isNaN(N)) return "00";
 N=Math.max(0,N);
 N=Math.min(N,255); N=Math.round(N);
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

function button_over(td) {
	if (td){
	td.style.borderBottom	= "ButtonShadow solid 1px";
	td.style.borderLeft		= "ButtonHighlight solid 1px";
	td.style.borderRight	= "ButtonShadow solid 1px";
	td.style.borderTop		= "ButtonHighlight solid 1px";
	}
}

function button_out(td) {
	if (td) td.style.borderColor = "#efefde";
}

function doMoreColors() {
	colorWin = window.open(window.opener.popupColorWin,'','width=420,height=370,scrollbars=no,resizable=no,titlebar=0,top=' + (screen.availHeight-400) / 2 + ',left=' + (screen.availWidth-420) / 2)
}

// End functions

function setValues() {
	if (ae.isbegin && ae.isend){
		all = false;
	}
	getE("pagetitle").value = pageTitle;
	getE("description").value = metaDescription;
	getE("keywords").value = metaKeywords;
	getE("bgImage").value = backgroundImage;
	getE("bgColor").value = pageBgColor;
	getE("linkcolor").value = pageLinkColor;
	getE("textcolor").value = pageTextColor;
	if (!all){
		if (aed.documentElement.innerHTML.toLowerCase().indexOf("<title>")==-1){
			getE("pagetitle").disabled = true;
			getE("pagetitle").title = alert_title;
		};
		m = aed.getElementsByTagName("meta");
		getE("description").disabled = true;
		getE("keywords").disabled = true;

		for (var i=0;i<m.length;i++){
			if (m[i].name == "description"){
				getE("description").disabled = false;
			}
			if (m[i].name == "keywords"){
				getE("keywords").disabled = false;
			}
		}

		if (getE("description").disabled == true){
			getE("description").title = alert_title;
		}
		if (getE("keywords").disabled == true){
			getE("keywords").title = alert_title;
		}

		getE("bgColor").disabled = true;
		getE("bgColor").title = alert_title;
		getE("bgcolorbut").disabled = true;
		getE("linkcolor").disabled = true;
		getE("linkcolor").title = alert_title;
		getE("linkcolorbut").disabled = true;
		getE("textcolor").disabled = true;
		getE("textcolor").title = alert_title;
		getE("textcolorbut").disabled = true;
		getE("bgImage").disabled = true;
		getE("bgImage").title = alert_title;

	}
	this.focus();
	//getE("pagetitle").focus();
}

function doModify() {
	var bgImage = getE("bgImage").value
	var bgcolor = getE("bgColor").value
	var linkcolor = getE("linkcolor").value
	var textcolor = getE("textcolor").value

	if (all){
		if (bgImage != "") { aed.body.background = bgImage } else { aed.body.removeAttribute("background",0) }
		if (bgcolor != "") { aed.body.bgColor = bgcolor } else { aed.body.removeAttribute("bgColor",0) }
		if (linkcolor != "None") { aed.body.link = linkcolor } else { aed.body.removeAttribute("link",0) }
		if (textcolor != "None") { aed.body.text = textcolor } else { aed.body.removeAttribute("text",0) }
	}

	var oHead = aed.getElementsByTagName('HEAD')


	if (getE("keywords").disabled == false){
		if (oKeywords != null) {
			oKeywords.content = getE("keywords").value
		} else {
			var oMetaKeywords = aed.createElement("META");
			oMetaKeywords.name = "Keywords"
			oMetaKeywords.content = getE("keywords").value
			oHead[0].appendChild(oMetaKeywords)
		}
	}

	if (getE("description").disabled == false){
		if (oDescription != null){
			oDescription.content = getE("description").value;
		} else {
			var oMetaDesc= aed.createElement("META");
			oMetaDesc.name = "Description"
			oMetaDesc.content = getE("description").value
			oHead[0].appendChild(oMetaDesc);
		}
	}

	if (getE("pagetitle").disabled == false){
		if(opener.browser.IE){
			aed.title = getE("pagetitle").value
		} else {
			oHead[0].innerHTML = oHead[0].innerHTML.replace(/(<title>([\s\S]*)<\/title>)/gi,"<title>" + getE("pagetitle").value + "</title>");
		}
	}

	window.close();
	ae.commands.getCommand("Save").execute("no");
	//opener.activeEditor.Focus();
}

function printLinkColor() {
	if ((pageLinkColor != undefined) && (pageLinkColor != "")) {
		document.write('<option selected style="BACKGROUND-COLOR: ' + pageLinkColor + '">' + pageLinkColor)
		document.write('<option>None')
	} else {
		document.write('<option selected>None')
	}
}

function printTextColor() {
	if ((pageTextColor != undefined) && (pageTextColor != "")) {
		document.write('<option selected style="BACKGROUND-COLOR: ' + pageTextColor + '">' + pageTextColor)
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

window.onload = function(){
	setValues();
	c = new ColorCommand("dialog/colormenu.php");
	if (opener.browser.NS)getE("_mt").width="100%"
}


</script>
<head>
<title>[sTxtPageProps]</title>
<script tyle="text/javascript">
document.write('<link rel="stylesheet" href="'+window.opener.activeEditor.skinPath+window.opener.main_css_file+'" type="text/css">');
</script>
<script language=javascript src="colorcommand.js"></script>
</head>
<body class="dialogWindow">
<form name=pageForm>
<div class="appOutside">

<div style="border: solid 1px #000000; background-color: #FFFFEE; padding:5px;">
	<img src="images/bulb.gif" align=left width=16 height=17>
	<span id="TxtPagePropsInst">[sTxtPagePropsInst]</span>
</div>
<br>

<table id="_mt" border="0" cellspacing="0" cellpadding="5" width="92%">
	  <tr>
		<td class="body" width="100" id="TxtPageTitle">[sTxtPageTitle]:</td>
		<td class="body">
		  <input type="text" id="pagetitle" maxlength="100" class=text220>
		</td>
	  </tr>
	  <tr>
		<td class="body" valign="top" id="TxtDescription">[sTxtDescription]:</td>
		<td class="body">
		  <textarea id="description" class="text220" rows="4"></textarea>
		</td>
	  </tr>
	  <tr>
		<td class="body" id="TxtKeywords">[sTxtKeywords]:</td>
		<td class="body">
		  <input type="text" id="keywords" maxlength="300" class=text220>
		</td>
	  </tr>
	  <tr>
		<td class="body" id="TxtBgImage">[sTxtBgImage]:</td>
		<td class="body">
		  <input type="text" id="bgImage" maxlength="300" class=text220>
		  </td>
	  </tr>
		  <tr>
		<td class="body" id="TxtBgColor">[sTxtBgColor]:</td>
		  <td class="body">
		  <input type="text" id="bgColor" size="2" class="text70" maxlength="18" value=""><img id="bgcolorbut" onClick="showColorMenu(event,this,-80,'bgColor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" onmouseover="button_over(this);" onmouseout="button_out(this);" class=toolbutton>
		  </td>
		  </tr>
		  <tr>
			<td class="body" id="TxtTextColor">[sTxtTextColor]:</td>
			<td class="body">
			  <input type="text" id="textcolor" size="2" class="text70" maxlength="18" value=""><img id="textcolorbut" onClick="showColorMenu(event,this,-100,'textcolor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" onmouseover="button_over(this);" onmouseout="button_out(this);" class=toolbutton>
			</td>
		  </tr>
		  <tr>
			<td class="body" id="TxtLinkColor">[sTxtLinkColor]:</td>
			<td class="body">
			  <input type="text" id="linkcolor" size="2" class="text70" maxlength="18" value=""><img id="linkcolorbut" onClick="showColorMenu(event,this,-150,'linkcolor')" src="images/colors.gif" width=21 height=20 hspace=5 style="position: relative; top:5px" onmouseover="button_over(this);" onmouseout="button_out(this);" class=toolbutton>
			</td>
		  </tr>
	    </table></div>
<div style="padding-top: 6px; float: right;">
<input type="button" name="modifyPage" id="TxtOK" value="[sTxtOK]" class="Text75" onClick="javascript:doModify();">
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
</body></html>
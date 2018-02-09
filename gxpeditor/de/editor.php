<?php
	session_start();
	$ie=(is_numeric(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE")))?true:false;
	$safari=(is_numeric(strpos($_SERVER["HTTP_USER_AGENT"],"Safari")))?true:false;
	$windows=(is_numeric(strpos($_SERVER["HTTP_USER_AGENT"],"Windows")))?true:false;
	$gecko=(is_numeric(strpos($_SERVER["HTTP_USER_AGENT"],"Gecko")))?true:false;

	if ($ie){
		if (isset($_SESSION["dt"])){
			echo $_SESSION["dt"]."\n";
		}
	}
?>
<html>
<head>
<title>Editor</title>

<script type="text/javascript" language="javascript" src="config.js"></script>
<?php
	if($_GET["useXHTML"]=="1"){
		if ($ie){
			echo '<script type="text/javascript" language="javascript" src="xhtml.js"></script>';
		} else {
			echo '<script type="text/javascript" language="javascript" src="xhtml_gecko.js"></script>';
		}
	}

	if(isset($_SESSION["userdocroot"])){
		$_SERVER['DOCUMENT_ROOT'] = $_SESSION["userdocroot"];
	}

?>


<script type="text/javascript" language="javascript" src="common.js"></script>
<?php
	if($_GET["mode"]!="simple"){
		echo '<script type="text/javascript" language="javascript" src="advanced.js"></script>';
	}
?>
<?php
	if ($safari) {
		echo '<script type="text/javascript" language="javascript" src="editor_simple.js"></script>';
	} else if ($gecko) {
		echo '<script type="text/javascript" language="javascript" src="editor_gecko.js"></script>';
	} else if ($ie && $windows) {
		echo '<script type="text/javascript" language="javascript" src="editor_ie.js"></script>';
	} else {
		echo '<script type="text/javascript" language="javascript" src="editor_simple.js"></script>';
	}

	$sPath = $_GET["sPath"];

	echo '<link href="'.$sPath.'styles.css" type="text/css" rel="stylesheet">';
	if ($ie) {
		echo '<link href="'.$sPath.'ie.css" type="text/css" rel="stylesheet">';
	} else {
		echo '<link href="'.$sPath.'moz.css" type="text/css" rel="stylesheet">';
	}
?>

<script type="text/javascript" language="javascript">
<?php
	if ($ie){
		if (isset($_SESSION["dt"])){
			echo "new_layout=true;\n";
		} else {
			echo "new_layout=false;\n";
		}	
	}
?>
	var s="";
	s=document.location.search;
	function getParameter(str,par){
		idx=str.indexOf("?"+par+"=",0);
		if(idx==-1)idx=str.indexOf("&"+par+"=",1);
		if (idx==-1) return 0;
		idx2=str.indexOf("&",idx+1);
		if((idx>=0)&&(idx2==-1))idx2=str.length;
		return str.substring(idx+par.length+2,idx2)
	}
	is_forcePasteWord=getParameter(document.location.search,"forcePasteWord");
	is_forcePasteAsText=getParameter(document.location.search,"forcePasteAsText");	
	name=getParameter(s,"name");
</script>

<script type="text/javascript" language="javascript">
	var editable_area_selected=false;
	var imageLoader = new ImageLoader();

	if (document.all){
		var skinPath = parent.skinPath;
		var skinPath2 = parent.skinPath2;
	}else{
		var skinPath = parent.skinPath2;
		var skinPath2 = parent.skinPath2;
	}

	var border_css_file = "borders.css";
	width=getParameter(s,"width");
	height=getParameter(s,"height");
	useXHTML=getParameter(s,"useXHTML");
	docType=getParameter(s,"docType");
	combostyle_flag = getParameter(s,"ComboStyles");
	var useBR=getParameter(s,"SingleLineReturn");
	spellLang=getParameter(s,"spellLang");
	var customInserts=parent.customInserts[name];
	var CustomLink=parent.customLinks[name];
	var URL=parent.URL[name];
	var imageDir=parent.imageDir[name];
	var flashDir=parent.flashDir[name];
	var mediaDir=parent.mediaDir[name];
	var popup_color_src = parent.popup_color_src[name];
	var linkPath=parent.linkDir[name];
	var showThumbnails=parent.showThumbnails[name];
	var showFlashThumbnails=parent.showFlashThumbnails[name];
	var disableImageUploading=parent.disableImageUploading[name];
	var loadedFile = parent.loadedFile[name];
	var oldbasehref = parent.doc_root;
	var doc_root = parent.doc_root;
	var serverurl = parent.serverurl[name];
	doc_root = doc_root.substring(0,doc_root.substring(0,doc_root.length-2).lastIndexOf("/")+1);
	var deveditPath=parent.deveditPath[name];
	var deveditPath1=parent.deveditPath1[name];
	var additionalButtons = parent.additionalButtons[name];
	var eventListener = parent.eventListener[name];
	var showLineNumber = parent.showLineNumber[name];
	var hideFlashTab = parent.hideFlashTab[name];
	var hideMediaTab = parent.hideMediaTab[name];
	var hideTagBar = parent.hideTagBar[name];

	loading_in_progress = true;

	// add additional buttons
	current_tb = 0;
	for (var i = 0; i < additionalButtons.length; i++){
		if (additionalButtons[i][5]=="" || !DevEditToolbarSets[additionalButtons[i][5]]){
			var l = DevEditToolbarSets["Complete"].length;
			var j = DevEditToolbarSets["Complete"][l-1].length;
			DevEditToolbarSets["Complete"][l-1][j] = additionalButtons[i][0];
		} else {
			var mtb = additionalButtons[i][5];
			var l = DevEditToolbarSets[mtb].length;
			var j = DevEditToolbarSets[mtb][l-1].length;
			DevEditToolbarSets[mtb][l-1][j] = additionalButtons[i][0];
		}
	}

	if (loadedFile.lastIndexOf("/")>0)loadedFile = loadedFile.substr(0,loadedFile.lastIndexOf("/")+1);
		else loadedFile="";

	var r = new RegExp (deveditPath1,"gi")
	var web_root = deveditPath.replace(r,"");
	var r1 = new RegExp (web_root,"gi");
	if (web_root){
		loadedFile = loadedFile.replace(r1,serverurl);
	}

	var disableLinkUploading=parent.disableLinkUploading[name];
	var disableImageDeleting=parent.disableImageDeleting[name];
	var disableFlashUploading=parent.disableFlashUploading[name];
	var disableFlashDeleting=parent.disableFlashDeleting[name];
	var disableMediaUploading=parent.disableMediaUploading[name];
	var disableMediaDeleting=parent.disableMediaDeleting[name];

	var HideWebImage=parent.HideWebImage[name];
	var HideWebFlash=parent.HideWebFlash[name];
	var HTTPStr=parent.HTTPStr[name];
	var imageLibs=parent.imageLibs[name];
	var flashLibs=parent.flashLibs[name];
	var myBaseHref=parent.myBaseHref[name];
	var isEditingHTMLPage=parent.isEditingHTMLPage[name];
	var ScriptName=parent.ScriptName[name];
	var snippetCSS = parent.snippetCSS[name];

	var skinName=parent.skinName[name];
	var toolbarmode=getParameter(s,"mode");
	var is_setCursor=getParameter(s,"setCursor");

	var maximagewidth = getParameter(s,"maximagewidth")*1.0;
	var maximageheight = getParameter(s,"maximageheight")*1.0;
	var maxUploadFileSize = getParameter(s,"maxUploadFileSize")*1.0;

	var re3=parent.re3[name];
	var re4=parent.re4[name];
	var re5=parent.re5[name];
	var pathType=parent.pathType[name];
	var hideitems=new Array();
	var max_image_upload_width = 100;
	var max_image_upload_height = 100;
	getArray();
	buildFintList();

function buildFintList(){
	fontNameList=getParameter(s,"fontNameList");
	if(fontNameList!=""){
		f=fontNameList.split(",")
		mFontname=new Array();
		mFontname[0]=["Font",""];
		var cnt = f.length;
		for(i=0;i<cnt;i++){
			mFontname[i+1]=[f[i],f[i]];
		}
		cnt++;
		mFontname[cnt] = ["-","",""];

		cnt++;
		mFontname[cnt] = ["Remove Font","",""];
	}
	fontSizeList=getParameter(s,"fontSizeList");
	if(fontSizeList!=""){
		f=fontSizeList.split(",")
		mFontsize=new Array();
		mFontsize[0]=["Size",""];
		var cnt=0;
		for(i=0;i<f.length;i++){
			switch (f[i]){
				case "1":
					cnt++;
					mFontsize[cnt] = ["Size 1","8pt","1"];
					break;
				case "2":
					cnt++;
					mFontsize[cnt] = ["Size 2","10pt","2"];
					break;
				case "3":
					cnt++;
					mFontsize[cnt] = ["Size 3","12pt","3"];
					break;
				case "4":

					cnt++;
					mFontsize[cnt] = ["Size 4","14pt","4"];
					break;
				case "5":
					cnt++;
					mFontsize[cnt] = ["Size 5","18pt","5"];
					break;
				case "6":
					cnt++;
					mFontsize[cnt] = ["Size 6","24pt","6"];
					break;
				case "7":
					cnt++;
					mFontsize[cnt] = ["Size 7","36pt","7"];
					break;
			}
		}

		cnt++;
		mFontsize[cnt] = ["-","",""];

		cnt++;
		mFontsize[cnt] = ["Remove Size","","3"];
	}
}

function getArray(){
	hideitems["ContextMenu"]=getParameter(s,"disableContextMenu");
	hideitems["Copy"]=getParameter(s,"Copy");
	hideitems["Cut"]=getParameter(s,"Cut");
	hideitems["Paste"]=getParameter(s,"Paste");
	hideitems["Save"]=getParameter(s,"Save");
	hideitems["Spellcheck"]=getParameter(s,"Spelling");
	hideitems["RemoveFormat"]=getParameter(s,"RemoveTextFormatting");
	hideitems["Fullscreen"]=getParameter(s,"FullScreen");
	hideitems["Bold"]=getParameter(s,"Bold");
	hideitems["Underline"]=getParameter(s,"Underline");
	hideitems["Italic"]=getParameter(s,"Italic");
	hideitems["Strikethrough"]=getParameter(s,"Strikethrough");
	hideitems["OrderedList"]=getParameter(s,"NumberList");
	hideitems["UnorderedList"]=getParameter(s,"BulletList");
	hideitems["Indent"]=getParameter(s,"DecreaseIndent");
	hideitems["Outdent"]=getParameter(s,"IncreaseIndent");
	hideitems["SuperScript"]=getParameter(s,"SuperScript");
	hideitems["SubScript"]=getParameter(s,"SubScript");
	hideitems["JustifyLeft"]=getParameter(s,"LeftAlign");
	hideitems["JustifyCenter"]=getParameter(s,"CenterAlign");
	hideitems["JustifyRight"]=getParameter(s,"RightAlign");
	hideitems["JustifyFull"]=getParameter(s,"Justify");
	hideitems["Custominsert"]=getParameter(s,"Custom");
	hideitems["HR"]=getParameter(s,"HorizontalRule");
	hideitems["CreateLink"]=getParameter(s,"Link");
	hideitems["Anchor"]=getParameter(s,"Anchor");
	hideitems["CreateEmailLink"]=getParameter(s,"MailLink");
	hideitems["Help"]=getParameter(s,"Help");
	hideitems["Fontname"]=getParameter(s,"Font");
	hideitems["Fontsize"]=getParameter(s,"Size");
	hideitems["Formatblock"]=getParameter(s,"Format");
	hideitems["Styles"]=getParameter(s,"Style");
	hideitems["Fontcolor"]=getParameter(s,"ForeColor");
	hideitems["Highlight"]=getParameter(s,"BackColor");
	hideitems["Table"]=getParameter(s,"Table");
	hideitems["Form"]=getParameter(s,"Form");
	hideitems["Image"]=getParameter(s,"Image");
	hideitems["Flash"]=getParameter(s,"Flash");
	hideitems["Inserttextbox"]=getParameter(s,"TextBox");
	hideitems["Insertchars"]=getParameter(s,"Symbols");
	if (docType==1)hideitems["Pageproperties"]=getParameter(s,"Props");
		else hideitems["Pageproperties"]="1";
	hideitems["Clearcode"]=getParameter(s,"Clean");
	hideitems["Toggleposition"]=getParameter(s,"Absolute");
	hideitems["EditMode"]=getParameter(s,"EditMode");
	hideitems["SourceMode"]=getParameter(s,"SourceMode");
	hideitems["PreviewMode"]=getParameter(s,"PreviewMode");
	hideitems["Showborders"]=getParameter(s,"Guidelines");
	hideitems["guidelinesOnByDefault"]=getParameter(s,"guidelinesOnByDefault");
	hideitems["File"]=getParameter(s,"File");
	hideitems["Media"]=getParameter(s,"Media");

	hideitems["tlbmode"]=getParameter(s,"tlbmode");

}

for (var i=0;i<parent.toolbarSetNames[name].length;i++){
	var tn = parent.toolbarSetNames[name][i];
	if(!DevEditToolbarSets[tn])DevEditToolbars[DevEditToolbars.length] = tn;
	DevEditToolbarSets[tn] = new Array();
	DevEditToolbarSets[tn][0] = new Array();
	var temp_row = 0;
	for (var j=0;j<parent.toolbarSet[name][tn].length;j++){
		if (parent.toolbarSet[name][tn][j]=="|"){
			temp_row++;
			DevEditToolbarSets[tn][temp_row] = new Array();
			continue;
		}
		DevEditToolbarSets[tn][temp_row][j] = parent.toolbarSet[name][tn][j];
	}
}

var cleared=false;
window.onunload=function(evt){
	if(!cleared){
		garbage.clearMemory();
	}
};
</script>
</head>
<body style="overflow-y:hidden"  id="de_body" onload="javascript:if(ed)ed.setInitialValue();"  bgColor=#FFFFFF leftMargin=0 topMargin=0 marginheight="0" marginwidth="0">
<table width="100%" height="100%" cellspacing="0" cellpadding="0"><tr><td height="100%" width="100%" class="devborder">
<script type="text/javascript" language="javascript">
	var garbage = new Garbage();
	var ed=new Editor(name,width,height,skinName);
	ed.Create();
	<?php echo "parent." . $_GET["name"] . " = ed;"; ?>
	ed.writeContentWithCSS();
</script>
</td></tr></table>
</body></html>

<?php session_start(); ?>
<?php header('Content-Type: '. $_REQUEST["GXPCHARSET"]); ?>
<html>
<head>
<meta http-equiv="content-type" content="<?php print($_REQUEST["GXPCHARSET"]);?>"/>
<title>GXportal Editor</title>
</head>
<script>

function GXPSave()
{
 var code = parent.document.gxportal.GXPortalDevEdit_html.value ;
 code = code.replace( /"/g , "&quot;") ;
// code = code.replace( /&/g , "&amp;") ;
 window.opener.document.getElementsByName("_HTMLTEXT")[0].value = code;
 window.opener.document.getElementsByName("_HTMLINPUT")[0].value = code;
 window.close();
}
</script>

<?php include_once("de/class.devedit.php"); ?>
<?php
	if (session_id() == "")
                               session_start();

	if (strpos(strtoupper($_SERVER['SERVER_SOFTWARE']), 'IIS') != false && isset($_SERVER['SERVER_SOFTWARE']))
		SetDevEditPath("de");
	else
		SetDevEditPath("/gxpeditor/de");
		
	SetGXPBackendPath($_SERVER['HTTP_REFERER']);

	$myDE = new DevEdit;
	$myDE->SetName("GXPortalDevEdit");
	$myDE->SetFlashPath("/flash");

	$myHTML = $_REQUEST["GXPTEXT"];
	$myHTML = str_replace("&amp;","&", $myHTML);
	$myHTML = str_replace("&quot;","\"", $myHTML);
	$myHTML = stripslashes($myHTML); // Agregado para sacar los caracteres "\" que agrega PHP para escapear

	//Charge new fontlist
	$mynewFONTLIST =  $_REQUEST["GXPFONTLIST"];
	$myDE->SetFontList($mynewFONTLIST);



	//Settings in editor
	$myDE->DisableXHTMLFormatting();
	$myDE->HideFormatList();
	$myDE->HideStyleList();
	$myDE->SetValue($myHTML);
	$myDE->HideFullScreenButton();
	$myDE->HideFormButton();
	$myDE->HideHelpButton();
	$myDE->HideFlashButton();
	$myDE->HideSaveButton();
	$myDE->HideMediaButton();
	$myDE->DisableMediaUploading();
	$myDE->DisableImageUploading();
	$myDE->DisableFlashUploading();

	//Set Language to the Spell Checker

	$myDE->SetLanguage(DE_AMERICAN);
	$mySpellLng = $_REQUEST["GXPSPELLLNG"];

	if ($mySpellLng == "S")
		$myDE->SetLanguage(DE_SPANISH);

	if ($mySpellLng == "E")
		$myDE->SetLanguage(DE_AMERICAN);

	if ($mySpellLng == "I")
		$myDE->SetLanguage(DE_ITALIAN);

	if ($mySpellLng == "F")
		$myDE->SetLanguage(DE_FRENCH);

	if ($mySpellLng == "P")
		$myDE->SetLanguage(DE_PORTUGESE);

	if ($mySpellLng == "G")
		$myDE->SetLanguage(DE_GERMAN);
	
	//Set Language Session variable, for images dialog
	$_SESSION['LngId'] = $mySpellLng;

	//Set Caller Type Session variable, for images dialog
	$_SESSION['CallerType'] = $_REQUEST["GXPCALLERTYPE"];

	//Set Content Type Id
	$_SESSION['CTConTypId'] = $_REQUEST["GXPCTCONTYPID"];

	//Set Charset
	$_SESSION['GXPCharset'] = $_REQUEST["GXPCHARSET"];

	//Set Program Extension
	$_SESSION['pgmExtension'] = $_REQUEST["GXPPGMEXTENSION"];

	//Optional Settings in editor

	$mynewSTYLE =  $_REQUEST["GXPSETTING"];

	$myfontlist 	= substr( $mynewSTYLE, 0, 1);
	$mysizelist 	= substr( $mynewSTYLE, 1, 1);
	$mycolor 	= substr( $mynewSTYLE, 2, 1);
	$mybackcolor 	= substr( $mynewSTYLE, 3, 1);
	$mytable 	= substr( $mynewSTYLE, 4, 1);
	$myinsertimage 	= substr( $mynewSTYLE, 5, 1);
	$mysource 	= substr( $mynewSTYLE, 6, 1);


	//Hide FontList
    	if ($myfontlist != "Y")
		$myDE->HideFontList();


	//Hide SizeList
	if ($mysizelist != "Y")
	 	$myDE->HideSizeList();


	//Hide ForeColorButton
	if ($mycolor != "Y")
		$myDE->HideForeColorButton();


	//Hide BackColorButton
	if ($mybackcolor != "Y")
		$myDE->HideBackColorButton();


	//Hide TableButton
	if ($mytable != "Y")
		$myDE->HideTableButton();


	//Hide ImageButton
	if ($myinsertimage != "Y")
		$myDE->HideImageButton();


	//Hide Source tab
	if ($mysource != "Y")
		$myDE->DisableSourceMode();

?>

<body topmargin="0" leftmargin="0">
<form  id="gxportal" name="gxportal" >
  <table border="0" cellpadding="0" cellspacing="0" width="100%" background="background_bar_header.gif">
    <tr>
      <td>
            <img id="LogoGXP" src="logo_gxportal.gif">
      </td>
      <td align="right" valign="top">
            <img src="save.jpg" id="save" alt="Confirm changes" onclick=GXPSave() style="cursor:pointer;" />
      </td>
    </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td><?php $myDE->ShowControl("100%","470pt","/Images"); ?></td>
    </tr>
  </table>
</form>
</body>
</html>

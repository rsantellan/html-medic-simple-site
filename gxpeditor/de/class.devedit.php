<?php

	/***********************************************************\
	|                                                            |
	|  DevEdit NX 1.7.6 Copyright Interspire Pty Ltd 2006        |
	|  All rights reserved. Do NOT modify this file. If          |
	|  you attempt to do so then we canot provide support. This  |
	|  or any other DevEdit files may NOT be shared or           |
	|  distributed in any way. To purchase more licences, please |
	|  visit www.devedit.com                                     |
	|                                                            |
	\************************************************************/

	//error_reporting(0);

	// Define constants for calling varions class functions
	define("DE_PATH_TYPE_FULL", 0);
	define("DE_PATH_TYPE_ABSOLUTE", 1);
	define("DE_DOC_TYPE_SNIPPET", 0);
	define("DE_DOC_TYPE_HTML_PAGE", 1);
	define("DE_IMAGE_TYPE_ROW", 0);
	define("DE_IMAGE_TYPE_THUMBNAIL", 1);
	define("DE_FLASH_TYPE_ROW", 0);
	define("DE_FLASH_TYPE_THUMBNAIL", 1);

	define("DE_AMERICAN", 1);
	define("DE_BRITISH", 2);
	define("DE_CANADIAN", 3);
	define("DE_FRENCH", 4);
	define("DE_SPANISH", 5);
	define("DE_GERMAN", 6);
	define("DE_ITALIAN", 7);
	define("DE_PORTUGESE", 8);
	define("DE_DUTCH", 9);
	define("DE_NORWEGIAN", 10);
	define("DE_SWEDISH", 11);
	define("DE_DANISH", 12);

	if (!isset($_SERVER['DOCUMENT_ROOT']) || $_SERVER['DOCUMENT_ROOT'] == '') {
		if (isset($_SERVER['ORIG_PATH_TRANSLATED'])) {
			$path_translated = str_replace(array('\\', '//'), '/', $_SERVER['ORIG_PATH_TRANSLATED']);
		} elseif (isset($_SERVER['PATH_TRANSLATED'])) {
			$path_translated = str_replace(array('\\', '//'), '/', $_SERVER['PATH_TRANSLATED']);
		} else {
			$path_translated = '';
		}
		$_SERVER['DOCUMENT_ROOT'] = str_replace($_SERVER['SCRIPT_NAME'], '', $path_translated);
	}

	// If Server Document Root variable is not set, we need to calculate it manually usually for IIS
	if (!isset($_SERVER['DOCUMENT_ROOT']) || $_SERVER['DOCUMENT_ROOT'] == '') {
		$_SERVER['DOCUMENT_ROOT'] = $_SERVER['PATH_TRANSLATED'];
		$_SERVER['DOCUMENT_ROOT'] = str_replace($_SERVER['PATH_INFO'], '', $_SERVER['DOCUMENT_ROOT'] );
	}

	// If PHP is running in ISAPI mode, all the paths have double backslashes
	// seperating the path components so we need to reduce these to single backslashes
	if (PHP_SAPI == 'isapi') {
		$_SERVER['DOCUMENT_ROOT'] = str_replace('\\\\', '\\', $_SERVER['DOCUMENT_ROOT']);
	}

	// Convert any backslashes to forward slashes
	while (strpos($_SERVER['DOCUMENT_ROOT'], '\\')) {
		$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
	}

	// Get rid of any trailing slash on document root, which happens on some web servers, eg. LightTPD
	if (substr($_SERVER['DOCUMENT_ROOT'], -1) == '/') {
		$_SERVER['DOCUMENT_ROOT'] = substr($_SERVER['DOCUMENT_ROOT'], 0, -1);
	}

	// Check if HTTPS is enabled
	if (@$_SERVER["HTTPS"] == "on") {
		$GLOBALS['HTTPStr'] = "https";
	} else	{
		$GLOBALS['HTTPStr'] = "http";
	}

	$GLOBALS['DevEditError'] = false;

	if (is_numeric(strpos($_SERVER["PHP_SELF"], "class.devedit.php"))) {
		$DE_PATH = "";
	} else {
		$DE_PATH = "de/";
	}


	// We will calculate the path to DevEdit directory from the web directory
	// eg. /devedit/de
	$GLOBALS['DevEditPath']="";

	// Full server side path to DE directory
	// eg. c:\www\devedit\de OR /var/www/devedit/de
	$GLOBALS['DevEditPath_Full']="";

	function SetDocumentRoot($root)
	{
		$_SERVER['DOCUMENT_ROOT'] = $root;
	}

	function SetDevEditPath($Path)
	{
		$tmpPath = "";

		//Does the path contain a trailing slash? If so, remove it
		$lastChar = substr($Path, strlen($Path)-1, 1);

		if ($lastChar == "/") {
			$tmpPath = substr($Path, 0, strlen($Path)-1);
		} else {
			$tmpPath = $Path;
		}

		//Is this a relative path?
		if (substr($tmpPath, 0, 1) != "/") {
            if (empty($_SERVER['PHP_SELF']) && !empty($_SERVER['SCRIPT_URL'])) {
                $_SERVER['PHP_SELF'] = $_SERVER['SCRIPT_URL'];
            }
			$tmpPath = strrev($_SERVER["PHP_SELF"]);
			$firstSlash = strpos($tmpPath, "/");
			$tmpPath = strrev(substr($tmpPath, $firstSlash, strlen($tmpPath)));
			$tmpPath = $tmpPath . "/" . $Path;
			$tmpPath = str_replace("//", "/", $tmpPath);
			$tmpPath = eregi_replace("/$", "", $tmpPath);
		}

		$GLOBALS['DevEditPath'] = $tmpPath;

		$GLOBALS['DevEditPath_Full'] = str_replace("//", "/", $_SERVER['DOCUMENT_ROOT'] . "/" . $tmpPath);

	}

	function SetGXPBackendPath($Path)
	{
		$pos = strrpos($Path, "/");
		$_SESSION['GXPBackendPath'] = substr($Path,0,$pos);
	}

	$GLOBALS['dname'] = str_replace('\\', '/', dirname(__FILE__));


	function DisplayIncludes($file)
	{
		// This function will load a .inc file and replace any
		// values that start with [sTxt using a regexp with the
		// values that were defined as constants in de_lang/language.php
		include_once($GLOBALS['dname'].'/de_lang/language.php');
		$filePath = $GLOBALS['dname'].'/dialog/'.$file;

		// $URL
		$url = @$_SERVER["HTTP_HOST"];
		if (@$url == "") {
			$url = @$_SERVER["HTTP_HOST"];
		}

		// $SCRIPTNAME
		$scriptName = 'class.devedit.php';
		$scriptDir = strrev($_SERVER['PHP_SELF']);
		$slashPos = strpos($scriptDir, '/');
		$scriptDir = strrev(substr($scriptDir, $slashPos, strlen($scriptDir)));
		$scriptName = $scriptDir . $scriptName;

		if (is_file($filePath) && str_replace('\\', '/', realpath($filePath)) == $filePath) {
			$data = '';
			$fp = fopen($filePath, 'rb');
			if ($fp) {
				while (!feof($fp)) {
					$data .= fgets($fp, 1024);
				}
				fclose($fp);
			}

			$find = array (
				'$URL',
				'$SCRIPTNAME',
				'$HTTPStr',
				'$DEP'
			);
			$replace = array (
				$url,
				$scriptName,
				$GLOBALS['HTTPStr'],
				$GLOBALS['DevEditPath']
			);

			$data = str_replace($find, $replace, $data);

			$data = preg_replace("/\[sTxt(\w*)\]/ei","sTxt\\1", $data);

		} else {
			$data = 'File not found: '.str_replace($GLOBALS['dname'], '', $filePath);
			$GLOBALS['DevEditError'] = true;
		}
		echo $data;
	}

	// Examine the value of the ToDo argument and proceed to correct sub
	$ToDo = @$_GET["ToDo"];

	if ($ToDo == "") {
		$ToDo = @$_POST["ToDo"];
	}


	if (@$GLOBALS['DevEditPath'] == "") {
		$GLOBALS['DevEditPath'] = @$_GET["DEP"];
		$GLOBALS['DevEditPath_Full'] = $GLOBALS['DevEditPath'];
	}

	if(@$_SESSION['GXPBackendPath'] == "")
        {
        	$_SESSION['GXPBackendPath'] = @$_GET["GXP"];
        }

	switch ($ToDo) {
		case "MediaManager":
		{
			// Pass to insert image screen
			include($GLOBALS['dname'] . '/'. "dialog/gxpmedia_manager.php");
			break;
		}
		case "DeleteImage":
		{
			include($GLOBALS['dname'] . '/'."dialog/gxpmedia_manager.php");
			break;
		}
		case "UploadImage":
		{
			include($GLOBALS['dname'] . '/'. "dialog/gxpmedia_manager.php");
			break;
		}
		case "Findreplace":
		{
			DisplayIncludes("find_replace.inc");
			break;
		}
		case "SpellCheck":
		{
			DisplayIncludes("spell_check.inc");
			break;
		}
		case "DoSpell":
		{
			DisplayIncludes("do_spell.inc");
			break;
		}
		case "InsertTable":
		{
			DisplayIncludes("insert_table.inc");
			break;
		}
		case "QuickTable":
		{
			DisplayIncludes("quick_table.inc");
			break;
		}
		case "ModifyTable":
		{
			DisplayIncludes("modify_table.inc");
			break;
		}
		case "ModifyCell":
		{
			DisplayIncludes("modify_cell.inc");
			break;
		}
		case "ModifyImage":
		{
			DisplayIncludes("modify_image.inc");
			break;
		}
		case "InsertForm":
		{
			DisplayIncludes("insert_form.inc");
			break;
		}
		case "ModifyForm":
		{
			DisplayIncludes("modify_form.inc");
			break;
		}
		case "InsertTextField":
		{
			DisplayIncludes("insert_textfield.inc");
			break;
		}
		case "ModifyTextField":
		{
			DisplayIncludes("modify_textfield.inc");
			break;
		}
		case "InsertTextArea":
		{
			DisplayIncludes("insert_textarea.inc");
			break;
		}
		case "ModifyTextArea":
		{
			DisplayIncludes("modify_textarea.inc");
			break;
		}
		case "InsertHidden":
		{
			DisplayIncludes("insert_hidden.inc");
			break;
		}
		case "ModifyHidden":
		{
			DisplayIncludes("modify_hidden.inc");
			break;
		}
		case "InsertButton":
		{
			DisplayIncludes("insert_button.inc");
			break;
		}
		case "ModifyButton":
		{
			DisplayIncludes("modify_button.inc");
			break;
		}
		case "InsertCheckbox":
		{
			DisplayIncludes("insert_checkbox.inc");
			break;
		}
		case "ModifyCheckbox":
		{
			DisplayIncludes("modify_checkbox.inc");
			break;
		}
		case "InsertRadio":
		{
			DisplayIncludes("insert_radio.inc");
			break;
		}
		case "ModifyRadio":
		{
			DisplayIncludes("modify_radio.inc");
			break;
		}
		case "InsertSelect":
		{
			DisplayIncludes("insert_select.inc");
			break;
		}
		case "ModifySelect":
		{
			DisplayIncludes("modify_select.inc");
			break;
		}
		case "Pageproperties":
		{
			DisplayIncludes("page_properties.inc");
			break;
		}
		case "Insertchars":
		{
			DisplayIncludes("insert_chars.inc");
			break;
		}
		case "FileManager":
		{
			include($GLOBALS['dname'] . '/'. "dialog/gxpfile_manager.php");
			break;
		}
		case "InsertLink":
		{
			include($GLOBALS['dname'] . '/'. "dialog/gxpfile_manager.php");
			break;
		}
		case "InsertEmail":
		{
			include($GLOBALS['dname'] . '/'. "dialog/gxpfile_manager.php");
			break;
		}
		case "InsertAnchor":
		{
			DisplayIncludes("insert_anchor.inc");
			break;
		}
		case "ModifyAnchor":
		{
			DisplayIncludes("modify_anchor.inc");
			break;
		}
		case "MoreColors":
		{
			DisplayIncludes("more_colors.inc");
			break;
		}
		case "Custominsert":
		{
			DisplayIncludes("custom_insert.inc");
			break;
		}
		case "ShowHelp":
		{
			DisplayIncludes("help.inc");
			break;
		}
		case "GeckoXPConnect":
		{
			DisplayIncludes("gecko_security.inc");
			break;
		}
		case "Edittag":
		{
			DisplayIncludes("edit_tag.inc");
			break;
		}
	}

	class DevEdit
	{
		var $__controlName;
		var $__controlWidth;
		var $__controlHeight;
		var $__initialValue;
		var $__initialValueNoBase;
		var $__langPack;
		var $__hideSave;
		var $__hideSpelling;
		var $__hideRemoveTextFormatting;
		var $__hideFullScreen;
		var $__hideBold;
		var $__hideUnderline;
		var $__hideItalic;
		var $__hideStrikethrough;
		var $__hideNumberList;
		var $__hideBulletList;
		var $__hideDecreaseIndent;
		var $__hideIncreaseIndent;
		var $__hideSuperScript;
		var $__hideSubScript;
		var $__hideLeftAlign;
		var $__hideCenterAlign;
		var $__hideRightAlign;
		var $__hideJustify;
		var $__hideHorizontalRule;
		var $__hideLink;
		var $__hideCustom;
		var $__hideAnchor;
		var $__hideMailLink;
		var $__hideHelp;
		var $__hideFont;
		var $__hideSize;
		var $__hideFormat;
		var $__hideStyle;
		var $__hideForeColor;
		var $__hideBackColor;
		var $__hideTable;
		var $__hideForm;
		var $__hideToolbarMode;
		var $__hideImage;
		var $__hideFlash;
		var $__flashPath;
		var $__hideTextBox;
		var $__hideSymbols;
		var $__hideProps;
		var $__hideWord;
		var $__hideAbsolute;
		var $__hideClean;
		var $__hidePositionAbsolute;
		var $__hideGuidelines;
		var $__disableSourceMode;
		var $__disablePreviewMode;
		var $__disableEditMode;
		var $__guidelinesOnByDefault;
		var $__imagePath;
		var $__mediaPath;
		var $__hasFlashLibraries;
		var $__flashLibsArray;
		var $__baseHref;
		var $__imagePathType;
		var $__docType;
		var $__imageDisplayType;
		var $__flashDisplayType;
		var $__disableImageUploading;
		var $__disableImageDeleting;
		var $__disableFlashUploading;
		var $__disableFlashDeleting;
		var $__disableMediaUploading;
		var $__disableMediaDeleting;
		var $__enableXHTMLSupport;
		var $__useSingleLineReturn;
		var $__customInsertArray;
		var $__customLinkArray;
		var $__hasCustomInserts;
		var $__hasCustomLinks;
		var $__snippetCSS;
		var $__textareaRows;
		var $__textareaCols;
		var $__fontNameList;
		var $__fontSizeList;
		var $__hideWebImage;
		var $__hideWebFlash;
		var $__language;
		var $__imageLibsArray;
		var $__hasImageLibraries;
		var $__showLoadingPleaseWait;
		var $__remotePath;
		var $__startPath;
		var $__startURL;
		var $__uploadScriptPath;
		var $__scUserId;

		// Keep track of how many buttons are hidden in the top row.
		// If they are all hidden, then we dont show that row of the menu.
		var $__numTopHidden;
		var $__numBottomHidden;

		function DevEdit()
		{
			// Set the default value of all private variables for the class
			$this->__loadedFile = "";
			$this->__comboStyles = true;
			$this->__controlName = "";
			$this->__controlWidth = 0;
			$this->__controlHeight = 0;
			$this->__initialValue = "";
			$this->__initialValueNoBase = "";
			$this->__langPack = 0;
			$this->__hideCopy = 0;
			$this->__hideCut = 0;
			$this->__hidePaste = 0;
			$this->__hideSave = 0;
			$this->__hideSpelling = 0;
			$this->__hideRemoveTextFormatting = 0;
			$this->__hideFullScreen = 0;
			$this->__hideBold = 0;
			$this->__hideUnderline = 0;
			$this->__hideItalic = 0;
			$this->__hideStrikethrough = 0;
			$this->__hideNumberList = 0;
			$this->__hideBulletList = 0;
			$this->__hideDecreaseIndent = 0;
			$this->__hideIncreaseIndent = 0;
			$this->__hideSuperScript = 0;
			$this->__hideSubScript = 0;
			$this->__hideLeftAlign = 0;
			$this->__hideCenterAlign = 0;
			$this->__hideRightAlign = 0;
			$this->__hideJustify = 0;
			$this->__hideHorizontalRule = 0;
			$this->__hideLink = 0;
			$this->__hideAnchor = 0;
			$this->__hideMailLink = 0;
			$this->__hideHelp = 0;
			$this->__hideFont = 0;
			$this->__hideSize = 0;
			$this->__hideFormat = 0;
			$this->__hideStyle = 0;
			$this->__hideForeColor = 0;
			$this->__hideBackColor = 0;
			$this->__hideTable = 0;
			$this->__hideForm = 0;
			$this->__hideImage = 0;
			$this->__hideFlash = 0;
			$this->__hideFile = 0;
			$this->__hideMedia = 0;
			$this->__hideCustom = 0;
			$this->__flashPath = "";
			$this->__mediaPath = "";
			$this->__hideTextBox = 0;
			$this->__hideSymbols = 0;
			$this->__hideProps = 0;
			$this->__hideWord = 0;
			$this->__hideAbsolute = 0;
			$this->__hideClean = 0;
			$this->__hideGuidelines = 0;
			$this->__hideToolbarMode = 0;
			$this->__hidePositionAbsolute = 0;
			$this->__disableEditMode = 0;
			$this->__disableSourceMode = 0;
			$this->__disablePreviewMode = 0;
			$this->__guidelinesOnByDefault = 0;
			$this->__imagePath = "";
			$this->__forcePasteWord = false;
			$this->__forcePasteAsText = false;
			$this->__setCursor = false;
			$this->__hasFlashLibraries = false;
			$this->__hasAdditionalButtons = false;
			$this->__flashLibsArray = array();
			$this->__baseHref = "";
			$this->__numTopHidden = 0;
			$this->__numBottomHidden = 0;
			$this->__imagePathType = 0;
			$this->__docType = 0;
			$this->__imageDisplayType = -1;
			$this->__flashDisplayType = 0;
			$this->__disableImageUploading = 0;
			$this->__disableImageDeleting = 0;
			$this->__disableFlashUploading = 0;
			$this->__disableFlashDeleting = 0;
			$this->__disableMediaUploading = 0;
			$this->__disableMediaDeleting = 0;
			$this->__disableLinkUploading = 0;
			$this->__disableContextMenu = 0;
			$this->__enableXHTMLSupport = 1;
			$this->__useSingleLineReturn = 1;
			$this->__customInsertArray = array();
			$this->__customLinkArray = array();
			$this->__toolbarset = array();
			$this->__toolbarsetnames = array();
			$this->__hasCustomInserts = false;
			$this->__hasCustomLinks = false;
			$this->__hasEventListener = false;
			$this->__snippetCSS = "";
			$this->__textareaRows = 10;
			$this->__textareaCols = 30;
			$this->__fontNameList = "";
			$this->__fontSizeList = "";
			$this->__dt = "";
			$this->__hideWebImage = 0;
			$this->__hideWebFlash = 0;
			$this->__hideTagBar	= 0;
			$this->__language = 0;
			$this->__imageLibsArray = array();
			$this->__eventListener = array();
			$this->__skinName = "default";
			$this->__hasImageLibraries = false;
			$this->__showLineNumber = 0;
			$this->__hideFlashTab = 0;
			$this->__hideMediaTab = 0;
			$this->__styles = "";
			$this->__linkPath = "";
			$this->__imageMaxWidth = 0;
			$this->__imageMaxHeight = 0;
			$this->__toolbarCount = 0;
			$this->__maxUploadFileSize = 0;
			$this->__showLoadingPleaseWait = false;
			$this->__remotePath = "";
			$this->__startPath = "";
			$this->__startURL = "";
			$this->__uploadScriptPath = "";
			$this->__scUserId = 0;

			if (@$_COOKIE["de_mode"]) {
				$this->__modeName = $_COOKIE["de_mode"];
			} else {
				$this->__modeName = "";
			}
		}

	function iepopupstyle()
	{
		$filePath = $GLOBALS['dname'] . '/skins/' . $this->__skinName . '/ie_popup.css';
		$data = '';

		if (is_file($filePath)) {
			$fp = fopen($filePath, 'rb');
			if ($fp) {
				while (!feof($fp)) {
					$data .= fgets($fp, 1024);
				}
				fclose($fp);
			}
		}

		$find = '/\n/i';
		$replace = "";
		$data = preg_replace($find, $replace, $data);

		$find = '/\r/i';
		$replace = "";
		$data = preg_replace($find, $replace, $data);

		$find = '/"/i';
		$replace = "'";
		$data = preg_replace($find, $replace, $data);

		$find = '/\t/i';
		$replace = "";
		$data = preg_replace($find, $replace, $data);

		return $data;
	}

		function AddToolbarButton($ButtonName, $Width = 21, $Height = 20, $src = "", $jsfunc = "", $tb = "")
		{
			//Add toolbar button
			$this->__hasAdditionalButtons = true;
			$this->__toolbarbuttons[] = array("Name" => $ButtonName, "Width" => $Width , "Height" => $Height , "ImgSrc" => $src, "JSFunc" => $jsfunc, "Toolbar" => $tb);
		}

		function AddEventListener($event, $jsfunc = "")
		{
			// Add javascript event listener for Editor
			$this->__hasEventListener = true;
			$this->__eventListener[] = array("Name" => $event, "Func" => $jsfunc);
		}

		function __FormatEventListener()
		{
			// Private Function - This function will return all of the toolbar buttons as JavaScript arrays
			if ($this->__hasEventListener == true) {
				$ciText = "[";

				for ($i = 0; $i < sizeof($this->__eventListener); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__eventListener[$i]["Name"]));
					$func = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__eventListener[$i]["Func"]));
					$ciText .= "[\"" . $name . "\", \"" . $func . "\"],";
				}
				$ciText = substr($ciText, 0, strlen($ciText)-1);
				$ciText .= "]";
			} else {
				$ciText = "[]";
			}

			return $ciText;
		}

		function __FormatToolbarButtons()
		{
			// Private Function - This function will return all of the toolbar buttons as JavaScript arrays
			if ($this->__hasAdditionalButtons == true) {
				$ciText = "[";

				for ($i = 0; $i < sizeof($this->__toolbarbuttons); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["Name"]));
					$width = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["Width"]));
					$height = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["Height"]));
					$src = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["ImgSrc"]));
					$jsfunc = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["JSFunc"]));
					$tb = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__toolbarbuttons[$i]["Toolbar"]));

					$ciText .= "[\"" . $name . "\", \"" . $width . "\", \"" . $height . "\", \"" . $src . "\", \"" . $jsfunc . "\", \"" . $tb . "\"],";
				}

				$ciText = substr($ciText, 0, strlen($ciText)-1);
				$ciText .= "]";
			} else {
				$ciText = "[]";
			}

			return $ciText;
		}

		function SetImageUploadSize($w,$h)
		{
			$this->__imageMaxWidth = $w;
			$this->__imageMaxHeight = $h;
		}

		function HideTagBar()
		{
			$this->__hideTagBar = true;
		}

		function SetMaxUploadFileSize($s)
		{
			$this->__maxUploadFileSize = $s;
		}

		function SetFocus()
		{
			$this->__setCursor = true;
		}

		function HideMediaTab()
		{
			$this->__hideMediaTab = true;
		}

		function HideFlashTab()
		{
			$this->__hideFlashTab = true;
		}

		function ShowLineNumber()
		{
			$this->__showLineNumber = true;
		}

		function AddToolbar($toolbarname, $list)
		{
			$this->__toolbarset[$toolbarname] = $list;
			$this->__toolbarsetnames[] = $toolbarname;
		}

		function ForcePasteWord()
		{
			$this->__forcePasteWord = true;
			$this->__forcePasteAsText = false;
		}

		function ForcePasteAsText()
		{
			$this->__forcePasteAsText = true;
			$this->__forcePasteWord = false;
		}

		function SetLinkPath($p)
		{
			$this->__linkPath = $p;
		}

		function SetName($CtrlName)
		{
			$this->__controlName = $CtrlName;
		}

		function SetStyles($style)
		{
			$this->__styles = $style;
		}

		function SetWidth($Width)
		{
			$this->__controlWidth = $Width;
		}

		function SetHeight($Height)
		{
			$this->__controlHeight = $Height;
		}

		function SetBaseHref($BaseHref)
		{
			$this->__baseHref = $BaseHref;
		}

		function SetFlashPath($FlashPath)
		{
			$this->__flashPath = $FlashPath;
		}

		function SetMediaPath($Path)
		{
			$this->__mediaPath = $Path;
		}

		function SetValue($HTMLValue)
		{
			// modified for v5.0
			$this->__initialValueNoBase = $HTMLValue;

			if ($this->__docType == DE_DOC_TYPE_SNIPPET) {
				if ($this->__baseHref != "") {
					$HTMLValue = "<base href=" . $this->__baseHref . "><body>" . $HTMLValue . "</body>";
				} else {
					$HTMLValue = "<body>" . $HTMLValue . "</body>";
					$this->__initialValueNoBase = "<body>" . $this->__initialValueNoBase . "</body>";
				}
			}

			if ($this->__docType == DE_DOC_TYPE_SNIPPET && $this->__snippetCSS != "") {
				//$HTMLValue = "<link rel='stylesheet' type='text/css' href='" . $this->__snippetCSS . "'>" . $HTMLValue;
				//$this->__initialValueNoBase = "<link rel='stylesheet' type='text/css' href='" . $this->__snippetCSS . "'>" . $this->__initialValueNoBase;
			}

			// The editor dies if there are no head tags. Also technically
			// title tags in head tags are required for w3c validity so adding
			// the head tags isn't really that bad a thing
			if ($this->__docType == DE_DOC_TYPE_HTML_PAGE && strpos(strtolower($HTMLValue), "<head") === FALSE) {
				$HTMLValue = preg_replace('%(<html[^>]*>)%si', '\1<head></head>', $HTMLValue);
				$this->__initialValueNoBase = preg_replace('%(<html[^>]*>)%si', '\1<head></head>', $this->__initialValueNoBase);
			}

			if ($this->__docType == DE_DOC_TYPE_HTML_PAGE && !is_numeric(strpos(strtolower($HTMLValue), "<body"))) {
				$HTMLValue = "<body>" . $HTMLValue . "</body>";
				$this->__initialValueNoBase = "<body>" . $this->__initialValueNoBase . "</body>";
			}
			// end modification

			// Format the initial text so that we can set the content of the iFrame to its value
			$HTMLValue = str_replace("&gt;", "&amp;gt;", $HTMLValue);
			$HTMLValue = str_replace("&lt;", "&amp;lt;", $HTMLValue);
			$HTMLValue = str_replace("&gt", "&amp;gt;", $HTMLValue);
			$HTMLValue = str_replace("&lt", "&amp;lt;", $HTMLValue);
			$HTMLValue = str_replace("&#60;", "&amp;#60;", $HTMLValue);
			$HTMLValue = str_replace("'", "&#39;", $HTMLValue);
			$HTMLValue = str_replace('"', '&#34;', $HTMLValue);

			$this->__initialValue = $HTMLValue;
			if (preg_match( "/<!doctype[^>]+>/i", $this->__initialValue, $matches)){
				$this->__dt = $matches[0];
			};
		}

		function GetValue($ConvertQuotes = true)
		{
			$tmpVal = @$_POST[$this->__controlName . "_html"];
			if ($tmpVal=="")$tmpVal = @$_POST[$this->__controlName . "_input"];

			if ($ConvertQuotes == false) {
				$tmpVal = str_replace("\\'", "'", $tmpVal);
				$tmpVal = str_replace('\\"', '"', $tmpVal);
			}

			return $tmpVal;
		}

		function HideCopyButton()
		{
			//Hide the save button
			$this->__hideCopy = true;
			$this->__numTopHidden++;
		}

		function HideCutButton()
		{
			//Hide the save button
			$this->__hideCut = true;
			$this->__numTopHidden++;
		}

		function HidePasteButton()
		{
			//Hide the save button
			$this->__hidePaste = true;
			$this->__numTopHidden++;
		}

		function HideSaveButton()
		{
			//Hide the save button
			$this->__hideSave = true;
			$this->__numTopHidden++;
		}

		function HideSpellingButton()
		{
			// Hide the spelling button
			$this->__hideSpelling = true;
			$this->__numTopHidden++;
		}

		function HideRemoveTextFormattingButton()
		{
			// Hide the remove text formatting button
			$this->__hideRemoveTextFormatting = true;
			$this->__numTopHidden++;
		}

		function HideFullScreenButton()
		{
			// Hide the fullscreen button
			$this->__hideFullScreen = true;
			$this->__numTopHidden++;
		}

		function HideBoldButton()
		{
			// Hide the bold button
			$this->__hideBold = true;
			$this->__numTopHidden++;
		}

		function HideUnderlineButton()
		{
			// Hide the underline button
			$this->__hideUnderline = true;
			$this->__numTopHidden++;
		}

		function HideItalicButton()
		{
			// Hide the italic button
			$this->__hideItalic = true;
			$this->__numTopHidden++;
		}

		function HideStrikethroughButton()
		{
			// Hide the strikethrough button
			$this->__hideStrikethrough = true;
			$this->__numTopHidden++;
		}

		function HideNumberListButton()
		{
			// Hide the number list button
			$this->__hideNumberList = true;
			$this->__numTopHidden++;
		}

		function HideBulletListButton()
		{
			// Hide the bullet list button
			$this->__hideBulletList = true;
			$this->__numTopHidden++;
		}

		function HideDecreaseIndentButton()
		{
			// Hide the decrease indent button
			$this->__hideDecreaseIndent = true;
			$this->__numTopHidden++;
		}

		function HideIncreaseIndentButton()
		{
			// Hide the increase indent button
			$this->__hideIncreaseIndent = true;
			$this->__numTopHidden++;
		}

		function HideSuperScriptButton()
		{
			// Hide the super script button
			$this->__hideSuperScript = true;
			$this->__numTopHidden++;
		}

		function HideSubScriptButton()
		{
			// Hide the sub script button
			$this->__hideSubScript = true;
			$this->__numTopHidden++;
		}

		function HideLeftAlignButton()
		{
			// Hide the left align button
			$this->__hideLeftAlign = true;
			$this->__numTopHidden++;
		}

		function HideCenterAlignButton()
		{
			// Hide the center align button
			$this->__hideCenterAlign = true;
			$this->__numTopHidden++;
		}

		function HideRightAlignButton()
		{
			// Hide the right align button
			$this->__hideRightAlign = true;
			$this->__numTopHidden++;
		}

		function HideJustifyButton()
		{
			// Hide the justify button
			$this->__hideJustify = true;
			$this->__numTopHidden++;
		}

		function HideHorizontalRuleButton()
		{
			// Hide the horizontal rule button
			$this->__hideHorizontalRule = true;
			$this->__numTopHidden++;
		}

		function HideLinkButton()
		{
			// Hide the link button
			$this->__hideLink = true;
			$this->__numTopHidden++;
		}

		function HideAnchorButton()
		{
			// Hide the anchor button
			$this->__hideAnchor = true;
			$this->__numTopHidden++;
		}

		function HideMailLinkButton()
		{
			// Hide the mail link button
			$this->__hideMailLink = true;
			$this->__numTopHidden++;
		}

		function HideHelpButton()
		{
			// Hide the help button
			$this->__hideHelp = true;
			$this->__numTopHidden++;
		}

		function HideFontList()
		{
			// Hide the font list
			$this->__hideFont = true;
			$this->__numBottomHidden++;
		}

		function HideSizeList()
		{
			// Hide the size list
			$this->__hideSize = true;
			$this->__numBottomHidden++;
		}

		function HideFormatList()
		{
			// Hide the format list
			$this->__hideFormat = true;
			$this->__numBottomHidden++;
		}

		function HideStyleList()
		{
			// Hide the style list
			$this->__hideStyle = true;
			$this->__numBottomHidden++;
		}

		function HideForeColorButton()
		{
			// Hide the forecolor button
			$this->__hideForeColor = true;
			$this->__numBottomHidden++;
		}

		function HideBackColorButton()
		{
			// Hide the backcolor button
			$this->__hideBackColor = true;
			$this->__numBottomHidden++;
		}

		function HideTableButton()
		{
			// Hide the table button
			$this->__hideTable = true;
			$this->__numBottomHidden++;
		}

		function HideCustomButton()
		{
			// Hide the custom insert button
			$this->__hideCustom = true;
			$this->__numBottomHidden++;
		}


		function HideFormButton()
		{
			// Hide the form button
			$this->__hideForm = true;
			$this->__numBottomHidden++;
		}

		function HideImageButton()
		{
			// Hide the image button
			$this->__hideImage = true;
			$this->__numBottomHidden++;
		}

		function HideFileButton()
		{
			// Hide the file button
			$this->__hideFile = true;
			$this->__numBottomHidden++;
		}

		function HideMediaButton()
		{
			// Hide the media button
			$this->__hideMedia = true;
			$this->__numBottomHidden++;
		}

		function HideFlashButton()
		{
			//Hide the flash button
			$this->__hideFlash = true;
			$this->__numBottomHidden++;
		}

		function HideTextBoxButton()
		{
			// Hide the image button
			$this->__hideTextBox = true;
			$this->__numBottomHidden++;
		}

		function HideSymbolButton()
		{
			// Hide the symbol button
			$this->__hideSymbols = true;
			$this->__numBottomHidden++;
		}

		function HidePropertiesButton()
		{
			// Hide the properties button
			$this->__hideProps = true;
			$this->__numBottomHidden++;
		}

		function HideCleanHTMLButton()
		{
			// Hide the clean HTML button
			$this->__hideClean = true;
			$this->__numBottomHidden++;
		}

		function HidePositionAbsoluteButton()
		{
			// Hide the position absolute button
			$this->__hideAbsolute = true;
			$this->__numBottomHidden++;
		}

		function HideGuidelinesButton()
		{
			// Hide the guidelines button
			$this->__hideGuidelines = true;
			$this->__numBottomHidden++;
		}

		function HideToolbarMode()
		{
			// Hide the toolabar mode link
			$this->__hideToolbarMode = true;
			$this->__numBottomHidden++;
		}


		function SetDevEditMode($mode = "advanced")
		{
			if ($this->__modeName=="") {
				$this->__modeName = $mode;
			}
		}

		function DisableComboStyles()
		{
			$this->__comboStyles = false;
		}

		function DisableEditMode()
		{
			// Hide the source mode button
			$this->__disableEditMode = true;
		}

		function DisableSourceMode()
		{
			// Hide the source mode button
			$this->__disableSourceMode = true;
		}

		function DisablePreviewMode()
		{
			// Hide the preview mode button
			$this->__disablePreviewMode = true;
		}

		function EnableGuidelines()
		{
			// Set the table guidelines on by default
			$this->__guidelinesOnByDefault = true;
		}

		function SetPathType($PathType)
		{
			// How do we want to include the path to the images? 0 = Full, 1 = Absolute
			$this->__imagePathType = $PathType;
		}

		function SetDevEditSkin($Path)
		{
			$this->__skinName = $Path;
		}

		function SetDocumentType($DocType)
		{
			// Is the user editing a full HTML document
			$this->__docType = $DocType;
		}

		function SetImageDisplayType($DisplayType)
		{
			// How should the images be displayed in the image manager? 0 = Line / 1 = Thumbnails
			$this->__imageDisplayType = $DisplayType;
		}

		function DisableImageUploading()
		{
			// Do we need to stop images being uploaded?
			$this->__disableImageUploading = 1;
		}

		function DisableLinkUploading()
		{
			// Do we need to stop file being uploaded in the link manager?
			$this->__disableLinkUploading = 1;
		}

		function DisableContextMenu()
		{
			// Do we need to stop context menu appear
			$this->__disableContextMenu = 1;
		}
		
		function DisableImageDeleting()
		{
			// Do we need to stop images from being delete?
			$this->__disableImageDeleting = 1;
		}

		function SetFlashDisplayType($DisplayType)
		{
			//How should the flash files be displayed in the image manager? 0 = Line / 1 = Thumbnails
			$this->__flashDisplayType = $DisplayType;
		}

		function DisableFlashUploading()
		{
			//Do we need to stop flash files being uploaded?
			$this->__disableFlashUploading = 1;
		}

		function DisableFlashDeleting()
		{
			//Do we need to stop flash files from being deleted?
			$this->__disableFlashDeleting = 1;
		}

		function DisableMediaUploading()
		{
			//Do we need to stop flash files being uploaded?
			$this->__disableMediaUploading = 1;
		}

		function DisableMediaDeleting()
		{
			//Do we need to stop flash files from being deleted?
			$this->__disableMediaDeleting = 1;
		}

		function isIE55OrAbove()
		{
			// Is it MSIE?
			$browserCheck1 = ( is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE")) ) ? true : false;

			// Is it NOT Opera?
			$browserCheck2 = ( !is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "Opera")) ) ? true : false;

			// Is it MSIE 5 or above?
			// Modified for v5.0 or above
			$browserCheck3 = ( is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE 5.5")) || is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE 6")) || is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE 7")) ) ? true : false;

			$browserCheck4 = is_numeric(strpos($_SERVER["HTTP_USER_AGENT"], "Windows"));

			if ($browserCheck4 == 0) {
				$browserCheck4 = false;
			} else {
				$browserCheck4 = true;
			}

			if ($browserCheck1 && $browserCheck2 && $browserCheck3 && $browserCheck4) {
				return true;
			} else {
				return false;
			}
		}

		// -------------------------
		// Version 3.0 new functions

		function DisableXHTMLFormatting()
		{
			// Disable XHTML formatting of inline code
			$this->__enableXHTMLSupport = 0;
		}

		function DisableSingleLineReturn()
		{
			// Instead of adding a <p> tag for a new line, add <br> instead
			$this->__useSingleLineReturn = 0;
		}

		function LoadHTMLFromMySQLQuery($DatabaseServer, $DatabaseName, $DatabaseUser, $DatabasePassword, $DatabaseQuery, &$ErrorDesc)
		{
			// Grabs a value from a MySQL database based on a SELECT query.
			// It will return a text value from the field on success, or false on failure
			$sConn = false;
			$dConn = false;
			$mRow = false;
			$mResult = false;

			if (!$sConn = @mysql_connect($DatabaseServer, $DatabaseUser, $DatabasePassword)) {
				// Server connection failed
				$ErrorDesc = mysql_error();
				return false;
			} else {
				// Server connection was successful
				if (! $dConn = @mysql_select_db($DatabaseName, $sConn)) {
					// Database connection failed
					$ErrorDesc = mysql_error();
					return false;
				} else {
					// Database connection was successful
					if (!$mResult = @mysql_query($DatabaseQuery)) {
						// Query Failed
						$ErrorDesc = mysql_error();
						return false;
					} else {
						// Query was OK. Did it return a row?
						if (@mysql_num_rows($mResult) == 0) {
							// No rows returned
							$ErrorDesc = mysql_error();
							return false;
						} else {
							// Grab the first row's contents and return it
							if (!$mRow = mysql_fetch_row($mResult)) {
								// Error returning row
								$ErrorDesc = mysql_error();
								return false;
							} else {
								// Set the contents of the DevEdit control to this value
								$this->SetValue($mRow[0]);
								return true;
							}
						}
					}
				}
			}
		}

		function LoadFromFile($FilePath, &$ErrorDesc)
		{
			$this->__loadedFile = $FilePath;

			// Grabs the contents of a file and sets the value
			// of the DevEdit control to the text in this file
			$fp = false;

			if (!$fp = @fopen($FilePath, "rb")) {
				// Failed to open the file
				$ErrorDesc = "Failed to open file $FilePath";
				return false;
			} else {
				$data = "";
				// File was opened OK, read it in
				while (!feof($fp)) {
					$data .= fgets($fp, 4096);
				}
				// Set the value to the contents of this file
				$this->SetValue($data);
				return true;
			}
		}

		function SaveToFile($FilePath, &$ErrorDesc)
		{
			$fp = false;

			// Writes the contents of the DevEdit control to a file
			if (strlen($this->GetValue(false)) == 0) {
				// No data to write to the file
				$ErrorDesc = "Cannot save an empty value to $FilePath";
				return false;
			} else {
				// The form has been submitted, save its contents
				if (! $fp = @fopen($FilePath, "w")) {
					// Failed to open the file
					$ErrorDesc = "Failed to open file $FilePath";
					return false;
				} else {
					// File was opened OK, write to it
					if (! is_writable($FilePath)) {
						// Can't write to the file
						$ErrorDesc = "You do not have write permissions for $FilePath";
						return false;
					} else {
						if (! fwrite($fp, $this->GetValue(false))) {
							// Failed to write to the file
							$ErrorDesc = "An error occured while writing to $FilePath";
							return false;
						} else {
							// Write went OK
							return true;
						}
					}
				}
			}
		}

		function AddCustomInsert($InsertName, $InsertHTMLCode)
		{
			$this->__hasCustomInserts = true;
			$this->__customInsertArray[] = array("Name" => $InsertName, "HTML" => $InsertHTMLCode);
		}

		function AddCustomLink($LinkName, $LinkURL, $TargetWindow = "")
		{
			$this->__hasCustomLinks = true;
			$this->__customLinkArray[] = array("Name" => $LinkName, "URL" => $LinkURL, "Target" => $TargetWindow);
		}

		function AddImageLibrary($LibraryName, $LibraryPath)
		{
			if (!in_array($LibraryName, $this->__imageLibsArray)) {
				$this->__hasImageLibraries = true;
				$this->__imageLibsArray[] = array($LibraryName, $LibraryPath);
			}
		}

		function AddFlashLibrary($LibraryName, $LibraryPath)
		{
			if (!in_array($LibraryName, $this->__flashLibsArray)) {
				$this->__hasFlashLibraries = true;
				$this->__flashLibsArray[] = array($LibraryName, $LibraryPath);
			}
		}

		function __FormatCustomInsertText()
		{
			// Private Function - This function will return all of the custom inserts as JavaScript arrays
			if ($this->__hasCustomInserts == true) {
				$ciText = "[";

				for ($i = 0; $i < sizeof($this->__customInsertArray); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customInsertArray[$i]["Name"]));
					$html = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customInsertArray[$i]["HTML"]));
					$ciText .= "[\"" . $name . "\", \"" . $html . "\"],";
				}

				$ciText = substr($ciText, 0, strlen($ciText)-1);
				$ciText .= "]";
			} else {
				$ciText = "[]";
			}

			return $ciText;
		}

		function __FormatCustomLinkText()
		{
			// Private Function - This function will return all of the custom links as JavaScript arrays
			if ($this->__hasCustomLinks == true) {
				$ciText = "[";

				for ($i = 0; $i < sizeof($this->__customLinkArray); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["Name"]));
					$url = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["URL"]));
					$target = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["Target"]));
					$ciText .= "[\"" . $name . "\", \"" . $url . "\",\"" . $target . "\"],";
				}

				$ciText = substr($ciText, 0, strlen($ciText)-1);
				$ciText .= "]";
			} else {
				$ciText = "[]";
			}

			return $ciText;
		}

		function __FormatToolbarList()
		{
			if ($this->__toolbarset == true) {
				$ciText = "[";

				for ($i = 0; $i < sizeof($this->__toolbarset); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["Name"]));
					$url = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["URL"]));
					$target = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__customLinkArray[$i]["Target"]));
					$ciText .= "[\"" . $name . "\", \"" . $url . "\",\"" . $target . "\"],";
				}

				$ciText = substr($ciText, 0, strlen($ciText)-1);
				$ciText .= "]";
			} else {
				$ciText = "[]";
			}
			return $ciText;
		}


		function GetImageLibraries()
		{
			// Private Function - This function will return all of the image libraries as JavaScript arrays
			$ciText = "<option value=\"" . $this->__imagePath . "\">" . sTxtDefaultImageLibrary . "</option>";

			if ($this->__hasImageLibraries == true) {
				for ($i = 0; $i < sizeof($this->__imageLibsArray); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__imageLibsArray[$i][0]));
					$dir = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__imageLibsArray[$i][1]));
					$ciText .= "<option value=\"" . $dir . "\">" . $name . "</option>";
				}
			}

			return str_replace("'", "\'", $ciText);
		}

		function GetFlashLibraries()
		{
			// Private Function - This function will return all of the flash libraries as JavaScript arrays
			$ciText = "<option value=\"" . $this->__flashPath . "\">" . sTxtDefaultFlashLibrary . "</option>";

			if ($this->__hasFlashLibraries == true) {
				for ($i = 0; $i < sizeof($this->__flashLibsArray); $i++) {
					$name = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__flashLibsArray[$i][0]));
					$dir = str_replace("\r\n", "\\r\\n", str_replace("\"", "\\\"", $this->__flashLibsArray[$i][1]));
					$ciText .= "<option value=\"" . $dir . "\">" . $name . "</option>";
				}
			}

			return str_replace("'", "\'", $ciText);
		}

		function SetSnippetStyleSheet($StyleSheetURL)
		{
			// Sets the location of the stylesheet for a code snippet
			$this->__docType = DE_DOC_TYPE_SNIPPET;
			$this->__snippetCSS = $StyleSheetURL;
		}

		function SetTextAreaDimensions($Cols, $Rows)
		{
			// Sets the rows and cols attributes of the <textarea> tag that will appear
			// if the client isnt using Internet explorer
			$this->__textareaCols = $Cols;
			$this->__textareaRows = $Rows;
		}

		// End Version 3.0 new functions
		// Version 4.0 new functions

		function SetLanguage($Lang)
		{
			switch ($Lang) {
				case "1":
				{
					$this->__language = "american";
					break;
				}
				case "2":
				{
					$this->__language = "british";
					break;
				}
				case "3":
				{
					$this->__language = "canadian";
					break;
				}
				case "4":
				{
					$this->__language = "french";
					break;
				}
				case "5":
				{
					$this->__language = "spanish";
					break;
				}
				case "6":
				{
					$this->__language = "german";
					break;
				}
				case "7":
				{
					$this->__language = "italian";
					break;
				}
				case "8":
				{
					$this->__language = "portugese";
					break;
				}
				case "9":
				{
					$this->__language = "dutch";
					break;
				}
				case "10":
				{
					$this->__language = "norwegian";
					break;
				}
				case "11":
				{
					$this->__language = "swedish";
					break;
				}
				case "12":
				{
					$this->__language = "danish";
					break;
				}
				default:
				{
					$this->__language = "american";
					break;
				}
			}
		}

		function DisableInsertImageFromWeb()
		{
			$this->__hideWebImage = 1;
		}

		function DisableInsertFlashFromWeb()
		{
			$this->__hideWebFlash = 1;
		}

		function BuildSizeList()
		{
			?><option selected><?php echo sTxtSize; ?></option><?php

			if(sizeof($this->__fontSizeList) >= 1)
			{
				// Build the list of font sizes from the list that the user has specified
				for ($i = 0; $i < sizeof($this->__fontSizeList); $i++) {
					?><option value="<?php echo trim($this->__fontSizeList[$i]); ?>"><?php echo trim($this->__fontSizeList[$i]); ?></option><?php
				}
			} else {
				// Build the list of font sizes manually
				?>
					<option value="1">1</option>
			  		<option value="2">2</option>
			  		<option value="3">3</option>
			  		<option value="4">4</option>
			  		<option value="5">5</option>
			  		<option value="6">6</option>
			  		<option value="7">7</option>
				<?php
			}
		}

		function BuildFontList()
		{
			?><option selected><?php echo sTxtFont; ?></option><?php

			if (sizeof($this->__fontNameList) >= 1) {
				// Build the list of font names from the list that the user has specified
				for($i = 0; $i < sizeof($this->__fontNameList); $i++)
				{
					?><option value="<?php echo trim($this->__fontNameList[$i]); ?>"><?php echo trim($this->__fontNameList[$i]); ?></option><?php
				}
			} else {
				// Build the list of font sizes manually
				?>
					<option value="Times New Roman">Default</option>
					<option value="Arial">Arial</option>
					<option value="Verdana">Verdana</option>
					<option value="Tahoma">Tahoma</option>
					<option value="Courier New">Courier New</option>
					<option value="Georgia">Georgia</option>
				<?php
			}
		}

		function SetFontList($FontList)
		{
			$this->__fontNameList = $FontList;
		}

		function SetFontSizeList($SizeList)
		{
			$this->__fontSizeList = $SizeList;
		}

		// End Version 4.0 new functions

		function ShowControl($Width, $Height, $ImagePath)
		{
			if (!session_id()){
				echo "A PHP Session must be started before DevEdit can be run. Please add a call to session_start() in your PHP script before outputting any HTML.";
				exit();
			}
			global $DE_PATH;

			if (@$_SERVER["HTTPS"] == "on") {
				$GLOBALS['HTTPStr'] = "https";
			} else	{
				$GLOBALS['HTTPStr'] = "http";
			}

			$this->SetWidth($Width);
			$this->SetHeight($Height);

			$_SESSION['RequestedFile'] = $_SERVER["SCRIPT_FILENAME"];

			$this->__imagePath = $ImagePath;

			if (@$_POST[$this->__controlName."_mode"]){
				$this->__modeName = @$_POST[$this->__controlName."_mode"];
			}

			$scriptName = $GLOBALS['DevEditPath'] ."/" . "class.devedit.php";

			// Include the DevEdit language file
			require_once(dirname(__FILE__).'/de_lang/language.php');

			$lastPos = strrpos($GLOBALS['DevEditPath'], "/");
			$deveditroot = substr($GLOBALS['DevEditPath'], 0, $lastPos);

			$ie=(is_numeric(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE")))?true:false;
			if($ie){
				$sPath = "skins/". $this->__skinName. "/";
			} else {
				$sPath = $GLOBALS['HTTPStr'] . '://' . @$_SERVER["HTTP_HOST"] . $GLOBALS['DevEditPath'] .'/skins/'. $this->__skinName . '/';
			}

	$as = "";
	if ($this->__hideSave){
		$as.="Save=". $this->__hideSave ."&amp;";
	}
	if($this->__hideSpelling){
		$as.="Spelling=". $this->__hideSpelling . "&amp;";
	}
	if($this->__hideRemoveTextFormatting){
		$as.="RemoveTextFormatting=" . $this->__hideRemoveTextFormatting . "&amp;";
	}
	if($this->__hideFullScreen){
		$as.="FullScreen=" . $this->__hideFullScreen . "&amp;";
	}
	if($this->__hideBold){
		$as.="Bold=" . $this->__hideBold . "&amp;";
	}
	if ($this->__hideUnderline){
		$as.="Underline=" . $this->__hideUnderline . "&amp;";
	}
	if($this->__hasCustomInserts){
		$as.="Custom=" . $this->__hideCustom . "&amp;";
	} else {
		$as.="Custom=1&amp;";
	}
	if($this->__hideItalic){
		$as.="Italic=" . $this->__hideItalic . "&amp;";
	}
	if($this->__hideStrikethrough){
		$as.="Strikethrough=" . $this->__hideStrikethrough . "&amp;";
	}
	if($this->__hideNumberList){
		$as.="NumberList=" . $this->__hideNumberList . "&amp;";
	}
	if($this->__hideBulletList){
		$as.="BulletList=" . $this->__hideBulletList . "&amp;";
	}
	if($this->__hideDecreaseIndent){
		$as.="DecreaseIndent=" . $this->__hideDecreaseIndent . "&amp;";
	}
	if($this->__hideIncreaseIndent){
		$as.="IncreaseIndent=" . $this->__hideIncreaseIndent . "&amp;";
	}
	if($this->__hideSuperScript){
		$as.="SuperScript=" . $this->__hideSuperScript . "&amp;";
	}
	if($this->__disableContextMenu){
		$as.="disableContextMenu=" . $this->__disableContextMenu . "&amp;";
	}
	if($this->__hideSubScript){
		$as.="SubScript=" . $this->__hideSubScript . "&amp;";
	}
	if($this->__hideLeftAlign){
		$as.="LeftAlign=" . $this->__hideLeftAlign . "&amp;";
	}
	if($this->__hideCenterAlign){
		$as.="CenterAlign=" . $this->__hideCenterAlign . "&amp;";
	}
	if($this->__hideRightAlign){
		$as.="RightAlign=" . $this->__hideRightAlign . "&amp;";
	}
	if($this->__hideJustify){
		$as.="Justify=" . $this->__hideJustify . "&amp;";
	}
	if($this->__hideHorizontalRule){
		$as.="HorizontalRule=" . $this->__hideHorizontalRule. "&amp;";
	}
	if($this->__hideLink){
		$as.="Link=" . $this->__hideLink . "&amp;";
	}
	if($this->__comboStyles){
		$as.="ComboStyles=" . $this->__comboStyles . "&amp;";
	}
	if($this->__hideAnchor){
		$as.="Anchor=" . $this->__hideAnchor . "&amp;";
	}
	if($this->__hideMailLink){
		$as.="MailLink=" . $this->__hideMailLink . "&amp;";
	}
	if($this->__hideHelp){
		$as.="Help=" . $this->__hideHelp . "&amp;";
	}
	if($this->__hideFont){
		$as.="Font=" . $this->__hideFont . "&amp;";
	}
	if($this->__hideSize){
		$as.="Size=" . $this->__hideSize . "&amp;";
	}
	if($this->__hideFormat){
		$as.="Format=" . $this->__hideFormat . "&amp;";
	}
	if($this->__hideCopy){
		$as.="Copy=" . $this->__hideCopy . "&amp;";
	}
	if($this->__hideCut){
		$as.="Cut=" . $this->__hideCut . "&amp;";
	}
	if($this->__hidePaste){
		$as.="Paste=" . $this->__hidePaste . "&amp;";
	}
	if($this->__hideFile){
		$as.="File=" . $this->__hideFile . "&amp;";
	}
	if($this->__hideMedia){
		$as.="Media=" . $this->__hideMedia . "&amp;";
	}
	if($this->__hideStyle){
		$as.="Style=" . $this->__hideStyle . "&amp;";
	}
	if($this->__hideForeColor){
		$as.="ForeColor=" . $this->__hideForeColor . "&amp;";
	}
	if($this->__hideBackColor){
		$as.="BackColor=" . $this->__hideBackColor . "&amp;";
	}
	if($this->__hideTable){
		$as.="Table=" . $this->__hideTable . "&amp;";
	}
	if($this->__hideForm){
		$as.="Form=" . $this->__hideForm . "&amp;";
	}
	if($this->__hideImage){
		$as.="Image=" . $this->__hideImage . "&amp;";
	}
	if($this->__hideFlash){
		$as.="Flash=" . $this->__hideFlash . "&amp;";
	}
	if($this->__hideTextBox){
		$as.="TextBox=" . $this->__hideTextBox . "&amp;";
	}
	if($this->__hideSymbols){
		$as.="Symbols=" . $this->__hideSymbols . "&amp;";
	}
	if($this->__hideProps){
		$as.="Props=" . $this->__hideProps . "&amp;";
	}
	if($this->__hideClean){
		$as.="Clean=" . $this->__hideClean . "&amp;";
	}
	if($this->__hideAbsolute){
		$as.="Absolute=" . $this->__hideAbsolute . "&amp;";
	}
	if($this->__hideGuidelines){
		$as.="Guidelines=" . $this->__hideGuidelines . "&amp;";
	}
	if($this->__disableEditMode){
		$as.="EditMode=" . $this->__disableEditMode . "&amp;";
	}
	if($this->__disableSourceMode){
		$as.="SourceMode=" . $this->__disableSourceMode . "&amp;";
	}
	if($this->__disablePreviewMode){
		$as.="PreviewMode=" . $this->__disablePreviewMode . "&amp;";
	}
	if ($this->__fontSizeList){
		$as.="fontSizeList=" . $this->__fontSizeList . "&amp;";
	}
	if($this->__fontNameList){
		$as.="fontNameList=" . $this->__fontNameList . "&amp;";
	}
	if($this->__imageMaxWidth){
		$as.="maximagewidth=" . $this->__imageMaxWidth . "&amp;";
	}
	if($this->__imageMaxHeight){
		$as.="maximageheight=" . $this->__imageMaxHeight . "&amp;";
	}
	if($this->__maxUploadFileSize){
		$as.="maxUploadFileSize=" . $this->__maxUploadFileSize . "&amp;";
	}
	if($this->__hideToolbarMode){
		$as.="tlbmode=" . $this->__hideToolbarMode . "&amp;";
	}
	if ($this->__setCursor){
		$as.="setCursor=" . $this->__setCursor . "&amp;";
	}
	if($this->__forcePasteWord){
		$as.="forcePasteWord=" . $this->__forcePasteWord . "&amp;";
	}
	if($this->__forcePasteAsText){
		$as.="forcePasteAsText=" . $this->__forcePasteAsText . "&amp;";
	}
	if ($this->__showLineNumber){
		$as.="showLineNumber=" . $this->__showLineNumber . "&amp;";
	}
	if($this->__useSingleLineReturn){
		$as.="SingleLineReturn=" . $this->__useSingleLineReturn . "&amp;";
	}
	if($this->__guidelinesOnByDefault){
		$as.="guidelinesOnByDefault=" . $this->__guidelinesOnByDefault . "&amp;";
	}
	if($this->__docType){
		$as.="docType=" . $this->__docType . "&amp;";
	}
	if($this->__enableXHTMLSupport){
		$as.="useXHTML=" . $this->__enableXHTMLSupport . "&amp;";
	}

	$this->_as = $as;

	$_SESSION["userdocroot"] = $_SERVER['DOCUMENT_ROOT'];
	$_SESSION["dt"] = $this->__dt;
?>
	<link rel="stylesheet" href="<?php echo $GLOBALS['DevEditPath']; ?>/skins/<?php echo $this->__skinName; ?>/styles.css" type="text/css">
	<link rel="stylesheet" href="<?php echo $GLOBALS['DevEditPath']; ?>/skins/<?php echo $this->__skinName; ?>/moz.css" type="text/css">

	<script type="text/javascript">
		var imageLibs = '<?php echo $this->GetImageLibraries(); ?>';
		var skinPath = "skins/<?php echo $this->__skinName; ?>/";
		var wrongBrowserErr = "<?php echo wrongBrowser; ?>";
		var skinPath2 = "<?php echo $GLOBALS['HTTPStr'] . '://' . @$_SERVER["HTTP_HOST"] . $GLOBALS['DevEditPath'] .'/' ;?>skins/<?php echo $this->__skinName; ?>/";
		var doc_root = "<?php echo $GLOBALS['HTTPStr'] . '://' . @$_SERVER["HTTP_HOST"] . $GLOBALS['DevEditPath'] .'/' ?>";
		var gxpbackendPath = '<?php echo $_SESSION['GXPBackendPath']; ?>'
		if (!iepopupstyle) var iepopupstyle = "<?php echo $this->iepopupstyle(); ?>";
		<?php
			echo "var " . $this->__controlName . "=null;";
		?>
		if (!serverurl) var serverurl = new Array();
		if (!customLinks ) var customLinks = new Array();
		if (!customInserts) var customInserts= new Array();
		if (!URL) var URL = new Array();
		if (!imageDir) var imageDir = new Array();
		if (!linkDir) var linkDir = new Array();
		if (!flashDir) var flashDir = new Array();
		if (!mediaDir) var mediaDir = new Array();
		if (!showThumbnails) var showThumbnails = new Array();
		if (!showFlashThumbnails) var showFlashThumbnails = new Array();
		if (!disableImageUploading) var disableImageUploading = new Array();
		if (!disableLinkUploading) var disableLinkUploading = new Array();
		if (!disableImageDeleting) var disableImageDeleting = new Array();
		if (!disableFlashUploading) var disableFlashUploading = new Array();
		if (!disableFlashDeleting) var disableFlashDeleting = new Array();
		if (!disableMediaUploading) var disableMediaUploading = new Array();
		if (!disableMediaDeleting) var disableMediaDeleting = new Array();
		if (!toolbarSet) var toolbarSet = new Array();
		if (!toolbarSetNames) var toolbarSetNames = new Array();
		if (!showLineNumber) var showLineNumber = new Array();

		if (!HideWebImage) var HideWebImage = new Array();
		if (!HideWebFlash) var HideWebFlash = new Array();
		if (!HTTPStr) var HTTPStr = new Array();
		if (!imageLibs) var imageLibs = new Array();
		if (!flashLibs) var flashLibs = new Array();
		if (!myBaseHref) var myBaseHref = new Array();
		if (!deveditPath) var deveditPath = new Array();
		if (!deveditPath1) var deveditPath1 = new Array();
		if (!isEditingHTMLPage) var isEditingHTMLPage = new Array();
		if (!ScriptName) var ScriptName  = new Array();
		if (!re3) var re3 = new Array();
		if (!re4) var re4 = new Array();
		if (!re5) var re5 = new Array();
		if (!pathType) var pathType= new Array();
		if (!skinName) var skinName= new Array();
		if (!snippetCSS) var snippetCSS= new Array();
		if (!snippetCSS2) var snippetCSS2= new Array();
		if (!firsttime) var firsttime=1;
		if (!popup_color_src) var popup_color_src= new Array();
		if (!loadedFile) var loadedFile= new Array();
		if (!additionalButtons) var additionalButtons = new Array();
		if (!eventListener) var eventListener = new Array();
		if (!hideFlashTab) var hideFlashTab = new Array();
		if (!hideMediaTab) var hideMediaTab = new Array();
		if (!hideTagBar) var hideTagBar = new Array();

		// SiteCenter variables
		var remotePath = "<?php echo $this->__remotePath; ?>";
		var startPath = "<?php echo $this->__startPath; ?>";
		var startURL = "<?php echo $this->__startURL; ?>";
		var uploadScriptPath = "<?php echo $this->__uploadScriptPath; ?>";
		var scUserId = "<?php echo $this->__scUserId; ?>";
		showLoadingPleaseWait = "<?php echo $this->__showLoadingPleaseWait; ?>";

		loadedFile["<?php echo $this->__controlName; ?>"] =  '<?php echo $this->__loadedFile; ?>';
		popup_color_src["<?php echo $this->__controlName; ?>"] = "<?php echo $GLOBALS['DevEditPath'];?>/colormenu.php?name=<?php echo $this->__controlName; ?>";
		URL["<?php echo $this->__controlName; ?>"] =  '<?php echo @$_SERVER["HTTP_HOST"]; ?>';
		imageDir["<?php echo $this->__controlName; ?>"] = "<?php echo $ImagePath; ?>";
		flashDir["<?php echo $this->__controlName; ?>"] = "<?php echo $this->__flashPath; ?>";
		mediaDir["<?php echo $this->__controlName; ?>"] = "<?php echo $this->__mediaPath; ?>";
		linkDir["<?php echo $this->__controlName; ?>"] = "<?php	echo $this->__linkPath; ?>";
		showThumbnails["<?php echo $this->__controlName; ?>"] = <?php echo $this->__imageDisplayType; ?>;
		showFlashThumbnails["<?php echo $this->__controlName; ?>"] = <?php echo $this->__flashDisplayType; ?>;
		disableImageUploading["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableImageUploading; ?>;
		disableLinkUploading["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableLinkUploading; ?>;
		showLineNumber["<?php echo $this->__controlName; ?>"] = <?php echo $this->__showLineNumber; ?>;
		hideFlashTab["<?php echo $this->__controlName; ?>"] = <?php echo $this->__hideFlashTab; ?>;
		hideMediaTab["<?php echo $this->__controlName; ?>"] = <?php echo $this->__hideMediaTab; ?>;
		hideTagBar["<?php echo $this->__controlName; ?>"] = <?php echo $this->__hideTagBar; ?>;

		disableImageDeleting["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableImageDeleting; ?>;
		disableFlashUploading["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableFlashUploading; ?>;
		disableFlashDeleting["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableFlashDeleting; ?>;
		disableMediaUploading["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableMediaUploading; ?>;
		disableMediaDeleting["<?php echo $this->__controlName; ?>"] = <?php echo $this->__disableMediaDeleting; ?>;

		HideWebImage["<?php echo $this->__controlName; ?>"] = <?php echo $this->__hideWebImage; ?>;
		HideWebFlash["<?php echo $this->__controlName; ?>"] = <?php echo $this->__hideWebFlash; ?>;
		HTTPStr["<?php echo $this->__controlName; ?>"] = "<?php echo $GLOBALS['HTTPStr']; ?>";
		myBaseHref["<?php echo $this->__controlName; ?>"] = '<?php echo $this->__baseHref; ?>';
		deveditPath["<?php echo $this->__controlName; ?>"] = '<?php echo $GLOBALS['DevEditPath_Full']; ?>';
		deveditPath1["<?php echo $this->__controlName; ?>"] = '<?php echo $GLOBALS['DevEditPath']; ?>';
		isEditingHTMLPage["<?php echo $this->__controlName; ?>"] = <?php echo $this->__docType; ?>;
		ScriptName["<?php echo $this->__controlName; ?>"]  = "<?php echo $scriptName; ?>";
		ScriptName["<?php echo $this->__controlName; ?>"]  = ScriptName["<?php echo $this->__controlName; ?>"].substr(1);

		customLinks["<?php echo $this->__controlName; ?>"] = <?php echo $this->__FormatCustomLinkText(); ?>;
		additionalButtons["<?php echo $this->__controlName; ?>"] = <?php echo $this->__FormatToolbarButtons(); ?>;
		eventListener["<?php echo $this->__controlName; ?>"] = <?php echo $this->__FormatEventListener(); ?>;
		toolbarSet["<?php echo $this->__controlName; ?>"] = new Array();
		toolbarSetNames["<?php echo $this->__controlName; ?>"] = [<?php
			if ($this->__toolbarsetnames == true){
			for ($i = 0 ; $i < sizeof($this->__toolbarsetnames) ; $i++) {
				echo "\"" .$this->__toolbarsetnames[$i] . "\"";
				if ($i!=sizeof($this->__toolbarsetnames)-1) echo ",";
			}
			}
		?>];
		<?php
			foreach ($this->__toolbarset as $p => $v) {
				$s = str_replace(",","','",$v);
				echo "toolbarSet[\"" . $this->__controlName ."\"][\"". $p ."\"] = ['" . $s ."'];\n";
			}
		?>;
		customInserts["<?php echo $this->__controlName; ?>"] = <?php echo $this->__FormatCustomInsertText(); ?>;
		skinName["<?php echo $this->__controlName; ?>"] = '<?php echo $this->__skinName; ?>';
		snippetCSS["<?php echo $this->__controlName; ?>"] = "<?php echo $this->__snippetCSS;?>";
		serverurl["<?php echo $this->__controlName; ?>"] = "<?php echo $GLOBALS['HTTPStr'] . '://' . @$_SERVER["HTTP_HOST"] ;?>";
		var spellLang = "<?php echo $this->__language; ?>";

		re3["<?php echo $this->__controlName; ?>"] =  /src="<?php echo $GLOBALS['HTTPStr']; ?>:\/\/<?php echo '$url'; ?>"/g;
		re4["<?php echo $this->__controlName; ?>"] =  /src="<?php echo $GLOBALS['HTTPStr']; ?>:\/\/<?php echo '$url'; ?>"/g;
		re5["<?php echo $this->__controlName; ?>"] =  /src=http:\/\/<?php echo '$url'; ?>/g;
		pathType["<?php echo $this->__controlName; ?>"] = <?php echo $this->__imagePathType; ?>;

	</script>

	<!-- color menu -->
	<div id="colormenu<?php echo $this->__controlName; ?>" style="position:absolute;left:-500px;top:-500px;visibility:visible"><iframe src="<?php echo $GLOBALS['DevEditPath']; ?>/empty.html" id="color_frame<?php echo $this->__controlName; ?>" frameborder="no" scrolling="no"></iframe></div>

	<div id="_de_popup_container" style="position:absolute;left:-500px;top:-500px;visibility:hidden"></div>
<div style="position:absolute;top:-500px;left:-500px;visibility:hidden;">
	<input type="hidden" name="<?php echo $this->__controlName; ?>_input" id="<?php echo $this->__controlName; ?>_input" value="<?php echo $this->__initialValue; ?>">
	<input type="hidden" name="<?php echo $this->__controlName; ?>_html" id="<?php echo $this->__controlName; ?>_html">
	<input type="hidden" id="<?php echo $this->__controlName; ?>_html2">
	<input type="submit" id="<?php echo $this->__controlName; ?>_save">
	<input type="hidden" id="<?php echo $this->__controlName; ?>_mode" name="<?php echo $this->__controlName; ?>_mode">
</div>
	<table style="<?php echo $this->__styles; ?>" border="0" cellspacing="0" cellpadding="0" id="<?php echo $this->__controlName.'table'; ?>" width="<?php echo $this->__controlWidth;?>" height="<?php echo $this->__controlHeight;?>"><tr><td style="width:100%;height:100%;">
	<div style="width:100%;height:100%;" id="<?php echo $this->__controlName.'main'; ?>">
	<iframe id="<?php echo $this->__controlName.'level0'; ?>" src="<?php echo $GLOBALS['DevEditPath']; ?>/editor.php?mode=<?php echo $this->__modeName;?>&amp;spellLang=<?php echo $this->__language; ?>&amp;name=<?php echo $this->__controlName; ?>&amp;width=<?php echo $Width ; ?>&amp;height=<?php echo $Height; ?>&amp;<?php echo $this->_as; ?>ComboStyles=<?php echo $this->__comboStyles; ?>&amp;sizemode=off&amp;oldw=0&amp;oldh=0&amp;sPath=<?php echo $sPath; ?>&amp;refresh=<?php echo rand(); ?>" width="100%" height="100%" scrolling="no" frameborder="no"></iframe></div></td></tr></table>
	<?php
		}

		function ShowLoadingPleaseWait()
		{
			// Enable the "Loading, Please Wait" message in the image/media/link managers
			$this->__showLoadingPleaseWait = true;
		}

		function OverrideRemoteFilePath($RemotePath)
		{
			// Overwrite the default path to the remote.php file
			$this->__remotePath = $RemotePath;
		}

		function SetStartPath($StartPath)
		{
			// Overwrite the default path to the remote.php file
			$this->__startPath = $StartPath;
		}

		function SetStartURL($StartURL)
		{
			// Overwrite the default path to the remote.php file
			$this->__startURL = $StartURL;
		}

		function SetMediaUploadScriptPath($UploadPath)
		{
			// Set the path to the folder that contains the upload_file.php and upload_image.php files
			$this->__uploadScriptPath = $UploadPath;
		}

		function SetSiteCenterUserId($UserId)
		{
			// Store the users id in the session so we can get their FTP info from the database
			// for file uploading in the media manager
			$this->__scUserId = $UserId;
		}
	}
?>

<html>
<head>
	<title> DevEdit Test -- Default Mode </title>
</head>
<body bgcolor="#FFFFFF" leftMargin=0 topMargin=0 marginheight="0" marginwidth="0" >
<?php include_once("de/class.devedit.php"); ?>

<form action="detest.php" method="post">
<?php

	// Create a new DevEdit class object
	$myDE = new DevEdit;

	// Set the name of this DevEdit class
	$myDE->SetName("myDevEditControl");

	// Set the path to the de folder
	SetDevEditPath("de");

	// Set the path to the folder that contains the flash files for the media manager
	$myDE->SetFlashPath("/");

	// Set the path to the folder that contains the media files for the media manager
	$myDE->SetMediaPath("/");

	// Set the path to the folder that contains the files for the link file manager
	$myDE->SetLinkPath("/");

	// These are the functions that you can call to hide varions buttons,
	// lists and tab buttons. By default, everything is enabled

	//$myDE->HideFullScreenButton();
	//$myDE->HideBoldButton();
	//$myDE->HideUnderlineButton();
	//$myDE->HideItalicButton();
	//$myDE->HideStrikethroughButton();
	//$myDE->HideNumberListButton();
	//$myDE->HideBulletListButton();
	//$myDE->HideDecreaseIndentButton();
	//$myDE->HideIncreaseIndentButton();
	//$myDE->HideLeftAlignButton();
	//$myDE->HideCenterAlignButton();
	//$myDE->HideRightAlignButton();
	//$myDE->HideJustifyButton();
	//$myDE->HideHorizontalRuleButton();
	//$myDE->HideLinkButton();
	//$myDE->HideAnchorButton();
	//$myDE->HideMailLinkButton();
	//$myDE->HideHelpButton();
	//$myDE->HideFontList();
	//$myDE->HideSizeList();
	//$myDE->HideFormatList();
	//$myDE->HideStyleList();
	//$myDE->HideForeColorButton();
	//$myDE->HideBackColorButton();
	//$myDE->HideTableButton();
	//$myDE->HideFormButton();
	//$myDE->HideImageButton();
	//$myDE->HideFlashButton();
	//$myDE->DisableInsertFlashFromWeb();
	//$myDE->HideTextBoxButton();
	//$myDE->HideSymbolButton();
	//$myDE->HidePropertiesButton();
	//$myDE->HideCleanHTMLButton();
	//$myDE->HidePositionAbsoluteButton();
	//$myDE->HideSpellingButton();
	//$myDE->HideRemoveTextFormattingButton();
	//$myDE->HideSuperScriptButton();
	//$myDE->HideSubScriptButton();
	//$myDE->HideGuidelinesButton();
	//$myDE->DisableEditMode();
	//$myDE->DisableSourceMode();
	//$myDE->DisablePreviewMode();
	//$myDE->DisableImageUploading();
	//$myDE->DisableImageDeleting();
	//$myDE->DisableFlashUploading();
	//$myDE->DisableFlashDeleting();
	//$myDE->DisableMediaUploading();
	//$myDE->DisableMediaDeleting();
	//$myDE->DisableXHTMLFormatting();
	//$myDE->DisableSingleLineReturn();
	//$myDE->DisableInsertImageFromWeb();

	//$myDE->HideFileButton();
	//$myDE->HideMediaButton();

	//If you want to use the spell checker, then you can set
	//the spelling language to DE_AMERICAN, DE_BRITISH or DE_CANADIAN,
	//DE_FRENCH, DE_SPANISH, DE_GERMAN, DE_ITALIAN, DE_PORTUGESE,
	//DE_DUTCH, DE_NORWEGIAN, DE_SWEDISH or DE_DANISH
	$myDE->SetLanguage(DE_AMERICAN);

	// Set skin path - choose between default and xp
	$myDE->SetDevEditSkin("default");

	// Set mode to default to when starting up - Choose between complete and simple.\
	// User can switch between these.
	$myDE->SetDevEditMode("Complete");

	//We can specify a list of fonts for the font drop down. If we don't,
	//then a default list will show
	//$myDE->SetFontList("Arial,Verdana");

	//We can specify a list of font sizes for the font size drop down. If we don't,
	//then a default list will show
	//$myDE->SetFontSizeList("8,10");

	//How do we want images to be inserted into our HTML content?
	//DE_PATH_TYPE_FULL will insert a image in this format: http://www.mysite.com/test.html
	//DE_PATH_TYPE_ABSOLUTE will insert a image in this format: /myimage.gif
	$myDE->SetPathType(DE_PATH_TYPE_ABSOLUTE);

	//Are we editing a full HTML page, or just a snippet of HTML?
	//DE_DOC_TYPE_HTML_PAGE means we're editing a complete HTML page
	//DE_DOC_TYPE_SNIPPET means we're editing a snippet of HTML
	$myDE->SetDocumentType(DE_DOC_TYPE_HTML_PAGE);

	//Do we want images to appear in the image manager as thumbnails or just in rows?
	//DE_IMAGE_TYPE_ROW means just list in a tabular format, without a thumbnail
	//DE_IMAGE_TYPE_THUMBNAIL means list in 4-per-line thumbnail mode
	$myDE->SetImageDisplayType(DE_IMAGE_TYPE_THUMBNAIL);

	//Do we want flash files to appear in the flash manager as thumbnails or just in rows?
	//DE_FLASH_TYPE_ROW means just list in a tabular format, without a thumbnail
	//DE_FLASH_TYPE_THUMBNAIL means list in 4-per-line thumbnail mode
	$myDE->SetFlashDisplayType(DE_FLASH_TYPE_THUMBNAIL);

	//Show table guidelines as dashed
	$myDE->EnableGuidelines();

	// Add some custom links that will appear in the link manager
	$myDE->AddCustomLink("DevEdit", "http://www.devedit.com");
	$myDE->AddCustomLink("Interspire", "http://www.interspire.com", "_new");

	//Set the initial HTML value of our control
	// $myDE->SetValue('&copy; &trade; <');

	// $myDE->SetValue('Non editable <!-- #BeginEditable "content" --> Editable Area<!-- #EndEditable --> non editable');

	// Use the LoadHTMLFromMySQLQuery function to load a value based on a query
	// $errDesc = "";
	// $myDE->LoadHTMLFromMySQLQuery("localhost", "testdatabase", "admin", "password", "select bContent from blah limit 1", $errDesc);
	// if($errDesc != "")
	// { echo "An error occured: $errDesc"; }

	// Use the LoadFromFile function to load a complete text file
	// $errDesc = "";
	$myDE->LoadFromFile("devedit_demo.html"  , $errDesc);
	// if($errDesc != "")
	// { echo "An error occured: $errDesc"; }

	// Use the SaveToFile function to save the contents of the DevEdit control to a text file
	// $errDesc = "";
	// $myDE->SaveToFile("c:\test.html", $errDesc);
	// if($errDesc != "")
	// { echo "An error occured: $errDesc"; }

	 //$myDE->SetSnippetStyleSheet("/detest_style_sample.css");
	// $myDE->SetSnippetStyleSheet("http://localhost/devedit/detest_style_sample.css");

	// Use the AddCustomInsert function to add some custom inserts
	//$myDE->AddCustomInsert("DevEdit Logo", "<img src='http://www.interspire.com/media/images/logo.gif'>");
	//$myDE->AddCustomInsert("Red Text", "<font face='verdana' color='red' size='3'><b>Red Text</b></font>");

?>
<?php
	//Display the DevEdit control. This *MUST* be called between <form> and </form> tags
	$myDE->ShowControl("500px", "400px", "/images");
	//Display the rest of the form
	?>
	<br>
		<input type="button" value="Get HTML Content" onClick="alert(myDevEditControl.getHTMLContent());">
		<input type="button" value="Get Text Content" onClick="alert(myDevEditControl.getTextContent());">
		<input type="button" value="Write Content" onClick="javascript:var p= prompt('Enter html code:','');if(p)myDevEditControl.writeContent(p);">
		<input type="button" value="Insert HTML at Cursor" onClick="javascript:var p= prompt('Enter html code:','');if(p)myDevEditControl.insertHTML(p);">
		<input type="submit" value="Get HTML >>"><br><br>
		<textarea cols="80" rows="10"><?php

			//Once the form has been submitted, GetValue will return the HTML code.
			//GetValue accepts 1 parameter, and this specifies whether to convert
			// from ' to '' and " to "". If you want to save the HTML to a database,
			//pass true to the GetValue function. If not, pass false.
			echo $myDE->GetValue(false);

		?></textarea>
	</form>

</body>
</html>

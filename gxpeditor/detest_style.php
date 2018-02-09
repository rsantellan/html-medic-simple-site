<html>
<head>
	<title> DevEdit Test -- Snippets and Stylesheets </title>
</head>
<body bgcolor="#ffffff">

<?php //Include the DevEdit class file ?>
<?php include_once("de/class.devedit.php"); ?>

<form action="detest_style.php" method="post">
<?php

	// Create a new DevEdit class object
	$myDE = new devedit;

	// Set the name of this DevEdit class
	$myDE->SetName("myDevEditControl");

	// Set the path to the de folder
	SetDevEditPath("de");

	// Set the editor to snippet mode (i.e. edit a piece of a HTML page
	// and not a whole page with HTML and BODY tags etc)
	$myDE->SetDocumentType(DE_DOC_TYPE_HTML_PAGE);

	// Setup an external stylesheet (note that this stylesheet MUST be
	// on the same domain as where DevEdit is installed)
	 $myDE->SetSnippetStyleSheet("detest_style_sample.css");

	$myDE->EnableGuidelines();

	// Set the initial HTML value of our control
	$val = "";

	// If the form has been submitted, show that value. If not, generate a value
	if($myDE->GetValue(false) != "")
		$val = $myDE->GetValue(false);
	else
	{
		$val = "<style>.sampleStyle1 { border: 5px solid; } </style><span class=sampleStyle1>This is sample font #1</span><br><br>";
		$val .= "<span class=sampleStyle2>This is sample font #2</span><br><br>";
	}

	$myDE->SetValue($val);

	// Use the AddImageLibrary function to add image libraries
	$myDE->AddImageLibrary("Image Library #1", "/test_images");

	// Use the AddFlashLibrary function to add flash libraries
	$myDE->AddFlashLibrary("Flash Library #1", "/test_flash");

	$myDE->SetDevEditSkin("default");

	// Display the DevEdit control. This *MUST* be called between <form> and </form> tags
	$myDE->ShowControl("800px", "300px", "/");

	//Display the rest of the form
	?>
		<br><br>
		<input type="submit" value="Get HTML >>"><br><br>
		<textarea cols="100" rows="10"><?php echo $myDE->GetValue(false); ?></textarea>
	</form>
</body>
</html>
<html>
<head>
	<title> DevEdit Test -- Multiple Instances </title>
</head>
<body bgcolor="#ffffff">

<?php //Include the DevEdit class file ?>
<?php include_once("de/class.devedit.php"); ?>

<form action="detest_multi.php" method="post">
<?php
	
	// This sample page shows DevEdit with 3 controls on
	// the one page

	// Set the path to the de folder
	SetDevEditPath("de");


	// Create DevEdit class #1
	$myDE1 = new DevEdit;
	$myDE1->SetName("myDevEditControl1");
	$myDE1->SetValue("<style>.test { color: red }; </style>");
	$myDE1->EnableGuidelines();
	$myDE1->ShowControl("90%", "200px", "/");

	// Create DevEdit class #2
	$myDE2 = new DevEdit;
	$myDE2->SetName("myDevEditControl2");
	$myDE2->SetValue(@$myDE2->GetValue(false));
	$myDE2->EnableGuidelines();
	$myDE2->ShowControl("500px", "400px", "/deveditnx40");

	// Create DevEdit class #3
	$myDE3 = new DevEdit;
	$myDE3->SetName("myDevEditControl3");
	$myDE3->SetValue(@$myDE3->GetValue(false));
	$myDE3->EnableGuidelines();
	$myDE3->ShowControl("100%", "300px", "/");
	
	//Display the rest of the form
	?>
		<br><br>
		<input type="submit" value="Get HTML >>"><br><br>
		Value from DevEdit control #1:<br>
		<textarea cols="100" rows="10"><?php
		
			echo $myDE1->GetValue(false);
		
		?></textarea>
		<hr>
		Value from DevEdit control #2:<br>
		<textarea cols="100" rows="10"><?php
		
			echo $myDE2->GetValue(false);
		
		?></textarea>
		<hr>
		Value from DevEdit control #3:<br>
		<textarea cols="100" rows="10"><?php
		
			echo $myDE3->GetValue(false);
		
		?></textarea>
		<hr>
	</form>
</body>
</html>
<?php

	@ini_set("track_errors", "1");
	@session_start();

	if(isset($_REQUEST["panel"]))
		$panel = $_REQUEST["panel"];
	else
		$panel = "form";

	$objFileUpload = new FileUpload($panel);

	class FileUpload
	{
		function FileUpload($Panel = "form")
		{
			switch($Panel)
			{
				case "form":
				{
					$this->ShowForm();
					break;
				}
				case "upload":
				{
					$this->UploadFiles();
					break;
				}
			}
		}

		function _Safe($Path)
		{
			$path = $Path;
			$path = eregi_replace("[.]+/", "", $path);
			return $path;
		}

		function _ValidMIMETypes()
		{
			// Return a list of valid image extensions
			return array("application/pdf", "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/html", "text/plain", "image/gif", "image/jpeg", "image/pjpeg", "image/bmp", "image/tiff", "image/png");
		}

		function UploadFiles()
		{
			// Upload images from the image manager
			global $php_errormsg;

			$mimeTypes = $this->_ValidMIMETypes();
			$path = $_POST["path"];
			$numFiles = 0;
			$numDone = 0;

			$maxUploadFileSize = 0;
			if(isset($_POST["maxUploadFileSize"]))		
				$maxUploadFileSize = $_POST["maxUploadFileSize"]*1.0;
		
			// Make sure the images are being uploaded from the image manager
			if (!isset($_SERVER['REQUEST_URI']) || $_SERVER['REQUEST_URI'] == '') {
				$_SERVER['REQUEST_URI'] = $_SERVER["SCRIPT_NAME"] .
				$_SERVER['QUERY_STRING'];
			}
			$dir = $_SERVER["REQUEST_URI"];
			$dir = str_replace("panel=upload", "panel=form", $dir);

			$ref1 = sprintf("http://%s%s", $_SERVER["HTTP_HOST"], $dir);
			$ref2 = sprintf("https://%s%s", $_SERVER["HTTP_HOST"], $dir);

			if($_SERVER["HTTP_REFERER"] == $ref1 || $_SERVER["HTTP_REFERER"] == $ref2)
			{
				// Make sure the path contains the document root and is safe
				$path = $this->_Safe($path);

				if((int)strpos($_SERVER["DOCUMENT_ROOT"], $path) == 0)
				{
					if(sizeof($_FILES) > 0)
					{
						// Check each of the possible 3 images
						foreach($_FILES as $file)
						{
							if($file["name"] != "" && $file["size"] > 0)
							{
								$fname = $file["name"];
								if(in_array($file["type"], $mimeTypes))
								{
									$numFiles++;

									$dest = sprintf("%s/%s", $path, $file["name"]);
									$dest = eregi_replace("/{2,}", "/", $dest);

									if (isset($maxUploadFileSize) && $maxUploadFileSize>0  && filesize($file["tmp_name"])>$maxUploadFileSize*1024) {
										$php_errormsg = "File size should be less than ".$maxUploadFileSize." kb.";
										continue;
									}

									if (!is_writable($path)) {
										$php_errormsg = "Destination ($path) isn't writable. Please check image folder has write permissions.";
										continue;
									}

									if(@move_uploaded_file($file["tmp_name"], $dest)){
										$numDone++;
										chmod($dest, 0644);
									}
								}
							}
						}

						if ($numFiles){
						if($numFiles == $numDone)
						{
							if($numFiles == 1)
								$msg = sprintf("'%s' has been uploaded successfully!", $fname);
							else
								$msg = sprintf("%d images have been uploaded successfully!", $numDone);
						}
						else
						{
							if($numFiles == 1)
								$msg = sprintf("An error occured while trying to upload '%s': %s", $fname, $php_errormsg);
							else
								$msg = sprintf("An error occured while trying to upload the selected files: %s", $php_errormsg);
						}
						}

						?>
							<html>
								<body style="background-color: #FCFCFE; margin:0px">
									<div id="msg" style="width: 100%; height: 100%; border: solid 1px gray; padding: 20px 0px 0px 15px; background-color: #FFFFEE; z-index: 100; font-family: Arial; font-size: 11px">
										<img src="../images/exclamation.gif" align="left" hspace="10" style="margin-top:-2px">
										Uploading files. Please wait...
									</div>
									<script>

										// Show the message
										alert("<?php echo $msg; ?>");

										// Refresh the image list
										parent.ChangeFolder("");

										// Reload the frame
										window.setTimeout('document.location.href = "upload_file.php?panel=form";', 1000);

									</script>
								</body>
							</html>
						<?php
					}
					else
					{
						$this->ShowForm();
					}
				}
			}
		}

		function ShowForm()
		{
		?>
			<html>
			<head>
				<script>

					function MoreFiles(Lnk)
					{
						var fileDiv = document.getElementById("files");
						var iFrm = parent.document.getElementById("iFrm");
						var list = parent.document.getElementById("list");
						var customLinks = parent.customLinks;

						fileDiv.style.display = "";
						iFrm.style.height = 82;
						Lnk.style.display = "none";

						if(customLinks == 0)
						{
							if(navigator.userAgent.indexOf('MSIE') > -1)
								list.style.height = 178;
							else
								list.style.height = 183;
						}
						else
						{
							list.style.height = 150;
						}

						document.getElementById("file1").focus();
					}

					function CheckForm()
					{
						var msg = document.getElementById("msg");
						var iFrm = parent.document.getElementById("iFrm");
						var list = parent.document.getElementById("list");
						var i1 = document.getElementById("file1");
						var i2 = document.getElementById("file2");
						var i3 = document.getElementById("file3");
						var fileList = parent.fileList;
						var fileTypes = parent.fileTypes;
						var path = document.getElementById("path");
						var pPath = parent.pPath;

						// Make sure at least one image is being uploading
						if(i1.value != "" || i2.value != "" || i3.value != "")
						{
							// Check if the image(s) already exists
							for(i = 1; i <4; i++)
							{
								fName = eval("i"+i+".value");

								if(fName.length > 0)
								{
									// Check for a valid extension
									tmp = fName.split(".");
									ext = tmp[tmp.length-1].toLowerCase();

									if(fileTypes.indexOf(ext) == -1)
									{
										// Bad file type!
										alert("The file type you have tried to upload isn\'t allowed. The following file types can be uploaded: "+fileTypes+".");
										eval("i"+i+".focus();");
										eval("i"+i+".select();");
										return false;
									}

									// Make sure it doesn't already exist
									for(j = 0; j < fileList.length; j++)
									{
										tmp = fName.replace("/", "\\");
										tmp = tmp.split("\\");
										file = tmp[tmp.length-1];

										if(fileList[j] == file)
										{
											if(!confirm("The file '"+file+"' already exists. Are you sure you want to overwrite it? Click OK to confirm."))
											{
												eval("i"+i+".focus();");
												eval("i"+i+".select();");
												return false;
											}
										}
									}
								}
							}

							// Display a notification
							iFrm.style.width = 225;
							iFrm.style.height = 55;
							msg.style.display = "";

							// Set the image upload path
							path.value = pPath;

							return true;
						}
						else
						{
							alert("Please choose at least one file to upload.");
							i1.focus();
							return false;
						}
					}

				</script>
				<style>

					a
					{
						color: gray;
						font-family: Arial;
						font-size: 11px;
					}

				</style>
				<script>
					function init(){
						document.getElementById("maxUploadFileSize").value = parent.maxUploadFileSize;
					}
				</script>
			</head>
			<body style="background-color: #FCFCFE; margin:0px" onload="init();">
				<div id="msg" style="display: none; width: 100%; height: 100%; border: solid 1px gray; padding: 20px 0px 0px 15px; background-color: #FFFFEE; z-index: 100; font-family: Arial; font-size: 11px">
					<img src="../images/exclamation.gif" align="left" hspace="10" style="margin-top:-2px">
					Uploading files. Please wait...
				</div>
				<div>
					<form onSubmit="return CheckForm()" style="margin:0px" action="<?php echo $_SERVER["PHP_SELF"]; ?>?panel=upload" method="post" enctype="multipart/form-data">
						<input type="hidden" id="path" name="path" value="">
						<input type="hidden" id="maxUploadFileSize" name="maxUploadFileSize" value="">						
						<div style="font-family: Arial; font-size: 11px">Upload File:<br></div>
						<input id="file1" name="file1" type="file" style="width:195px; font-family: Arial; font-size: 11px"><input type="submit" value="Go" style="font-family: Arial; font-size: 11px; width:30px; height: 20px" title="Upload multiple files"><br>
						<div>
							<a href="javascript:void(0)" onClick="MoreFiles(this)">[Upload more files]</a>
						</div>
						<div id="files" style="display:none">
							<input id="file2" name="file2" type="file" style="width:195px; font-family: Arial; font-size: 11px"><br>
							<input id="file3" name="file3" type="file" style="width:195px; font-family: Arial; font-size: 11px">
						</div>
					</form>
				</div>
			</body>
			</html>
		<?php
		}
	}

?>


<?php

	@ini_set("track_errors", "1");
	@session_start();

	if(isset($_REQUEST["panel"]))
		$panel = $_REQUEST["panel"];
	else
		$panel = "form";

	$objImgUpload = new ImageUpload($panel);

	class ImageUpload
	{
		function ImageUpload($Panel = "form")
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
					$this->UploadImages();
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
			return array("image/gif", "image/jpeg", "image/jpg", "image/pjpeg", "image/bmp", "image/tiff", "image/png", "image/x-png",	"video/mpeg","video/mpg","video/m1v","video/avi","audio/mpeg", "video/wmv","music/mp2", "music/mpa","music/mpe","music/wav","music/mp3","music/wma","audio/mp2", "audio/mpa","audio/mpe","audio/wav","audio/mp3","audio/wma","mov file/mov","midi file/midi","application/x-shockwave-flash", "video/x-ms-wmv","video/x-msvideo","video/x-ms-asf","video/quicktime","video/mpeg");
		}

		function _resizeImage($src, $dst){
			if (! extension_loaded('gd')) { return false; }

			$filename = $src;

			// Set a maximum height and width
			$width = $_POST["imagewidth"];
			$height = $_POST["imageheight"];

			if ($width==0 && $height==0) return false;

			// Get new dimensions
			list($width_orig,$height_orig,$otype)=@getimagesize($filename);

			if ($width_orig<=$width && $height_orig<=$height) return false;

			if ($width && ($width_orig < $height_orig)) {
				$width = ($height / $height_orig) * $width_orig;
			} else {
				$height = ($width / $width_orig) * $height_orig;
			}

			// Resample
			$image_p = imagecreatetruecolor($width, $height);

			switch($otype) {
				case 1:  $image = imagecreatefromgif($filename); break;
				case 2:  $image = imagecreatefromjpeg($filename); break;
				case 3:  $image = imagecreatefrompng($filename); break;
				default: return false;
			}

			imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);

			switch($otype) {
				case 1: imagegif($image_p,$dst); break;
				case 2: imagejpeg($image_p,$dst,100); break;
				case 3: imagepng($image_p,$dst);  break;
			}
			return true;
		}

		function UploadImages()
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
			$dir = str_replace("panel=upload", "?panel=form", $dir);

			$ref1 = sprintf("http://%s%s", $_SERVER["HTTP_HOST"], $dir);
			$ref2 = sprintf("https://%s%s", $_SERVER["HTTP_HOST"], $dir);

			$ref1 = eregi_replace("\?{2,}", "?", $ref1);
			$ref2 = eregi_replace("\?{2,}", "?", $ref2);

			if($_SERVER["HTTP_REFERER"] == $ref1 || $_SERVER["HTTP_REFERER"] == $ref2)
			{
				// Make sure the path contains the document root and is safe
				$path = $this->_Safe($path);

				if(sizeof($_FILES) > 0)
					{

						// Check each of the possible 3 images
						foreach($_FILES as $file)
						{
							if($file['error'] != UPLOAD_ERR_OK) {
								if ($file['error'] == UPLOAD_ERR_INI_SIZE) {
									echo "The file was larger than PHP will accept, based on the upload_max_filesize configuration directive<br>";
									echo ini_get("upload_max_filesize");
								}
							}

							if($file["name"] != "" && $file["size"] > 0)
							{
								$fname = $file["name"];
								if(in_array($file["type"], $mimeTypes))
								{
									$numFiles++;

									$dest = sprintf("%s/%s", $path, $file["name"]);
									$dest = eregi_replace("/{2,}", "/", $dest);

									if (isset($maxUploadFileSize) && $maxUploadFileSize>0 && filesize($file["tmp_name"])>$maxUploadFileSize*1024) {
										$php_errormsg = "File size should be less than ".$maxUploadFileSize." kb.";
										continue;
									}

									if (!is_writable($path)) {
										$php_errormsg = "Destination ($path) isn't writable. Please check image folder has write permissions.";
										continue;
									}
									if ($this->_resizeImage($file["tmp_name"],$dest)){
										$numDone++;
									} else {
										if(@move_uploaded_file($file["tmp_name"], $dest))
											$numDone++;
									}
									chmod($dest, 0644);
								}
							}
						}

						if($numFiles == $numDone)
						{
							if($numFiles == 1)
								$msg = sprintf("'%s' has been uploaded successfully!", $fname);
							else
								$msg = sprintf("%d files have been uploaded successfully!", $numDone);
						}
						else
						{
							if($numFiles == 1)
								$msg = sprintf("An error occured while trying to upload '%s': %s", $fname, $php_errormsg);
							else
								$msg = sprintf("An error occured while trying to upload the selected files: %s", $php_errormsg);
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
										window.setTimeout('document.location.href = "upload_image.php?panel=form";', 1000);

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
						var imageLibs = parent.imageLibs;

						fileDiv.style.display = "";
						iFrm.style.height = 82;
						Lnk.style.display = "none";

						if(imageLibs == 0)
							list.style.height = 286;
						else
							list.style.height = 259;

						document.getElementById("image1").focus();
					}

					function CheckForm()
					{
						var msg = document.getElementById("msg");
						var iFrm = parent.document.getElementById("iFrm");
						var list = parent.document.getElementById("list");
						var i1 = document.getElementById("image1");
						var i2 = document.getElementById("image2");
						var i3 = document.getElementById("image3");
						var fileList = parent.fileList;
						var imageTypes = parent.imageTypes;
						var path = document.getElementById("path");
						var pPath = parent.pPath;

						document.getElementById("imagewidth").value = parent.imagewidth;
						document.getElementById("imageheight").value = parent.imageheight;

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

									if(imageTypes[parent.jsobj].indexOf(ext) == -1)
									{
										// Bad file type!
										alert("The file type you have tried to upload isn\'t allowed. The following file types can be uploaded: "+imageTypes[parent.jsobj]+".");
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
							iFrm.style.height = 55;
							list.style.height = 286;
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
			<body style="background-color: #FCFCFE; margin:0px" onload="init()">
				<div id="msg" style="display: none; width: 100%; height: 100%; border: solid 1px gray; padding: 20px 0px 0px 15px; background-color: #FFFFEE; z-index: 100; font-family: Arial; font-size: 11px">
					<img src="../images/exclamation.gif" align="left" hspace="10" style="margin-top:-2px">
					Uploading images. Please wait...
				</div>
				<div>
					<form onSubmit="return CheckForm()" style="margin:0px" action="<?php echo $_SERVER["PHP_SELF"]; ?>?panel=upload" method="post" enctype="multipart/form-data">
						<input type="hidden" name="MAX_FILE_SIZE" value="104857600">
						<input type="hidden" id="maxUploadFileSize" name="maxUploadFileSize" value="">
						<input type="hidden" id="path" name="path" value="">
						<input type="hidden" id="imagewidth" name="imagewidth" value="">
						<input type="hidden" id="imageheight" name="imageheight" value="">
						<div style="font-family: Arial; font-size: 11px">Upload File:<br></div>
						<input id="image1" name="image1" type="file" style="width:230px; font-family: Arial; font-size: 11px"><input type="submit" value="Go" style="font-family: Arial; font-size: 11px; width:30px; height: 20px" title="Upload multiple files"><br>
						<div>
							<a href="javascript:void(0)" onClick="MoreFiles(this)">[Upload more images]</a>
						</div>
						<div id="files" style="display:none">
							<input id="image2" name="image2" type="file" style="width:230px; font-family: Arial; font-size: 11px"><br>
							<input id="image3" name="image3" type="file" style="width:230px; font-family: Arial; font-size: 11px">
						</div>
					</form>
				</div>
			</body>
			</html>
		<?php
		}
	}
?>
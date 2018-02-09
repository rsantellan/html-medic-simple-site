<?php

	/**
	* ValidExtensions
	* Return an array of valid extensions (in lowercase) for given a particular class of file
	*
	* @return array
	*/
	function ValidExtensions($class="all")
	{
		$images		= array("bmp", "gif", "jpg", "png", "tif", "tiff");
		$flash		= array("swf");
		$media		= array("mpeg","mpg","m1v","mp2", "mpa","mpe","avi","wmv","wav","mp3","wma","mov","midi");
		$docs		= array("pdf","doc","xls","ppt","pps","htm","html", "txt", "php", "asp", "shtml");
		$archives	= array("zip", "rar");

		switch($class) {
			case "image":
				return $images;
				break;
			case "flash":
				return $flash;
				break;
			case "media":
				return $media;
				break;
			case "docs":
				return $docs;
				break;
			case "archives":
				return $archives;
				break;
			case "all":
				return array_merge($images, $flash, $media, $docs, $archives);
				break;
		}
	}
?>

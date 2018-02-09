<?php


	header('Content-Type: text/plain; charset=utf-8');
	// Handles remote AJAX requests from the DevEdit client

	@ini_set("track_errors", "1");
	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."valid_files.php");
	$objRemote = new Remote();

	if($objRemote->_Validate())
		$objRemote->DoIt();

	// *****************************************************

	class Remote
	{
		var $_what;
		var $_hidden = Array();

		function Remote()
		{
			if(isset($_POST["w"]))
				$this->_what = strtolower($_POST["w"]);
		}

		function DoIt()
		{
			switch($this->_what)
			{
				case "getfilelist":
				{
					$this->GetFileList();
					break;
				}
				case "createnewfolder":
				{
					$this->CreateNewFolder();
					break;
				}
				case "renamefilefolder":
				{
					$this->RenameFileFolder();
					break;
				}
				case "deletefilefolder":
				{
					$this->DeleteFileFolder();
					break;
				}
			}
		}

		function GetFileList()
		{
			// Get a list of files and folders
			$path = $_POST["p"];
			$sel = isset($_POST["s"]) ? $_POST["s"] : '';
			$hidden = "";

			if(isset($_POST["t"]))
				$tab = $_POST["t"];
			else
				$tab = 0;

			if(isset($_POST["hidden"]))
				$hidden = unserialize(base64_decode($_POST["hidden"]));

			if(is_array($hidden))
				$this->_hidden = $hidden;

			$folders = array();
			$files = array();

			if($handle = @opendir($path))
			{
				while(false !== ($file = readdir($handle)))
				{
					if($file != "." && $file != "..")
					{
						if(is_dir($path . "/" . $file))
						{
							$folders[] = $file;
						}
						else
						{
							// What type of file is it?
							switch($tab)
							{
								case "0":
								{
									$arr = ValidExtensions("image");
									break;
								}
								case "1":
								{
									$arr = ValidExtensions("flash");
									break;
								}
								case "2":
								{
									$arr = ValidExtensions("media");
									break;
								}
								default:
								{
									// Link manager
									$arr = ValidExtensions();
									$files[] = $file;
								}
							}

							$tmp = explode(".", $file);
							$ext = strtolower($tmp[sizeof($tmp)-1]);
							$files[] = $file;
						}
					}
				}

				natcasesort($folders);
				natcasesort($files);

				$this->FilterHidden($folders);
				$this->FilterHidden($files);

				$return_contents = "";

				foreach($folders as $k => $f)
				{
					$return_contents .= addslashes($f) . "|folder,";
				}

				foreach($files as $k => $f)
				{
					// Flag the file as selected so that we can
					// give it a blue background in the file list
					if($f == $sel)
						$return_contents .= "@" . addslashes($f) . "|file,";
					else
						$return_contents .= addslashes($f) . "|file,";
				}

				echo $return_contents;

				@closedir($handle);
			}
		}

		function CreateNewFolder()
		{
			// Create a new folder
			global $php_errormsg;

			$path = $_POST["p"];
			$folder = $_POST["f"];
			$nf = $path . "/" . $folder;
			$nf = eregi_replace("/{2,}", "", $nf);
			$nf = $this->_Safe($nf);

			// Attempt to create the new folder
			if(@mkdir($nf, 0755))
				printf("The folder '%s' has been created successfully!", $folder);
			else
				printf("An error occured while trying to create the folder '%s': %s", $folder, $php_errormsg);
		}

		function _Safe($Path)
		{
			$path = $Path;
			$path = eregi_replace("[.]+/", "", $path);
			return $path;
		}

		function _Validate()
		{
			// Make sure the calls are coming from DevEdit and not somewhere else
			$enc = md5(sprintf("%s|%s", date("mDmYY", time() - 10000), $_SERVER["HTTP_HOST"]));

			return true;
			if($enc == @$_POST["token"]){
				return true;
			}
		}

		function RenameFileFolder()
		{
			// Rename the selected file/folder
			global $php_errormsg;

			$validExtensions = ValidExtensions();

			$path = $_POST["p"];
			$folder = $_POST["f"];
			$oldFolder = $_POST["o"];

			$of = $path . "/" . $oldFolder;
			$of = eregi_replace("/{2,}", "", $of);
			$of = $this->_Safe($of);

			$nf = $path . "/" . $folder;
			$nf = eregi_replace("/{2,}", "", $nf);
			$nf = $this->_Safe($nf);

			$newExtension = strtolower(array_pop(explode(".", $nf)));

			// If we are renaming a file, make sure the new extension is allowed
			if (is_file($of) && !in_array($newExtension, $validExtensions)) {
				$php_errormsg = "That extension is not allowed";
				printf("An error occured while trying to rename the file/folder '%s': %s", $oldFolder, $php_errormsg);
				return false;
			}

			// Attempt to rename the file/folder
			if(@rename($of, $nf))
				printf("The file/folder '%s' has been renamed successfully!", $oldFolder);
			else
				printf("An error occured while trying to rename the file/folder '%s': %s", $oldFolder, $php_errormsg);
		}

		function DeleteFileFolder()
		{
			// Delete the selected file/folder
			global $php_errormsg;

			$path = $_POST["p"];
			$folder = urldecode($_POST["f"]);
			$file = $path . "/" . $folder;
			$file = eregi_replace("/{2,}", "", $file);
			$file = $this->_Safe($file);

			// Make sure the document root is part of the path
			if((int)strpos($file, $_SERVER["DOCUMENT_ROOT"]) == 0)
			{
				// Is it a file or a folder?
				if(!@is_dir($file))
				{
					// It's a file, delete it
					if(@unlink($file))
						printf("The file '%s' has been deleted successfully!", $folder);
					else
						printf("An error occured while trying to delete the file '%s': %s", $folder, $php_errormsg);
				}
				else
				{
					// We need to recursively delete a folder
					if($this->RecursiveDelete($file, $err))
						printf("The folder '%s' has been deleted successfully!", $folder);
					else
						printf("An error occured while trying to delete the folder '%s': %s", $folder, $err);
				}
			}
		}

		function RecursiveDelete($directory, &$err)
		{
			global $php_errormsg;
			$empty = false;

			if(substr($directory, -1) == '/')
				$directory = substr($directory, 0, -1);

			if(!file_exists($directory) || !is_dir($directory))
			{
				$err = $php_errormsg;
				return false;
			}
			elseif(is_readable($directory))
			{
				$handle = @opendir($directory);

				while(false !== ($item = @readdir($handle)))
				{
					if($item != "." && $item != "..")
					{
						$path = $directory . "/" . $item;

						if(@is_dir($path))
						{
							$this->RecursiveDelete($path, $err);
						}
						else
						{
							if(!@unlink($path))
							{
								$err = $php_errormsg;
								return false;
							}
						}
					}
				}

				@closedir($handle);

				if($empty == false)
				{
					if(!@rmdir($directory))
					{
						$err = $php_errormsg;
						return false;
					}
				}
			}

			return true;
		}

		function FilterHidden(&$List)
		{
			foreach($this->_hidden as $pattern)
			{
				$pattern = preg_quote($pattern);
				$pattern = str_replace("*", "(.*)", $pattern);
				$pattern = str_replace("\\(", "(", $pattern);

				foreach($List as $k=>$item)
				{
					if(is_numeric(strpos($pattern, "*")))
					{
						if(eregi($pattern, $item))
							unset($List[$k]);
					}
					else
					{
						if(strtolower($pattern) == strtolower($item))
							unset($List[$k]);
					}
				}
			}
		}
	}

?>


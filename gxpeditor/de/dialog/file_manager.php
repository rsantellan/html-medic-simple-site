<?php

	@session_start();
	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR."valid_files.php");
	$objFM = new FileManager();

	if(isset($_GET["w"]) && isset($_GET["p"]))
		$objFM->DownloadFile();
	else
		$objFM->ShowFileManager();

	class FileManager
	{
		var $_linkPath = "";
		var $_startPath = "";
		var $_startURL = "";
		var $_uploadScriptPath = "";
		var $_scUserId = 0;
		var $_lw = 0;
		var $_hidden = array();
		var $_hidden_base64_encoded = "";

		// Constructor
		function FileManager()
		{
			// Set the get variables as session values (if applicable)
			@session_start();

			$_SERVER['DOCUMENT_ROOT'] = $_SESSION["userdocroot"];

			if(isset($_GET["obj"]))
			{
				foreach($_GET as $k=>$v) {
					if(!isset($_SESSION[$k]))
						$_SESSION[$k] = $v;
				}
			}

			$this->_linkPath = $_SERVER['DOCUMENT_ROOT'] . $_SESSION['linkDir'];
			$this->_startPath = $_SESSION["sp"];
			$this->_startURL = $_SESSION["su"];
			$this->_scUserId = $_SESSION["scu"];
			$this->_lw = $_SESSION["lw"];

			if($_SESSION["ump"] != "")
				$this->_uploadScriptPath = $_SESSION["ump"] . "/upload_file.php";
			else
				$this->_uploadScriptPath = "dialog/upload_file.php";

			// Set the height of the "Loading Please Wait" div
			if(is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "firefox")))
				$GLOBALS["LoadingHeight"] = 145;
			else
				$GLOBALS["LoadingHeight"] = 208;

			if(isset($_SESSION["de_hidden"]))
			{
				$hidden = $_SESSION["de_hidden"];

				if(is_array($hidden))
				{
					foreach($hidden as $file)
						$this->__hidden[] = $file;
				}
			}

			// Serialize the array and base64 encode it
			$this->_hidden_base64_encoded = base64_encode(serialize($this->__hidden));
		}

		function DownloadFile()
		{
			$path = sprintf("%s%s", $_SERVER["DOCUMENT_ROOT"], $_GET["p"]);
			$path = $this->_Safe($path);
			$data = "";

			if(file_exists($path))
			{
				// Workout the filename
				$tmpPath = str_replace("\\", "/", $path);
				$tmp = explode("/", $tmpPath);
				$fileName = $tmp[sizeof($tmp)-1];

				header("Content-Type: application/octet");
				header('Content-Disposition: attachment; filename="' . $fileName . '"');
				readfile($path);
			}
			else
			{
				?>
					<script>
						alert("The selected file doesn't exist.");
					</script>
				<?php
			}
		}

		function _Safe($Path)
		{
			$path = $Path;
			$path = eregi_replace("[.]+/", "", $path);
			return $path;
		}

		function _GetDir()
		{
			if(!isset($_SERVER["DOCUMENT_ROOT"])){
				$_SERVER["DOCUMENT_ROOT"]=str_replace('\\','/',getcwd());
			}
			if (!isset($_SESSION["linkDir"])) return $_SERVER["DOCUMENT_ROOT"];
			$path = sprintf("%s/%s", $_SERVER["DOCUMENT_ROOT"], $_SESSION["linkDir"]);
			$path = eregi_replace("/{2,}", "/", $path);
			$path = eregi_replace("/$", "", $path);
			return $path;
		}

		function ShowFileManager()
		{
			// Show the media manager, preselecting the appropriate tab
			$i = 0;

			switch($_GET["obj"])
			{
				case "link":
				{
					$tab = 0;
					break;
				}
				case "email":
				{
					$tab = 1;
					break;
				}
				case "file":
				{
					$tab = 2;
					break;
				}
			}

			// Workout the path to the remote.php file
			if (!isset($_SERVER['REQUEST_URI']) || $_SERVER['REQUEST_URI'] == '') {
				$_SERVER['REQUEST_URI'] = $_SERVER["SCRIPT_NAME"] .
				$_SERVER['QUERY_STRING'];
			}

			if($_SESSION["rp"] == "")
			{
				$sPath = $_SERVER["REQUEST_URI"];
				$sPos = strpos($sPath, "class.devedit.php");
				$sPath = substr($sPath, 0, $sPos-1);
				$sPath = sprintf("%s/remote.php", $sPath);
				$sPath = eregi_replace("/{2,}", "/", $sPath);
			}
			else
			{
				$sPath = $_SESSION["rp"];
			}

			?>
				<html>
				<head>
					<title>File Manager</title>
					<script type="text/javascript">

						// Show the "Loading Please Wait" dialog when using AJAX?
						var showLoadingPleaseWait = "<?php echo $this->_lw; ?>";

						d = document;
						ae = window.opener.activeEditor;
						aed = window.opener.activeEditor._frame;

						var maxUploadFileSize = window.opener.maxUploadFileSize;

						this.focus();

						var css_file_1 = window.opener.activeEditor.skinPath+window.opener.main_css_file;

						if(navigator.userAgent.indexOf('MSIE') > -1)
							var css_file_2 = window.opener.activeEditor.skinPath + "iemm.css";
						else
							var css_file_2 = window.opener.activeEditor.skinPath + "mzmm.css";

						document.write('<link rel="stylesheet" href="'+css_file_1+'" type="text/css">');
						document.write('<link rel="stylesheet" href="'+css_file_2+'" type="text/css">');

						function getAnchors()
						{
							var allLinks = aed.body.getElementsByTagName("A");
							for(a = 0; a < allLinks.length; a++)
							{
								try {
								if(allLinks[a] && (!allLinks[a].href || allLinks[a].href == ""))
								{
									document.write("<option value=#" + allLinks[a].name + ">" + allLinks[a].name + "</option>")
								}
								} catch(e){}
							}
						}

						function printStyleList()
						{
							ae = parent.opener.activeEditor;
							ae.doStyles();
							d = document;

							for (i=0;i<ae.Styles.length;i++){
								d.write('<option value="'+ae.Styles[i]+'">'+ae.Styles[i]+'</option>')
							}
						}

	function loadCustomLink() {
		ci = ae.customLink;
		for (i = 0; i < ci.length; i++)
		{
			newOption = document.createElement("option");
			newOption.text = ci[i][0]
			linkPart = ci[i][1]
			if (ci[i][2])
				targetPart = ci[i][2];
			else targetPart = "";
			newOption.value = linkPart
			newOption.id = ci[i][0]
			newOption.target = ci[i][2]
			document.getElementById("libraryText").options.add(newOption)
		}

		// If there are no custom links, hide the custom link TR
		if(ci.length == 0)
		{
			document.getElementById("divCustomLink").style.display = "none";
		}
	}

					</script>
				</head>
				<body style="background-color: #EAE8E4" onLoad="Tab(<?php echo $tab; ?>);loadCustomLink();">

					<div id="loadingDiv" style="display:none; font-family:Arial; font-size: 13px; z-index: 1000; -moz-opacity:0.90; filter:alpha(opacity=90); text-align:center; padding-top:70px; background-color: #ffffff; position:absolute; left:26; top:160; width:227; height:<?php echo $GLOBALS["LoadingHeight"]; ?>; display:none"><img src="../images/wait.gif" width="32" height="32"><div style="padding-top:10px">Loading, please wait...</div></div>

					<div id="input" class="LInput">
						<div id="inputText" class="InputText"></div>
						<input type="button" value="OK" class="InputOK" onClick="InpOK()">
						<input type="button" value="Cancel" class="InputCancel" onClick="InpCancel()">
						<input id="inputVal" type="text" class="InputBox" onKeyPress="InpKey(event)">
					</div>

					<div id="tab1" class="tabOn linkTabOn" onClick="Tab(0)">Link</div>
					<div id="tab2" class="tabOff emailTabOff" onClick="Tab(1)">Email</div>

					<br><img src="images/blank.gif" width="1" height="9"><br>

					<div id="linkBox" class="fBox" style="display:none">

						<iframe disabled id="iFrm" frameborder="0" scrolling="no" style="width: 260px; height: 55px; margin: 15px; font-family: Arial; font-size: 11px" src="<?php echo $this->_uploadScriptPath; ?>?panel=form">
							<!-- Upload image iframe -->
						</iframe>

						<div style="width: 225px; margin: -10px 0px -10px 15px; background-color: #F4F4F4; height: 23px"><img src="images/sep1.gif" height="20">
							<img id="but3" title="New Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/newfolder.gif" width="20" height="20" onClick="NewFolder1()">
							<img hspace="4" src="images/sep.gif" border="0" width="2" height="20"><img id="but4" title="Rename Selected File/Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/rename.gif" width="20" height="20" onClick="Rename()">
							<?php //if($this->ShowDeleteButton()) { ?>
								<img id="but6" title="Delete Selected File/Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/delete.gif" width="20" height="20" onClick="Delete()">
							<?php //} ?>
							<img hspace="4" src="images/sep.gif" border="0" width="2" height="20"><img id="but6" title="Preview Selected File" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/preview.gif" width="20" height="20" onClick="PreviewFile()">
							<img id="but6" title="Download Selected File" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/save.gif" width="20" height="20" onClick="SaveFile()">
						</div>

						<div id="currDir" class="fFolderBox">

						</div>

						<div id="list" name="list" class="LinkList">
							<!-- File list placeholder -->
						</div>

						<div class="LinkBox">
							<div>
								Link Location:<br>
								<input id="link" type="text" style="font-family: Arial; font-size: 11px; width: 100%">
							</div>
							<div id="divCustomLink" style="margin-top: 5px">
								Pre-defined Links:<br>
								  <select id="libraryText" class="Text150" onChange="link.value = libraryText[libraryText.selectedIndex].value; target.value = libraryText[libraryText.selectedIndex].target; link.focus()">
									<option value=""></option>
								</select>
							</div>
							<div style="margin-top: 5px">
								Target Window:<br>
								<input id="target" type="text" style="font-family: Arial; font-size: 11px; width: 50%">
								<select id="targets" onChange="SetTarget(this.options[this.selectedIndex].value)" style="font-family: Arial; font-size: 11px; width: 48%">
									<option value=""></option>
									<option value="">None</option>
									<option value="_self">Same Frame</option>
									<option value="_top">Whole Page</option>
									<option value="_blank">New Window</option>
									<option value="_parent">Parent Frame</option>
								</select>
							</div>
							<div style="margin-top: 5px">
								Anchor:<br>
								<select id="anchor" onChange="SetAnchor(this.options[this.selectedIndex].value)" style="font-family: Arial; font-size: 11px; width: 50%">
									<option value=""></option>
									<script>getAnchors()</script>
								</select>
							</div>
							<div style="margin-top: 5px">
								Style:<br>
								<select id="style" style="font-family: Arial; font-size: 11px; width: 50%">
									<option value=""></option>
									<script>printStyleList()</script>
								</select>
							</div>
						</div>

						<input id="butInsert" type="button" value="Insert Link" class="LinkInsert" onClick="insertLink()">

						<input id="butRemove" type="button" value="Remove Link" class="LinkRemove" onClick="removeLink()">

						<input id="butCancel" type="button" value="Cancel" class="LinkCancel" onClick="window.close()">

					</div>

					<div id="emailBox" class="fBox" style="display:none">

						<div class="PopInfo">
							<img src="images/bulb.gif" align=left width=16 height=17>
							<span id="TxtInsertEmailInst">Enter the required information and click on the &quot;OK&quot; button to create a link to an email address in your webpage.</span>
						</div>

						<div class="EmailBox">
							<table width="100%" border="0">
								<tr>
									<td width="80" style="font-family: Arial; font-size: 11px">Email Address:</td>
									<td style="font-family: Arial; font-size: 11px"><input type="text" id="email" style="width:230px; font-family: Arial; font-size: 11px" size="30"></td>
								</tr>
								<tr>
									<td width="80" style="font-family: Arial; font-size: 11px">Subject:</td>
									<td style="font-family: Arial; font-size: 11px"><input type="text" id="subject" style="width:230px; font-family: Arial; font-size: 11px" size="30"></td>
								</tr>
								<tr>
									<td width="80" style="font-family: Arial; font-size: 11px">Style:</td>
									<td style="font-family: Arial; font-size: 11px">
										<select size="1" id="eStyle" style="width:120px; font-family: Arial; font-size: 11px" size="30">
											<option value=""></option>
											<script>printStyleList()</script>
										</select></td>
								</tr>
							</table>
						</div>
						<input onClick="InsertEmail()" id="emailInsert" type="button" value="Insert Link" class="LinkInsert">
						<input onClick="RemoveEmail()" id="emailRemove" type="button" value="Remove Link" class="LinkRemove">
						<input type="button" value="Cancel" class="LinkCancel" onClick="window.close()">
					</div>

					<script>

						if("<?php echo $_SESSION["rp"]; ?>" != "")
						{
							var root = "<?php echo $this->_linkPath; ?>";
							var pRoot = "<?php echo $this->_linkPath; ?>";
							var dRoot = "<?php echo $this->_linkPath; ?>";
						}
						else
						{
							var root = "<?php echo $this->_GetDir(); ?>";
							var pRoot = "<?php echo $this->_GetDir(); ?>";
							var dRoot = "<?php echo $_SERVER["DOCUMENT_ROOT"]; ?>"
						}

						var folder = "";
						var req;
						var url = "<?php echo $sPath; ?>";
						var what = "";
						var pPath = "";
						var re = /\/$/;
						var re1 = /^\//;
						var cancelled = false;
						var val = "";
						var func = "";
						var token = "<?php if (isset($_COOKIE["t"]))echo $_COOKIE["t"]; ?>";
						var oFolder = "";
						var fileList = Array();
						var selFile = "";
						var numObjects = 0;
						var customLinks = 0;
						var fileTypes = "<?php echo implode(",", ValidExtensions()); ?>";
						var oSel;
						var folderType = 0;

						var startPath = "<?php echo $this->_startPath; ?>";
						var startURL = "<?php echo $this->_startURL; ?>";

						var hiddenFiles64 = "<?php echo $this->_hidden_base64_encoded; ?>";

						function Tab(t)
						{
							var i = document.getElementById("linkBox");
							var f = document.getElementById("emailBox");

							var t1 = document.getElementById("tab1");
							var t2 = document.getElementById("tab2");

							switch(t)
							{
								case 0:
								{
									i.style.display = "";
									f.style.display = "none";
									t1.src = "images/tab.active.png";

									t1.className = "tabOn linkTabOn"
									t2.className = "tabOff emailTabOff";

									break;
								}
								case 1:
								{
									i.style.display = "none";
									f.style.display = "";

									t1.className = "tabOff linkTabOff"
									t2.className = "tabOn emailTabOn";

									break;
								}
							}
						}

						var gData = "";

						function DoCallback(data)
						{
							ToggleLoadingPleaseWait(true);

							// branch for native XMLHttpRequest object
							gData = data;
							data = data + "&token=" + token + "&hidden=" + hiddenFiles64;

							if (window.XMLHttpRequest) {
								req = new XMLHttpRequest();
								req.onreadystatechange = processReqChange;
								req.open('POST', url, true);
								req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
								req.send(data);
							// branch for IE/Windows ActiveX version
							} else if (window.ActiveXObject) {
								req = new ActiveXObject('Microsoft.XMLHTTP')
								if (req) {
									req.onreadystatechange = processReqChange;
									req.open('POST', url, true);
									req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
									req.send(data);
								}
							}
						}

						function processReqChange() {
							// only if req shows 'loaded'
							if (req.readyState == 4) {
								try
								{
									if (req.status == 200) {
										eval(what);
										ToggleLoadingPleaseWait(false);
									} else {
										alert(req.status)
										//alert('There was a problem retrieving the XML data:\n' + req.responseText);
									}
								}
								catch(e)
								{
									DoCallback(gData);
								}
							}
						}

						function Sel(Obj, Folder, FType)
						{
							folder = Folder;
							folderType = FType;

							if(!(dRoot.replace(re, "") == root.replace(re, "")))
								j = 1;
							else
								j = 0;

							if(FType == 0)
							{
								// Set the link to this folders location
								SelLink(Folder);
							}

							for(i = j; i < imageI; i++)
							{
								if(document.getElementById("s_"+i) != null)
								{
									document.getElementById("s_"+i).style.backgroundColor = "white";
									document.getElementById("s_"+i).style.color = "black";
								}
							}

							Obj.style.color = "white";
							Obj.style.backgroundColor = "#C2D3FC";
						}

						function ChangeFolder(Folder, PathIsGood)
						{
							var currDir = document.getElementById("currDir");
							var link = document.getElementById("link");

							link.value = "";

							// Reset the selected file/folder
							folder = "";

							if(!PathIsGood)
							{
								if(Folder == "..")
								{
									// Workout the .. path
									var u = pPath.split("/");
									var uPath = "";

									for(j = 0; j < u.length-1; j++)
										uPath = uPath + u[j] + "/";

									uPath = uPath.replace(re, "");

									if(uPath == "")
										uPath = "/";

									path = uPath;
								}
								else
								{
									path = root + "/" + Folder;
									path = path.replace("//", "/");
								}
							}
							else
							{
								path = Folder;
							}

							if(Folder == "")
								path = "<?php echo $this->_linkPath; ?>";

							imageI = 0;
							fList = document.getElementById("list");
							pPath = path.replace(re, "");

							// Use AJAX to get a list of new files/folders
							what = "FillList(req.responseText)";
							DoCallback("w=getFileList&showfiletypes=all&p="+path+"&s="+selFile);
							root = path;

							// Update the folder path
							zRoot = dRoot;
							zPath = pPath;

							zRoot = zRoot.replace(re, "");
							zPath = zPath.replace(zRoot, "");

							if(startPath != "/")
								zPath = startPath + zPath;

							if(zPath == "")
								zPath = "/";

							if(zPath.length > 36)
								currDir.innerHTML = zPath.substring(0, 36) + "...";
							else
								currDir.innerHTML = zPath;

							// Clear the list of files/folders
							fList.innerHTML = "";
							fromChild = false;
						}

						function FillList(List)
						{
							// Fill the list with the folders and files
							scrTo = 0;
							l = List.split(",");
							fList = document.getElementById("list");
							fileList.length = 0;
							html = "";
							j = 0;

							// Reset the object counter
							numObjects = 0;
							numFolders = 0;
							numFiles = 0;

							html = "<table border=\"0\" width=\"100%\" style=\"font-family: Arial; font-size: 10pt\" cellspacing=\"0\" cellpadding=\"0\">";

							// Do we need to add an option to go to the parent folder?
							if(pPath.length > pRoot.length)
							{
								// Workout the .. path
								var u = pPath.split("/");
								var uPath = "";

								for(j = 0; j < u.length-1; j++)
									uPath = uPath + u[j] + "/";

								uPath = uPath.replace(re, "");

								if(uPath == "")
									uPath = "/";

								html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\"\"><img align=\"left\" hspace=\"5\" src=\"images/folder.gif\"><a class=\"Folder\" href=\"javascript:ChangeFolder('..', false)\">[..]</a></div></td></tr>";
							}

							for(i = 0; i < l.length-1; i++)
							{
								var item = l[i].split("|");

								if(item[1] == "folder")
								{
									// It's a folder
									html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '" + item[0] + "', 0);\"><img align=\"left\" hspace=\"5\" src=\"images/folder.gif\"><a class=\"Folder\" href=\"javascript:ChangeFolder('" + item[0] + "', false)\">" + item[0].replace("\\", "") + "</a></div></td></tr>";
								}
								else
								{
									// It's a file -- make sure its got a valid extension
									var tmp = item[0].split(".");
									ext = tmp[tmp.length-1];
									ext = ext.toLowerCase();

									fileList[fileList.length] = item[0];

									if(fileTypes.indexOf(ext) > -1)
									{
										switch(ext)
										{
											case "bmp":
											case "gif":
											case "jpg":
											case "png":
											case "tif":
											case "tiff":
											{
												img = "image.gif";
												break;
											}
											case "doc":
											{
												img = "doc.gif";
												break;
											}
											case "ppt":
											{
												img = "powerpoint.gif";
												break;
											}
											case "xls":
											{
												img = "excel.gif";
												break;
											}
											case "pdf":
											{
												img = "pdf.gif";
												break;
											}
											case "php":
											case "htm":
											case "html":
											{
												img = "html.gif";
												break;
											}
											default:
											{
												img = "link.gif";
											}
										}

										html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '" + item[0] + "', 1); SelLink('" + item[0] + "')\"><img align=\"left\" hspace=\"5\" src=\"images/" + img + "\"><a class=\"Folder\" href=\"javascript:SelLink('" + item[0] + "')\">" + item[0].replace("\\", "") + "</a></div></td></tr>";
									}
								}
							}

							html = html + "<tr><td colspan='2' height='10'></td></tr>";
							html = html + "</table>";

							fList.innerHTML = html;

							// Scroll to the selected file;
							window.setTimeout("fList.scrollTop = (scrTo * 20);", 100);
						}

						function SelLink(Link)
						{
							var link = document.getElementById("link");
							var linkPath = "";

							// Path type: 0 = full, 1 = absolute
							ctrlName = opener.parent.frames[0].name;
							pathType = opener.pathType;

							if(startPath != "/")
								linkPath = startPath;

							linkPath = linkPath + "/" + root;
							linkPath = linkPath.replace(dRoot, "");
							linkPath = linkPath + "/" + folder;

							linkPath = linkPath.replace("[/]*", "/", 'g');

							while(linkPath.match('//'))
								linkPath = linkPath.replace('//', '/', 'g');

							if(pathType == 0)
								linkPath = "http://<?php echo $_SERVER["HTTP_HOST"]; ?>" + linkPath;

							link.value = linkPath;
						}

						function HTTPPath(Lnk)
						{
							lnk = pPath + "/" + Lnk;
							lnk = lnk.replace(dRoot, "");
							return lnk;
						}

						function NewFolder1()
						{
							Inp("Enter a new folder name below:", "", "NewFolder2();");
						}

						function NewFolder2()
						{
							// Create a new folder using AJAX
							if(val == "")
							{
								alert("Please enter a folder name.");
								Inp("Enter a new folder name below:", "", "NewFolder2();");
							}
							else
							{
								// Make sure the folder name is valid
								var folderName = val;
								var fRe = /^[a-zA-Z0-9_]+$/;

								if(folderName.match(fRe))
								{
									what = "NewFolder3(req.responseText)";
									DoCallback("w=createNewFolder&p="+pPath+"&f="+folderName);
								}
								else
								{
									alert("Please enter a valid folder name containing only letters and numbers only.");
									Inp("Enter a new folder name below:", "", "NewFolder2();");
								}
							}
						}

						function NewFolder3(Response)
						{
							alert(Response);
							imageI = 0;

							what = "FillList(req.responseText)";
							DoCallback("w=getFileList&p="+path);

							// Clear the list of files/folders
							fList.innerHTML = "";
						}

						function Inp(Msg, Val, Func)
						{
							var i = document.getElementById("input");
							var m = document.getElementById("inputText");
							var t = document.getElementById("inputVal");

							var anchor = document.getElementById("anchor");
							var sty = document.getElementById("style");

							anchor.style.display = "none";
							sty.style.display = "none";

							cancelled = false;
							val = "";
							func = Func;

							i.style.display = "inline";
							m.innerHTML = "<img src='images/exclamation.gif' align='left' style='margin-right:5px'>" + Msg;

							t.value = Val;
							t.focus();
							t.select();
						}

						function InpOK()
						{
							var i = document.getElementById("input");
							var t = document.getElementById("inputVal");

							var anchor = document.getElementById("anchor");
							var sty = document.getElementById("style");

							anchor.style.display = "";
							sty.style.display = "";

							i.style.display = "none";
							val = t.value;
							eval(func);
						}

						function InpCancel()
						{
							var i = document.getElementById("input");

							var anchor = document.getElementById("anchor");
							var sty = document.getElementById("style");

							anchor.style.display = "";
							sty.style.display = "";

							i.style.display = "none";
							cancelled = true;
							func = "";
						}

						function InpKey(e)
						{
							var key = window.event ? e.keyCode : e.which;

							if(key == 13)
								InpOK();

							if(key == 0 || key == 27)
								InpCancel();
						}

						function Rename()
						{
							// Show the dialog to rename the folder
							if(folder == "" || folder == "..")
							{
								alert("Please choose a file or folder to rename.");
							}
							else
							{
								oFolder = folder;
								Inp("Enter a new folder name below:", folder, "Rename2();");

							}
						}

						function Rename2()
						{
							// Create a new folder using AJAX
							if(val == "")
							{
								alert("Please enter a folder name.");
								Inp("Enter a new folder name below:", folder, "Rename2();");
							}
							else
							{
								// Make sure the folder name is valid
								var folderName = val;
								var fRe = /^[a-zA-Z0-9_\.]+$/;

								if(folderName.match(fRe))
								{
									what = "Rename3(req.responseText)";
									DoCallback("w=renameFileFolder&p="+pPath+"&f="+folderName+"&o="+oFolder);
								}
								else
								{
									alert("Please enter a valid folder name containing only letters and numbers only.");
									Inp("Enter a new folder name below:", folder, "Rename2();");
								}
							}
						}

						function Rename3(Response)
						{
							alert(Response);
							imageI = 0;

							what = "FillList(req.responseText)";
							DoCallback("w=getFileList&p="+path);

							// Clear the list of files/folders
							fList.innerHTML = "";
						}

						function Delete()
						{
							// Show the dialog to rename the folder
							if(folder == "" || folder == "..")
							{
								alert("Please choose a file or folder to delete.");
							}
							else
							{
								if(confirm("Are you sure you want to delete the selected file/folder '"+folder+"'?"))
								{
									what = "Delete2(req.responseText)";
									DoCallback("w=deleteFileFolder&p="+pPath+"&f="+folder);
								}
							}
						}

						function Delete2(Response)
						{
							alert(Response);
							imageI = 0;

							what = "FillList(req.responseText)";
							DoCallback("w=getFileList&p="+path);

							// Clear the list of files/folders
							fList.innerHTML = "";
						}

						function SetTarget(Dest)
						{
							var target = document.getElementById("target");
							var targets = document.getElementById("targets");

							target.value = Dest;
							targets.selectedIndex = -1;
						}

						function SetAnchor(Anchor)
						{
							var anchor = document.getElementById("anchor");
							var link = document.getElementById("link");

							anchor.selectedIndex = -1;

							if(Anchor != "")
								link.value = Anchor;
							else
								link.value = "";
						}

						function removeLink()
						{
							aed.execCommand("Unlink",false,null);
							self.close();
						}

						function insertLink()
						{
							var targetWindow = document.getElementById("target").value;
							var linkSource = document.getElementById("link").value;
							sty = document.getElementById("style")[document.getElementById("style").selectedIndex].text;
							var oLink = null;

							if(linkSource != "")
							{
								if(oSel)
									oLink = oSel;
								else
								{
									var id = (Math.random())+"";
									id = id.substr(2,8);
									aed.execCommand("CreateLink",false,"__de__"+id);
									oLink = getA("__de__"+id);

									if (oLink)
										window.opener.buffer[ae.mode].saveHistory();
								}

								oLink.setAttribute("href",linkSource);
								if(targetWindow != "")
									oLink.target = targetWindow;
								else
									oLink.removeAttribute("target");

								if(sty != "")
									oLink.className = sty;
								else
								oLink.removeAttribute("className");

								opener.ToolbarSets.Redraw();
								self.close();
							}
							else
							{
								alert("Please enter a link location.");
								document.getElementById("link").focus();
							}
						}

						function getA(href)
						{
							var elements = aed.getElementsByTagName("A");

							for(var i = 0; i < elements.length; i++){
								try{
								if (elements.item(i).getAttribute("href")==href) return elements.item(i);
								} catch (e){}
							}

						}

						function setSelectedClass()
						{
							if(!oSel)
								return;

							var s = d.getElementById("style");

							for(var i = 0; i < s.options.length; i++)
							{
								if(opener.browser.NS)
									var attr=oSel.getAttribute("class");
								else
									var attr=oSel.getAttribute("className");

								if(attr && attr.toLowerCase() == s.options[i].value.toLowerCase())
									s.options[i].selected = true;
							}
						}

						function setSelectedEClass()
						{
							if(!oSel)
								return;

							var s = d.getElementById("eStyle");

							for(var i = 0; i < s.options.length; i++)
							{
								if(opener.browser.NS)
									var attr=oSel.getAttribute("class");
								else
									var attr=oSel.getAttribute("className");

								if(attr && attr.toLowerCase() == s.options[i].value.toLowerCase())
									s.options[i].selected = true;
							}
						}

						function RemoveEmail()
						{
							aed.execCommand("Unlink",false,null);
							self.close();
						}

						function InsertEmail()
						{
							var e = 0;
							var email = document.getElementById("email").value;
							var subject = document.getElementById("subject").value;
							var styles = document.getElementById("eStyle")[document.getElementById("eStyle").selectedIndex].text;

							if(e != 1)
							{
								if(email == "")
								{
									alert("Please enter an email address.");
									document.getElementById("email").focus;
									e = 1;
								}
								else
								{
									mailto = "mailto:" + email;

									if(subject != "")
									{
										mailto = mailto + "?subject=" + subject;
									}

								if(oSel)
									oLink = oSel;
								else
								{
									aed.execCommand("CreateLink",false,"__de__"+mailto);
									oLink = getA("__de__"+mailto);

									if(oLink)
										window.opener.buffer[ae.mode].saveHistory();
								}

								oLink.setAttribute("href",mailto);

								if(styles != "")
									oLink.className = styles;
								else
									oLink.removeAttribute("className")
								}
							}

							if(e != 1)
							{
								opener.ToolbarSets.Redraw();
								self.close();
							}
						}

						function PreviewFile()
						{
							var linkPath = "";

							if(folder == "" || folder == "..")
							{
								alert("Please choose a file to preview.");
							}
							else
							{
								// Path type: 0 = full, 1 = absolute
								linkPath = linkPath + "/" + root;
								linkPath = linkPath.replace(dRoot, "");
								linkPath = linkPath + "/" + folder;

								linkPath = linkPath.replace("[/]*", "/", 'g');

								while(linkPath.match('//'))
									linkPath = linkPath.replace('//', '/', 'g');

								linkPath = "http://<?php echo $_SERVER["HTTP_HOST"]; ?>" + linkPath;
								window.open(linkPath);
							}
						}

						function SaveFile()
						{
							var filePath = "";

							if(folderType == 0 || folder == "" || folder == "..")
							{
								alert("Please choose a file to download.");
							}
							else
							{
								// Path type: 0 = full, 1 = absolute
								filePath = filePath + "/" + root;
								filePath = filePath.replace(dRoot, "");
								filePath = filePath + "/" + folder;

								filePath = filePath.replace("[/]*", "/", 'g');

								while(filePath.match('//'))
									filePath = filePath.replace('//', '/', 'g');

								document.location.href = "dialog/file_manager.php?w=downloadFile&p="+filePath;
							}
						}

						function SetLink()
						{
							if(ae.GetType() == "Control")
							{
								var oControlRange = ae.GetSelectedElement();
								oSel = oControlRange;

								if(oControlRange.tagName.toUpperCase() == "IMG")
								{
									oSel = oControlRange.parentNode;

									if(oSel.tagName.toUpperCase() != "A")
										oSel = false;
								}
								else if(oControlRange.tagName.toUpperCase() != "A")
								{
									alert("A link can only be created on an image or text.");
								}
							}
							else
							{
								oSel = ae.parentNode("A");
							}
						}

						function GetHyperLink()
						{
							if(oSel)
							{
								if(oSel.tagName.toUpperCase() == "A")
								{
									document.getElementById("target").value = oSel.target;
									document.getElementById("link").value = oSel.getAttribute("href",2);
									setSelectedClass();
								}
							}
						}

						function ShowUploading()
						{
							if (window.opener.disableLinkUploading){
								document.getElementById("iFrm").style.height=0;
								document.getElementById("list").style.height="260px";
							}
						}

						function GetEmailLink()
						{
							if(oSel)
							{
								if(oSel.tagName.toUpperCase() == "A")
								{
									myHref = oSel.getAttribute("href",2);

									if(myHref.indexOf("@") >-1)
									{
										myHrefEmail = myHref.substring(7, myHref.indexOf("?"));
										myHrefSubject = myHref.substring(myHref.indexOf(myHrefEmail)+myHrefEmail.length+9, myHref.length);
									}
									else
									{
										myHrefEmail = "";
										myHrefSubject = "";
									}

									document.getElementById("email").value = myHrefEmail;
									document.getElementById("subject").value = myHrefSubject;
									setSelectedEClass();
								}
							}

							return true;
						}

						function ToggleLoadingPleaseWait(State)
						{
							var loadingDiv = document.getElementById("loadingDiv");

							if(showLoadingPleaseWait == 1)
							{
								if(State)
									loadingDiv.style.display = "";
								else
									loadingDiv.style.display = "none";
							}
						}

						// Load the default folder
						ChangeFolder("", false);

						// Is a link selected?
						SetLink();
						ShowUploading();
						GetHyperLink();
						GetEmailLink();

					</script>

				</body>
				</html>
			<?php

		}

	}

?>
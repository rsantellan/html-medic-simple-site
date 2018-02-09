<?php
	@session_start();

	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR."valid_files.php");
	$objMM = new MediaManager();
	$objMM->ShowMediaManager();

	function canonicalize($address)
	{
		$address = explode('/', $address);
		$keys = array_keys($address, '..');

		foreach($keys AS $keypos => $key) {
			array_splice($address, $key - ($keypos * 2 + 1), 2);
		}

		$address = implode('/', $address);
		$address = str_replace('./', '', $address);
	}

	class MediaManager
	{
		var $_startPath = "";
		var $_startURL = "";
		var $_uploadScriptPath = "";
		var $_scUserId = 0;
		var $_lw = 0;
		var $_hidden = array();
		var $_hidden_base64_encoded = "";

		// Constructor
		function MediaManager()
		{
			// Set the get variables as session values (if applicable)
			@session_start();

			$_SERVER['DOCUMENT_ROOT'] = $_SESSION["userdocroot"];

			if (isset($_GET["obj"])) {
				foreach($_GET as $k=>$v) {
					if(!isset($_SESSION[$k]))
						$_SESSION[$k] = $v;
				}
			}

			$_SERVER['DOCUMENT_ROOT'] = $_SESSION["userdocroot"];

			$this->_startPath = $_SESSION["sp"];
			$this->_startURL = $_SESSION["su"];
			$this->_scUserId = $_SESSION["scu"];
			$this->_lw = $_SESSION["lw"];

			if($_SESSION["ump"] != "")
				$this->_uploadScriptPath = $_SESSION["ump"] . "/upload_image.php";
			else
				$this->_uploadScriptPath = "dialog/upload_image.php";

			// Set the height of the "Loading Please Wait" div
			if(is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "firefox")))
				$GLOBALS["LoadingHeight"] = 190;
			else
				$GLOBALS["LoadingHeight"] = 305;

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

		function _GetImageDir()
		{
			if(isset($_SESSION["scu"]) && is_numeric($_SESSION["scu"]) && $_SESSION["scu"] != "0") {
				return $_SESSION["imgDir"];
			}
			else {
				if (substr($_SESSION['imgDir'], 0, 1) == '/') {
					$path = sprintf("%s/%s", $_SERVER["DOCUMENT_ROOT"], $_SESSION["imgDir"]);
				} else {
					$path = dirname($_SESSION['RequestedFile']).'/'.$_SESSION['imgDir'];
				}

				$path = eregi_replace("/{2,}", "/", $path);
				$path = eregi_replace("/$", "", $path);

				return $path;
			}
		}

		function _GetFlashDir()
		{
			if(isset($_SESSION["scu"]) && is_numeric($_SESSION["scu"]) && $_SESSION["scu"] != "0") {
				return $_SESSION["flashDir"];
			}
			else {
				if (substr($_SESSION['flashDir'], 0, 1) == '/') {
					$path = sprintf('%s/%s', $_SERVER['DOCUMENT_ROOT'], $_SESSION['flashDir']);
				} else {
					$path = dirname($_SESSION['RequestedFile']).'/'.$_SESSION['flashDir'];
				}

				$path = eregi_replace("/{2,}", "/", $path);
				$path = eregi_replace("/$", "", $path);
				return $path;
			}
		}

		function _GetMediaDir()
		{
			if(isset($_SESSION["scu"]) && is_numeric($_SESSION["scu"]) && $_SESSION["scu"] != "0") {
				return $_SESSION["mediaDir"];
			}
			else {
				if (substr($_SESSION['mediaDir'], 0, 1) == '/') {
					$path = sprintf('%s/%s', $_SERVER['DOCUMENT_ROOT'], $_SESSION['mediaDir']);
				} else {
					$path = dirname($_SESSION['RequestedFile']).'/'.$_SESSION['mediaDir'];
				}

				$path = eregi_replace("/{2,}", "/", $path);
				$path = eregi_replace("/$", "", $path);
				return $path;
			}
		}

		function ShowThumbNails()
		{
			if($_SESSION["tn"]) {
				return $_SESSION["tn"];
			} else {
				return false;
			}
		}

		function ShowWebImage()
		{
			if ($_SESSION["wi"] == 0) {
				return true;
			} else {
				return false;
			}
		}

		function ShowUpload()
		{
			if ($_SESSION["du"] == 0) {
				return true;
			} else {
				return false;
			}
		}

		function ShowDeleteButton()
		{
			if ($_SESSION["dd"] == 0) {
				return true;
			} else {
				return false;
			}
		}

		function ShowMediaManager()
		{
			// Show the media manager, preselecting the appropriate tab
			$i = 0;
			$mFolder = "";

			switch ($_GET["obj"]) {
				case "image":
				{
					$tab = 0;
					$mFolder = $this->_GetImageDir();
					break;
				}
				case "flash":
				{
					$tab = 1;
					$mFolder = $this->_GetFlashDir();
					break;
				}
				case "media":
				{
					$tab = 2;
					$mFolder = $this->_GetMediaDir();
					break;
				}

				$this->_tab = $tab;
			}

			$ROOT = str_replace('\\','/',getcwd());
			if (!isset($_SERVER["DOCUMENT_ROOT"])) {
				$_SERVER["DOCUMENT_ROOT"]=str_replace('\\','/',getcwd());
			}

			// Get the complete path to the media folder
			$mFolder = str_replace($_SERVER["DOCUMENT_ROOT"], "", $mFolder);
			$rootImagePath = sprintf("http://%s/%s", $_SERVER["HTTP_HOST"], $mFolder);
			$rootImagePath = eregi_replace("([^:])/{2,}", "\\1/", $rootImagePath);

			if (!isset($_SERVER['REQUEST_URI']) || $_SERVER['REQUEST_URI'] == '') {
				$_SERVER['REQUEST_URI'] = $_SERVER["SCRIPT_NAME"] .
				$_SERVER['QUERY_STRING'];
			}

			// Workout the path to the remote.php file
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
				<title>Media Manager</title>
				<script type="text/javascript">

				// Show the "Loading Please Wait" dialog when using AJAX?
				var showLoadingPleaseWait = "<?php echo $this->_lw; ?>";

				function loadFrame()
				{
					// Are we modifying an image?
					if (typeof oSel !== "undefined" && oSel) {
						if (typeof modify !=="undefined" && modify) {
							var extImg = document.getElementById("externalImage");
							var butInsert = document.getElementById("butInsert");

							previewModify(oSel);

							// Set the text of the action button
							butInsert.value = "Modify "+jsobj.substr(0,1).toUpperCase()+jsobj.substr(1);

							// What's the source of the image?
							sr = oSel.src;
							if (oSel.getAttribute("name2")) {
								var x = document.createElement("DIV");
								x.innerHTML = unescape(oSel.getAttribute("name2"));
								sr = x.firstChild.src;
								x = null;
							}
							// Is it a local image?
							if (sr.indexOf("<?php echo $rootImagePath ?>") > -1) {
								// It's a local image
								local = true;

								sr = sr.replace('<?php echo $_SERVER["HTTP_HOST"]; ?>', "");
								sr = sr.replace("://", "");
								sr = sr.replace("https", "");
								sr = sr.replace("http", "");
								sr = sr.replace(re1, "");

								// Now "sr" will just be a path, such as images/john.gif
								sr = dRoot + "/" + sr;
								sr = sr.replace("\\", "/");
								tmp = sr.split("/");
								fileName = tmp[tmp.length-1];

								iPath = sr.replace(fileName, "");
								iPath = iPath.replace(root, "");
								iPath = iPath.replace(re1, "");
								iPath = iPath.replace(re, "");

								selFile = fileName;

								ChangeFolder(iPath, false);
							} else {
								// It's a web site image
								extImg.value = sr;
							}

							// Get the proper local path for the "external image" box for local images
							var innerHT = oSel.parentNode.innerHTML;

							switch(selTab) {
								case 0:
								{
									// Image
									var objSrc = innerHT.match(/<img.*?src[ ]*=["']?([^"']+)["']?/i);
									var extImg = document.getElementById("externalImage");

									if (objSrc[0].indexOf("http://") == -1) {
										extImg.value = objSrc[1];
									}
								}
							}
						}
					}
				}

				var imageLibs = 0;
				this.focus();
				var css_file_1 = window.opener.activeEditor.skinPath+window.opener.main_css_file;
				if(document.all) {
					var css_file_2 = "iemm.css";
				} else {
					var css_file_2 = "mzmm.css";
				}
				css_file_2 = window.opener.activeEditor.skinPath + css_file_2;
				document.write('<link rel="stylesheet" href="'+css_file_1+'" type="text/css">');
				document.write('<link rel="stylesheet" href="'+css_file_2+'" type="text/css">');

				function outputImageLibraryOptions()
				{
					var selImageLib = document.getElementById("selImageLib");
					var fList = document.getElementById("list");
					var iList = document.getElementById("iList");

					document.write(opener.parent.imageLibs);
					imageLibs = selImageLib.options.length;

					if (imageLibs > 1) {
						fList.style.height = 286;
					} else {
						iList.style.display = "none";
					}

					// Loop through all of the image libraries and find the selected one
					for(i = 0; i < selImageLib.options.length; i++) {
						if (selImageLib.options[i].value == "<?php echo $this->_GetImageDir(); ?>") {
							selImageLib.selectedIndex = i;
							break;
						}
					}
				}

			function writeTabs(){
				if (!opener.hideFlashTab){
					document.write('<div id="tab2" class="tabOff flashTabOff" onClick="Tab(1)">Flash</div>');
				} else {
					document.write('<div id="tab2" style="display:none;" class="tabOff flashTabOff" onClick="Tab(1)">Flash</div>');
				}
				if (!opener.hideMediaTab){
					document.write('<div id="tab3" class="tabOff mediaTabOff" onClick="Tab(2)">Media</div>');
				} else {
					document.write('<div id="tab3" style="display:none;" class="tabOff mediaTabOff" onClick="Tab(2)">Media</div>');
				}

			}
				</script>

			</head>
			<body style="background-color: #EAE8E4" onLoad="Tab(<?php echo $tab; ?>)">

				<div id="loadingDiv" style="display:none; font-family:Arial; font-size: 13px; z-index: 1000; -moz-opacity:0.90; filter:alpha(opacity=90); text-align:center; padding-top:100px; background-color: #ffffff; position:absolute; left:26; top:160; width:262; height:<?php echo $GLOBALS["LoadingHeight"]; ?>"><img src="../images/wait.gif" width="32" height="32"><div style="padding-top:10px">Loading, please wait...</div></div>

				<div id="input" class="Input">
					<div id="inputText" class="InputText"></div>
					<input type="button" value="OK" class="InputOK" onClick="InpOK()">
					<input type="button" value="Cancel" class="InputCancel" onClick="InpCancel()">
					<input id="inputVal" type="text" class="InputBox" onKeyPress="InpKey(event)">
				</div>

				<div id="tab1" class="tabOn imageTabOn" onClick="Tab(0)">Images</div>
				<script>writeTabs()</script>

				<br><img src="images/blank.gif" width="1" height="9"><br>

				<div id="imageBox" class="box">
					<div id="uploadbox">
						<iframe disabled id="iFrm" frameborder="0" scrolling="no" style="width: 260px; height: 55px; margin: 15px; font-family: Arial; font-size: 11px" src="<?php echo $this->_uploadScriptPath; ?>?panel=form">
							<!-- Upload image iframe -->
						</iframe>
					</div>

					<div style="width: 260px; margin: -10px 0px -10px 15px; background-color: #F4F4F4; height: 23px"><img src="images/sep1.gif" height="20">
						<img id="but3" title="New Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/newfolder.gif" width="20" height="20" onClick="NewFolder1()">
						<img hspace="4" src="images/sep.gif" border="0" width="2" height="20"><img id="but4" title="Rename Selected File/Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/rename.gif" width="20" height="20" onClick="Rename()">
						<img id="but7" title="Delete Selected File/Folder" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/delete.gif" width="20" height="20" onClick="Delete()">
						<img hspace="4" src="images/sep.gif" border="0" width="2" height="20"><img id="but5" title="Toggle Thumbnails" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled && !showThumbs) this.className='ButtonOff'" class="ButtonOff" src="images/thumb.gif" width="20" height="20" onClick="ToggleThumbs()">
						<img id="but6" title="Set Image as Background" onMouseOver="if(!this.disabled) this.className='ButtonOn'" onMouseUp="if(!this.disabled) this.className='ButtonOff'" onMouseOut="if(!this.disabled) this.className='ButtonOff'" class="ButtonOff" src="images/background.gif" width="20" height="20" onClick="setBackground()">
					</div>

					<div id="currDir" class="FolderBox">

					</div>

					<div id="list" name="list" style="width:260px; height:282px; border: solid 1px gray; margin: 15px; overflow: auto; background-color: white">
						<!-- File list placeholder -->
					</div>

					<div id="iList" name="iList" style="width:260px; height:20px; margin: -10px 0px 0px 15px">
						<!-- Image library list -->
						<select id="selImageLib" style="width:260px; font-family: Arial; font-size:11px" onChange="ChangeLib(this.options[this.selectedIndex].value)">
							<script>outputImageLibraryOptions();</script>
						</select>
					</div>

					<?php if($this->ShowWebImage()) { ?>
						<div style="width: 630px; position: absolute; left: 290px; top: 15px; font-family: Arial; font-size: 11px" id="extImg">
							<div id="extText">External Image:</div>
							<input id="externalImage" name="externalImage" type="text" style="width:260px" value="http://" onKeyPress="CheckExtKey(event)">
							<input onClick="insertExtImage()" type="button" value="Load" style="font-family: Arial; font-size: 11px">
						</div>
					<?php } ?>

					<div id="prevDiv" class="PreviewBox"></div>
					<div class="ImagePropWin" ><iframe onload="javascript:loadFrame();" src="empty.html" width="100%" height="100%"  name="prop" id="prop" scrolling="auto" frameborder="no"></iframe></div>

					<input id="butInsert" type="button" value="Insert Image" class="ImageInsert" onClick="insertImage()">
					<input onClick="window.close()" type="button" value="Cancel" class="ImageCancel">

				</div>

				<script type="text/javascript">
					d = document;
					ae = window.opener.activeEditor;
					aed = window.opener.activeEditor._frame;


					var jsobj = "<?php echo $_SESSION['obj']; ?>";
					var openerwin = window.opener;
					var oSel;

					ae = opener.activeEditor;
					modify = false;
					local = false;

					if (ae.GetType() == "Control") {
						modify = true;
						oSel = ae.GetSelectedElement();
					} else {
						oSel = ae.parentNode("A");
					}

					var imageAlign;
					var previousImage;
					var selectedImageEncoded;

					var folder = "";
					var roots = new Array();
					roots["image"] = "<?php echo $this->_GetImageDir(); ?>";
					roots["flash"] = "<?php echo $this->_GetFlashDir(); ?>";
					roots["media"] = "<?php echo $this->_GetMediaDir(); ?>";
					roots["dRoot"] = "<?php echo $_SERVER['DOCUMENT_ROOT']; ?>";

					// If DevEdit is running as part of SiteCenter, set the roots
					if("<?php echo $_SESSION["rp"]; ?>" != "")
					{
						roots[jsobj] = "<?php echo $mFolder; ?>";
						roots["dRoot"] = "<?php echo $mFolder; ?>";
					}

					var root = roots[jsobj];
					var pRoot = roots[jsobj];
					var dRoot = roots["dRoot"];

					var req;
					var url = "<?php echo $sPath; ?>";
					var what = "";
					var pPath = "";
					var re = /\/$/;
					var re1 = /^\//;
					var cancelled = false;
					var val = "";
					var func = "";
					var token = '<?php if (isset($_COOKIE["t"])) echo $_COOKIE["t"]; ?>';
					var oFolder = "";
					var fileList = Array();
					var selFile = "";
					var showThumbs = <?php echo (int) $this->ShowThumbNails(); ?>;
					var numObjects = 0;
					var selTab = <?php echo $tab; ?>;
					var last_preview_obj = null;
					var img_src = null; // absolute name

					var imagewidth = window.opener.maximagewidth;
					var imageheight = window.opener.maximageheight;
					var maxUploadFileSize = window.opener.maxUploadFileSize;

					var startPath = "<?php echo $this->_startPath; ?>";
					var startURL = "<?php echo $this->_startURL; ?>";

					var hiddenFiles64 = "<?php echo $this->_hidden_base64_encoded; ?>";

					function previewModify(sel)
					{
						if (!sel) {
							document.getElementById("prevDiv").innerHTML = "";
							return;
						}
						//if (last_preview_obj==sel)return;
						selectedImage = sel.src;
						switch (jsobj) {
							case "flash":
								if (sel.getAttribute("name2")) {
									src_for_preview = unescape(sel.getAttribute("name2"));
								} else {
									src_for_preview = sel.outerHTML;
								}
								break;
							case "image":
								src_for_preview = "<img src=" + selectedImage.replace(/ /g, "%20") + ">";
								break;
							case "media":
								if (sel.getAttribute("name2")) {
									src_for_preview = unescape(sel.getAttribute("name2"));
								} else {
									src_for_preview = sel.outerHTML;
								}
								break;
						}
						document.getElementById("prevDiv").innerHTML = src_for_preview;
						last_preview_obj = sel;

						var enlarge = document.getElementById("enlarge");
						if (navigator.userAgent.indexOf('MSIE') > -1) {
							dW = 310;
							dH = 140;
						} else {
							dW = 290;
							dH = 140;
						}
						if (enlarge){
							if (sel.width > dW || sel.height > dH) {
								enlarge.style.display = "";
								enlarge.style.position = "absolute";
								enlarge.style.left = 310;
								enlarge.style.top = 115;
							} else {
								enlarge.style.display = "none";
							}
						}
					}

					// Valid image extensions
					var imageTypes= new Array();
					imageTypes["image"] = '<?php echo implode(",", ValidExtensions("image")); ?>';
					imageTypes["flash"] = '<?php echo implode(",", ValidExtensions("flash")); ?>';
					imageTypes["media"] = '<?php echo implode(",", ValidExtensions("media")); ?>';

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

					function processReqChange()
					{
						// only if req shows 'loaded'
						if (req.readyState == 4) {
							// only if 'OK'
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

					var change_tab = false;

					function Tab(t)
					{
						selTab = t;

						currentImage = null;
						currentsrc = "";
						document.getElementById("enlarge").style.display = "none";

						if (change_tab) {
							oSel=null;
							document.getElementById("prevDiv").innerHTML = "";
						}

						var t1 = document.getElementById("tab1");
						var t2 = document.getElementById("tab2");
						var t3 = document.getElementById("tab3");
						var extText = document.getElementById("extText");
						var ub = document.getElementById("uploadbox");
						var b7 = document.getElementById("but7");
						ub.style.visibility = "visible";
						b7.style.display="";

						if (document.all) {
							dir = window.opener.deveditPath1
							var ifr = document.getElementById("prop");
						} else {
							dir = window.opener.deveditPath1
							var ifr = document.getElementById("prop");
						}
						switch(t) {
							case 0:
							{
								t1.src = "images/tab.active.png";
								t1.className = "tabOn imageTabOn"
								t2.className = "tabOff flashTabOff";
								t3.className = "tabOff mediaTabOff";
								jsobj = "image";
								ifr.src = dir+"/dialog/image_properties.php";
								extText.innerHTML = "External Image:";
								if (window.opener.disableImageUploading) {
									ub.style.visibility = "hidden";
								}
								if (window.opener.disableImageDeleting) {
									b7.style.display = "none";
								}
								break;
							}
							case 1:
							{
								t1.className = "tabOff imageTabOff"
								t2.className = "tabOn flashTabOn";
								t3.className = "tabOff mediaTabOff";
								jsobj = "flash";
								ifr.src = dir+"/dialog/flash_properties.php";
								extText.innerHTML = "External Flash File:";
								if (window.opener.disableFlashUploading) {
									ub.style.visibility = "hidden";
								}
								if (window.opener.disableFlashDeleting) {
									b7.style.display = "none";
								}
								break;
							}
							case 2:
							{
								t3.src = "images/tab.active.png";
								t1.className = "tabOff imageTabOff"
								t2.className = "tabOff flashTabOff";
								t3.className = "tabOn mediaTabOn";
								jsobj = "media";
								ifr.src = dir+"/dialog/media_properties.php";
								extText.innerHTML = "External Media File:";
								if (window.opener.disableMediaUploading) {
									ub.style.visibility = "hidden";
								}
								if (window.opener.disableMediaDeleting) {
									b7.style.display = "none";
								}
								break;
							}
						}

						root = roots[jsobj];
						pRoot = roots[jsobj];;
						pPath = "";
						dRoot = roots["dRoot"];

						document.getElementById("butInsert").value = "Insert "+jsobj.substr(0,1).toUpperCase()+jsobj.substr(1);

						ChangeFolder("", false);

						// Do we need to hide the set as background option?
						var but6 = document.getElementById("but6");
						var selImageLib = document.getElementById("selImageLib");

						if(t > 0) {
							but6.style.display = "none";
							selImageLib.style.display = "none";
						} else {
							but6.style.display = "";
							selImageLib.style.display = "";
						}
						change_tab = true;
					}

					function Sel(Obj, Folder)
					{
						folder = Folder;

						if(showThumbs == 1 && !(dRoot.replace(re, "") == root.replace(re, ""))) {
							j = 1;
						} else if(showThumbs == 0){
							j = 0;
						}

						for(i = j; i < imageI; i++) {
							if (document.getElementById("s_"+i) != null) {
								document.getElementById("s_"+i).style.backgroundColor = "white";
								document.getElementById("s_"+i).style.color = "black";

								if (showThumbs == 1) {
									document.getElementById("s_"+i).style.border = "solid 1px #ECE9D8";
								}
							}
						}

						Obj.style.color = "white";
						Obj.style.backgroundColor = "#C2D3FC";

						if(showThumbs == 1) {
							Obj.style.border = "solid 1px #294EA7";
						}
					}

					function ChangeFolder(Folder, PathIsGood)
					{
						var currDir = document.getElementById("currDir");

						// Reset the selected file/folder
						folder = "";

						if (!PathIsGood) {
							if (Folder == "..") {
								// Workout the .. path
								var u = pPath.split("/");
								var uPath = "";

								for (j = 0; j < u.length-1; j++) {
									uPath = uPath + u[j] + "/";
								}

								uPath = uPath.replace(re, "");

								if(uPath == "") {
									uPath = "/";
								}

								path = uPath;
							} else {
								path = root + "/" + Folder;
								path = path.replace("//", "/");
							}
						} else {
							path = Folder;
						}

						if(Folder == "")
						{
							switch(selTab)
							{
								case 0:
								{
									path = "<?php echo $this->_GetImageDir(); ?>";
									break;
								}
								case 1:
								{
									path = "<?php echo $this->_GetFlashDir(); ?>";
									break;
								}
								case 2:
								{
									path = "<?php echo $this->_GetMediaDir(); ?>";
									break;
								}
							}
						}

						imageI = 0;
						fList = document.getElementById("list");
						pPath = path.replace(re, "");

						// Use AJAX to get a list of new files/folders
						what = "FillList(req.responseText)";
						DoCallback("w=getFileList&p="+path+"&s="+selFile+"&t="+selTab);
						root = path;

						// Update the folder path
						zRoot = dRoot;
						zPath = pPath;

						zRoot = zRoot.replace(re, "");
						zPath = zPath.replace(zRoot, "");

						if(startPath != "/")
							zPath = startPath + zPath;

						if(zPath == "") {
							zPath = "/";
						}

						if (zPath.length > 36) {
							currDir.innerHTML = zPath.substring(0, 36) + "...";
						} else {
							currDir.innerHTML = zPath;
						}

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
						if (pPath.length > pRoot.length) {
							// Workout the .. path
							var u = pPath.split("/");
							var uPath = "";

							for (j = 0; j < u.length-1; j++) {
								uPath = uPath + u[j] + "/";
							}

							uPath = uPath.replace(re, "");

							if (uPath == "") {
								uPath = "/";
							}

							if (showThumbs == 1) {
								html = html + "<tr><td colspan='3'><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\"><img align=\"left\" hspace=\"5\" src=\"images/folder.gif\"><a class=Folder href=\"javascript:ChangeFolder('..', false)\">[..]</a></div></td></tr>";
							} else {
								html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '..')\"><img align=\"left\" hspace=\"5\" src=\"images/folder.gif\"><a class=Folder href=\"javascript:ChangeFolder('..', false)\">[..]</a></div></td></tr>";
							}
						}

						for(i = 0; i < l.length-1; i++) {
							var item = l[i].split("|");

							if (item[1] == "folder") {
								// It's a folder
								if (showThumbs == 1) {
									// Show a thumbnail
									numFolders++;

									if (numObjects++ % 3 == 0) {
										html = html + "<tr>";
									}

									// Do we need to truncate the folder name?
									if (item[0].length > 10) {
										title = item[0];
										desc = item[0].substring(0, 10) + "...";
									} else {
										title = "";
										desc = item[0];
									}

									html = html + "<td class='ThumbTD'><div title='" + title + "' onClick=\"Sel(this, '" + item[0] + "')\" id=\"s_" + (imageI++) + "\" class='ThumbDiv'><img src='images/bigfolder.gif' style='margin-left:8px; margin-top:8px'></div><div style='width:100%; text-align:center; font-size:11px'><a title='" + title + "' class='ThumbA' href=\"javascript:ChangeFolder('" + item[0] + "', false)\">"+desc+"</a></div></td>";

									if(numObjects % 3 == 0) {
										html = html + "</tr>";
									}
								} else {
									// Show a row
									html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '" + item[0] + "')\"><img align=\"left\" hspace=\"5\" src=\"images/folder.gif\"><a class=\"Folder\" href=\"javascript:ChangeFolder('" + item[0] + "', false)\">" + item[0].replace("\\", "") + "</a></div></td></tr>";
								}
							} else {

								// It's a file -- make sure its got a valid extension
								if(numFolders == 0) {
									numFolders = 1;
								}

								var tmp = item[0].split(".");
								ext = tmp[tmp.length-1];
								ext = ext.toLowerCase();

								if (imageTypes[jsobj].indexOf(ext) > -1) {
									// Store the file in the list array so we can use
									// the array to make sure the file doesn't exist when uploading

									fileList[fileList.length] = item[0];

									// Do we need to pre-select this image?
									if (item[0].indexOf("@") == 0) {
										item[0] = item[0].substring(1, item[0].length);
										scrTo = imageI;
										folder = item[0];

										if(showThumbs == 1) {
											// Show a thumbnail
											img = "";

											switch(selTab) {
												case 0:
												{
													img = HTTPPath(item[0]);
													break;
												}
												case 1:
												{
													img = "images/flash.gif";
													break;
												}
												case 2:
												{
													img = "images/media.gif";
													break;
												}
											}


											if (numObjects % 3 == 0) {
												if(numFolders > 0) {
													html = html + "</tr><tr>";
												} else {
													html = html + "<tr>";
												}
											}

											// Do we need to truncate the folder name?
											if (item[0].length > 10) {
												title = item[0];
												desc = item[0].substring(0, 10) + "...";
											} else {
												title = "";
												desc = item[0];
											}

											html = html + "<td class='ThumbTD'><div title='" + title + "' onClick=\"Sel(this, '" + item[0] + "'); SelImage('" + item[0] + "')\" id=\"s_" + (imageI++) + "\" class='ThumbDiv' style='color:white; background-color: #C2D3FC; border:solid 1px #294EA7'><img width='60' height='60' src='" + img + "'></div><div style='width:100%; text-align:center; font-size:11px'><a title='" + title + "' class='ThumbA' href=\"javascript:SelImage('" + item[0] + "')\">" + desc.replace("\\", "") + "</a></div></td>";

											if (numObjects % 3 == 0) {
												if(numFolders == 0) {
													html = html + "</tr>";
												}
											}

											numObjects++;
										} else {
											// Show a row
											img = "";

											switch(selTab) {
												case 0:
												{
													img = "image.gif";
													break;
												}
												case 1:
												{
													img = "flash1.gif";
													break;
												}
												case 2:
												{
													img = "media.gif";
													break;
												}
											}

											html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"background-color: #C2D3FC; padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '" + item[0] + "'); SelImage('" + item[0] + "')\"><img align=\"left\" hspace=\"5\" src=\"images/" + img + "\"><a class=\"Folder\" href=\"javascript:SelImage('" + item[0] + "')\">" + item[0].replace("\\", "") + "</a></div></td></tr>";
										}
									} else {
										if (showThumbs == 1) {

											// Show a thumbnail
											img = "";

											switch (selTab) {
												case 0:
												{
													img = HTTPPath(item[0]);

													if(startURL != "")
														img = startURL + img;

													break;
												}
												case 1:
												{
													img = "images/flash.gif";
													break;
												}
												case 2:
												{
													img = "images/media.gif";
													break;
												}
											}

											if (numObjects % 3 == 0) {
												if(numFolders > 0) {
													html = html + "</tr><tr>";
												} else {
													html = html + "<tr>";
												}
											}

											// Do we need to truncate the folder name?
											if(item[0].length > 10) {
												title = item[0];
												desc = item[0].substring(0, 10) + "...";
											} else {
												title = "";
												desc = item[0];
											}

											z = imageI;

											html = html + "<td class='ThumbTD'><div title='" + title + "' onClick=\"Sel(this, '" + item[0] + "'); SelImage('" + item[0] + "')\" id=\"s_" + (imageI++) + "\" class='ThumbDiv'><img width='60' height='60' src='" + img + "'></div><div style='width:100%; text-align:center; font-size:11px'><a title='" + title + "' class='ThumbA' href='javascript:void(0)' onClick=\"SelImage('" + item[0] + "'); Sel(document.getElementById('s_" + z + "') , '" + item[0] + "')\">" + desc.replace("\\", "") + "</a></div></td>";

											if(numObjects % 3 == 0) {
												if(numFolders == 0) {
													html = html + "</tr>";
												}
											}

											numObjects++;
										} else {
											// Show a row
											img = "";

											switch(selTab) {
												case 0:
												{
													img = "image.gif";
													break;
												}
												case 1:
												{
													img = "flash1.gif";
													break;
												}
												case 2:
												{
													img = "media.gif";
													break;
												}
											}

											html = html + "<tr><td><div id=\"s_" + (imageI++) + "\" style=\"padding-top: 3px; padding-bottom: 2px\" onClick=\"Sel(this, '" + item[0] + "'); SelImage('" + item[0] + "')\"><img align=\"left\" hspace=\"5\" src=\"images/" + img + "\"><a class=\"Folder\" href=\"javascript:SelImage('" + item[0] + "')\">" + item[0].replace("\\", "") + "</a></div></td></tr>";
										}
									}
								}
							}
						}

						if (numObjects == 1) {
							for (n = 0; n < 3; n++)  {
								html = html + "<td class='ThumbTD'></td>";
							}

							html = html + "</tr>";
						} else {
							if (numObjects % 3 != 0) {
								k = (numObjects % 3) - 1;

								for (n = 0; n < k; n++) {
									html = html + "<td class='ThumbTD'></td>";
								}

								html = html + "</tr>";
							}
						}

						html = html + "<tr><td colspan='3' height='10'></td></tr>";
						html = html + "</table>";

						fList.innerHTML = html;

						// Scroll to the selected file;
						if (showThumbs == 1) {
							if (scrTo > 9) {
								window.setTimeout("fList.scrollTop = ((scrTo/3) * 80);", 100);
							}
						} else {
							window.setTimeout("fList.scrollTop = (scrTo * 20);", 100);
						}
					}

					function SelImage(Img)
					{
						var extImg = document.getElementById("externalImage");

						extImg.value = "http://";
						img = pPath + "/" + Img;
						img = img.replace(dRoot, "");
						img_src = img;

						if(startURL != "")
							img = startURL + img;

						SetSize(img);
					}

					function HTTPPath(Img)
					{
						img = pPath + "/" + Img;
						img = img.replace(dRoot, "");
						return img;
					}

					function NewFolder1()
					{
						Inp("Enter a new folder name below:", "", "NewFolder2();");
					}

					function NewFolder2()
					{
						// Create a new folder using AJAX
						if (val == "") {
							alert("Please enter a folder name.");
							Inp("Enter a new folder name below:", "", "NewFolder2();");
						} else {
							// Make sure the folder name is valid
							var folderName = val;
							var fRe = /^[a-zA-Z0-9_]+$/;

							if(folderName.match(fRe)) {
								what = "NewFolder3(req.responseText)";
								DoCallback("w=createNewFolder&p="+pPath+"&f="+folderName);
							} else {
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
						DoCallback("w=getFileList&p="+path+"&t="+selTab);

						// Clear the list of files/folders
						fList.innerHTML = "";
					}

					function Inp(Msg, Val, Func)
					{
						var i = document.getElementById("input");
						var m = document.getElementById("inputText");
						var t = document.getElementById("inputVal");

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

						i.style.display = "none";
						val = t.value;
						eval(func);
					}

					function InpCancel()
					{
						var i = document.getElementById("input");

						i.style.display = "none";
						cancelled = true;
						func = "";
					}

					function InpKey(e)
					{
						var key = window.event ? e.keyCode : e.charCode;
						if (key == 13) {
							InpOK();
						}

						if ( key == 27) {
							//key == 0
							InpCancel();
						}
					}

					function Rename()
					{
						// Show the dialog to rename the folder
						if(folder == "" || folder == "..") {
							alert("Please choose a file or folder to rename.");
						} else {
							oFolder = folder;
							Inp("Enter a new folder name below:", folder, "Rename2();");
						}
					}

					function Rename2()
					{
						// Create a new folder using AJAX
						if (val == "") {
							alert("Please enter a folder name.");
							Inp("Enter a new folder name below:", folder, "Rename2();");
						} else {
							// Make sure the folder name is valid
							var folderName = val;
							var fRe = /^[a-zA-Z0-9_\.]+$/;

							if(folderName.match(fRe)) {
								what = "Rename3(req.responseText)";
								DoCallback("w=renameFileFolder&p="+pPath+"&f="+folderName+"&o="+oFolder);
							} else {
								alert("Please enter a valid folder name containing only letters and numbers only.");
								Inp("Enter a new folder name below:", folder, "Rename2();");
							}
						}
					}

					function Rename3(Response)
					{
						previewModify();

						alert(Response);
						imageI = 0;

						what = "FillList(req.responseText)";
						DoCallback("w=getFileList&p="+path+"&t="+selTab);

						// Clear the list of files/folders
						fList.innerHTML = "";
					}

					function Delete()
					{
						// Show the dialog to rename the folder
						if (folder == "" || folder == "..") {
							alert("Please choose a file or folder to delete.");
						} else {
							if(confirm("Are you sure you want to delete the selected file/folder '"+folder+"'?")) {
								what = "Delete2(req.responseText)";
								DoCallback("w=deleteFileFolder&p="+pPath+"&f="+escape(folder));
							}
						}
					}

					function Delete2(Response)
					{
						previewModify();

						alert(Response);
						imageI = 0;

						what = "FillList(req.responseText)";
						DoCallback("w=getFileList&p="+path+"&t="+selTab);

						// Clear the list of files/folders
						fList.innerHTML = "";
					}

					function insertExtImage()
					{
						var sel = document.getElementById("externalImage");
						var prev = document.getElementById("previewImage");
						var prevDiv = document.getElementById("prevDiv");

						if (sel.value == "" || sel.value == "http://") {
							alert("Please enter a valid image location.");
							sel.focus();
							sel.select();
						} else {
							source = sel.value.replace(/ /g, "%20");
							prevDiv.innerHTML = "<img src='"+source+"'>";
							SetSize(source);
						}
					}

					function CheckExtKey(e)
					{
						var key = window.event ? e.keyCode : e.which;

						if(key == 13) {
							insertExtImage();
						}
					}

					function  refreshPreview(htmltext)
					{
						document.getElementById("prevDiv").innerHTML = htmltext;
					}

					var currentImage = null;
					var currentsrc = "";

					function loadImage(srcx)
					{
						if (jsobj=="image") {
							w = currentImage.width;
							h = currentImage.height;
							markimg = currentImage.src;
						} else {
							w = 100;
							h = 100;
							currentImage.width = w;
							currentImage.height = h;
							markimg = currentsrc;
						}

						switch (jsobj)
						{
							case "flash":
							{
								src_for_preview = "<embed src='" + markimg.replace(/ /g, "%20") + "' quality='high' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' bgcolor='#009933' WMODE=transparent></embed>"
								currentImage.name2 = escape(src_for_preview);
								break;
							}
							case "image":
							{
								src_for_preview = "<img src=" + markimg.replace(/ /g, "%20") + " width="+w+" height="+h+">";
								break;
							}
							case "media":
							{
								src_for_preview = '<embed width=100 height=100 pluginspage="http://www.microsoft.com/Windows/MediaPlayer" type="application/x-mplayer2" showcontrols="1" autostart="1" src=' + markimg.replace(/ /g, "%20") + ' name="MediaPlayer1" />';
								currentImage.name2 = escape(src_for_preview);
								break;
							}
						}

						document.getElementById("prevDiv").innerHTML = src_for_preview;

						// Set the width and height of an image
						if (document.all) {
							var popup_win = document.frames["prop"];
							if(popup_win)popup_win.setProp(currentImage);
						} else {
							document.getElementById("prop").contentWindow.setProp(currentImage);
						}

						TogglePreview();
					}

					function SetSize(Img)
					{
						currentImage = new Image();
						currentImage.src = Img;

						switch(jsobj)
						{
							case "image":
							{
								currentImage.onload = loadImage;
								break;
							}
							default:
							{
								currentsrc = Img;
								break;
							}
						}

						loadImage();
					}

					function BadPreview(Img)
					{
						var w = document.getElementById("image_width");
						var h = document.getElementById("image_height");

						alert("The file '"+Img.src+"' could not be loaded.");
						w.value = "";
						h.value = "";
					}

					function setBackground()
					{
						if (!currentImage) {
							currentImage = oSel;
						}
						var prev = currentImage;

						if (currentImage == null) {
							alert("Please choose a file first.");
							return false;
						} else {
							if (prev.src == "") {
								alert("Please choose a file first.");
								return false;
							} else {
								if (confirm("Are you sure you wish to set this image as the page background image?")) {
									aed.body.background = prev.src;
									window.close();
								}
							}
						}
					}

					function insertImage()
					{
						var error = 0;
						var extImg = document.getElementById("externalImage");

						opener.activeEditor.Focus();

						ctrlName = opener.parent.frames[0].name;

						// Path type: 0 = full, 1 = absolute
						pathType = opener.pathType;

						if (!currentImage) {
							currentImage = oSel;
						}

						if (!currentImage || (currentImage.src == "" && jsobj=="image") ) {
							alert("Please choose a file first.");
							return false;
						} else {
							if (extImg.value != "http://" && extImg.value != "") {
								imgSrc = extImg.value;
							} else {
								imgSrc = currentImage.src;
								if (pathType==1) {
									imgSrc = img_src;
									imgSrc = startPath + imgSrc;
								}
							}

							if (currentImage.getAttribute("name2") ){
								imgSrc = document.getElementById("prevDiv").firstChild.src;
							}

							var o = imgSrc;

							if (document.all) {
								document.frames["prop"].createObj(o);
							} else {
								document.getElementById("prop").contentWindow.createObj(o);
							}
							window.close();
							return true;
						}
					}

					function ToggleThumbs()
					{
						var but5 = document.getElementById("but5");
						if(showThumbs == 1) {
							showThumbs = false;
							setcookie("iThumbs", 0, 365);
							but5.src = "images/thumb.gif";
						} else {
							if (showThumbs !==-1){
								showThumbs = true;
								setcookie("iThumbs", 1, 365);
							}
							but5.src = "images/thumbon.gif";
							but5.className = "ButtonOn";
						}

						ChangeFolder("", false);
					}

					function ChangeLib(Lib)
					{
						lPath = dRoot + "/" + Lib;
						lPath = lPath.replace("//", "/");

						previewModify();

						ChangeFolder(lPath, true);
					}

					function getexpirydate(nodays)
					{
						var UTCstring;
						Today = new Date();
						nomilli=Date.parse(Today);
						Today.setTime(nomilli+nodays*24*60*60*1000);
						UTCstring = Today.toUTCString();
						return UTCstring;
					}

					function getcookie(cookiename)
					{
						var cookiestring=""+document.cookie;
						var index1=cookiestring.indexOf(cookiename);
						if (index1==-1 || cookiename=="") {
							return "";
						}
						var index2=cookiestring.indexOf(';',index1);
						if (index2==-1) {
							index2=cookiestring.length;
						}
						return unescape(cookiestring.substring(index1+cookiename.length+1,index2));
					}

					function setcookie(name,value,duration)
					{
						cookiestring=name+"="+escape(value)+";EXPIRES="+getexpirydate(duration);
						document.cookie=cookiestring;

						if(!getcookie(name)) {
							return false;
						} else {
							return true;
						}
					}

					function TogglePreview()
					{
						// If the preview image is large than its container,
						// show an absolutely positioned image

						var prevDiv = document.getElementById("prevDiv");
						prev = currentImage;
						var enlarge = document.getElementById("enlarge");

						if (navigator.userAgent.indexOf('MSIE') > -1) {
							dW = 310;
							dH = 140;
						} else {
							dW = 290;
							dH = 140;
						}

						if (prev.width > dW || prev.height > dH) {
							enlarge.style.display = "";
							enlarge.style.position = "absolute";
							enlarge.style.left = 310;
							enlarge.style.top = 115;
						} else {
							enlarge.style.display = "none";
						}
					}

					// Is there a persisted thumbnail value?
					if (showThumbs == -1){
					cv = getcookie("iThumbs");
					if(cv == 0) {
						showThumbs = true;
					} else if(cv == 1) {
						showThumbs = false;
					}
					if (cv != "") {
						ToggleThumbs();
					}
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

					var imageI = 0;

				</script>

				<a href="javascript:void(0)" onClick="window.open(document.getElementById('prevDiv').firstChild.src)"><img border="0" id="enlarge" style="display:none" src="images/enlarge.gif" title="Click here to load preview in new window"></a>

			</body>
			</html>
		<?php
		}
	}

?>

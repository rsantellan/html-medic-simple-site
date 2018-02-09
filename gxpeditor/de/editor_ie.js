// Name: Editor class
// Info: Contain all editors methonds for IE.

// Name: Special commands file
// Info: Contain special commands(these commands don't directly support by standard editor component) for IE.

// Save command

var Save = function()
{
	this.Name = 'save' ;
};

Save.prototype.execute = function(isUpdate)
{
	if (loading_in_progress && !isUpdate){
		parent.document.getElementById(ae.InstanceName+"_html").value = parent.document.getElementById(ae.InstanceName+"_input").value;
		parent.document.getElementById(ae.InstanceName+"_save").click();			
		loading_in_progress = false;
		return;
	}
	try{
		ae = window.activeEditor;
		aed = ae._frame;

		var code = "";
		if (ae.mode=="source") {
			code = aed.body.innerText;
		} else {
			ae.commands.getCommand("Paragraph").hideChar();
			code = ae.HTMLTags[1]+img2embed(removeWrap(aed.documentElement.innerHTML))+ae.HTMLTags[3];
			ae.commands.getCommand("Paragraph").showChar();
			code = fix_bug_06(code);
			code = removeBase(code);
			code = removeSpellSpan(code);
		}

		if (useXHTML==1) {
			code = getXHTML(code);
		}

		if (ae.isbegin && ae.isend){
			code = replace_editable(code);
		}

		re = /&amp;/g;
		code = code.replace(re,'&');


		if (pathType == "1") {
			replaceImage = 'src="';
			code = code.replace(re3,replaceImage);
		}

		code = ConvertSSLImages(code);
		code = fix_bug_03(code);

		if (ae.mode=="edit") {
			code = fix_bug_04(code);
			code = fix_bug_05(code);
		}

		if (ae.mode=="source") {
			code = _de_save_special_char2(code);
		} else {
			code = _de_save_special_char(code);
		}
		
		code = restore_doctype(code);
		
		parent.document.getElementById(ae.InstanceName+"_html2").value = code;

		if (docType!=1 && ae.mode=="edit"){ // for snippet mode
			h = code.match(BodyContents);
			code = h[2];
		}
		parent.document.getElementById(ae.InstanceName+"_html").value = formatSaveCode(code);
		if (isUpdate!=="no") {
			parent.document.getElementById(ae.InstanceName+"_save").click();
		}
	} catch(e){
	}
};

Save.prototype.getMode = function()
{
	return OFF;
};
// ***** end of Save command *****


// Paste as Plain Text
var PasteText = function()
{
	this.Name = "PasteText";
};


PasteText.prototype.execute = function()
{
	try {
		var s = clipboardData.getData("Text");
		s = s.replace( /\n/g, '<BR>' ) ;
		window.activeEditor._inserthtml(s) ;
	} catch(e){}	
};

PasteText.prototype.getMode = function()
{
	ae = window.activeEditor;
	try
	{
		if (!ae._frame.queryCommandEnabled( "paste" ) ) {
			return DISABLED ;
		} else {
			return ae._frame.queryCommandState( "paste" ) ? ON : OFF ;
		}
	}
	catch ( e )	{
		return OFF ;
	}
};

// Source mode class
var SourceCommand = function()
{
	this.Name = "SourceMode";
};

SourceCommand.prototype.getMode = function()
{
};

SourceCommand.prototype.execute = function()
{
	ToolbarSets.SwitchToolbarSet("_source");

	var ae = window.activeEditor;
	var e = ae._frame;

	ae.commands.getCommand("Spellcheck").off();
	ae.commands.getCommand("Paragraph").hideChar();

	var fr = document.getElementById(ae.InstanceName+"_frame");

	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").reset(true);
	}

	document.getElementById("ePath").style.display="none";
	if (fr.style.display=="none") {
		var Ifr = document.getElementById(ae.InstanceName+"_preview");
		fr.style.display="";
		Ifr.style.display="none";
	}

	if (ae.mode=="edit") {
		if (docType==1) { // DE_DOC_TYPE_HTML_PAGE
			var c = ae.HTMLTags[1] + ae._frame.documentElement.innerHTML + ae.HTMLTags[3];
			if (useXHTML==1) {
				iHTML = getXHTML(c);
			} else {
				iHTML = c;
			}
			iHTML = fix_bug_06(iHTML);
		} else{
			var c = ae.HTMLTags[1] + ae._frame.documentElement.innerHTML + ae.HTMLTags[3];
			ae.part = c.match(BodyContents);
			if (useXHTML==1) {
				iHTML = getXHTML(e.body.innerHTML);
			} else {
				iHTML = e.body.innerHTML;
			}
		}

		re = /&amp;/g;
		iHTML = iHTML.replace(re,'&');
		iHTML = fix_bug_03(iHTML);
		iHTML = fix_bug_04(iHTML);
		iHTML = fix_bug_05(iHTML);
		iHTML = removeBase(iHTML);
		addLineNumber(iHTML);

		// for nice looking
		e.body.style.fontFamily = "Verdana";
		e.body.style.fontSize = "11px";
		e.body.color = "#000000";
		e.body.bgColor = '#FFFFFF';
		e.body.style.text = '#000000';
		e.body.style.background = '';
		e.body.style.marginTop = '10px';
		e.body.style.marginLeft = '10px';
		e.body.style.textAlign = 'left';

		// switch to source view
		e.body.innerText = img2embed(iHTML) ;
		var c=e.body.innerHTML;
		c = _de_parse_special_char(c);
		e.body.innerHTML = fix_bug_01(addEditTag(colourCode(formatCodeIE(restore_doctype(c)))));
	}

	ae.mode="source";
	ae.lastmode="source";
	ae.calculateNewSize();
	buffer["source"].devhistory.position = 0;
	buffer["source"].saveHistory(true);
	ae.Focus();
	set_cursor_at_begin();
	fix_bug_02();
};

function remove_doctype(html){
return html;
}
function restore_doctype(html){
return html;
}

// Edit mode
var EditCommand = function()
{
	this.Name = "EditMode";
};

EditCommand.prototype.getMode = function()
{
};

EditCommand.prototype.execute = function()
{
	removeLineNumber();
	var ae = window.activeEditor;
	var e = ae._frame;

	var fr = document.getElementById(ae.InstanceName+"_frame");
	document.getElementById("ePath").style.display="block";

	if (fr.style.display=="none") {
		var Ifr = document.getElementById(ae.InstanceName+"_preview");
		fr.style.display="";
		Ifr.style.display="none";
	}

	var headTag = /<\/head\s*>/i;
	if (ae.mode=="source") {
		//switch back to regular view
		iText = e.body.innerText;

		var addbase="";
		add_to_head = "";
		if (docType==1) { // DE_DOC_TYPE_HTML_PAGE
			if (myBaseHref && ae.useBase) {
				add_to_head += '<base href="'+myBaseHref+'" />';
			}
			var html = iText.replace(headTag,add_to_head+'<link href="'+ae.skinPath+'borders.css" type="text/css" rel="stylesheet">'+addbase+'</head>');
			var rh = html.match(HeadContents);
			if (rh) {
				ae.headhtml = rh[2];
			}
			html = fix_bug_06(html);
		} else {
			var html = ae.part[1] + iText + ae.part[3];

			var add_to_head = '<link disabled href="'+ae.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (ae.snippetCSS) {
				add_to_head += '<link href="'+ae.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref) {
				add_to_head += '<base href="'+myBaseHref+'" />';
			}

			newhtml = html.match(HeadContents);
			html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
		}
		ae.writeC(remove_doctype(embed2img(removeEditTag(html)),1),1);
	}

	ae.mode="edit";
	ae.lastmode="edit";
	ae.calculateNewSize();	
	if (ae.showborders==ON){
		ae.commands.getCommand("Showborders").set(false);
	} else {
		ae.commands.getCommand("Showborders").reset(false);
	}
	ae.commands.getCommand("Paragraph").showChar();
	ToolbarSets.SwitchToolbarSet(toolbarmode);
	ae.doStyles();
	ae.Focus();
	fix_bug_02();
	checkImgLoaded();
};

// Preview mode class
var PreviewCommand = function()
{
	this.Name = "PreviewMode";
};

PreviewCommand.prototype.getMode = function()
{
};

PreviewCommand.prototype.execute = function()
{
	removeLineNumber();
	ToolbarSets.SwitchToolbarSet("_preview");

	var ae = window.activeEditor;
	var aed = ae._frame;
	var e = document.getElementById(ae.InstanceName+"_frame");
	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").reset(false);
	}
	ae.commands.getCommand("Paragraph").hideChar();

	document.getElementById("ePath").style.display="none";
	var Ifr = document.getElementById(ae.InstanceName+"_preview");
	e.style.display="none";
	Ifr.style.display="";

	var addbase = "";
	if (myBaseHref && ae.useBase) {
		addbase += '<base href="'+myBaseHref+'" />';
	}	
	if (ae.mode=="source"){
		if (docType==1){ // DE_DOC_TYPE_HTML_PAGE
			var c = addbase+aed.body.innerText;
		} else {
			var bodyhtml = addbase+aed.body.innerText;
			var c = ae.part[1] + bodyhtml + ae.part[3];
		}
		c = img2embed22(c);
	} else{
		var c = "<html>" + img2embed2(ae._frame.documentElement.innerHTML)+"</html>";
		c = img2embed22(img2embed2(c));
	}

	window.frames[ae.InstanceName+"_preview"].document.write("<html>"+c.replace(/(&lt;([\s\S]*?)borders.css([\s\S]*?)&gt;)/gi,'') + "</html>");
	checkImgLoaded(window.frames[ae.InstanceName+"_preview"].document);
	window.frames[ae.InstanceName+"_preview"].document.close();
	ae.calculateNewSize("preview");	
	ae.lastmode="preview";
	window.frames[ae.InstanceName+"_preview"].focus();
};


function clearCode(code)
{
	code = code.replace(/[”“]/gi,'"');
	code = code.replace(/[‘’]/gi,"'");
	code = code.replace(/<([\w]+) class=([^ |>]*)([^>]*)/gi, "<$1$3");
	code = code.replace(/<([\w]+) style="([^"]*)"([^>]*)/gi, "<$1$3");
	code = code.replace(/<\\?\??xml[^>]>/gi, "");
	code = code.replace(/<\/?\w+:[^>]*>/gi, "");
	code = code.replace(/<p([^>])*>(&nbsp;)*\s*<\/p>/gi,"");
	code = code.replace(/<span([^>])*>(&nbsp;)*\s*<\/span>/gi,"");
	code = code.replace(/<b([^>])*>(&nbsp;)*\s*<\/b>/gi,"");	
	code = code.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	code = code.replace( /\s*mso-[^:]+:[^;"]+;?/gi, "" ) ;
	code = code.replace(/<\\?\?xml[^>]*>/gi, "") ;
	code =  code.replace( /\s*style="\s*"/gi, '' ) ;
	code = code.replace( /<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;' ) ;
	code = code.replace( /<SPAN\s*[^>]*><\/SPAN>/gi, '' ) ;

	code = code.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
	code = code.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
	code = code.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
	
	return code;
}

// Clear Code command
var ClearCodeCommand = function()
{
	this.Name = 'ClearCode' ;
};

ClearCodeCommand.prototype.execute = function()
{
	if (confirm("Are you sure you want to clean your HTML code?")) {
		ae = window.activeEditor;
		code = ae._frame.body.innerHTML;
		code = clearCode(code);
		ae._frame.body.innerHTML = code;
		ae._window.focus();
	}
};

ClearCodeCommand.prototype.getMode = function()
{
	if (window.activeEditor.isbegin && window.activeEditor.isend) {
		return DISABLED;
	}
	return OFF;
};


// Fullscreen class
var FullscreenCommand = function()
{
	this.Name = 'Fullscreen' ;
	ae = window.activeEditor;
	e = parent.document.getElementById(ae.InstanceName+"main");
	this.oldw = e.style.width;
	this.oldh = e.style.height;
};

FullscreenCommand.prototype.changemode = function(str,par, val)
{
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if((idx>=0)&&(idx2==-1)) {
		idx2=str.length;
	}
	return str.substring(0,idx+par.length+1) + val + str.substring(idx2,str.length);
};

FullscreenCommand.prototype.execute = function()
{
	ae = window.activeEditor;
	e = parent.document.getElementById(ae.InstanceName+"main");
	e1 = document.getElementById(ae.InstanceName+"main1");

	if (ae.fullscreen == OFF) {
		if (parent.document.documentElement && parent.document.documentElement.clientWidth) {
			clW = parent.document.documentElement.clientWidth;
			clH = parent.document.documentElement.clientHeight;
			sL = parent.document.documentElement.scrollLeft;
			sT = parent.document.documentElement.scrollTop;
			if (clH==0)clH = parent.document.body.clientHeight;
		} else {
			clW = parent.document.body.clientWidth;
			clH = parent.document.body.clientHeight;
			sL = parent.document.body.scrollLeft;
			sT = parent.document.body.scrollTop;
		}
		w = clW;
		h = clH;

		e1.style.height = "100%";
		e.style.position = 'absolute';
		e.style.left = sL;
		e.style.top = sT;
		e.style.width = w;
		e.style.height = h;
		ae.fullscreen=ON;
		ae.href = this.changemode(ae.href,"sizemode","on");
	} else {
		e.style.position = '';
		e.style.left = 0;
		e.style.top = 0;
		e.style.width = ae.oldw;
		e.style.height = ae.oldh;
		ae.fullscreen=OFF;
		ae.href = this.changemode(ae.href,"sizemode","off");
	}
	ae.calculateNewSize();
	try {ae._frame.designMode = "On";}catch(e){}
	ToolbarSets.Redraw();
	fix_bug_02();
	try {ae.Focus();}catch(e){}
};

FullscreenCommand.prototype.getMode = function()
{
	if (window.activeEditor.fullscreen==ON) {
		return ON;
	} else {
		return OFF;
	}
};


// InsertTextBox class
var InsertTextBox = function()
{
	this.Name = 'Inserttextboxe' ;
};

InsertTextBox.prototype.execute = function()
{
		ae = window.activeEditor;
		ae._inserthtml("<table id=de_textBox style='position:absolute;'><tr><td>Text box</td></tr></table>");
		textBox = ae._frame.getElementById("de_textBox");
		textBox.removeAttribute("id");
		ae._window.focus();
};

InsertTextBox.prototype.getMode = function()
{
	return OFF;
};

// Show borders
var ShowBordersCommand = function()
{
	this.Name = 'Showborders' ;
};

// function for set style
var el = new Object;
el.id 		= [];
el.className= [];

function setClassForInput()
{
	var elements = window.activeEditor._frame.getElementsByTagName("INPUT");
	for(var i = 0; i < elements.length; i++) {
		if (elements.item(i).type.toUpperCase()!="HIDDEN") {
			continue;
		}
		el.id[el.id.length] = elements.item(i);
		el.className[el.className.length] = elements.item(i).getAttribute("className");
		elements.item(i).className = "de_style_input";
	}
}

function setClassForAnchor()
{
	var elements = window.activeEditor._frame.getElementsByTagName("A");
	for(var i = 0; i < elements.length; i++) {
		if (!elements.item(i).name) {
			continue;
		}
		el.id[el.id.length] = elements.item(i);
		el.className[el.className.length] = elements.item(i).getAttribute("className");
		elements.item(i).className = "de_style_anchor";
	}
}


function resetClassForAll()
{
	for(var i = 0; i < el.id.length; i++) {
		el.id[i].className = el.className[i];
		if (!el.className[i]) el.id[i].removeAttribute("className");
	}
	el.id.length=0;
	el.className.length=0;
}


ShowBordersCommand.prototype.switchCSS = function(on)
{
	ae = window.activeEditor;
	var sheets = ae._frame.styleSheets;
	if(sheets.length > 0) {
		for(var x = 0; x <= sheets.length-1; x++) {
			if (sheets[x].href.indexOf(border_css_file)>=0) {
				sheets[x].disabled = on;
				return;
			}
		}
	}
};

ShowBordersCommand.prototype.set = function()
{
	ae = window.activeEditor;
	var sheets = ae._frame.styleSheets;
	if (el.id&&el.id.length>0) {
		resetClassForAll();
	}
	setClassForInput();
	setClassForAnchor();
	this.switchCSS(false);
};

ShowBordersCommand.prototype.reset = function()
{
	ae = window.activeEditor;
	var sheets = ae._frame.styleSheets;
	this.switchCSS(true);
	resetClassForAll();
};

ShowBordersCommand.prototype.execute = function(ignore)
{
	ae = window.activeEditor;
	if (ae.showborders==OFF) {
		if(ignore!==true) {
			ae.showborders=ON;
		}
		this.set();
	} else {
		this.reset();
		if (ignore!==true) {
			ae.showborders=OFF;
		}
	}
};

ShowBordersCommand.prototype.getMode = function()
{
	ae = window.activeEditor;
	return ae.showborders;
};

// paste from MS Word
var PasteFromMSWord = function()
{
	this.Name = 'pastefrommsword' ;
	this.mode = OFF;
};

PasteFromMSWord.prototype.execute = function()
{
	window.activeEditor.Focus();
	var oDiv = document.getElementById( '__HiddenDiv' ) ;

	if ( !oDiv ) {
		var oDiv = document.createElement( 'DIV' ) ;
		oDiv.id = '__HiddenDiv' ;
		oDiv.style.visibility	= 'hidden' ;
		oDiv.style.overflow		= 'hidden' ;
		oDiv.style.position		= 'absolute' ;
		oDiv.style.width		= 1 ;
		oDiv.style.height		= 1 ;

		document.body.appendChild( oDiv ) ;
	}

	oDiv.innerHTML = '' ;
	var oTextRange = document.body.createTextRange() ;
	oTextRange.moveToElementText( oDiv ) ;
	oTextRange.execCommand( 'Paste' ) ;
	var sData = oDiv.innerHTML ;
	oDiv.innerHTML = '' ;
	code = clearCode(sData);
	window.activeEditor.insertHTML( code ) ;
};


PasteFromMSWord.prototype.getMode = function()
{
	ae = window.activeEditor;
	try
	{
		if (!ae._frame.queryCommandEnabled( "paste" ) ) {
			return DISABLED ;
		} else {
			return ae._frame.queryCommandState( "paste" ) ? ON : OFF ;
		}
	}
	catch ( e ) {
		return OFF ;
	}
};
// ***** end of [paste from MS Word] ******


// Undo command
var Undo = function(modename)
{
	this.Name = 'undo';
	this.mode = modename;
};

Undo.prototype.execute = function()
{
	var ae = window.activeEditor;
	buffer[ae.mode].goHistory(-1);
	ae._window.focus();
};

Undo.prototype.getMode = function(){
	var ae = window.activeEditor;
	if ((buffer[ae.mode].devhistory.data.length <= 1) || (buffer[ae.mode].devhistory.position <= 0)) {
		return DISABLED;
	} else {
		return OFF;
	}
};

// Redo command
var Redo = function(modename)
{
	this.Name = 'undo';
	this.mode = modename;
};

Redo.prototype.execute = function()
{
	var ae = window.activeEditor;
	buffer[ae.mode].goHistory(1);
	ae._window.focus();
};

Redo.prototype.getMode = function()
{
	var ae = window.activeEditor;
	if ((buffer[ae.mode].devhistory.position >= buffer[ae.mode].devhistory.data.length-1) || (buffer[ae.mode].devhistory.data.length == 1)) {
		return DISABLED;
	} else {
		return OFF;
	}
};

// Name: Buffer class
// Info: buffer for undo/redo.

var URBuffer = function()
{
	var devhistory = new Object;
	devhistory.data = [];
	devhistory.position = 0;
	devhistory.bookmark = [];
	devhistory.max = _de_max_history_item;
	this.devhistory = devhistory;
};

URBuffer.prototype.saveHistory = function(incPosition)
{
	ae = window.activeEditor;
	aed = ae._frame;
	var recpos;

	try {
		if (this.devhistory.data[this.devhistory.data.length -1] != "<html>"+aed.documentElement.innerHTML+"</html>") {

			if (this.devhistory.data.length >= this.devhistory.max) {
				if (this.devhistory.position==0){
					this.devhistory.data.length = 0;
					this.devhistory.bookmark.length = 0;
				} else {
					this.devhistory.data.shift();
					this.devhistory.bookmark.shift();
					this.devhistory.position--;
				}
			}
			recpos = this.devhistory.data.length;

			this.devhistory.data[recpos] = '<html>'+aed.documentElement.innerHTML+'</html>';

			if (ae.GetType() != "Control") {
				this.devhistory.bookmark[recpos] = aed.selection.createRange().getBookmark();
			} else {
				oControl = aed.selection.createRange();
				this.devhistory.bookmark[recpos] = oControl(0);
			}

			if (!incPosition) {
				this.devhistory.position++;
			}
		}
	} catch (e){}
};

URBuffer.prototype.goHistory = function(value)
{
	ae = window.activeEditor;
	aed = ae._frame;

	// undo
	if (value == -1) {
		if (this.devhistory.position != 0) {
			this.devhistory.position--;
			ae.writeC(this.devhistory.data[this.devhistory.position]);
			this.setHistoryCursor();
		}

	// redo
	} else {

		if (this.devhistory.position < this.devhistory.data.length -1) {
			this.devhistory.position++;
			ae.writeC(this.devhistory.data[this.devhistory.position]);
			this.setHistoryCursor();
		}
	}
	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").set(true);
	} else {
		ae.commands.getCommand("Showborders").reset(true);
	}
}

URBuffer.prototype.setHistoryCursor = function()
{
	ae = window.activeEditor;
	aed = ae._frame;

	var range;
	if (this.devhistory.bookmark[this.devhistory.position]) {
		range = aed.body.createTextRange();
		if (this.devhistory.bookmark[this.devhistory.position] != "[object]") {
			if (range.moveToBookmark(this.devhistory.bookmark[this.devhistory.position])) {
				doSave = 1;
				range.select();
				doSave = 0;

			}
		}
	}
};

var buffer = new Array();
buffer["edit"] = new URBuffer();
buffer["source"] = new URBuffer();

var Editor = function( instanceName, width, height, skinName)
{
	window.activeEditor	= this;

	// Properties
	this.InstanceName	= instanceName ;
	this.Value			= '' ;
	this.Width			= width;
	this.Height			= height;
	this.skinName		= skinName ;
	this.part			= null;

	// auxiliary properties
	this._frame			= false;
	this.mode			= "edit";
	this.lastmode		= "edit";
	this.showborders	= OFF;
	this.customLink		= CustomLink;
	this.tempWin		= null;
	this.tempEl;
	this.arr			= null;
	this.toolbarpos		= 0;
	this.unlock			= false;
	this.skinPath		= serverurl + deveditPath1 + '/'+skinPath;
	this.snippetCSS		= snippetCSS;
	this.selectedtag	= null;
	this.lastinsert	= null;
	this.editable		= true;
	this.href			= window.location.href;
	this.norefresh		= false;
	this.initHTML		= "";
	this.use_old_base	= false;
	this.disableTabs	= false;
	this.useBase		= false;
	this.isbegin		= false;
	this.isend			= false;

	if (this.getParameter("sizemode")=="on") {
		this.fullscreen		= ON ;
	} else {
		this.fullscreen		= OFF ;
	}
	this.oldw=0;
	this.oldh=0;

	if (toolbarmode) {
		for (var i=0;i<DevEditToolbars.length;i++){
			if (DevEditToolbars[i]==toolbarmode) {
				this.toolbarpos = i;
				return;
			}
		}
	}
	toolbarmode = DevEditToolbars[0];
	this.toolbarpos = 0;
};

Editor.prototype.execCommand = function(name)
{
	if (this.commands.getCommand(name)) {
		this.commands.getCommand(name).execute();
		ToolbarSets.Redraw();
	}
};

Editor.prototype.switchModeTo = function(mode)
{
	if (!mode) return false;
	if (typeof(mode)!== "string") return false;
	if (mode.toLowerCase()==this.lastmode)return false;
	switch (mode.toLowerCase()){
		case "edit":
			this.execCommand("EditMode");
			this.sheet.Select("EditMode");
			break;
		case "source":
			this.execCommand("SourceMode");
			this.sheet.Select("SourceMode");
			break;
		case "preview":
			this.execCommand("PreviewMode");
			this.sheet.Select("PreviewMode");
	}
	return true;
};

Editor.prototype.getHTMLContent = function()
{
	return _de_getContent();
};

Editor.prototype.getTextContent = function()
{
	return _de_getTextContent();
};

Editor.prototype.setParameter = function(par, val)
{
	var str = this.href;
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if((idx>=0)&&(idx2==-1)) {
		idx2=str.length;
	}
	this.href = str.substring(0,idx+par.length+1) + val + str.substring(idx2,str.length);
};

Editor.prototype.getParameter = function(par)
{
	var str = this.href;
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if((idx>=0)&&(idx2==-1)) {
		idx2=str.length;
	}
	return str.substring(idx+par.length+1,idx2);
};

Editor.prototype.attachStyleSheet = function(name)
{
	this.addStyleSheet(this._frame, name);
}

// add StyleSheet (name) to document( d )
Editor.prototype.addStyleSheet = function(d,name)
{
	var e=d.createStyleSheet(name);
	return e;
};

Editor.prototype.setSize = function()
{
	var pDiv = parent.document.getElementById(ae.InstanceName+"main");
	this.realHeight = pDiv.offsetHeight;
	var tDiv = document.getElementById(ae.InstanceName+"main1");
	if (pDiv.offsetWidth<tDiv.offsetWidth) {
		pDiv.style.width = (tDiv.offsetWidth+10)+"px";
	}
	if (pDiv.offsetHeight<tDiv.offsetHeight) {
		pDiv.style.height = (tDiv.offsetHeight)+"px";
	}
	if (this.getParameter("oldw")=="0") {
		this.oldw = pDiv.offsetWidth;
		this.oldh = pDiv.offsetHeight;
		this.setParameter("oldw",this.oldw);
		this.setParameter("oldh",this.oldh);
	} else {
		this.oldw = this.getParameter("oldw")*1.0;
		this.oldh = this.getParameter("oldh")*1.0;
	}
};

Editor.prototype.checkLoad = function()
{
	if (hideitems["EditMode"]==1 && hideitems["SourceMode"]==1 && hideitems["PreviewMode"]==1) {
		this.disableTabs=true;
	}
	this.commands = new Commands();
	this.toolbaritems = new ToolbarItems();

	ToolbarSets.AddItem(toolbarmode,'eToolbar');

	this.setSize();

	ToolbarSets.AddItem("path",'ePath');
	if (!this.disableTabs) {
		ToolbarSets.AddItem("footer",'eFooter');
	}

	this.sheet = new Sheet();
	if (hideitems["EditMode"]==0) {
		this.sheet.AddItem("EditMode", "Edit mode", "status_edit", CHOOSE);
	}
	if (hideitems["SourceMode"]==0) {
		this.sheet.AddItem("SourceMode", "Source mode", "status_source", OFF);
	}
	if (hideitems["PreviewMode"]==0) {
		this.sheet.AddItem("PreviewMode", "Preview mode", "status_preview", OFF);
	}
};

Editor.prototype.calculateNewSize = function(mode)
{
	if (new_layout){
		H = parent.document.getElementById(this.InstanceName + 'main').style.pixelHeight;
		W = parent.document.getElementById(this.InstanceName + 'main').style.pixelWidth;

		if (mode && mode=="preview"){

			dH = 77;
			if (hideTagBar)dH = dH - 23;
		
			document.getElementById(this.InstanceName + "_preview").height = H-dH;
			//document.getElementById(this.InstanceName + "_preview").width = W-10;			
		} else {
			if (this.mode=="edit"){
				tlb_H = DevEditToolbarSets[toolbarmode].length * 27;
			} else {
				tlb_H = 2 * 27;
			}

			dH = 51+tlb_H;
			if (hideTagBar)dH = dH - 23;
			
			if (this.mode=="edit"){
				document.getElementById(this.InstanceName + "_frame").height = H-dH;
			} else {
				document.getElementById(this.InstanceName + "_frame").height = H-(dH-3);
			}
			//document.getElementById(this.InstanceName + "_frame").width = W-10;
		}
	}	
}

Editor.prototype.setInitialValue = function()
{
	if (this.init) {
		return;
	}
	
	// set default color	
	var ae = window.activeEditor;
	if (ae.toolbaritems&&ae.toolbaritems.GetItem('Fontcolor')) {
		ae.toolbaritems.GetItem('Fontcolor').SetButtonColor("#000000");
	}
	if (ae.toolbaritems&&this.toolbaritems.GetItem('Highlight')) {
		this.toolbaritems.GetItem('Highlight').SetButtonColor("yellow");
	}
	if (hideitems["guidelinesOnByDefault"]==1 && !(ae.lastmode=="source" && ae.showborders==OFF)) {
		this.commands.getCommand('Showborders').execute();
	}

	PopupSet.CreatePopup("spellmenu");
	PopupSet.CreatePopup("sourcetag");
	
	buffer["edit"].saveHistory(true);

	ToolbarSets.Redraw();
	ae.sheet.Redraw();
	ae.checkEditArea();

	var y = GetCookie("scroll_top");
	if (y) {
		parent.scrollTo(0,y);
	}
	setTimeout("_de_initialize()",10);
				
	checkImgLoaded();

	this.init = true;
	if (eventListener){
		for (var i = 0; i < eventListener.length; i++){
			if (eventListener[i][0].toLowerCase()=="onload"){
				eval("parent."+eventListener[i][1]+"()");
			}	
		}
	}
	loading_in_progress = false;
};

function _de_initialize(){
	try {
		fix_bug_02();
		window.activeEditor.doStyles();
		window.activeEditor.toolbaritems.GetItem('Styles').Redraw();
	} catch(e){}
}

setTimeout("_de_initialize2()","500");
	
function _de_initialize2(){
	try {
		if(loading_in_progress)window.activeEditor.commands.getCommand('Bold').execute();
		if(loading_in_progress)setTimeout("_de_initialize2()","500");
	} catch(e){}			
}

Editor.prototype.writeC = function(data,ignore)
{
	try{
		aed = this._frame;
		aed.open();
		data = fix_bug_01(data);
		if (ignore) {
			aed.write(data);
		} else {
			aed.write(embed2img(addWrap(data)));
		}
		aed.close();
	} catch(e){}
};

Editor.prototype.writeHTMLContent = function(data)
{
	if (this.mode=="source"){
		data = data.replace(/</g,"&lt;");
		data = data.replace(/>/g,"&gt;");
	}	
	this.writeContentWithCSS(data);
};

Editor.prototype.writeContentWithCSS = function(data)
{
	var html="";
	if (parent.document.getElementById(name+"_html2").value!="" && !data) {
		html = parent.document.getElementById(name+"_html2").value;
		html = html.replace(/&amp;/g,'&');
		if (html.toLowerCase().indexOf("<html")>=0){
			var add_to_head = '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && html.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;
			}
			newhtml = html.match(HeadContents);
			html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
		}
	} else {
		var h = data ? data : parent.document.getElementById(name+"_input").value;
		if (h.toLowerCase().indexOf("<html")>=0) {
			var add_to_head = '<link '+((data&&ae.showborders==ON)?'':'disabled')+' href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && h.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			newhtml = h.match(HeadContents);
			if (newhtml!==null) {
				html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
			} else {
				html = h;
			}
		} else {
			html = "<html><head>";
			html += '<link '+((data&&ae.showborders==ON)?'':'disabled')+' href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (myBaseHref) {
				html += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			this.use_old_base = true;
			if (this.snippetCSS) {
				html += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			html+="</head>" + h + "</html>";
		}
	}

	// set initial HTML code for restricted mode
	var h = data ? data : parent.document.getElementById(name+"_input").value;
	if (h.toLowerCase().indexOf("<html")>=0){
		if (!this.initHTML) {
			this.initHTML = h;
		}
	} else {
		if (!this.initHTML) {
			this.initHTML = "<html><head></head>"+h+"</html>";
		}
	}

	this.HTMLTags=null;
	var pos = html.indexOf("<html");
	if (pos==-1) {
		pos=html.indexOf("<HTML");
	}
	if (pos>=0) {
		var pos1 = html.indexOf(">",pos+1);
		var pos2 = html.indexOf("</html",pos1+1);
		if (pos2==-1) {
			pos2 = html.indexOf("</HTML>",pos1+1);
		}
		if (pos2==-1) {
			pos2 = html.length;
		}
		this.HTMLTags = new Array();
		this.HTMLTags[0] = html;
		this.HTMLTags[1] = html.substring(0,pos1+1);
		this.HTMLTags[2] = html.substring(pos1+1,pos2);
		this.HTMLTags[3] = html.substring(pos2,html.length);
	}

	if (!this.HTMLTags) {
		this.HTMLTags = new Array();
		this.HTMLTags[0]=html;
		this.HTMLTags[1]="";
		this.HTMLTags[2]="";
		this.HTMLTags[3]="";

		var x = html.match(HtmlContents1);
		if (x) {
			this.HTMLTags[1]=x[1];
		}
		var y = html.match(HtmlContents2);
		if (y) {
			this.HTMLTags[3]=y[1];
		}
	}
	try{
		aed = this._frame;
		aed.open();
		var v = remove_doctype(embed2img(addWrap(html)));
		aed.write(v);
		aed.close();
	} catch(e){}
};


function setEvent () {
	if(window.activeEditor) {
		window.activeEditor.setEvent();
	}
}


Editor.prototype.setEvent = function()
{
	ae = window.activeEditor;
	var wa = window.activeEditor._frame;
	try {
		wa.attachEvent( 'oncontrolselect', this.CheckEditable );	
	
		wa.attachEvent( 'onselectionchange', this.Redraw );
		wa.attachEvent( 'onkeydown', this.Redraw ) ;
		wa.attachEvent( 'onkeyup', this.CheckUp ) ;
		wa.attachEvent( 'onclick', this.Focus) ;
		
		wa.attachEvent( 'onmousedown', this.setdown ) ;
		wa.attachEvent( 'onmouseup', this.setup ) ;
		wa.attachEvent( 'oncontextmenu', this.ContextMenu) ;
		wa.body.attachEvent( 'ondragstart', this.CheckEditable) ;
		wa.body.attachEvent( 'onscroll', scrollLineBar) ;
		wa.body.attachEvent( 'ondrop', this.CheckEditable) ;
		
		ToolbarSets.Redraw();

		if (is_setCursor){
			ae.Focus(true);
		} else {
			updateValue();
		}
	} catch (e){}
};

function updateValue() {
	window.activeEditor.commands.getCommand('Save').execute("no");
	return true;
}

mouseisdown=false;

Editor.prototype.setdown = function()
{
	mouseisdown=true;
	ae = window.activeEditor;
	return true;
};

Editor.prototype.setup = function(evt)
{
	mouseisdown=false;
	if (evt==null) {
		evt = window.event;
	}
	if (!evt) {
		return true;
	}
	PopupSet.Redraw();
	ToolbarSets.Redraw(evt);

	return true;
};

// create Editor object
Editor.prototype.Create = function()
{
	// instanceName should not be empty
	if ( !this.InstanceName || this.InstanceName.length == 0 ) {
		this.throwError( 1, 'You must specify a instance name.' ) ;
		return ;
	}

	// check browser compatible
	if (!this.isCompatibleBrowser()) {
		this.throwError( 2, 'Browser is not compatible.' ) ;
		return ;
	}

	// instert editor into page
	var htmlstr="";
	htmlstr+= '<div id="'+this.InstanceName+'main1" style="background-color:gray;height:100%;width:100%;">'
	htmlstr+= '<table  width="100%" height="100%" class="container" border="0px" cellspacing="0" cellpadding="0" ><tr><td>';
	htmlstr+= '<div id="eToolbar"></div></td></tr><tr><td width="100%" height="100%" class="editcontainer2">';
	htmlstr+= '<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0"><tr><td valign=top><img src="images/1x1.gif" width="1px"><div id="containerLineNumber" style="overflow:hidden;"><div class="de_source_class" id="lineNumber">&nbsp;</div></div></td><td valign=top width="100%" height="100%">';
	htmlstr+= '<iframe src="empty.html" onBlur="updateValue();" width="100%" height="100%" class="editcontainer" id="' + this.InstanceName + '_frame'+'"'+' onLoad="setEvent()" scrolling="yes" frameborder="no"></iframe>';
	htmlstr+= '<iframe src="empty.html" id="' + this.InstanceName + '_preview'+'" width="100%" height="100%" scrolling="yes"  frameborder="0" class="editcontainer" style="display:none;"></iframe>';
	htmlstr+= '</td><td valign=top width="1px"><img src="images/1x1.gif" width="1px">&nbsp;</td></tr></table>';
	htmlstr+= '</td></tr>';
	htmlstr+= '<tr><td><img id="'+this.InstanceName+'fb01" src="images/1x1.gif" height=5px></td></tr>';
	htmlstr+= '<tr '+(hideTagBar?'style="display:none;"':'')+'><td class="TB_Toolbar" class="pathtext"><table width="100%" border="0" cellspacing="0" cellpadding="0" ><tr><td><span id="ePath"></span></td><td><span style="float:right" class="pathcontainer" id="eRemoveTag"></span></td></tr></table></td></tr>';

	if (!(hideitems["EditMode"]==1 && hideitems["SourceMode"]==1 && hideitems["PreviewMode"]==1)){
		htmlstr+= '<tr><td class="TB_Toolbar"><table border="0" cellspacing="0" cellpadding="0" ><tr><td><div id="footersheet"></div></td>';
		htmlstr+= '<td width="100%" valign=top  class="TB_Toolbar"><table cellspacing="0" cellpadding="0" border="0" width="100%" ><tr><td width="100%"><div class="sheetline1" width="100%" height="1px"></div></td></tr>';
		htmlstr+= '<tr><td width="100%"><div class="sheetline2" width="100%" height="1px"></div></td></tr>';
		htmlstr+= '<tr><td align="right"><div id="eFooter"></div></td></tr>';
		htmlstr+= '</table></td></table>';
	}

	htmlstr+= '</td></tr></table>';
	htmlstr+= '</table>';
	
	htmlstr+= '</div>';

	document.write(htmlstr);
	aID = this.InstanceName + '_frame';
	window.aID = aID;
	this._frame=document.frames[aID].document;
	this._window=document.frames[aID];
	window.fr = this._frame;

	this._frame.designMode = "on";
	this._frame=document.frames[aID].document;

	if (new_layout){
		tlb_H = DevEditToolbarSets[toolbarmode].length * 27;
		dH = 51+tlb_H;
		if (hideTagBar)dH = dH - 23;
		H = parent.document.getElementById(this.InstanceName + 'main').style.pixelHeight;
		W = parent.document.getElementById(this.InstanceName + 'main').style.pixelWidth;
		document.getElementById(this.InstanceName + "_frame").height = H-dH;
		//document.getElementById(this.InstanceName + "_frame").width = W+10;
	}
	
	this.checkLoad();
};

Editor.prototype.ContextMenu = function(evt)
{
	evt = (evt)?evt:(window.event)?window.event:"";

	if (hideitems["ContextMenu"]){
		evt.cancelBubble=true;
		evt.returnValue=false;
	} else {
		Selection.set();

		if (!evt.ctrlKey) {
			window.activeEditor.commands.getCommand("Contextmenu").execute(null,evt.clientX,evt.clientY);
			evt.cancelBubble=true;
			evt.returnValue=false;
		}
		evt.cancelBubble=true;
		x = window.activeEditor._frame.fireEvent("onselectionchange");
		PopupSet.Redraw();
	}
};

Editor.prototype.checkEditArea = function()
{
	var ae = window.activeEditor;
	check = false;
	findAllEditable(this._frame.body);
	ae.isbegin = check;
	ae.isend = check;
};

Editor.prototype.lockPage = function()
{
	var ae = window.activeEditor;
	ae.unlock = false;
	ae.checkEditArea();
	ae.Editable();
};

Editor.prototype.unlockPage = function()
{
	var ae = window.activeEditor;
	ae.unlock = true;
	ae.isbegin = false;
	ae.isend = false;
};

var lastTag = null;
var must_edit = false;
Editor.prototype.Editable = function(e)
{
	ae = window.activeEditor;

	var selectedRange = ae._frame.selection.createRange();
	var sel = ae._frame.selection;
	var range = sel.createRange();
	switch (sel.type) {
		case "Text":
			oContainer = range.parentElement();
			break;
		case "None":
			oContainer = range.parentElement();
			break;
		case "Control":
			oContainer = range.item(0);
			break;
		default:
			oContainer = aed.body;
			break;
	}

	if (e && e.type && e.type=="controlselect"){
		ae.editable = true;
		lastTag = oContainer.tagName;
		must_edit = false;
		return true;
	}

	var isEditable = ae.unlock || ae.walkDOM(oContainer);

	if (insideWrap) {
		oContainer=wrap;
	}

	try{
		if (oContainer && oContainer.id && oContainer.id.substr(0,7)=="de_wrap") {
			var cR = ae._frame.body.createTextRange();
			cR.moveToElementText(oContainer);

			// The current selection<br>
			var r = ae._frame.selection.createRange();
			// We'll use this as a 'dummy'<br>
			var stored_range = r.duplicate();
			// Select all text<br>
			stored_range.moveToElementText( oContainer );
			// Now move 'dummy' end point to end point of original range<br>
			stored_range.setEndPoint( 'EndToEnd', range );
			// Now we can calculate start and end points<br>
			oContainer.selectionStart = stored_range.text.length - range.text.length;
			oContainer.selectionEnd = oContainer.selectionStart + range.text.length;

			//isEditable = true;
			if ( (oContainer.selectionStart==0 && e.keyCode==8 ) // start & backspace
				|| ((cR.text.length == oContainer.selectionStart ) && (e.keyCode==46 || selectedRange.text ))//end & del
			) {
				isEditable=false;
			}
			
		}
	} catch(x){}

	if (e){
		if (ae.walkDOM && isEditable) {
			ae.editable = true;
			return true;
		} else {
			e.cancelBubble=true;
			e.returnValue=false;
			ae.editable = false;
			return false;
		}

	} else {
		if (ae.walkDOM && isEditable) {
			return true;
		} else {
			return false;
		}
	}
};

Editor.prototype.CheckEditable = function(evt)
{
	e = (evt)?evt:(window.event)?window.event:"";
	ae = window.activeEditor;

	// 1 click for DIV	
	if (e.srcElement && e.srcElement.tagName && (e.srcElement.tagName.toLowerCase() == "div" || e.srcElement.tagName.toLowerCase() == "span")){
		one_click = true;
	}
	// end 1 click
		
	return ae.Editable(e);
};

var edt = false;
var lastedt = false;
one_click = false;
			
// source engine var's
context_str="";
tag_typing = false;
startBookmark = null;

// redraw
Editor.prototype.Redraw = function(e)
{
	Selection.set();
	loading_in_progress = false;
	var cShow = false;
	
	if(!e) {
		e = window.event;
	}
	if (!e) {
		return true;
	}

	ae = window.activeEditor;
	var x = e.clientX;
	var y = e.clientY;

	lastedt = edt;
	edt = ae.Editable(e);
	
	var se = ae.GetSelectedElement();
	if (!edt && !(se && se.tagName && (se.tagName.toLowerCase()=="div" || se.tagName.toLowerCase()=="span"))) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
		return false;
	}

	// 1 click for DIV
	if (se && se.tagName && (se.tagName.toLowerCase()=="div" || se.tagName.toLowerCase()=="span")){
		try {
			var range = ae._frame.body.createTextRange();
			range.moveToPoint(x,y);
			range.collapse();
			range.select();
			one_click = true;
		}catch(x){}	
	}
	// end 1 click

	//try{
	// check spell words
	var se = ae.GetSelectedElement();
	if (!se&&ae.GetSelection()=="") {
		se = ae.firstParentNode();
	}
	if (se && se.id && se.id.substring(0,9) =="_de_spell") {

		// select word

		var sel = ae._frame.selection;
		var newNode = sel.createRange();
		newNode.moveToElementText(se);
		newNode.select();

		var dg = se.id.match(/(\d+)/g);
		PopupSet.Items["spellmenu"].ReplaceItems(dg[0]*1.0);

		ae.commands.getCommand("Spellmenu").execute(null,e.clientX,e.clientY);
		PopupSet.Redraw("spellmenu");
		e.cancelBubble = true;
		e.returnValue = false;
		return;
	}
	// end check spell

	cancel_event = false;

	if (!e.ctrlKey && e.type=="keydown" && window.activeEditor.mode=="edit"){
		var specialchar = false;
		for (var i=0;i<specialKeyCode.length;i++){
			if (specialKeyCode[i]==e.keyCode){
				specialchar=true;
				break;
			}
		}
		if (!specialchar) {
			return window.activeEditor.editable;
		}
	}

	var f=false;
	var shortcut=false;
	if (window.activeEditor.toolbaritems.GetItem('Path')) {
		window.activeEditor.toolbaritems.GetItem('Path').Redraw();
	}
	if (e.ctrlKey) {
		var key = String.fromCharCode(e.keyCode).toUpperCase();
		for(var i=0; i < ShortCutKeys.length; i++){
			var k = ShortCutKeys[i][0];
			if (k.toUpperCase().indexOf("SHIFT")>=0 && e.shiftKey && key==k.substr(k.indexOf("+")+1,1)) {
				f=true;
			} else if (key == k) {
				f=true;
			}

			if (f) {
				window.activeEditor.commands.getCommand(ShortCutKeys[i][1]).execute();
				shortcut = true;
				cShow = true;
				f = false;
			}
		}
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}

	ae.lastinsert = null;

	// Enter - if useBR=1 then use <br/>
	if (e.keyCode==13){// && cancel_event==false) {
		if (useBR==1) {
			var sel = ae._frame.selection;
			if (sel.type == "Control") {
				return;
			}

			if (!e.shiftKey) {
				var r = sel.createRange();
				r.pasteHTML("<BR/>");
				e.cancelBubble = true;
				e.returnValue = false;

				r.select();
				r.moveEnd("character", 1);
				r.moveStart("character", 1);
				r.collapse(false);
				return false;
			} else {
				
				if (ae.parentNode("LI")) {
					var r = sel.createRange();
					r.pasteHTML("<li>&nbsp;</li>");
					e.cancelBubble = true;
					e.returnValue = false;

					r.moveStart("character", -1);
					r.collapse(true);
					r.select();

					return false;
				} else {
					
					var r = sel.createRange();
					if (r.parentElement() && r.parentElement().tagName && r.parentElement().tagName.toLowerCase()=="p"){
						p = r.parentElement();
						x = p.nextSibling;

						var range = ae._frame.body.createTextRange();
						range.moveToElementText(p);
						ft = range.htmlText;
						range.setEndPoint("EndToStart", r);
						var rangeLength = range.htmlText.length;

						ft = ft.replace(/^[\r\n\f]+?<([^>]+)>/gi,"");
						ft = ft.replace(/<([^>]+)>$/gi,"");
						ft1 = ft.substr(0,rangeLength);						
						ft1 = ft1.replace(/^[\r\n\f]+?<([^>]+)>/gi,"");
						ft1 = ft1.replace(/<([^>]+)>$/gi,"");
						
						var newP = ae._frame.createElement("P");
						newP.innerHTML = ft1;
						var newP2 = ae._frame.createElement("P");
						newP2.innerHTML = ft.substr(rangeLength,ft.length-rangeLength);

						if (x){
							p.parentNode.insertBefore(newP2,x);
						} else {

							if (newP2.innerHTML){
								p.parentNode.appendChild(newP2);
								newP2.id="temp_p";
								p.parentNode.appendChild(newP2);
								var x = ae._frame.getElementById("temp_p");
								r.moveToElementText(x);
								x.removeAttribute("id");
								r.collapse(true);
								r.select();
							} else {
								newP2.innerHTML="&nbsp;";
								newP2.id="temp_p";
								p.parentNode.appendChild(newP2);
								var x = ae._frame.getElementById("temp_p");
								r.moveToElementText(x);
								x.removeAttribute("id");
								r.select();
							}	

						}	
						p.parentNode.replaceChild(newP,p);
						return false;
						
					} else {
						if (r.parentElement() && r.parentElement().tagName){
							var range = ae._frame.body.createTextRange();
							range.moveToElementText(r.parentElement());
							r.setEndPoint("EndToEnd", range);
							
							if (r.htmlText){
								if (r.parentElement().tagName.toLowerCase()!=="body"){
									r.moveEnd("character",-1);
								}	
								r.select();

								r.pasteHTML("<p id='temp_p'>"+r.htmlText+"</p>");
								var p = ae._frame.getElementById("temp_p");
								r.moveToElementText(p);
								p.removeAttribute("id");
								r.collapse(true);
								r.select();
							} else {
								r.select();
								r.pasteHTML("<p id='temp_p'>&nbsp;"+r.htmlText+"</p>");
								var p = ae._frame.getElementById("temp_p");
								r.moveToElementText(p);
								p.removeAttribute("id");
								r.select();
							}

							e.cancelBubble = true;
							e.returnValue = false;

							return false;

						}
					}
				}	
			}	
		} else {
		
			var sel = ae._frame.selection;
			if (!e.shiftKey && ae.parentNode("DIV")) {
				var r = sel.createRange();
				r.pasteHTML("<p>");
				e.cancelBubble = true;
				e.returnValue = false;

				r.collapse(true);
				r.select();
				return false;
			}
		
			if (ae.mode=="source") {
				var r = sel.createRange();
				r.pasteHTML("<BR>");
				e.cancelBubble = true;
				e.returnValue = false;

				r.select();
				r.moveEnd("character", 1);
				r.moveStart("character", 1);
				r.collapse(false);

				return false;
			}
		}
		cShow = true;
	}

	if (!e.ctrlKey && (e.keyCode==0 && !mouseisdown && e.type!="keydown"&& e.type!="selectionchange")) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
		cShow = true;
	}
	if (shortcut || cancel_event) {
		e.cancelBubble = true;
		e.returnValue = false;
	}

	if (cShow){		
		setTimeout("window.activeEditor.commands.getCommand('Paragraph').showChar()",20);
	}

	e.cancelBubble=true;
	//} catch(e){}
	window.activeEditor.commands.getCommand('Paragraph').showChar();
	return true;
};

Editor.prototype.CheckUp = function(e)
{
	e = (e)?e:(window.event)?window.event:"";
	if (e.keyCode >= 37 && e.keyCode <= 40) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}
	if (e.shiftKey && (e.keyCode==35 || e.keyCode==36)) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}

	if (tag_typing){

		//  Press [>] key 		
		if (e.shiftKey && e.keyCode == 190){
			if (context_tag=="")context_tag = context_str;
			if (!emptyTags[context_tag.toLowerCase()]){
				ae._insertBefore("&lt;\/"+ context_tag.toLowerCase() +"&gt;",true);
			}
			tag_typing = false;			
			context_str = "";
			PopupSet.CloseAll();
		}
	}
		
	if (edt && !lastedt){
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}
	if(!e.ctrlKey && e.keyCode != 90 && e.keyCode != 89) {
		if (e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 46) {
			buffer[window.activeEditor.mode].saveHistory();
			PopupSet.Redraw();
			ToolbarSets.Redraw(e);
		}
	}
	return true;
};

one_onclick = true;
Editor.prototype.Focus = function(set_focus){
	try{
		if (!one_onclick || set_focus==true)window.activeEditor._window.focus();
		//one_onclick = false;
	} catch ( e ) {}
};

// this method check browser compatible
Editor.prototype.isCompatibleBrowser = function()
{
	if (browser.IE) {
		var sBrowserVersion = navigator.appVersion.match(/MSIE (.\..)/)[1] ;
		return ( sBrowserVersion >= 5.5 ) ;
	} else {
		return false ;
	}
};

// show errors
Editor.prototype.throwError = function( errorNumber, errorDescription )
{
	this.ErrorNumber		= errorNumber ;
	this.ErrorDescription	= errorDescription ;

	document.write( '<div style="COLOR: #ff0000">' ) ;
	document.write( '[ Editor Error ' + this.ErrorNumber + ': ' + this.ErrorDescription + ' ]' ) ;
	document.write( '</div>' ) ;
};

Editor.prototype.clearAll = function()
{
	var text = (browser.NS?'&nbsp;':'');
	this._frame.body.innerHTML = text;
};

Editor.prototype.clearContent = function()
{
	var text = (browser.NS?'&nbsp;':'');
	this._frame.body.innerHTML = text;
};

Editor.prototype._inserthtml = function(text, ignore)
{
	this.Focus(true);
	var newNode = insertNodeAtSelectionIE(embed2img(addWrap(text,1),true),ignore);
	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
	return newNode;
};

Editor.prototype._insertBefore = function(text)
{
	this.Focus(true);
	
	var ae = window.activeEditor;
	var aed = ae._frame;
	var sel = ae._frame.selection;
	var newNode = sel.createRange();
	
	var range = aed.body.createTextRange();
	//range.moveToElementText(element);
	range.moveToBookmark(startBookmark);
	range.setEndPoint("EndToStart", newNode);
	addText = range.text;
		
	//var nNode = newNode;
	//newNode.moveStart("character",-10);
	//newNode.moveToBookmark(startBookmark);
	//newNode.select();
	//newNode.setEndPoint("EndToStart",nNode);
	//newNode.select();

	//addText = newNode.text;
	text = addText+text;
	
	if ( sel.type.toLowerCase() != "none" ) {
		sel.clear() ;
	}

	//text = embed2img(addWrap(text,1),true)
	text = colourCode(text);
	//traceHTML(text)
	newNode.pasteHTML (text);
	newNode.moveEnd("character",-1*text.replace(/(&\S\S;)/g,"1").length);
	newNode.select();

	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
	return newNode;
};

Editor.prototype.insertHTML = function(text)
{
	window.activeEditor.Focus(true);
	if (this.mode=="source"){
		text = text.replace(/</g,"&lt;");
		text = text.replace(/>/g,"&gt;");
	}	
	var newNode = insertNodeAtSelectionIE(embed2img(addWrap(text,1)),1,true);
	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
	window.activeEditor.commands.getCommand('Save').execute("no");
	return newNode;
};

Editor.prototype.parentNode = function( nodeTagName )
{
	return this.parentNodeIE(nodeTagName);
};

Editor.prototype.GetType = function()
{
	return this.GetTypeIE();
};


Editor.prototype.getSelectedElement = function()
{
	return this.GetSelectedElementIE();
};

Editor.prototype.GetSelectedElement = function()
{
	return this.GetSelectedElementIE();
};

Editor.prototype.GetTypeIE = function()
{
	return this._frame.selection.type ;
};

Editor.prototype.GetSelectedElement2 = function() {
	sel = this._frame.selection;
	range = sel.createRange();
	var oContainer=null;
	switch (sel.type) {
		case "Text":
			oContainer = range.parentElement();
			break;
		case "None":
			oContainer = range.parentElement();
			break;
		case "Control":
			oContainer = range.item(0);
			break;
		}
		if (oContainer==this._frame.body) {
			oContainer=null;
		}
	return oContainer;
};

Editor.prototype.GetSelectedElementIE = function()
{
	if ( this.GetTypeIE() == 'Control' ) {
		var oRange = this._frame.selection.createRange() ;
		if ( oRange && oRange.item ) {
			return this._frame.selection.createRange().item(0) ;
		}
	}
};

Editor.prototype.parentNodeIE = function( nodeTagName )
{
	var oNode ;
	if ( window.activeEditor._frame.selection.type == "Control" ) {
		var oRange = window.activeEditor._frame.selection.createRange() ;
		for ( i = 0 ; i < oRange.length ; i++ ) {
			if (oRange(i).parentNode) {
				oNode = oRange(i).parentNode ;
				break ;
			}
		}
	} else {
		var oRange  = window.activeEditor._frame.selection.createRange() ;
		oNode = oRange.parentElement() ;
	}

	while ( oNode && oNode.nodeName != nodeTagName ) {
		oNode = oNode.parentNode ;
	}

	return oNode ;
};

Editor.prototype.firstParentNode = function()
{
	var oNode ;
	try {
		if ( window.activeEditor._frame.selection.type == "Control" ) {
			var oRange = window.activeEditor._frame.selection.createRange() ;
			for ( i = 0 ; i < oRange.length ; i++ ) {
				if (oRange(i).parentNode) {
					oNode = oRange(i).parentNode ;
					break ;
				}
			}
		} else {
			var oRange  = window.activeEditor._frame.selection.createRange() ;
			oNode = oRange.parentElement() ;
		}
	} catch (e) {}

	return oNode ;
};

Editor.prototype.selectNode = function(node){
	try	{
		var range = this._frame.body.createControlRange();
		range.add(node);
		range.select();
	} catch(e) {
		try	{
			var range = this._frame.body.createTextRange();
			range.moveToElementText(node);
			range.select();
		} catch(e){return;}
	}
};

function insertNodeAtSelectionIE (text, i, specialtag, before) {

	var ae = window.activeEditor;
	var aed = window.activeEditor._frame;
	var sel = window.activeEditor._frame.selection;
	if (sel!=null) {
		if ( sel.type.toLowerCase() != "none" ) {
			sel.clear() ;
		}
		var newNode = sel.createRange();

		var x,y;
		if (specialtag && text.substr(0,1)=="<"){
			text = "x"+text;
			x = newNode.boundingLeft;
			y = newNode.boundingTop;
		}

		newNode.pasteHTML (text);
		
		if (before){
			newNode.moveEnd("character",-1*text.replace(/(&\S\S;)/g,"1").length);
			newNode.select();
		}

		if (x && y){
			newNode.moveToPoint(x,y);
			newNode.moveEnd("character",1);
			newNode.select();
			newNode.text = "";
		}

		var node = aed.getElementById("_de_temp_element");
		if (node){
			newNode.moveToElementText(node);
			newNode.select();
			node.removeAttribute("id");
			window.activeEditor.currentNode = node;
			this.selectedtag = node;
			ae.lastinsert = node;
		}
		return newNode;
	}
}

Editor.prototype.GetSelection = function()
{
	return this.GetSelectionIE();
};

Editor.prototype.getSelectedText = function()
{
	return this.GetSelectionIE();
};

Editor.prototype.GetSelectionIE = function()
{
	var oRange = this._frame.selection.createRange();
	return oRange.text;
};

Editor.prototype.replaceNodeByText = function(obj)
{
	obj.outerHTML = obj.innerText;
};

Editor.prototype.doStyles = function()
{
	this.Styles			= new Array();
	this.cssText		= new Array();
	var sheets = this._frame.styleSheets;
	if (sheets.length > 0) {
		// loop over each sheet
		for (var x = 0; x < sheets.length; x++) {
			if (sheets[x] && sheets[x].href && sheets[x].href.indexOf(border_css_file)>=0) {
				continue;
			}
			// grab stylesheet rules
			var rules = sheets[x].rules;
			if (rules.length > 0) {
				// check each rule
				for(var y = 0; y < rules.length; y++) {
					sT = rules[y].selectorText;
					if (sT.substr(0,1)=="."){
						sT=sT.substr(1);
						if (sT.indexOf(" ")>0) {
							sT = sT.substring(0,sT.indexOf(" "));
						}
						if (sT.toLowerCase().indexOf("wep_")==0)continue;
						style_twice = false;
						for (var z = 0; z < this.Styles.length; z++){
							if (sT == this.Styles[z]){
								this.cssText[z] = this.cssText[z] + (this.cssText[z].lastIndexOf(";")==this.cssText[z].length ? "" : ";") +rules[y].style.cssText;
								style_twice = true;
								break;
							}
						}
						if (!style_twice){						
							this.Styles[this.Styles.length] = sT;
							this.cssText[this.cssText.length] = rules[y].style.cssText;						
						}
					}
				}
			}
		}
	}
};

Editor.prototype.isFlash = function(x)
{
	var cn;
	cn = x.getAttribute("className");
	if (cn=="de_flash_file") {
		return true;
	} else {
		return false;
	}
};

Editor.prototype.isMedia = function(x)
{
	var cn;
	cn = x.getAttribute("className");
	if (cn=="de_media_file") {
		return true;
	} else {
		return false;
	}
};

Editor.prototype.checkTags = function(tags)
{
	ae = window.activeEditor;
	var tags = tags.split("|");
	var r;
	for (var i=0; i<tags.length; i++) {
		switch (tags[i]) {
			case "empty":
				if (this.GetSelection()=="") {
					r = OFF;
				} else {
					r = DISABLED;
				}
				break;
			case "text":
				if (this.GetType()=="Control") {
					r = DISABLED;
				} else {
					if (this.GetSelection()!="") {
						r = OFF;
					} else {
						r = DISABLED;
					}
				}
				break;
			case "flash":
				var x = ae.GetSelectedElement();
				if (x && this.isFlash(x)) {
					return OFF;
				} else {
					return DISABLED;
				}
				break;
			case "media":
				var x = ae.GetSelectedElement();
				if (x && this.isMedia(x)) {
					return OFF;
				} else {
					return DISABLED;
				}
				break;
			case "link":
				if (ae.GetType()=="Control") {
					var  x = Selection.parentNode("A");
					if (!x) {
						return DISABLED;
					}
					if (x.href) {
						if (x.href.indexOf("mailto:")==-1) {
							return OFF;
						} else {
							return DISABLED;
						}
					}
				} else if (ae.GetSelection()!=""){
					var x = ae.GetSelectedElement();
					if (!x) {
						return OFF;
					}
					if (x.href&&x.href.indexOf("mailto:")==-1) {
						return OFF;
					}
				}
				break;
			default:
				var x = this.GetSelectedElement();
				if (!x) {
					x = Selection.parentNode(tags[i]);
				}
				if (!x) {
					return DISABLED;
				}
				if (x && x.getAttribute("className") && (x.getAttribute("className")=="de_flash_file" || x.getAttribute("className")=="de_media_file")) {
					return DISABLED;
				}
				if (x && x.tagName && tags[i].toUpperCase()==x.tagName.toUpperCase()) {
					r=OFF;
				} else {
					r = DISABLED;
				}
		}
		if (r==OFF) {
			return OFF;
		}
	}
	return DISABLED;
};


Editor.prototype.storePos = function()
{
	this.Pos = null;
	var selection = this._frame.selection;
	if (selection.type.toLowerCase() == 'text'||selection.type.toLowerCase() == 'none') {
		this.Pos =  selection.createRange().getBookmark();
	}
};

Editor.prototype.restorePos = function()
{
	if (this.Pos){
		var range = this._frame.body.createTextRange();
		range.moveToBookmark(this.Pos);
		range.select();
	}
};

var checkbegin	= false;
var checkend	= false;
var traverse_end = false;
var check		= false;
var ret			= false;
var insideWrap	= false;
var wrap = null;

Editor.prototype.walkDOM = function(node)
{
	if (!node) {
		return false;
	}
	traverse_end = false;
	checkbegin	= false;
	checkend	= false;
	ret			= false;
	insideWrap	= false;
	wrap = null;
	if (window.activeEditor.unlock) {
		return true;
	}
	if (!window.activeEditor.isbegin && !window.activeEditor.isend) {
		return true;
	}
	traverse(this._frame.body,node);
	if (checkbegin && !checkend ) {
		return true;
	} else {
		return false;
	}
};

function traverse(node,selnode)
{
	if (ret) {
		return;
	}
	if (node && node.id && node.id.substr(0,7)=="de_wrap") {
		insideWrap=true;
		wrap=node;
	}
	if (node.nodeType == 8) {
		if (node.nodeValue.toLowerCase().indexOf("begineditable")>=0) {
			checkend = false;
			checkbegin = true;
		}
		if (node.nodeValue.toLowerCase().indexOf("endeditable")>=0) {
			checkend = true;
		}
		if (checkbegin && checkend) {
			check=true;
			checkend=false;
			checkbegin=false;
		}
	}
	if (node==selnode){
		ret=true;
		return;
	}
	if (node.childNodes != null) {
		for ( var i=0; i < node.childNodes.length; i++) {
			traverse(node.childNodes.item(i),selnode);
		}
	}
}

function findAllEditable(node)
{
	if (check==true) {
		return;
	}
	if (node.nodeType == 8) {
		if (node.nodeValue.toLowerCase().indexOf("begineditable")>=0) {
			checkend = false;
			checkbegin = true;
		}
		if (node.nodeValue.toLowerCase().indexOf("endeditable")>=0) {
			checkend = true;
		}
		if (checkbegin && checkend) {
			check=true;
			checkend=false;
			checkbegin=false;
		}
	}
	if (node.childNodes != null) {
		for ( var i=0; i < node.childNodes.length; i++) {
			findAllEditable(node.childNodes.item(i));
		}
	}
}

// function below fix IE bug

// browser UPPERCASE attr inside style="..."
function fix_bug_01(code)
{
	r = /(style=["'][^"']*?["'])/gi;
	return code.replace(r,function(s1,s2){
			s2 = s2.replace(/;?([^:]*)/g,function(d1,d2){return d2.toLowerCase();}
			);
			return s2;
	});
}

// hide 3d line of content in iframe
function fix_bug_02()
{
	try{
		var ae = window.activeEditor;
		var sel = ae._frame.selection;
		var r = sel.createRange();
		r.moveEnd("character", 1);
		r.moveStart("character", 1);
		r.collapse(false);
		r.select();
		window.setTimeout("fix_bug_02_1()",10);
	} catch(e){}
}

function fix_bug_02_1()
{
	try{
		var ae = window.activeEditor;
		var sel = ae._frame.selection;
		var r = sel.createRange();
		r.moveEnd("character", -100);
		r.moveStart("character", -100);
		r.collapse(false);
		r.select();
	} catch(e){}
}

// browser convert align=center -> middle
function fix_bug_03(code)
{
	r = /(\salign="middle")/gi;
	r1 = /(\salign=middle)/gi;
	code = code.replace(r," align=\"center\"");
	code = code.replace(r1," align=center");
	return code;
}

// browser strip <param> tag from OBJECT TAG
function fix_bug_04(code)
{
	if (useXHTML != 1) {
		// Make param tags <param .... ></param>
		r = /(<param(.*?)>)[^<\/param>]/gi;
		code = code.replace(r, "$1</PARAM>");
	}

	return code;

	/*
	c1 = /(<object([^>]+)>)/gi;
	code = code.replace(c1,function(s1,s2){
				r1 = s2.match(/data="(\S+)"/gi);
				var prm="";
				if (r1){
					p = r1[0].replace(/data=/gi,"");
					prm = '<param name="src" value='+p+'>';
				}
				return s2 + prm;
			}
		);
	return code;
	*/
}

// browser strip </dt>,</dd> tag from innerHTML
function fix_bug_05(code)
{return code;
	c1 = /(<dt>([\s\S]*?)(?=<dd>))/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (s3 && s3.indexOf("</dt>") == -1){
			var news="<dt>";
			if (s3.substr(s3.length-1,2)=="\n"){
				news += s3.substr(0,s3.length-3);
			} else {
				news += s3;
			}
			return news+"</dt>\n";
		} else {
			return s2;
		}
	});
	c1 = /(<dd>([\s\S]*?)(?=<dt>))/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (s3 && s3.indexOf("</dd>") == -1){
			var news="<dd>";
			if (s3.substr(s3.length-1,2)=="\n"){
				news += s3.substr(0,s3.length-3);
			} else {
				news += s3;
			}
			return news+"</dd>\n";
		} else {
			return s2;
		}
	});

	c1 = /(<dd>([\s\S]*?)(?=<\/dl>))/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (s3 && s3.indexOf("</dd>") == -1){
			var news="<dd>";
			if (s3.substr(s3.length-1,2)=="\n"){
				news += s3.substr(0,s3.length-3);
			} else {
				news += s3;
			}
			return news+"</dd>\n";
		} else {
			return s2;
		}
	});

	return code;
}

// ie rearrange tag inside HEAD
function fix_bug_06(code)
{
	return code;
	if (code) {
		h = code.match(HeadContents);
		ae = window.activeEditor;
		if (ae.headhtml && ae.isbegin && ae.isend) {
			return h[1] + window.activeEditor.headhtml + h[3];
		} else {
			return code;
		}
	} else {
		return "";
	}
}


function set_cursor_at_begin()
{
	try{
	var ae = window.activeEditor;
	var sel = ae._frame.selection;
		var r = sel.createRange();
		r.moveToElementText(ae._frame.body);
		r.select();
		r.collapse(true);
		r.select();

	} catch(e){}
}
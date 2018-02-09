// Name: Special commands file
// Info: Contain special commands(these commands don't directly support by standard editor component) for Gecko browsers.

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

	ae = window.activeEditor;
	aed = ae._frame;

	var code = "";
	if (ae.mode=="source") {
		var html = aed.body.innerHTML;
		html = html.replace(/<br\/?>/gi,"\n");
		html = html.replace(/<br\/?>/gi,"\n");
		html = html.replace(/<[^>]+>/g,"");

		html = html.replace(/&lt;/g,"<");
		html = html.replace(/&gt;/g,">");
		code = removeStyle(html);
	} else {
		ae.commands.getCommand("Paragraph").hideChar();
		code = ae.HTMLTags[1]+removeWrap(img2embed(aed.documentElement.innerHTML))+ae.HTMLTags[3];
		ae.commands.getCommand("Paragraph").showChar();
		code = removeBase(code);
		code = removeSpellSpan(code);
	}

	if (ae.isbegin && ae.isend) {
		code = replace_editable(code);
	}

	if (useXHTML==1) {
		code = getXHTML(code);
	}

	re = /&amp;/g;
	code = code.replace(re,'&');

	if (pathType == "1") {
		replaceImage = 'src="';
		code = code.replace(re3,replaceImage);
	}

	if (ae.mode == "edit") {
		code = fix_bug_02(fix_bug_03(code));
	}

	code = ConvertSSLImages(code);
	if (ae.mode=="source") {
		code = _de_save_special_char2(code);
	} else {
		code = _de_save_special_char(code);
	}

	parent.document.getElementById(ae.InstanceName+"_html2").value = code;
	if (docType!=1 && ae.mode=="edit") { // for snippet mode
		h = code.match(BodyContents);
		code = h[2];
	}
	parent.document.getElementById(ae.InstanceName+"_html").value = formatSaveCode(code);
	if (isUpdate!=="no") {
		parent.document.getElementById(ae.InstanceName+"_save").click();
	}
}

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

	netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
	var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
	if (!clip) {
		return;
	}
	var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
	if (!trans) {
		return;
	}
	trans.addDataFlavor('text/unicode');
	clip.getData(trans,clip.kGlobalClipboard);
	var str = new Object();
	var len = new Object();
	try {
		trans.getTransferData('text/unicode',str,len);
	}
	catch(error) { return; }
	if (str) {
		if (Components.interfaces.nsISupportsWString) {
			str=str.value.QueryInterface(Components.interfaces.nsISupportsWString);
		} else if (Components.interfaces.nsISupportsString) {
			str=str.value.QueryInterface(Components.interfaces.nsISupportsString);
		} else {
			str = null;
		}
	}

	if (str) {
		var code = str.data.substring(0,len.value / 2);
	}
	code = code.replace( /\n/g, '<br/>' ) ;
	window.activeEditor._inserthtml( code ) ;
};

PasteText.prototype.getMode = function()
{
	ae = window.activeEditor;
	try
	{
		if (browser.NS){
			if (!ae.XPCOM) return DISABLED;
		}

		if (!ae._frame.queryCommandEnabled("paste")) {
			return DISABLED ;
		} else {
			return ae._frame.queryCommandState( "paste" ) ? ON : OFF ;
		}
	}
	catch (e) {
		return OFF ;
	}
};

// Source mode class
var SourceCommand = function()
{
	this.Name = "SourceMode";
};

old_body_tag = null;
SourceCommand.prototype.getMode = function()
{
};

SourceCommand.prototype.execute = function()
{
	var ae = window.activeEditor;
	var e = ae._frame;

	ae.commands.getCommand("Spellcheck").off();
	ae.commands.getCommand("Paragraph").hideChar();
	
	ToolbarSets.SwitchToolbarSet(toolbarmode);

	var fr = document.getElementById(ae.InstanceName+"_frame");
	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").reset(true);
	}

	document.getElementById("ePath").style.display="none";

	if (fr.style.display=="none") {
		var Ifr = document.getElementById(ae.InstanceName+"_preview");
		Ifr.style.display="none";
		fr.style.display="block";
		try {
			aed.designMode="on";
		} catch(e){}
	}

	if (ae.mode=="edit") {
		ae.saveBodyAttribute();
		var body_style="<style>body{font-family:verdana;font-size:11px;color:#000000;background-color:#FFFFFF;margin-top:10px;margin-left:10px;text-align: left;}</style>";

		var content = ae._frame.documentElement.innerHTML;
		if (docType==1){ // DE_DOC_TYPE_HTML_PAGE
			var c =  content;
			if (browser.isFireFox1_5){
				add_title="";
				if (c.indexOf("<title>")==-1 && ae._frame.title) {
					add_title = "<title>"+ae._frame.title+"</title>";
				}
				var newhtml = c.match(HeadContents);
				c = newhtml[1]+newhtml[2].replace(/\n+/g,"\n")+add_title+newhtml[3];
			}
			c = ae.HTMLTags[1] + c + ae.HTMLTags[3];
			if (useXHTML==1) {
				iHTML = getXHTML(c);
			} else {
				iHTML = c;
			}
		} else {
			var c = ae.HTMLTags[1] + content + ae.HTMLTags[3];
			ae.part = c.match(BodyContents);
			if (useXHTML==1) {
				iHTML = getXHTML(e.body.innerHTML);
			} else {
				iHTML = e.body.innerHTML;
			}
		}

		re = /&amp;/g;
		iHTML = iHTML.replace(re,'&');
		iHTML = iHTML.replace(/&/g,'&amp;');

		// switch to source view
		iHTML = img2embed(iHTML);
		iHTML = fix_bug_02(iHTML);
		iHTML = fix_bug_03(iHTML);
		iHTML = iHTML.replace(/</g,"&lt;");
		iHTML = iHTML.replace(/>/g,"&gt;");
		iHTML = iHTML.replace(/&lt;br&gt;/gi,"&lt;br/&gt;");
		iHTML = iHTML.replace(/\n/g,"<br/>");
		iHTML = iHTML.replace(/\r/g,"");
		iHTML = _de_replace_bookmark(iHTML);
		iHTML = iHTML.replace(/\n/g,"");
		iHTML = iHTML.replace(/\x09/g,"");
		iHTML = removeBase(iHTML);
		
		e.body.innerHTML = iHTML;
		var c=e.body.innerHTML;
		c = _de_parse_special_char(c);
		c = c.replace(/^(<br>)+/g,"");

		// addEditTag
		html =  addEditTag(colourCode(formatCode(c))); // body_style +
		e.body.innerHTML = html;
		
		e.body.style.fontFamily = "Verdana";
		e.body.style.fontSize = "11px";
		e.body.style.color = "#000000";
		e.body.style.text = '#000000';
		e.body.style.background = '#FFFFFF';
		e.body.style.marginTop = '10px';
		e.body.style.marginLeft = '10px';
		e.body.style.textAlign = 'left';
				
	}
	ae.mode="source";
	ae.lastmode="source";
	addLineNumber(html);
	buffer["source"].devhistory.position = 0;
	buffer["source"].saveHistory(true);
	ToolbarSets.SwitchToolbarSet("_source");
	ae.Focus();
};

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

	var ae = window.activeEditor;
	var e = ae._frame;

	var fr = document.getElementById(ae.InstanceName+"_frame");

	document.getElementById("ePath").style.display="block";

	if (fr.style.display=="none") {
		var Ifr = document.getElementById(ae.InstanceName+"_preview");
		fr.style.display="block";
		try {
			aed.designMode="on";
		} catch(e){}
		Ifr.style.display="none";
	}

	var headTag = /<\/head\s*>/i;

	if (ae.mode=="source") {
		ae.restoreBodyAttribute();

		var html = e.body.innerHTML;
		if (browser.isFireFox1_5) {
			html = html.replace(/<br\/?>/gi,"\n");
		} else {
			html = html.replace(/<br\/?>/gi,"\n");
		}
		html = html.replace(/<[^>]+>/g,"");

		html = html.replace(/&lt;/g,"<");
		html = html.replace(/&gt;/g,">");

		var addbase="";
		if (docType==1){ // DE_DOC_TYPE_HTML_PAGE
			html = html.toString().replace(headTag,addbase+'<link href="'+ae.skinPath+'borders.css" type="text/css" rel="stylesheet"></head>');
		} else{
			html = addbase + ae.part[1]+removeStyle(html)+ae.part[3];
		}
		var rr = new RegExp("&nbsp;","gi");
		html = html.replace(rr," ");
		html = html.replace(/&amp;/g,"&");
		ae.changeHTML(embed2img(removeEditTag(html)));
	}

	ae.mode="edit";	ae.lastmode="edit";
	if (ae.showborders==ON){
		ae.commands.getCommand("Showborders").set(false);
	} else {
		ae.commands.getCommand("Showborders").reset(false);
	}
	ae.commands.getCommand("Paragraph").showChar();
	removeLineNumber();	
	ToolbarSets.SwitchToolbarSet(toolbarmode);
	ae.doStyles();
	if (ae.toolbaritems.GetItem('Styles')){
		ae.toolbaritems.GetItem('Styles').Redraw();
	}
	checkImgLoaded();
	ae.Focus();
};

function removeStyle(code)
{
	styleTag = /(BODY\{font-family:Verdana;font-size:11px;color:#000000;background:#FFFFFF;margin-top:10px;margin-left:10px;text-align: left;\})/gi;
	code = code.replace(styleTag,"");
	return code;
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
	ToolbarSets.SwitchToolbarSet(toolbarmode);

	var ae = window.activeEditor;
	var aed = ae._frame;
	document.getElementById("ePath").style.display="none";
	var e = document.getElementById(ae.InstanceName+"_frame");
	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").reset();
	}
	ae.commands.getCommand("Paragraph").hideChar();

	var Ifr = document.getElementById(ae.InstanceName+"_preview");
	e.style.display="none";
	Ifr.style.display="block";

	if (ae.mode=="edit"){
		ae.saveBodyAttribute();
	}

	var addbase = "";
	if (ae.mode=="source"){
		var html = aed.body.ownerDocument.createRange();
		html.selectNodeContents(aed.body);
		var c = removeStyle(html.toString());
		if (myBaseHref && ae.useBase) {
			addbase += '<base href="'+myBaseHref+'" />';
		}	
		c = addbase + c ;
		if (docType!=1){
			var bodyhtml = removeStyle(c);
			c = ae.part[1] + bodyhtml + ae.part[3];
		}
		c = img2embed22(c);
	} else {
		var c = "<html>" + ae._frame.documentElement.innerHTML+"</html>";
		c = img2embed22(img2embed2(c));
	}

	c = c.replace('<link href="'+ae.skinPath+'borders.css" type="text/css" rel="stylesheet">','');
	ae.lastmode="preview";
	ae.changeHTML(c, Ifr.contentDocument,"preview");
	removeLineNumber();	
	checkImgLoaded(Ifr.contentDocument);
	ToolbarSets.SwitchToolbarSet("_preview");
};


function clearCode(code)
{
	code = code.replace(/<([\w]+) class=([^ |>]*)([^>]*)/gi, "<$1$3");
	code = code.replace(/<([\w]+) style="([^"]*)"([^>]*)/gi, "<$1$3");
	code = code.replace(/<\\?\??xml[^>]>/gi, "");
	code = code.replace(/<\/?\w+:[^>]*>/gi, "");
	code = code.replace(/<p([^>])*>(&nbsp;)*\s*<\/p>/gi,"");
	code = code.replace(/<span([^>])*>(&nbsp;)*\s*<\/span>/gi,"");
	code = code.replace(/<b([^>])*>(&nbsp;)*\s*<\/b>/gi,"");	
	code = code.replace(/[”“]/gi,'"');
	code = code.replace(/[‘’]/gi,"'");
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
	this.Name = 'ClearCode';
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

ClearCodeCommand.prototype.getMode = function(){
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

FullscreenCommand.prototype.changemode = function(str,par, val) {
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if ((idx>=0)&&(idx2==-1)){
		idx2=str.length;
	}
	return str.substring(0,idx+par.length+1) + val + str.substring(idx2,str.length);
};

FullscreenCommand.prototype.execute = function()
{
	ae = window.activeEditor;

	e = parent.document.getElementById(ae.InstanceName+"main");
	e1 = document.getElementById(ae.InstanceName+"main1");

	if (ae.fullscreen==OFF) {
		if (parent.document.compatMode=='CSS1Compat'){
			clW = parent.document.documentElement.clientWidth;
			clH = parent.document.documentElement.clientHeight;
			sL = parent.document.documentElement.scrollLeft;
			sT = parent.document.documentElement.scrollTop;
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
		e.style.width = w+"px";
		e.style.height = h+"px";
		document.getElementById("de_body").style.height=(h-5)+"px";
		ae.neww = w;
		ae.newh = h;
		ae.fullscreen=ON;
		ae.href = this.changemode(ae.href,"sizemode","on");
	} else {
		e1.style.height = "100%";
		e.style.position = '';
		e.style.left = 0;
		e.style.top = 0;
		e.style.width = ae.oldw;
		e.style.height = ae.oldh;
		document.getElementById("de_body").style.height=(ae.oldh-5)+"px";
		ae.neww = ae.oldw;
		ae.newh = ae.oldh;
		ae.fullscreen=OFF;
		ae.href = this.changemode(ae.href,"sizemode","off");
	}

	try{
		ae._frame.designMode = "On";
	} catch(e){}
	ae.Focus();
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
	this.Name = 'Inserttextboxe';
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
	for (var i = 0; i < elements.length; i++) {
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
	for (var i = 0; i < elements.length; i++) {
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
	for (var i = 0; i < el.id.length; i++) {
		el.id[i].className = el.className[i];
		if (!el.className[i]) {
			el.id[i].removeAttribute("class");
		}
	}
	el.id.length=0;
	el.className.length=0;
}

ShowBordersCommand.prototype.switchCSS = function(on)
{
	try{
	ae = window.activeEditor;
	var sheets = ae._frame.styleSheets;
	if (sheets.length > 0) {
		for (var x = 0; x < sheets.length; x++) {
			if (sheets[x]&&sheets[x].href.indexOf(border_css_file)>=0) {
				sheets[x].disabled = on;
				return;
			}
		}
	}
	} catch(e) {}
};

ShowBordersCommand.prototype.set = function()
{
	try{
		ae = window.activeEditor;
		var sheets = ae._frame.styleSheets;
		if (el.id.length>0) {
			resetClassForAll();
		}
		setClassForInput();
		setClassForAnchor();
		this.switchCSS(false);
	} catch(e) {}
};

ShowBordersCommand.prototype.reset = function()
{
	try{
		ae = window.activeEditor;
		var sheets = ae._frame.styleSheets;
		this.switchCSS(true);
		resetClassForAll();
	} catch(e) {}
};

ShowBordersCommand.prototype.execute = function(ignore)
{
	ae = window.activeEditor;
	if (ae.showborders==OFF){
		if (ignore!==true) {
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
	ae = window.activeEditor;
	ae.Focus();

	try{
		var new_frame = parent.document.createElement("IFRAME");
		new_frame.style.visibility = "hidden";
		new_frame.style.position = "absolute";
		new_frame.style.top = "0px";
		new_frame.style.left = "0px";
		new_frame.id = "temp_frame_for_paste";
		parent.document.body.appendChild(new_frame);
		var frame = parent.document.getElementById("temp_frame_for_paste").contentDocument;
		frame.designMode = "on";
		frame.open();
		frame.write("");
		frame.close();
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		frame.execCommand("Paste", false, null );
		code = frame.body.innerHTML;
		code = clearCode(code);
		window.activeEditor._inserthtml( code ) ;
		document.body.removeChild(new_frame);
		new_frame = null;
	} catch(e){	}
};


PasteFromMSWord.prototype.getMode = function()
{
	ae = window.activeEditor;
	// some bug's behavior
	// disable copy,paste,cut commands in Mozilla
	if (browser.NS) {
		if (!ae.XPCOM) {
			return DISABLED;
		}
	}

	// normal behavior
	try
	{
		if (!ae._frame.queryCommandEnabled( "paste" ) ) {
			return DISABLED;
		} else {
			return ae._frame.queryCommandState( "paste" ) ? ON : OFF;
		}
	}
	catch (e)
	{
		return OFF ;
	}
};
// ***** end of [paste from MS Word] ******


// Undo command
var Undo = function()
{
	this.Name = 'undo' ;
};

Undo.prototype.execute = function()
{
	var ae = window.activeEditor;
	buffer[ae.mode].goHistory(-1);
	window.activeEditor._window.focus();
};

Undo.prototype.getMode = function()
{
	var ae = window.activeEditor;
	if ((buffer[ae.mode].devhistory.data.length <= 1) || (buffer[ae.mode].devhistory.position <= 0)) {
		return DISABLED;
	} else {
		return OFF;
	}
};

// Redo command
var Redo = function()
{
	this.Name = 'undo' ;
};

Redo.prototype.execute = function()
{
	var ae = window.activeEditor;
	buffer[ae.mode].goHistory(1);
	window.activeEditor._window.focus();
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

// ToggleAbsolute command
var TogglePosition = function()
{
	this.Name = 'toggleposition';
};

TogglePosition.prototype.execute = function()
{
	var sel = window.activeEditor.GetSelectedElement();
	if (!sel) {
		sel = window.activeEditor.parentNode("TABLE");
	}
	if (!sel) {
		return;
	}
	if (sel.style && sel.style.position=="absolute") {
		sel.style.position="";
	} else {
		sel.style.position="absolute";
	}
};

TogglePosition.prototype.getMode = function(){
	var sel = window.activeEditor.GetSelectedElement();
	if (!sel) {
		sel = window.activeEditor.parentNode("TABLE");
	}
	if (!sel) {
		return DISABLED;
	}
	if (sel.style && sel.style.position=="absolute") {
		return ON;
	} else {
		return OFF;
	}
};


// Name: Undo / Redo function
// Info: undo/redo fonctions for Gecko.

var URBuffer = function()
{
	var devhistory = new Object;
	devhistory.data = [];
	devhistory.position = 0;
	devhistory.offset = [];
	devhistory.offset2 = [];
	devhistory.index = new Array();
	devhistory.index2 = new Array();
	devhistory.max = _de_max_history_item;
	this.devhistory = devhistory;
};

URBuffer.prototype.createBookmark = function(node, node2, pos)
{
	this.devhistory.index[pos] = new Array();
	var count=0;
	while (node && node!==window.activeEditor._frame.body) {
		x = node;
		node = node.parentNode;
		if (node && node.childNodes != null) {
			for (var i=0; i < node.childNodes.length; i++) {
				if (x == node.childNodes.item(i)) {
					this.devhistory.index[pos][count] = i;
					count++;
					break;
				}
			}
		}
	}
	//if (node2==node)return;
	node = node2;
	this.devhistory.index2[pos] = new Array();
	count=0;
	while(node && node!==window.activeEditor._frame.body){
		x = node;
		node = node.parentNode;
		if (node && node.childNodes != null) {
			for (var i=0; i < node.childNodes.length; i++) {
				if (x == node.childNodes.item(i)) {
					this.devhistory.index2[pos][count] = i;
					count++;
					break;
				}
			}
		}
	}
};

URBuffer.prototype.moveToBookmark = function()
{
	ae = window.activeEditor;
	var selection = ae._window.getSelection();
	selection.removeAllRanges();
	var range = aed.createRange();

	var pos = this.devhistory.position;
	var node = ae._frame.body;
	for (var i=this.devhistory.index[pos].length-1;i>=0;i--) {
		node = node.childNodes.item(this.devhistory.index[pos][i]);
	}
	range.setStart(node,this.devhistory.offset[pos]);

	if (typeof(this.devhistory.index2[pos])=="object"){
		var node2 = ae._frame.body;
		for (var i=this.devhistory.index2[pos].length-1;i>=0;i--) {
			node2 = node2.childNodes.item(this.devhistory.index2[pos][i]);
		}
		range.setEnd(node2,this.devhistory.offset2[pos]);
	} else {
		range.collapse(true);
	}
	selection.addRange(range);
};

URBuffer.prototype.saveHistory = function(incPosition)
{
	ae = window.activeEditor;
	aed = ae._frame;
	var recpos;
	try{
	if (this.devhistory.data[this.devhistory.data.length -1] != aed.documentElement.innerHTML) {
		if (this.devhistory.data.length >= this.devhistory.max) {
			if (this.devhistory.position==0) {
				this.devhistory.data.length = 0;
				this.devhistory.bookmark.length = 0;
			} else {
				this.devhistory.data.shift();
				this.devhistory.bookmark.shift();
				this.devhistory.position--;
			}
		}
		recpos = this.devhistory.data.length;
		this.devhistory.data[recpos] = aed.documentElement.innerHTML;
		var sel = ae._window.getSelection();
		if (sel && sel.rangeCount > 0) {
			var selectedRange = sel.getRangeAt(0);
			this.createBookmark(selectedRange.startContainer,selectedRange.endContainer, recpos);
			this.devhistory.offset[recpos] = selectedRange.startOffset;
			this.devhistory.offset2[recpos] = selectedRange.endOffset;
		}

		if (!incPosition) {
			this.devhistory.position++;
		}
	}
	} catch (e) {}
};

URBuffer.prototype.goHistory = function(value)
{
	ae = window.activeEditor;
	aed = ae._frame;

	// undo
	if (value == -1) {
		if (this.devhistory.position != 0) {
			this.devhistory.position--;
			ae.changeHTML("<html>"+this.devhistory.data[this.devhistory.position]+"</html>");
			this.setHistoryCursor();
		}
	// redo
	} else {
		if (this.devhistory.position < this.devhistory.data.length -1) {
			this.devhistory.position++;
			ae.changeHTML("<html>"+this.devhistory.data[this.devhistory.position]+"</html>");
			this.setHistoryCursor();
		}
	}
	if (ae.showborders==ON) {
		ae.commands.getCommand("Showborders").set(true);
	} else {
		ae.commands.getCommand("Showborders").reset(true);
	}
};

URBuffer.prototype.setHistoryCursor = function() {

	ae = window.activeEditor;
	aed = ae._frame;

	this.moveToBookmark();
	ae._window.focus();
};

var buffer = new Array();
buffer["edit"] = new URBuffer();
buffer["source"] = new URBuffer();

// Name: Editor class
// Info: Contain all editors methonds for Gecko browsers.

var Editor = function( instanceName, width, height, skinName)
{
	window.activeEditor	= this;

	// Properties
	this.InstanceName	= instanceName ;
	this.Value			= '' ;
	this.Width			= width;
	this.Height			= height;
	this.skinName		= skinName ;

	// auxiliary properties
	this._frame			= false;
	this.mode			= "edit";
	this.lastmode		= "edit";
	this.showborders	= OFF;
	this.customLink		= CustomLink;
	this.tempWin		= null;
	this.tempEl;
	this.arr			= null;
	this.skinPath		= skinPath;
	this.snippetCSS		= snippetCSS;
	this._html			= null;
	this._preview_html	= null;
	this.XPCOM			= true;
	this.selectedtag	= null;
	this.editable		= true;
	this.href			= window.location.href;
	this.tempnode		= null;
	this.initHTML		= null;
	this.unlock			= false;
	this.use_old_base	= false;
	this.useBase		= false;
	this.isbegin		= false;
	this.isend			= false;
	this.disableTabs	= false;



	if (this.getParameter("sizemode")=="on"){
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
	if ((idx>=0)&&(idx2==-1)){
		idx2=str.length;
	}
	this.href = str.substring(0,idx+par.length+1) + val + str.substring(idx2,str.length);
};

Editor.prototype.getParameter = function(par)
{
	var str = this.href;
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if ((idx>=0)&&(idx2==-1)) {
		idx2=str.length;
	}
	return str.substring(idx+par.length+1,idx2);
};

Editor.prototype.attachStyleSheet = function(name)
{
	this.addStyleSheet(this._frame,name);
};

// add StyleSheet (name) to document( d )
Editor.prototype.addStyleSheet = function(d,name)
{
	var e=d.createElement('LINK');
	e.rel='stylesheet';
	e.type='text/css';
	e.href=name;
};

Editor.prototype.checkLoad = function()
{
	if (hideitems["EditMode"]==1 && hideitems["SourceMode"]==1 && hideitems["PreviewMode"]==1) {
		this.disableTabs=true;
	}
	this.commands = new Commands();
	this.toolbaritems = new ToolbarItems();

	ToolbarSets.AddItem(toolbarmode,'eToolbar');
	ToolbarSets.AddItem("_source",'eToolbar');
	ToolbarSets.AddItem("path",'ePath');
	ToolbarSets.AddItem("_preview",'eToolbar');
	if (!this.disableTabs)ToolbarSets.AddItem("footer",'eFooter');

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
	this.setSize();
};

Editor.prototype.setSize = function()
{

	var fr = document.getElementById(ae.InstanceName+"_frame");
	fr.height="100%";
	var pDiv = parent.document.getElementById(ae.InstanceName+"main");
	this.realHeight = pDiv.offsetHeight;
	var tDiv = document.getElementById(ae.InstanceName+"main1");
	if (pDiv.offsetWidth<tDiv.offsetWidth) {
		pDiv.style.width = (tDiv.offsetWidth+20)+"px";
	}
	if (pDiv.offsetHeight<tDiv.offsetHeight) {
		pDiv.style.height = (tDiv.offsetHeight)+"px";
	}

	document.getElementById("de_body").style.height=(pDiv.offsetHeight-5)+"px";

	if (this.getParameter("oldw")=="0") {
		this.oldw = pDiv.offsetWidth;
		this.oldh = pDiv.offsetHeight;
		this.oldh = pDiv.offsetHeight;
		this.setParameter("oldw",this.oldw);
		this.setParameter("oldh",this.oldh);
	} else {
		this.oldw = this.getParameter("oldw")*1.0;
		this.oldh = this.getParameter("oldh")*1.0;
	}
	this.neww = this.oldw;
	this.newh = this.oldh;
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

Editor.prototype.loadComplete = function()
{
	this.setInitialValue();
};


Editor.prototype.setInitialValue = function()
{
	// set default color
	ToolbarSets.SwitchToolbarSet (toolbarmode);
	PopupSet.CreatePopup("spellmenu");
	PopupSet.CreatePopup("sourcetag");	

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
	if (hideitems["guidelinesOnByDefault"]==0) {
		this.commands.getCommand('Showborders').switchCSS(true);
	}

	buffer["edit"].saveHistory(true);

	ae.doStyles();
	this.sheet.Redraw();
	ToolbarSets.Redraw();
	ae.checkEditArea();

	checkImgLoaded();

	if (is_setCursor) {
		this.Focus();
	} else {
		this.updateValue();
	}
	
	if (eventListener){
		for (var i = 0; i < eventListener.length; i++){
			if (eventListener[i][0].toLowerCase()=="onload"){
				eval("parent."+eventListener[i][1]+"()");
			}	
		}
	}
	loading_in_progress = false;
};

Editor.prototype.checkEditArea = function()
{
	var ae = window.activeEditor;
	check = false;
	findAllEditable(this._frame.body);
	ae.isbegin = check;
	ae.isend = check;
};

Editor.prototype.writeContentWithCSS = function(data)
{
};

Editor.prototype.saveBodyAttribute = function()
{
	try{
	this.bodyattr = new Array();
	for (var i=0;i<this._frame.body.attributes.length;i++){
		if (this._frame.body.attributes[i].nodeName.substr(0,1)!=="-") {
			this.bodyattr[i] = this._frame.createAttribute(this._frame.body.attributes[i].nodeName);
			this.bodyattr[i].nodeValue = this._frame.body.attributes[i].nodeValue.replace(/(-moz-[^;]+;)/gi,"");
		}	
	}
	} catch(e){}
};

Editor.prototype.restoreBodyAttribute = function()
{
	var b = this._frame.body.attributes;
	for (var i=0;i<b.length;i++){
		this._frame.body.removeAttributeNode(b[i]);
	}
	for (var i=0;i<this.bodyattr.length;i++) {
		this._frame.body.setAttributeNode(this.bodyattr[i]);
	}
};

Editor.prototype.writeC = function(html)
{
	this.writeContent(embed2img(addWrap(html)));
};

Editor.prototype.writeHTMLContent = function(html)
{
	if (this.mode=="source"){
		html = html.replace(/</g,"&lt;");
		html = html.replace(/>/g,"&gt;");
	}	
	//this.writeContent(embed2img(addWrap(html)));
	this.w(html);
};

Editor.prototype.w = function(data)
{
	if (parent.document.getElementById(name+"_html2").value!="" && !data) {
		html = parent.document.getElementById(name+"_html2").value;
		html = html.replace(/&amp;/g,'&');
		if (html.toLowerCase().indexOf("<html")>=0) {
			var add_to_head = '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && html.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			newhtml = html.match(HeadContents);
			if (newhtml) {
				html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
			} else {
				html = h;
			}
		}
	} else {
		var h = data ? data : parent.document.getElementById(name+"_input").value;
		if (h=="") {
			h="<body></body>";
		}
		var html="";
		if (h.toLowerCase().indexOf("<html")>=0){
			var add_to_head = '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && h.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			newhtml = h.match(HeadContents);
			if (newhtml) {
				html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
			} else {
				html = h;
			}
		} else {
			html = "<html><head>";
			html += '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
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
	var h = data?data:parent.document.getElementById(name+"_input").value;
	if (h.toLowerCase().indexOf("<html")>=0) {
		if (!this.initHTML) {
			this.initHTML = h;
		}
	} else {
		if (!this.initHTML) {
			this.initHTML = "<html><head></head>"+h+"</html>";
		}
	}

	this.HTMLTags = html.match(HtmlContents);
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
		this._frame.designMode = "on";
		this._frame.open();
		html = this.checkBODY(html);
		this._frame.write(embed2img(addWrap(html)));
		this._frame.close();
	} catch(e){}
};

Editor.prototype.writeContent = function(html)
{
	var o = this._frame;
	o.open();
	o.write(html);
	o.close();
	return;
};

Editor.prototype.changeHTML = function(html, frameobj, pr)
{
	var aed = this._frame;
	var o;
	if (frameobj){
		o=frameobj;
	} else {
		o=aed;
	}
	if (pr){
		o.open();
		o.write(html);
		o.close();
		return;
	}

	o.getElementsByTagName("BODY")[0] = old_body_tag;
	var old_head_text = o.getElementsByTagName("HEAD")[0].innerHTML;
	var h = html.match(HeadContents);
	if (h && h[2]!=old_head_text) {
		try{
			o.getElementsByTagName("HEAD")[0].innerHTML = h[2];
		} catch(e){}
	}

	html = fix_bug_01(html);
	var m = html.match(BodyContents);
	if (m){
		try{
			if (pr) {
				o.body.innerHTML = addFullURI(m[2]);
			} else {
				o.body.innerHTML = m[2];
			}
		} catch(e){}
	}
};

function setEvent ()
{
	window.activeEditor.setEvent();
}

Editor.prototype.setEvent = function()
{
	ae = window.activeEditor;
	try {
		this._frame.addEventListener( 'keydown', this.Redraw , true) ;
		this._frame.addEventListener( 'keypress', this.StopDefault , false) ;
		this._frame.addEventListener( 'keyup', this.CheckUp , false) ;
		this._frame.addEventListener( 'contextmenu', this.ContextMenu , true) ;
		this._frame.addEventListener( 'dragdrop', this.CheckEditable, true ) ;
		this._frame.addEventListener( 'drop', this.CheckEditable, true ) ;
		this._frame.addEventListener( 'mouseup', this.Redraw, true ) ;
		this._frame.addEventListener( 'mousedown', this.MouseDown, true ) ;
		this._frame.addEventListener( 'blur', this.updateValue, false ) ;
		this._frame.addEventListener( 'scroll', scrollLineBar, false ) ;
	} catch(e){}

	// Disable the standard table editing features of Firefox.
	try {
		this._frame.execCommand( 'enableInlineTableEditing', false, false ) ;
	} catch (e){}

	if (is_setCursor){
		ae.Focus();
	}
};

mouseisdown=false;

Editor.prototype.setdown = function()
{
	mouseisdown=true;
	return true;
};

Editor.prototype.setup = function(evt)
{
	mouseisdown=false;
	evt = (evt)?evt:(window.event)?window.event:"";

	PopupSet.Redraw();
	ToolbarSets.Redraw(evt);

	return true;
};

Editor.prototype.updateValue = function()
{
	window.activeEditor.commands.getCommand('Save').execute("no");
};

// create Editor object
Editor.prototype.Create = function()
{
	// instanceName should not be empty
	if (!this.InstanceName || this.InstanceName.length == 0) {
		this.throwError( 1, 'You must specify a instance name.' );
		return ;
	}

	// check browser compatible
	if (!this.isCompatibleBrowser()) {
		this.throwError( 2, 'Browser is not compatible.' );
		return ;
	}

	// instert editor into page
	var htmlstr = "";
	htmlstr+= '<div id="colormenu" style="position:absolute;left:-500;top:-500;visibility:hidden">';
	htmlstr+= '<iframe id="color_frame" width=172 height=146 src="colormenu.php" frameborder="no" scrolling="no"></iframe>';
	htmlstr+= '</div>';

	htmlstr+= '<div id="'+this.InstanceName+'main1" style="height:100%;width:100%">';
	htmlstr+= '<table width="100%" height="100%" class="container" border="0" cellspacing="0" cellpadding="0" >';
	htmlstr+= '<tr><td>';
	htmlstr+= '<div id="eToolbar"></div>';
	htmlstr+= '</td></tr>';
	htmlstr+= '<tr><td width="100%" height="100%" >';
		htmlstr+= '<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">';
		htmlstr+= '<tr><td valign=top>';
		htmlstr+= '<div id="containerLineNumber"><div class="de_source_class" id="lineNumber"><img src="images/1x1.gif" width="1px" height="5px">&nbsp;</div></div></td>';
		htmlstr+= '<td class="editcontainer_in" width="100%" height="100%">';
		htmlstr+= '<iframe onblur="updateValue();" width="100%" height="1px" class="editcontainer" id="' + this.InstanceName + '_frame'+'"'+' onLoad="setEvent()" frameborder="no"></iframe>';
		htmlstr+= '<iframe id="' + this.InstanceName + '_preview'+'" width="100%" height="100%" scrolling="yes"  frameborder="0" class="editcontainer" style="display:none;"></iframe>';
		htmlstr+= '</td><td width="1px">';
		htmlstr+= '<img src="images/1x1.gif" width="1px">&nbsp;&nbsp;';
		htmlstr+= '</td></tr>';
		htmlstr+= '</table>';
	htmlstr+= '</td></tr>';
	htmlstr+= '<tr><td><img src="images/1x1.gif" height=5px></td></tr>';
	htmlstr+= '<tr '+(hideTagBar?'style="display:none;"':'')+'><td class="TB_Toolbar" class="pathtext">';
		htmlstr+= '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
		htmlstr+= '<tr><td>';
		htmlstr+= '<span id="ePath"></span>';
		htmlstr+= '</td>';
		htmlstr+= '<td>';
		htmlstr+= '<span style="float:right" class="pathcontainer" id="eRemoveTag"></span>';
		htmlstr+= '</td></tr>';
		htmlstr+= '</table>';
	htmlstr+= '</td></tr>';

	if (!(hideitems["EditMode"]==1 && hideitems["SourceMode"]==1 && hideitems["PreviewMode"]==1)){
		htmlstr+= '<tr><td class="TB_Toolbar">';
		htmlstr+= '<table border="0" cellspacing="0" cellpadding="0">';
		htmlstr+= '<tr><td>';
		htmlstr+= '<div id="footersheet"></div>';
		htmlstr+= '</td>';
		htmlstr+= '<td width="100%" valign=top>';
			htmlstr+= '<table cellspacing="0" cellpadding="0" border="0" width="100%">';
			htmlstr+= '<tr><td width="100%">';
			htmlstr+= '<div class="sheetline1" width="100%" height="1px"></div>';
			htmlstr+= '</td></tr>';
			htmlstr+= '<tr><td width="100%">';
			htmlstr+= '<div class="sheetline2" width="100%" height="1px"></div>';
			htmlstr+= '</td></tr>';
			htmlstr+= '<tr><td align="right">';
			htmlstr+= '<div id="eFooter"></div>';
			htmlstr+= '</td></tr>';
			htmlstr+= '</table>';
		htmlstr+= '</td></tr></table>';
		htmlstr+= '</td></tr>';
		htmlstr+= '</table>';
	htmlstr+= '</td></tr>';
	}
	htmlstr+= '</table>';
	htmlstr+= '</div>';

	document.write(htmlstr);

	aID = this.InstanceName + '_frame';
	window.aID = aID;
	this._frame=document.getElementById(aID).contentDocument;
	this._window=document.getElementById(aID).contentWindow;
	this._preview = document.getElementById(this.InstanceName + '_preview').contentDocument;
	window.fr = this._frame;
	aed = this._frame;

	try{
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
	} catch(e) {
		this.XPCOM = false;
	}

	if (parent.document.getElementById(name+"_html2").value!="") {
		html = parent.document.getElementById(name+"_html2").value;
		html = html.replace(/&amp;/g,'&');
		if (html.toLowerCase().indexOf("<html")>=0) {
			var add_to_head = '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && html.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			newhtml = html.match(HeadContents);
			if (newhtml) {
				html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
			} else {
				html = h;
			}
		}

	} else {
		var h = parent.document.getElementById(name+"_input").value;
		if (h=="") {
			h="<body></body>";
		}
		var html="";
		if (h.toLowerCase().indexOf("<html")>=0){
			var add_to_head = '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
			if (this.snippetCSS) {
				add_to_head += '<link href="'+this.snippetCSS+'" type="text/css" rel="stylesheet" />';
			}
			if (myBaseHref && h.toLowerCase().indexOf("<base")==-1) {
				add_to_head += '<base href="'+myBaseHref+'" />';
				this.useBase = true;				
			}
			newhtml = h.match(HeadContents);
			if (newhtml) {
				html = newhtml[1]+newhtml[2]+add_to_head+newhtml[3];
			} else {
				html = h;
			}
		} else {
			html = "<html><head>";
			html += '<link href="'+this.skinPath+'borders.css" type="text/css" rel="stylesheet" />';
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
	var h = parent.document.getElementById(name+"_input").value;
	if (h.toLowerCase().indexOf("<html")>=0){
		if (!this.initHTML) {
			this.initHTML = h;
		}
	} else {
		if (!this.initHTML) {
			this.initHTML = "<html><head></head>"+h+"</html>";
		}
	}


	//this.HTMLTags = html.match(HtmlContents);
	this.HTMLTags=null;
	var pos = html.indexOf("<html");
	if (pos==-1) {
		pos=html.indexOf("<HTML");
	}
	if (pos>=0){
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

	if (!this.HTMLTags){
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
		//this._frame.designMode = "on";
		setTimeout("enable()",10)
		this._frame.open();
		html = this.checkBODY(html);
		this._frame.write(embed2img(addWrap(html)));
		this._frame.close();
	} catch(e) {}

	this.checkLoad();
};

function enable(){
	window.activeEditor._frame.designMode = "on";
}

Editor.prototype.checkBODY = function(s)
{
	return s.replace(/<body><\/body>/gi,"<body></body>");
};

Editor.prototype.lockPage = function()
{
	var ae = window.activeEditor;
	ae.checkEditArea();
	ae.unlock = false;
};

Editor.prototype.unlockPage = function()
{
	var ae = window.activeEditor;
	ae.unlock = true;
	ae.isbegin = false;
	ae.isend = false;
};

Editor.prototype.Editable = function(e,e1)
{
	ae = window.activeEditor;
	var range = null;
	var fR = null;
	var clW=0,clH=0,sL=0,sT=0;

	if (this._frame.compatMode=='CSS1Compat'){
		clW = this._frame.documentElement.clientWidth;
		clH = this._frame.documentElement.clientHeight;
		sL = this._frame.documentElement.scrollLeft;
		sT = this._frame.documentElement.scrollTop;
	} else {
		clW = this._frame.body.clientWidth;
		clH = this._frame.body.clientHeight;
		sL = this._frame.body.scrollLeft;
		sT = this._frame.body.scrollTop;
	}

	if (e && ((e.pageX > (clW+sL) )|| (e.pageY > (clH+sT) ) )){
		return true;
	}

	if (e && (e.type=="mousedown"|| e.type=="mouseup") && e.target && e.target.tagName && e.target.tagName.toUpperCase()=="HTML" && ae.mode=="edit"){
		return;
	}

	try{
		oContainer = ae.getSelectedElement();
		if (!oContainer) {
			if (e1) {
				oContainer = e1.target;
			} else {
				oSel = ae._window.getSelection();
				range = oSel.getRangeAt(0);
				var oContainer = range.startContainer;
				var p = range.commonAncestorContainer;
				if (!range.collapsed && range.startContainer == range.endContainer && range.startOffset - range.endOffset <= 1 && range.startContainer.hasChildNodes()){
					p = range.startContainer.childNodes[range.startOffset];
					oContainer = p;
				}
				fR = p;
				oContainer = p;
				while (p.nodeType == 3 ) {
					p = p.parentNode;
					oContainer = p;
				}
			}
		}

		var isEditable = ae.unlock ||ae.walkDOM(oContainer);
		if (insideWrap) {
			oContainer=wrap;
		}

		try{
			if (oContainer && oContainer.id && oContainer.id.substr(0,7)=="de_wrap"){
				// start & backspace - range.startOffset == 0) && (e.which==8)
				//end & del - rest of if statement
				compare = ae._frame.createRange();
				compare.selectNodeContents(oContainer);
				compare.collapse(false);


				// (range.endOffset == fR.length)
				var fc = false;
				if (oContainer.firstChild){
					if (oContainer.firstChild){
						fc=oContainer.firstChild==range.startContainer;
						if (!fc) {
							x = oContainer.firstChild;
							while (x && x!==range.startContainer)x=x.firstChild;
							fc=x==range.startContainer;
						}	
						if (!fc && oContainer.firstChild.nodeValue=="")fc=oContainer.firstChild.nextSibling==range.startContainer;	
					}
				}
				var ce = false;
				if (oContainer.lastChild){
					ce = oContainer.lastChild==range.endContainer;
					var last = oContainer.lastChild;

					if (!ce){
						while (last && last!==range.endContainer){
							last=last.lastChild;
						}
						if (!last)ce=false;
					}		
					if (last){
						ce = range.endOffset == last.nodeValue.length;					
						if (!ce) ce = (range.endOffset == last.nodeValue.length-1 && last.nodeValue.charCodeAt(last.nodeValue.length-1)==10 );
						if (!ce && last.nodeValue=="")	ce = range.endOffset == last.previousSibling.nodeValue.length;
					}	

				}
				if (((range.startOffset==0 && fc || range.startContainer.nodeValue.charCodeAt(0)==10 && range.startOffset==1) && (e.which==8)) || 
				   ( (ce ) && (e.type && e.type=="keydown" && e.which==46))) {
					isEditable=false;
				}
			}
		} catch(x){}
		if (e) {
			if (ae.walkDOM && isEditable) {
				ae.editable = true;
				return true;
			} else {
				e.stopPropagation();
				e.preventDefault();
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
	} catch(e){}
};

Editor.prototype.MouseDown = function(evt)
{
	if (window.activeEditor.Editable(evt,evt)){
	e = evt;
	if (e.target && e.target.tagName && e.target.tagName.toLowerCase() =="div" && e.target.innerHTML==""){
		e.target.innerHTML="&nbsp;";
		
		var sel = window.activeEditor._window.getSelection();
		var range = window.activeEditor._frame.createRange();
		range.selectNode(e.target.firstChild);
		sel.removeAllRanges();
		sel.addRange(range);

	};
	}
	return true;
};

Editor.prototype.ContextMenu = function(evt)
{
	if (hideitems["ContextMenu"]){
		evt.stopPropagation();
		evt.preventDefault();
	} else {
	if (!evt.ctrlKey){
		Selection.set();
		var ae = window.activeEditor;
		ae.commands.getCommand("Contextmenu").execute(null,evt.clientX,evt.clientY);
		var sel = ae._window.getSelection();

		var node = null;
		var node2 = null;
		for (var i=0;i<10;i++){
			node = ae._frame.getElementById("de_wrap_div"+(i+1));
			node2 = sel.anchorNode;
			if (!node) {
				break;
			}
			if (node && sel.containsNode(node,true)) {
				break;
			}
			if (node2 && node2.id && node2.id.indexOf("de_wrap_id")>=0) {
				node=node2;
				break;
			}
		}

		if (node && !sel.isCollapsed && (sel.containsNode(node,false)||node2==node)){
			sel.getRangeAt(0).selectNodeContents(node);
			sel.collapseToEnd();
		}
		evt.stopPropagation();
		evt.preventDefault();
	}
	}
};

// source engine var's
context_str="";
tag_typing = false;

// redraw
Editor.prototype.Redraw = function(e)
{
	ae = window.activeEditor;
	ae.editable = true;
	var cShow = false;
	cancel_event = false;
	
	if (!e) {
		return true;
	}
	if (!ae.Editable(e)) {
		x = ae.Editable(e)
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);

		return false;
	}
	Selection.set();
	wc = window.activeEditor.commands;

	// check spell words
	var se = ae.GetSelectedElement();
	if (!se&&ae.GetSelection()=="") {
		se = ae.firstParentNode();
	}
	if (se && se.id && se.id.substring(0,9) =="_de_spell"){
		// select word
		var sel = ae._window.getSelection();
		range = ae._frame.createRange();
		range.selectNode(se);
		//sel.removeAllRanges();
		sel.addRange(range);

		var dg = se.id.match(/(\d+)/g);
		PopupSet.Items["spellmenu"].ReplaceItems(dg[0]*1.0);
		ae.commands.getCommand("Spellmenu").execute(null,e.clientX,e.clientY);
		PopupSet.Redraw("spellmenu");
		e.stopPropagation();
		e.preventDefault();
		return;
	}
	// end check spell

	cancel_event=false;

	// Enter - if useBR=1 then use <br/>
	if (e.which==13) {
		if (useBR==0) {
			ae._frame.execCommand("FormatBlock", false, "<P>");
		}
		cShow = true;
	}

	var f = false;
	var shortcut = false;
	if (e.ctrlKey){
		var key = String.fromCharCode(e.which).toUpperCase();
		for(var i=0; i < ShortCutKeys.length; i++){
			var k = ShortCutKeys[i][0];
			if (k.toUpperCase().indexOf("SHIFT")>=0 && e.shiftKey && key==k.substr(k.indexOf("+")+1,1))f=true;
				else if (key == k)f=true;
			if (f) {
				window.activeEditor.commands.getCommand(ShortCutKeys[i][1]).execute();
				f = false;
			}
		}
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
		cShow = true;
	}

	if(!e.ctrlKey && e.which==1) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
		cShow = true;
	}

	if (shortcut || cancel_event) {
		e.stopPropagation();
		e.preventDefault();
	}

	if (cShow){		
		setTimeout("window.activeEditor.commands.getCommand('Paragraph').showChar()",20);
	}
			
	return true;
};

Editor.prototype.CheckEditable = function(e)
{
	return window.activeEditor.Editable(e);
};

Editor.prototype.StopDefault = function(e)
{
	window.activeEditor.Editable(e);

	if (e.ctrlKey){
		var key = String.fromCharCode(e.which).toUpperCase();
		for(var i=0; i < ShortCutKeys.length; i++){
			if (key == ShortCutKeys[i][0]) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
	}
};

Editor.prototype.CheckUp = function(e)
{
	e = (e) ? e : (window.event) ? window.event : "";
	window.activeEditor.Editable(e);

	// redraw menus for keys:
	if (!e.ctrlKey && (e.which >= 37 && e.which <= 40) && !cancel_event) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}

	if (e.shiftKey && (e.which==35 || e.which==36)) {
		PopupSet.Redraw();
		ToolbarSets.Redraw(e);
	}

	if (!e.ctrlKey && e.which != 90 && e.which != 89) {
		if (e.which == 32 || e.which == 13 || e.which == 46)
		{
			buffer[window.activeEditor.mode].saveHistory();
			PopupSet.Redraw();
			ToolbarSets.Redraw(e);
		}
	}
	return true;
};

Editor.prototype.Focus = function()
{
	try{
		window.activeEditor._window.focus();
	} catch ( e ) {}
};

// this method check browser compatible
Editor.prototype.isCompatibleBrowser = function()
{
	if ( browser.NS && navigator.productSub >= 20020512 ) { //20030210
		return true ;
	} else {
		return false ;
	}
};

// show errors
Editor.prototype.throwError = function( errorNumber, errorDescription )
{
	this.ErrorNumber		= errorNumber ;
	this.ErrorDescription	= errorDescription ;

	document.write('<div style="COLOR: #ff0000">' ) ;
	document.write('[ Editor Error ' + this.ErrorNumber + ': ' + this.ErrorDescription + ' ]' ) ;
	document.write('</div>' ) ;
};

Editor.prototype.clearAll = function()
{
	this._frame.body.innerHTML = '&nbsp;';
};

Editor.prototype.clearContent = function()
{
	this._frame.body.innerHTML = '&nbsp;';
};

Editor.prototype._insertBefore = function(text)
{
	text = embed2img(addWrap(text,1));
	insertNodeAtSelection(document.getElementById(window.aID),text,true);

	var aew = window.activeEditor._window;
	var aed = window.activeEditor._frame;

	var node = aed.getElementById("_de_temp_element");
	if (node){
		var sel = aew.getSelection();
		var range = aed.createRange();
		range.selectNode(node);
		sel.removeAllRanges();
		sel.addRange(range);
		node.removeAttribute("id");
	}
	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
};

Editor.prototype._inserthtml = function(text)
{
	text = embed2img(addWrap(text,1),true);
	insertNodeAtSelection(document.getElementById(window.aID),text);

	var aew = window.activeEditor._window;
	var aed = window.activeEditor._frame;

	var node = aed.getElementById("_de_temp_element");
	if (node){
		var sel = aew.getSelection();
		var range = aed.createRange();
		range.selectNode(node);
		sel.removeAllRanges();
		sel.addRange(range);
		node.removeAttribute("id");
	}
	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
};

Editor.prototype._shift_inserthtml = function(text, shift)
{
	text = embed2img(addWrap(text,1));
	insertNodeAtSelection(document.getElementById(window.aID),text,false,shift);

	var aew = window.activeEditor._window;
	var aed = window.activeEditor._frame;

	var node = aed.getElementById("_de_temp_element");
	if (node){
		var sel = aew.getSelection();
		var range = aed.createRange();
		range.selectNode(node);
		sel.removeAllRanges();
		sel.addRange(range);
		node.removeAttribute("id");
	}
	buffer[this.mode].saveHistory();
	PopupSet.Redraw();
	ToolbarSets.Redraw();
};

Editor.prototype.insertHTML = function(text)
{
	if (this.mode=="source"){
		text = text.replace(/</g,"&lt;");
		text = text.replace(/>/g,"&gt;");
	}	
	this._inserthtml(text);
	window.activeEditor.commands.getCommand('Save').execute("no");
};

Editor.prototype.parentNode = function( nodeTagName )
{
	return this.parentNodeNS(nodeTagName);
};

Editor.prototype.GetType = function()
{
	return this.GetTypeNS();
};

Editor.prototype.getSelectedElement = function()
{
	return this.GetSelectedElementNS();
};

Editor.prototype.GetSelectedElement = function()
{
	return this.GetSelectedElementNS();
};

// Get the selection type (like document.select.type in IE).
Editor.prototype.GetTypeNS = function()
{
		this._Type = 'Text' ;
		var oSel = document.getElementById(window.aID).contentWindow.getSelection() ;
		if ( oSel && oSel.rangeCount == 1 ) {
			var oRange = oSel.getRangeAt(0) ;
			if ( oRange.startContainer == oRange.endContainer && (oRange.endOffset - oRange.startOffset) == 1 ) {
				this._Type = 'Control' ;
			}
		}
	return this._Type ;
};

// Retrieves the selected element (if any), just in the case that a single
// element (object like and image or a table) is selected.
Editor.prototype.GetSelectedElementNS = function()
{
	if ( this.GetTypeNS() == 'Control' ) {
		var oSel = document.getElementById(window.aID).contentWindow.getSelection() ;
		return oSel.anchorNode.childNodes[ oSel.anchorOffset ] ;
	}
};

// The "nodeTagName" parameter must be Upper Case.
Editor.prototype.parentNodeNS = function( nodeTagName )
{
	var oNode;

	var oContainer = this.GetSelectedElementNS() ;
	if ( ! oContainer ) {
		try {
			oContainer = this._window.getSelection().getRangeAt(0).startContainer ;
		}
		catch(e){}
	}

	while ( oContainer ) {
		if ( oContainer.tagName == nodeTagName ) {
			return oContainer ;
		}
		oContainer = oContainer.parentNode ;
	}
	return null ;
};

Editor.prototype.firstParentNode = function()
{
	var oNode ;

	var oContainer = this.GetSelectedElementNS() ;
	if ( ! oContainer ) {
		try {
			oContainer = this._window.getSelection().getRangeAt(0).startContainer ;
		}
		catch(e){}
	}
	if (oContainer && oContainer.nodeType==3) {
		oContainer = oContainer.parentNode ;
	}
	return oContainer;
};

Editor.prototype.selectNode = function(node)
{
	var sel = this._window.getSelection();
	var range = this._frame.createRange();
	range.selectNode(node);
	sel.removeAllRanges();
	sel.addRange(range);
}

function insertNodeAtSelection (win, html, before,shift)
{
	var sel = win.contentWindow.getSelection();
	if (shift){
		sel.getRangeAt(0).setStart(sel.anchorNode,sel.anchorNode.length-shift);
	}	

	// new code
	if (sel.anchorNode && sel.anchorNode.tagName && sel.anchorNode.tagName.toLowerCase()=="html"){
		sel.getRangeAt(0).selectNodeContents(window.activeEditor._frame.body);
		sel.collapseToStart();
	}
	//  end

	// Deletes the actual selection contents.
	for ( var i = 0 ; i < sel.rangeCount ; i++ ) {
		sel.getRangeAt(i).deleteContents() ;
	}

	var range = sel.getRangeAt(0) ;
	var f = range.createContextualFragment(html) ;
	sel.removeAllRanges();
	var last = f.lastChild;
	range.insertNode(f);

	if (last) {
		range.setEndAfter(last);
		//last.scrollIntoView();
	}

	// Set the cursor after the inserted fragment.
	if (before){
		range.collapse(true);
	} else {
		range.collapse(false);
	}

	sel = win.contentWindow.getSelection();

	sel.addRange(range);

	if (before){
		sel.collapseToStart();
	} else {
		sel.collapseToEnd();
	}	
}


Editor.prototype.GetSelection = function()
{
	return this.GetSelectionNS();
};

Editor.prototype.getSelectedText = function()
{
	return this.GetSelectionNS();
};

Editor.prototype.GetSelectionNS = function()
{
	return this._window.getSelection();
};

Editor.prototype.replaceNodeByText = function(obj)
{
	var txt = this._frame.createTextNode(obj.textContent);
	obj.parentNode.replaceChild(txt,obj);
};

Editor.prototype.doStyles = function()
{
	try {
		if (this._frame) {
			this.Styles			= new Array();
			this.cssText		= new Array();

			var sheets = this._frame.styleSheets;
			if(sheets.length > 1) {
				// loop over each sheet
				for (var x = 0; x < sheets.length; x++) {
					if (sheets[x].href.indexOf(border_css_file)>=0) {
						continue;
					}
					// grab stylesheet rules
					var rules = sheets[x].cssRules;
					if (rules.length > 0) {
						// check each rule
						for(var y = 0; y < rules.length; y++) {
							 sT = rules[y].selectorText;
							 if (!sT) {
								 continue;
							 }
							 if (sT.indexOf("*")==0) {
								 sT=sT.substr(2,sT.length);
							 }
							 if (sT.substr(0,1)==".") {
								sT=sT.substr(1);
								if (sT.indexOf(" ")>0) {
									sT = sT.substring(0,sT.indexOf(" "));
								}
								if (sT.toLowerCase().indexOf("wep_")==0)continue;
								style_twice = false;
								for (var z = 0; z < this.Styles.length; z++){
									if (sT == this.Styles[z]){
										this.cssText[z] = this.cssText[z]+ (this.cssText[z].lastIndexOf(";")==this.cssText[z].length ? "" : ";")+rules[y].style.cssText;
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
		}
	} catch(e) {}
};

Editor.prototype.isFlash = function(x)
{
	var cn;
	cn = x.getAttribute("class");
	if (cn=="de_flash_file") {
		return true;
	} else {
		return false;
	}
};

Editor.prototype.isMedia = function(x)
{
	var cn;
	cn = x.getAttribute("class");
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
	for (var i=0; i<tags.length;i++){
		switch (tags[i]){
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
						if(x.href.indexOf("mailto:")==-1) {
							return OFF;
						} else {
							return DISABLED;
						}
					}
				} else if (ae.GetSelection()!="") {
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
				if (x && x.getAttribute("class") && (x.getAttribute("class")=="de_flash_file" || x.getAttribute("class")=="de_media_file")) {
					return DISABLED;
				}
				if (x && x.tagName && tags[i].toUpperCase()==x.tagName.toUpperCase()) {
					r=OFF;
				} else {
					r = DISABLED;
				}
				break;
		}
		if (r==OFF) {
			return OFF;
		}
	}
	return DISABLED;
};

Editor.prototype.resetSize = function()
{
	e = parent.document.getElementById(ae.InstanceName+"main");
	e.style.width = ae.neww;
	e.style.height = ae.newh;
};

var checkbegin	= false;
var insideWrap	= false;
var checkend	= false;
var check		= false;
var traverse_end = false;
var ret			= false;
var wrap		= null;

Editor.prototype.walkDOM = function(node)
{
	if (!node) {
		return false;
	}
	traverse_end = false;
	checkbegin	= false;
	checkend	= false;
	ret			= false;
	check		= false;
	insideWrap	= false;
	wrap = null;

	if (window.activeEditor.unlock) {
		return true;
	}
	if (!window.activeEditor.isbegin && !window.activeEditor.isend) {
		return true;
	}
	traverse(this._frame.body,node);
	if ( checkbegin && !checkend ) {
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
	if (node && node.id && node.id.substr(0,7)=="de_wrap"){
		insideWrap=true;wrap=node;
	}
	if (node==selnode){
		ret=true;
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

Editor.prototype.outerHTML = function(el)
{
	var _emptyTags = {
		"IMG":   true,
		"BR":    true,
		"INPUT": true,
		"META":  true,
		"LINK":  true,
		"PARAM": true,
		"EMBED": true,
		"HR":    true
	};

	var attrs = el.attributes;
	var str = "<" + el.tagName;
	for (var i = 0; i < attrs.length; i++){
		if (attrs[i].name.indexOf("_")==0) {
			continue;
		}
		str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
	}

	if (_emptyTags[el.tagName]) {
		return str + ">";
	}

	return str + ">" + el.innerHTML + "</" + el.tagName + ">";
};

var Api = new Object() ;

Api.GetParent = function( element, parentTagName )
{
	var e = element.parentNode ;

	while ( e ) {
		if ( e.nodeName == parentTagName ) {
			return e ;
		}

		e = e.parentNode ;
	}
};

Editor.prototype.getTop = function(e)
{
	var nTopPos = e.offsetTop;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nTopPos += eParElement.offsetTop;
		eParElement = eParElement.offsetParent;
	}
	return nTopPos;
};

function addFullURI(code)
{
	c1 = /( src=\"?(\S+)\"?)/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (s3 && s3[0]=="/")	{
			var o = s3.replace(/["]/gi,"");
			return " src="+serverurl + o;
		} else {
			return s2;
		}
	});

	return code;
}

// browser removes style contents if more than 1 space include (eg. style="color:    red;")
function fix_bug_01(code){
	r = /(style=["'][^"']*?["'])/gi;
	return code.replace(r,function(s1,s2){
			s2 = s2.replace(/(\s*);(\s*)/g,";");
			s2 = s2.replace(/(\s*):(\s*)/g,":");
			return s2;
	});
}

function fix_bug_02(code) {
	if (useXHTML != 1) {
		// Make param tags <param .... ></param>
		r = /(<param(.*?)>)(?!<\/param>)/gi;
		code = code.replace(r, "$1</param>");
	}
	return code;
}

function fix_bug_03(code) {
	// FF replace {,! to %xx inside href=""
	c1 = /(href="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		var r = /(\%\w+:\w+\%)/gi;
		if (!r.test(s2) && s2.indexOf("%")==-1){
			return unescape(s2);
		}	
		return s2;
	});
	return code;
}

function _de_replace_bookmark(code){
	r = /(&lt;span id="_de_bookmark"&gt;([\s\S]*)&lt;\/span&gt;)/gi;
	code =  code.replace(r,function(s1,s2){
			s2 = s2.replace(/^&lt;span id="_de_bookmark"&gt;/gi,'<span id="_de_bookmark">');
			s2 = s2.replace(/&lt;\/span&gt;$/gi,"</span>");
			return s2;
	});
	return code;
}
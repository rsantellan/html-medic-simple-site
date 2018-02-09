// common classes for IE and Gecko

// spell words
var _de_spell_words = "1";

// Garbage Collector
var Garbage = function()
{
	this.id=0;
	this.count=0;
	this.Items = new Array();
};

Garbage.prototype.add = function(g)
{
	this.Items[this.count] = g;
	this.count++;
}

Garbage.prototype.generateId = function()
{
	this.id++;
	return "gc"+this.id;
}

Garbage.prototype.clearMemory = function()
{
	for (var i=0;i<this.count;i++) {
		x = document.getElementById(this.Items[i]);
		if (x){
			if (x.ToolbarButton) {
				x.ToolbarButton = null;
			}
			if (x.Combo) {
				x.Combo = null;
			}
			if (x.Tab) {
				x.Tab = null;
			}
		}
	}
	for (i in PopupSet.Items) {
		if (i=="clone") {
			continue;
		}
		for (var j = 0 ; j < PopupSet.Items[i].Items.length ; j++) {
			if (PopupSet.Items[i].Items[j].DOMDiv) {
				PopupSet.Items[i].Items[j].DOMDiv.PopupItem = null;
			}
		}
	}
}

var browser = new Browser();

// Name: Browser class
// Info: IE or NS browser.

function Browser()
{
	this.IE    = false;
	this.NS    = false;
	this.isFireFox1_5 = false;
	this.Opera = false;
	this.Safari = false;
	this.Mac = false;
	var userAgent;

	userAgent = navigator.userAgent;
	if ((userAgent.indexOf("Opera")) >= 0) {
		this.Opera = true;
		return;
	}
	if ((userAgent.indexOf("Safari")) >= 0) {
		this.Safari = true;
		return;
	}

	if ((userAgent.indexOf("MSIE")) >= 0) {
		this.IE = true;
		return;
	}

	if ((userAgent.indexOf("Netscape6/")) >= 0) {
		this.NS = true;
		return;
	}
	if ((userAgent.indexOf("Gecko")) >= 0) {
		if (navigator.productSub>=20051111) {
			this.isFireFox1_5 = true;
		}
		this.NS = true;
		return;
	}

	if ((userAgent.indexOf("Mac")) >= 0) {
		this.Mac = true;
		return;
	}
}


var ImageLoader = function()
{
	this.Name = "imageloader";
	this.img = new Array();
};

ImageLoader.prototype.addImage = function(name,src)
{
	if (!this.img[name]) {
		this.img[name] = new Image();
		this.img[name].src = src;
	}
};

ImageLoader.prototype.getImage = function(name)
{
	if (this.img[name]) {
		return this.img[name];
	} else {
		return false;
	}
};

// Name: Path class
// Info: Show tags tree and do selection for each tag.

var pathtags = new Array();

var Path = function(){
	this.Name = "Path";
};

Path.prototype.CreateInstance = function(parentToolbar)
{
	this.parenttoolbar = parentToolbar ;
	this.cDiv = document.createElement( 'div' ) ;
	this.cDiv.className = "pathcontainer";
	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	oCell.appendChild( this.cDiv ) ;

	var rDiv = document.createElement('div');
	document.getElementById("eRemoveTag").appendChild(rDiv);

	this.rDiv = rDiv;
	this.currentNode = null;
}

Path.prototype.Redraw = function(e)
{
	if (this.cDiv.childNodes){
		var ln = this.cDiv.childNodes.length;
		for (var i=0; i<ln;i++) {
			var a = this.cDiv.childNodes[i];
			try{
				a.cDiv= null;
				a.rDiv = null;
			} catch(e){}
		}
	}

	var pathstr="&nbsp;&nbsp;HTML Tag:";
	var oNode ;
	var pathtree = new Array();
	pathtags = new Array();
	ae = window.activeEditor;
	aed = window.activeEditor._frame;

	Selection.set();
	var tag_count=0;
	var i = Selection.parentTags.length;

	while (i--) {
		oContainer = Selection.parentTags[i];

		if (browser.IE) {
			var cn = oContainer.getAttribute("className");
		} else {
			var cn = oContainer.getAttribute("class");
		}

		var label;
		if (cn && (cn=="de_media_file"|| cn=="de_flash_file") ) {
			label="embed";
		} else {
			label=oContainer.tagName;
		}
		if (!label) {
			break;
		}
		var cl = "linklabel";
		pathtree.unshift('<A class="'+cl+'" title="'+label+'" href="javascript:void(0)">'+label.toUpperCase()+'</A>');
		pathtags.unshift(oContainer);
		tag_count+=1;
		oContainer = oContainer.parentNode ;
		if (label.toLowerCase()=="body"||tag_count>=_de_max_tag) {
			break;
		}
	}

	if (pathtree.length>=_de_max_tag) {
		pathstr+= "&nbsp;...&nbsp;";
	}
	var map= new Array();
	var j=0;
	for (var i=0; i<pathtree.length;i++) {
		if (browser.IE) {
			var cn = pathtags[i].getAttribute("className");
		} else {
			var cn = pathtags[i].getAttribute("class");
		}

		if (pathtags[i].getAttribute("id") && pathtags[i].getAttribute("id").indexOf("de_wrap_div")>=0) {
			continue;
		}
		if (cn=="de_style_anchor" || cn=="de_style_input" ) {
			continue;
		}
		pathstr+="<"+pathtree[i];
		if ( cn && cn!="de_media_file" && cn!="de_flash_file") {
			pathstr+="."+cn;
		}
		pathstr+="> ";
		map[j]=i;
		j++;
	}
	ae.selectedtag = pathtags[pathtree.length-1];
	this.cDiv.innerHTML = pathstr;

	j=0;
	var ln = this.cDiv.childNodes.length;
	for (var i=0; i<ln;i++){
		atag = this.cDiv.childNodes[i];
		if (atag.tagName&&atag.tagName.toLowerCase()=="a") {
			atag.name = map[j];
			atag.cDiv= this.cDiv;
			atag.rDiv = this.rDiv;
			if (browser.IE){
				atag.attachEvent( 'onclick', this.selectNodeContents);
			} else {
				atag.addEventListener( 'click', this.selectNodeContents , false) ;
			}
			j++;
		}
	}
	this.rDiv.innerHTML="";
}

// Selects the contents inside the given node
Path.prototype.selectNodeContents = function()
{
	var a,rDiv,node,cDiv;
	if (browser.IE){
		a = window.event.srcElement;
	} else {
		a = this;
	}
	node = pathtags[a.name];
	rDiv = a.rDiv;
	cDiv = a.cDiv;

	var ae = window.activeEditor;
	ae.selectedtag = node;
	var aed = window.activeEditor._frame;
	var aew = window.activeEditor._window;
	ae.Focus();
	var range;
	var collapsed = (typeof pos != "undefined");
	if (browser.IE) {
		ae.lastinsert = node;
		var range = aed.body.createControlRange();
		try	{
			range.add(node);
			range.select();
		} catch(e) {
			try	{
				var range = aed.body.createTextRange();
				range.moveToElementText(node);
			} catch(e){return;}
		}

		range.select();

	} else {
		if (node.childNodes && node.childNodes[0] && node.childNodes[0].nodeValue.toLowerCase().indexOf("begineditable")>0){
			node = node.childNodes[1];
			if (node.childNodes) {
				node = node.childNodes[0];
			}
			editable_area_selected = true;
		}
		var sel = aew.getSelection();
		range = aed.createRange();
		range.selectNode(node);
		sel.removeAllRanges();
		sel.addRange(range);
	}

	for (var i=0; i<cDiv.childNodes.length;i++){
		atag = cDiv.childNodes[i];
		if (atag.tagName&&atag.tagName.toLowerCase()=="a"&&atag.name==a.name) {
			atag.className = "linklabelselected";
		}
	}

	if (node!==aed.body){
		rDiv.innerHTML='<A id="_de_remove_tag" class="linklabel" href="javascript:void(0)">Remove&nbsp;Tag</A>&nbsp;&nbsp;|&nbsp;&nbsp;'+
						'<A id="_de_edit_tag" class="linklabel" href="javascript:void(0)">Edit&nbsp;Tag&nbsp;&nbsp;</A>';
		var btag = document.getElementById("_de_edit_tag");
		var atag = document.getElementById("_de_remove_tag");
		var nodeclass=node.className;
		if (nodeclass !=="de_style_anchor" && nodeclass !== "de_style_input"){
			btag.name2 = node;
			btag.onclick = BTagOnClick;
		} else {
			btag.onclick = NullFunc;
		}
		atag.name2 = node;
		atag.onclick = ATagOnClick;
	}

	ToolbarSets.Redraw("path");
	ae.Editable();
	return true;
};

NullFunc = function(){};

BTagOnClick = function()
{
	if (!window.activeEditor.editable) {
		return;
	}
	var ae = window.activeEditor;
	var node = this.name2;
	ae.selectedtag = node;
	ae.commands.getCommand('Edittag').execute();
};

ATagOnClick = function()
{
	window.activeEditor.Editable();
	if (!window.activeEditor.editable) {
		return;
	}
	var ae = window.activeEditor;
	var node = this.name2;
	if (node&&node.parentNode){
		if (ae.GetSelection() && (!node.getAttribute("name2"))){
			var newnode = aed.createTextNode(ae.GetSelection());
			try{
				node.parentNode.replaceChild(newnode,node);
				ToolbarSets.Redraw();
			} catch(e){}
		}else{
			try{
				node.parentNode.removeChild(node);
				ToolbarSets.Redraw();
			} catch(e){}
		}
	}
};

// Remove Tag
Path.prototype.removeTag = function()
{
	this.node.parentNode.removeChild(this.node);
};

_ie_popup_class = new Array();
_ie_popup_class_prop = new Array();
render_css(parent.iepopupstyle);

function render_css(data1){
	var news;
	firstclasspos = 0;
	
	data1.replace(/(\.(\w+)\s?\{([^\}]+)\})/g,function(s1,s2,s3,s4){
		_ie_popup_class[s3] = s4;
		_ie_popup_class_prop[s3] = new Array();

		s = s4.replace(/(([^:]+):([^;]+);)/gi,function(a1,ax,a2,ay){
			a2=a2+"";
			a2 = a2.toLowerCase();
			a2 = a2.replace(/(-.)/g,function(b1,b2){return b2.toUpperCase().substr(1,1);})
			a2 = a2.replace(/(\s)/gi,"");
			
			ay=ay.replace(/\"/,"'");			
			ay=ay.replace(/^\s+/,"");
			var lasti = _ie_popup_class_prop[s3].length;
			_ie_popup_class_prop[s3][lasti] = a2;
			_ie_popup_class_prop[s3][lasti+1]= ay;
	});	

	}
	);
}

// append css class to htnl code
function convert_popup(data, f){

	return data.replace(/(class="?(\w+)"?)/gi,function(s1,s2,s3){
			if (!s3)return s2;
			return ((f)?'':'style="')+_ie_popup_class[s3]+'"';
		}
	);	
}


function convert_class(obj,c){
	if (obj.name2 && obj.name2 == c)return;
	try{
	if (obj.name2){
		for (var i=0;i<_ie_popup_class_prop[obj.name2].length;i=i+2){
			switch (_ie_popup_class_prop[obj.name2][i]){
				case "border":
					obj.style.setAttribute(_ie_popup_class_prop[obj.name2][i],"");
					break;
				case "margin":
					obj.style.setAttribute(_ie_popup_class_prop[obj.name2][i],"0px");
					break;
				case "padding":
					obj.style.setAttribute(_ie_popup_class_prop[obj.name2][i],"");
					break;

				default:	
					obj.style.removeAttribute(_ie_popup_class_prop[obj.name2][i]);
			}
		}
	}
	/*if (c==""){
	if(obj.style["backgroundColor"])obj.style["backgroundColor"] = "";
	if(obj.style["color"])obj.style["color"] = "gray";	
	if(obj.style["border"])obj.style["border"] = "";
	if(obj.style["padding"])obj.style["padding"] = "";
	if(obj.style["margin"])obj.style["margin"] = "0px";		
	if(obj.style["height"])obj.style["height"] = "20px";		
	}*/
	
	if (c){
		for (var i=0;i<_ie_popup_class_prop[c].length;i=i+2){
			obj.style.setAttribute(_ie_popup_class_prop[c][i], _ie_popup_class_prop[c][i+1]);
		}
	}
	obj.name2 = c;	
	} catch(e){}
}

// Popup commands
var PopupCommand = function(name)
{
	this.Name = name.toLowerCase();
};

PopupCommand.prototype.execute = function(e,x,y){
	if (!PopupSet.isInitial) {
		PopupSet.CreatePopup("contextmenu");
		PopupSet.CreatePopup("table");
		PopupSet.CreatePopup("form");
		PopupSet.CreatePopup("paste");
		PopupSet.CreatePopup("sourcetag");
	}

	var fr = document.getElementById(window.activeEditor.InstanceName + '_frame');
	var pLeft =  this.getLeft(fr);
	var pTop =  this.getTop(fr);

	var fr1 = parent.document.getElementById(window.activeEditor.InstanceName + 'main');
	var frameLeft = this.getLeft(fr1)*1;
	var frameTop = this.getTop(fr1)*1;

	var popup,oItem,new_popup;
	var doc = parent.document;

	oItem = PopupSet.Items[this.Name];
	new_popup=0;

	var p = oItem.DOMDiv;
	ae = window.activeEditor;
	if (x){
		if (browser.IE){
			p_left = x + pLeft + 2;
			p_top = y + pTop + 2;
		} else {
			p_left = x + frameLeft + 2 + pLeft;
			p_top = y + frameTop + 2 + pTop;
		}
	} else {
		p_left = this.getLeft(e)*1 + (browser.NS ? frameLeft : 1);
		p_top = this.getTop(e)*1 + e.offsetHeight-1 + (browser.NS ? frameTop : 1);
	}

	if (browser.IE){
		window.activeEditor.Focus();
		oItem.Redraw();

		if(this.Name=="sourcetag"){
			if (oItem.Items.length<13){
				p.firstChild.style.height =  "auto";
			} else {
				p.firstChild.style.height =  "300px";
				p.firstChild.style.overflow = "scroll";			
			}
		}
				
		oItem.popup.show(p_left, p_top, 0, 0, document.body);
		var realHeight = oItem.popup.document.body.scrollHeight;
		var realWidth = oItem.popup.document.body.scrollWidth;
		if (!PopupSet.isInitial){
			var d = document.createElement("div");
			d.innerHTML = convert_popup(oItem.DOMDiv.innerHTML);
			document.body.appendChild(d);
			realHeight = d.offsetHeight;
			realWidth = 197;
			document.body.removeChild(d);
			d = null;
		}

		// Hides the dimension detector popup object.
		oItem.popup.hide();

		// Shows the actual popup object with correct height.
		if (realHeight > 0) {
			oItem.popup.show(p_left, p_top, realWidth, realHeight, document.body);
		}
		
		oItem.isOpen = true;
		
		oItem.Redraw();
	} else {
		PopupSet.CloseAll();
		p.style.left 	= p_left+"px";
		p.style.top 	= p_top+"px";
		p.style.visibility = "visible";
		
		p.style.position = "absolute";
		if(this.Name=="sourcetag"){
			p.firstChild.style.height =  "auto";//"100px";
			p.firstChild.style.maxHeight =  "300px";
			p.firstChild.style.overflow = "scroll";
		}	
		p.style.display	= "";
		oItem.Redraw();
	}

	oItem.isOpen = true;
		
	if (!PopupSet.isInitial) {
		PopupSet.isInitial = true;
	}
};

PopupCommand.prototype.getMode = function(){
	if (this.Name=="Modifyform"){
		if (!window.activeEditor.parentNode("FORM")) {
			return DISABLED;
		}
	}
	return OFF;
};

PopupCommand.prototype.getLeft = function(e)
{
	var nLeftPos = e.offsetLeft;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nLeftPos += eParElement.offsetLeft;
		eParElement = eParElement.offsetParent;
	}
	return nLeftPos;
};

PopupCommand.prototype.getTop = function(e)
{
	var nTopPos = e.offsetTop;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nTopPos += eParElement.offsetTop;
		eParElement = eParElement.offsetParent;
	}
	return nTopPos;
};

// Name: Popup class
// Info: Popup menu.

function PopupOnContextMenu() { return false ; }

var Popup = function( label, popupset)
{
	if (PopupSet.Items[popupset]) return PopupSet.Items[popupset];
	
	var doc,popup;
	if (browser.IE) {
		popup = createPopup(); //parent.
		popup.document.oncontextmenu = PopupOnContextMenu;
		this.popup = popup;
		doc = popup.document;
	} else {
		doc = parent.document;
	}

	this.doc = doc;
	this.lastResult = -1;
	this.isOpen = false;
	this.Items = new Array();
	this.Separators = new Array();
	this.name = popupset;
	this.id = popupset+"_popup";

	if (browser.NS) {
		if (x=doc.getElementById(this.id)) {
			doc.body.removeChild(x);
		}
	}

	this.DOMDiv = doc.createElement( 'div' ) ;
	this.DOMDiv.id = popupset + "_popup";
	if (browser.NS) {
		this.DOMDiv.style.position = "absolute";
		this.DOMDiv.style.left=-1000;
		this.DOMDiv.style.top=-1000;
	}
	if (browser.NS) {
		this.DOMDiv.style.visibility = "hidden";
		this.DOMDiv.style.zIndex=100;
	}

	this.d2 = doc.createElement('div') ;
	if (browser.IE){
		convert_class(this.d2 , 'popup');
	} else {
		this.d2.className = 'popup' ;	
	}

	this.DOMTable = doc.createElement( 'table' ) ;
	this.DOMTable.cellPadding = 0 ;
	this.DOMTable.cellSpacing = 0 ;
	this.DOMTable.border = 0 ;
	this.DOMTable.width = "100%";

	ae = window.activeEditor;
	doc.body.appendChild( this.DOMDiv ) ;
	this.DOMDiv.appendChild( this.d2 ) ;
	this.d2.appendChild( this.DOMTable ) ;

	for (var i=0; i<Popups[popupset].length;i++) {
		var p = Popups[popupset] ;
		this.DOMRow = this.DOMTable.insertRow(this.DOMTable.rows.length) ;
		if (p[i][0]=='-') {
			this.AddSeparator(p[i][3]);
		} else {
			this.AddItem(p[i][0], p[i][1], p[i][2], doc, p[i][3], this.name);
		}
	}
	return this;
};

Popup.prototype.ReplaceItems = function(id)
{
	var l = this.DOMTable.rows.length;
	for (var i=0;i<l;i++) {
		this.DOMTable.deleteRow(-1);
	}
	for (var i=1; i<_de_spell_words[id].length;i++) {
		if (i>10) {
			break;
		}
		this.DOMRow = this.DOMTable.insertRow(-1) ;
		this.AddItem("ReplaceWord", _de_spell_words[id][i], null, this.doc, null, this.name,_de_spell_words[id][i]);
	}
	this.DOMRow = this.DOMTable.insertRow(-1) ;
	this.AddSeparator(null);
	this.DOMRow = this.DOMTable.insertRow(-1) ;
	this.AddItem("Ignore", "Ignore", '', this.doc, null, this.name, _de_spell_words[id][0]);
	this.DOMRow = this.DOMTable.insertRow(-1) ;
	this.AddItem("IgnoreAll", "Ignore All", '', this.doc, null, this.name, _de_spell_words[id][0]);
	this.DOMRow = this.DOMTable.insertRow(-1) ;
	this.AddItem("AddToDictionary", "Add to Dictionary", 'addtodictionary.gif', this.doc, null, this.name, _de_spell_words[id][0]);
};

Popup.prototype.RemoveAllItems = function()
{
	this.Items = new Array();
	var l = this.DOMTable.rows.length;
	for (var i=0;i<l;i++) {
		this.DOMTable.deleteRow(-1);
	}
};

Popup.prototype.AddItem = function( commandName, tooltip, icon, doc, tags, popup_name, add_par)
{
	var oPopupItem = new PopupItem(commandName, tooltip, icon, doc, tags, popup_name, add_par);
	this.Items[ this.Items.length ] = oPopupItem ;
	oPopupItem.CreateInstance( this ) ;
};

Popup.prototype.AddItem2 = function( commandName, tooltip, icon, add_par)
{
	this.DOMRow = this.DOMTable.insertRow(-1) ;
	var oPopupItem = new PopupItem(commandName, tooltip, icon, this.doc, null, this.name, add_par);
	this.Items[ this.Items.length ] = oPopupItem ;
	oPopupItem.CreateInstance( this ) ;
};

Popup.prototype.find = function( str )
{
	if (this.lastResult!==-1){
		this.Items[this.lastResult].Redraw(OFF);
	}
	if (!str) {
		return;
	}	
	for (var i = 0; i < this.Items.length ; i++){
		var l = str.length
		if (str.toLowerCase() == this.Items[i].parameter.substr(0,str.length).toLowerCase() ){
			this.Items[i].Redraw(ON);
			this.Items[i].DOMDiv.scrollIntoView(true);
			this.lastResult = i;
			break;
		}
	}
};

Popup.prototype.selectNext = function()
{
	if (this.lastResult!==-1){
		this.Items[this.lastResult].Redraw(OFF);
		if(this.lastResult<this.Items.length-1)this.lastResult++;
	} else {
		this.lastResult = 0;
	}	
	this.Items[this.lastResult].Redraw(ON);
	this.Items[this.lastResult].DOMDiv.scrollIntoView(true);
};

Popup.prototype.selectPrevious = function()
{
	if (this.lastResult!==-1){
		this.Items[this.lastResult].Redraw(OFF);
		if(this.lastResult>0)this.lastResult--;
	} else {
		return;
	}	

	this.Items[this.lastResult].Redraw(ON);
	this.Items[this.lastResult].DOMDiv.scrollIntoView(true);
};

Popup.prototype.completeWord = function( str )
{
	if (this.lastResult!==-1){
		this.Items[this.lastResult].Redraw(OFF);
		ae.commands.getCommand("NewTag").execute( str , this.Items[this.lastResult].parameter);
		context_str = this.Items[this.lastResult].parameter;
		return this.Items[this.lastResult].parameter;
	}	
};

var Separator = function(tags)
{
	this.separator = true;
	this.tags = tags;
	this.mode=ON;
};

Separator.prototype.CreateInstance = function(parentToolbar)
{
	if (!parentToolbar.DOMRow) {
		return;
	}
	var oCell = parentToolbar.DOMRow.insertCell(-1) ;
	oCell.unselectable = 'on' ;
	if (browser.IE){
		oCell.innerHTML = convert_popup('<div class="popup_vert_seperator"><div></div></div>');	
	} else {
		oCell.innerHTML = '<div class="popup_vert_seperator"><div></div></div>';
	}	
	this.Div = oCell.firstChild ;
};

Separator.prototype.Redraw = function()
{
	this.mode=ON;
	if (this.tags && window.activeEditor.checkTags(this.tags)==DISABLED){
		if (browser.IE){
			convert_class(this.Div.parentNode.parentNode, 'hide_popup_item');
		} else {
			this.Div.parentNode.parentNode.className = 'hide_popup_item';
		}	
		this.mode=EXCLUDE;
	} else {
		if (this.Div.parentNode && this.Div.parentNode.parentNode) {
			if (browser.IE){
				convert_class(this.Div.parentNode.parentNode , '');
			} else {
				this.Div.parentNode.parentNode.className = '';
			}	
		}	
	}
};

Popup.prototype.AddSeparator = function(tag)
{
	var s = new Separator(tag);
	this.Items[ this.Items.length ] = s ;
	s.CreateInstance( this ) ;
};


Popup.prototype.Redraw = function()
{
	for (var i = 0 ; i < this.Items.length ; i++) {
		this.Items[i].Redraw() ;
	}
};

// Name: Popup Item class
// Info: item from popup menu

var PopupItem = function( commandName, tooltip, icon, doc, tags, popup_name,add_par)
{
	this.popup_name = popup_name;
	this.tags = tags;
	this.doc		= doc;
	this.Command	= commandName ;
	this.Name = commandName.toLowerCase();

	imageLoader.addImage(this.Command, serverurl + deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/tb.gif");
	if (typeof(tooltip) == "string"){
		this.Label		= tooltip ? tooltip : commandName;
		this.Tooltip	= tooltip ? tooltip : commandName;
	} else {
		this.Label		= tooltip[0];
		this.Tooltip	= tooltip[0];
		this.Label2		= tooltip[1];
		this.Tooltip2	= tooltip[1];
	}
	this.IconPath	= serverurl + deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/tb.gif" ;
	this.mode 		= OFF;
	this.IconOff	= icon;
	if (add_par) {
		this.parameter	= add_par;
	} else {
		this.parameter	= null;
	}
};

PopupItemOnOver = function()
{
	if (this.PopupItem.mode!=DISABLED){
		if (browser.IE){
			convert_class(this, 'popupitem_on') ;
		} else {
			this.className = 'popupitem_on' ;		
		}
	}
};

PopupItemOnOut = function()
{
	if (this.PopupItem.mode==OFF && this.PopupItem.mode!=DISABLED){
		if (browser.IE){
			convert_class(this, 'popupitem');
		}else{
			this.className = 'popupitem' ;
		}
	}
};

PopupItemOnClick = function()
{
	if (this.PopupItem.mode!==DISABLED){
		oCommand = window.activeEditor.commands.getCommand(this.PopupItem.Command);
		oCommand.execute(this.PopupItem.parameter);
		if (this.PopupItem.popup) {
			this.PopupItem.popup.hide();
		}
		this.PopupItem.mode=OFF;
		if (browser.IE){
			convert_class(this, 'popupitem') ;
		}else{
			this.className = 'popupitem' ;
		}
		PopupSet.Redraw();
		return false ;
	}
};

PopupItem.prototype.CreateInstance = function( parentToolbar )
{
	if (parentToolbar.popup) {
		this.popup = parentToolbar.popup;
	}
	this.DOMDiv = this.doc.createElement( 'div' ) ;
	this.DOMDiv.PopupItem	= this ;
	this.DOMDiv.id = garbage.generateId();
	garbage.add(this.DOMDiv.id);
	this.DOMDiv.unselectable = 'on' ;

	if (browser.IE){
		convert_class(this.DOMDiv, 'popupitem');
	} else {
		this.DOMDiv.className		= 'popupitem' ;	
	}
	
	this.DOMDiv.onmouseover = PopupItemOnOver;
	this.DOMDiv.onmouseout	= PopupItemOnOut;
	this.DOMDiv.onclick = PopupItemOnClick;
	if (!parentToolbar.DOMRow) {
		return;
	}
	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length);
	oCell.appendChild(this.DOMDiv);

	if (browser.IE){
	this.DOMDiv.innerHTML = convert_popup(
		'<table width="100%" title="' + this.Tooltip +'" cellspacing="0" cellpadding="0" border="0"><tr>' +
		(this.IconOff ? '<td class="popupitem_icon"><div style="background-repeat: no-repeat;overflow:hidden;width:21px;height:20px;" unselectable = "on"></div></td>' : '<td class="popupitem_icon"></td>' )+
		'<td align="left" class="popuptext">&nbsp;&nbsp;&nbsp;' + this.Label + '</td></tr></table>' );
	} else {
	this.DOMDiv.innerHTML =
		'<table width="100%" title="' + this.Tooltip +'" cellspacing="0" cellpadding="0" border="0"><tr>' +
		(this.IconOff ? '<td class="popupitem_icon"><div style="background-repeat: no-repeat;overflow:hidden;width:21px;height:20px;" unselectable = "on"></div></td>' : '<td class="popupitem_icon"></td>' )+
		'<td align="left" class="popuptext">&nbsp;&nbsp;&nbsp;' + this.Label + '</td></tr></table>' ;
	}
	
	
	if (this.IconOff) {
		this.icon = this.DOMDiv.firstChild.firstChild.firstChild.childNodes.item(0).firstChild;
		this.icon.id = garbage.generateId();
		garbage.add(this.icon.id);

		this.icon.src = imageLoader.getImage(this.Command).src;

		this.icon.style.background = "url("+imageLoader.getImage(this.Command).src+")";
		this.icon.style.backgroundRepeat = "no-repeat";
		this.icon.style.overflow = "hidden";
		try{
			this.icon.style.backgroundPosition = "0px -"+(tlb_pos[this.Name]*20)+"px";
			// ToDo - change ToolbarDropButton
			if(this.Name=="paste")this.icon.style.backgroundPosition="0px 0px";

		}catch(e){}

	}

	this.textitem = this.DOMDiv.firstChild.firstChild.firstChild.childNodes.item(1);
};

PopupItem.prototype.changeLabel = function(l)
{
	if (l=="not found"){
		this.textitem.innerHTML = "&nbsp;&nbsp;&nbsp;"+this.Label;
		this.DOMDiv.firstChild.title = this.Tooltip;
	} else {
		this.textitem.innerHTML = "&nbsp;&nbsp;&nbsp;"+this.Label2;
		this.DOMDiv.firstChild.title = this.Tooltip2;
	}
};

PopupItem.prototype.getMode = function()
{
	return this.mode;
}

PopupItem.prototype.Redraw = function(modex)
{
	var m ;
	oCommand	= window.activeEditor.commands.getCommand(this.Command);
	if (!oCommand){
		return;
	}
	if(oCommand.mode&&this.Label2) {
		this.changeLabel(oCommand.mode);
	}

	if (this.tags &&
		this.popup_name == "contextmenu" &&
		this.Command!="Copy" &&
		this.Command!="Cut" &&
		this.Command!="Paste" &&
		this.Command!="Pastetext" &&
		this.Command!="Pasteword" ) {
		var mode = window.activeEditor.checkTags(this.tags);
		if (mode==DISABLED) {
			mode=EXCLUDE;
		}
		m = mode;
	} else {
		if (this.Name=="newtag"){
			m = this.getMode();
		} else {	
			m = oCommand.getMode() ;
		}	
	}

	if (!window.activeEditor.editable) {
		m=DISABLED;
	}
	if (this.Name=="newtag"){
		if(modex>=0)m=modex;
	}
	if (modex && m!==DISABLED )m=modex;
	this.mode = m ;
	if (this.DOMDiv.parentNode) {
		if (browser.IE){
			convert_class(this.DOMDiv.parentNode.parentNode, '');
		} else {
			this.DOMDiv.parentNode.parentNode.className = '';
		}
	}
	try{
		switch ( this.mode ) {
			case ON :
				if (this.IconOff) {
					if (browser.IE){
						convert_class(this.icon, "popupitem_icon");
					} else {
						this.icon.className = "popupitem_icon";
					}
				}

				if (browser.IE){
					convert_class(this.textitem, "popuptext");
					convert_class(this.DOMDiv, 'popupitem_on');
				} else {
					this.textitem.className = "popuptext";
					this.DOMDiv.className = 'popupitem_on' ;
				}
				break ;
			case OFF :
				if (this.IconOff) {
					if (browser.IE){
						convert_class(this.icon, "popupitem_icon");
					} else {
						this.icon.className = "popupitem_icon";
					}
				}

				if (browser.IE){
					convert_class(this.textitem, "popuptext");
					convert_class(this.DOMDiv, 'popupitem') ;
				} else {
					this.textitem.className = "popuptext";
					this.DOMDiv.className = 'popupitem' ;
				}
				break ;
			case EXCLUDE:
				if (browser.IE){
					convert_class(this.DOMDiv.parentNode.parentNode, 'hide_popup_item') ;
				} else {
					this.DOMDiv.parentNode.parentNode.className = 'hide_popup_item' ;
				}
				break ;
			default :
				
				if (browser.IE){
					convert_class ( this.DOMDiv, 'popupitem') ;
				} else {
					this.DOMDiv.className = 'popupitem' ;
				}
				if (this.IconOff){
					if (browser.IE){
						convert_class(this.icon, "popupitem_icon_disabled");
					} else {
						this.icon.className = "popupitem_icon_disabled";
					}
				}
				if (browser.IE){
					convert_class( this.textitem, "popupitem_text_disabled");
				} else {
					this.textitem.className = "popupitem_text_disabled";
				}
		}
	} catch(e){}
};

// Name: Button class
// Info: Toolbar button object.

var ToolbarButton = function( commandName, tooltip, width, height, src)
{
	if (src){
		src = setFixedSrc(src);
	}
	if (src){
		imageLoader.addImage(commandName, src);
	} else {
		imageLoader.addImage(commandName, 'skins/' + window.activeEditor.skinName+ "/tb.gif");
	}
	this.Command	= commandName ;
	this.Name = commandName.toLowerCase();
	this.Tooltip	= tooltip ? tooltip : commandName ;
	this.width = width;
	this.height = height;
	if (src){
		this.IconPath	= src ;
	} else {
		this.IconPath	= 'skins/' + window.activeEditor.skinName+ "/tb.gif" ;
	}
	this.mode 		= OFF;
};

var clone = document.createElement( 'div' ) ;

ToolbarButtonOver = function()
{
	if (this.ToolbarButton.mode!==DISABLED&&this.ToolbarButton.mode!==ON) {
		this.className = 'TB_Button_Over' ;
	}
};

ToolbarButtonOut = function()
{
	if (this.ToolbarButton && this.ToolbarButton.mode==OFF) {
		this.className = 'TB_Button_Off' ;
	}
};

ToolbarButtonDown = function()
{
	window.activeEditor.Focus();
	if (this.ToolbarButton.mode==OFF) {
		this.className = 'TB_Button_On';
		if (this.ToolbarButton.width){
			this.style.width = this.ToolbarButton.width;
			this.style.height = this.ToolbarButton.height;
		}
	}
};

ToolbarButtonOnClick = function()
{
	oCommand = window.activeEditor.commands.getCommand(this.ToolbarButton.Command);
	if (this.ToolbarButton.mode!==DISABLED) {
		oCommand.execute(this.ToolbarButton.DOMDiv);
		ToolbarSets.Redraw();
		PopupSet.Redraw(this.ToolbarButton.Command.toLowerCase());
		return false ;
	}
};

ToolbarButton.prototype.CreateInstance = function( parentToolbar )
{
	var d = clone.cloneNode(false) ;
	d.id  = garbage.generateId();
	garbage.add(d.id);
	d.className		= 'TB_Button_Off' ;
	d.unselectable = "on";
	d.style.margin = "1px";
	d.ToolbarButton	= this ;

	d.onmouseover = ToolbarButtonOver;
	d.onmouseout = ToolbarButtonOut;
	d.onmousedown = ToolbarButtonDown;
	d.onclick = ToolbarButtonOnClick;

	d.innerHTML = '<div '+'title="'+this.Tooltip+'"'+'class="Button" style="background-repeat: no-repeat;overflow:hidden;width:'+(this.width ? this.width : '21px')+';height:'+(this.height ? this.height : '20px')+';" unselectable = "on"></div>';
	d.firstChild.style.background = "url("+imageLoader.getImage(this.Command).src+")";
	d.firstChild.style.backgroundRepeat = "no-repeat";
	d.firstChild.style.overflow = "hidden";
	d.firstChild.style.display = "block";
	try{
		d.firstChild.style.backgroundPosition = "0px -"+(tlb_pos[this.Name]*20)+"px";
	}catch(e){}

	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	var pic = oCell.appendChild( d ) ;
	this.DOMDiv = d;
};

ToolbarButton.prototype.Redraw = function(e)
{
	var m ;

	oCommand = window.activeEditor.commands.getCommand(this.Command);

	m = oCommand.getMode();
	if (!window.activeEditor.editable && this.Command!=="Help" && this.Command!=="Pageproperties" && this.Command!=="Fullscreen" && this.Command!=="Save") {
		m=DISABLED;
	}
	if ( m == this.mode ) {
		return ;
	}

	// Sets the actual state.
	this.mode = m ;
	switch ( this.mode ) {
		case ON :
			this.DOMDiv.className = 'TB_Button_On' ;
			break ;
		case OFF :
			this.DOMDiv.className = 'TB_Button_Off' ;
			break ;
		default :
			this.DOMDiv.className = 'TB_Button_Disabled' ;
			break ;
	}
};

// Name: DropButton class
// Info: DropButton object.

var ToolbarButtonDrop = function( commandName, tooltip, style, sourceView ,oPopup)
{
	imageLoader.addImage(commandName, 'skins/' + window.activeEditor.skinName+ "/" + commandName.toLowerCase() + '.gif');
	this.Command	= commandName ;
	this.Command2	= commandName + "down" ;
	this.Label		= "";
	this.Tooltip	= tooltip ? tooltip : commandName ;
	this.SourceView	= sourceView ? true : false ;
	this.icons = new Array();
	this.icons[0] = new Image();
	this.icons[0].src = 'skins/' + window.activeEditor.skinName+ "/" + commandName.toLowerCase() + '.gif';
	if (commandName.toLowerCase()=="fontcolor"||commandName.toLowerCase()=="highlight"){
		this.icons[1] = new Image();
		this.icons[1].src = 'skins/' + window.activeEditor.skinName+ "/" + commandName.toLowerCase() + '2.gif' ;
	}
	this.IconPath2	= 'skins/' + window.activeEditor.skinName+ "/dropmenu.gif" ;
	this.mode 		= OFF;
	this.oPopup		= oPopup ? oPopup : false;
	this.data		= null;
	this.range		= null;
};

ToolbarButtonDrop.prototype.SetButtonColor = function( color )
{
	b = this.button.style;
	if (color === "") {
		if (this.Command=="Fontcolor")	{
			b.backgroundColor = "#000000";
			color="#000000";
		} else {
			b.backgroundColor = "#FFFFFF";
			color="#FFFFFF";
		}
	} else {
		b.backgroundColor = color;
	}
	this.data = color;
};

ToolbarButtonDrop.prototype.SetColor = function( color )
{
	b = this.button.style;
	if (color === "") {
		if (this.Command=="Fontcolor")	{
			b.backgroundColor = "#000000";
			color="#000000";
		} else {
			b.backgroundColor = "#FFFFFF";
			color="#FFFFFF";
		}
	} else {
		b.backgroundColor = color;
	}
	this.data = color;
	ae = window.activeEditor;
	ae.Focus();
	if (browser.IE) {
		ae.restorePos();
	}

	oCommand = window.activeEditor.commands.getCommand(this.Command);
	oCommand.execute(color);
};

ToolbarButtonDropOnClick = function()
{
	oCommand	= window.activeEditor.commands.getCommand(this.ToolbarButton.Command);
	if (this.ToolbarButton.mode!==DISABLED) {
		this.ToolbarButton.button.className = 'TB_ButtonDrop_On' ;
		oCommand.execute(this.ToolbarButton.data);
		ToolbarSets.Redraw(this.ToolbarButton.Command.toLowerCase());
		PopupSet.Redraw(this.ToolbarButton.Command.toLowerCase());
		return false ;
	}
};

ToolbarButtonDropOnMouseDown = function()
{
	if (this.ToolbarButton.mode==OFF) {
		this.className = 'TB_ButtonDrop_On' ;
	}
};

ToolbarButtonDownDropOnDown = function()
{
	if (this.ToolbarButton.mode==OFF) {
		this.className = 'TB_ButtonDrop_Right_On' ;
	}
};

ToolbarButtonDownDropOnClick = function()
{
	oCommand2	= window.activeEditor.commands.getCommand(this.ToolbarButton.Command2);
	if (this.ToolbarButton.mode!==DISABLED) {
		if (browser.IE) {
			window.activeEditor.storePos();
		}
		this.ToolbarButton.buttondown.className = 'TB_ButtonDrop_Right_On' ;
		window.tempcolorbut=this.ToolbarButton;
		oCommand2.execute(this.ToolbarButton.DOMDiv);
		ToolbarSets.Redraw(this.ToolbarButton.Command2.toLowerCase());
		PopupSet.Redraw(this.ToolbarButton.Command.toLowerCase());
		return false ;
	}
};

ToolbarButtonDownDropOnMouseOver = function()
{
	if (this.ToolbarButton.mode!==DISABLED){
		if (this.ToolbarButton.icons[1]) {
			this.ToolbarButton.button.src = this.ToolbarButton.icons[1].src;
		}
		this.ToolbarButton.button.className = 'TB_ButtonDrop_Over' ;
		this.ToolbarButton.buttondown.className = 'TB_ButtonDrop_Over' ;
	}
};

ToolbarButtonDownDropOnMouseOut = function()
{
	if (this.ToolbarButton.mode==OFF){
		if (this.ToolbarButton.icons[1]) {
			this.ToolbarButton.button.src = this.ToolbarButton.icons[0].src;
		}
		this.ToolbarButton.button.className = 'TB_ButtonDrop_Off' ;
		this.ToolbarButton.buttondown.className = 'TB_ButtonDrop_Right' ;
	}
};

ToolbarButtonDropOnMouseOver = function()
{
	if (this.ToolbarButton.mode!==DISABLED){
		if (this.ToolbarButton.icons[1]) {
			this.ToolbarButton.button.src = this.ToolbarButton.icons[1].src;
		}
		this.ToolbarButton.button.className = 'TB_ButtonDrop_Over' ;
		this.ToolbarButton.buttondown.className = 'TB_ButtonDrop_Over' ;
	}
};

ToolbarButtonDropOnMouseOut = function()
{
	if (this.ToolbarButton.mode==OFF){
		if (this.ToolbarButton.icons[1]) {
			this.ToolbarButton.button.src = this.ToolbarButton.icons[0].src;
		}
		this.ToolbarButton.button.className = 'TB_ButtonDrop_Off' ;
		this.ToolbarButton.buttondown.className = 'TB_ButtonDrop_Right' ;
	}
}

ToolbarButtonDrop.prototype.CreateInstance = function( parentToolbar )
{
	var str =
		'<img class="ButtonDrop" title="'+this.Tooltip+'" src="' + this.icons[0].src + '" unselectable="on">'+
		'<img class="ButtonDrop" title="'+this.Tooltip+'" src="' + this.IconPath2 + '" unselectable="on">';


	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	oCell.innerHTML = str ;
	this.button	= oCell.firstChild;
	this.buttondown = oCell.firstChild.nextSibling;
	this.button.id  = garbage.generateId();
	garbage.add(this.button.id);
	this.buttondown.id  = garbage.generateId();
	garbage.add(this.buttondown.id);

	this.buttondown.ToolbarButton	= this ;
	this.button.ToolbarButton	= this ;

	this.buttondown.ToolbarButton	= this ;
	this.button.ToolbarButton	= this ;
	this.button.onmousedown		= ToolbarButtonDropOnMouseDown;
	this.button.onclick			= ToolbarButtonDropOnClick;
	this.buttondown.onmousedown	= ToolbarButtonDownDropOnDown;
	this.buttondown.onclick		= ToolbarButtonDownDropOnClick;
	this.buttondown.onmouseover = ToolbarButtonDownDropOnMouseOver;
	this.buttondown.onmouseout	= ToolbarButtonDownDropOnMouseOut;
	this.button.onmouseover		= ToolbarButtonDropOnMouseOver;
	this.button.onmouseout		= ToolbarButtonDropOnMouseOut;

	this.DOMDiv = this.button;

};

ToolbarButtonDrop.prototype.Redraw = function()
{
	var m ;
	oCommand = window.activeEditor.commands.getCommand(this.Command);
	m = oCommand.getMode() ;
	if (!window.activeEditor.editable) {
		m=DISABLED;
	}
	if ( m == this.mode ) {
		return ;
	}

	this.mode = m ;
	switch ( this.mode ) {
		case ON :
			this.button.className = 'TB_ButtonDrop_On' ;
			this.buttondown.className = 'TB_ButtonDrop_On' ;
			break ;
		case OFF :
			this.button.className = 'TB_ButtonDrop_Off' ;
			this.buttondown.className = 'TB_ButtonDrop_Right' ;
			break ;
		default :
			this.button.className = 'TB_ButtonDrop_Disabled' ;
			this.buttondown.className = 'TB_ButtonDrop_Disabled' ;
			break ;
	}
};

// Name: LinkLabel class
// Info: Label with link in the toolbar.

var LinkLabel = function(name,label)
{
	this.Name = name;
	this.Label = label;
};

LinkLabelOnClick = function()
{
	oCommand = window.activeEditor.commands.getCommand(this.ToolbarButton.Name);
	oCommand.execute();
};

LinkLabel.prototype.CreateInstance = function( parentToolbar )
{
	this.cDiv = document.createElement( 'div' ) ;
	this.cDiv.unselectable = "on";

	var pos = 0;
	if (window.activeEditor.toolbarpos < DevEditToolbars.length-1) {
		pos = window.activeEditor.toolbarpos+1;
	}
	var str = this.Label=="Switch mode"? DevEditToolbars[pos] + " mode":str=this.Label;
	if (this.Name=="EditorMode" && hideitems["tlbmode"]=="1") {
		str = "";
	}
	this.cDiv.innerHTML = '<A class="linklabel" title="'+this.Label+'" href="#">'+str+'</A>&nbsp;&nbsp;&nbsp;';

	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	oCell.appendChild( this.cDiv ) ;
	oCell.unselectable = "on";
	this.cDiv.firstChild.ToolbarButton	= this ;
	this.cDiv.firstChild.id = garbage.generateId();
	garbage.add(this.cDiv.firstChild.id);

	this.cDiv.firstChild.onclick = LinkLabelOnClick;
};

LinkLabel.prototype.ChangeLabel = function()
{
	var pos = 0;
	if (window.activeEditor.toolbarpos < DevEditToolbars.length-1) {
		pos = window.activeEditor.toolbarpos+1;
	}
	var str = "Switch to " + DevEditToolbars[pos] + " mode";

	this.cDiv.innerHTML = '<A class="linklabel" title="'+this.Label+'" href="#">'+str+'</A>';
};

LinkLabel.prototype.Redraw = function(e)
{
	return ON;
};

// Name: Combo class
// Info: Combo component.

var Combo = function( commandName, label, items, classname, stylename)
{
	this.Command	= commandName;
	this.Label		= label ? label : commandName ;
	this.Tooltip	= this.Label;
	this.Items		= items;
	this.classname	= classname?classname:false;
	this.collapsed	= true;
	this.stylename  = stylename;
};

Combo.prototype.Redraw = function( parentToolbar )
{
	try{
		var list = this.SelectElement.Combo.ComboList;
		if (!this.SelectElement.Combo.collapsed){
			list.style.top = "0px";
			list.style.left = "0px";
			list.style.visibility = "hidden";
			this.SelectElement.Combo.collapsed = true;
		}

		var sValue=null;
		try {
			sValue = window.activeEditor._frame.queryCommandValue( this.Command ) ;
		}
		catch(e) {sValue=null;}
		var sel=0;
		var find=false;
		if (this.Command=="Fontsize"){
			if (Selection && Selection.currentNode && Selection.currentNode.style) {
				for(var i=0;i<this.Items.length;i++) {
					if (Selection.currentNode.style.fontSize==this.Items[i][1])sValue = this.Items[i][1];
				}
			}
		}
		for (var i=0;i<this.Items.length;i++){
			if (sValue && typeof(sValue)=="number") {
				sValue = sValue.toString();
			}
			if (sValue && this.Items[i][1] && this.Items[i][1].toLowerCase().indexOf(sValue.toLowerCase())>=0) {
				find=true;
				sValue=this.Items[i][0];
				break;
			}
			if (sValue && this.Items[i][0] && this.Items[i][0].toLowerCase().indexOf(sValue.toLowerCase())>=0) {
				find=true;
				sValue=this.Items[i][0];
				break;
			}
		}
		if (!find && this.Command!=="Formatblock") {
			sValue=null;
		}

		if(sValue) {
			this.Head.innerHTML = sValue;
		} else {
			this.Head.innerHTML = this.Items[0][0];
		}
	} catch(e){}
};

ComboOnClick = function()
{
	if (!window.activeEditor.editable) {
		return;
	}
	closePrevCombo();
	window.activeEditor.Focus();
	var list = this.Combo.ComboList;
	var c = this.Combo.SelectElement;
	var pos = new Position();
	var left = pos.getLeft(c);
	var top = pos.getTop(c)+c.offsetHeight;
	if (list.offsetWidth < c.offsetWidth){
		list.style.width = c.offsetWidth;
		list.firstChild.style.width = c.offsetWidth;
	}

	if (this.Combo.collapsed) {
		list.style.top = top;
		list.style.left = left;
		list.style.visibility = "visible";
		this.Combo.collapsed = false;

		// clip height if needed
		if ((window.activeEditor.realHeight - 50) < list.offsetHeight){
			list.style.height = (window.activeEditor.realHeight - 50)+ "px";
			list.style.overflow = "auto";
		}

	} else {
		list.style.top = "0px";
		list.style.left = "0px";
		list.style.visibility = "hidden";
		this.Combo.collapsed = true;
	}
	last_combo = this.Combo;
};

ComboOnChange = function(command,name)
{
	oCommand	= window.activeEditor.commands.getCommand(command);
	oCommand.execute(name);
	ToolbarSets.Redraw();
};

var last_combo = null;
closePrevCombo = function()
{
	if (!last_combo) {
		return;
	}
	var list = last_combo.ComboList;

	if (!last_combo.collapsed) {
		list.style.top = "0px";
		list.style.left = "0px";
		list.style.visibility = "hidden";
	}
};

ComboOnFocus = function(){}

Combo.prototype.CreateInstance = function( parentToolbar )
{
	var d = clone.cloneNode(false);
	this.maindiv = d;

	// combo lists
	var combolist = document.createElement("div");
	combolist.id = this.Command+"combolist";
	combolist.className = "combolist";
	combolist.style.left = "0px";
	combolist.style.top = "0px";
	var opt='<table class="combo_table" unselectable="on" cellspacing="0" cellpadding="0" border="0">';
	for (i=0;i<this.Items.length;i++){
		var add_style = "";
		if (this.stylename=="see_array_2"){
			add_style = ((combostyle_flag)?unescape(this.Items[i][1].replace(/>/g,' unselectable="on" >')):"") + " "+unescape(this.Items[i][0]) + ((combostyle_flag)?unescape(this.Items[i][1].replace(/</g,'</')):"");
		} else {
			add_style = '<span unselectable="on"><span unselectable="on" ' + ((combostyle_flag)?'style="'+((this.Items[i][0]!=="" && this.Items[i][0]!=="Font" && this.Items[i][0]!=="Default" && i!=this.Items.length-1)?this.stylename+':'+unescape(this.Items[i][1]):'')+';"':"") + '>' + unescape(this.Items[i][0]) + "</span></span>";
		}
		if (this.Items[i][0]=="-"){
			opt=opt+'<tr><td><hr/ noshade size=1></td></tr>';
		} else {
			opt=opt+'<tr><td style="padding-left:3px;" unselectable="on" onclick=\'javascript:ComboOnChange("'+this.Command+'","'+unescape(this.Items[i][1])+'")\' onmouseout=\'javascript:this.className="combolist_item"\' onmouseover=\'javascript:this.className="combolist_item_highlight"\'>'+add_style+'</td></tr>';
		}
	}
	opt+="</table>";
	combolist.innerHTML=opt;
	document.body.appendChild(combolist);
	this.ComboList = combolist;

	// select element
	d.innerHTML = '<div title="' + this.Tooltip + '"  unselectable="on" class="'+this.classname+'" onmouseover=\'javascript:this.className="' +
					this.classname+ ' ComboOver"\' onmouseout=\'javascript:this.className="' +
					this.classname+ '"\'>'+
					'<table width="100%" cellspacing="0" cellpadding="0" border="0" unselectable="on">' +
					'<tr><td unselectable="on" class="Combo_head" width="100%"><span unselectable="on" style="margin:1px">' +
					unescape(this.Items[0][0])+ '</span></td>' +
					'<td ><div unselectable="on" class="combo_drop"></div></td>'+
					'</tr></table></div>';

	// Gets the SELECT element.
	this.SelectElement = d.firstChild;
	this.Head = d.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;

	this.SelectElement.id  = garbage.generateId();
	garbage.add(this.SelectElement.id);

	this.SelectElement.Combo = this ;

	this.SelectElement.onclick = ComboOnClick;
	this.SelectElement.onchange = ComboOnChange;
	this.SelectElement.onfocus = ComboOnFocus;

	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	oCell.appendChild( d ) ;
	this.cDiv = d;
};

// Set of ToolbarSet
var ToolbarSets = new Object() ;

ToolbarSets.Items = new Array() ;
ToolbarSets.Itemsnum = new Array() ;

ToolbarSets.SwitchToolbarSet = function( toolbarsetName ){
	if (!this.Items[toolbarsetName]){
		this.AddItem(toolbarsetName,'eToolbar');
	}
	this.Items[toolbarmode].el.style.display="none";
	if (this.Items["_source"]) {
		this.Items["_source"].el.style.display="none";
	}
	if (this.Items["_preview"]) {
		this.Items["_preview"].el.style.display="none";
	}

	this.Items[toolbarsetName].el.style.display="";
	if (browser.NS) {
		var d = document.getElementById(window.activeEditor.InstanceName+"main1");
		if (d) {
			var tempH = d.offsetHeight;
			if (tempH){
				d.style.height = tempH - 1;
				d.style.height = tempH;
			}
		}
	}
	PopupSet.CloseAll();
};

ToolbarSets.AddItem = function(name,parentId){
	if (this.Items[name]) return;
	oToolbarSet = new ToolbarSet(name);
	oToolbarSet.Create();
	var toolbarplace = document.getElementById( parentId ) ;
	toolbarplace.appendChild(oToolbarSet.el);
	this.Items[name] = oToolbarSet;
	if (name=="_source"||name=="_preview") {
		this.Items[name].el.style.display="none";
	}
	this.Itemsnum[this.Itemsnum.length] = oToolbarSet;
};

ToolbarSets.Redraw = function(e)
{
	for (var i = 0 ; i < this.Itemsnum.length ; i++ ) {
		ToolbarSets.Itemsnum[i].Redraw(e) ;
	}
};

// Name: ToolbarSet class
// Info: Set of the toolbars

var ToolbarSet = function(toolbarSetName)
{
	this.Toolbars = new Array();
	this.Name = toolbarSetName;
	this.toolbarsetTable = document.createElement( 'table' ) ;
	this.el = this.toolbarsetTable;
	this.toolbarsetTable.cellPadding=0;
	this.toolbarsetTable.cellSpacing=0;
	this.toolbarsetTable.border=0;
	if (toolbarSetName!="footer") {
		this.toolbarsetTable.style.width = "100%";
	}
};

ToolbarSet.prototype.Create = function()
{
	var Set = DevEditToolbarSets[this.Name] ;

	for ( var x = 0 ; x < Set.length ; x++ ) {
		var cRow = this.toolbarsetTable.insertRow(this.toolbarsetTable.rows.length) ; //-1
		var cCell = cRow.insertCell(cRow.cells.length) ;
		if (x>0) { // insert horiz line
			cCell.className="body";
			//cCell.colspan = 2;
			cCell.bgColor = "#808080";
			cCell.innerHTML='<img src="images/1x1.gif" width="100%" height="1">';
			var cRow = this.toolbarsetTable.insertRow(this.toolbarsetTable.rows.length) ;
			var cCell = cRow.insertCell(cRow.cells.length) ;

			cCell.className="body";
			cCell.bgColor = "#FFFFFF";
			//cCell.colspan = 2;
			cCell.innerHTML='<img src="images/1x1.gif" width="100%" height="1">';
			var cRow = this.toolbarsetTable.insertRow(this.toolbarsetTable.rows.length) ;
			var cCell = cRow.insertCell(cRow.cells.length) ;
		}

		if (this.Name!="path" && this.Name!="footer") {
			cCell.className="TB_Toolbar";
		}

		var oToolbar = new Toolbar(cCell,this.Name) ;


		var prevItem='';
		for ( var j = 0 ; j < Set[x].length ; j++ ) {
			var sItem = Set[x][j] ;
			if (hideitems[sItem]=="1") {
				continue;
			}
			if ( sItem == '-'){
				if (prevItem!=='-') {
					oToolbar.AddSeparator() ;
				}
			} else {
				var oItem = window.activeEditor.toolbaritems.CreateItem( sItem ) ;
				if ( oItem ) {
					oToolbar.AddItem( oItem ) ;
				}
			}
			prevItem = sItem;
		}

		cCell.appendChild( oToolbar.DOMTable ) ;
		this.Toolbars[ this.Toolbars.length ] = oToolbar ;
	}
};

ToolbarSet.prototype.Redraw = function(e)
{
	try {
	if (e && this.Name==e) {
		return;
	}
	for ( var i = 0 ; i < this.Toolbars.length ; i++ ) {
		var oToolbar = this.Toolbars[i] ;
		for ( var j = 0 ; j < oToolbar.Items.length ; j++ ) {
			oToolbar.Items[j].Redraw(e);
		}
	}
	} catch (e){}
};

// Name: Toolbar class
// Info: Toolbar

var Toolbar = function(cCell,name)
{
	this.Items = new Array() ;
	this.Name = name;
	this.DOMTable = document.createElement( 'table' ) ;
	with ( this.DOMTable ) {
		cellPadding = 0 ;
		cellSpacing = 0 ;
		border = 0 ;
		nowrap = "nowrap";
	}

	this.DOMRow = this.DOMTable.insertRow(this.DOMTable.rows.length) ;
	this.firstItem = true;
};

Toolbar.prototype.AddItem = function( toolbarItem )
{
	if (this.firstItem) {
		var cCell = this.DOMRow.insertCell(this.DOMRow.cells.length) ;
		cCell.innerHTML='<img src="images/1x1.gif" width="2px" height="1px">';
		this.firstItem = false;
	}
	this.Items[ this.Items.length ] = toolbarItem ;
	toolbarItem.CreateInstance( this ) ;
};

Toolbar.prototype.AddSeparator = function()
{
	var oCell = this.DOMRow.insertCell(this.DOMRow.cells.length) ;
	oCell.unselectable = 'on' ;
	oCell.innerHTML = '<img class="seperator" src="'+deveditPath1+'/skins/'+window.activeEditor.skinName+'/seperator.gif" unselectable="on">' ;
};

// Name: Tab class
// Info:

var Tab = function( commandName, tooltip, imagepath, state )
{
	imageLoader.addImage(commandName,deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/" + imagepath.toLowerCase() + '.gif');
	imageLoader.addImage(commandName+"up",deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/" + imagepath.toLowerCase() + '_up.gif')	;

	this.Command	= commandName ;
	this.Tooltip	= tooltip ? tooltip : commandName ;
	this.IconDown	= deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/" + imagepath.toLowerCase() + '.gif' ;
	this.IconUp		= deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/" + imagepath.toLowerCase() + '_up.gif' ;
	this.mode 		= state;
};

TabOnClick = function()	{
	if (this.Tab.mode==OFF){
		oCommand	= window.activeEditor.commands.getCommand(this.Tab.Command);
		oCommand.execute();
		this.Tab.mode = CHOOSE;
		this.Tab.parentSheet.Redraw();
		return false ;
	}
};

Tab.prototype.CreateInstance = function( parentSheet )
{
	this.DOMDiv = document.createElement( 'div' ) ;

	this.DOMDiv.Tab	= this ;
	this.DOMDiv.id = garbage.generateId();
	garbage.add(this.DOMDiv.id);

	this.parentSheet = parentSheet;
	this.DOMDiv.onclick = TabOnClick;

	this.DOMDiv.innerHTML = '<SPAN class="tab" unselectable="on"><img id="'+this.IconDown+'" width="98px" height="22px" border=0 unselectable="on"></SPAN>' ;

	this.DOMDiv.firstChild.firstChild.src = imageLoader.getImage(this.Command).src;
	var oCell = parentSheet.DOMRow.insertCell(-1) ;
	oCell.appendChild( this.DOMDiv ) ;
};

Tab.prototype.Redraw = function()
{
	switch ( this.mode ) {
		case ON :
			var i = document.getElementById(this.IconDown);
			i.src = imageLoader.getImage(this.Command+"up").src;
			break ;
		default :
			var i = document.getElementById(this.IconDown);
			i.src = imageLoader.getImage(this.Command).src;
	}
};

// Name: Sheet class
// Info: Sets of tabs.

var Sheet = function()
{
	try{
		this.Items = new Array() ;
		this.DOMTable = document.createElement( 'table' ) ;
		this.DOMTable.className = 'TB_Toolbar' ;
		document.getElementById("footersheet").appendChild( this.DOMTable );
		with (this.DOMTable){
			cellPadding = 0 ;
			cellSpacing = 0 ;
			border = 0 ;
		}
		this.DOMRow = this.DOMTable.insertRow(-1) ;
	} catch (e){}
};

Sheet.prototype.Select = function( mode )
{
	for (var i=0;i<this.Items.length;i++){
		var t = this.Items[i];
		if (t.Command == mode){
			if (t.mode==OFF){
				t.mode = CHOOSE;
				t.parentSheet.Redraw();
			}
		}
	}
};

Sheet.prototype.AddItem = function( commandName, tooltip, imagepath, state)
{
	var oTab = new Tab(commandName, tooltip, imagepath, state);
	this.Items[ this.Items.length ] = oTab ;
	oTab.CreateInstance( this ) ;
};

Sheet.prototype.Redraw = function()
{
	for ( var j = 0 ; j < this.Items.length ; j++ ) {
		if (this.Items[j].mode == CHOOSE){
			this.Items[j].mode = ON;
		} else {
			this.Items[j].mode = OFF;
		}
		this.Items[j].Redraw() ;
	}
};

// Info: FontColor and Highlight classes

var ColorCommand = function(menu)
{
	this.Name = "colormenu";
	this.isLoad = false;
};

ColorCommand.prototype.execute = function(parentEl,offsetY)
{
	var p = parent.document.getElementById("colormenu"+window.activeEditor.InstanceName);
	if (!this.isLoad){
		var cf = parent.document.getElementById("color_frame"+window.activeEditor.InstanceName);
		cf.src = popup_color_src;
		this.isLoad = true;
	}
	var fr = parent.document.getElementById(window.activeEditor.InstanceName + 'main');
	var frameLeft =  this.getLeft(fr);
	var frameTop =  this.getTop(fr);

	this.oColorMenu = this.oItem;
	p.style.visibility="visible";
	var e = parentEl;
	p.style.zIndex=p.style.zIndex+100;
	p.style.left = this.getLeft(e)+frameLeft+(browser.IE?1:0)+"px";
	p.style.top = this.getTop(e) + e.offsetHeight-1+frameTop+(browser.IE?1:0)+"px";

	var f = p.firstChild;
	f.className="colorpopupcontainer";
};

ColorCommand.prototype.getMode = function()
{
	return OFF;
};

ColorCommand.prototype.getLeft = function(e)
{
	var nLeftPos = e.offsetLeft;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nLeftPos += eParElement.offsetLeft;
		eParElement = eParElement.offsetParent;
	}
	return nLeftPos;
}

ColorCommand.prototype.getTop = function(e)
{
	var nTopPos = e.offsetTop;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nTopPos += eParElement.offsetTop;
		eParElement = eParElement.offsetParent;
	}
	return nTopPos;
}

// FontcolorCommand
var FontColorCommand = function()
{
	this.Name = "forecolor";
};

FontColorCommand.prototype.execute = function(pStr,range)
{
	try{
		var p = pStr?pStr:null;
		if (range) {
			range.execCommand( this.Name, false, p );
		} else {
			window.activeEditor._frame.execCommand( this.Name, false, p );
		}
	} catch(e){}
	window.activeEditor.Focus();
};

FontColorCommand.prototype.getMode = function()
{
	try
	{
		if ( !window.activeEditor._frame.queryCommandEnabled( this.Name ) ) {
			return DISABLED ;
		} else {
			return window.activeEditor._frame.queryCommandState( this.Name ) ? ON : OFF ;
		}
	}
	catch ( e )
	{
		return OFF ;
	}
};


// HighlightCommand
var HighlightCommand = function()
{
	if (browser.NS)this.Name = "hilitecolor";
	else this.Name = "BackColor";
};

HighlightCommand.prototype.execute = function(pStr,range)
{
	try{
		var p = pStr?pStr:null;
		if (range) {
			range.execCommand( this.Name, false, p );
		} else {
			window.activeEditor._frame.execCommand( this.Name, false, p );
		}
	} catch(e){}
	window.activeEditor.Focus();
};

HighlightCommand.prototype.getMode = function()
{
	try
	{
		if ( !window.activeEditor._frame.queryCommandEnabled( this.Name ) ) {
			return DISABLED ;
		} else {
			return window.activeEditor._frame.queryCommandState( this.Name ) ? ON : OFF ;
		}
	}
	catch ( e )
	{
		return OFF ;
	}
};


// Name: Dialog commands
// Info: represent dialog window.

var DialogCommand = function(name, srcfile, w, h, checkTag, selTag, elementType)
{
	this.Name = name;
	this.srcfile = srcfile;
	this.width = w;
	this.checkTag = checkTag || false;
	this.selTag = selTag || false;
	this.elType = elementType || false;
	this.height = h;
	this.mode = "not found";
};

DialogCommand.prototype.execute = function()
{
	if (this.getMode()==DISABLED)return;
	var add="";
	switch (this.Name.toLowerCase()){
		case "image":
			add = "scrollbars=yes";
			break;
		default:
			add = "scrollbars=0";
	}

	if (this.selTag) {
		if (window.activeEditor.GetSelectedElement()) {
			el = window.activeEditor.GetSelectedElement();
			if (el.tagName==this.selTag&&(this.elType?this.elType.indexOf(el.type.toUpperCase())>=0:true)) {
				src = "Modify"+this.Name;
			} else {
				src = "Insert"+this.Name;
			}
		} else {
			src = "Insert"+this.Name;
		}
	} else {
		src = this.Name;
	}
	var left = Math.round((screen.availWidth-this.width) / 2);
	var top = Math.round((screen.availHeight-this.height) / 2 );

	sizestr = 'width='+this.width +',height='+this.height;
	if (this.Name=="MediaManager") {
		searchstr='&doc_root='+parent.doc_root+'&DEP1='+deveditPath1+'&DEP='+deveditPath + '&linkDir='+linkPath+'&flashDir=' + flashDir +'&flashDir=' + flashDir + '&mediaDir=' + mediaDir + '&imgDir=' + imageDir + '&wi=' + HideWebImage + '&tn=' + showThumbnails + '&du=' + disableImageUploading + '&dd=' + disableImageDeleting + '&dt=' + isEditingHTMLPage + '&rp=' + parent.remotePath + '&sp=' + parent.startPath + '&su=' + parent.startURL + '&ump=' + parent.uploadScriptPath + '&scu=' + parent.scUserId + '&lw=' + parent.showLoadingPleaseWait;
	} else {
		searchstr='&DEP1='+deveditPath1 +'&DEP='+deveditPath +'&linkDir=' + linkPath + '&rp=' + parent.remotePath + '&sp=' + parent.startPath + '&su=' + parent.startURL + '&ump=' + parent.uploadScriptPath + '&scu=' + parent.scUserId + '&lw=' + parent.showLoadingPleaseWait;
	}
	if (browser.NS){
		var opt = "status=no,location=no,menubar=no,resizable=yes,toolbar=no,dependent=yes,dialog=yes,minimizable=no,modal=yes,alwaysRaised=yes";
	} else {
		var opt = "status=yes";
	}

	var rnd = Math.floor(Math.random()*1000);
	window.open(HTTPStr.toLowerCase() + '://' + URL +"/"+ScriptName+'?rnd='+rnd+'&ToDo='+src+searchstr+'&'+this.srcfile,'_blank',opt+","+add+","+sizestr+",left="+left+",top="+top,true);
};

DialogCommand.prototype.isFlash = function(x){
	var cn;
	if (browser.IE) {
		cn = x.getAttribute("className");
	} else {
		cn = x.getAttribute("class");
	}
	if (cn=="de_flash_file") {
		return true;
	} else {
		return false;
	}
};

DialogCommand.prototype.isMedia = function(x)
{
	var cn;
	if (browser.IE) {
		cn = x.getAttribute("className");
	} else {
		cn = x.getAttribute("class");
	}
	if (cn=="de_media_file") {
		return true;
	} else {
		return false;
	}
};

DialogCommand.prototype.getMode = function()
{
	ae = window.activeEditor;
	this.mode="not found";

	var elT = this.elType;
	if (this.checkTag) {
		try{
			var tags = this.checkTag.split("|");
			var types="";
			var r = DISABLED;
			if (elT) {
				types=elT.split("|");
			}

			for (var i=0; i<tags.length;i++) {
				switch (tags[i]){
					case "empty":
						if (ae.GetType()!="Control" && ae.GetSelection()=="") {
							return OFF;
						}
						break;
					case "text":
						if (ae.GetType()=="Control") {
							return DISABLED;
						}
						if (ae.GetSelection()!="") {
							return OFF;
						}
						break;
					case "flash":
						var x = ae.GetSelectedElement();
						if (x && this.isFlash(x)) {
							this.mode="found";return OFF;
						} else {
							return DISABLED;
						}
						break;
					case "media":
						var x = ae.GetSelectedElement();
						if (x && this.isMedia(x)) {
							this.mode="found";return OFF;
						} else {
							return DISABLED;
						}
						break;
					case "link":
						if (ae.GetType()=="Control"){
							var x = ae.GetSelectedElement();
							if (x && x.tagName && x.tagName=="IMG") {
								return OFF;
							}
							var  x = ae.parentNode("A");
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
						} else	if (ae.GetSelection()!="") {
							var x = ae.GetSelectedElement();
							if (!x) {
								return OFF;
							}
							if (x.href&&x.href.indexOf("mailto:")==-1) {
								return OFF;
							}
						}
						break;
					case "emaillink":
						if (ae.GetType()=="Control"){
							var x = ae.GetSelectedElement();
							if (x && x.tagName && x.tagName=="IMG") {
								return OFF;
							}
							var x = ae.parentNode("A");
							if (!x) {
								return DISABLED;
							}
							if (x.href) {
								if(x.href.indexOf("mailto:")>=0) {
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
							if (x.href) {
								if (x.href.indexOf("mailto:")>=0) {
									return OFF;
								} else {
									return DISABLED;
								}
							}
						}
						break;

					default:
						var x = ae.GetSelectedElement();
						if (!x) {
							x = Selection.parentNode(tags[i]);
						}
						if (x) {
							if (x && x.getAttribute("className") && (x.getAttribute("className")=="de_flash_file" || x.getAttribute("className")=="de_media_file")) {
								return DISABLED;
							}
							if (types==""&&x.tagName&&tags[i].toUpperCase()==x.tagName.toUpperCase()) {
								this.mode="found";
								return OFF;
							} else if (types!="") {
								for (var j=0; j<types.length;j++){
									if (x.type&&types[j].toUpperCase()==x.type.toUpperCase()) {
										this.mode="found";
										return OFF;
									}
								}
							}
						}
				}
			}
			return DISABLED;
		} catch(e){}
	} else {
		ae = window.activeEditor._frame;
		try
		{
			if ( !ae.queryCommandEnabled(this.Name) ) {
				return DISABLED ;
			} else {
				return ae.queryCommandState(this.Name) ? ON : OFF ;
			}
		}
		catch ( e )
		{
			return OFF ;
		}
	}
};

// Name: Inner commands
// Info: Commands that supports by editor component.

var InnerCommand = function(name)
{
	this.Name = name.toLowerCase();
};

InnerCommand.prototype.execute = function(pStr)
{
	var p = pStr?pStr:null;
	var ae = window.activeEditor;
	try{
		buffer[ae.mode].saveHistory();
		if (browser.NS){
			if (this.Name=="copy"||this.Name=="cut"||this.Name=="paste"){
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			}
		}

		if ((browser.IE)&& (this.Name == "inserthorizontalrule")) {
			ae._frame.execCommand( this.Name, false );
		} else {
			ae._frame.execCommand( this.Name, false, p );
		}

		if ((browser.IE)&&(this.Name.toLowerCase()=="paste")) {
			ToolbarSets.Redraw();
		}
		if (this.Name == "absoluteposition") {
			ae._frame.execCommand("2D-Position",false, true);
		}
	} catch(e){}
	ae.Focus();
};

InnerCommand.prototype.getMode = function()
{
	ae = window.activeEditor;
	// some bug's behavior
	// disable copy,paste,cut commands in Mozilla
	try	{
		if (browser.NS){
			if (this.Name=="copy"||this.Name=="cut"||this.Name=="paste"){
				if (!ae.XPCOM)return DISABLED;
			}
		} else {
			if (this.Name=="copy") {
				if (ae.GetType()=="Text" && ae.GetSelection()=="") return DISABLED;
			}
		}

		// normal behavior
		if (!ae._frame.queryCommandEnabled( this.Name ) ) {
			return DISABLED ;
		} else {
			return ae._frame.queryCommandState( this.Name ) ? ON : OFF ;
		}
	}
	catch ( e )
	{
		return OFF ;
	}
};

// Name: Custom commands
// Info: User commands

var CustomCommand = function(jsfunc)
{
	this.jsfunc = jsfunc;
};

CustomCommand.prototype.execute = function()
{
	if (this.jsfunc) {
		if (this.jsfunc.indexOf("(")==-1){
			eval("parent."+this.jsfunc+"();")
		} else {
			eval("parent."+this.jsfunc+";")
		}	
	}
};

CustomCommand.prototype.getMode = function()
{
	return OFF ;
};

// Name: Label class
// Info: Label in the toolbar

var Label = function( text, icon)
{
	this.Label		= text;
	this.IconPath	= deveditPath1 + '/skins/' + window.activeEditor.skinName+ "/" + icon.toLowerCase() + '.gif' ;
};

Label.prototype.CreateInstance = function( parentToolbar )
{
	this.DOMDiv = document.createElement( 'div' ) ;
	this.DOMDiv.className		= 'TB_Button_Off' ;

	this.DOMDiv.innerHTML =
		'<table width="100" cellspacing="0" cellpadding="0" border="0" unselectable="on">' +
			'<tr>' +
				'<td class="Button" unselectable="on"><img src="' + this.IconPath + '" unselectable="on"></td>' +
				'<td class="TB_Text" unselectable="on">' + this.Label + '</td>' +
			'</tr>' +
		'</table>' ;

	var oCell = parentToolbar.DOMRow.insertCell(parentToolbar.DOMRow.cells.length) ;
	oCell.appendChild( this.DOMDiv ) ;
};

Label.prototype.Redraw = function(e){}

// Name: PopupSet class
// Info: Sets of popups.

var PopupSet = new Object() ;

PopupSet.Items = new Array() ;
PopupSet.isInitial = false;

PopupSet.CreatePopup = function(name)
{
	this.Items[name] = new Popup('',name);
};

PopupSet.CloseAll = function()
{
	cp = parent.document.getElementById("colormenu"+window.activeEditor.InstanceName);
	if (cp) {
		cp.style.visibility="hidden";
	}

	for (var i in PopupSet.Items )	{
		if (i!=="clone") {
			if (browser.IE){
				PopupSet.Items[i].popup.hide();
				PopupSet.Items[i].lastResult=-1;
				PopupSet.Items[i].isOpen = false;
			} else {	
				var p = parent.document.getElementById(PopupSet.Items[i].id);
				PopupSet.Items[i].isOpen = false;
				PopupSet.Items[i].lastResult=-1;
				
				if (p) {
					p.style.visibility="hidden";
				}
			}
		}
	}
};

PopupSet.Redraw = function(pname)
{
	var i;
	if ((!pname)||((pname!=="fontcolor") && (pname!=="highlight"))) {
		cp = parent.document.getElementById("colormenu"+window.activeEditor.InstanceName);
		if (cp) {
			cp.style.visibility="hidden";
		}
	}

	for ( i in PopupSet.Items )  {
		if (i!=="clone") {
			if (PopupSet.Items[i].name!==pname&&browser.NS){
				var p = parent.document.getElementById(PopupSet.Items[i].id);
				if (p) {
					p.style.visibility="hidden";
				}
			}
			PopupSet.Items[i].Redraw() ;
		}
	}
};

// Name: selection class
// Info: Selection object.

var Selection = new Object();

Selection.parentTags = new Array();
Selection.currentNode = null;

Selection.set = function()
{
	ae = window.activeEditor;
	aed = window.activeEditor._frame;

	if (this.currentNode!==ae.selectedtag) {
		ae.selectedtag = null;
	}

	oContainer = false;

	if (browser.IE) {
		try{
			sel = aed.selection;
			range = sel.createRange();
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
		} catch (e) {}
	} else {
		try {
			//window.activeEditor.Focus();
			oSel = ae._window.getSelection();
			range = oSel.getRangeAt(0);
			oContainer = range;
			var p = range.commonAncestorContainer;
			if (!range.collapsed && range.startContainer == range.endContainer && range.startOffset - range.endOffset <= 1 && range.startContainer.hasChildNodes()){
				p = range.startContainer.childNodes[range.startOffset];
				oContainer = p;
			}

			while (p.nodeType == 3) {
				p = p.parentNode;
				oContainer = p;
			}
		}
		catch (e) {
			oContainer = null;
		}
	}

	if (!oContainer||!oContainer.tagName){
		oContainer = aed.body;
	}

	if (this.currentNode == oContainer) {
		return;
	}
	//editable_area_selected = false;
	this.parentTags = new Array();
	this.currentNode = oContainer;
	while ( oContainer ) {
		this.parentTags.unshift(oContainer);
		oContainer = oContainer.parentNode ;
	}
};

Selection.parentNode = function(tag)
{
	var i = this.parentTags.length;
	if (i) {
		while (i--){
			if (this.parentTags[i].id && this.parentTags[i].id.substr(0,7)=="de_wrap") {
				return false;
			}
			if (this.parentTags[i].tagName && this.parentTags[i].tagName.toLowerCase()==tag.toLowerCase()) {
				return this.parentTags[i];
			}
		}
	}
	return false;
};

// Name: ToolbarItems class
// Info: Item in the Toolbar

var ToolbarItems = function()
{
	this.Items = new Object() ;
	return this;
};

ToolbarItems.prototype.CreateItem = function(Name)
{
	var item;

	var tl="";
	var titlesecurity="";
	if (browser.NS){
		if (!ae.XPCOM){
			tl = "Feature disabled. See help for details";
			titlesecurity="FireFox Restrictions";
		}
	}
	
	ab = -1;
	if (additionalButtons)
	for (var i=0;i<additionalButtons.length;i++){
		if (additionalButtons[i] && Name==additionalButtons[i][0]){
			ab = i;
			break;
		}
	}

	if (ab!==-1){
		item = new ToolbarButton( '_custom_'+ additionalButtons[ab][0] , additionalButtons[ab][0],additionalButtons[ab][1], additionalButtons[ab][2],additionalButtons[ab][3]);
		this.Items["_custom_" + additionalButtons[ab][0]] = item;
		return item ;
	}

	switch ( Name ){
		case 'Paragraph':item = new ToolbarButton( 'Paragraph' , 'Paragraph') ;break;
		case 'Previewlabel':item = new Label( 'Preview Mode' , 'Preview') ;break;
		case 'Save':item = new ToolbarButton( 'Save' , 'Save') ;break;
		case 'Fullscreen': item	= new ToolbarButton( 'Fullscreen' , 'Fullscreen mode' ) ; break;
		case 'Cut': item	= new ToolbarButton( 'Cut',tl?tl:'Cut') ; break;
		case 'Copy': item	= new ToolbarButton( 'Copy',tl?tl:'Copy') ; break;
		case 'Paste': item	= new ToolbarButtonDrop( 'Paste',tl?tl:'Paste' ) ; break;
		case 'Pastetext': item	= new ToolbarButtonDrop( 'Pastetext','Paste as Plain Text' ) ; break;
		case 'Spellcheck': item = new ToolbarButton( 'Spellcheck', 'Check spelling' ) ; break;
		case 'Bold': item	= new ToolbarButton( 'Bold'		) ; break;
		case 'Italic': item	= new ToolbarButton( 'Italic'	) ; break;
		case 'Underline': item	= new ToolbarButton( 'Underline') ; break;
		case 'Strikethrough': item	= new ToolbarButton( 'Strikethrough') ; break;
		case 'OrderedList': item	= new ToolbarButton( 'InsertOrderedList' , 'Insert ordered list'	) ; break;
		case 'UnorderedList': item	= new ToolbarButton( 'InsertUnorderedList', 'Insert unorderred list'	) ; break;
		case 'Indent': item	= new ToolbarButton( 'Indent', 'Increase Indent'	) ; break;
		case 'Outdent': item	= new ToolbarButton( 'Outdent', 'Decrease Indent'	) ; break;
		case 'JustifyLeft': item = new ToolbarButton( 'JustifyLeft', 'Align Left'	 ) ; break;
		case 'JustifyCenter': item	= new ToolbarButton( 'JustifyCenter', 'Align Center' ) ; break;
		case 'JustifyRight': item	= new ToolbarButton( 'JustifyRight', 'Align Right'	 ) ; break;
		case 'JustifyFull': item	= new ToolbarButton( 'JustifyFull', 'Justify'	 ) ; break;
		case 'SourceMode': item	= new ToolbarButton( 'SourceMode'	 ) ; break;
		case 'NewPage': item	= new ToolbarButton( 'NewPage', 'Clear HTML code'	 ) ; break;
		case 'Undo': item	= new ToolbarButton( 'Undo'	 ) ; break;
		case 'Redo': item	= new ToolbarButton( 'Redo'	 ) ; break;
		case 'UndoSource': item	= new ToolbarButton( 'Undo'	,'Undo' ) ; break;
		case 'RedoSource': item	= new ToolbarButton( 'Redo'	, 'Redo' ) ; break;
		case 'Print': item	= new ToolbarButton( 'Print'	 ) ; break;
		case 'SelectAll': item	= new ToolbarButton( 'SelectAll', 'Select all'	 ) ; break;
		case 'RemoveFormat': item	= new ToolbarButton( 'RemoveFormat', 'Remove Text Formatting'	 ) ; break;
		case 'SuperScript': item	= new ToolbarButton( 'SuperScript', 'Superscript'	 ) ; break;
		case 'SubScript': item	= new ToolbarButton( 'SubScript', 'Subscript'	 ) ; break;
		case 'CreateLink': item	= new ToolbarButton( 'CreateLink', 'Insert link' ) ; break;
		case 'Unlink': item	= new ToolbarButton( 'Unlink', 'Remove link' ) ; break;
		case 'HR': item	= new ToolbarButton( 'InsertHorizontalRule', 'Insert Horizontal Line' ) ; break;
		case 'Clearcode': item	= new ToolbarButton( 'Clearcode', 'Clear code'	 ) ; break;
		case 'Help': item	= new ToolbarButton( 'Help', 'Help' ) ; break;
		case 'Fontname': item	= new Combo( 'Fontname' ,'Font name' , mFontname,"Combo120","font-family")  ; break;
		case 'Fontsize': item	= new Combo( 'Fontsize' ,'Font size' , mFontsize , "Combo50" , "text-align:center;font-size") ; break;
		case 'Formatblock': item	= new Combo( 'Formatblock' ,'Format' , mFormatblock, "Combo80","see_array_2") ; break;
		case 'Styles': item	= new StyleCombo( 'Style' ,'Style' , "Combo90") ; break;
		case 'Form': item	= new ToolbarButton( 'Form', 'Form Functions' ) ; break;
		case 'Insertchars': item	= new ToolbarButton( 'Insertchars', 'Insert character' ) ; break;
		case 'Inserttextbox': item	= new ToolbarButton( 'Inserttextbox', 'Insert TextBox' ) ; break;
		case 'Table': item	= new ToolbarButton( 'Table', 'Table Functions' ) ; break;
		case 'Showborders': item	= new ToolbarButton( 'Showborders', 'Show borders' ) ; break;
		case 'Fontcolor': item	= new ToolbarButtonDrop( 'Fontcolor', 'Font Color' ) ; break;
		case 'Highlight': item	= new ToolbarButtonDrop( 'Highlight', 'Highlight' ) ; break;
		case 'CreateEmailLink': item	= new ToolbarButton( 'CreateEmailLink', 'Create Email Link' ) ; break;
		case 'Anchor': item	= new ToolbarButton( 'Anchor', 'Insert / Modify Anchor' ) ; break;
		case 'Findreplace': item	= new ToolbarButton( 'Findreplace', 'Find and replace' ) ; break;
		case 'Pageproperties': item	= new ToolbarButton( 'Pageproperties', 'Modify Page Properties' ) ; break;
		case 'Toggleposition': item	= new ToolbarButton( 'Toggleposition', "Toggle Absolute Positioning" ) ; break;
		case 'Image': item	= new ToolbarButton( 'Image', 'Insert / Modify Image' ) ; break;
		case 'Flash': item	= new ToolbarButton( 'Flash', "Insert / Modify flash" ) ; break;
		case 'Media': item	= new ToolbarButton( 'Media', 'Insert / Modify Media file' ) ; break;
		case 'File': item	= new ToolbarButton( 'File', "Link to file" ) ; break;

		case 'Custominsert': item	= new ToolbarButton( 'Custominsert', "Insert Custom HTML" ) ; break;
		case 'Emptylabel':item = new Label( '' , '') ;break;
		case 'GeckoXPConnect':item = new LinkLabel('GeckoXPConnect',titlesecurity) ;break;
		case 'EditorMode':item = new LinkLabel('EditorMode','Switch mode') ;break;
		case 'Path':item = new Path() ;break;
		case 'Edittag':item = new LinkLabel('Edittag',"Edit Tag") ;break;
	}
	var sName = Name;
	if ( this.Items[Name] ) {
		sName=Name+"_add";
	}
	this.Items[sName] = item;
	return item ;
};

ToolbarItems.prototype.GetItem = function(Name)
{
	return this.Items[Name];
};

// Name: Commands class
// Info: All DevEdit commands.

var Commands = function()
{
	this.allCommands = new Object() ;
	var c = this.allCommands;

	for (var i=0; i<additionalButtons.length;i++) {
		c["_custom_"+additionalButtons[i][0]] = new CustomCommand(additionalButtons[i][4]);
	}

	// load all commands
	c["ReplaceWord"]	= new ReplaceWord();
	c["NewTag"]	= new NewTag();	
	c["Paragraph"] = new ShowParagraphCommans();
	c["AddToDictionary"] = new AddToDictionary();
	c["Ignore"] = new Ignore();
	c["IgnoreAll"] = new IgnoreAll();
	c["Save"]	= new Save();
	c["Fullscreen"]	= new FullscreenCommand();
	c["Cut"]		= new InnerCommand("Cut");
	c["Copy"]		= new InnerCommand("Copy");
	if (is_forcePasteWord) {
		c["Paste"]		= new PasteFromMSWord();
	} else {
		if (is_forcePasteAsText) {
			c["Paste"]		= new PasteText();
		} else {	
			c["Paste"]		= new InnerCommand("Paste");
		}	
	}
	c["Pastetext"]	= new PasteText();
	c["Pastedown"]	= new PopupCommand("Paste");
	c["Pastefrommsword"]	= new PasteFromMSWord();
	c["Bold"]			= new InnerCommand("Bold",66);
	c["Italic"]		= new InnerCommand("Italic",73);
	c["Underline"]	= new InnerCommand("Underline",85);
	c["Strikethrough"]	= new InnerCommand("Strikethrough");
	c["Undo"]			= new Undo("edit");
	c["Redo"]			= new Redo("edit");
	c["UndoSource"]	= new Undo("source");
	c["RedoSource"]	= new Redo("source");
	c["Spellcheck"]		= new Spellcheck;
	c["Print"]		= new InnerCommand("Print");
	c["SelectAll"]	= new InnerCommand("SelectAll");
	c["RemoveFormat"]	= new InnerCommand("RemoveFormat");
	c["SuperScript"]	= new InnerCommand("SuperScript");
	c["SubScript"]	= new InnerCommand("SubScript");
	c["JustifyLeft"]	= new InnerCommand("JustifyLeft");
	c["JustifyCenter"]= new InnerCommand("JustifyCenter");
	c["JustifyRight"]	= new InnerCommand("JustifyRight");
	c["JustifyFull"]	= new InnerCommand("JustifyFull");
	c["Indent"]				= new InnerCommand("Indent");
	c["Outdent"]				= new InnerCommand("Outdent");
	c["InsertOrderedList"]	= new InnerCommand("InsertOrderedList");
	c["InsertUnorderedList"]	= new InnerCommand("InsertUnorderedList");
	c["InsertHorizontalRule"]	= new InnerCommand("InsertHorizontalRule");
	c["Anchor"]				= new DialogCommand("Anchor","anchor.php",400,162,false,"A");
	c["SourceMode"]	= new SourceCommand();
	c["EditMode"]		= new EditCommand();
	c["PreviewMode"]	= new PreviewCommand();
	c["Fontname"]	= new SetStyle("font-family","fontFamily");
	c["Fontsize"]	= new SetStyle("font-size","fontSize");
	if (browser.IE) {
		c["Formatblock"]	= new SetFormatBlock();
	} else {
		c["Formatblock"]	= new InnerCommand("Formatblock");
	}
	c["Clearcode"]	= new ClearCodeCommand();
	c["Help"]			= new DialogCommand("ShowHelp", "", 500, 400);
	c["Form"]	= new PopupCommand("Form");
	c["Insertform"]	= new DialogCommand("InsertForm","",400,223);
	c["Modifyform"]	= new DialogCommand("ModifyForm","",400,223,"FORM");
	c["Inserttextfield"]	= new DialogCommand("TextField","",400,230,"empty|INPUT","INPUT","TEXT|PASSWORD");
	c["Inserttextarea"]	= new DialogCommand("TextArea","",400,230,"empty|TEXTAREA","TEXTAREA");
	c["Inserthidden"]		= new DialogCommand("Hidden","",350,192,"empty|INPUT","INPUT","HIDDEN");
	c["Insertbutton"]		= new DialogCommand("Button","",400,192,"empty|INPUT","INPUT","BUTTON|RESET|SUBMIT");
	c["Insertcheckbox"]	= new DialogCommand("Checkbox","",400,192,"empty|INPUT","INPUT","CHECKBOX");
	c["Insertradio"]		= new DialogCommand("Radio","",400,192,"empty|INPUT","INPUT","RADIO");
	c["Insertselect"]		= new DialogCommand("Select","",520,350,"empty|SELECT","SELECT");
	c["Inserttextbox"]	= new InsertTextBox("InsertTextbox");
	if (window.InsertColumnRight) {
		c["Table"]	= new PopupCommand("Table");
		c["Inserttable"]	= new DialogCommand("InsertTable","",470,293);
		c["Quicktable"]	= new DialogCommand("QuickTable","",700,500);
		c["Modifytable"]	= new DialogCommand("ModifyTable","",450,262,"TABLE");
		c["Modifycell"]	= new DialogCommand("ModifyCell","modify_cell.html",400,234,"TD");
		c["Insertcolumnright"]	= new InsertColumnRight();
		c["Insertcolumnleft"]	= new InsertColumnLeft();
		c["Insertrowabove"]	= new InsertRowAbove();
		c["Insertrowbelow"]	= new InsertRowBelow();
		c["Deleterow"]	= new DeleteRow();
		c["Deletecolumn"]	= new DeleteColumn();
		c["Increasecolumnspan"]	= new IncreaseColumnSpan();
		c["Decreasecolumnspan"]	= new DecreaseColumnSpan();
		c["Increaserowspan"]	= new IncreaseRowSpan();
		c["Decreaserowspan"]	= new DecreaseRowSpan();
	}
	c["Showborders"]	= new ShowBordersCommand();
	c["Fontcolor"]	= new FontColorCommand();
	c["Fontcolordown"]	= new ColorCommand("colormenu.php");
	c["Highlight"]	= new HighlightCommand();
	c["Highlightdown"]	= new ColorCommand("colormenu.php");
	c["Findreplace"]	= new DialogCommand("Findreplace","",385,165);
	c["Style"]	= new SetStyle();
	c["Image"]	= new DialogCommand("MediaManager","obj=image",655,500,'empty|IMG');
	c["Flash"]	= new DialogCommand("MediaManager","obj=flash",655,500,'empty|flash');
	c["Media"]	= new DialogCommand("MediaManager","obj=media",655,500,'empty|media');
	c["CreateLink"]	= new DialogCommand("FileManager","obj=link",500,400,"link|IMG");
	c["CreateEmailLink"] = new DialogCommand("FileManager","obj=email",500,400,"emaillink|IMG");
	c["MoreColors"]	= new DialogCommand("MoreColors","",420,370);
	c["Custominsert"]	= new DialogCommand("Custominsert","",450,297);
	c["Contextmenu"] = new PopupCommand("contextmenu");
	c["Spellmenu"] = new PopupCommand("spellmenu");
	c["Sourcetag"] = new PopupCommand("sourcetag");

	c["GeckoXPConnect"] = new DialogCommand("ShowHelp","sectionid=firefox", 500, 400);
	c["EditorMode"] = new EditorModeCommand();

	c["Edittag"]	= new DialogCommand("Edittag","",385,230);

	// different between IE and Moz commands
	if (browser.IE) {
		c["Toggleposition"]	= new InnerCommand("Absoluteposition");
		c["Pageproperties"]	= new DialogCommand("Pageproperties","",400,410);
		c["Insertchars"]	= new DialogCommand("Insertchars","",420,450);
	} else {
		c["Toggleposition"]	= new TogglePosition("Absoluteposition");
		c["Pageproperties"]	= new DialogCommand("Pageproperties","",400,420);
		c["Insertchars"]	= new DialogCommand("Insertchars","",420,400);
	}
	return this;
};

Commands.prototype.getCommand = function(commandName)
{
	return this.allCommands[commandName];
}

function SetCookie(name,value,expires,path,domain,secure)
{
	parent.document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}

function getCookieVal (offset)
{
	var endstr = parent.document.cookie.indexOf(";", offset);
	if (endstr == -1) {
		endstr = parent.document.cookie.length;
	}
	return unescape(parent.document.cookie.substring(offset, endstr));
}

function GetCookie (name)
{
	var arg = name + "=";
	var alen = arg.length;
	var clen = parent.document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (parent.document.cookie.substring(i, j) == arg) {
			return getCookieVal (j);
		}
		i = parent.document.cookie.indexOf(" ", i) + 1;
		if (i == 0) {
			break;
		}
	}
	return null;
}

// EditorModeCommand command
var EditorModeCommand = function()
{
	this.Name = 'EditorModeCommand' ;
};

EditorModeCommand.prototype.changemode = function(str,par, val){
	idx=str.indexOf(par+"=",1);
	idx2=str.indexOf("&",idx+1);
	if ((idx>=0)&&(idx2==-1)) {
		idx2=str.length;
	}

	return str.substring(0,idx+par.length+1) + val + str.substring(idx2,str.length);
};

EditorModeCommand.prototype.execute = function()
{
	var ae = window.activeEditor;
	if (ae.toolbarpos < DevEditToolbars.length-1) {
		ae.toolbarpos++;
	} else {
		ae.toolbarpos=0;
	}
	mode = DevEditToolbars[ae.toolbarpos];

	parent.document.getElementById(ae.InstanceName+"_mode").value = mode;
	var new_href = this.changemode(ae.href, "mode", mode);

	var expDate = new Date;
	expDate.setTime (expDate.getTime() + (24*60*60*1000));
	SetCookie("de_mode",mode,expDate);

	ae.commands.getCommand('Save').execute("no");

	var y;
	if(browser.IE) {
		y = parent.document.body.scrollTop;
		SetCookie("scroll_top",y,expDate);
	}
	var x = new_href.replace(/&/gi,"&\n");
	window.location.href = new_href;
};

EditorModeCommand.prototype.getMode = function(){}

var Api = new Object() ;

Api.GetParent = function( element, parentTagName )
{
	var e = element.parentNode ;
	while ( e ) {
		if (e.nodeName == parentTagName) {
			return e ;
		}
		e = e.parentNode ;
	}
};

var Position = function()
{
	this.Name = 'postion';
};

Position.prototype.getTop = function(e)
{
	var nTopPos = e.offsetTop;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nTopPos += eParElement.offsetTop;
		eParElement = eParElement.offsetParent;
	}
	return nTopPos;
};

Position.prototype.getLeft = function(e)
{
	var nLeftPos = e.offsetLeft;
	var eParElement = e.offsetParent;
	while (eParElement != null) {
		nLeftPos += eParElement.offsetLeft;
		eParElement = eParElement.offsetParent;
	}
	return nLeftPos;
};

var edit_begin_tags	= new Array();
var edit_end_tags	= new Array();

var bth	= new Array();
var eth	= new Array();

// Add wrap for restricted area - edit mode
function addWrap(code,ignore)
{
	if(ignore) {
		return code;
	}
	//code = removeWrap(code);
	c1 = begin_edit_expr;
	c2 = end_edit_expr;

	var b = false;
	if (window.activeEditor.mode=="edit") {
		b = code.match(BodyContents);
		if (b) {
			code = b[2];
		}
	}

	edit_begin_tags	= code.match(begin_edit_expr);
	edit_end_tags	= code.match(end_edit_expr);
	var count = 0;

	code = code.replace(c1,function(){count++; return edit_begin_tags[count-1]+"<div id=de_wrap_div"+count+">";});
	code = code.replace(c2,"</div>$1");

	code = code.replace(/(<div id=de_wrap_div\d+><\/div>)/gi,function(s1,s2){return s2.replace(/<\/div>/gi,"&nbsp;</div>");});

	if (b) {
		return b[1] + code + b[3];
	} else {
		return code;
	}
}

// Remove wrap for restricted area
function removeWrap(code)
{
	if (code){

		var b = false;
		if (window.activeEditor.mode=="edit") {
			b = code.match(BodyContents);
			if (b) {
				code = b[2];
			}
		}
		c1 = wrap_tag_expr;
		c2 = wrap_end_tag_expr;
		var count=0;var count2=0;

		edit_begin_tags	= code.match(begin_edit_expr);
		edit_end_tags	= code.match(end_edit_expr);

		//if (c1.test(code)){
			code = code.replace(c1,function(s1,s2){count++;return edit_begin_tags[count-1];});
			code = code.replace(c2,function(s1,s2){count2++;return edit_end_tags[count2-1];});
		//}
		if (b) {
			return b[1] + code + b[3];
		} else {
			return code;
		}

	} else {
		return "";
	}
}

// Insert Begin - End area
function addEditTag(code)
{
	// wrap for edit area
	c1 = /(&lt;div([^>]+)de_wrap_div([^>]*?)&gt;)/gi;
	//c2 = /(&lt;\/div&gt;<\/font><font color=#000080><font color=#808080>&lt;!--[#\s]*?(?:Instance|Template|)EndEditable\s*?--&gt;<\/font><\/font>)/gi;
	c2 = /(&lt;\/div&gt;(?=<\/font><font color=#000080><font color=#808080>&lt;!--[#\s]*?(?:Instance|Template|)EndEditable\s*?--&gt;<\/font><\/font>))/gi;

	var count = 0; var count2 = 0;
	code = code.replace(c1,"<!-- BeginEditable --><div>");
	code = code.replace(c2,"</div><!-- EndEditable -->");
	//code = code.replace(c2,"</div><!-- EndEditable --></font><font color=#000080><font color=#808080>&lt;!-- EndEditable --&gt;</font></font>");
	return code;
}

function removeEditTag(code)
{

	var b = false;
	b = code.match(BodyContents);
	if (b) {
		code = b[2];
	}

	c1 = begin_edit_expr;
	c2 = end_edit_expr;
	var count=0;
	var count2=0;
	code = code.replace(c1,function(x1,x2){
		count++;
		return (edit_begin_tags ? edit_begin_tags[count-1]:"")+"<div id=de_wrap_div"+count+">";
	}
	);
	code = code.replace(c2,function(){
		count2++;
		return "</div>"+(edit_end_tags ? edit_end_tags[count2-1]:"");
	}
	);
	if (b) {
		return b[1] + code + b[3];
	} else {
		return code;
	}	
}

function replace_editable(html)
{
	if (window.activeEditor.isbegin && window.activeEditor.isend){
		var b = html.match(BodyContents);
		var count=0;
		var code;
		if (b){
			var save_code = b[2].match(edit_expr);
			var oldb = window.activeEditor.initHTML.match(BodyContents);
			code = oldb[2].replace(edit_expr,function(){count++;return save_code[count-1];});
			code = oldb[1] + code + oldb[3];
		} else {
			var save_code = html.match(edit_expr);
			code = window.activeEditor.initHTML.replace(edit_expr,function(){count++;return save_code[count-1];});
		}
		count = 0;
		var meta_code = html.match(meta_keywords_expr);
		code = code.replace(meta_keywords_expr,function(s,s1){count++;if (count==1)return meta_code[count-1];else return s1;});
	
		count = 0;
		var meta_code = html.match(meta_description_expr);
		code = code.replace(meta_description_expr,function(s,s1){count++;if (count==1)return meta_code[count-1];else return s1;});

		count = 0;
		var meta_code = html.match(title_expr);
		code = code.replace(title_expr,function(){count++;return meta_code[count-1];});
		return code;
	} else {
		return html;
	}	
}

function formatSaveCode(code)
{
	linkTag = /(&lt;link([^>]+)borders.css([^>]+)&gt;)/gi;
	code = code.replace(linkTag,"");

	linkTag2 = /(<link([^>]+)borders.css([^>]+)>)/gi;
	code = code.replace(linkTag2,"");

	classTag = /(class([^>]+)de_style_anchor)/gi;
	code = code.replace(classTag,"");

	classTag2 = /(class([^>]+)de_style_input)/gi;
	code = code.replace(classTag2,"");

	return code;
}

// convert src=https to just src=http
function ConvertSSLImages(code)
{
	replaceImage = 'src=\"http://' + URL;
	code = code.replace(re4,replaceImage);
	return code;
}

function formatCodeIE(code)
{
	htmlTag = /(&lt;(html)([\s\S]*?)&gt;)/gi;
	html2Tag = /(&lt;(\/html)([\s\S]*?)&gt;)/gi;
	body2Tag = /(&lt;(\/body)([\s\S]*?)&gt;)/gi;
	tableEndTag = /(&lt;(\/table)&gt;)/gi;

	code = code.replace(htmlTag,"$1<br/>");
	code = code.replace(html2Tag,"<br/>$1");
	code = code.replace(body2Tag,"<br/>$1");
	code = code.replace(tableEndTag,"<br/>$1<br/>");

	if (pathType == 1) {
		c1 = new RegExp(doc_root,"gi");
		code = code.replace(c1,"/");
	}

	return code;
}

// Format code for Mozilla
function formatCode(code)
{
	metaTag = /((<br\/?>)?\s?&lt;(meta))/gi;
	htmlTag = /(&lt;(html)[^(&gt;)]*?&gt;\s?(<br\/?>)?)/gi;
	html2Tag = /((<br\/?>)?\s?&lt;(\/html)([\s\S]*?)&gt;)/gi;
	titleTag = /(&lt;(\/title)&gt;\s?(<br\/?>)?)/gi;
	title2Tag = /((<br\/?>)?\s?&lt;(title)&gt;)/gi;
	tableTag = /(&lt;(tbody|th|tr|td|\/tbody|\/th|\/tr|\/td)([\s\S]*?)&gt;\s?(<br\/?>)?)/gi;
	tableBeginTag = /((<br\/?>)?\s?&lt;(table)([\s\S]*?)&gt;)/gi;
	tableEndTag = /(&lt;(\/table)&gt;\s?(<br\/?>)?)/gi;
	headTag = /(&lt;(head)&gt;\s?(<br\/?>)?)/gi;
	head2Tag = /(&lt;(\/head)[^(&gt;)]*?&gt;\s?(<br\/?>)?)/gi;
	bodyTag = /(&lt;(body)([\s\S]*?)&gt;\s?(<br\/?>)?)/gi;
	body2Tag = /((<br\/?>)?\s?&lt;(\/body)([\s\S]*?)&gt;)/gi;
	scriptTag = /(&lt;(script|\/script)([\s\S]*?)&gt;\s?(<br\/?>)?)/gi;

	code = code.replace(metaTag,function(s1,s2){return "<br/>"+s2.replace(/(<br\/?>)/gi,"");});
	code = code.replace(tableEndTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(tableBeginTag,function(s1,s2){return "<br/>"+s2.replace(/(<br\/?>)/gi,"");});
	code = code.replace(htmlTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(html2Tag,function(s1,s2){return "<br/>"+s2.replace(/(<br\/?>)/gi,"");});
	code = code.replace(title2Tag,function(s1,s2){return "<br/>"+s2.replace(/<br\/?>/gi,"");});
	code = code.replace(titleTag,function(s1,s2){return s2.replace(/<br\/?>/gi,"")+"<br/>";});
	code = code.replace(tableTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(headTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(head2Tag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(bodyTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	code = code.replace(body2Tag,function(s1,s2){return "<br/>"+s2.replace(/(<br\/?>)/gi,"");});
	code = code.replace(scriptTag,function(s1,s2){return s2.replace(/(<br\/?>)/gi,"")+"<br/>";});
	return code;
}
// End format

// Colorize Code in Source Mode
function colourCode(code)
{

	htmlTag = /(&lt;([\s\S]*?)&gt;)/gi;
	tableTag = /(&lt;(table|tbody|th|tr|td|\/table|\/tbody|\/th|\/tr|\/td)([\s\S]*?)&gt;)/gi;
	commentTag = /(&lt;!--([\s\S]*?)&gt;)/gi;
	imageTag = /(&lt;img([\s\S]*?)&gt;)/gi;
	objectTag = /(&lt;(object|\/object)([\s\S]*?)&gt;)/gi;
	linkTag = /(&lt;(a|\/a)([\s\S]*?)&gt;)/gi;
	scriptTag = /(&lt;(script|\/script)([\s\S]*?)&gt;)/gi;
	headlinkTag = /(&lt;link([^&]*?)(borders.css)([^&]*?)&gt;<br\/>)/gi;
	code = code.replace(headlinkTag,"");
	headlinkTag2 = /(&lt;link([^&]*?)(borders.css)([^&]*?)&gt;)/gi;
	code = code.replace(headlinkTag2,"");

	code = code.replace(headlinkTag,"");
	code = code.replace(htmlTag,"<font color=#000080>$1</font>");
	code = code.replace(tableTag,"<font color=#008080>$1</font>");
	code = code.replace(commentTag,"<font color=#808080>$1</font>");
	code = code.replace(imageTag,"<font color=#800080>$1</font>");
	code = code.replace(objectTag,"<font color=#840000>$1</font>");
	code = code.replace(linkTag,"<font color=#008000>$1</font>");
	code = code.replace(scriptTag,"<font color=#800000>$1</font>");
	return code;
}
// End colorize

// Replace IMG to EMBED
function img2embed(code) {
	if (useXHTML == 1) {
		code = code.replace(/<\/embed\/?>/gi, "");
	}

	c1 = /(<img[^>]*?name2="([\s\S]*?)"[^>]*?>)/gi;

	code = code.replace(c1,function(s1,s2,s3){
			r1 = s2.match(/width\s*[:|=]\s*(\S+)[%|px]?/gi);
			r2 = s2.match(/height\s*[:|=]\s*(\S+)[%|px]?/gi);
			s3 = unescape(s3);

			if (useXHTML == 1) {
				s3 = getXHTML(s3);
			}

			var h = r2[0].replace(/:/gi,"=");
			var w = r1[0].replace(/:/gi,"=");
			w = w.replace(/[>|;|\/" | ]/gi,"");
			h = h.replace(/[>|;|\/|" ]/gi,"");
			h = h.replace(/=/gi,'="')+'"';
			w = w.replace(/=/gi,'="')+'"';

			s3 = s3.replace(/(height\s*=\s*[\d\"\']+)/gi,h);
			s3 = s3.replace(/(width\s*=\s*[\d\"\']+)/gi,w);
			return s3;
		}
	);

	// media UPL
	c1 = /(\<(?:style[^\>]+?\>|)[^\>]+?(url\(([^\)]+)\))[^\>]+\>)/gi;
	var cnt = 0;
	code = code.replace(c1,function(s1,sx,s2){
		var r = new RegExp(s2,"gi");
		cnt+=1;
		if (s2.indexOf('"')!==-1){
			return sx.replace(r,'url("'+media_urls[cnt-1]+'")');
		} else {
			return sx.replace(r,'url('+media_urls[cnt-1]+')');
		}	
		}
	);
	
	// relative path
	c1 = /(<([^>]+)realsrc="([^"]+)"([^>]*)>)/gi;
	code = code.replace(c1,function(s1,s2,sx,s3){
		rs = /(src="([^"]+)")/gi;

		s2 = s2.replace(rs,function(w1,w2){
			if (w2.indexOf(s3)>=0 || s3.indexOf("..")>=0) return 'src="'+s3+'"'; // ???
				else return 'src="'+w2+'"';
		});

		rs = /(href="([^"]+)")/gi;
		s2 = s2.replace(rs,function(w1,w2){
			if (w2.indexOf(s3)>=0 && !isSpecialHref(s2) && w2.indexOf("mailto:")==-1 &&w2.indexOf("javascript:")==-1) return 'href="'+s3+'"';
				else return 'href="'+w2+'"';
		});

		rs = /(background="?([^"|\s]+)"?)/gi;
		s2 = s2.replace(rs,function(w1,w2){
			if (w2.indexOf(s3)>=0) return 'background="'+s3+'"';
				else return 'background="'+w2+'"';
		});

		s2 = s2.replace(/(realsrc="([^"]+)")/gi,"");

		return s2;

	}
	);
	
	// remove -moz- style
	c1 = /(style="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		return s2.replace(/(-moz-[^;]+;)/gi,"");
	}
	);
	
	return code;
}

// Replace IMG to EMBED
function img2embed2(code) {
	if (useXHTML == 1) {
		code = code.replace(/<\/embed\/?>/gi, "");
	}

	c1 = /(<img[^>]*?name2="([\s\S]*?)"[^>]*?>)/gi;

	code = code.replace(c1,function(s1,s2,s3){
			r1 = s2.match(/width\s*[:|=]\s*(\S+)[%|px]?/gi);
			r2 = s2.match(/height\s*[:|=]\s*(\S+)[%|px]?/gi);
			s3 = unescape(s3);

			if (useXHTML == 1) {
				s3 = getXHTML(s3);
			}

			var h = r2[0].replace(/:/gi,"=");
			var w = r1[0].replace(/:/gi,"=");
			w = w.replace(/[>|;|\/" | ]/gi,"");
			h = h.replace(/[>|;|\/|" ]/gi,"");
			h = h.replace(/=/gi,'="')+'"';
			w = w.replace(/=/gi,'="')+'"';

			s3 = s3.replace(/(height\s*=\s*[\d\"\']+)/gi,h);
			s3 = s3.replace(/(width\s*=\s*[\d\"\']+)/gi,w);

			return s3;

		}
	);
	return code;
}

// Replace IMG to EMBED
function img2embed22(code) {
	// relative path
	c1 = /(src="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		var t = (s3.substr(0,1)=="/" || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
		if (t) return s2;
		else {
		if (loadedFile) return 'realsrc="'+s3+'" src="'+loadedFile+s3+'"';
			else return 'realsrc="'+s3+'" src="'+doc_root+s3+'"';
		}
		}
	);

	c1 = /(href="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		var t = (s3.substr(0,1)=="/" || isSpecialHref(s3) || s3.indexOf("javascript:")>=0 || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
		if (t) return s2;
		else {
		if (loadedFile) return 'realsrc="'+s3+'" href="'+loadedFile+s3+'"';
			else return 'realsrc="'+s3+'" href="'+doc_root+s3+'"';
		}
		}
	);

	c1 = /(background="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		var t = (s3.substr(0,1)=="/" || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
		if (t) return s2;
		else {
		if (loadedFile) return 'realsrc="'+s3+'" background="'+loadedFile+s3+'"';
			else return 'realsrc="'+s3+'" background="'+doc_root+s3+'"';
		}
		}
	);

	// media UPL
	c1 = /(url\("([^"]+)"\))/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (is_path_full(s3)) {
			return s2;
		}
		else {
			if (loadedFile) return 'url("'+loadedFile+s3+'")';
			else return 'url("'+doc_root+s3+'")';
		}
		}
	);

	return code;
}

function is_path_full(s3) {
	return (s3.substr(0,1)=="/" || s3.substr(0,1)=="{" || s3.indexOf("mailto:")>=0 || s3.indexOf("javascript:")>=0 || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
}

var media_urls = new Array();

function embed2img(code, ignore_media_url) {
	if (!ignore_media_url){
		media_urls.length=0;
	}	
	
	c1 = /(<embed [\s\S]*?>)/gi;
	code = code.replace(c1,function(s1,s2){
				r1 = s2.match(/width=\s*(\S+)[\s\S]*?/gi);
				r2 = s2.match(/height=\s*(\S+)[\s\S]*?/gi);
				r3 = s2.match(/src=\s*(\S+)\s?/gi);
				w = r1[0].replace(/[>|;|]/gi,"");
				h = r2[0].replace(/[>|;|]/gi,"");
				alt = r3[0].replace(/[>|;|"]/gi,"");
				if (alt) alt = alt.replace(/src/gi,"alt");
				if (s2.indexOf("x-mplayer")>=0)	return '<img '+w+' '+h+' '+alt+' class="de_media_file" name2="'+escape(s2)+'" >';
					else return '<img  '+w+' '+h+' '+alt+'class="de_flash_file" name2="'+escape(s2)+'" >';
			}
		);

	// relative path - src
	c1 = /\<[^\>]+?(src="([^"]+)")[\s\S]+?\>/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (is_path_full(s3)){
			if (canBroken(s3)){
				var r = new RegExp(s2);
				return s1.replace(r,'realsrc="'+s3+'" src="'+s3+'"');
			} else {
				return s1;
			}	
		}
		else {
			var r = new RegExp(s2);
			if (loadedFile) return s1.replace(r,'realsrc="'+s3+'" src="'+loadedFile+s3+'"');
			else return s1.replace(r,'realsrc="'+s3+'" src="'+doc_root+s3+'"');
		}
		}
	);

	// media UPL
	
	c1 = /(\<(?:style[^\>]+?\>|)[^\>]+?(url\("?([^"\)]+)"?\))[\s\S]+?\>)/gi;
	code = code.replace(c1,function(s1,sx,s2,s3){
		var r = new RegExp(s2,"gi");
		media_urls[media_urls.length] = s3;
		if (is_path_full(s3)) {
			if (canBroken(s3)){
				return sx.replace(r,'realsrc="'+s3+'" href="'+s3+'"');
			} else {
				return sx;
			}	
		}
		else {
			if (loadedFile) {
				if (s3.indexOf('"')!==-1)
					return sx.replace(r,'url("'+loadedFile+s3+'")');
				else
					return sx.replace(r,'url('+loadedFile+s3+')');
			} else {
				if (s3.indexOf('"')!==-1){
					return sx.replace(r,'url("'+doc_root+s3+'")');
				} else {
					return sx.replace(r,'url('+doc_root+s3+')');
				}	
			}	
		}
		}
	);


	// relative path - href
	c1 = /(background="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		if (is_path_full(s3) || s3.indexOf("borders.css")!==-1) {
			if (canBroken(s3)){
				return 'realsrc="'+s3+'" background="'+s3+'"';
			} else {
				return s2;
			}	
		}
		else {
			if (loadedFile) return 'realsrc="'+s3+'" background="'+loadedFile+s3+'"';
			else return 'realsrc="'+s3+'" background="'+doc_root+s3+'"';
		}
		}
	);

	// relative path - href
	c1 = /(style="([^"]+)")/gi;
	code = code.replace(c1,function(s1,s2,s3){
		return s2.replace(/(-moz-[^;]+;)/gi,"");
	}
	);
				
	return code;
}


function canBroken(s){
	if ( s.substr(0,1)=="/" ){
		return true;
	} else {
		return false;
	}
}

function isSpecialHref(s){
	if (s.indexOf("%")==-1 || s.indexOf("..")>=0 ){
		return false;
	} else {
		return true;
	}
}
function setRealSrc(s3) {
	var r = /(\%\w+:\w+\%)/gi;
	var t = (s3.indexOf("..")>=0 || s3.substr(0,1)=="/" || r.test(s3) || s3.indexOf("mailto:")>=0 || s3.indexOf("javascript:")>=0 || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
	if (t) return null;
	else {
		if (loadedFile) return loadedFile+s3;
			else return doc_root+s3;
	}
}


function setFixedSrc(s3) {
	var t = (s3.indexOf("..")>=0 || s3.substr(0,1)=="/" || s3.indexOf("mailto:")>=0 || s3.indexOf("javascript:")>=0 || s3.indexOf("http://")>=0 || s3.indexOf("www.")>=0 || s3.indexOf("https://")>=0 );
	if (t) return s3;
	else {
		if (loadedFile) return loadedFile+s3;
			else return doc_root+s3;
	}
}

HTMLEncode = function( text )
{
	if (!text) return '';
	text = text.replace( /&/g, "&amp;");
	text = text.replace( /"/g, "&quot;");
	text = text.replace( /</g, "&lt;");
	text = text.replace( />/g, "&gt;");
	text = text.replace( /'/g, "&#39;");
	return text ;
}


function _de_getContent(){
	ae = window.activeEditor;
	ae.commands.getCommand("Save").execute("no");
	return parent.document.getElementById(ae.InstanceName+"_html").value;
}

function _de_getTextContent()
{
	ae = window.activeEditor;
	ae.commands.getCommand("Save").execute("no");
	var code = parent.document.getElementById(ae.InstanceName+"_html").value;
	var h = code.match(BodyContents);
	if (h != null && h[2]) {
		code = h[2];
	}

	code = code.replace(/(\n)/gi,"");
	code = code.replace(/(\r)/gi,"");
	code = code.replace(/<br\/?>/gi,"\n");
	
	code = code.replace(/<[^>]+>/g,"");
	code = code.replace(/&lt;/g,"<");
	code = code.replace(/&gt;/g,">");
	code = code.replace(/&nbsp;/g," ");
			
	return code;
}


function _de_parse_special_char(code)
{
	var c = ["&#252;","&iexcl;","&cent;","&pound;","&yen;","&sect;","&uml;","&copy;","&laquo;","&not;","&reg;","&deg;","&plusmn;","&acute;","&micro;","&para;","&middot;","&cedil;","&raquo;","&iquest;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;","&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;","&Iuml;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&Oslash;","&Ugrave;","&Uacute;","&Ucirc;","&szlig;","&agrave;","&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;","&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&ntilde;","&ograve;","&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc;","&yuml;","&#8218;","&#402;","&#8222;","&#8230;","&#8224;","&#8225;","&#710;","&#8240;","&#8249;","&#338;","&#8216;","&#8217;","&#8220;","&#8221;","&#8226;","&#8211;","&#8212;","&#732;","&#8482;","&#8250;","&#339;","&#376;"];//"&nbsp;",,"&#252;"
	var x = document.createElement("DIV");
	for (var i=0;i<c.length;i++) {
		x.innerHTML = c[i];
		if (x.innerHTML=="") {
			continue;
		}
		var r = new RegExp(x.innerHTML,"g");
		code = code.replace(r,c[i].replace(/&/g, "&amp;"));
	}
	x = null;
	return code;
}

function _de_parse_special_char2(code)
{
	var c = ["&#252;","&iexcl;","&cent;","&pound;","&yen;","&sect;","&uml;","&copy;","&laquo;","&not;","&reg;","&deg;","&plusmn;","&acute;","&micro;","&para;","&middot;","&cedil;","&raquo;","&iquest;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;","&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;","&Iuml;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&Oslash;","&Ugrave;","&Uacute;","&Ucirc;","&szlig;","&agrave;","&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;","&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&ntilde;","&ograve;","&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc","&yuml;","&#8218;","&#402;","&#8222;","&#8230;","&#8224;","&#8225;","&#710;","&#8240;","&#8249;","&#338;","&#8216;","&#8217;","&#8220;","&#8221;","&#8226;","&#8211;","&#8212;","&#732;","&#8482;","&#8250;","&#339;","&#376;"];//"&nbsp;",,
	for (var i=0;i<c.length;i++) {
		var r = new RegExp(c[i],"g");
		code = code.replace(r,c[i].replace(/&/g, "&amp;"));
	}
	return code;
}

function _de_save_special_char(code)
{
	var c = ["&#252;","&iexcl;","&cent;","&pound;","&yen;","&sect;","&uml;","&copy;","&laquo;","&not;","&reg;","&deg;","&plusmn;","&acute;","&micro;","&para;","&middot;","&cedil;","&raquo;","&iquest;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;","&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;","&Iuml;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&Oslash;","&Ugrave;","&Uacute;","&Ucirc;","&szlig;","&agrave;","&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;","&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&ntilde;","&ograve;","&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc;","&yuml;","&#8218;","&#402;","&#8222;","&#8230;","&#8224;","&#8225;","&#710;","&#8240;","&#8249;","&#338;","&#8216;","&#8217;","&#8220;","&#8221;","&#8226;","&#8211;","&#8212;","&#732;","&#8482;","&#8250;","&#339;","&#376;"];//"&nbsp;",
	var x = document.createElement("DIV");
	for (var i=0;i<c.length;i++){
		x.innerHTML = c[i];
		if (x.innerHTML=="") {
			continue;
		}
		var r = new RegExp(x.innerHTML,"g");
		code = code.replace(r,c[i]);
	}
	x = null;
	return code;
}

function _de_save_special_char2(code){
	var c = ["&#252;","&iexcl;","&cent;","&pound;","&yen;","&sect;","&uml;","&copy;","&laquo;","&not;","&reg;","&deg;","&plusmn;","&acute;","&micro;","&para;","&middot;","&cedil;","&raquo;","&iquest;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;","&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;","&Iuml;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&Oslash;","&Ugrave;","&Uacute;","&Ucirc;","&szlig;","&agrave;","&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;","&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&ntilde;","&ograve;","&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc;","&yuml;","&#8218;","&#402;","&#8222;","&#8230;","&#8224;","&#8225;","&#710;","&#8240;","&#8249;","&#338;","&#8216;","&#8217;","&#8220;","&#8221;","&#8226;","&#8211;","&#8212;","&#732;","&#8482;","&#8250;","&#339;","&#376;"];//"&nbsp;",
	for (var i=0;i<c.length;i++) {
		var r = new RegExp(c[i],"g");
		code = code.replace(r,c[i]);
	}
	return code;
}

// Set style command
var SetStyle = function(style,style2)
{
	this.Name = 'SetStyle' ;
	if (style) {
		this.style = style;
	}
	if (style2) {
		this.style2 = style2;
	}
};

SetStyle.prototype.execute = function(name){ // class name or name of style property

	ae = window.activeEditor;
	sel = null;
	oContainer=null;

	if (browser.IE){	// IE don't see selected element
		var s = ae._frame.selection;
		if (s.type=="Text"){
			var pe = s.createRange().parentElement();
			var news = s.createRange().htmlText.replace(/\n|\r|\f|\v/g,"");

			var pes = pe.outerHTML.replace(/\n|\r|\f|\v/g,"")
			pes =pes.replace(/<[^>]+>/g,"")
			if (pes == news.replace(/<[^>]+>/g,"") && pe.tagName.toLowerCase()!=="body") {
				sel = pe;
			}
			if (ae.GetSelection()=="") {
				if (pe.parentNode && pe.parentNode.tagName.toLowerCase()=="span" ) {
					sel = pe.parentNode;
				} else {
					if (pe.tagName && pe.tagName.toLowerCase()!=="span") {
						sel=null;
					}
				}
			}
		}
	}

	if (!sel) {
		sel = ae.GetSelectedElement();
	}

	if (!sel && ae.GetSelection()!=="" && browser.NS ){// Gecko selection bug

		oSel = ae._window.getSelection();
		range = oSel.getRangeAt(0);

		if (!range.collapsed && range.startContainer.nextSibling && range.startContainer.nextSibling.tagName && range.startContainer.nextSibling.tagName.toLowerCase()=="span"){
			oContainer = range.startContainer.nextSibling;
			sel =  oContainer;
		} else {
			var p = range.commonAncestorContainer;
			if (!range.collapsed && range.startContainer == range.endContainer && range.startOffset - range.endOffset <= 1 && range.startContainer.hasChildNodes()){
				p = range.startContainer.childNodes[range.startOffset];
			}
			oContainer = p;

			if (p.nodeType == 3 ) {
				// only when parent tag include all text
				var txt = p.parentNode.innerHTML.replace(/<[^>]+>/gi,"");
				if (p.nodeValue == txt){
					oContainer = p.parentNode;
				} else {
					oContainer = null;
				}
			} else {
				// try to check if text inside parent tag
				var root = range.commonAncestorContainer;
				if (root.firstChild == range.startContainer && range.startOffset==0 && root.lastChild == range.endContainer){
					oContainer = root;
				} else {
					oContainer = null;
				}
			}

	/*		var checkPoint=null;
			if (oContainer.childNodes) {
				checkPoint = oContainer.childNodes[0];
				while (checkPoint && checkPoint.hasChildNodes()){
					checkPoint = checkPoint.childNodes[0];
				}
			}

			if (oContainer.tagName &&
				oContainer.tagName.toLowerCase()=="span" &&
				checkPoint &&
				range.isPointInRange(checkPoint,0)){
			} else {
				oContainer = null;
			}
*/
			if(oContainer) {
				sel = oContainer;
			}

		}
	}

	if (!sel&&ae.GetSelection()=="") {
		sel = ae.firstParentNode();
		if (!sel) {
			return;
		}
	}

	if (this.style){ // if set style property
		if (sel){
			eval("sel.style."+this.style2+"=\""+name+"\";");
			var count=0;
			for (var i in sel.style) {
				eval("if(sel.style['"+i+"'] && i!=='accelerator' && i!=='cssText'){count++;}");
			}
			if ((browser.IE && count==0) || (browser.NS && count==6) ) {
				sel.removeAttribute("style");
			}
			if (browser.IE && sel.outerHTML.search(/^<span>/gi)==0) {
				var s = ae._frame.selection;
				//if ( s.type.toLowerCase() != "none" )s.clear() ;
				var newNode = s.createRange().parentElement();
				if (newNode.tagName && newNode.tagName.toLowerCase()!=="span" && newNode.parentNode) {
					newNode = newNode.parentNode;
				}
				newNode.outerHTML = sel.innerHTML;
			}

			if (browser.NS && sel.attributes.length==0){ // remove span
				var s = ae._window.getSelection();
				range = ae._frame.createRange();
				range.selectNode(sel);
				s.removeAllRanges();
				s.addRange(range);

				ae._inserthtml(sel.innerHTML);
			}
		} else {
			var newNode;
			var sln = "";
			if (browser.IE) {

				var r = ae._frame.selection.createRange(); 
				
				if (ae._frame.selection.type=="Text" && r.htmlText.replace(/(\n)/g,"") == r.parentElement().innerHTML){//r.htmlText.indexOf("<",0)==0 &&
					r.collapse(false);
					r.select();
					var p = r.parentElement();

					r.moveToElementText(p);
					r.select()
				}

				sln = r.htmlText;

			} else {
				var s = ae._window.getSelection().getRangeAt(0);
				newNode = ae._frame.createElement("span");
				f = s.cloneContents();
				newNode.appendChild(f);
				sln = newNode.innerHTML;
				
				if ( s.startContainer == s.endContainer && (s.endOffset - s.startOffset) == 1 ) {
				} else {
					if (sln.indexOf("<",0)==0){
						var p = s.startContainer.childNodes[range.startOffset];;
						while(p && p.firstChild){
							p = p.firstChild;
						}
						
						var r = ae._frame.createRange();
						var sel = ae._window.getSelection();						
						sel.removeAllRanges();
						r.selectNodeContents(p.parentNode);						
						sel.addRange(r);
						sln = p.parentNode.innerHTML;
					}
				}
				newNode = null;
			}
			
			if (name=="") {
				sptext = sln;
			}else{
				sln = sln.replace(/^<[^>]+>/,"");
				sln = sln.replace(/<[^>]+>$/,"");
				sptext = "<span id='"+_de_temp_element+"' style='"+this.style+":"+name+"'>" + sln + "</span>";
			}

			ae._inserthtml (sptext);
		}

	} else { // if set class
		if (sel) {
			// remove class style
			if (!name) {
				if (browser.IE) {
					var clName = "className";
				} else {
					var clName = "class";
				}
				sel.removeAttribute(clName);
				if (sel.tagName && sel.tagName.toLowerCase()=="span") {
					var sln = "";
					if (browser.IE) {
						sel.outerHTML = sel.innerHTML;
					} else {
						var s = ae._window.getSelection();
						var range = s.getRangeAt(0) ;
						var f = range.createContextualFragment(sel.innerHTML) ;
						sel.parentNode.replaceChild(f,sel);
						s = null;
					}
				}

			// set style
			} else {
				sel.className = name;
			}

		} else {
			var newNode;
			if (browser.IE) {
				sptext = ae._frame.selection.createRange().htmlText;
			} else {
				var s = ae._window.getSelection().getRangeAt(0);
				newNode = ae._frame.createElement("span");
				f = s.cloneContents();
				newNode.appendChild(f);
				sptext = newNode.innerHTML;
				newNode = null;
			}

			if (name=="None"){
			} else {
				sptext = "<span id='"+_de_temp_element+"' class="+name+">" + sptext + "</span>";
			}
			ae._inserthtml (sptext,1);
		}
	}
	try{
		ae.Focus();
	}catch(e){}
	ToolbarSets.Redraw();
}

SetStyle.prototype.getMode = function()
{
	return OFF;
};

function removeBase(code)
{
	if (myBaseHref && window.activeEditor.useBase) {
		var r = new RegExp( '<base href="?'+myBaseHref+'"?\\s?\/?>',"gi");
		var r1 = new RegExp( '&lt;base href="?'+myBaseHref+'"?\\s?\/?&gt;',"gi");
		code = code.replace(r,"");
		code = code.replace(r1,"");		
	}
	return code;
}

// NewTag command
var NewTag = function()
{
	this.Name = 'AddTag' ;
	this.mode = OFF;	
};

NewTag.prototype.execute = function(tag, tag2)
{
	var ae = window.activeEditor;
	var l = tag.length;
	if (tag2){
		if ( tag.toLowerCase() == tag2.substring(0,l).toLowerCase() ){
			ae._inserthtml(tag2.substring(tag.length,tag2.length));
		} else {
			ae._shift_inserthtml(tag2, tag.length);
		}
	} else {
		ae._inserthtml(tag);
	}
};

NewTag.prototype.getMode = function(){
	return this.mode;
}

// Spellcheck command
var Spellcheck = function(){
	this.Name = 'Spellcheck' ;
	this.command = new DialogCommand("SpellCheck","spell_check.html",350,250);
	this.mode = OFF;
	this.isspell = false;
};

// ReplaceWord command
var ReplaceWord = function()
{
	this.Name = 'ReplaceWord' ;
};

ReplaceWord.prototype.execute = function(word)
{
	if (word!=="(no suggestions)") {
		var ae = window.activeEditor;
		ae._inserthtml(word);
	}
};

ReplaceWord.prototype.getMode = function(){return OFF;}

// Spellcheck command
var Spellcheck = function(){
	this.Name = 'Spellcheck' ;
	this.command = new DialogCommand("SpellCheck","spell_check.html",350,250);
	this.mode = OFF;
	this.isspell = false;
};

Spellcheck.prototype.execute = function()
{
	var aed=window.activeEditor._frame;
	if (this.mode==ON){
		this.mode=OFF;
		var l = _de_spell_words.length;
		for (var i=0;i<l;i++){
			var node = aed.getElementById("_de_spell_word_"+i);
			if (node) {
				var textNode =  aed.createTextNode(node.innerHTML);
				node.parentNode.replaceChild(textNode,node);
			}
		}
		_de_spell_words = null;
		_de_spell_words = new Array();
	} else {
		this.mode = ON;
		this.isspell=true;
		this.command.execute();
		this.isspell=false;
	}
};

Spellcheck.prototype.off = function()
{
	var aed=window.activeEditor._frame;
	if (this.mode==ON && !this.isspell) {
		this.mode=OFF;
		var l = _de_spell_words.length;
		for (var i=0;i<l;i++){
			var node = aed.getElementById("_de_spell_word_"+i);
			if (node) {
				var textNode =  aed.createTextNode(node.innerHTML);
				node.parentNode.replaceChild(textNode,node);
			}
		}
		_de_spell_words = null;
		_de_spell_words = new Array();
	}
};

Spellcheck.prototype.getMode = function()
{
	return this.mode;
};


// AddToDictionary command
var AddToDictionary = function()
{
	this.Name = 'AddToDictionary' ;
};

AddToDictionary.prototype.execute = function(word)
{
	var expDate = new Date;
	expDate.setTime (expDate.getTime() + (10*356*24*60*60*1000));
	cw = GetCookie("spellwords");
	if (!cw || !searchWord(cw, word)) {
		SetCookie("spellwords",cw+word+";",expDate);

		ae._inserthtml(word);

		// ignore all
		var l = _de_spell_words.length;
		for (var i=0;i<l;i++){
			var node = aed.getElementById("_de_spell_word_"+i);
			if (node && node.innerHTML==word) {
				var textNode =  aed.createTextNode(node.innerHTML);
				node.parentNode.replaceChild(textNode,node);
			}
		}
	}
};

AddToDictionary.prototype.getMode = function()
{
	return OFF;
};

function searchWord(s, word)
{
	var r = new RegExp(word+";","gi");
	if (s.search(r)>=0) {
		return true;
	} else {
		return false;
	}
}

function createArray()
{
	return new Array();
}

// Ignore command
var Ignore = function()
{
	this.Name = 'Ignore' ;
};

Ignore.prototype.execute = function(word)
{
		ae._inserthtml(word);

		// ignore all
		/*var l = _de_spell_words.length;
		for (var i=0;i<l;i++){
			var node = aed.getElementById("_de_spell_word_"+i);
			if (node && node.innerHTML==word){
				var textNode =  aed.createTextNode(node.innerHTML);
				node.parentNode.replaceChild(textNode,node);
			}
		}
		*/
};

Ignore.prototype.getMode = function()
{
	return OFF;
};

// IgnoreAll command
var IgnoreAll = function()
{
	this.Name = 'Ignore' ;
};

IgnoreAll.prototype.execute = function(word)
{
		// ignore all
		var l = _de_spell_words.length;
		for (var i=0;i<l;i++){
			var node = aed.getElementById("_de_spell_word_"+i);
			if (node && node.innerHTML==word) {
				var textNode =  aed.createTextNode(node.innerHTML);
				node.parentNode.replaceChild(textNode,node);
			}
		}
};

IgnoreAll.prototype.getMode = function()
{
	return OFF;
};

function removeSpellSpan(code)
{
	var l = _de_spell_words.length;
	var start = 0;
	var idx = 0;
	var idx2 = 0;
	var idx3 = 0;
	var idx4 = 0;

	for (var i=0;i<l;i++){
		idx = code.indexOf('<span id="_de_spell_word_'+i,start);
		if (idx>=0) {
			idx2 = code.indexOf('>',idx);

			// ignore span
			idx3 = code.indexOf('</span>',idx);
			var s = code.substr(idx2+1,idx3-idx2+1);
			var st = 0;
			while(s.indexOf("<span",st)>=0){
				idx3 = code.indexOf('</span>',idx3+1);
				st = s.indexOf("<span",st)+5;
			}
			idx4 = idx3 + 7;
			code = code.substring(0,idx3)+code.substring(idx4,code.length);

			// strip begin span
			code = code.substring(0,idx)+code.substring(idx2+1,code.length);
			start = 0;
		}
	}
	return code;
}

// SetFormatBlock command
var SetFormatBlock = function()
{
};

SetFormatBlock.prototype.execute = function(name)
{
	ae = window.activeEditor;
	sel = null;

	if (browser.IE) {	// IE don't see selected element
		var s = ae._frame.selection;
		if (s.type=="Text") {
			var pe = s.createRange().parentElement();
			var news = s.createRange().htmlText.replace(/\n|\r|\f|\v/g,"");
			if (pe.outerHTML.replace(/\n|\r|\f|\v/g,"") == news) {
				sel = pe;
			}
			if (ae.GetSelection()=="") {
				if (pe.parentNode) {
					sel = pe.parentNode;
				} else {
					if (pe.tagName && pe.tagName.toLowerCase()!=="span") {
						sel=null;
					}
				}
			}
		}
	}

	if (!sel) {
		sel = ae.GetSelectedElement();
	}
	if (!sel&&ae.GetSelection()=="") {
		sel = ae.firstParentNode();
		if (!sel) {
			return;
		}
	}


	var sln;
	if (sel) {
		var range = ae._frame.body.createTextRange();
		range.moveToElementText(sel);
		sln = sel.innerHTML;
		range.select();
	} else {
		sln = ae._frame.selection.createRange().htmlText;
	}

	sptext = name + sln + name.replace(/</gi,"</");
	ae._inserthtml (sptext);

	ToolbarSets.Redraw();
};

SetFormatBlock.prototype.getMode = function(){
	return OFF;
};

function checkImgLoaded (d)
{
	var ae = window.activeEditor;
	if (!d) {
		d = ae._frame;
	}
	for (var i=0;i<d.images.length;i++) {
		usePageBaseUrl(d.images[i]);
	}
}

// if img not found use base href
function usePageBaseUrl (img)
{
	// Gecko-based browsers act like NS4 in that they report this
	// incorrectly: they always return true.
	// However, they do have two very useful properties: naturalWidth
	// and naturalHeight. These give the true size of the image. If
	// it failed to load, either of these should be zero.
	if ((browser.IE && img.fileSize<=0) || (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0)) {
		var s = img.src;
		var r1 = new RegExp(loadedFile,"gi");
		var r2 = new RegExp(doc_root,"gi");
		if (loadedFile) {
			s = s.replace(r1,"");
		} else {
			s = s.replace(r2,"");
		}
		img.src = s;
		//if (this.img.getAttribute("realsrc"))this.img.setAttribute("realsrc", s);
	}
}


// ShowParagraphCommans command
var ShowParagraphCommans = function()
{
	this.Name = 'ShowParagraph' ;
	this.mode = OFF;
};

function cancelEvt(e){
	e.stopPropagation();
	e.preventDefault();
	return false;
}

function __showSpecialChar(){
	__hideSpecialChar();
	var doc=window.activeEditor._frame;
	var aPara=doc.getElementsByTagName("p");
	for(var i=0; i<aPara.length; i++){
		var image=doc.createElement("img");
		image.src = serverurl + deveditPath1 + '/images/para.gif';
		image.className="__p";
		image.border=0;
		//image.style.width=9;
		//image.style.height=11;
		image.unselectable="on";
		if (browser.NS)image.addEventListener( 'mousedown', cancelEvt, true ) ;
		aPara[i].appendChild(image)
	}
	var aPara=doc.getElementsByTagName("br");
	for(var i=0;i<aPara.length;i++){
		var image=doc.createElement("img");
		image.src=serverurl + deveditPath1 + '/images/br.gif';
		image.className="__br";
		image.border=0;
		//image.style.width=9;
		//image.style.height=11;
		image.unselectable="on";
		if (browser.NS)image.addEventListener( 'mousedown', cancelEvt, true ) ;		
		aPara[i].parentNode.insertBefore(image,aPara[i])
	}
}

function __hideSpecialChar(){		
	var doc=window.activeEditor._frame;
	var aRemove=new Array();
	var aImages=doc.getElementsByTagName("img");
	for(var i=0;i<aImages.length;i++){
		if(aImages[i].className=="__p"||aImages[i].className=="__br"){
			aRemove[aRemove.length]=aImages[i]
		}
	}
	for(var i=0;i<aRemove.length;i++){
		if(browser.IE)aRemove[i].removeNode(true);else aRemove[i].parentNode.removeChild(aRemove[i])
	}
	
}

ShowParagraphCommans.prototype.showChar = function(){
	if (this.mode == ON && window.activeEditor.mode == "edit"){
		__showSpecialChar();
	}
}

ShowParagraphCommans.prototype.hideChar = function(){
	__hideSpecialChar();
}

ShowParagraphCommans.prototype.execute = function()
{
	var d = window.activeEditor._frame;

	switch (this.mode){
		case ON:
			this.mode = OFF;
			__hideSpecialChar();
			break;
		case OFF:
			this.mode = ON;
			__showSpecialChar();
			break;
	}
};

ShowParagraphCommans.prototype.getMode = function()
{
	return this.mode;
};

function removeLineNumber(){
	if (!showLineNumber)return;
	document.getElementById("containerLineNumber").style.width = "";	
	document.getElementById("lineNumber").innerHTML = "&nbsp;";
}

function addLineNumber(html){
	if (!showLineNumber)return;
	var s = "";
	var cnt = 0;
	var j = 0;
	while (html.indexOf("<br",j)>=0){
		cnt+=1;
		j = html.indexOf("<br",j) + 3;
	}
	for (var i=1;i<cnt+1;i++){
		s += i+"<br>";
	}
	
	f = window.activeEditor._frame;
	if (browser.IE){
		if (f.documentElement && f.documentElement.clientWidth) {
			h = f.documentElement.clientHeight;
		} else {
			h = f.body.clientHeight;
		}
	} else {
		if (f.compatMode=='CSS1Compat') {
			h = f.documentElement.clientHeight;
		} else {
			h = f.body.clientHeight;
		}
	}

	document.getElementById("containerLineNumber").style.height = h+"px";
	document.getElementById("containerLineNumber").style.width = "20px";	
	document.getElementById("lineNumber").innerHTML = s;
}

function scrollLineBar(){

	f = window.activeEditor._frame;
	if (browser.IE){
		if (f.documentElement && f.documentElement.clientWidth) {
			h = f.documentElement.scrollTop;
		} else {
			h = f.body.scrollTop;
		}
	} else {	
		if (f.compatMode=='CSS1Compat'){
			t = f.documentElement.scrollTop;
		} else {
			t = f.body.scrollTop;
		}
	}
		
	document.getElementById("lineNumber").style.top = (-1.0*t)+"px";
	
}


var ieRange = function()
{
	this.Name = 'ieRange' ;
	this.startOffset = -1;
	this.startContainer = null;
};

ieRange.prototype._getStartContainer = function(textRange) {

	var element = textRange.parentElement();
	var range = window.activeEditor._frame.body.createTextRange();
	range.moveToElementText(element);
	range.setEndPoint("EndToStart", textRange);
	var rangeLength = range.text.length;

	// Choose Direction
	if(rangeLength < element.innerText.length / 2) {
		var direction = 1;
		var node = element.firstChild;
	} else {
		direction = -1;
		node = element.lastChild;
		range.moveToElementText(element);
		range.setEndPoint("StartToStart", textRange);
		rangeLength = range.text.length;
	}

	// Loop through child nodes
	while(node) {
		
		switch(node.nodeType) {
			case 3:
				nodeLength = node.data.length;
				if(nodeLength < rangeLength) {
					var difference = rangeLength - nodeLength;
					if(direction == 1) range.moveStart("character", difference);
					else range.moveEnd("character", -difference);
					rangeLength = difference;
				}
				else {
					if(direction == 1) {
						this.startOffset = rangeLength;
						this.startContainer = node.previousSibling;
						return node;
					} else {	
						this.startOffset = nodeLength - rangeLength;
						this.startContainer = node;
						return node;
					}	
				}
				break;

			case 1:
				nodeLength = node.innerText.length;
				if (!nodeLength && node.tagName.toLowerCase()=="br")nodeLength = 2;
				if(direction == 1) range.moveStart("character", nodeLength);
				else range.moveEnd("character", -nodeLength);
				rangeLength = rangeLength - nodeLength;
				break;
		}
	
		if(direction == 1) node = node.nextSibling;
		else node = node.previousSibling;
	}

	// The TextRange was not found. Return a reasonable value instead.
	this.startOffset = 0;
	this.startContainer = element;
	return element;
	
}
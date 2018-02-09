// Info: FontColor and Highlight classes
 
var ColorCommand = function(menu){
	this.Name = "colormenu";
}

ColorCommand.prototype.execute = function(parentEl,offsetY){
	var p = document.getElementById("colormenu");
	this.oColorMenu = this.oItem
	with (p.style){
		visibility="visible"
		var e = parentEl;
		zIndex=zIndex+100;
		wh = (document.all)?document.body.clientHeight:window.innerHeight;
		left = this.getLeft(e);
		top = this.getTop(e) + e.offsetHeight-1;
		tp = this.getTop(e) + e.offsetHeight-1;
		btm = p.offsetTop*1 + p.offsetHeight*1;
		if (btm > wh)top = tp+(wh-btm)-2;
	}
	
	var f = p.firstChild;
	f.className="colorpopupcontainer";	
}

ColorCommand.prototype.getMode = function(){
	return OFF;
}

ColorCommand.prototype.getLeft = function(e)
{
    var nLeftPos = e.offsetLeft;
    var eParElement = e.offsetParent;
    while (eParElement != null)
    {                                       
        nLeftPos += eParElement.offsetLeft; 
        eParElement = eParElement.offsetParent;
    }
    return nLeftPos;
}

ColorCommand.prototype.getTop = function(e)
{
    var nTopPos = e.offsetTop;
    var eParElement = e.offsetParent;
    while (eParElement != null)
    {                                       
        nTopPos += eParElement.offsetTop;
        eParElement = eParElement.offsetParent;
    }
    return nTopPos;
}

// FontcolorCommand
var FontColorCommand = function(){
	this.Name = "forecolor";
}

FontColorCommand.prototype.execute = function(pStr,range){
	try{
	var p = pStr?pStr:null;
	if (range) range.execCommand( this.Name, false, p );
	else window.activeEditor._frame.execCommand( this.Name, false, p );
	} catch(e){}
	window.activeEditor.Focus();
}

FontColorCommand.prototype.getMode = function(){
	try
	{
		if ( !window.activeEditor._frame.queryCommandEnabled( this.Name ) )
			return DISABLED ;
		else
			return window.activeEditor._frame.queryCommandState( this.Name ) ? ON : OFF ;
	}
	catch ( e )
	{
		return OFF ;
	}
}


// HighlightCommand
var HighlightCommand = function(){
	if (browser.NS)this.Name = "hilitecolor";
	else this.Name = "BackColor";
}

HighlightCommand.prototype.execute = function(pStr,range){
	try{
	var p = pStr?pStr:null;
	if (range) range.execCommand( this.Name, false, p );
	else window.activeEditor._frame.execCommand( this.Name, false, p );
	} catch(e){}
	window.activeEditor.Focus();
}

HighlightCommand.prototype.getMode = function(){
	try
	{
		if ( !window.activeEditor._frame.queryCommandEnabled( this.Name ) )
			return DISABLED ;
		else
			return window.activeEditor._frame.queryCommandState( this.Name ) ? ON : OFF ;
	}
	catch ( e )
	{
		return OFF ;
	}
}


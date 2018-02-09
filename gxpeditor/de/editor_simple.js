// Name: Editor class for simple browser

var Editor = function( instanceName, width, height, skinName)
{
	window.activeEditor	= this;
	
	// Properties
	this.InstanceName	= instanceName ;
	this.Value			= '' ;
	this.Width			= width;
	this.Height			= height;
	this.skinName		= skinName ;
}

Editor.prototype.setInitialValue = function(){
	var h1 = parent.document.getElementById(window.activeEditor.InstanceName+"table").offsetHeight;
	var h2 = document.getElementById(window.activeEditor.InstanceName+"_t1").offsetHeight;
	document.getElementById(window.activeEditor.InstanceName+"_ta").style.height = (h1-h2-5)+"px";
	try {
	document.getElementById(this.InstanceName+"_ta").focus();
	} catch(e){}
}

Editor.prototype.writeContentWithCSS = function(){
	var h = parent.document.getElementById(name+"_input").value;
	document.getElementById(this.InstanceName+"_ta").value=h;
}

function savehtmlcoder(o){
	parent.document.getElementById(window.activeEditor.InstanceName+"_html").value = o.value;
}	
Editor.prototype.Create = function()
{
	var htmlstr = '<div id="' + this.InstanceName + '_t1'+'" class=wrongBrowserErr>'+parent.wrongBrowserErr+'</div>';
	htmlstr+= '<textarea onBlur="javascript:savehtmlcoder(this);" id="' + this.InstanceName + '_ta'+'" style="width:100%;height:100%"></textarea>';
	document.write(htmlstr);
}
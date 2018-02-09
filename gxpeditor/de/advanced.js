// ~~~~~~~~~~~~~~~~~~~~~~~~ Advanced classes ~~~~~~~~~~~~~~~~~~~~~~~~

// Name: Style combo class
// Info: Combo component with styles.

var StyleCombo = function( commandName, label, classname)
{
	this.Command	= commandName ;
	this.Label		= label ? label : commandName ;
	this.Tooltip	= this.Label;
	this.Width		= width;
	this.Items		= new Array();
	this.classname = classname;
	this.collapsed	= true;
}

StyleCombo.prototype.Redraw = function( parentToolbar ){
	var list = this.SelectElement.Combo.ComboList;
	if (!this.SelectElement.Combo.collapsed){
		list.style.top = "0px";
		list.style.left = "0px";
		list.style.visibility = "hidden";
		this.SelectElement.Combo.collapsed = true;
	}	

	// fill item list from styles
	window.activeEditor.doStyles();
	this.Items = new Array();
	for (i=0;i<window.activeEditor.Styles.length;i++){
		this.Items[i] = window.activeEditor.Styles[i];
	}
		
		
	// combo lists
	combolist = this.ComboList;
	var opt='<table unselectable="on" cellspacing="0" cellpadding="2" border="0px">';
	for (i=0;i<this.Items.length;i++){
		var add_style = '<span unselectable="on" '+((combostyle_flag)?'style="'+window.activeEditor.cssText[i]+'">':">")+this.Items[i] + '</span>';
		opt=opt+'<tr><td unselectable="on" class="Combo_head" onclick=\'javascript:ComboOnChange("'+this.Command+'","'+this.Items[i]+'")\' onmouseout=\'javascript:this.className="combolist_item"\' onmouseover=\'javascript:this.className="combolist_item_highlight"\'><span style="padding-left:3px;" unselectable="on"> '+add_style+'</span></td></tr>';
	}
	opt+='<tr><td><hr/ noshade size=1></td></tr>';
	opt+='<tr><td unselectable="on" class="Combo_head" onclick=\'javascript:ComboOnChange("'+this.Command+'","")\' onmouseout=\'javascript:this.className="combolist_item"\' onmouseover=\'javascript:this.className="combolist_item_highlight"\'><span style="padding-left:3px;" unselectable="on">Remove Style</span></td></tr>';	

	opt+="</table></div>";
	combolist.innerHTML=opt;
	
	ae = window.activeEditor;

	// if style is selected
	var sel = ae.GetSelectedElement();
	if (!sel) sel = ae.firstParentNode();
	if (!sel) return true;
	if (browser.IE)	sel = sel.getAttribute("className");
		else sel = sel.getAttribute("class");
		
	var find=false;
	for (var i=0;i<this.Items.length;i++){
		if (sel == this.Items[i]){find=true;sValue=this.Items[i];break;}
	}
	if(!find)sValue=null;

	if(sValue)this.Head.innerHTML = sValue;
		else this.Head.innerHTML = "Styles";
}

StyleComboOnClick = function(){
	if (!window.activeEditor.editable)return;
	closePrevCombo();
	window.activeEditor.Focus();
	var list = this.Combo.ComboList;
	var c = this.Combo.SelectElement;
	var pos = new Position();
	var left = pos.getLeft(c);
	var top = pos.getTop(c)+c.offsetHeight;
	if(list.offsetWidth < c.offsetWidth){
		list.style.width = c.offsetWidth+20;
		list.firstChild.style.width = c.offsetWidth+20;
	} else {
		list.firstChild.style.width = c.offsetWidth+20;	
	}
		
	if (this.Combo.collapsed){
		list.style.top = top;
		list.style.left = left;
		list.style.visibility = "visible";
		this.Combo.collapsed = false;
	} else {
		list.style.top = "0px";
		list.style.left = "0px";
		list.style.visibility = "hidden";
		this.Combo.collapsed = true;
	}	
	last_combo = this.Combo;
}


StyleComboOnChange = function(command,name){
	var oCommand = window.activeEditor.commands.getCommand(command)
	oCommand.execute(name);
}

StyleCombo.prototype.CreateInstance = function( parentToolbar )
{
	var d = clone.cloneNode(false);
	this.maindiv = d;
	
	// fill item list from styles
	window.activeEditor.doStyles();
	for (i=0;i<window.activeEditor.Styles.length;i++){
		this.Items[i] = window.activeEditor.Styles[i];
	}
		
	// combo lists
	var combolist = document.createElement("div");
	combolist.id = this.Command+"combolist";
	combolist.className = "combolist";
	combolist.style.left = "0px";
	combolist.style.top = "0px";		
	var opt='<table unselectable="on" cellspacing="0" cellpadding="2" border="0">';
	for (i=0;i<this.Items.length;i++){
		var add_style = '<span unselectable="on" '+((combostyle_flag)?'class="'+this.Items[i]+';">':">")+this.Items[i] + '</span>';
		opt=opt+'<tr><td unselectable="on" class="Combo_head" onclick=\'javascript:ComboOnChange("'+this.Command+'","'+this.Items[i]+'")\' onmouseout=\'javascript:this.className="combolist_item"\' onmouseover=\'javascript:this.className="combolist_item_highlight"\'><span style="padding-left:3px;" unselectable="on"> '+add_style+'</span></td></tr>';
	}
	opt+='<tr><td><hr/ noshade size=1></td></tr>';
	opt+='<tr><td unselectable="on" class="Combo_head" onclick=\'javascript:ComboOnChange("'+this.Command+'","")\' onmouseout=\'javascript:this.className="combolist_item"\' onmouseover=\'javascript:this.className="combolist_item_highlight"\'><span style="padding-left:3px;" unselectable="on">Remove Style</span></td></tr>';	

	opt+="</table></div>";
	combolist.innerHTML=opt;
	document.body.appendChild(combolist);
	this.ComboList = combolist;
	
	// select element
        d.innerHTML = '<div title="' + this.Tooltip + '"  unselectable="on" class="'+this.classname+'" onmouseover=\'javascript:this.className="' +
					this.classname+ ' ComboOver"\' onmouseout=\'javascript:this.className="' + 
					this.classname+ '"\'>'+
					'<table width="100%" cellspacing="0" cellpadding="0" border="0" unselectable="on">' +
					'<tr><td unselectable="on" class="Combo_head" width="100%"><span unselectable="on" style="margin:1px">' +
					'Styles'+ '</span></td>' +
					'<td ><div unselectable="on" class="combo_drop"></div></td>'+
                '</tr></table></div>';

        // Gets the SELECT element.
        this.SelectElement = d.firstChild;
        this.Head = d.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;

	this.SelectElement.id  = garbage.generateId();
	garbage.add(this.SelectElement.id);

	this.SelectElement.Combo = this ;

	this.SelectElement.onclick = StyleComboOnClick;
	this.SelectElement.onchange = StyleComboOnChange;
	//this.SelectElement.onfocus = StyleComboOnFocus;

	var oCell = parentToolbar.DOMRow.insertCell(-1) ;
	oCell.appendChild( d ) ;
	this.cDiv = d;
}

// Name: Table commands
// Info: All commands from tables popup menu

// Insert Column to the Right

var InsertColumnRight = function(name){
	this.Name = "insertcolumnright";
}

InsertColumnRight.prototype.execute = function(){
	var oCell = window.activeEditor.parentNode("TD") ;
	var oTable = Api.GetParent( oCell, 'TABLE' ) ;
	var iIndex = oCell.cellIndex + 1 ;
	for ( var i = 0 ; i < oTable.rows.length ; i++ )	{
		var oRow = oTable.rows[i] ;	
		if ( oRow.cells.length < iIndex ) continue ;
		oCell = window.activeEditor._frame.createElement('TD') ;
		oCell.innerHTML = '&nbsp;' ;
		var oBaseCell = oRow.cells[iIndex] ;	
		if ( oBaseCell ){
			oRow.insertBefore( oCell, oBaseCell ) ;
		} else {	
			oRow.appendChild( oCell ) ;
		}	
	}
	buffer[window.activeEditor.mode].saveHistory();
}

InsertColumnRight.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}


// Insert Column to the Left
var InsertColumnLeft = function(name){
	this.Name = "insertcolumnleft";
}

InsertColumnLeft.prototype.execute = function(){
	var oCell = window.activeEditor.parentNode("TD") ;
	var oTable = Api.GetParent( oCell, 'TABLE' ) ;
	var iIndex = oCell.cellIndex ;
	for ( var i = 0 ; i < oTable.rows.length ; i++ )	{
		var oRow = oTable.rows[i] ;	
		if ( oRow.cells.length < iIndex )			continue ;	
		oCell = window.activeEditor._frame.createElement('TD') ;
		oCell.innerHTML = '&nbsp;' ;
		var oBaseCell = oRow.cells[iIndex] ;	
		if ( oBaseCell ){
			oRow.insertBefore( oCell, oBaseCell ) ;
		} else {	
			oRow.appendChild( oCell ) ;		
		}	
	}
	buffer[window.activeEditor.mode].saveHistory();	
}

InsertColumnLeft.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Delete Row
var DeleteRow = function(name){ 
	this.Name = "deleterow";
}

DeleteRow.prototype.execute = function() {
	row = window.activeEditor.parentNode("TR") ;
	row.parentNode.removeChild( row ) ;
	buffer[window.activeEditor.mode].saveHistory();	
}

DeleteRow.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Delete Column
var DeleteColumn = function(){ 
	this.Name = "deletecolumn";
}

DeleteColumn.prototype.execute = function(){

	var cell = window.activeEditor.parentNode("TD") ;	
	var table = Api.GetParent( cell, 'TABLE' ) ;
	var index = cell.cellIndex ;	
	
	for ( var i = table.rows.length - 1 ; i >= 0 ; i-- ){
		var row = table.rows[i] ;	
		if ( row.cells[index] )			
			row.removeChild( row.cells[index] ) ;	
	}
	buffer[window.activeEditor.mode].saveHistory();
}

DeleteColumn.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Increase Column Span
var IncreaseColumnSpan = function(){ 
	this.Name = "increasecolumnspan";
}

IncreaseColumnSpan.prototype.execute = function(){
	var cell = window.activeEditor.parentNode("TD") ;	
	var table = Api.GetParent( cell, 'TABLE' ) ;
	var index = cell.cellIndex + 1 ;
	var row = window.activeEditor.parentNode("TR") ;	
	if ( row.cells.length <= index ) return ;
	var nextcell = row.cells[index] ;	
	if ( nextcell )row.removeChild( nextcell);
	cell.colSpan+=1;
	buffer[window.activeEditor.mode].saveHistory();	
}

IncreaseColumnSpan.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Decrease Column Span
var DecreaseColumnSpan = function(){ 
	this.Name = "decreasecolumnspan";
}

DecreaseColumnSpan.prototype.execute = function(){
	var cell = window.activeEditor.parentNode("TD") ;	
	var row = window.activeEditor.parentNode("TR") ;	
	var table = Api.GetParent( cell, 'TABLE' ) ;
	if (cell.colSpan>1){
		cell.colSpan-=1;
		var index = cell.cellIndex ;
		newcell = row.insertCell( index + 1 )
		if (newcell) newcell.innerHTML="&nbsp;"
		buffer[window.activeEditor.mode].saveHistory();		
	}	
}

DecreaseColumnSpan.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Insert Row Above
var InsertRowAbove = function()
{
	this.Name = "insertrowabove";
}

InsertRowAbove.prototype.execute = function(){

	var row = window.activeEditor.parentNode("TR") ;	
	var newrow = row.cloneNode( true ) ;	
	row.parentNode.insertBefore( newrow, row ) ;
	var cells = newrow.cells ;	
	for ( var i = 0 ; i < cells.length ; i++ ) {
		cells[i].innerHTML = '&nbsp;' ;	
	}
	buffer[window.activeEditor.mode].saveHistory();	
}

InsertRowAbove.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Insert Row Below
var InsertRowBelow = function()
{
	this.Name = "insertrowbelow";
}

InsertRowBelow.prototype.execute = function(){

	var row = window.activeEditor.parentNode("TR") ;
	var newrow = row.cloneNode( true ) ;	
	row.parentNode.insertBefore( newrow, row ) ;	
	var cells = row.cells ;	

	for ( var i = 0 ; i < cells.length ; i++ ) 	{
		cells[i].innerHTML = '&nbsp;' ;	
	}
	buffer[window.activeEditor.mode].saveHistory();
}

InsertRowBelow.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Increase Row Span
var IncreaseRowSpan = function(){ 
	this.Name = "increaserowspan";
}

IncreaseRowSpan.prototype.execute = function(){
	var cell = window.activeEditor.parentNode("TD") ;	
	var table = Api.GetParent( cell, 'TABLE' ) ;
	var index = cell.cellIndex ;
	var row = window.activeEditor.parentNode("TR") ;
	var indexrow = row.rowIndex+1;
		
	for (var i=0; i<index ;i++){
		if (table.rows[indexrow-1].cells[i].rowSpan && table.rows[indexrow-1].cells[i].rowSpan>1)index--;
	}
	
	var nextrow = table.rows[indexrow];
	if (!nextrow ) return ;
	var nextcell = nextrow.cells[index] ;	
	if (!nextcell) return;
	nextrow.removeChild( nextcell);
	cell.rowSpan+=1;
	buffer[window.activeEditor.mode].saveHistory();
}

IncreaseRowSpan.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

// Decrease Row Span
var DecreaseRowSpan = function(){ 
	this.Name = "decreaserowspan";
}

DecreaseRowSpan.prototype.execute = function(){
	var cell = window.activeEditor.parentNode("TD") ;	
	if(cell.rowSpan<2)return;
	var table = Api.GetParent( cell, 'TABLE' ) ;
	var index = cell.cellIndex ;
	var row = window.activeEditor.parentNode("TR") ;
	var indexrow = row.rowIndex+cell.rowSpan-1;
	var nextrow = table.rows[indexrow];
	if (!nextrow ) return ;
	
	var nextcell = window.activeEditor._frame.createElement("TD");
	nextcell.innerHTML="&nbsp;";

	if (table.rows[indexrow].cells[index]){
		nextrow.insertBefore( nextcell, table.rows[indexrow].cells[index]);
	} else {
		nextrow.appendChild( nextcell );
	}	
	
	cell.rowSpan-=1;
	buffer[window.activeEditor.mode].saveHistory();
}

DecreaseRowSpan.prototype.getMode = function(){
	if (Selection.parentNode("TABLE"))return OFF;
	else return DISABLED;
}

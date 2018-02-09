<html>
<head>
<style>
.cell{
	border : 1px solid #698aff;
	position : absolute;	
}
#m{
	border : 1px solid #698aff;
	background-color:#91a0ff;
	color:white;
	width:auto;
	height:auto;
	text-align:center;
	font-size: 16px;
	padding: 5px
	font-family: Tahoma,Verdana,Arial;
	position : absolute;
	left:50px;
	top:50px;
}
</style>
<script language=JavaScript>
loaded = false;
d 	= document;
ae 	= window.opener.activeEditor;
aed = ae._frame;

cell_width=30;
cell_height=30;
rows = 1;
cols = 1;

document.onclick = function(){
	InsertTable();
}

document.onmousemove = function(e){
	if (!loaded) return;
	window.status = "Move mouse to change table's dimension!"
	if (!e) e = window.event;
	if (!e)return;
	var x = e.clientX;
	var y = e.clientY;
	showTable(x, y);
}

var dx = document.createElement("DIV");
			
function init() {
	loaded = true;
}
			
function showTable(x, y ) {
	new_rows = Math.floor(y/cell_height);
	new_cols = Math.floor(x/cell_width);

	if (new_cols==cols && new_rows==rows)return;
	
	if (new_rows == 0 ){
		new_rows = 1;
		return;
	}	

	if (new_cols == 0 ){
		new_cols = 1;
		return;
	}	

	if (new_cols>cols){
		var s = "";
		for (var i=cols;i<new_cols;i++){
			if (document.getElementById("col_"+i))continue;
			var d = dx.cloneNode(false);
			d.id = "col_"+i;
			d.className="cell";
			d.style.height = (new_rows*cell_width)+"px";
			d.style.width = cell_width+"px";
			d.style.top ="0px";
			d.style.left =(i*cell_width)+"px";
			document.body.appendChild(d);
		}

	}

	if (new_cols<cols){
		for (var i=cols;i>=new_cols;i--){
			var d = document.getElementById("col_"+i);
			if (d)document.body.removeChild(d);
		}
	}
	
	for (var j=0;j<new_rows;j++){
		var d = document.getElementById("row_"+j);
		if(d)d.style.width = (cell_width*new_cols)+"px";
	}
	
	if (new_rows>rows){
			for (var i=rows;i<new_rows;i++){
			if (document.getElementById("row_"+i))continue;
			var d = dx.cloneNode(false);
			d.id = "row_"+i;
			d.className="cell";
			d.style.height = cell_height+"px";
			d.style.width = (new_cols*cell_width)+"px";
			d.style.top =(i*cell_height)+"px";
			d.style.left = "0px";
			document.body.appendChild(d);
		}
		
	}

	if (new_rows<rows){
		for (var i=rows;i>=new_rows;i--){
			var d = document.getElementById("row_"+i);
			if(d)document.body.removeChild(d);
		}
	}
	
	for (var j=0;j<new_cols;j++){
		var d = document.getElementById("col_"+j);
		if(d)d.style.height = (cell_height*new_rows)+"px";
	}
	
	showMessage(new_cols, new_rows,x,y);
	cols = new_cols;	
	rows = new_rows;
        			
}


function showMessage(c,r,x,y) {
	var d = document.getElementById("m")
	d.innerHTML=r+" x "+c
	d.style.left=(x+10)+"px";
	d.style.top=(y+10)+"px";
	d.style.visibility="visible";
}

function writeTable( ) {
	var d = dx.cloneNode(false);
	d.id = "col_0";
	d.className="cell";
	d.style.height = cell_height+"px";
	d.style.width = cell_width+"px";
	d.style.top ="0px";
	d.style.left = "0px";
	document.body.appendChild(d);

	var d = dx.cloneNode(false);
	d.id = "row_0";
	d.className="cell";
	d.style.height = cell_height+"px";
	d.style.width = cell_width+"px";
	d.style.top ="0px";
	d.style.left = "0px";
	document.body.appendChild(d);
	
}

function InsertTable() {
	HTMLTable = "<table>";
	for (i=0; i<rows; i++) {
		HTMLTable = HTMLTable + "<tr>";
		for (j=0; j<cols; j++) {
			HTMLTable = HTMLTable + "<td>&nbsp;</td>";
		}
		HTMLTable = HTMLTable + "</tr>";
	}
        			
	HTMLTable = HTMLTable + "</table>";
	window.opener.activeEditor._inserthtml(HTMLTable);
	window.close();
}

</script>
<title>[sTxtInsertTable]</title>
</head>
<body onload="init()" style="background-color:#efffc1" topMargin=0 leftMargin=0><div id="m">Move mouse to change table's dimension. </div><script>writeTable()</script></body>
</html>
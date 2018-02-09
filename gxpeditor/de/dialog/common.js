// Link command
function insertlink(){
	var l = document.getElementById('url').value;
	window.opener.activeEditor._frame.execCommand( 'CreateLink', false, l);
	closewindow();
}

// common
function closewindow(){
	window.close();
}
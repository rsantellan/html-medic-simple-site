// debug module 
var debug_window = parent.document.createElement("div");
debug_window.style.position = "absolute";
debug_window.style.backgroundColor = "white";
debug_window.style.top		= "100px";
debug_window.style.left		= "500px";
debug_window.style.width	= "200px";
debug_window.style.height	= "400px";
debug_window.style.border	= "2px solid black";
debug_window.style.fontFamily	= "Vernada";
debug_window.style.fontSize	= "12px";
var dbg_cnt = 0
parent.document.body.appendChild(debug_window);

function trace(data){
	if (data=="xxx"){debug_window.innerHTML = "";data="";}

	debug_window.innerHTML += data + "<br>";
	dbg_cnt+=1;
}

function traceHTML(data){
	if (data=="xxx"){debug_window.innerHTML = "";data="";}

	data = data.replace(/</gi,"&lt;");
	data = data.replace(/>/gi,"&gt;");
		
	debug_window.innerHTML += data + "<br>";
	dbg_cnt+=1;
}
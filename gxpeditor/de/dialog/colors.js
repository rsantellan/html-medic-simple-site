// variabless - do not change
var myColor;
var d = document;
var drag = 0;
var dragslider = 0;
var br = 100;
var h = 360;
var s = 100;
var cBlack = new color();
var slider_width = 9;
var ie = document.all;

// color class
function color(r,g,b){
	var c = new Object();
	c.r = r||0;
	c.g = g||0;
	c.b = b||0;
	return c;
}

// start drag
function drags(e){
	drag = 1;
	if (!ie){
		e.stopPropagation();
		e.preventDefault();
	}	
	return false;
}
function dragSlider(e){
	dragslider = 1;
	if (!ie){
		e.stopPropagation();
		e.preventDefault();
	}	
	return false;	
}

function clickOnGrad(evt){
	var e = (evt)?evt:window.event;
	var x = (e.clientX - getLeft(d.getElementById('gradline')))*1.0;
	if (x>199||x<0)return false;
	br = (x/200)*100;
	d.getElementById("vSlider").style.left = (x-Math.round(slider_width/2)) +"px";
	setColor();
	setBrightness();
}

function setBrightness(){
	var cImg = d.getElementById('colorImg');
	if (ie)cImg.style.filter="alpha(opacity="+br+");";
	else cImg.setAttribute("style","-moz-opacity: "+(br/100)+";");
}

function init(){
	var cimg = d.getElementById('colorImg');
	var leftpos = getLeft(cimg);
	var toppos = getTop(cimg);

	myColor = new Object();
	myColor.r = 255;
	myColor.g = 255;
	myColor.b = 255;
	d.getElementById("rBox").value = myColor.r;
	d.getElementById("gBox").value = myColor.g;
	d.getElementById("bBox").value = myColor.b;
	d.getElementById("hexBox").value = rgb2hex(myColor.r,myColor.g,myColor.b);
	d.getElementById("colorBox").style.backgroundColor = rgb2hex(myColor.r,myColor.g,myColor.b);

	d.getElementById("cursorImg").style.left = (leftpos)+"px";
	d.getElementById("cursorImg").style.top = (toppos+200)+"px";	

	d.getElementById("vSlider").style.left = (200-Math.round(slider_width/2)) +"px";
	d.getElementById("vSlider").style.cursor="pointer";
			
	document.onmousemove= function(evt){
	var e = (evt)?evt:window.event;
	if (drag){
		doColor(e);
		d.getElementById("cursorImg").style.cursor="default";
	}
	if (dragslider){
		clickOnGrad(e);
		d.getElementById("vSlider").style.cursor="pointer";
	}
	return false;
	}

	document.ondragstart=function (){event.returnValue=false; return false;}
	
	document.onclick=function(){
		if (drag||dragslider){
			drag=0;
			dragslider=0;
		}
	}
	setGr(cBlack,myColor);
}

function setGr(c1,c2){
	var width = 199;
	var height = 14;
	var num = width;
	var gs = (c2.g-c1.g)/num;
	var bs = (c2.b-c1.b)/num;
	var rs = (c2.r-c1.r)/num;
	var html="";
	var n = new color(c1.r,c1.g,c1.b);
	var first = 1;
	if (document.getElementById('gradline').firstChild) {
		var node=document.getElementById('gradline').firstChild;
		first=0;
	}	
	for(i=0;i<=num-1;i++) {
		if (first){
			html+= '<span style="background-color:#'+rgb2hex(n.r,n.g,n.b)+';width:1px;">'
			html+='<img src="images/1x1.gif" width="1px" height="14px"></span>'
		} else {
			node.style.backgroundColor="#"+rgb2hex(n.r,n.g,n.b);
			node=node.nextSibling;
		}
			
		n.r+=rs;
		n.g+=gs;
		n.b+=bs;
	}
	if (first)document.getElementById('gradline').innerHTML = html;
}

function setfirstGr(c1,c2){
}

function doRGB(){
	checkColors();
	r = d.getElementById("rBox").value;
	g = d.getElementById("gBox").value;
	b = d.getElementById("bBox").value;
	d.getElementById("hexBox").value = rgb2hex(r,g,b);
	var  a = new color(r,g,b);
	d.getElementById("colorBox").style.backgroundColor = rgb2hex(a.r,a.g,a.b);
	setGr(cBlack,a)
	updateColor();
}

function checkInputRGB(o,evt){
	var e = evt?evt:window.event;
	if((e.keyCode>=49)&&(e.keyCode<=57)||(e.keyCode>=37)&&(e.keyCode<=40)||(e.keyCode==8)||(e.keyCode==46)){
		e.returnValue = true;
		return true;
	}	
	else {
		e.returnValue = false;	
		return false;
	}	
}

function checkInputHex(o,evt){
	var e = evt?evt:window.event;
	if(((e.keyCode>=49)&&(e.keyCode<=57))||(e.keyCode>=37)&&(e.keyCode<=40)||((e.keyCode>=65)&&(e.keyCode<=70))||(e.keyCode==8)||(e.keyCode==46)){
		e.returnValue = true;
		return true;
	}	
	else {
		e.returnValue = false;	
		return false;
	}	
}

function checkColor(c){
	if (c.value*1.0>255)c.value=255;	
	if (c.value*1.0<0)c.value=0;

}
function checkColors(){
	checkColor(d.getElementById("rBox"));
	checkColor(d.getElementById("gBox"));
	checkColor(d.getElementById("bBox"));		
}

function HexToRGB(cl){
	checkColors();
	var a = new color();
	a = hex2rgb(cl);
	d.getElementById("rBox").value = a.r;
	d.getElementById("gBox").value = a.g;
	d.getElementById("bBox").value = a.b;
	d.getElementById("colorBox").style.backgroundColor = rgb2hex(a.r,a.g,a.b);
	setGr(cBlack,a)
	updateColor();
}

function doColor(evt){
	var e = (evt)?evt:window.event;
	var o = d.getElementById("colorImg");

	var x = e.clientX - getLeft(o);
	var y = e.clientY - getTop(o);
	if(x<0||y<0||x>200||y>200){
		drag=0;
		return;
	}	
	h = (x/200)*360;
	s = ((200-y)/200)*100;
	setColor()
	d.getElementById("cursorImg").style.left = (e.clientX-5)+"px";
	d.getElementById("cursorImg").style.top = (e.clientY-5)+"px";	
}

function setColor(){
	var a = hsb2rgb(h,s,br)
	d.getElementById("rBox").value = a.r;
	d.getElementById("gBox").value = a.g;
	d.getElementById("bBox").value = a.b;
	d.getElementById("hexBox").value = rgb2hex(a.r,a.g,a.b);
	d.getElementById("colorBox").style.backgroundColor = rgb2hex(a.r,a.g,a.b);
	setGr(cBlack,a)
}

function updateColor(){
	r = d.getElementById("rBox").value;
	g = d.getElementById("gBox").value;
	b = d.getElementById("bBox").value;
	var a = new color(r,g,b);
	var hsb_c = rgb2hsb(r,g,b);
	h = hsb_c.h; s = hsb_c.s; br = hsb_c.b;
	var o = d.getElementById("colorImg");
	var x = getLeft(o);
	var y = getTop(o);
	d.getElementById("cursorImg").style.left = (Math.round(x+(h/360)*200)-5)+"px";
	d.getElementById("cursorImg").style.top = (Math.round(y+(s/100)*200)-5)+"px";	
	d.getElementById("vSlider").style.left = Math.round((br/100)*200-slider_width/2) +"px";	
}

function getLeft(e)
{
    var nLeftPos = e.offsetLeft;
    var eParElement = e.offsetParent;
    while (eParElement != null) {                                
        nLeftPos += eParElement.offsetLeft; 
        eParElement = eParElement.offsetParent;
    }
    return nLeftPos;
}

function getTop (e)
{
    var nTopPos = e.offsetTop;
    var eParElement = e.offsetParent;
    while (eParElement != null) {                                       
        nTopPos += eParElement.offsetTop;
        eParElement = eParElement.offsetParent;
    }
    return nTopPos;
}

// convert colr function
function rgb2hex(r,g,b){
	var sR = Math.round(r).toString(16);
	var sG = Math.round(g).toString(16);
	var sB = Math.round(b).toString(16);
	if (sR.length == 1) sR = "0" + sR.toUpperCase();
	if (sG.length == 1) sG = "0" + sG.toUpperCase();
	if (sB.length == 1) sB = "0" + sB.toUpperCase();
	return sR+sG+sB;
}

function hex2rgb(cl)
{
	var c = new color();
    var hexStr = "" + cl;
    if (hexStr.length == 6) {
       c.r = parseInt("0x" + hexStr.substring(0, 2));
       c.g = parseInt("0x" + hexStr.substring(2, 4));
       c.b = parseInt("0x" + hexStr.substring(4, 6));
    }
    return c;
}

function hsb2rgb(h,s,b)
{
        r=hsb2color(h,s,b,240);
        g=hsb2color(h,s,b,0);
        b=hsb2color(h,s,b,120);
        m=Math.max(Math.max(r,g),b);
        var rgb = new Object();
        rgb.r=Math.round(m-(m-r)*s/100);
        rgb.g=Math.round(m-(m-g)*s/100);
        rgb.b=Math.round(m-(m-b)*s/100);
        return rgb;
}

function hsb2color(h,s,b,start)
{
	var m = new Array();
    m[0]=start;
    m[1]=(m[0]+60)%360;
    m[2]=(m[0]+180)%360;
    m[3]=(m[0]+240)%360;
    answer=0;
    if (((m[1]<m[2])&&(m[1]<=h)&&(h<=m[2]))||
       ((m[2]<m[1])&&((m[1]<=h)||(h<=m[2]))))
          answer=255*b/100;
    else if (((m[3]<m[0])&&(m[3]<=h)&&(h<=m[0]))||
            ((m[0]<m[3])&&((m[3]<=h)||(h<=m[0]))))
          answer=0*b/100;
    else if (((m[0]<m[1])&&(m[0]<=h)&&(h<=m[1]))||
            ((m[1]<m[0])&&((m[0]<=h)||(h<=m[1]))))
               answer=Math.round(255*b/100*((h-m[0])%360)/60);
    else if (((m[2]<m[3])&&(m[2]<=h)&&(h<=m[3]))||
            ((m[3]<m[2])&&((m[2]<=h)||(h<=m[3]))))
               answer=Math.round(255*b/100*(1-((h-m[2])%360)/60));
    else   alert("error:"+h);
    return answer;
}


function rgb2hsb(iR, iG, iB) {
   var red = new Number(iR);
   var green = new Number(iG);
   var blue = new Number(iB);
   var min = new Number(Math.min(red, green));
   var max = new Number(Math.max(red, green));
   var delta = new Number(0);
   var hue = new Number(0);
   var sat = new Number(0);
   var lumin = new Number(0);
   min = Math.min(min, blue);
   max = Math.max(max, blue);
   delta = (max - min);
   if (max != 0) {
      // calculate saturation &amp; luminence
      sat = delta / max; 
      lumin = max / 255;
      // calculate hue: first, adjustments to fix if(...) errors
         delta = delta+0;
         red = red+0;
         green = green+0;
         blue = blue+0;
      if ( delta != 0 ) {
         if (red==max) {
            hue = (green - blue) / delta;
         } else if (green==max) {
            hue = 2 + ((blue - red) / delta);
         } else {
            hue = 4 + ((red - green) / delta);
         }
      }
      hue = hue * 60;
      if (hue < 0) hue = hue + 360;
   }

   iHue = Math.round(hue);
   iSat = Math.round(sat * 100);
   iLum = Math.round(lumin * 100);
   var hsb_c = new Object();
   hsb_c.h = iHue;
   hsb_c.s = 100-iSat;
   hsb_c.b = iLum;
   return hsb_c;
}
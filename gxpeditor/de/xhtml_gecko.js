// Name: XHTML function
// Info: XHTML function.

function getXHTML(content) {
	content = content.replace(/<br>/gi,"<br/>");
	content = content.replace(/(<img([^>]+)>)/gi,function(s1,s2){return s2.replace(/\/?>/gi,"/>");});
	content = content.replace(/(<input([^>]+)>)/gi,function(s1,s2){return s2.replace(/\/?>/gi,"/>");});
	content = content.replace(/(<param([^>]+)>)/gi,function(s1,s2){return s2.replace(/\/?>/gi,"/>");});
	content = content.replace(/(<embed([^>]+)>)/gi,function(s1,s2){return s2.replace(/\/?>/gi,"/>");});
	return (content);
}
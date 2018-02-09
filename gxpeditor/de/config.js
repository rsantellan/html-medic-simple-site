// Name: Config file
// Info: Contain constants and menu defenition.

// Buttons constants
EXCLUDE		= -2;
DISABLED	= -1;
CHOOSE		= 2;
ON 			= 1;
OFF			= 0;

// CompareHow
START_TO_START  = 0;
START_TO_END    = 1;
END_TO_END      = 2;
END_TO_START    = 3;
// mag tag in the path

_de_max_tag = 15;

// history length
_de_max_history_item = 10;

// Main stylesheet file
var main_css_file = "styles.css";
var style_id = "de_b";
var _de_temp_element = "_de_temp_element";

// DOCTYPE
var _de_doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
var combostyle_flag = false;

// reg expr
var docType_expr	= /(<!doctype[^>]+>)/i ;
var HtmlContents	= /([\s\S]*\<html[^\>]*\>)([\s\S]*)(\<\/html\>[\s\S]*)/i ;
var HtmlContents1	= /([\s\S]*\<html[^\>]*\>)/i ;
var HtmlContents2	= /(\<\/html\>[\s\S]*)/i ;
var InsideBody		= /(<body[^\>]*\>)/i ;
var BodyContents	= /([\s\S]*\<body[^\>]*\>)([\s\S]*)(\<\/body\>[\s\S]*)/i ;
var HeadContents	= /([\s\S]*\<head[^\>]*\>)([\s\S]*)(\<\/head\>[\s\S]*)/i ;
var begin_edit_expr	= /(<!--[#\s]*?(?:Instance|Template|)BeginEditable[^>]+>)/gi;
var end_edit_expr	= /(<!--[#\s]*?(?:Instance|Template|)EndEditable[^>]+>)/gi;
var edit_expr		= /(<!--[#\s\S]*?(?:Instance|Template|)BeginEditable[^>]+>[\s\S]*?<!--[#\s]*?(?:Instance|Template|)EndEditable\s*?-->)/gi;
var wrap_tag_expr	= /(<!--[#\s]*?(?:Instance|Template|)BeginEditable[^\<]+<div\s+id="?de_wrap_div[^>]+>)/gi;
var wrap_end_tag_expr	= /(<\/div><!--[#\s]*?(?:Instance|Template|)EndEditable[^>]+>)/gi;;
var meta_keywords_expr	= /(<meta[^>]+name="?keywords"?[^>]+>)/gi;;
var meta_description_expr	= /(<meta[^>]+name="?description"?[^>]+>)/gi;;
var title_expr	= /(<title>([\s\S]*)<\/title>)/gi;;

// ShortCut Keys: Ctrl + []
ShortCutKeys = [
	["B" , "Bold"],
	["U" , "Underline"],
	["I" , "Italic"],
	["Z" , "Undo"],
	["Y" , "Redo"],
	["D" , "Pastefrommsword"],
	["K" , "CreateLink"],	
	["M" , "Image"],
	["V" , "Paste"]
];

specialKeyCode = [90,89,32,13,46,37,38,39,40];

// Toolbar Buttons Sets
DevEditToolbars  = ['Complete','Simple'];
DevEditToolbarSets = new Array();
DevEditToolbarSets["footer"] = [['GeckoXPConnect','EditorMode']];
DevEditToolbarSets["path"] = [['Path']];
DevEditToolbarSets["_source"] = [
	['Save','Fullscreen','Cut','Copy','Paste','Findreplace','-','UndoSource','RedoSource'],
	[]
];

DevEditToolbarSets["_preview"] = [['Previewlabel']];

DevEditToolbarSets["Complete"] = [
	['Save','Fullscreen','Cut','Copy','Paste','Findreplace','-','Undo','Redo','-','Spellcheck','-','RemoveFormat','-','Bold','Underline','Italic','Strikethrough','-','OrderedList','UnorderedList','Indent','Outdent','-','SubScript','SuperScript','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyFull','-','CreateLink','CreateEmailLink','Anchor','-','Help'],
	['Fontname','Fontsize','Formatblock','Styles','-','Fontcolor','Highlight','-','Table','-','Form','-','Flash','Image','Media','-','Inserttextbox','HR','Insertchars','Pageproperties','Clearcode','Custominsert','Toggleposition','Showborders','Paragraph']
];

DevEditToolbarSets["Simple"] = [
	['Save','Fullscreen','Cut','Copy','Paste','Findreplace','-','Undo','Redo','-','Bold','Underline','Italic','-','OrderedList','UnorderedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyFull','-','CreateLink','-','Fontname','Fontsize','-','Fontcolor','Highlight','-','Image']
];


// Popups
Popups = new Array();

Popups["paste"] = [
	['Paste','Paste	Ctrl+V','paste.gif'],
	['Pastetext','Paste as Plain Text','pastetext.gif'],
	['Pastefrommsword','Paste from MS Word	Ctrl+D','pasteword.gif']
];

Popups["form"] = [
	['Insertform','Insert Form ...','insertform.gif'],
	['Modifyform','Modify Form Properties ...','modifyform.gif'],
	['-','-'],
	['Inserttextfield',	['Insert Text Field ...','Modify Text Field ...'],'inserttextfield.gif'],
	['Inserttextarea',	['Insert Text Area ...','Modify Text Area ...'],'inserttextarea.gif'],
	['Inserthidden',	['Insert Hidden Field ...','Modify Hidden Field ...'],'inserthidden.gif'],
	['Insertbutton',	['Insert Button ...','Modify Button ...'],'insertbutton.gif'],
	['Insertcheckbox',	['Insert Checkbox ...','Modify Checkbox ...'],'insertcheckbox.gif'],
	['Insertradio',		['Insert Radio ...','Modify Radio ...'],'insertradio.gif'],
	['Insertselect',	['Insert Select Field ...','Modify Select Field ...'],'insertselect.gif']
];

Popups["table"] = [
	['Inserttable','Insert Table ...','inserttable.gif'],
	//['Quicktable','Quick Table ...','inserttable.gif'],	
	['Modifytable','Modify Table Properties ...','modifytable.gif'],
	['Modifycell','Modify Cell Properties ...','modifycell.gif'],
	['-','-'],
	['Insertcolumnright','Insert Column to the Right','insertcolumnright.gif'],
	['Insertcolumnleft','Insert Column to the Left','insertcolumnleft.gif'],
	['-','-'],
	['Insertrowabove','Insert Row Above','insertrowabove.gif'],
	['Insertrowbelow','Insert Row Below','insertrowbelow.gif'],
	['-','-'],
	['Deleterow','Delete Row','deleterow.gif'],
	['Deletecolumn','Delete Column','deletecolumn.gif'],
	['-','-'],
	['Increasecolumnspan','Increase Column Span','increasecolumnspan.gif'],
	['Decreasecolumnspan','Decrease Column Span','decreasecolumnspan.gif'],
	['-','-'],
	['Increaserowspan','Increase Row Span','increaserowspan.gif'],
	['Decreaserowspan','Decrease Row Span','decreaserowspan.gif']
];

Popups["contextmenu"] = [
	['Cut','Cut','cut.gif'],
	['Copy','Copy','copy.gif'],
	['Paste','Paste','paste.gif'],
	['Pastetext','Paste as Plain Text','pastetext.gif'],
	['Pastefrommsword','Paste from MS Word','pasteword.gif'],
	['-','-'],
	['Modifytable','Modify Table Properties ...','modifytable.gif','TABLE'],
	['Modifycell','Modify Cell Properties ...','modifycell.gif','TD'],
	['-','-',,'TABLE'],
	['Insertcolumnright','Insert Column to the Right','insertcolumnright.gif','TABLE'],
	['Insertcolumnleft','Insert Column to the Left','insertcolumnleft.gif','TABLE'],
	['-','-',,'TABLE'],
	['Insertrowabove','Insert Row Above','insertrowabove.gif','TABLE'],
	['Insertrowbelow','Insert Row Below','insertrowbelow.gif','TABLE'],
	['-','-',,'TABLE'],
	['Deleterow','Delete Row','deleterow.gif','TABLE'],
	['Deletecolumn','Delete Column','deletecolumn.gif','TABLE'],
	['-','-',,'TABLE'],
	['Increasecolumnspan','Increase Column Span','increasecolumnspan.gif','TABLE'],
	['Decreasecolumnspan','Decrease Column Span','decreasecolumnspan.gif','TABLE'],
	['-','-',,'TABLE'],
	['Increaserowspan','Increase Row Span','increaserowspan.gif','TABLE'],
	['Decreaserowspan','Decrease Row Span','decreaserowspan.gif','TABLE'],
	['-','-',,'TABLE'],	
	['Image','Modify Image Properties...','insertimage.gif','IMG'],
	['CreateLink','Create or Modify Link...','createlink.gif','text|IMG|A'],
	['Flash','Modify Flash Properties...','flash.gif','flash'],
	['Media','Modify Media Properties...','media.gif','media'],
	['-','-',,'text|IMG|A|flash|media'],
	['Spellcheck','Check Spelling...','spellcheck.gif']
];

Popups["spellmenu"] = [
	['AddToDictionary', "Add to Dictionary", 'addtodictionary.gif']
];

Popups["sourcetag"] = [];

useXHTML = true;

mFontname = [
	["Default",""],
	["Arial","Arial"],
	["Verdana","Verdana"],
	["Tahoma","Tahoma"],
	["Courier New","Courier New"],
	["Georgia","Georgia"],
	["-",""],
	["Remove Font",""]
];

mFontsize = [
	["Size 1","8pt","1"],
	["Size 2","10pt","2"],
	["Size 3","12pt","3"],
	["Size 4","14pt","4"],
	["Size 5","18pt","5"],
	["Size 6","24pt","6"],
	["Size 7","36pt","7"],
	["-",""],
	["Remove Size","","3"]
];

mFormatblock = [
	["Normal","<P>"],
	["Heading 1","<H1>"],
	["Heading 2","<H2>"],
	["Heading 3","<H3>"],
	["Heading 4","<H4>"],
	["Heading 5","<H5>"],
	["Heading 6","<H6>"],
	["-",""],
	["Remove Formatting","<P>"]
];

CustomLink = [
	["DevEdit", "http://www.devedit.com"]
];

// tags for source
tag = new Array();

tag["_all"]=["a","address","applet","b","basefont","big","blockquote","br","center","cite","code","dir","div","dl","em","embed","font","form","h1","h2","h3","h4","h5","h6","h7","hr","i","img","input","isindex","kdb","map","menu","nobr","noembed","noframes","noscript","ol","p","pre","s","samp","script","select","small","strike","strong","sub","sup","table","textarea","tt","u","ul","var","wbr"];
tag["_set_a"]=["applet","b","big","br","cite","code","em","embed","font","i","img","input","kdb","map","nobr","s","samp","script","select","small","strike","strong","sub","textarea","u","var","wbr"];
tag["_set_1"] = ["a","applet","b","big","br","cite","code","em","embed","font","i","img","input","kbd","map","nobr","s","samp","script","select","sma;;","strike","strong","sub","sup","textarea","tt","u","var","wbr"];

tag["html"]=[["head","body","frameset"]];
tag["head"]=[["base","meta","script","title"]];
tag["frameset"]=[["frame","frameset","noframes"]];
tag["body"]=["_all"];
tag["table"]=[["caption","tr"]];
tag["tr"]=[["caption","tr"]];
tag["ul"]=[["li","ul"]];
tag["ol"]=[["li"]];
tag["div"]=["_all"];

tag["a"] = ["_set_a"];
tag["address"] = [["a","applet","b","big","br","cite","code","em","embed","i","img","input","kdb","map","nobr","p","s","samp","script","select","small","strike","strong","sub","sup","textarea","tt","u","var","wbr"]];
tag["applet"] = ["_all"];
tag["b"] = [["a","applet","b","big","br","cite","code","em","embed","font","i","img","input","kbd","map","nobr","s","samp","script","select","small","strike","strong","sub","sup","textarea","tt","u","var","wbr"]];
tag["big"] = [["a","applet","b","big","br","cite","code","em","embed","font","i","img","input","kbd","map","nobr","s","samp","script","select","small","strike","strong","sub","sup","textarea","tt","u","var","wbr"]];
tag["basefont"] = ["_all-a-center"];
tag["blockquote"] = ["_all"];
tag["center"] = ["_all"];
tag["cite"] = ["_set_1"];
tag["code"] = ["_set_1"];
tag["dir"] = [["li"]];
tag["dl"] = [["dd","dt"]];
tag["em"] = ["_set_1"];
tag["font"] = ["_set_1"];
tag["form"] = ["_all-center"];
tag["h1"] = ["_set_1"];
tag["h2"] = ["_set_1"];
tag["h3"] = ["_set_1"];
tag["h4"] = ["_set_1"];
tag["h5"] = ["_set_1"];
tag["h6"] = ["_set_1"];
tag["h7"] = ["_set_1"];
tag["i"] = ["_set_1"];
tag["kbd"] = ["_set_1"];
tag["map"] = [["area"]];
tag["menu"] = [["li"]];
tag["nobr"] = ["_set_1"];
tag["noembed"] = ["_all"];
tag["noframes"] = ["_all"];
tag["noscript"] = ["_all"];
tag["ol"] = [["li"]];
tag["p"] = ["_set_1"];
tag["samp"] = ["_set_1"];
tag["select"] = [["option"]];
tag["small"] = ["_set_1"];
tag["strike"] = ["_set_1"];
tag["strong"] = ["_set_1"];
tag["sub"] = ["_set_1"];
tag["sup"] = ["_set_1"];
tag["tt"] = ["_set_1"];
tag["u"] = ["_set_1"];
tag["ul"] = [["li","ul"]];
tag["var"] = ["_set_1"];

var emptyTags = new Array();
emptyTags['br'] = 1;
emptyTags['img'] = 1;
emptyTags['input'] = 1;
emptyTags['hr'] = 1;
emptyTags['link'] = 1;
emptyTags['meta'] = 1;
emptyTags['embed'] = 1;
emptyTags['area'] = 1;
emptyTags['param'] = 1;
emptyTags['base'] = 1;
emptyTags['basefont'] = 1;


var tlb_pos = new Array();
tlb_pos["addtodictionary"] = 0;
tlb_pos["anchor"] = 1;
tlb_pos["bold"] = 2;
tlb_pos["clearcode"] = 3;
tlb_pos["copy"] = 4;
tlb_pos["createemaillink"] = 5;
tlb_pos["createlink"] = 6;
tlb_pos["custominsert"] = 7;
tlb_pos["cut"] = 8;
tlb_pos["decreasecolumnspan"] = 9;
tlb_pos["deletecolumn"] = 10;
tlb_pos["email"] = 11;
tlb_pos["file"] = 12;
tlb_pos["find"] = 13;
tlb_pos["findreplace"] = 14;
tlb_pos["flash"] = 15;
tlb_pos["fontcolor"] = 16;      
tlb_pos["fontcolor2"] = 17;      
tlb_pos["form"] = 18;      
tlb_pos["fullscreen"] = 19;      
tlb_pos["help"] = 20;      
tlb_pos["hidden_icon"] = 21;      
tlb_pos["highlight"] = 22;      
tlb_pos["highlight2"] = 23;      
tlb_pos["hr"] = 24;      
tlb_pos["image"] = 25;      
tlb_pos["increasecolumnspan"] = 26;      
tlb_pos["indent"] = 27;      
tlb_pos["insertbutton"] = 28;
tlb_pos["insertchars"] = 29;
tlb_pos["insertcheckbox"] = 30;
tlb_pos["insertcolumnleft"] = 31;      
tlb_pos["insertcolumnright"] = 32;      
tlb_pos["insertform"] = 33;
tlb_pos["inserthidden"] = 34;      
tlb_pos["inserthorizontalrule"] = 35;
tlb_pos["insertimage"] = 36;
tlb_pos["insertorderedlist"] = 37;
tlb_pos["insertradio"] = 38;
tlb_pos["insertrowabove"] = 39;
tlb_pos["insertrowbelow"] = 40;
tlb_pos["insertselect"] = 41;
tlb_pos["inserttable"] = 42;      
tlb_pos["inserttextarea"] = 43;      
tlb_pos["inserttextbox"] = 44;      
tlb_pos["inserttextfield"] = 45;      
tlb_pos["insertunorderedlist"] = 46;      
tlb_pos["italic"] = 47;
tlb_pos["justifycenter"] = 48;      
tlb_pos["justifyfull"] = 49;
tlb_pos["justifyleft"] = 50;
tlb_pos["justifyright"] = 51;
tlb_pos["mail"] = 52;
tlb_pos["media"] = 53;
tlb_pos["modifycell"] = 54;
tlb_pos["modifyform"] = 55;
tlb_pos["modifytable"] = 56;
tlb_pos["outdent"] = 57; 
tlb_pos["pageproperties"] = 58;
tlb_pos["paragraph"] = 59;
tlb_pos["paste"] = 60;
tlb_pos["pastetext"] = 61;
tlb_pos["pasteword"] = 62;
tlb_pos["pastefrommsword"] = 62;
tlb_pos["preview"] = 63;
tlb_pos["print"] = 64;
tlb_pos["redo"] = 65;
tlb_pos["removeformat"] = 66;
tlb_pos["save"] = 67;
tlb_pos["showborders"] = 68;
tlb_pos["spellcheck"] = 69;
tlb_pos["strikethrough"] = 70;
tlb_pos["subscript"] = 71; 
tlb_pos["superscript"] = 72;
tlb_pos["table"] = 73;
tlb_pos["underline"] = 74;
tlb_pos["undo"] = 75;
tlb_pos["toggleposition"] = 76;
tlb_pos["deleterow"] = 77;
tlb_pos["newtag"] = 78;
tlb_pos["increaserowspan"] = 79;
tlb_pos["decreaserowspan"] = 80;
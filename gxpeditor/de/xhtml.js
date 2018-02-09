// Name: XHTML function
// Info: XHTML function.

function getXHTML(content) {
  var html = new cls_html();
  html.setHTML(content);
  return (html.toXHTML());
}

/**
 * Copyright 2004, Interspire. @author Jorgen Horstink <jorgen@interspire.com>
 */
Array.prototype.clone = __prototype_array_clone;
function __prototype_array_clone() {
  var temp = [];
  for(var i in this) {
    if (typeof this[i] == "object") {
      temp[i] = this[i].clone();
    } else {
      temp[i] = this[i];
    }
  }
  return temp;
}

var XHTML_TEMP_VAR = a;
a = null;
var a = new Array();
a['p'] = 1;             a['span'] = 1;		    a['a'] = 1;	          a['div'] = 1;
a['b'] = 1;		          a['u'] = 1;	          a['i'] = 1;	          a['td'] = 1;
a['img'] = 1;		        a['table'] = 1;	      a['input'] = 1;	      a['li'] = 1;
a['ol'] = 1;	          a['script'] = 1;	    a['br'] = 1;	        a['textarea'] = 1;
a['strong'] = 1;		    a['center'] = 1;	    a['cite'] = 1;	      a['code'] = 1;
a['col'] = 10;		      a['colgroup'] = 1;	  a['dd'] = 1;	        a['del'] = 1;
a['dir'] = 1;  		      a['dfn'] = 1; 	      a['acronym'] = 1;	    a['dl'] = 1;
a['dt'] = 1;		        a['em'] = 1;	        a['fieldset'] = 1;	  a['font'] = 1;
a['form'] = 1;		      a['frame'] = 1;	      a['frameset'] = 1;	  a['h1'] = 1;
a['h2'] = 1;		        a['h3'] = 1;	        a['h4'] = 1;	        a['h5'] = 1;
a['h6'] = 1;		        a['head'] = 1;	      a['hr'] = 1;	        a['html'] = 1;
a['area'] = 1;		      a['iframe'] = 1;	    a['base'] = 1;	      a['bdo'] = 1;
a['ins'] = 1;	  	      a['isindex'] = 1;	    a['kbd'] = 1;	        a['label'] = 1;
a['legend'] = 1;		    a['big'] = 1;	        a['link'] = 1;	      a['map'] = 1;
a['menu'] = 1;		      a['meta'] = 1;	      a['noframes'] = 1;	  a['noscript'] = 1;
a['object'] = 1;		    a['blockquote'] = 1;	a['optgroup'] = 1;	  a['option'] = 1;
a['!doctype'] = 1;      a['param'] = 1;	      a['pre'] = 1;	        a['q'] = 1;
a['s'] = 1;             a['samp'] = 1;	      a['body'] = 1;	      a['select'] = 1;
a['small'] = 1; 		    a['abbr'] = 1;	      a['strike'] = 1;	    a['caption'] = 1;
a['style'] = 1; 	      a['sub'] = 1;	        a['sup'] = 1;	        a['basefont'] = 1;
a['tbody'] = 1;	        a['address'] = 1;	    a['button'] = 1;	    a['tfoot'] = 1;
a['th'] = 1;		        a['thead'] = 1;	      a['title'] = 1;	      a['tr'] = 1;
a['tt'] = 1;		        a['applet'] = 1;	    a['ul'] = 1;	        a['v'] = 1;
a['embed'] = 1;         a['marquee'] = 1;     a['!doctype'] = 1;    a['!--'] = 1;
var _xhtml_parser_aTags = a;
a = null;
a = XHTML_TEMP_VAR;

/**
 * HTML : <hr noshade>
 * XHTML: <hr noshade="noshade" />
 */
var aEmptyAttributes = new Array();
aEmptyAttributes['compact'] = 1;
aEmptyAttributes['nowrap'] = 1;
aEmptyAttributes['ismap'] = 1;
aEmptyAttributes['declare'] = 1;
aEmptyAttributes['noshade'] = 1;
aEmptyAttributes['checked'] = 1;
aEmptyAttributes['disabled'] = 1;
aEmptyAttributes['readonly'] = 1;
aEmptyAttributes['multiple'] = 1;
aEmptyAttributes['selected'] = 1;
aEmptyAttributes['noresize'] = 1;
aEmptyAttributes['defer'] = 1;
aEmptyAttributes['nosave'] = 1;
var _xhtml_parser_aEmptyAttributes = aEmptyAttributes;

/**
 * Alle tags die geen sluittag hebben. Die tags moeten een slash aan het eind krijgen
 *
 * HTML : <br>
 * XHTML: <br />
 */
var aEmptyTags = new Array();
aEmptyTags['br'] = 1;
aEmptyTags['img'] = 1;
aEmptyTags['input'] = 1;
aEmptyTags['hr'] = 1;
aEmptyTags['link'] = 1;
aEmptyTags['meta'] = 1;
aEmptyTags['embed'] = 1;
aEmptyTags['area'] = 1;
aEmptyTags['param'] = 1;
aEmptyTags['base'] = 1;
aEmptyTags['basefont'] = 1;
var _xhtml_parser_aEmptyTags = aEmptyTags;

var aFlushAfter = new Array();
aFlushAfter['td'] = 1;
aFlushAfter['tr'] = 1;
aFlushAfter['table'] = 1;
aFlushAfter['ul'] = 1;
aFlushAfter['select'] = 1;
aFlushAfter['html'] = 1;
aFlushAfter['body'] = 1;
_xhtml_parser_aFlushAfter = aFlushAfter;

var _xhtml_parser_aNoNestedTags = new Array();
_xhtml_parser_aNoNestedTags["li"] = 1;
_xhtml_parser_aNoNestedTags["option"] = 1;

var aDoNotAnalyse = new Array();
aDoNotAnalyse['script'] = 1;
aDoNotAnalyse['style'] = 1;
aDoNotAnalyse['textarea'] = 1;
var _xhtml_parser_aDoNotAnalyse = aDoNotAnalyse;

var aIgnoreTags = new Array();
//aIgnoreTags["dl"] = 1;
aIgnoreTags["dd"] = 1;
aIgnoreTags["dt"] = 1;
_xhtml_parser_aIgnoreTags = aIgnoreTags;

/**
 * Alle HTML entiteiten moeten omgezet worden in XHTML.
 * Dezelfde omleiding wordt hier gebruikt als bij het zetten van
 * alle HTML tags.
 */
XHTML_TEMP_VAR = a;
a = null;
var a = new Array();
a['&nbsp;']   = '&nbsp;'; // Moet &nbsp; blijven!
a['&quot;']   = '&#34;';
a['&amp;']    = '&#38;';
a['&lt;']     = '&#60;';
a['&gt;']     = '&#62;';
a['&iexcl;']  = '&#161;';
a['&cent;']   = '&#162;';
a['&pound;']  = '&#163;';
a['&curren;'] = '&#164;';
a['&yen;']    = '&#165;';
a['&brvbar;'] = '&#166;';
a['&brkbar;'] = '&#166;';
a['&sect;']   = '&#167;';
a['&uml;']    = '&#168;';
a['&die;']    = '&#168;';
a['&copy;']   = '&#169;';
a['&ordf;']   = '&#170;';
a['&laquo;']  = '&#171;';
a['&not;']    = '&#172;';
a['&reg;']    = '&#174;';
a['&macr;']   = '&#175;';
a['&hibar;']  = '&#175;';
a['&deg;']    = '&#176;';
a['&plusmn;'] = '&#177;';
a['&sup2;']   = '&#178;';
a['&sup3;']   = '&#179;';
a['&acute;']  = '&#180;';
a['&micro;']  = '&#181;';
a['&para;']   = '&#182;';
a['&middot;'] = '&#183;';
a['&cedil;']  = '&#184;';
a['&sup1;']   = '&#185;';
a['&ordm;']   = '&#186;';
a['&raquo;']  = '&#187;';
a['&frac14;'] = '&#188;';
a['&frac12;'] = '&#189;';
a['&frac34;'] = '&#190;';
a['&iquest;'] = '&#191;';
a['&Agrave;'] = '&#192;';
a['&Aacute;'] = '&#193;';
a['&Acirc;']  = '&#194;';
a['&Atilde;'] = '&#195;';
a['&Auml;']   = '&#196;';
a['&Aring;']  = '&#197;';
a['&AElig;']  = '&#198;';
a['&Ccedil;'] = '&#199;';
a['&Egrave;'] = '&#200;';
a['&Eacute;'] = '&#201;';
a['&Ecirc;']  = '&#202;';
a['&Euml;']   = '&#203;';
a['&Igrave;'] = '&#204;';
a['&Iacute;'] = '&#205;';
a['&Icirc;']  = '&#206;';
a['&Iuml;']   = '&#207;';
a['&ETH;']    = '&#208;';
a['&Ntilde;'] = '&#209;';
a['&Ograve;'] = '&#210;';
a['&Oacute;'] = '&#211;';
a['&Ocirc;']  = '&#212;';
a['&Otilde;'] = '&#213;';
a['&Ouml;']   = '&#214;';
a['&times;']  = '&#215;';
a['&Oslash;'] = '&#216;';
a['&Ugrave;'] = '&#217;';
a['&Uacute;'] = '&#218;';
a['&Ucirc;']  = '&#219;';
a['&Uuml;']   = '&#220;';
a['&Yacute;'] = '&#221;';
a['&THORN;']  = '&#222;';
a['&szlig;']  = '&#223;';
a['&agrave;'] = '&#224;';
a['&aacute;'] = '&#225;';
a['&acirc;']  = '&#226;';
a['&atilde;'] = '&#227;';
a['&auml;']   = '&#228;';
a['&aring;']  = '&#229;';
a['&aelig;']  = '&#230;';
a['&ccedil;'] = '&#231;';
a['&egrave;'] = '&#232;';
a['&eacute;'] = '&#233;';
a['&ecirc;']  = '&#234;';
a['&euml;']   = '&#235;';
a['&igrave;'] = '&#236;';
a['&iacute;'] = '&#237;';
a['&icirc;']  = '&#238;';
a['&iuml;']   = '&#239;';
a['&eth;']    = '&#240;';
a['&ntilde;'] = '&#241;';
a['&ograve;'] = '&#242;';
a['&oacute;'] = '&#243;';
a['&ocirc;']  = '&#244;';
a['&otilde;'] = '&#245;';
a['&ouml;']   = '&#246;';
a['&divide;'] = '&#247;';
a['&oslash;'] = '&#248;';
a['&ugrave;'] = '&#249;';
a['&uacute;'] = '&#250;';
a['&ucric;']  = '&#251;';
a['&uuml;']   = '&#252;';
a['&yacute;'] = '&#253;';
a['&thorn;']  = '&#254;';
a['&yuml;']   = '&#255;';
var _xhtml_parser_aEntities = a;
a = null;
a = XHTML_TEMP_VAR;

/**
 * Alle modi:
 *
 * - 0: TEXT
 * - 1: OPEN TAG
 * - 2: CLOSE TAG
 * - 3: EMPTY TAG
 * - 4: COMMENT
 * - 5: CDATA
 * - 6: DOCTYPE
 */

function _xhtml_array() {
  /**
   * Haal alle Tags op en zet ze in de locale variabele this.aTags
   */
  this.aTags = _xhtml_parser_aTags;
  this.aEntities = _xhtml_parser_aEntities
  this.aEmptyAttributes = _xhtml_parser_aEmptyAttributes;
  this.aEmptyTags = _xhtml_parser_aEmptyTags;
  this.aDoNotAnalyse = _xhtml_parser_aDoNotAnalyse;
  /**
   * Als er een SCRIPT tag gevonden wordt, dan moet de inhoud ervan
   * niet ge-analyseerd worden. Gewoon domweg doorlopen totdat er
   * een </script> gevonden wordt.
   */
  this.bInScriptTag = false;
  this.bDoNotAnalyse = false;
  this.sDoNotAnalyseTill = "";

  this.aRet = new Array();
  /**
   * Variabele met de HTML
   */
  this.sHTML = "";
  /**
   * Zet de HTML tekenreeks waarvan een Array moet worden gemaakt.
   */
  this.setHTML = function (sHTML) {
    this.sHTML = sHTML;
  }

  this.toArray = function () {
    /**
     * Dit is een zeer belangrijke variabele. Deze variabele houdt
     * bij in welke modus de parser zit. Er zijn verschillende
     * modi: 0=>IN_TEXT, 1=>IN_OPEN_TAG, 2=>IN_CLOSE_TAG, IN_ATTRIBUTE
     */
    var iMode = 0;

    var s = this.sHTML;
    var isl = s.length;

    this.currentEntry;

    /**
     * Zorg dat er altijd een parent tag paar is. Het algoritme
     * is afhankelijk van zo'n parent tagpaar.
     */
    this.setEntry();
    this.currentEntry["type"] = 1;
    this.currentEntry["tagname"] = "XHTML_PARENT_TAG";
    /**
     * Door de value op "" te zetten zorg je ervoor dat de waarde
     * bij het genereren van de output string niet beïnvloed wordt.
     */
    this.currentEntry["value"] = "";

    /**
     * Zet de eerste entry en geef hem als type "text" mee
     */
    this.setEntry();
    this.currentEntry["type"] = 0;
//    this.setEntryValue("type", 0, false);

    /**
     * Deze lus, leest de tekenreeks, teken voor teken in. Bij
     * bepaalde tekens, zoals <, > en :, wordt er gekeken in
     * welke modus de parser zit. Die modus is afhankelijk voor het
     * verdere gedrag van de parser. Bijvoorbeeld constateren dat
     * een nieuwe tag geopend wordt, of dat er een tag afgesloten
     * wordt.
     */
    for (var i = 0; i < isl; i++) {
      var c = s.substr(i, 1);
      switch (c) {
        case "<":
          /**
           * Er is een < geopend. Dat kan betekenen dat er een HTML
           * tag aankomt. Alleen als de parser in text modus is kan
           * de < het begin van een tag betekenen.
           */
          if (iMode == 0) {

            /**
             * posType houdt bij of het mogelijke type een OPEN tag
             * of een CLOSE tag kan zijn.
             */
            var posType = 1;
            /**
             * Hier wordt een tijdelijke variabele aangemaakt. i+1
             * houdt in dat je niet het < teken erbij wil hebben. Er
             * wordt expres voor lengte 12 gekozen, omdat een HTML
             * tagname nooit langer is dan 12 karakters.
             */
            var sTemp = s.substr(i + 1, 12);

            /**
             * Als het teken na de < een slash is dan kan het een
             * sluit tag zijn.
             */
            if (sTemp.charCodeAt() == 47) {
              sTemp = sTemp.substr(1);
              posType = 2;
            }
            var iTempLength = sTemp.length;
            /**
             * Analyseer elk teken van de tijdelijke variabele. Als
             * er geen cijfer of nummer gevonden wordt, dan moet er
             * gestopt worden. 
             */
            for (var j = 0; j < iTempLength; j++) {
              code = sTemp.charCodeAt(j);
              if (!((code > 96 && code < 123) || (code > 64 && code < 91) || (code > 47 && code < 58) || (code == 33) || (code == 45))) {
                break;
              }
            }
            var posTag = sTemp.substr(0, j);
            posTag = posTag.toLowerCase();

            if (this.bDoNotAnalyse == true && posTag != this.sDoNotAnalyseTill) {
              this.currentEntry["value"] += "<";
              break;
            }

            /**
             * Controleer op commentaar blokken
             */
            if (s.substr(i + 1, 3) == "!--") {
              iStart = i;
              i += 3;
              bFound = false;
              code = s.charCodeAt(i);
              while (bFound == false) {
                i++;
                code = s.charCodeAt(i);
                /**
                 * als het teken een - is en het volgende teken ook een - en het teken daarna een > dan is het het einde van
                 * een commentaar blok
                 */
                if (code == 45 && s.charCodeAt(i+1) == 45 && s.charCodeAt(i+2) == 62) {
                  bFound = true;
                  i += 3;
                }
              }
              if (this.currentEntry && !(this.currentEntry['type'] == 0 && this.currentEntry['value'] == '')) {
                this.setEntry();
              }
              this.currentEntry["type"] = 4;
              this.currentEntry["tagname"] = "";
              this.currentEntry["value"]   = s.substr(iStart, i - iStart);
              this.setEntry();
              this.currentEntry["type"]  = 0;
              this.currentEntry["value"] = "";
              i--;
              break;
            }

            if (posTag == "!doctype") {
              i += posTag.length + 1;
              iStart = i;
              code = s.charCodeAt(i);
              while (code != 62) {
                i++;
                code = s.charCodeAt(i);
              }
              if (this.currentEntry && !(this.currentEntry['type'] == 0 && this.currentEntry['value'] == '')) {
                this.setEntry();
              }
              this.currentEntry["type"] = 6;
              this.currentEntry["tagname"] = "!doctype";
              this.currentEntry["value"]   = s.substr(iStart, i - iStart);
              if (this.currentEntry["value"].lastIndexOf("/") == this.currentEntry["value"].length-1)this.currentEntry["value"] = this.currentEntry["value"].substr(0,this.currentEntry["value"].length-1);
              this.setEntry();
              this.currentEntry["type"] = 0;
              this.currentEntry["value"] = "";
              iMode = 0;
              break;
            }

            if (this.bDoNotAnalyse == true && this.sDoNotAnalyseTill == posTag) {
              this.bDoNotAnalyse = false;
            }

            /**
             * Als het inderdaad de opening van een tag is, voeg dan
             * een nieuwe entry toe, zet het type, tagnaam en de
             * eerste "<". 
             */
            if (this.aTags[posTag] == 1) {
              /**
               * Als de vorige entry nog leeg is en van het type text, dan kan die entry
               * gebruikt worden.
               */
              if (this.currentEntry && !(this.currentEntry['type'] == 0 && this.currentEntry['value'] == '')) {
                this.setEntry();
              }

              this.currentEntry["tagname"] = posTag;
              if (this.aEmptyTags[posTag] == 1) {
                this.currentEntry["type"] = 3;
              } else {
                this.currentEntry["type"] = posType;
              }
              if (posType == 1) {
                this.currentEntry["value"] += "<" + posTag;
                i += posTag.length;
                iMode = 1;
              }
              if (posType == 2) {
                this.currentEntry["value"] += "</" + posTag;
                i += posTag.length + 1;
                iMode = 2;
              }

            } else {
              /**
               * De modus is IN_TEXT en er is geen tag. Vervang de <
               * daarom voor zijn HTML entiteit.
               */
              this.currentEntry["value"] += "<"//"&#60;";
            }
            break;
          }
          break;
        case ">":
          if (this.aDoNotAnalyse[posTag] == 1 && posType == 1) {
            this.sDoNotAnalyseTill = posTag;
            this.bDoNotAnalyse = true;
            this.currentEntry["value"] += ">";
            this.setEntry();
            this.currentEntry["type"] = 5;
            iMode = 0;
            break;
          }
          /**
           * Als de modus IN_OPEN_TAG is, dan wordt nu de tag afgesloten.
           * Voeg daarom nog het > toe aan de entry en open een nieuwe
           * entry en zet het type van die entry.
           */
          if (iMode != 0) {
            if (this.currentEntry["type"] == 3) {
              this.currentEntry["value"] += "/>";
            } else {
              this.currentEntry["value"] += ">";
            }
            iMode = 0;
            this.setEntry();
            this.currentEntry["type"] = 0;
            break;
          }

          if (this.bDoNotAnalyse == true) {
            this.currentEntry["value"] += ">";
            break;
          }
          /**
           * Als de modus IN_TEXT modus is, voeg dan gewoon het teken toe
           * Het is geen afsluiting van een tag, maar gewoon het teken.
           */
          if (iMode == 0) {
            this.currentEntry["value"] += ">"//"&#62;";
          }
          break;
        default:
          /**
           * Als de modus IN_TEXT is, voeg dat het teken toe aan de
           * laatste entry waarde
           */
          if (iMode == 0) {
            this.currentEntry["value"] += c;
            break;
          }

          if (iMode == 1) {
            /**
             * Het volgende teken is een whitespace, zo ja, loop dan net
             * zo lang totdat alle whitespaces weg zijn. 
             */
            code = s.charCodeAt(i);
            if (code == 32 || code == 10 || code == 13 || code == 9) {
              while (code == 32 || code == 10 || code == 13 || code == 9) {
                if (i > isl) {break;}
                i++;
                code = s.charCodeAt(i);
              }
            }
            /**
             * Nadat alle whitespaces verwijderd zijn, moet er gekeken worden
             * of er een attribuut is.
             */
            if ((code > 96 && code < 123) || (code > 64 && code < 91) || (code > 47 && code < 58) || code == 45) {
              /**
               * Zoek een mogelijk attribuut, een attribuut mag alleen bestaan
               * uit letters en cijfers.
               */
              var posAttrBegin = i;
              while ((code > 96 && code < 123) || (code > 64 && code < 91) || (code > 47 && code < 58) || code == 45) {
                if (i > isl) {break;}
                i++;
                code = s.charCodeAt(i);
              }
              var posAttr = s.substr(posAttrBegin, i - posAttrBegin);
              /**
               * Na de mogelijke attribuut naam, kunnen nog spaties voorkomen.
               * spaties voor het = teken, doorloop dus ook eerst die spaties.
               *
               * vb: <b onClick     ="">
               */
              if (code == 32 || code == 10 || code == 13 || code == 9) {
                while (code == 32 || code == 10 || code == 13 || code == 9) {
                  if (i > isl) {break;}
                  i++;
                  code = s.charCodeAt(i);
                }
              }
              /**
               * Is het gevonden teken een is-teken? Zo ja, dan is er een
               * attribuut gevonden. Dan moet er op zoek worden gegaan
               * naam de waarde van het attribuut.
               * 61 => "="
               */
              if (code == 61) {
                /**
                 * Nu eenmaal zeker is dat er een attribuut is, moet er dus
                 * op zoek worden gegaan naar de waarde van het attribuut. Na het
                 * is-teken kunnen opnieuw spaties voorkomen. Doorloop dus eerst
                 * die spaties.
                 */
                i++;
                code = s.charCodeAt(i);
                if (code == 32 || code == 10 || code == 13 || code == 9) {
                  while (code == 32 || code == 10 || code == 13 || code == 9) {
                    if (i > isl) {break;}
                    i++;
                    code = s.charCodeAt(i);
                  }
                }
                c = s.substr(i, 1);
                /**
                 * Het volgende teken dat gevonden is, is geen teken voor het
                 * openen van een attribuut.
                 *
                 * vb: <b onClick=alert('foo');>
                 *
                 * Er moet nu doorgezocht worden totdat er een whitespace gevonden is
                 * elk teken mag, behalve whitespace en een sluit teken mag niet >
                 */
                if (code != 39 && code != 34) {
                  var attrValueBegin = i
                  while (!(code == 32 || code == 10 || code == 13 || code == 9) && code != 62) {
                    if (i > isl) {break;}
                    i++;
                    code = s.charCodeAt(i);
                  }
                  var attrValue = s.substr(attrValueBegin, i - attrValueBegin);
                  if (attrValue.match("/\"/g")) {
                    attrValue = "'" + attrValue + "'";
                  } else {
                    attrValue = "\"" + attrValue + "\"";
                  }
                  /**
                   * Voeg het attribuut en zijn waarde toe
                   */
                  this.currentEntry["value"] += " " + posAttr.toLowerCase() + "=" + attrValue;
                  //this.addAttribute(posAttr, attrValue);
                } else {
                  /**
                   * Het volgende teken is wel een " of een '. Nu moet er net zolang
                   * worden doorgezocht totdat er nog zo'n teken gevonden wordt; dat
                   * is het einde van het attribuut.
                   */
                  var end = code;
                  i++;
                  code = s.charCodeAt(i);
                  var attrValueBegin = i;
                  while (code != end) {
                    if (i > isl) {break;}
                    i++;
                    code = s.charCodeAt(i);
                  }
                  /**
                   * Deze regel gebruiken als je om de waarde van het attribuut alvast de "
                   * of ' wil hebben
                   */
                  var attrValue = s.substr(attrValueBegin - 1, i - attrValueBegin + 2);
                  //var attrValue = s.substr(attrValueBegin, i - attrValueBegin);

                  /**
                   * Voeg het attribuut en zijn waarde toe
                   */
                  this.currentEntry["value"] += " " + posAttr.toLowerCase() + "=" + attrValue;
                  //this.addAttribute(posAttr, attrValue);
                }

              } else {
                /**
                 * Dat er geen is-teken gevonden is, kan twee dingen betekenen:
                 * het is geen attribuut, of het is een leeg attribuut.
                 *
                 * vb: <hr noshade>
                 *
                 * Er moet dus gecontroleerd worden, of "posAttr" voorkomt in
                 * de array met attributen die leeg kunnen zijn. Zo ja, dan is het
                 * wel een attribuut. Zo nee, dan is het geen attribuut.
                 */
                if (this.aEmptyAttributes[posAttr.toLowerCase()] == 1) {
                  this.currentEntry["value"] += " " + posAttr.toLowerCase() + "=\"" + posAttr + "\"";
                  //this.addAttribute(posAttr, posAttr);
                }
              }

              i--;
            } else {
              /**
               * Dit kan soms voorkomen: voorbeeld: <hr   >
               */
              if (code == 62) {
                if (this.currentEntry["type"] == 3) {
                  this.currentEntry["value"] += " />";
                } else {
                  this.currentEntry["value"] += ">";
                }
                this.setEntry();
                this.currentEntry["type"] = 0;
                iMode = 0;
              }
            }
            break;
          }
      }
    }
    if (this.aRet[this.aRet.length - 1]["value"] == "") {
      this.aRet.length--;
    }

    /**
     * Zorg dat er altijd een parent tag paar is. Het algoritme
     * is afhankelijk van zo'n parent tagpaar. Deze code voegt
     * de sluittag toe.
     */
    this.setEntry();
    this.currentEntry["type"] = 2;
    this.currentEntry["tagname"] = "XHTML_PARENT_TAG";
    this.currentEntry["value"] = "";

    return this.aRet;
  }

  /**
   * Maak een nieuwe entry aan in de return Array.
   */
  this.setEntry = function () {
    var i = this.aRet.length;
    this.aRet[i]               = new Array();
    this.aRet[i]["tagname"]    = "";
    //this.aRet[i]["attributes"] = new Array();
    this.aRet[i]["type"]       = "";
    this.aRet[i]["value"]      = "";
    this.currentEntry = this.aRet[i];
  }

  this.addAttribute = function (sAttribute, sValue) {
/**

Tijdens het optimaliseren is gekozen om geen array van attributen bij
te houden. Het is mogelijk. Dan moet dit commentaar verwijderd
worden.

    var ai = this.currentEntry['attributes'].length;
    this.currentEntry['attributes'][ai] = new Array();
    this.currentEntry['attributes'][ai]['name']  = sAttribute.toLowerCase();;
    this.currentEntry['attributes'][ai]['value'] = sValue;
*/
  }
}

function _xhtml_nesting() {
  this.aData;
  this.setArray = function (a) {
    this.aData = a;
  }
  /**
   * Deze functie corrigeert de nesting van een gegeven array. Het algoritme
   * voor het corrigeren gaat er vanuit dat er een alles omvattend paar tags
   * is. In de meeste gevallen is dat de <HTML> tag.
   */
  this.correct = function () {
    var aReturn = new Array();
    var a = this.aData;
    var al = this.aData.length;

    var aNoNestedTags = _xhtml_parser_aNoNestedTags;
    var aFlushAfter = _xhtml_parser_aFlushAfter;
    var aIgnoreTags = _xhtml_parser_aIgnoreTags;
    /**
     * Een array met alle tags die zijn geopend
     */
    var aStack = new Array();
    //aStack[aStack.length] = a[0].clone();
    /**
     * Een array met alle tags die zijn gesloten voordat de juiste tag
     * gevonden werd.
     */
    var aFixStack = new Array();

    /**
     * Een array met alle tags die zijn geopend, verschil met de stack array
     * is dat in deze array de index van de array de tagname is. Zo kan snel
     * gekeken worden of een tag geopend (1) is of niet (0)
     */
    var aOpenTags = new Array();
    /**
     * Voeg de eerste tag toe aan de stack. En voeg een sluit paar toe aan het
     * einde van de invoer Array. Dit zorgt ervoor dat de array een parent
     * tag paar heeft.
     */
    //aStack[aStack.length] = new Array();
    //aStack[aStack.length - 1]["tagname"] = "parent_node";
    //aStack[aStack.length - 1]["type"]    = 1;
    //a[a.length] = aStack[aStack.length - 1].clone();
    //a[a.length - 1]["type"] = 2;
    /**
     * Doorloop alle items in de Array
     */
    for (var i = 0; i < al; i++) {
      var iType       = a[i]["type"];
      var sTagName    = a[i]["tagname"];
      switch (iType) {
        case 0: // TEXT NODE
          /**
           * Wanneer het een text node betreft kan de data gewoon direct aan de return
           * Array toegevoegd worden. De nesting hoeft niet geanalyseerd te worden.
           */
          aReturn[aReturn.length] = a[i].clone();
          break;
        case 1: // OPEN TAG NODE
          /**
           * Als de tag voor het eerst voorkomt, dan bestaat de entry aOpenTags[sTagName]
           * nog niet. Die moet dan aangemaakt worden en op nul gezet worden.
           */
          if (!aOpenTags[sTagName]) {
            aOpenTags[sTagName] = 0;
          }
          if (aIgnoreTags[sTagName]) {
            aReturn[aReturn.length] = a[i].clone();
            break;
          }

          if (aNoNestedTags[sTagName] == 1 && aOpenTags[sTagName] != 0) {
            /**
             * Bouw de stack af totdat de tag gevonden is
             */
            for (var j = aStack.length - 1; j > -1; j--) {
              if (aReturn[aReturn.length - 1]["algorithm"] == 1 && aReturn[aReturn.length - 1]["tagname"] == aStack[j]["tagname"]) {
                aReturn.length--;
                aStack.length--;
                //aReturn[aReturn.length] = a[i].clone();
                //alert('foo');
                break;
              }
              aOpenTags[aStack[aStack.length - 1]["tagname"]]--;
              aReturn[aReturn.length] = aStack[j].clone();
              aReturn[aReturn.length - 1]["type"] = 2;
              if (aStack[aStack.length - 1]["tagname"] == sTagName) {
                aStack.length--;
                break;
              }
              aFixStack[aFixStack.length] = aStack[j].clone();
              aStack.length--;
            }
            if (aStack.length == 0) {
              break;
            }
            /**
             * Heropen UL en OL tags voordat de LI tag geopend wordt...
             */
            for (var j = aFixStack.length - 1; j > -1; j--) {
              var tag = aFixStack[j]["tagname"];
              if (tag == "ul" || tag == "ol") {
                aOpenTags[tag]++;
                aReturn[aReturn.length] = aFixStack[j].clone();
                aStack[aStack.length] = aFixStack[j].clone();
              }
            }
            aOpenTags[sTagName]++;
            aReturn[aReturn.length] = a[i].clone();
            aStack[aStack.length] = a[i].clone();
            for (var j = aFixStack.length - 1; j > -1; j--) {
              /**
               * Negeer de UL en OL tags
               */
              var tag = aFixStack[j]["tagname"];
              if (tag == "ul" || tag == "ol") {
                continue;
              }
              for (var k = i + 1; k < al; k++) {
                if (!a[k]["value"].match("/^(\w)+$/gi")) {
                  /**
                   * Bug solve
                   */
                  if (a[k]["tagname"] == "") {
                    i=k-1;
                  } else {
                    i=k;
                  }
                  break;
                }
              }
              if (a[k]["tagname"] == aFixStack[j]["tagname"]) {;
                continue;
              }
              aOpenTags[aFixStack[j]["tagname"]]++;
              aReturn[aReturn.length] = aFixStack[j].clone();
              aReturn[aReturn.length - 1]["algorithm"] = 1;
              /**
               * Geef aan dat dit Item is ingevoegd door het algoritme. Wanneer de volgende
               * open tag merkt dat de laatste tag dezelfde naam heeft en de vorige tag is ingevoegd
               * door het algoritme. Dan moet de laatste uit de array gegooid worden en moet die
               * tag ook genegeerd worden.
               */
              aStack[aStack.length] = aFixStack[j].clone();
            }
            aFixStack.length = 0;
            break;
          }

          aOpenTags[sTagName]++;
          aReturn[aReturn.length] = a[i].clone();
          aStack[aStack.length] = a[i].clone();
          break;
        case 2: // CLOSE TAG NODE
          /**
           * De tag die gesloten wordt, is niet geopend. Daarom moet de tag genegeerd
           * worden; hij doet niet mee.
           */
          if (!(aOpenTags[sTagName] > 0)) {
            aOpenTags[sTagName] = 0;
            break;
          }
          
          for (var j = aStack.length - 1; j > -1; j--) {
            if (aReturn[aReturn.length - 1]["algorithm"] == 1 && aReturn[aReturn.length - 1]["tagname"] == aStack[j]["tagname"]) {
              aReturn.length--;
              aStack.length--;
              //aReturn[aReturn.length] = a[i].clone();
              //alert('foo');
              break;
            }
            aOpenTags[aStack[aStack.length - 1]["tagname"]]--;
            aReturn[aReturn.length] = aStack[j].clone();
            aReturn[aReturn.length - 1]["type"] = 2;
            if (aStack[aStack.length - 1]["tagname"] == sTagName) {
              aStack.length--;
              break;
            }
            aFixStack[aFixStack.length] = aStack[j].clone();
            aStack.length--;
          }
          if (aStack.length == 0) {
            break;
          }
          if (aFlushAfter[sTagName] != 1) {
            for (var j = aFixStack.length - 1; j > -1; j--) {
              if (aNoNestedTags[aFixStack[j]["tagname"]] == 1) {
                continue;
              }
              for (var k = i + 1; k < al; k++) {
                if (!a[k]["value"].match("/^(\w)+$/gi")) {
                  /**
                   * Bug solve
                   */
                  if (a[k]["tagname"] == "") {
                    i=k-1;
                  } else {
                    i=k;
                  }
                  break;
                }
              }
             if (!a[k])break;
              if (a[k]["tagname"] == aFixStack[j]["tagname"]) {;
                continue;
              }
              aOpenTags[aFixStack[j]["tagname"]]++;
              aReturn[aReturn.length] = aFixStack[j].clone();
              aReturn[aReturn.length - 1]["algorithm"] = 1;
              /**
               * Geef aan dat dit Item is ingevoegd door het algoritme. Wanneer de volgende
               * open tag merkt dat de laatste tag dezelfde naam heeft en de vorige tag is ingevoegd
               * door het algoritme. Dan moet de laatste uit de array gegooid worden en moet die
               * tag ook genegeerd worden.
               */
              aStack[aStack.length] = aFixStack[j].clone();
            }
          }
          aFixStack.length = 0;
          /**
           * Verminder het aantal tags dat geopend is van tag sTagName met 1. Hij is namelijk
           * afgesloten. Het aantal open tags is nu nog oud - 1.
           */

          //aReturn[aReturn.length] = a[i].clone();
          break;
        case 3: // EMPTY TAG NODE
          /**
           * Wanneer het een empty tag betreft kan de data gewoon direct aan de return
           * Array toegevoegd worden. De nesting hoeft niet geanalyseerd te worden.
           */
          aReturn[aReturn.length] = a[i].clone();
          break;
        case 4: // COMMENT NODE
          aReturn[aReturn.length] = a[i].clone();
          break;
        case 5: // CDATA NODE
          aReturn[aReturn.length] = a[i].clone();
          break;
        case 6: // DOCTYPE NODE
          aReturn[aReturn.length] = a[i].clone();
          break;
      }
      if (aStack.length == 0) {
        break;
      }
    }
    /*alert(aOpenTags["table"]);
    alert(aOpenTags["td"]);
    alert(aOpenTags["tr"]);
    */
    return (aReturn);
  }
}

function _xhtml_string_builder() {
  this.a = new Array();
  this.setArray = function (a) {
    this.a = a
  }

  this.build = function () {
    var v = "";
    for (var i = 0; i < this.a.length - 1; i++) {
/**

Testje:

      v += this.a[i]["tagname"] + "\n";
      v += this.a[i]["type"] + "\n";
      v += this.a[i]["value"] + "\n---------------------------------------\n\n";
*/
      switch (this.a[i]["type"]) {
        case 0:
          v += this.a[i]["value"];
          break
        case 1:
          v += this.a[i]["value"];
          break;
        case 2:
          v += "</" + this.a[i]["tagname"] + ">";
          break;
        case 3:
          v += this.a[i]["value"];
          break;
        case 4:
          v += this.a[i]["value"];
          break;
        case 5:
          v += this.a[i]["value"];
          break;
        case 6:
          v += "<" + this.a[i]["tagname"] + this.a[i]["value"] + " />";
          break;
      }
    }
    v = this.removeEmptyTags (v)

    return (v);
  }

  this.removeEmptyTags = function (v) {
    //v = v.replace(/(<font[^>]*>)([\s]*?)(<\/font[^>]*>)/gi, "");
    v = v.replace(/(<ul[^>]*>)([\s]*?)(<\/ul[^>]*>)/gi, "");
    v = v.replace(/(<ol[^>]*>)([\s]*?)(<\/ol[^>]*>)/gi, "");
    v = v.replace(/(<p[^>]*>)([\s]*?)(<\/p[^>]*>)/gi, "");
    //v = v.replace(/(<i[^>]*>)([\s]*?)(<\/i[^>]*>)/gi, "");
    //v = v.replace(/(<u[^>]*>)([\s]*?)(<\/u[^>]*>)/gi, "");
    return (v);
  }
}

function cls_html() {
  this.sHTML = "";
  this.sRet = "";

  this.setHTML = function (s) {
    this.sHTML = s;
  }

  this.toXHTML = function () {
    var xhtml_array = new _xhtml_array();
    xhtml_array.setHTML(this.sHTML);
    var xhtml_nesting = new _xhtml_nesting();
    xhtml_nesting.setArray(xhtml_array.toArray());
    this.aNesting = xhtml_nesting.correct();

    var xhtml_string_builder = new _xhtml_string_builder();
    xhtml_string_builder.setArray(this.aNesting);
    this.sRet = xhtml_string_builder.build();
    return this.sRet;
  }
}

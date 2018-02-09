<!DOCTYPE HTML>
<?php $pagina = 'trabajar-en-mp';?>
<html lang="es">
	<!--<![endif]-->

<?php include('_head.php');?>
<title>MP | Trabajar en MP</title>
<body>
<div class="wrapper">
 	<div class="content">
			<?php include('_header.php');?>	
			<div class="content_page">
            		<img src="/images/mama_neonatologos.jpg" class="images_top">
				<div class="content_text" style="margin-top:10px;">
				  <h1>Trabajá en MP</h1>
				  <p>Si estás interesado en ser parte de MP completá los datos a continuación, <br>
			      te tendremos en cuenta en próximos llamados.</p>
				    
				 <iframe width="100%" height="1120px" src="https://www.mp.com.uy/SitioMP/servlet/tswmp001" allowtransparency="yes" frameborder="0"></iframe>
			  </div><!-- content text -->
			</div><!-- content page -->
<script src="/js/jquery_002.js"></script>
<script> 

// Regular Expression to test whether the value is valid

$.tools.validator.fn("[data-equals]", "Value not equal with the $1 field", function(input) {
    var name = input.attr("data-equals"),
         field = this.getInputs().filter("[name=" + name + "]"); 
    return input.val() == field.val() ? true : [name]; 
});

$.tools.validator.fn("[minlength]", function(input, value) {
    var min = input.attr("minlength");
    
    return value.length >= min ? true : {     
        en: "Campo requerido" + (min > 1 ? "" : ""),
    };
});


$("#myform").validator({ 
    position: 'top left', 
    offset: [-6, 90],
    message: '<div><em/></div>' // em element is the arrow
});
</script>

					
 	</div><!--content-->

<?php include('_footer.php');?>	
</div><!--wrapper-->

<!-- Google Code para etiquetas de remarketing -->
<!--------------------------------------------------
Es posible que las etiquetas de remarketing todav�a no est�n asociadas a la informaci�n de identificaci�n personal o que est�n en p�ginas relacionadas con las categor�as delicadas. Para obtener m�s informaci�n e instrucciones sobre c�mo configurar la etiqueta, consulte http://google.com/ads/remarketingsetup.
--------------------------------------------------->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 972005586;
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
/* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/972005586/?value=0&amp;guid=ON&amp;script=0"/>
</div>
</noscript>

<script>(function() {
  var _fbq = window._fbq || (window._fbq = []);
  if (!_fbq.loaded) {
    var fbds = document.createElement('script');
    fbds.async = true;
    fbds.src = '//connect.facebook.net/en_US/fbds.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fbds, s);
    _fbq.loaded = true;
  }
  _fbq.push(['addPixelId', '826222200772648']);
})();
window._fbq = window._fbq || [];
window._fbq.push(['track', 'PixelInitialized', {}]);
</script>
<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?id=826222200772648&amp;ev=PixelInitialized" /></noscript>

</body>
</html>
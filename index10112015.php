<!DOCTYPE HTML>
<?php $pagina = 'inicio';?>
<html lang="es">
	<!--<![endif]-->

<?php include('_head.php');?>
<title>MP | Inicio</title>
<body>
<div class="wrapper">
 	<div class="content">
			<?php include('_header.php');?>	
			<iframe src="/frontend51/page?1,mi-mp,login_view_large,O,es,0," class="login" id="view_large"></iframe>
			<iframe src="/frontend51/page?1,mi-mp,login_view_medium_large,O,es,0," class="login" id="view_medium_large"></iframe>
			<iframe src="/frontend51/page?1,mi-mp,login_view_small,O,es,0," class="login" id="view_small"></iframe>
			<!--<div class="login">
				<img src="/images/mi_mp.png" class="float">
				<a href="/que-es-mi-mp.php" class="right">¿Qué es Mi MP?</a>
				<div class="clear"></div>
				<p class="error" style="display:none;">Usuario o contraseña incorrecta</p>
				<form>
					<label>Usuario:</label><input type="text" id="usuario" name="usuario"><div class="clear"></div>
					<label>Contraseña:</label><input type="text" id="pass" name="pass">
					<input type="submit" class="login_submit" value="">
				</form>
				<hr class="hr_600">
				<div class="login_links">
					<ul>
						<li><a href="/nuevo-usuario.php">&#9658; ¿Olvidó su contraseña?</a></li>
						<li><a href="/acceder-a-mi-pagina-mp.php">&#9658; Nuevo Usuario</a></li>				
					</ul>
					<hr>
					<ul>
						<li><a href="/acceder-a-mi-pagina-mp.php">&#9658; ¿Cómo accedo a "Mi MP"?</a></li>
						<li><a href="/acceder-a-mi-pagina-mp.php">&#9658; ¿A qué información tengo acceso?</a></li>
						<li><a href="/acceder-a-mi-pagina-mp.php">&#9658; Política de privacidad</a></li>
					</ul>
				</div>
			</div>-->
			<div class="slider_content">
				<section class="slider">
			        <div class="flexslider">
			          <ul class="slides">
                      		<li><a href="/mp-10.php"><img src="images/slide6.jpg" /></a></li>
                            
                            <!--<li><a href="/beneficios-de-cobertura.php"><img src="images/slide5.jpg" /></a></li>

                         <li><a href="/beneficios-de-cobertura.php"><img src="images/slide_papanata.jpg" /></a></li>
                            
                            <li><a href="/beneficios-de-cobertura.php"><img src="images/slide_glice.jpg" /></a></li>
                            -->   
                            
							<li><a href="/noticias_instagram-2015.php"><img src="images/slide-instagram.jpg" /></a></li>
                             <li><a href="/noticias_ampliacion-golf.php"><img src="images/slide2.jpg" /></a></li>
                             <li><a href="/contacto.php"><img src="images/slide8.jpg" /></a></li>
                            <!--<li><a href="/noticias_mi-mp.php"><img src="images/slide3.jpg" /></a></li><li><a href="/eventos_mama-mp.php"><img src="images/slide-mamamp.jpg" /></a></li>		
                            <li><a href="/funnily-day-2015/" target="_blank"><img src="images/slide-funnily.jpg" /></a></li>		  	    		
		  	    		<li><a href="/instagram/" target="blank"><img src="images/slide1.jpg" /></a></li>
                            
                                                		<li><a href="/beneficios-de-cobertura.php"><img src="images/slide_knoc_knoc.jpg" /></a></li>--> 

			          </ul>
			        </div>
			      </section>
			</div><!-- slider -->	
			<div class="clear"></div>
			<div class="block_home block_home_left">
			<div class="block_home_img">
				<a href="/"><img src="/images/news_1.jpg"></a>
			</div>
				<div class="block_text">
					<h3>14 de Noviembre<br>Día Mundial de la Diabetes</h3>
        <p>La diabetes mellitus es una patología que se produce... </p>
					<a href="articulos_dia-mundial-diabetes.php">Ver m&aacute;s</a>
			  </div>
			</div><!-- block home -->
			<div class="block_home block_home_center">
			<div class="block_home_img">
				<a href="/"><img src="/images/news_2.jpg"></a>
			</div>
				<div class="block_text">
					<h3>Asistencia en viajes</h3>
					<p>Cuando los socios de MP viajan al exterior lo hacen tranquilos.</p>
					<a href="/viaje-seguro.php">M&aacute;s informaci&oacute;n aqu&iacute;!</a>
				</div>				
			</div><!-- block home center-->
			<div class="block_home block_home_right">
			<div class="block_home_img">
				<a href="/"><img src="/images/news_3.jpg"></a>
			</div>
				<div class="block_text">
					<h3>Nuestros M&eacute;dicos</h3>
					<p>Amplia cartilla de profesionales.</p>
					<a href="/nuestros-medicos-adultos.php">Ver cartilla completa</a>
				</div>				
			</div><!-- block home -->	
			<div class="clear"></div>
        <!-- REDES SMARTPHONE -->
          <div class="redes_content">
            <ul class="redes">
              <li><a href="/frontend51/page?1,sitio-principal,mp--mi-pagina-mp,O,es,0,"><img src="/images/mi_mp.jpg"></a></li>
              <li><a href="/eng_index.php">english</a></li>
              <li><a href="http://instagram.com/mpersonalizada" target="_blank"><img src="/images/ins.jpg"></a></li>
              <li><a href="https://www.youtube.com/user/mpersonalizada" target="_blank"><img src="/images/you_t.jpg"></a></li>
              <li><a href="https://www.facebook.com/MPersonalizada?fref=ts" target="_blank"><img src="/images/fb.jpg"></a></li>
              <li><a href="https://twitter.com/MPersonalizada" target="_blank"><img src="/images/tw.jpg"></a></li>
              <li><a href="/contacto.php">contacto</a></li>
            </ul>
          </div>
          <div class="clear"></div>
        <!-- NEWSLETTER SMARTPHONE -->
          <div class="smartphone_news">
          <p>Suscribirse al Newsletter:</p><div class="clear"></div>
          <form>
            <input type="submit" class="submit_news" value=""/><input type="text" class="input_news" placeholder="Ingrese su email" value=""/>
          </form>
        </div>						
 	</div><!--content-->

<?php include('_footer.php');?>	
</div><!--wrapper-->


  <!-- jQuery -->
	<script src="/js/jquery-v-1-11-1.min.js"></script>
    <!--<script src="js/jquery.min.js"></script>-->
  <!-- FlexSlider -->
  <script defer src="/js/jquery.flexslider.js"></script>

  <script type="text/javascript">
    $(function(){
      SyntaxHighlighter.all();
    });
    $(window).load(function(){
      $('.flexslider').flexslider({
        animation: "slide",
        start: function(slider){
          $('body').removeClass('loading');
        }
      });
    });
  </script>

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
<div style="display:none">
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
</div>
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
<!DOCTYPE HTML>
<?php $pagina = 'contacto';?>
<html lang="es">
	<!--<![endif]-->

<?php include('_head.php');?>
<title>MP | contacto</title>
<body>
<div class="wrapper">
 	<div class="content">
			<?php include('_header.php');?>	
			<div class="content_page content_page_contacto" style="margin-top:5px;">
					<h1 class="h_contacto">Contacto</br>
			  </h1>					
					<div class="contacto_datos">
						<ul>
							<li><strong><span style="font-size:17px; margin-bottom:5px">Call Center:</span></strong></li>
                            <li>Tel.: 2711 1000*</li>
					    
							<li>Coordinación | Opción 2</li>
							<li>Atención al socio | Opción 3</li>
							<li>Farmacia | Opción 4</li>
							<li>Clínicas | Opción 5</li>
							<li>Afiliaciones | Opción 6 </li>
							<li>Administración | Opción 7</li>
						</ul>
						<ul>
						  <li><strong><span style="font-size:17px; margin-bottom:5px">Emergencias:</span></strong></li>
							<li>Servicio de emergencia médica móvil en Montevideo y Costa de Oro SEMM. Tel.: 159</li>
					  </ul>
					  
					  <ul>
					    <li><span style="font-size:17px; margin-bottom:5px">Clínicas:</span>	
					     
					        <li><strong>Clínica Setiembre</strong></li>
					        <li>Tel.: 2711 1000 Op. 5 Int. 1</li>
					        <li></li>
				          </ul>
					      <ul>
					        <li><strong>Clínica Golf</strong></li>
					        <li>Tel.: 2711 1000 Op. 5 Int. 2</li>
					        <li></li>
				          </ul>
					      <ul>
					        <li><strong>Clínica Carrasco</strong></li>
					        <li>Tel.: 2711 1000 Op. 5 Int. 3</li>
					      </ul>
					    
                     <ul>
                        <li><strong><span style="font-size:17px; margin-bottom:5px">Asistencia en viaje:</span></strong></li>
                        <li>Tel.: (+598) 2711 4444 – 2710 1795</li>
                      </ul>
                      <ul>
                        <li> </li>
                      </ul>
              </div><!-- contacto datos -->
					<div class="contacto_datos">
					  <ul>
					    <li><strong><span style="font-size:17px; margin-bottom:5px">Maldonado:</span></strong></li>
					 
                        <li><strong>Consultorios Médicos Roosevelt</strong></li>
                        <li>Tel.: 4249 8849 </li>
                      </ul>
                      <ul>
                        <li><strong>Sanatorio SEMM-Mautone</strong></li>
                        <li>Tel.: 4222 5474</li>
                      </ul>
                      <ul>
                        <li><strong>Red de Centros Asistenciales de Sanatorio SEMM-Mautone </strong>(Maldonado, San Carlos, Piriápolis, Pan de Azúar y Aiguá)</li>
                        <li>Tel.: 4222 5353</li>
                      </ul>
                      <ul>
                        <li><strong>Servicio de Emergencia Móvil - Cardiomóvil<br>
                        </strong> Tel.: 4222 9000</li>
                      </ul>
                      <ul>
                        <li><strong>Urgencias odontológicas - SEMM Odontología<br>
                        </strong> Tel.: 4222 9000</li>
                      </ul>						
					</div><!-- contacto datos -->

					<div class="contacto_datos">					
						<ul>
						  <li><strong><span style="font-size:17px; margin-bottom:5px">Direcciones de e-mail:</span></strong></li>
							<li><strong>Coordinación  </strong></li>
							<li><a href="mailto:coordinacion@mp.com.uy">
                            coordinacion@mp.com.uy</a></li>
							<li><strong>Atención al socio</strong></li>
							<li><a href="mailto:atencion.socios@mp.com.uy">atencion.socios@mp.com.uy</a></li>
							<li><strong>Afiliaciones</strong></li>
							<li><a href="mailto:informes@mp.com.uy">informes@mp.com.uy</a></li>
							<li><strong>Dirección Técnica</strong></li>
							<li><a href="mailto:direcciontecnica@mp.com.uy">direcciontecnica@mp.com.uy </a></li>
						</ul>
					</div><!-- contacto datos -->

					<!--<div class="contacto_form">					
						<form class="forms_info" novalidate id="myform" method="POST" action="/contactoMail.php">
							<label>Nombre<sup>*</sup>:</label>
						  <input type="text" name="nombre" minlength="3">
							<label>E-mail*:</label>
						  <input type="text" name="email" minlength="9">
							<label>Teléfono:</label>
							<input type="text" name="telefono">
							<label>Empresa:</label>
							<input type="text" name="empresa">							
							<label>Mensaje*:</label>
							<textarea rows="10" name="mensaje" minlength="10"  maxlength="1000" style="resize: vertical"></textarea>
							<span>*Campos Obligatorios</span><div class="clear"></div>


							
							<input type="submit" class="submit" value="enviar">
						</form>
                        <br>
                        Su mensaje será enviado a informes@mp.com.uy.
					</div>-->
			</div><!-- content page -->

<script src="/js/jquery_002.js"></script>
<!--<script> 

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
</script>-->

					
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
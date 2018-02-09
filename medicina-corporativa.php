<!DOCTYPE HTML>
<?php $pagina = 'medicina-corporativa';?>
<html lang="es">
	<!--<![endif]-->

<?php include('_head.php');?>
<title>MP | Medicina Corporativa</title>
<body>
<div class="wrapper">
 	<div class="content">
			<?php include('_header.php');?>	
			<?php include('_menu_planes.php');?>	
			<div class="content_page">
				<img src="/images/corporativo.jpg" class="images_top">
				<div class="content_text">
					<h1>Medicina Corporativa</h1>
					<p>Medicina Corporativa tiene como objetivo ofrecer asesoramiento médico a las organizaciones con la finalidad de diseñar estrategias para mejorar la calidad de vida de su capital humano, permitiendo así optimizar el rendimiento y el desempeño laboral.</p>
					<p>Nuestros productos abarcan un amplio margen de opciones destinadas a implementar actividades de evaluación, prevención y capacitación, las cuales se ajustan a las necesidades y características de cada organización. </p>
					<p>A continuación se detalla cada uno de los módulos y las actividades con los que cuenta Medicina Corporativa para conformar un programa de salud y bienestar:</p>
					<ul>
						<li><span>&#8226;</span>Módulo I. Servicios Corporativos: chequeos generales, multidisciplinarios,  personalizados</li>
						<li><span>&#8226;</span>Módulo II. Relax – Workshops para manejo del estrés </li>
						<li><span>&#8226;</span>Módulo III. RCP y Primeros Auxilios</li>
						<li><span>&#8226;</span>Módulo IV. Vida Sana –Asesoramiento en Nutrición, Deporte y Salud</li>
						<li><span>&#8226;</span>Módulo V. Tabaquismo: Pulmones Sanos</li>
						<li><span>&#8226;</span>Módulo VI. Cuidados de la Mujer – Plan corporativo de embarazo y lactancia</li>
						<li><span>&#8226;</span>Módulo VII. Evaluación de Factores de Riesgo - Planificación y Coordinación de Evaluación Periódica Preventiva del estado de Salud de los Empleados </li>
						<li><strong>Módulos Opcionales</strong></li>
						<li><span>&#8226;</span>Servicio de Vacunación</li>
						<li><span>&#8226;</span>Asesoramiento Ergonómico</li>
						<li><span>&#8226;</span>Capacitaciones</li>
						<li><span>&#8226;</span>Gestión Sanitaria del Capital Humano (certificaciones médicas, carné de salud laboral, evaluaciones pre-ocupacionales)</li>
					</ul>
					<p>Para contactarnos o solicitar más información complete el siguiente formulario:</p>
					<form class="forms_info cols" novalidate id="myform" method="POST" action="https://www.mp.com.uy/corporativaMail.php">
						<label>Nombre<sup>*</sup>:</label>
						<input type="text" name="nombre" minlength="3">
						<label>Apellido<sup>*</sup>:</label>
						<input type="text" name="apellido" minlength="3">
						<label>Email<sup>*</sup>:</label>
						<input type="email" required  name="email" minlength="9">
						<label>Teléfono:</label>
						<input type="text" name="telefono">
						<label>Empresa:</label>
						<input type="text" name="empresa">						
						<label>Mensaje:</label>
						<textarea rows="10" name="mensaje" minlength="10"  maxlength="150" style="resize: vertical"></textarea>
						<span>*Campos Obligatorios</span><div class="clear"></div>
						<input type="submit" class="submit" value="enviar">
					</form>
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
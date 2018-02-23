<?php
session_start();
$isPost = false;
$formIsValid = true;
$captchaIsValid = true;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	include_once $_SERVER['DOCUMENT_ROOT'] . '/securimage/securimage.php';
	$securimage = new Securimage();
	$isPost = true;
	$name = isset($_POST['nombre']) ? $_POST['nombre'] : "";
	$last_name = isset($_POST['apellido']) ? $_POST['apellido'] : "";
	$email = isset($_POST['email']) ? $_POST['email'] : "";
	$celular = isset($_POST['celular']) ? $_POST['celular'] : "";
	$mensaje = isset($_POST['mensaje']) ? $_POST['mensaje'] : "";
	if(empty($name) || empty($last_name) || empty($email) || empty($celular) || empty($mensaje)){
		$formIsValid = false;
	}else{
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$formIsValid = false;
		}
	}
	if ($securimage->check($_POST['captcha_code']) == false) {
		$formIsValid = false;
		$captchaIsValid = false;
	}
	if($formIsValid):
		$body = '

		        <table cellpadding="0" cellspacing="0" width="500px" style="border:none;" align="left">
		            <tr>
		                <td><img src="http://mp.com.uy/images/cabezal-mail.jpg" style=margin-bottom:10px;></td>
		            </tr>
		                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Nombre: <span style="font-weight:normal">'.$name.'</span></td>
		            </tr>
		            <tr>
		                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Apellido: <span style="font-weight:normal">'.$last_name.'</span></td>
		            </tr>
		            <tr>
		                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Mail: <span style="font-weight:normal">'.$email.'</span></td>
		            </tr>
		            <tr>
		                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Tel&eacute;fono: <span style="font-weight:normal">'.$celular.'</span></td>
		            </tr>
		           <tr>
		                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Mensaje: <span style="font-weight:normal">'.$mensaje.'</span></td>
		            </tr>
		        </table>';

		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		$headers .= 'From: Medicina Personalizada <informes@mp.com.uy><luis.brando@mp.com.uy>';
		$headers .= "\r\n";
		//mail('informes@mp.com.uy,luis.brando@mp.com.uy,crm@mp.com.uy', 'Asesoramiento', $body, $headers);
		?>
		<!DOCTYPE HTML>
		<?php $pagina = 'asesoramiento';?>
		<html lang="es">
		    <!--<![endif]-->

		<?php include('_head.php');?>
		<title>MP | Asesoramiento</title>
		<body>
		<div class="wrapper">
		    <div class="content">
		            <?php include('_header.php');?> 
		            <?php include('_menu_planes.php');?>    
		            <div class="content_page">
		                <div class="content_text" style="margin-top:10px;">
		                    <h1>Solicitud de Información</h1>
		                    <p>Su mensaje ha sido enviado exitosamente.</br>Muchas gracias.</p>

		                </div><!-- content text -->
		            </div><!-- content page -->

		                    
		    </div><!--content-->

		<?php include('_footer.php');?> 
		</div><!--wrapper-->

		<!-- Google Code for Formulario Corralito Conversion Page -->
		<script type="text/javascript">
		/* <![CDATA[ */
		var google_conversion_id = 972005586;
		var google_conversion_language = "en";
		var google_conversion_format = "2";
		var google_conversion_color = "ffffff";
		var google_conversion_label = "LmpCCJnfllkQ0sG-zwM";
		var google_remarketing_only = false;
		/* ]]> */
		</script>
		<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
		</script>
		<noscript>
		<div style="display:inline;">
		<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/972005586/?label=LmpCCJnfllkQ0sG-zwM&amp;guid=ON&amp;script=0"/>
		</div>
		</noscript>

		<!-- Google Code for Formulario Corralito Conversion Page end -->

		<!-- Facebook Conversion Code for MP -->
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
		})();
		window._fbq = window._fbq || [];
		window._fbq.push(['track', '6020470126842', {'value':'0.00','currency':'USD'}]);
		</script>
		<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6020470126842&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript>
		<!-- Facebook Conversion Code for MP end -->

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
		<?php
	endif;
}
?>
<?php 
if(!$isPost || !$formIsValid):
?>
<!DOCTYPE HTML>
<?php $pagina = 'asesoramiento';?>
<html lang="es">
	<!--<![endif]-->

<?php include('_head.php');?>
<title>MP | Asesoramiento</title>
<body>
<div class="wrapper">
 	<div class="content">
			<?php include('_header.php');?>	
			<?php include('_menu_planes.php');?>	
			<div class="content_page">
            		<img src="/images/asesoramiento.jpg" class="images_top">
				<div class="content_text" style="margin-top:10px;">
					<h1>¡En MP tenés un plan para vos!</h1>
					<p>Cada plan está diseñado de acuerdo a tus necesidades y las de tu familia. Nuestra atención personalizada y alta calidad asistencial te aseguran la tranquilidad que necesitás para disfrutar tu vida al máximo.</strong></p>
                    <p>Como cada persona es única, cada respuesta también lo es. Completá el formulario y nos contactaremos contigo para contarte los planes personalizados que tenemos para vos y tu familia.</strong></p>
                    <?php if(!$formIsValid): ?>
                    	<h3>Revise los campos del formulario</h3>
                    <?php endif; ?>
					<form class="forms_info cols" novalidate id="myform" method="POST" action="asesoramiento.php">
						<label>Nombre<sup>*</sup>:</label>
						<input type="text" name="nombre" minlength="3">
						<label>Apellido<sup>*</sup>:</label>
						<input type="text" name="apellido" minlength="3">
						<label>Email<sup>*</sup>:</label>
						<input type="email" required  name="email" minlength="9">
						<label>Celular<sup>*</sup>:</label>
						<input type="text" name="celular" minlength="9">
						<label>Mensaje<sup>*</sup>:</label>
						<textarea rows="10" name="mensaje" minlength="10"  maxlength="150" style="resize: vertical"></textarea>
						<span>*Campos Obligatorios</span><div class="clear"></div>			
						<div class="captcha">
							<img id="captcha" src="/securimage/securimage_show.php" alt="CAPTCHA Image" />
							<input type="text" name="captcha_code" size="10" maxlength="6" />
							<a href="#" onclick="document.getElementById('captcha').src = '/securimage/securimage_show.php?' + Math.random(); return false">[ Different Image ]</a>
							<?php if(!$captchaIsValid): ?>
								<span class="captcha_error">Has ingresado incorrectamente la imgaen.</span>
							<?php endif; ?>
						</div>
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
<?php 
endif;
?>

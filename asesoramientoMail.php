<?php

$name = $_POST['nombre'];
$last_name = $_POST['apellido'];
$email = $_POST['email'];
$celular = $_POST['celular'];
$mensaje = $_POST['mensaje'];


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

        // Mail it
mail('informes@mp.com.uy,luis.brando@mp.com.uy,crm@mp.com.uy', 'Asesoramiento', $body, $headers);
        
/*
include("./PHPMailer/class.phpmailer.php");
include("./PHPMailer/class.smtp.php");
        $mail = new PHPMailer();
				$mail->IsSMTP();
				$mail->SMTPAuth = true;
				$mail->SMTPSecure = "tls";
				//$mail->SMTPSecure = "ssl";
				$mail->Host = "relay-hosting.secureserver.net";
				//$mail->Host = "smtp.gmail.com";
				//$mail->Port = 465; // set the SMTP port for the GMAIL server
				//$mail->Port = 587;
                //$mail->Username = 'formulariophp.mail@gmail.com';
                //$mail->Password = '4uthphpm41l';
        $mail->From = 'informes@mp.com.uy,luis.brando@mp.com.uy,crm@mp.com.uy; //$from;
        $mail->FromName = "Medicina Personalizada";
        $mail->Subject = 'Asesoramiento';

        $mail->AltBody = $body;
        $mail->MsgHTML($body);
        $mail->AddAddress('informes@mp.com.uy,luis.brando@mp.com.uy,crm@mp.com.uy', "Destinatario");
        $mail->IsHTML(true);

        if (!$mail->Send()) {
            print_r("Error: " . $mail->ErrorInfo);
            return false;
        }

 */
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
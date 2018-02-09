<?php

$name = $_POST['nombre'];
$email = $_POST['email'];
$tel = $_POST['telefono'];
$empresa = $_POST['empresa'];
$mensaje = $_POST['mensaje'];


$body = '

        <table cellpadding="0" cellspacing="0" width="500px" style="border:none;" align="left">
            <tr>
                <td><img src="http://mp.com.uy/images/cabezal-mail.jpg" style=margin-bottom:10px;></td>
            </tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Nombre: <span style="font-weight:normal">'.$name.'</span></td>
            </tr>
            <tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Mail: <span style="font-weight:normal">'.$email.'</span></td>
            </tr>
            <tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Tel&eacute;fono: <span style="font-weight:normal">'.$tel.'</span></td>
            </tr>
            <tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Empresa: <span style="font-weight:normal">'.$empresa.'</span></td>
            </tr>            
           <tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Mensaje: <span style="font-weight:normal">'.$mensaje.'</span></td>
            </tr>
        </table>';

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: Medicina Personalizada <informes@mp.com.uy>';
$headers .= "\r\n";

        // Mail it
mail('informes@mp.com.uy', 'Contacto desde la web', $body, $headers);
        
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
        $mail->From = 'informes@mp.com.uy; //$from;
        $mail->FromName = "Medicina Personalizada";
        $mail->Subject = 'Contacto desde la web';

        $mail->AltBody = $body;
        $mail->MsgHTML($body);
        $mail->AddAddress('informes@mp.com.uy', "Contacto desde la web");
        $mail->IsHTML(true);

        if (!$mail->Send()) {
            print_r("Error: " . $mail->ErrorInfo);
            return false;
        }

 */



?>

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
            <div class="content_page">
                <div class="content_text" style="min-height:450px;">
                    <h1>Contacto</br> 2711 1000*</h1>
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

<div style="display:none">
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
</div>

<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/972005586/?label=LmpCCJnfllkQ0sG-zwM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>

</body>
</html>

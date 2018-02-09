<?php

$email = $_POST['email'];

$body = '

        <table cellpadding="0" cellspacing="0" width="500px" style="border:none;" align="left">
            <tr>
                <td><img src="http://mp.com.uy/images/cabezal-mail.jpg" style=margin-bottom:10px;></td>
            <tr>
                <td style="font-family:Trebuchet MS; font-weight:bold; font-size:12px; color:#666666; text-align:left; border:none; padding-bottom:10px;">Mail: <span style="font-weight:normal">'.$email.'</span></td>
            </tr>
        </table>';

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: Medicina Personalizada <soporte.web@universal.com.uy>';
$headers .= "\r\n";

        // Mail it
mail('soporte.web@universal.com.uy', 'Suscripcion a newsletter', $body, $headers);
        
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
        $mail->From = 'soporte.web@universal.com.uy; //$from;
        $mail->FromName = "Medicina Personalizada";
        $mail->Subject = 'Suscripcion a newsletter';

        $mail->AltBody = $body;
        $mail->MsgHTML($body);
        $mail->AddAddress('soporte.web@universal.com.uy', "Contacto desde la web");
        $mail->IsHTML(true);

        if (!$mail->Send()) {
            print_r("Error: " . $mail->ErrorInfo);
            return false;
        }

 */
?>
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
            <iframe src="/frontend51/page?1,sitio-principal,mp-mp-login,O,es,0," class="login" id="view_large"></iframe>
            <iframe src="/frontend51/page?1,sitio-principal,mp-mp-login3,O,es,0," class="login" id="view_medium_large"></iframe>
            <iframe src="/frontend51/page?1,sitio-principal,mp-mp-login7,O,es,0," class="login" id="view_small"></iframe>
            <!--<<div class="login">
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
                            <li><a href="/noticias_ampliacion-golf.php"><img src="images/slide2.jpg" /></a></li>
                            <li><a href="/noticias_mi-mp.php"><img src="images/slide3.jpg" /></a></li>
                            <li><a href="/notas-de-interes.php"><img src="images/slide4.jpg" /></a></li>                            
                            <li><a href="/instagram/" target="blank"><img src="images/slide1.jpg" /></a></li>
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
                    <h3>Recomendaciones ante el calor</h3>
                    <p>Recomendaciones del MSP, a través de la Dirección General de la Salud.</p>
                    <a href="/articulos_calor.php">Ver m&aacute;s</a>
                </div>
            </div><!-- block home -->
            <div class="block_home block_home_center">
            <div class="block_home_img">
                <a href="/"><img src="/images/news_2.jpg"></a>
            </div>
                <div class="block_text">
                    <h3>Asistencia en Punta del Este y Maldonado </h3>
                    <p>Contamos con amplia asistencia en Punta del Este y Maldonado.</p>
                    <a href="/noticias_punta-del-este.php">M&aacute;s informaci&oacute;n aqu&iacute;!</a>
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

<?php include('_footer_news.php');?> 
</div><!--wrapper-->


  <!-- jQuery -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
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

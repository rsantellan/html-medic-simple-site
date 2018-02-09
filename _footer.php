<footer>
		<!--<div class="footer_news">
		<p>Suscribirse al Newsletter:</p><div class="clear"></div>
 		<form novalidate id="myform" method="POST" action="http://mp.com.uy/newsletterMail.php" >
 			<input type="submit" class="submit_news" value=""/>
      <input type="email" class="input_news" name="email" minlength="9" placeholder="Ingrese su email"/>
 		</form>
	</div>-->
	<div class="footer_datos">
		<p>MP Medicina Personalizada - Tel.: 2711 1000</br>
	    <strong><em>Líderes en medicina privada</em></strong> </br>Administración Central: Av. Ricaldoni 2452 esq. Campbell - Montevideo, Uruguay - <a href="mailto:informes@mp.com.uy?subject=contacto desde la web">informes@mp.com.uy</a></p>
	</div>	
	<div class="footer_logos"> <a href="/politica-de-calidad.php"><img src="/images/logos_footer.jpg"></a>
	</div>
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
    offset: [0, 0],
    message: '<div class="error_news"><em/></div>' // em element is the arrow
});
</script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-3126352-27', 'auto');
  ga('send', 'pageview');

</script>
</footer>
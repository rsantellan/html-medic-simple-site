<footer>
		<div class="footer_news">
		<p>Suscripción realizada con éxito.</p><div class="clear"></div>
	</div>
	<div class="footer_datos">
		<p>MP Medicina Personalizada - Tel.: 2711 1000</br>Administración Central: Av. Ricaldoni 2452 esq. Campblell - Montevideo, Uruguay - <a href="mailto:informes@mp.com.uy?subject=contacto desde la web">informes@mp.com.uy</a></br>Optimizado para IE 7+, Firefox 3+, Chrome 4+.</p>
	</div>	
	<div class="footer_logos">
			<img src="/images/logos_footer.jpg">
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
</footer>
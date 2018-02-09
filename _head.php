	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<META NAME="Author" CONTENT="MJF. Comunicación">
		<META NAME="Description" CONTENT="En MP ofrecemos atención médica personalizada, somos líderes en medicina privada. Conocé nuestros planes únicos, como vos.">
		<META NAME="Keywords" CONTENT="mp, medicina personalizada, seguro médico, semm, clínicas, asistencia médica, medicina privada, uruguay, tecnología, historia clínica">
		<META NAME="Language" CONTENT="Spanish">
		<META NAME="Revisit" CONTENT="7 days">
		<META NAME="Distribution" CONTENT="Global">
		<META NAME="Robots" CONTENT="All">
		<meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0"/>
		
        <!--App para IPhone-->
<meta name="apple-itunes-app" content="app-id=559802070">
        
        
        <link href='/css/fonts.css' rel='stylesheet' type='text/css'>
		<!--<link rel="stylesheet" type="text/css" href="/source/jquery.fancybox.css?v=2.1.5" media="screen" />-->

		
        <!-- css -->
		<link rel="stylesheet" type="text/css" href="/css/screen_styles.css" />

		<link rel="stylesheet" type="text/css" href="/css/screen_layout_large.css" />
			<!-- ipad horizontal -->
		<link rel="stylesheet" type="text/css" media="only screen and (min-width:769px) and (max-width:1024px)" href="/css/screen_layout_1024.css">
			<!-- iphone horizonal & ipad vertical -->
		<link rel="stylesheet" type="text/css" media="only screen and (min-width:601px) and (max-width:768px)" href="/css/screen_layout_768.css">
		<link rel="stylesheet" type="text/css" media="only screen and (min-width:481px) and (max-width:600px)" href="/css/screen_layout_600.css">
				<link rel="stylesheet" type="text/css" media="only screen and (min-width:321px) and (max-width:480px)" href="/css/screen_layout_480.css">
			<!-- iphone vertical -->
		<link rel="stylesheet" type="text/css" media="only screen and (min-width:50px) and (max-width:320px)" href="/css/screen_layout_320.css">
		<!-- fonts -->
		<link rel="stylesheet" type="text/css" href="/css/stylesheet.css" />
		<!-- menu -->
		<link rel="stylesheet" type="text/css" media="screen, projection" href="/css/flexnav.css" >
		<!-- slider -->
		<link rel="stylesheet" type="text/css" media="screen" href="/css/flexslider.css" />

		<!-- videos -->
		    <link href="/assets/prism.css" media="all" rel="stylesheet" type="text/css">
		    <link href="/dist/lity.css" rel="stylesheet"/>

			<script src="vendor/jquery.js"></script>
			<script src="dist/lity.js"></script>

			<script src="assets/prism.js"></script>

		<!-- html5 snippet -->
		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<!-- favicon & fonts -->
		<link rel="shortcut icon" href="/images/favicon.ico" />

		<!-- js -->
		<script src="/js/libs/modernizr-2.0.6.min.js"></script>


		<!-- jQuery library (served from Google) -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
		<!-- bxSlider Javascript file -->
		<script src="/js/jquery.bxslider.min.js"></script>
		<!-- bxSlider CSS file -->
		<link href="/css/jquery.bxslider.css" rel="stylesheet" />
<script src="https://www.google.com/recaptcha/api.js" async defer></script>


		<!-- menu -->
 		<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
 		<script src="js/jquery.min.js"></script>-->
    	<script type="text/javascript">
      //$.noConflict();
	    </script>
	    <script src="/js/jquery.flexnav.js" type="text/javascript"></script>
	    <script type="text/javascript">
			
			var Video = {};

			Video.videoControls = function() {
				var $v = $('#video'),
					$play_button = $(".controls button");			
				$v.get(0).volume=0;
				$play_button.hide();
			  	$play_button.on("click", function() {
					if ( $(this).hasClass("play") ) {
						$v.get(0).play();
						$(this).removeClass("play").addClass("pause");
					} else if ( $(this).hasClass("pause") ) {
						$v.get(0).pause();
						$(this).removeClass("pause").addClass("play");
					}
				});

			    if ($v.attr('controls') !== 'true') {
			        $v.attr('controls', 'true');                    
			    }
			    $v.get(0).play();
			    $v.removeAttr('controls');
				$v.on("timeupdate", function() {
					if ($v.get(0).duration > 0) {
				        setTimeout(function() {
				          $play_button.fadeIn('slow');
				        }, 2000);				
					}
				});
			};

			jQuery(document).ready(function($) {
				// initialize video
				Video.videoControls();
				
				// initialize FlexNav
				$(".flexnav").flexNav();
			});
			
	    </script>

	</head>

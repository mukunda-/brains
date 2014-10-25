<?php

if( file_exists( 'build.php' ) ) {
	include_once 'build.php';
}

?>

<!DOCTYPE html>
<html>
	<head>
	
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
		
		<?php
		
			function IncludeShader( $id, $type, $file ) {
				echo "<script id=\"$id\" type=\"x-shader/x-$type\">";
				readfile( $file );
				echo '</script>';
			}
			
			IncludeShader( 'shader-fs', 'fragment', 'shader/fragment.glsl' );
			IncludeShader( 'shader-vs', 'vertex', 'shader/vertex.glsl' );
			IncludeShader( 'shader-lines-f', 'fragment', 'shader/lines.f.glsl' );
			IncludeShader( 'shader-lines-v', 'vertex', 'shader/lines.v.glsl' );
		?>
		
		
		<!-- Google Analytics -->
		<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-52426023-4', 'auto');
		ga('send', 'pageview');

		</script>
		<!-- End Google Analytics -->
		
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400' rel='stylesheet' type='text/css'>
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="build/scripts.js"></script>
		
		<link rel="stylesheet" href="css/style.css" type="text/css">
		<title>The Word Nebula</title>
	</head>
	
	<body>
		<div id="canvas_box">
			<canvas id="glcanvas">
			</canvas>
		</div>
		<div class="info topleft">
			the word nebula | powered by <a href="http://wordex.link">the wordex</a>
		</div>
		<div id="loading"><div><div>loading...</div></div></div>
		
		<div class="info control" id="statusbar">
			
		</div>
	</body>
</html>
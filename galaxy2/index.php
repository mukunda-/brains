<!DOCTYPE html>
<html>
	<head>
	
		<meta charset="UTF-8">
		
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
	 
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="js/jquery.mousewheel.min.js"></script>
		<script src="js/sylvester.js"></script>
		<script src="js/hc.js"></script>
		<script src="js/texture.js"></script>
		<script src="js/shader.js"></script>
		<script src="js/hc_packer.js"></script>
		<script src="js/buffer.js"></script>
		<script src="js/source.js"></script>
		<script src="js/galaxy2.js"></script>
		<link rel="stylesheet" href="css/style.css" type="text/css">
		<title>galaxy2</title>
	</head>
	
	<body>
		<canvas id="glcanvas">
		</canvas>
	</body>
</html>
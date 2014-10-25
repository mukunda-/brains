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
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400' rel='stylesheet' type='text/css'>
		
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
		<!-- todo...
		<div class="info control">
			Search: <input id="control_search"> <div id="search_result">
		</div> -->
	</body>
</html>
<!DOCTYPE html>
<html>
	<head>
	
		<meta charset="UTF-8">
		<script id="shader-fs" type="x-shader/x-fragment">
			<?php readfile( "shader/fragment.glsl" ); ?>
		</script>
		<script id="shader-vs" type="x-shader/x-vertex">
			<?php readfile( "shader/vertex.glsl" ); ?>
		</script>

		<script src="js/sylvester.js"></script>
		<script src="js/hc.js"></script>
		<script src="js/shader.js"></script>
		<script src="js/buffer.js"></script>
		<script src="js/galaxy2.js"></script>
		<link rel="stylesheet" href="css/style.css" type="text/css">
		<title>galaxy2</title>
	</head>
	
	<body onload="start()">
		<canvas id="glcanvas">
		</canvas>
	</body>
</html>
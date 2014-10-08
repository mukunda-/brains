<?php

namespace Brains;

if( !file_exists( '.htaccess' ) ) {

	$apath = $config->AbsPath();
	file_put_contents( '.htaccess',
	
"
Options +FollowSymLinks
RewriteEngine On
RewriteRule ^([a-z\-]+)$ $apath [L,QSA] 
"

	);

}

?>
<?php

if( !file_exists( '.htaccess' ) ) {

	$apath = $config->AbsPath();
	file_put_contents( '.htaccess',
	
"
Options +FollowSymLinks
RewriteEngine On
RewriteRule ^([0-9a-z]+)$ $apath [L,QSA] 
"

	);

}

?>
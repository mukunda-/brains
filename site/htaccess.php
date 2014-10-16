<?php

namespace Brains;

if( !file_exists( '.htaccess' ) ) {

	$apath = GetDocumentRoot();
	file_put_contents( '.htaccess',
	
"
Options +FollowSymLinks
RewriteEngine On
RewriteRule ^([a-z+-]+)$ $apath [L,QSA] 
"

	);

}

?>
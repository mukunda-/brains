<?php

namespace Brains;

require_once 'core.php';
require_once 'htaccess.php';

if( !file_exists( "logs" ) ) {
	mkdir( "logs", 0700 );
} else {
	chmod( "logs", 0700 );
}

chmod( "template", 0700 );
if( file_exists( "dev" ) ) {
	chmod( "dev", 0700 );
}

if( file_exists( "css" ) ) {
	chmod( "css", 0700 );
}
if( file_exists( ".sass-cache" ) ) {
	chmod( ".sass-cache", 0700 );
}

echo 'okay.';

?>
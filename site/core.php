<?php

require_once 'common.php';

spl_autoload_register( function( $class ) {
	$class = strtolower( $class );
	include "classes/$class.php";
	
});

?>
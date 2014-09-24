<?php

function Swap( &$a, &$b ) {
	$c = $a;
	$a = $b;
	$b = $c;
}

?>
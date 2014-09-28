<?php

require_once "svg.php";

$svg = new SVG( 'img/person - Copy.svg' );

$svg->SetID("");
$svg->SetAttribute( "style", "fill: red" );
$svg->Output();
?>
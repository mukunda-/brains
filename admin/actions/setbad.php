<?php

namespace Brains;
chdir('..');
require_once 'core.php';

/*
  setbad.php
  POST['thought'] = thought string
  POST['bad'] = badness
*/

if( !isset( $_POST['thought'] ) ) exit();
if( !isset( $_POST['bad'] ) ) exit();

$bad = intval( $_POST['bad'] );
if( $bad < 0 || $bad > 3 ) exit( "bad bad." );

$thought = Thought::Scrub( $_POST['thought'] );

if( $thought === FALSE ) exit( 'bad thought.' );

$thought = Thought::Get( $thought, true );
$thought->SetBadness( $bad );

exit( 'badness set.' );

?>
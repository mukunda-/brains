<?php

/*
  recover.php
  
  GET (
    id: ticket id
	code: login code
  )
  
  Sign in using a login ticket
  
*/

namespace Brains;

require_once 'core.php';

function Invalid() {
	header( "Location: ./invalid_ticket.html");
	exit();
}

if( !CheckArgsGET( 'id', 'code' ) ) Invalid();

if( !User::UseLoginTicket( $_GET['id'], $_GET['code'] ) ) Invalid();

header( "Location: ." );

?>
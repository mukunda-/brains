<?php

namespace Brains;
chdir('..');
require_once 'core.php';

/*
	prune.php
	
	POST['list'] = comma separated list of link ids to prune
	
*/
if( !isset($_POST['list']) ) exit();

$list = $_POST['list'];
 

$db = \SQLW::Get();

$db->RunQuery( "DELETE FROM Links WHERE id IN ( $list )" );

echo 'okay.';

?>
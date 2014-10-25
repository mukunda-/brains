<?php

namespace Brains;
require_once 'core.php';

PrintHead();
 

$user = intval($_GET['user']);
if( $user == 0 ) die();

$db = \SQLW::Get();

$result = $db->RunQuery( 
	"SELECT T1.phrase AS source, T2.phrase AS dest, L.time FROM Links L
	LEFT JOIN Thoughts T1 ON T1.id = L.thought1
	LEFT JOIN Thoughts T2 ON T2.id = L.thought2
	WHERE L.creator = $user" );
	
echo '<table>';
while( $row = $result->fetch_assoc() ) {
	$time = date( 'm/d/y h:i:s', $row['time'] );
	echo "<tr><td>$row[source]</td><td>$row[dest]</td><td>$time</td></tr>";
}
echo '</table>';

 
 
PrintFoot();

?>
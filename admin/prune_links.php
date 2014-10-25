<?php

namespace Brains;
require_once 'core.php';

PrintHead();

?>

<style>
	body {
		font-family: verdana;
		font-size: 24px;
	}
	
	td {
		padding: 4px;
	}
</style>

<?php

$start = isset( $_GET['start'] ) ? $_GET['start'] : 0;
if( $start < 0 ) $start = 0;
$limit = 200;

$db = \SQLW::Get();

$result = $db->RunQuery( 
	"SELECT L.id AS id, T1.phrase AS source, T2.phrase AS dest, score, L.time  AS time
	FROM Links L
	LEFT JOIN Thoughts T1 ON T1.id = L.thought1
	LEFT JOIN Thoughts T2 ON T2.id = L.thought2
	WHERE L.id >= $start ORDER BY L.id LIMIT $limit" );

echo '<form action="javascript:;" id="pruneform">';

echo '<table>';

while( $row = $result->fetch_assoc() ) {
	echo '<tr>';
	echo '<td><input type="checkbox" class="prunecheck" data-id="'.$row['id'].'"></td>';
	echo "<td> $row[source]</td><td> $row[dest] </td>";
	echo "<td> $row[score]</td><td>" . date( 'm/d/y h:i:s', $row['time'] ) . '</td>';
	echo "</tr>";
}
echo '</table>';
echo '<input type="submit" value="PRUNE.">';
echo '</form>';

if( $start != 0 ) {
	$prev= $start - $limit;
	if( $prev < 0 ) $prev = 0;
	echo '<form action="prune_links.php">';
	echo '<input type="hidden" name="start" value="'.($prev).'">';
	echo '<input type="submit" value="Previous">';
	echo '</form>';
}

echo '<form action="prune_links.php">';
echo '<input type="hidden" name="start" value="'.($start+$limit).'">';
echo '<input type="submit" value="Next">';
echo '</form>';

?>
<script>

$(function() {
	$(".prunecheck").prop( "checked", false );
	
	$("#pruneform").submit( function() {
		
	});
});

</script>

<?php
 
PrintFoot();

?>
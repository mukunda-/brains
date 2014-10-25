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
		cursor: pointer;
		color: #aaa;
	}
	
	td.word {
		padding-left: 32px;
		text-align:right;
		color:#000;
	}
	td.word.right {
		text-align:left;
		padding-left: 4px;
		padding-right: 32px;
	}
		
	
	tr:hover {
		background-color: #dfd;
	}
	
	tr.checked {
		background-color: #fcc;
	}
	
	tr.checked:hover {
		background-color: #fed;
	}
</style>

<?php

$start = isset( $_GET['start'] ) ? $_GET['start'] : 1;
if( $start < 1 ) $start = 1;
$limit = 500;
$maxscore = isset( $_GET['maxscore'] ) ? $_GET['maxscore'] : 35;//

$db = \SQLW::Get();

$result = $db->RunQuery( 
	"SELECT L.id AS id, T1.phrase AS source, T2.phrase AS dest, score, L.time  AS time
	FROM Links L
	LEFT JOIN Thoughts T1 ON T1.id = L.thought1
	LEFT JOIN Thoughts T2 ON T2.id = L.thought2
	WHERE L.id >= $start AND score<$maxscore ORDER BY L.id LIMIT $limit" );
  
echo '<table>';

if( $result->num_rows != 0 ) {

	$min = 99999999;
	$max = 0;

	while( $row = $result->fetch_assoc() ) {
		$min = min( $min, $row['id'] );
		$max = max( $max, $row['id'] );
		
		echo '<tr onclick="toggle(this);" class="prunerow" data-id="'.$row['id'].'">';
		//echo '<td><input type="checkbox"   id="check-'.$row['id'].'"></td>';
		echo "<td > $row[id] </td>";
		echo "<td class='word'> $row[source] </td><td class='word right'> $row[dest] </td>";
		echo "<td> $row[score]</td><td>" . date( 'm/d/y h:i:s', $row['time'] ) . '</td>';
		echo "</tr>";
	}

	echo '</table>'; 
	echo '<button id="formsubmit">PRUNE</button>'; 

	echo "<p>$min -> $max</p>";
} else {
	echo "<p>nothing.</p>";
}
if( $start != 1 ) {
	$prev= $start - $limit;
	if( $prev < 1 ) $prev = 1;
	echo '<form action="prune_links.php">';
	echo '<input type="hidden" name="start" value="'.($prev).'">';
	echo '<input type="submit" value="Previous">';
	echo '</form>';
}
if( $max == 0 ) $max = $start+$limit;
echo '<form action="prune_links.php">';
echo '<input type="hidden" name="start" value="'.($max+1).'">';
echo '<input type="submit" value="Next">';
echo '</form>';

?>
<script>

function toggle(e) {
	$(e).toggleClass("checked");
}

$(function() {
	$(".prunecheck").prop( "checked", false );
	$("#formsubmit").removeAttr( "disabled" );
	
	$("#formsubmit").click( function() {
		$("#formsubmit").attr( "disabled", "disabled" );
		
		var list = [];
		$(".prunerow").each( function() {
			if( $(this).hasClass( "checked" ) ) {
				list.push( $(this).data( "id" ) );
			}
		});
		list = list.join(',');
		alert(list);
		
		$.post( "actions/prune.php", { list: list } )
			.done( function(data) {
				alert(data);
				if( data == "okay." ) {
					window.location.href = "prune_links.php?start=<?php echo $max; ?>";
				} else {
					$("#formsubmit").removeAttr( "disabled" );
				}
			})
			.fail( function() {
				alert( "failed!" );
				
				$("#formsubmit").removeAttr( "disabled" );
			});
	});
});

</script>

<?php
 
PrintFoot();

?>
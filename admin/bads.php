<?php

namespace Brains;
require_once 'core.php';

PrintHead();

?>

<form id="thoughtform">
<input type="text" placeholder="thought" id="thought">
<input type="text" placeholder="badness" id="badness">
<input type="submit" id="submit">
</form>

<script>

$( function() {
	
	$("#thoughtform").submit( function() {
		$("#submit").attr( "disabled", "disabled" );
		
		$.post( "actions/setbad.php", {
			thought: $("#thought").val(),
			bad: $("#badness").val()
		})
		.done( function( data ) {
			alert( data );
		})
		.fail( function() {
			alert( "error." );
		})
		.always( function() {
			$("#submit").removeAttr( "disabled" );
		});
		return false;
	});
});

</script>
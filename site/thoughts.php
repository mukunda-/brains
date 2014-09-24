<?php

final class Thoughts {
	
	
/** ---------------------------------------------------------------------------
 * Parse a thought name from a string.
 *
 * Converts dashes into spaces and rejects any invalid characters.
 *
 * " this-thing   and that-thing" -> "this thing and that thing"
 *
 * @return string|false Clean/Valid thought or FALSE if the input is invalid.
 */
public static function Parse( $string ) {
	
	if( !preg_match( $string, '/$[a-z -]+$/' ) ) {
		return FALSE;
	}
	
	$string = str_replace( '-', ' ', $string );
	$string = trim(preg_replace( '/[ ]+/', ' ' ));
	
	if( strlen($string) == 0 ) return FALSE;
	
	return $string;
}

}

?>
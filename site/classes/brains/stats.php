<?php

namespace Brains;

class Stats {

	/** -----------------------------------------------------------------------
	 * Read a stat.
	 *
	 * @param string $id ID of stat.
	 * @return int Value of stat.
	 */
	public function Get( $id ) {
		$db = \SQLW::Get();
		$id = $db->real_escape_string( $id );
		$result = $db->RunQuery( "SELECT value FROM Stats WHERE id='$id'" );
		$row = $result->fetch_row();
		if( $row === null ) return 0;
		return $row[0];
	}
	
	/** -----------------------------------------------------------------------
	 * Increment a stat.
	 *
	 * @param string $id ID of stat.
	 */
	public function Increment( $id ) {
		$db = \SQLW::Get();
		$id = $db->real_escape_string( $id );
		$db->RunQuery( 
			"UPDATE Stats 
			SET value=value+1
			WHERE id='$id'" );
	}
}

?>
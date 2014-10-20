<?php

namespace REMOVED;

/**
 * Manages the recent queries table.
 */
class RecentQueries {

	/** -----------------------------------------------------------------------
	 * Get the most recent queries as an array.
	 *
	 * @return array Array of phrases.
	 */
	public static function GetPhrases() {
		$db = \SQLW::Get();
		
		$result = $db->RunQuery( 
			"SELECT phrase FROM RecentQueries RQ
			LEFT JOIN Thoughts T ON
			RQ.thought=T.id
			ORDER BY RQ.id DESC LIMIT 50" );
		
		$list = [];
		while( $row = $result->fetch_row() ){
			$list[] = $row[0];
		}
		
		return $list;
	}
	
	/** -----------------------------------------------------------------------
	 * Push a new query into the recent queries list.
	 */
	public static function Push( $thought ) {
		$time = time();
		$db = \SQLW::Get();
		$db->RunQuery( 'START TRANSACTION' );
		$db->RunQuery( 
			"DELETE FROM RecentQueries 
			WHERE thought=$thought->id" );
		$db->RunQuery( 
			"INSERT INTO RecentQueries (thought, time) 
			VALUES( $thought->id, $time )" );
		$db->RunQuery( 'COMMIT' );
	}
}

?>
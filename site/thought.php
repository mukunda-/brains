<?php

/** ---------------------------------------------------------------------------
 * Manages a Thought.
 */
final class Thought {

	public $id;
	public $creator;
	public $time;
	public $phrase;
	const MAXLEN = 20;
		
	public function __construct( $id, $phrase, 
								 $creator = null, $time = null ) {
		$this->id = $id;
		$this->phrase = $phrase;
		$this->creator = $creator;
		$this->time = $time;
	}
		
	/** -----------------------------------------------------------------------
	 * Scrub a thought phrase.
	 *
	 * Converts dashes into spaces and rejects any invalid characters.
	 *
	 * " this-thing   and that-thing" -> "this thing and that thing"
	 *
	 * @param  string $phrase Input phrase.
	 * @return string|false   Clean/Valid thought phrase or FALSE 
	 *                        if the input is invalid.
	 */
	public static function Scrub( $phrase ) {
		
		if( !preg_match( '/^[a-z -]+$/', $phrase ) ) {
			return FALSE;
		}
		
		$phrase = str_replace( '-', ' ', $phrase );
		$phrase = trim(preg_replace( '/[ ]+/', ' ', $phrase ));
		
		$len = strlen( $phrase );
		if( $len == 0 || $len > self::MAXLEN ) return FALSE;
		
		return $phrase;
	}

	/** ---------------------------------------------------------------------------
	 * Look up a thought from its phrase.
	 *
	 * For creation, if a user is logged in, the creator will be set to them, 
	 * otherwise NULL.
	 *
	 * @param string $phrase Thought value. Should be Scrubbed.
	 * @param bool   [$create] Create the thought if it doens't exist.
	 * @return Thought|false Thought instance for the phrase given, or FALSE if it
	 *                       doesn't exist yet and $create is FALSE.
	 */
	public static function Get( $phrase, $create = false ) {
		$db = GetSQL();
		// just in case?
		$phrase_sql = $db->real_escape_string( $phrase );
		
		
		$result = $db->RunQuery( 
			"SELECT id,creator,time FROM Thoughts WHERE phrase='$phrase_sql'" );
			
		if( $result->num_rows != 0 ) {
			$row = $result->fetch_row();
			return new self( $row[0], $row[1], $row[2], $phrase );
		}
		
		// thought doesn't exist, create it.
		if( !$create ) return FALSE; // or not.
		
		$time = time();
		$creator = UserAuth::LoggedIn() ? UserAuth::AccountID() : 0;
		
		$db->RunQuery(
			"INSERT IGNORE INTO Thoughts ( creator, `time`, phrase )
			VALUES ( ".($creator ? $creator : 'NULL').", $time, '$phrase_sql')" );
		
		
		if( $db->affected_rows != 0 ) {
			$result = $db->RunQuery( 'SELECT LAST_INSERT_ID()' );
			$row = $result->fetch_row();
			return new self( $row[0], $creator, $time, $phrase );
		}
		
		// someone else created the thought before us.
		$result = $db->RunQuery( 
			"SELECT id,creator,time FROM Thoughts WHERE phrase='$phrase_sql'" );
		
		$row = $result->fetch_row();
		if( $row === FALSE ) throw new Exception( '"something messed up."' );
		
		return new self( $row[0], $row[1], $row[2], $phrase );
	}
	
	/** ---------------------------------------------------------------------------
	 * Scrub and Get a thought.
	 */
	public static function ScrubGet( $phrase ) {
		$phrase = Scrub( $phrase );
		if( $phrase === FALSE ) return FALSE;
		return Get( $phrase, false );
	}
	
	/** ---------------------------------------------------------------------------
	 * Swap two thoughts if the ID of $a is greater than $b's
	 *
	 */
	public static function Order( &$a, &$b ) {
		if( $a->id > $b->id ) Swap( $a, $b );
	}
	
	/** ---------------------------------------------------------------------------
	 * Return TRUE if a Link exists between two thoughts.
	 */
	public static function LinkExists( $a, $b ) {
		self::Order( $a, $b );
		
		$db = GetSQL();
		$result = $db->RunQuery( 
			"SELECT 1 FROM Links 
			WHERE thought1=$a->id AND thought2=$b->id" );
	
		if( $result->num_rows != 0 ) {
			return TRUE;
		}
		return FALSE;
	}
}

?>
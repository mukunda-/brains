<?php

// SQL wrapper with useful query function
// which throws an exception on failure
//
// also provides global instance of database link
//

/** ---------------------------------------------------------------------------
 * mysqli wrapper class
 */
class SQLW extends mysqli {

	// some useful errors
	const ER_DUP_KEY = 1022; // insert failure from duplicate key
	const ER_LOCK_WAIT_TIMEOUT = 1205; // deadlock thing
	const ER_LOCK_DEADLOCK = 1213; // deadlock thing

	private static $db = null;
	
	/** -----------------------------------------------------------------------
	 * Construct with some special sauce.
	 */
	public function __construct( $host, $user, $password, 
								 $database, $flags ) {
		parent::init();
		
		parent::real_connect( $host, $user, $password, $database,
			null, null, $flags );
	}

	/** -----------------------------------------------------------------------
	 * Execute a query and throw an SQLException if it fails.
	 *
	 * @param string $query SQL query to execute.
	 * @return SQL result
	 */
	public function RunQuery( $query ) {
		$result = $this->query( $query );
		if( !$result ) {
			throw new SQLException( 
				$this->errno, "SQL Error: ". $this->error );
		}
		return $result;
	}
	
	/** -----------------------------------------------------------------------
	 * Try executing a function and retrying it if any "normal" errors occur.
	 * 
	 * @param function($db) $function Function to execute.
	 * @param int      $tries Max number of failures to allow.
	 * @return mixed   The return value of $function on success.
	 */
	public function DoTransaction( $function, $tries = 5 ) {
	
		for( ; $tries; $tries-- ) {
			try {
				
				return $function( $this );

			} catch( SQLException $e ) {
				if( $e->code == SQLERR_DEADLOCK ) {
					// try again
					continue;
				}
				
				throw $e;
			}
		}
		
		throw new RuntimeException( "SQL deadlock occurred too many times." );
	}
	
	/** -----------------------------------------------------------------------
	 * Connect to the database or return an existing connection.
	 *
	 * @return MySQLW instance.
	 */
	public static function Get() { 
		if( !$this->db ) {
			$this->db = new MySQLWrapper( 
				SQL_Login::$address, SQL_Login::$username,
				SQL_Login::$password, SQL_Login::$database,
				MYSQLI_CLIENT_FOUND_ROWS );
				
			if( $this->db->connect_errno ) {
				$this->db = null;
				throw new SQLException( 
					(int)$this->db->connect_errno, 
					"SQL Connection Error: ". (int)$this->db->connect_error );
			}
			//$this->db->reconnect = 1;

		}
		return $this->db; 
	}
	
	/** -----------------------------------------------------------------------
	 * Close the current database connection.
	 *
	 * Normally this is handled by the script termination.
	 */
	public static function Close() {
		if( $this->db !== null ) {
			$this->db->close();
			$this->db = null;
		}
	}
}

?>
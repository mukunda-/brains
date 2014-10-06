<?php

// SQL wrapper with useful query function
// which throws an exception on failure
//
// also provides global instance of database link
//

require_once "sql_login.php";

$g_sqldb = null;

define( 'SQL_ER_DUP_KEY', 1022 );
define( 'SQL_ER_LOCK_WAIT_TIMEOUT', 1205 );
define( 'SQL_ER_LOCK_DEADLOCK', 1213 );

/** ---------------------------------------------------------------------------
 * Exception thrown from RunQuery
 */
class SQLException extends Exception {
	public $code; // mysqli errno
	
	public function __construct( $errno, $error ) {	
		$code = $errno;
		parent::__construct( $error );
	}
}

/** ---------------------------------------------------------------------------
 * mysqli wrapper class
 */
class MySQLWrapper extends mysqli {

	/** -----------------------------------------------------------------------
	 * Construct with some special sauce.
	 */
	public function __construct( $host, $user, $password, $database, $flags ) {
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
}

/** ---------------------------------------------------------------------------
 * Connect to the database or return an existing connection.
 *
 * @return MySQLWrapper instance.
 */
function GetSQL() {
	global $g_sqldb;
	if( !$g_sqldb ) {
		$g_sqldb = new MySQLWrapper( 
			$GLOBALS["sql_addr"], $GLOBALS["sql_user"],
			$GLOBALS["sql_password"],$GLOBALS["sql_database"],
			MYSQLI_CLIENT_FOUND_ROWS );
			
		if( $g_sqldb->connect_errno ) {
			$g_sqldb = null;
			throw new SQLException( (int)$g_sqldb->connect_errno, "SQL Connection Error: ". (int)$g_sqldb->connect_error );
		}
		//$g_sqldb->reconnect = 1;

	}
	return $g_sqldb;
}

/** ---------------------------------------------------------------------------
 * Close the current SQL connection.
 *
 * Normally this is handled by the script termination.
 */
function CloseSQL() {
	global $g_sqldb;
	if( $g_sqldb ) {
		$g_sqldb->close();
		$g_sqldb = null;
	}
}

?>
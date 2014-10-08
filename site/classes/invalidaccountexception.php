<?php

/** ---------------------------------------------------------------------------
 * Exception thrown when an account doesn't exist.
 */
class InvalidAccountException extends Exception { 
	public $id; // Account ID that was used.
	
	public function __construct( $id ) {
		$this->id = $id;
		parent::__construct( "Invalid account ID: $id" );
	}

}

?>
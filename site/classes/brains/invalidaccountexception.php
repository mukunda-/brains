<?php

namespace Brains;

/** ---------------------------------------------------------------------------
 * Exception thrown when trying to read from a nonexistant account.
 */
class InvalidAccountException extends \Exception { 
	public $id; // Account ID that was used.
	
	public function __construct( $id ) {
		$this->id = $id;
		parent::__construct( "Invalid account ID: $id" );
	}

}

?>
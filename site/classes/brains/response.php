<?php

namespace Brains;

/**
 * Contains a response for a query script.
 */
class Response {
	public $status;
	public $data = [];
	 
	
	/** -----------------------------------------------------------------------
	 * Send the response and exit the script.
	 *
	 * @param string $status Status to set.
	 */
	public function Send( $status ) {
		$this->status = $status;
		if( empty( $this->data ) ) unset( $this->data );
		echo json_encode( $this );
		exit();
	}
	
	/** -----------------------------------------------------------------------
	 * Send a simple response and exit the script.
	 *
	 * @param string $status Status to set.
	 */
	public static function SendSimple( $status, $data=null ) {
		$response = new Response();
		$this->data = $data;
		$response->Send( $status );
	}
}

?>
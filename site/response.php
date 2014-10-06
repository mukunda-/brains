<?php

class Response {
	public $status;
	public $data = [];
	
	public function __set( $id, $value ) {
		$data[$id] = $value;
	}
	
	public function __get( $id, $value ) {
		return $data[$id];
	}
	
	/** -----------------------------------------------------------------------
	 * Send the response and exit the script.
	 *
	 * @param string $status Status to set.
	 */
	public function Send( $status ) {
		$this->status = $status;
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
		$response->Send( $status );
	}
}

?>
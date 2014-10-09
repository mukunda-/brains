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
		$response->data = $data;
		$response->Send( $status );
	}
	
	/** -----------------------------------------------------------------------
	 * Copy links from an array into data.links
	 *
	 * @param array $links Links returned from ThoughtLink::FindLinks
	 * @param bool $init Initialize/erase the link list.
	 */
	public function CopyLinks( $links, $init=true ) {
		$this->data['links'] = [];

		foreach( $links as $link ) {
			$this->data['links'][] = [ 
				'dest' => $link->dest->phrase,
				'score' => $link->score,
				'vote' => $link->vote
			];
		}
	}
}

?>
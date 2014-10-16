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
	 * Populate a discovery block.
	 *
	 * @param ThoughtLink $link Link to copy. If false, it will clear the 
	 *                          discovery block.
	 */
	public function SetDiscovery( $link ) {
		if( !$link ) {
			if( isset( $this->data['discovery'] ) ) {
				unset( $thisdata['discovery'] );
			}
			return;
		}
		$this->data['discovery'] = [
			'from' => $link->source->phrase,
			'to' => $link->dest->phrase,
			'creator' => $link->creator,
			'creator_nick' => 
				User::ReadAccount( $link->creator, 'nickname' )['nickname'],
			'score' => $link->score,
			'vote' => $link->vote
		];
	}
	
	/** -----------------------------------------------------------------------
	 * Copy links from an array into data.links
	 *
	 * @param array $links Links returned from ThoughtLink::FindLinks
	 * @param bool $init Initialize/erase the link list.
	 */
	public function CopyLinks( $links, $init=true ) {
		if( $init ) {
			$this->data['links'] = [];
		}

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
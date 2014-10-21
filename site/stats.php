<?php

namespace Brains;

require_once 'core.php';

try {
	$response = new Response();
	$response->data['total_links'] = Stats::Get( 'TLINKS' );
	$response->data['good_links'] = Stats::GET( 'GLINKS' );
	$response->data['strong_links'] = Stats::GET( 'SLINKS' );
	//$response->data['perfect_links'] = Stats::GET( 'PLINKS' );
	
	//$response->data['recent_queries'] = RecentQueries::GetPhrases();

	$response->CopyLinks( ThoughtLink::GetRecentList() );
	$response->Send( 'okay.' );
	
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( 'error.' );

?>
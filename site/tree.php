<?php

namespace Brains;


header( "Content-type: application/json" );
header( "Cache-Control: max-age=900" );

//Build the tree of all words

require_once 'core.php';

if( file_exists( 'word_tree.json' ) ) {
	
	if( time() < filemtime( 'word_tree.json' ) + Config::$TREE_REFRESH_TIME ) {
		readfile( 'word_tree.json' );
		exit();
	}
}

class Link {
	public $t;
	public $s;
	public $b;
	
	public function __construct( $to, $score, $bad ) {
		$this->t = (int)$to;
		$this->s = (int)$score;
		$this->b = (int)$bad;
	}
}

class Result {
	public $start;
	public $time;
	public $phrases = [];
	public $links = [];
	
	public function __construct( $starting_word ) {
		$this->start = Thought::Get( $starting_word );
		if( $this->start === FALSE ) die();
		$this->start = $this->start->id;
		
		$db = \SQLW::Get();
		
		$bads = [];

		$result = $db->RunQuery( "SELECT id, phrase, bad FROM Thoughts" );
		while( $row = $result->fetch_row() ) {
			$row[0] = (int)$row[0];
			$this->phrases[ $row[0] ] = $row[1];
			$bads[ $row[0] ] = $row[2];
		}
		
		$result = $db->RunQuery( "SELECT thought1, thought2, score FROM Links" );

		while( $row = $result->fetch_row() ) {
			$row[0] = (int)$row[0];
			$row[1] = (int)$row[1];
			$row[2] = (int)$row[2];
			
			$bad = max( $bads[$row[0]], $bads[$row[1]] );
			
			if( !isset( $this->links[$row[0]] ) ) {
				$this->links[$row[0]] = [];
			}
			$this->links[$row[0]][] = new Link( $row[1], $row[2], $bad ); 
		}
		
		$this->time = time();
	}
}

$result = new Result( 'start' );

$result = json_encode( $result );
file_put_contents( 'word_tree.json', $result );
echo $result;

?>
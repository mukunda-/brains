<?php

namespace Brains;


header( "Content-type: application/json" );

//Build the tree of all words

require_once 'core.php';

if( file_exists( 'word_tree.json' ) ) {
	
	if( time() < filemtime( 'word_tree.json' ) + Config::$TREE_REFRESH_TIME ) {
		readfile( 'word_tree.json' );
		exit();
	}
}

class Link {
	public $to;
	public $score;
	
	public function __construct( $to, $score ) {
		$this->to = (int)$to;
		$this->score = (int)$score;
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

		$result = $db->RunQuery( "SELECT id, phrase FROM Thoughts" );
		while( $row = $result->fetch_row() ) {
			$row[0] = (int)$row[0];
			$this->phrases[ $row[0] ] = $row[1];
		}
		
		$result = $db->RunQuery( "SELECT thought1, thought2, score FROM Links" );

		while( $row = $result->fetch_row() ) {
			$row[0] = (int)$row[0];
			$row[1] = (int)$row[1];
			$row[2] = (int)$row[2];
			
			if( !isset( $this->links[$row[0]] ) ) {
				$this->links[$row[0]] = [];
			}
			$this->links[$row[0]][] = new Link( $row[1], $row[2] );
			/*
			if( !isset( $this->links[$row[1]] ) ) {
				$this->links[$row[1]] = [];
			}
			$this->links[$row[1]][] = new Link( $row[0], $row[2] );*/
		}
		
		$this->time = time();
	}
}

$result = new Result( 'start' );

$result = json_encode( $result );
file_put_contents( 'word_tree.json', $result );
echo $result;

?>
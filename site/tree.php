<?php

namespace Brains;

if( substr(getcwd(),-3) == 'dev' ) {	
	// running from dev folder, change to main
	chdir( '..' );
}

header( "Content-type: application/json" );

//Build the tree of all words

require_once 'core.php';

if( file_exists( 'word_tree' ) ) {
	
	if( time() < filemtime( 'word_tree' ) + Config::$TREE_REFRESH_TIME ) {
		readfile( 'word_tree' );
		exit();
	}
}

$db = \SQLW::Get();

class Result {
	public $start;
	public $phrases = [];
	public $links = [];
}

class Link {
	public $to;
	public $score;
	
	public function __construct( $to, $score ) {
		$this->to = (int)$to;
		$this->score = (int)$score;
	}
}

$tree = new Result;

$tree->start = Thought::Get( "start" );
if( $tree->start === FALSE ) exit();

$result = $db->RunQuery( "SELECT id, phrase FROM Thoughts" );

while( $row = $result->fetch_row() ) {
	$row[0] = (int)$row[0];
	$tree->phrases[ $row[0] ] = $row[1];
}

$result = $db->RunQuery( "SELECT thought1, thought2, score FROM Links" );

while( $row = $result->fetch_row() ) {
	$row[0] = (int)$row[0];
	$row[1] = (int)$row[1];
	$row[2] = (int)$row[2];
	
	if( !isset( $links[$row[0]] ) ) {
		$links[$row[0]] = [];
	}
	$tree->links[$row[0]][] = new Link( $row[1], $row[2] );
	
	if( !isset( $links[$row[1]] ) ) {
		$links[$row[1]] = [];
	}
	$tree->links[$row[1]][] = new Link( $row[0], $row[2] );
}

$tree = json_encode( $tree );

file_put_contents( 'word_tree', $tree );

echo $tree;

?>
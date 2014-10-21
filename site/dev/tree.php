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
		
	}
}

$db = \SQLW::Get();

$phrases = [];

$result = $db->RunQuery( "SELECT id, phrase FROM Thoughts" );

while( $row = $result->fetch_row() ) {
	$phrases[ $row[0] ] = $row[1];
}

$result = $db->RunQuery( "SELECT thought1, thought2 FROM Links" );

$links = [];

while( $row = $result->fetch_row() ) {
	if( !isset( $links[$row[0]] ) ) {
		$links[$row[0]] = [];
	}
	$links[$row[0]][] = $row[1];
	
	if( !isset( $links[$row[1]] ) ) {
		$links[$row[1]] = [];
	}
	$links[$row[1]][] = $row[0];
}
 
$start = Thought::Get( "start" );


$found = [];
$index = 0;
/*
function PrintTree( $id, $level = 0 ) {
	global $phrases, $links, $found;
	
	if( isset($found[$id]) ) return;
	if( $level == 100 ) return;
	$found[$id] = 1;
	
	$phrase = $phrases[$id];
	echo str_repeat( ' ', $level * 2 ) . "- $phrase\n";
	foreach( $links[$id] as $dest ) {
		PrintTree( $dest, $level + 1 );
	}
}*/

function mt_rand_float( $a, $b ) {
	return mt_rand( $a*10000.0, $b * 10000.0) / 10000.0;
}

function Print2( $id, $x=0, $y=0, $fx=0,$fy=0, $angle = 0, $level =0 ) {
	global $phrases, $links, $found, $index;
	
	//if( isset($found[$id]) && $found[$id] > $level - 3 ) return; // only after x levels.
	if( isset($found[$id]) ) {
		//DrawLine( $fx, $fy, $found[$id]['x'], $found[$id]['y'] );
		return; // only 1
	}
	
	$found[$id] = [ "level" => $level, "x" => $x, "y"=>$y ];
	DrawLine( $fx, $fy, $x, $y );
	
	DrawText1( $x, $y, 3, $phrases[$id] );
	if( $level == 3 ) return;
	
	foreach( $links[$id] as $dest ) {
		if( $level == 0 ) {
			$angle = mt_rand( 0, 10000 ) / 10000.0 * 6.28318530717;
		} else {
			$angle += mt_rand_float( -1.0, 1.4 );//mt_rand( 0, 10000 ) / 10000.0 * 6.28318530717;
		}
		$distance = mt_rand( 70, 155 );
		$x2 = $x + cos( $angle ) * $distance;
		$y2 = $y + sin( $angle ) * $distance;
		
		Print2( $dest, $x2, $y2 , $x, $y, $angle, $level+1);
		
	}
}
header( "Content-Type: image/png" );
//header( "Content-Type: text/plain" );

$size = 4000;

$img  = imagecreatetruecolor($size,$size);
$img_lines  = imagecreatetruecolor($size,$size);
$cl_trans = imagecolorallocatealpha( $img, 0, 0, 0, 127 );
$cl_white = imagecolorallocate( $img, 255,255,255 );
$cl_black = imagecolorallocate( $img, 12,12,12 );


$cl_lines_black = imagecolorallocate( $img_lines, 0,0,255 );
$cl_lines_white = imagecolorallocate( $img_lines, 255,255,255 );

imagefill($img, 0, 0, $cl_trans); 
imagefill($img_lines, 0, 0, $cl_lines_black);


Print2( $start->id  );

function DrawLine( $x1, $y1, $x2, $y2 ) {
	global $size;
	$center = $size/2;
	$x1 += $center;
	$y1 += $center;
	$x2 += $center;
	$y2 += $center;
	global $img_lines, $cl_lines_white;
	imageline( $img_lines, $x1, $y1, $x2, $y2, $cl_lines_white );
}

function DrawText1( $x, $y, $size, $str ) {
	global $img, $cl_black, $cl_white;
	
	$widths = [ 3=>7, 5=>10 ];
	$width = $widths[$size];
	
	$center = $GLOBALS['size']/2;
	
	$len = strlen($str);
	imagefilledrectangle( $img, 
		$center + $x - $len * $width/2-2,
		$center + $y - 4,
		$center + $x + $len * $width/2+2,
		$center + $y + 8,
		$cl_white );
	//imagestring( $img, $size, $center + $x-$len*$width/2,$center+ $y,$str,$cl_text);
	imagestring( $img, $size, $center + $x-$len*$width/2,$center+ $y-4,$str,$cl_black);
	
}

function overlay_image ($base, $image)
{
  $h = imagesy($image);
  $w = imagesx($image);
  
  imagealphablending($base, true);
  imagesavealpha($base, true);
  imagecopy($base, $image, 0, 0, 0, 0, $w, $h);
  return $base;
} 

overlay_image( $img_lines, $img );
imagepng( $img_lines );

?>
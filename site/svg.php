<?php

/** ---------------------------------------------------------------------------
 * SVG reader/preprocessor for placing into a document.
 *
 * @author Mukunda Johnson
 */
class SVG {

	private $content;
	
	// <svg> attributes
	private $attributes;
	
	/** -----------------------------------------------------------------------
	 * Initialize an instance with an SVG file.
	 *
	 * @param string $path Path to SVG file to read.
	 */
	public function __construct( $path ) {
		$content = file_get_contents( $path );
		
		$start = strpos( $content, '<svg' );
		if( !$start ) {
			throw new InvalidArgumentException( 'Invalid SVG file.' );
		}
		
		$content = substr( $content, $start );
		
		// will  bork if some string contains >
		$end = strpos( $content, '>' );
		
		$xml = new SimpleXMLElement( substr( $content, 0, $end+1 ) . '</svg>' );
		$content = substr( $content, $end+1 );
		
		//$this->attributes = $xml->attributes;
		
		//print_r( $this->attributes);
		print_r( $xml );
		
		echo htmlspecialchars( $content );
	}
}

?>
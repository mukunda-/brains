<?php

/** ---------------------------------------------------------------------------
 * SVG reader/preprocessor for placing into a document.
 *
 * @author Mukunda Johnson
 */
class SVG {

	private $content;
	
	/** -----------------------------------------------------------------------
	 * Array of attributes to write to the <svg> tag when Echo is used.
	 *
	 */
	public $attributes;
	
	/** -----------------------------------------------------------------------
	 * Initialize an instance with an SVG file.
	 *
	 * @param string $path Path to SVG file to read.
	 * @param bool $preserveid If false, erase any ID present in the svg tag.
	 */
	public function __construct( $path, $preserveid = false ) {
		$content = file_get_contents( $path );
		
		$start = strpos( $content, '<svg' );
		if( $start === FALSE ) {
			throw new InvalidArgumentException( 'Invalid SVG file.' );
		}
		
		$content = substr( $content, $start );
		
		// will  bork if some string contains >
		$end = strpos( $content, '>' );
		
		$xml = new SimpleXMLElement( substr( $content, 0, $end+1 ) . '</svg>' );
		$this->content = substr( $content, $end+1 );
		
		$attr = $xml->attributes();
		foreach( $attr as $k => $v ) {
			$this->attributes[strtolower((string)$k)] = (string)$v;
		}
		
		if( !$preserveid ) {
			$this->SetAttribute( 'id', "" );
		}
	}

	/** -----------------------------------------------------------------------
	 * Set an attribute in the SVG tag. 
	 *
	 * @param string $key Attribute to create/modify/delete.
	 * @param string $value Value to assign to the attribute. Pass an empty
	 *                      value to delete an attribute.
	 */
	public function SetAttribute( $key, $value ) {
		if( empty( $value ) ) {
			if( isset( $this->attributes[$key] ) ) {
				unset( $this->attributes[$key] );
			}
			return;
		}
		
		$this->attributes[$key] = $value;
	}
	
	/** -----------------------------------------------------------------------
	 * Read an attribute in the SVG tag.
	 * 
	 * @param string $key Attribute to read.
	 * @return string|bool The attribute value, or FALSE if it doens't exist.
	 */
	public function GetAttribute( $key ) {
		if( !isset( $this->attributes[$key] ) ) return FALSE;
		return $this->attributes[$key];
	}
	
	/** -----------------------------------------------------------------------
	 * Set the ID for the svg element.
	 *
	 * This sets the id="..." attribute in the svg tag. This may be set
	 * already by the SVG file. If that isn't desired, change it with this
	 * function.
	 *
	 * @param string $id ID to use, or an empty value to erase the ID.
	 */
	public function SetID( $id ) {
		$this->SetAttribute( 'id', $id );
	}
	
	/** -----------------------------------------------------------------------
	 * Set the class for the svg element. 
	 *
	 * @param string $class Class to use. 
	 */
	public function SetClass( $class ) {
		$this->SetAttribute( 'class', $class );
	}
	
	/** -----------------------------------------------------------------------
	 * Output this element.
	 *
	 * This creates an <svg> tag with any custom attributes set and then 
	 * outputs the contents of the SVG file that was loaded.
	 *
	 * @param bool $return Return the html contents rather than using echo().
	 * @return string|nothing The html contents, or nothing if $return
	 *                        is false.
	 */
	public function Output( $return = false ) {
		$content = '<svg ';
		foreach( $this->attributes as $key => $value ) {
			$content .= $key . '="' . str_replace( '"', '\\"', $value ) . '" ';
		}
		$content .= '>' . $this->content;
		
		if( $return ) return $content;
		echo $content;
	}
}

?>
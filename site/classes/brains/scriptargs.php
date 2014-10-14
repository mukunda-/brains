<?php

namespace Brains;

class ScriptArgsException extends \Exception {}

/** 
 * Utility class to validate arguments from a request.
 *
 */
class ScriptArgs {

	private $type_handlers = [];
	
	private static function CheckInt( $value ) {
		$a = intval( $value );
		if( $a == 0 && $value !== "0" ) {
			throw new ScriptArgsException( "Invalid integer." );
		}
		return $a;
	}
	
	private static function CheckThought( $value ) {
		$a = Thought::Scrub( $value );
		if( $a === FALSE ) throw new ScriptArgsException( "Invalid thought." );
		return $a;
	}
	
	/** -----------------------------------------------------------------------
	 * Add a handler to check a type name
	 *
	 * @param string $name Name of type.
	 * @param function $function Function that will validate and process the
	 *                           input.
	 *                 The function accepts a string and returns the desired
	 *                 value or throws ScriptArgsException if the input
	 *                 is invalid.
	 */
	public static function AddType( $name, $function ) {
		type_handlers[$name] = $function;
	}
	
	/** 
	 * Core function for Get and Post, $source being $_GET or $_POST
	 */
	private static function Read( $name, $type, $source, 
								  $optional = false, $default = null ) {
		
		if( !isset( type_handlers[$type] ) ) {
			throw new InvalidArgumentException( "ScriptArgs: Unknown TYPE specified." );
		}
		
		if( !isset( $source[$name] ) ) {
			if( $optional ) {
				return $default;
			} else {
				throw new RuntimeException( 
					"Required script argument is missing." );
			}
		}
		
		$handler = type_handlers[$type];
		
		try {
			$value = $handler( $_GET[$name] );
		} catch( ScriptArgsException e ) {
			throw new RuntimeException( 
				"Script argument is invalid." );
		}
		return $value;
		
	throw_error:
		
	}
	
	/** -----------------------------------------------------------------------
	 * Read an argument. Get() reads a GET argument,
	 * Post() reads a POST argument.
	 *
	 * @param string $name Index into POST request.
	 * @param string $type Type of argument. 
	 *                             Must match a type added with AddType.
	 * @param bool $optional If true, will return the $default value if the
	 *                       argument is missing. Otherwise a runtime error
	 *                       will be thrown.
	 * @param string $default Default value for optional arguments.
	 * @return mixed The argument after processing with the type handler.
	 */
	public static function Get( $name, $type, 
								$optional = false, $default = null ) {
		return Read( $name, $type, $_GET, $optional, $default );
	} 
	public static function Post( $name, $type, 
								 $optional = false, $default = null ) {
		return Read( $name, $type, $_POST, $optional, $default );
	}
	
	/** -----------------------------------------------------------------------
	 * add basic types.
	 */
	public static function init() {
		AddType( "int", self::CheckInt() );
		AddType( "thought", self::CheckThought() );
	}
}

ScriptArgs::init();

// aborted. parsing and validating arguments for a script
// usually contains specific operations.

?>
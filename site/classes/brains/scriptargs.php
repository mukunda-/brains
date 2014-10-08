<?php

class ScriptArgsException extends Exception {}

/** 
 * Utility class to validate arguments from a request.
 *
 */
class ScriptArgs {

	private $type_handlers = [];
	
	private  static function CheckInt
	
	/**
	 * Add a handler to check a type name
	 *
	 * @param string $name Name of type.
	 * @param function $function Function that will validate the type.
	 */
	public static function AddType( $name, $function ) {
		type_handlers[$name] = $function;
	}
	
	/** 
	 * Read a GET argument.
	 *
	 * @param string $name Index into POST request.
	 * @param string $type Type of argument. Must match a type added with AddType.
	 * @param string $default Default value, if this is not set, then the script
	 *                        will exit with an ERROR response if the argument
	 *                        is missing.
	 * @return The argument after processing with the type handler.
	 */
	public static function Get( $name, $type ) {
		
		if( !isset( type_handlers[$type] ) ) {
			throw new InvalidArgumentException( "ScriptArgs: Unknown TYPE specified." );
		}
		
		$handler = type_handlers[$type];
		
		try {
			$value = $handler( $_GET[$name] );
		} catch( ScriptArgsException e ) {
			if( func_num_args >= 3 ) {
				return $default;
			} else {
				Response::SendSimple( "error." );
			}
		}
		return $value;
	}
	
	/** 
	 * Read a POST argument.
	 *
	 * @param $name Index into POST request.
	 * @param $type Type of argument. Must match a type added with AddType.
	 */
	public static function Post( $name, $type ) {
		
	}
	
	public static function init() {
		AddType( "int", self::CheckInt() );
	}
}

ScriptArgs::init();

// aborted. parsing and validating arguments for a script
// usually contains specific operations.

?>
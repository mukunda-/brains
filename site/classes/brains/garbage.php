<?php

namespace Brains;

class Garbage {
	private static $charset;
	private static $count;
	
	public static function init() {
		self::$charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		self::$count = strlen( self::$charset );
	}
	/**
	 * Produce a garbage string.
	 *
	 * @param int $length Number of characters to output.
	 * @return string Garbage string, consisting of $charset.
	 */
	public static function Produce( $length ) {
		$garbage = '';
		for( $i = $length; $i > 0; $i-- ) {
			$garbage .= self::$charset[ mt_rand( 0, self::$count-1 ) ];
		}
		return $garbage;
	}
}

Garbage::init();

?>
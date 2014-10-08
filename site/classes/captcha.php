<?php

require_once 'libs/recaptchalib.php';
require_once 'recaptcha_keys.php';

/**
 * Interface for captcha validation
 */
class Captcha {

	/** -----------------------------------------------------------------------
	 * Returns TRUE if this session is validated by a captcha.
	 */
	public static function Valid() {
		OpenSession();
		return isset($_SESSION['captcha']);
	}
	
	/** -----------------------------------------------------------------------
	 * Invalidate the captcha for this session.
	 */
	public static function Reset() {	
		OpenSession();
		if( isset( $_SESSION['captcha'] ) ) {
			unset( $_SESSION['captcha'] );
		}
	}
	
	/** -----------------------------------------------------------------------
	 * Return the HTML for a captcha form.
	 */
	public static function GetHTML() {
		return recaptcha_get_html( $GLOBALS['recaptcha_public_key'] );
	}
	
	/** -----------------------------------------------------------------------
	 * Validate captcha input, passed via POST
	 *
	 * returns FALSE if there was no captcha input or it was invalid.
	 * returns TRUE if the input was valid and the session has been updated.
	 */
	public static function Validate() {
		
		if( !CheckArgsPOST( 
				'recaptcha_challenge_field', 
				'recaptcha_response_field' ) ) return FALSE;
				
		$resp = recaptcha_check_answer( $GLOBALS['recaptcha_private_key'],
										$_SERVER['REMOTE_ADDR'],
										$_POST['recaptcha_challenge_field'],
										$_POST['recaptcha_response_field'] );
						
		if( !$resp->is_valid ) return FALSE;
		
		OpenSession();
		// time might be utilized later.
		$_SESSION['captcha'] = array( "time" => time() );
		return TRUE;
	}
}

?>
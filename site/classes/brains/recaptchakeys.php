<?php

namespace Brains;

/**
 * contains public and private keys for the Recaptcha API.
 */
final class RecaptchaKeys {
	
	// private key
	public static $private;
	
	// public key
	public static $public;
	
}

// private file for filling in the fields.
include 'private/recaptcha_keys_init.php';

?>
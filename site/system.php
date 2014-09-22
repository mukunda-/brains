<?php

namespace System;
  
class InvalidAccountException extends Exception { }
  
/** ---------------------------------------------------------------------------
 * Hash an email address and return a 32-bit/8-digit hex code
 */
function HashEmail( $email ) {
	return hash( "crc32b", $email );
}

/** ---------------------------------------------------------------------------
 * Get account ID from an email address.
 *
 * @param $email Email address to query.
 * @return       Account ID matching the email, or 0 if no match.
 */
function GetAccountIDFromEmail( $email ) {
	$hash = HashEmail( $email );
	$sql = GetSQL();
	$result = $sql->safequery( 
		"SELECT email, account
		FROM Accounts WHERE email_hash=0x$hash" );
	
	if( $result->num_rows == 0 ) return 0; // unrecognized email.
	
	while( $row = $result->fetch_row( $result ) ) {
		if( $row[0] === $email ) {
			return (int)$row[1];
		}
	}
	return 0; // unrecognized email.
}

/**
 * Do an account database query.
 *
 * @param $id ID of account to read
 * @param $fields Fields of the account to read, separated by commas.
 * @return        Assoc array containing the account values.
 * @throws InvalidAccountException If the account doesn't exist.
 * @throws SQL exception on database failure
 */
function ReadAccount( $id, $fields ) {
	$id = (int)$id; // safety
	
	$sql = GetSQL();
	$result = $sql->safequery( 	
		"SELECT $fields
		FROM Accounts 
		WHERE id = $id" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) {
		throw new InvalidAccountException( 
			"Invalid account ID: $id" );
	}
	$row['id'] = $id;
	return $row;
}

?>
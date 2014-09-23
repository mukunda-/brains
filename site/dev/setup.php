<?php

require_once '../sql.php';

$sql = GetSQL();

$droptables = 1;

if( $droptables ) {
	$sql->safequery( 'DROP TABLE IF EXISTS Accounts' );
	$sql->safequery( 'DROP TABLE IF EXISTS Login' );
	$sql->safequery( 'DROP TABLE IF EXISTS Thoughts' );
	$sql->safequery( 'DROP TABLE IF EXISTS Links' );
	$sql->safequery( 'DROP TABLE IF EXISTS Votes' );
}

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Accounts (
		id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		email_hash UNSIGNED INT NOT NULL COMMENT 'crc32b hash of email, used to group emails for fast queries.',
		email VARCHAR(255) NOT NULL, 
		confirmed BOOLEAN NOT NULL DEFAULT 0 COMMENT 'Set when they confirm their email.',
		password VARCHAR(127) NOT NULL,
		nickname VARCHAR(64) NOT NULL COMMENT 'Nicknames do not have to be unique, only their e-mail.',
		name VARCHAR(64) NOT NULL,
		website VARCHAR(128),
		bio VARCHAR(32000),
		linksmade    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Normal links made.',
		stronglinks  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Strong links made.',
		perfectlinks INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Perfect links made.',
		INDEX USING HASH(email_hash) )
	ENGINE = InnoDB 
	COMMENT = 'Account information.' 
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Login (
		account INT UNSIGNED NOT NULL PRIMARY KEY, 
		secret  INT          COMMENT '31-bit Secret code that is stored in a client cookie.',              
		expires INT UNSIGNED COMMENT 'Unixtime of expiry.'
		) 
	ENGINE = InnoDB
	COMMENT = 'Active user logins.'
	" );

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Thoughts (
		id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		creator INT UNSIGNED COMMENT 'Account of creator.',
		time    INT UNSIGNED COMMENT 'Unixtime of creation.',
		content VARCHAR(31) UNIQUE
		) 
	ENGINE = InnoDB
	COMMENT = 'Mapping of thoughts and their IDs.'
	" );

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Links (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Thought ID, must be LESSER than id2',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Thought that the other id is linked to and vice versa.',
		goods    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total number of upvotes.',
		bads     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total number of downvotes.',
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation.',
		creator  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Account of the creator, 0 = nobody/admin',
		PRIMARY KEY ( thought1, thought2 )
		)
	ENGINE = InnoDB
	COMMENT = 'Describes all links between thoughts.'
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Votes (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		account  INT NOT NULL,
		time     INT UNSIGNED NOT NULL COMMENT 'Unix timestamp of creation/update.',
		vote     BOOL,
		PRIMARY KEY( thought1, thought2, account )
		)
	ENGINE = InnoDB
	COMMENT = 'Holds votes for each account for each link.'
	" );
		
		
?>
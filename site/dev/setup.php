<?php

require_once '../sql.php';

$sql = GetSQL();

$droptables = 1;

if( $droptables ) {
	$sql->safequery( 'DROP TABLE IF EXISTS Accounts' );
	$sql->safequery( 'DROP TABLE IF EXISTS SavedLogin' );
	$sql->safequery( 'DROP TABLE IF EXISTS Thoughts' );
	$sql->safequery( 'DROP TABLE IF EXISTS Links' );
	$sql->safequery( 'DROP TABLE IF EXISTS Votes' );
}

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Accounts (
		account INT AUTO_INCREMENT PRIMARY KEY, 
		email_hash INT NOT NULL COMMENT 'Hash of email, used to group emails for fast queries.',
		email VARCHAR(255) NOT NULL, 
		confirmed BOOLEAN NOT NULL DEFAULT 0 COMMENT 'Set when they confirm their email.',
		password VARCHAR(127) NOT NULL,
		nickname VARCHAR(64) NOT NULL COMMENT 'Nicknames do not have to be unique, only their e-mail.',
		name VARCHAR(64) NOT NULL,
		website VARCHAR(128),
		bio VARCHAR(32000),
		linksmade    INT NOT NULL DEFAULT 0 COMMENT 'Normal links made.',
		stronglinks  INT NOT NULL DEFAULT 0 COMMENT 'Strong links made.',
		perfectlinks INT NOT NULL DEFAULT 0 COMMENT 'Perfect links made.',
		INDEX USING HASH(email_hash) )
	ENGINE = InnoDB 
	COMMENT = 'Account information.' 
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS SavedLogin (
		account INT NOT NULL PRIMARY KEY, 
		secret INT COMMENT 'Secret code that is stored in a client cookie.',              
		expires INT COMMENT 'Unixtime of expiry.'
		) 
	ENGINE = InnoDB
	COMMENT = 'Saved user logins.'
	" );

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Thoughts (
		id INT AUTO_INCREMENT PRIMARY KEY,
		creator INT COMMENT 'Account of creator.',
		time INT COMMENT 'Unixtime of creation.',
		content VARCHAR(31) UNIQUE
		) 
	ENGINE = InnoDB
	COMMENT = 'Mapping of thoughts and their IDs.'
	" );

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Links (
		id1 INT NOT NULL COMMENT 'Thought ID, must be LESSER than id2',
		id2 INT NOT NULL COMMENT 'Thought that the other id is linked to and vice versa.',
		goods INT NOT NULL DEFAULT 0 COMMENT 'Number of upvotes.',
		bads INT NOT NULL DEFAULT 0 COMMENT 'Number of downvotes.',
		time INT NOT NULL COMMENT 'Unixtime of creation.',
		creator INT NOT NULL DEFAULT 0 COMMENT 'Account of the creator, 0 = nobody/admin',
		PRIMARY KEY (id1, id2)
		)
	ENGINE = InnoDB
	COMMENT = 'Describes all links between thoughts.'
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Votes (
		id1 INT NOT NULL COMMENT 'Lesser thought ID in link.',
		id2 INT NOT NULL COMMENT 'Greater thought ID in link.',
		account INT NOT NULL,
		vote BOOL
		)
	ENGINE = InnoDB
	COMMENT = 'Holds votes for each account for each link.'
	" );
		
		
?>
<?php

require_once '../sql.php';

$sql = GetSQL();

$droptables = 1;

if( $droptables ) {
	$sql->safequery( '
		DROP TABLE IF EXISTS 
		LoginTokens, Links, Votes, Thoughts, Accounts'
		);
	
}

$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Accounts (
		id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		email_hash INT UNSIGNED NOT NULL COMMENT 'crc32b hash of email, used to group emails for fast queries.',
		email VARCHAR(255) NOT NULL, 
		confirmed BOOLEAN NOT NULL DEFAULT 0 COMMENT 'Set when they confirm their email.',
		password VARCHAR(255) NOT NULL,
		nickname VARCHAR(64) NOT NULL COMMENT 'Nicknames do not have to be unique, only their e-mail.',
		name VARCHAR(64) NOT NULL,
		website VARCHAR(128),
		bio VARCHAR(32000),
		linksmade    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Normal links made.',
		stronglinks  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Strong links made.',
		perfectlinks INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Perfect links made.',
		banned BOOLEAN NOT NULL DEFAULT 0,
		bantime INT NOT NULL DEFAULT 0,
		banreason VARCHAR(512),
		INDEX USING HASH(email_hash) )
	ENGINE = InnoDB 
	COMMENT = 'Account information.' 
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS LoginTokens (
		id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		account INT UNSIGNED NOT NULL COMMENT 'Account ID that this token is for.', 
		secret  BINARY(16) NOT NULL   COMMENT 'hashed secret code',
		expires INT UNSIGNED          COMMENT 'Unixtime of expiry.',
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
		" //FOREIGN KEY ( creator ) REFERENCES Accounts ( id ) ON DELETE SET NULL ON UPDATE CASCADE
		// no account foreign id, accounts ids are not removed or changed.
		// if an account id is invalid, that gets handled.
."		) 
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
		PRIMARY KEY ( thought1, thought2 ),
		FOREIGN KEY ( thought1 ) REFERENCES Thoughts ( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY ( thought2 ) REFERENCES Thoughts ( id ) ON DELETE CASCADE ON UPDATE CASCADE
		)
	ENGINE = InnoDB
	COMMENT = 'Describes all links between thoughts.'
	" );
	
$sql->safequery( "
	CREATE TABLE IF NOT EXISTS Votes (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		account  INT UNSIGNED NOT NULL,
		time     INT UNSIGNED NOT NULL COMMENT 'Unix timestamp of creation/update.',
		vote     BOOL,
		PRIMARY KEY( thought1, thought2, account ),
		FOREIGN KEY ( thought1 ) REFERENCES Thoughts ( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY ( thought2 ) REFERENCES Thoughts ( id ) ON DELETE CASCADE ON UPDATE CASCADE"
		//FOREIGN KEY ( account ) REFERENCES Accounts ( id ) ON DELETE CASCADE ON UPDATE CASCADE*/
		// leave out account foreign key, waste of resources.
."		)
	ENGINE = InnoDB
	COMMENT = 'Holds votes for each account for each link.'
	" );
	
?>
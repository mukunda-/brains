<?php

namespace Brains;

chdir('..');

require_once 'core.php';

if( !Config::DebugMode() ) die('aaaa');

$db = \SQLW::Get();

$droptables = FALSE;

function DropTable( $name ) {
	global $db;
	$db->RunQuery( "DROP TABLE IF EXISTS $name" );
}

if( $droptables ) {
	DropTable( 'Stats' );
	DropTable( 'LoginTokens' );
	DropTable( 'LoginTickets' );
	DropTable( 'Votes' );
	DropTable( 'Links' );
	DropTable( 'Thoughts' );
	DropTable( 'Accounts' ); 
	DropTable( 'VoteLocks' );
	
}


$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS Accounts (
		id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		user_hash    INT UNSIGNED NOT NULL 
		             COMMENT 'crc32b hash of username, used as a username index.',
		username     VARCHAR(255) NOT NULL COMMENT 'User name',
		password     VARCHAR(255) NOT NULL COMMENT 'Hashed password',
		nickname     VARCHAR(64) NOT NULL 
		             COMMENT 'Nicknames do not have to be unique, only the username.',
		name         VARCHAR(64) COMMENT 'Optional real name.',
		website      VARCHAR(128) COMMENT 'Optional website address.',
		bio          VARCHAR(32000) COMMENT 'Optional biography.',
		linksmade    INT UNSIGNED NOT NULL DEFAULT 0 
		             COMMENT 'Links created.',
		goodlinks    INT UNSIGNED NOT NULL DEFAULT 0 
		             COMMENT 'Links above score 60.',
		stronglinks  INT UNSIGNED NOT NULL DEFAULT 0 
		             COMMENT 'Links above score 90.',
		perfectlinks INT UNSIGNED NOT NULL DEFAULT 0 
		             COMMENT 'Perfect score links.',
		banned       BOOLEAN NOT NULL DEFAULT 0 COMMENT 'Account is suspended.',
		bantime      INT NOT NULL DEFAULT 0 COMMENT 'Time of suspension.',
		banreason    VARCHAR(512) COMMENT 'Reason for suspension.',
		
		INDEX USING BTREE( user_hash ) 
	)
	ENGINE = InnoDB 
	COMMENT = 'Account information.' 
	" );
	
$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS LoginTokens (
		id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		account INT UNSIGNED NOT NULL COMMENT 'Account ID that this token is for.', 
		secret  VARCHAR(255) NOT NULL COMMENT 'Hashed secret code.',
		expires INT UNSIGNED          COMMENT 'Unixtime of expiry.'
	) 
	ENGINE = InnoDB
	COMMENT = 'Active user logins.'
	" );

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS Thoughts (
		id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		creator INT UNSIGNED          COMMENT 'Account of creator. 0 = anonymous',
		time    INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation.',
		phrase  VARCHAR(31) NOT NULL UNIQUE
	) 
	ENGINE = InnoDB
	COMMENT = 'Mapping of thoughts and their IDs.'
");

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS Links (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Thought ID, must be LESSER than id2',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Thought that the other id is linked to and vice versa.',
		goods    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total number of upvotes.',
		bads     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total number of downvotes.',
		score    INT UNSIGNED NOT NULL DEFAULT 25 COMMENT 'Computed score.',
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation.',
		creator  INT UNSIGNED          COMMENT 'Account of the creator, 0 = anonymous',
		rank	 TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Rank achieved, 0=normal, 1=good, 2=strong, 3=perfect',
		PRIMARY KEY( thought1, thought2 ),
		INDEX USING BTREE( thought2 ),
		FOREIGN KEY( thought1 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY( thought2 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE
	)
	ENGINE = InnoDB
	COMMENT = 'Describes all links between thoughts.'
");
	/*
$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS Votes (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		account  INT UNSIGNED NOT NULL COMMENT 'Account of the voter.',
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation/update.',
		fake     BOOL COMMENT 'Fake votes don\'t affect the score.',
		vote     BOOL COMMENT '1=upvote, 0=downvote',
		PRIMARY KEY( thought1, thought2, account ),
		FOREIGN KEY( thought1 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY( thought2 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE
	)
	ENGINE = InnoDB
	COMMENT = 'Holds votes for each account for each link.'
");
	*/
$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS VoteLocks (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		ip       VARBINARY(16) NOT NULL COMMENT 'IP address used.',
		expires  INT UNSIGNED NOT NULL COMMENT 'Unixtime of expiry.',
		
		PRIMARY KEY( thought1, thought2, ip )
	)
	ENGINE = InnoDB
	COMMENT = 'Hold recent vote information for abuse prevention.'
");
	
$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS LoginTickets (
		id INT AUTO_INCREMENT PRIMARY KEY,
		account INT NOT NULL COMMENT 'Account that this will log in to.',
		code VARCHAR(64) COMMENT 'Secret code that must be provided.',
		expires INT UNSIGNED NOT NULL COMMENT 'Unixtime of expiry.'
	)
	ENGINE = InnoDB
	COMMENT = 'Login tickets for accounts with lost passwords.'
");

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS Stats (
		id CHAR(8) PRIMARY KEY,
		value INT NOT NULL DEFAULT 0
	)
	ENGINE = InnoDB
	COMMENT = 'Statistics table.'
");

$db->RunQuery( "INSERT INTO Stats (id) VALUES ('TLINKS')" );
$db->RunQuery( "INSERT INTO Stats (id) VALUES ('GLINKS')" );
$db->RunQuery( "INSERT INTO Stats (id) VALUES ('SLINKS')" );
$db->RunQuery( "INSERT INTO Stats (id) VALUES ('PLINKS')" );

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS IPMap (
		id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Mapping of IP.',
		ip VARBINARY(16) NOT NULL         COMMENT 'Actual IP address.'
	)
	ENGINE = InnoDB
	COMMENT = 'Mapping of IPs to indexes.'
");

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS RealVotes (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		mip      INT UNSIGNED NOT NULL COMMENT 'Mapped IP of the voter.',
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation/update.',
		vote     BOOL COMMENT '1=upvote, 0=downvote',
		PRIMARY KEY( thought1, thought2, mip ),
		FOREIGN KEY( thought1 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY( thought2 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE
	)
	ENGINE = InnoDB
	COMMENT = 'Vote table'
");

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS AccountVotes (
		thought1 INT UNSIGNED NOT NULL COMMENT 'Lesser thought ID in link.',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Greater thought ID in link.',
		account  INT UNSIGNED NOT NULL COMMENT 'Account of the voter.', 
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation/update.',
		vote     BOOL COMMENT '1=upvote, 0=downvote',
		PRIMARY KEY( thought1, thought2, account ),
		FOREIGN KEY( thought1 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY( thought2 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE
	)
	ENGINE = InnoDB
	COMMENT = 'Holds votes for each account for each link.'
");

$db->RunQuery( "
	CREATE TABLE IF NOT EXISTS AnonymousLinks (
		id       INT PRIMARY KEY,
		thought1 INT UNSIGNED NOT NULL COMMENT 'Thought ID, must be LESSER than id2',
		thought2 INT UNSIGNED NOT NULL COMMENT 'Thought that the other id is linked to and vice versa.',
		mip      INT UNSIGNED NOT NULL COMMENT 'Mapped IP of creator.',
		time     INT UNSIGNED NOT NULL COMMENT 'Unixtime of creation.',
		INDEX USING BTREE( mip ),
		FOREIGN KEY( thought1 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY( thought2 ) REFERENCES Thoughts( id ) ON DELETE CASCADE ON UPDATE CASCADE
	)
	ENGINE = InnoDB
	COMMENT = 'Holds links created by anonymous users.'
");

?>
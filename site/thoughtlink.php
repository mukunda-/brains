<?php

final class ThoughtLink {
	public $thought1_id;
	public $thought2_id;
	public $goods;
	public $bads;
	public $score;
	public $time;
	public $vote;
	public $creator;
	
	private function __construct( $thought1, $thought2 ) {
		$thought1_id = $thought1->id;
		$thought2_id = $thought2->id;
	}
	
	/** -----------------------------------------------------------------------
	 * Get a thought link.
	 * 
	 * @param Thought $thought1 First thought in the link.
	 * @param Thought $thought2 Second thought in the link.
	 * @param int $account Account ID to associate with the query
	 *                     which is used to get the vote bias. 0 = admin
	 * @param bool $create Create a link if it doesn't exist.
	 * @return ThoughtLink instance or FALSE if the link doesn't exist.
	 */
	public static function Get( $thought1, $thought2,
							    $account = 0, $create = false ) {
								
		if( $thought1 === $thought2 ) {
			throw new InvalidArgumentException( 
				"Link cannot point to itself." );
		}
		
		Thought::Order( $thought1, $thought2 );
		
		$db = GetSQL();
		$result = 0;
		if( $account != 0 ) {
			$result = $db->RunQuery( 
				"SELECT goods, bads, time, creator, vote FROM Links
				LEFT JOIN Votes 
				ON Votes.thought1=Links.thought1
				AND Votes.thought2=Links.thought2
				AND Votes.account=$account
				WHERE thought1=$thought1->id AND thought2=$thought2->id" );
		} else {
			$result = $db->RunQuery( 
				"SELECT goods, bads, time, creator FROM Links
				WHERE thought1=$thought1->id AND thought2=$thought2->id" );
		}
		
		$row = $result->fetch_row();
		if( $row === FALSE ) {
			if( $create ) {
				
				// create a new link.
				return self::Create( $thought1, $thought2, $account );
			}
			else return FALSE;
		}
		
		$link = new self( $thought1, $thought2 ); 
			
		// return existing link.
		$link->goods = $row[0];
		$link->bads = $row[1];
		$link->time = $row[2];
		$link->creator = $row[3];
		if( $account != 0 && !is_null($row[4]) ) {
			$link->vote = $row[4] ? TRUE : FALSE;
		} else {
			$link->vote = null;
		}
		
		$link->score = self::ComputeScoreWithBias( 
			$link->goods, $link->bads, $link->vote );
		
		return $result;
	}
	
	/** ----------------------------------------------------------------------- 
	 * Compute the score from good votes and bad votes
	 *
	 * Score ranges from 0 to 99
	 *
	 * @param int $goods Number of upvotes.
	 * @param int $bads Number of downvotes.
	 * @return int Computed score.
	 */
	public static function ComputeScore( $goods, $bads ) {	
		$total = $goods+$bads;
		if( $total == 0 ) return 50;
		$r = (float)Config::$SCORERAMPCONST;
		
		$a = min( $total / $r, 1.0 );
		
		$sc = round(50.0 * (1.0-$a) + ($goods*99/$total) * $a);
		if( $sc == 99 ) { // legendary always needs at least 100 votes.
			if( $r < 100 ) {
				return 98;
			}
		}
	}
	
	/** -----------------------------------------------------------------------
	 * Compute a score, and apply a voting bias to it.
	 *
	 * This adds or subtracts 1 according to the vote given (typically what
	 * the user voted).
	 *
	 * @param int $goods Number of upvotes.
	 * @param int $bads  Number of downvotes.
	 * $param bool|null  TRUE for upvote, FALSE for downvote, or null to 
	 *                   behave just like normal ComputeScore()
	 */
	public static function ComputeScoreWithBias( $goods, $bads, $vote ) {
		$score = self::ComputeScore( $goods, $bads );
		
		if( $vote === TRUE ) {
			if( $score != 99 ) {
				$score = min( $result+1, 98 );
			}
		} else if( $vote === FALSE ) {
			$score = max( $score-1, 0 );
		}
	}
	
	/** -----------------------------------------------------------------------
	 * Create a new thought link.
	 *
	 * Should check if the link exists first to avoid creating auto increment
	 * holes.
	 *
	 * @param Thought $thought1 First thought in the link.
	 * @param Thought $thought2 Second thought in the link.
	 * @param int $creator      Account ID to set as the creator. 0 to assume
	 *                          server/admin. This also creates an upvote for
	 *                          the link by this user.
	 * @return ThoughtLink|false Created ThoughtLink or FALSE if the link 
	 *                           already exists.
	 */
	public static function Create( $thought1, $thought2, $creator = 0 ) { 
	
		Thoughts::Order( $thought1, $thought2 );
		$time = time();
		
		$db = GetSQL();
		
		try {
			$db->RunQuery(
				"INSERT INTO Links (thought1, thought2, time, creator )
				VALUES ( $thought1->id, $thought2->id, $time, $creator )" );
		} catch( SQLException $e ) {
			if( $e->code == 2601 ) { // 2601: duplicate key.
				return FALSE;
			}
			throw $e;
		}
		
		$link = new self( $thought1, $thought2 );
		
		$link->goods = 0;
		$link->bads = 0;
		$link->time = $time;
		$link->creator = $creator;
		$link->vote = ($creator == 0) ? null : TRUE;
		
		// add an upvote.
		if( $creator != 0 ) {
			
			
			try {
				if( Vote( $thought1, $thought2, $creator, true ) ) {
					$link->goods = 1;
				} else {
					// if in some event Vote fails, we just skip the auto vote
					$link->vote = null;
				}
			} catch( SQLException $e ) {
				// such robust
				$link->vote = null;
			}
		}
		
		$link->score = self::ComputeScore( $link->goods, $link->bads );
		return $link;
	}
	
	/** -----------------------------------------------------------------------
	 * Create or update a vote for a user.
	 *
	 * @param Thought $thought1, $thought2 Thoughts in the link.
	 * @param int $accountid   Account ID that is voting.
	 * @param bool $vote       TRUE to upvote, FALSE to downvote.
	 * @return bool            TRUE if the vote was inserted or updated, 
	 *                         FALSE if something strange happened.
	 */
	public static function Vote( $thought1, $thought2, $accountid, $vote ) {
		
		Thoughts::Order( $thought1, $thought2 );
		
		$result = $db->DoTransaction( function( $db ) 
									  use( $thought1, $thought2, 
									       $accountid, $vote ) {
			$time = time();	
			$db->RunQuery( 'START TRANSACTION' );
			
			// get the current scores of the link
			$result = $db->RunQuery( 
				"SELECT goods, bads FROM Links 
				WHERE thought1=$thought1->id AND thought2=$thought2->id
				FOR UPDATE" );
			
			$row = $result->fetch_row();
			if( $row === FALSE ) {
				// catch: link doesn't exist.
				$db->RunQuery( 'ROLLBACK' );
				throw new InvalidArgumentException( "Link doesn't exist." );
			}
			
			$goods = $row[0];
			$bads  = $row[1];
			
			// add the vote
			if( $voteval == 1 ) {
				$goods++;
			} else {
				$bads++;
			}
			
			// check if there is already a vote from this user.
			$result = $db->RunQuery(
				"SELECT vote, fake FROM Votes WHERE
				thought1=$thought1->id AND thought2=$thought2->id
				AND account=$accountid FOR UPDATE" );
			
			$row = $result->fetch_assoc();
			if( $row !== FALSE ) {
				// a vote already exists:
				
				// reverse original vote, 
				// or quit if the vote in the database already
				// matches the current request.
				if( !is_null($row['vote']) ) {
					if( $row['vote'] == $voteval ) {
						$sql->safequery( 'ROLLBACK' );
						return TRUE;
					}
					
					if( $row[0] == 1 ) {
						$goods--;
					} else {
						$bads--;
					}
				}
				
				// update the user's vote.
				$db->RunQuery(
					"UPDATE Votes SET vote=$voteval, time=$time
					WHERE thought1=$thought1->id AND thought2=$thought2->id
					AND account=$accountid" );
				
				// if the vote isnt FAKE, update the link score.
				
				if( !$row['fake'] ) {
					$db->RunQuery( 
						"UPDATE Links SET goods=$goods, bads=$bads
						WHERE thought1=$thought1->id AND thought2=$thought2->id" );
				}
				
			} else {
			
				try {
					$db->RunQuery( 
						"INSERT INTO Votes (thought1, thought2, account, time, vote )
						VALUES ($thought1->id, $thought2->id, $accountid, $time, $voteval )" );
				} catch( SQLException $e ) {
					if( $e->code == SQL_ER_DUP_KEY ) {
						$db->RunQuery( 'ROLLBACK' );
						return FALSE;
					}
				}
				 
			}
			
			$db->RunQuery( 'COMMIT' );
			return TRUE;
		} );
		
		return $result; 
	}
	
	
}

?>
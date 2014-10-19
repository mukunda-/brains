<?php

namespace Brains;

final class ThoughtLink {
	public $source; // source thought
	public $dest; // destination thought
	
	public $creator = 0;
	public $time;
	public $goods;
	public $bads;
	public $score;
	public $tier;
	public $vote = null;
	public $created = false; // true if this thought was returned 
							 // by Create, or Get with $create=true
							 // (and it was created.)
				
	const LINKRANK_GOOD = 60;
	const LINKRANK_STRONG = 95;
	const LINKRANK_PERFECT = 99;
	
	const BASE_SCORE = 25;
	
	private function __construct( $source, $dest, $time, $creator = 0,
								  $goods = 0, $bads = 0, $vote = null ) {
		$this->source = $source;
		$this->dest = $dest;
		$this->creator = (int)$creator;
		$this->time = $time;
		$this->goods = $goods;
		$this->bads = $bads;
		$this->vote = $vote;
		$this->UpdateScore();
	}
	
	/** -----------------------------------------------------------------------
	 * Update the $score variable from the $goods and $bads.
	 *
	 * @return int Current score.
	 */
	public function UpdateScore() {
		$this->score = self::ComputeScore( $this->goods, $this->bads );
		$this->tier = self::GetTier( $this->score );
		return $this->score;
	}
	
	/** -----------------------------------------------------------------------
	 * Get a thought link.
	 * 
	 * @param Thought $source First thought in the link.
	 * @param Thought $dest   Second thought in the link.
	 * @param int $account Account ID to associate with the query
	 *                     which is used to get the vote bias. 0 = anonymous
	 * @param bool $create Create a link if it doesn't exist.
	 * @return ThoughtLink instance or FALSE if the link doesn't exist.
	 */
	public static function Get( $source, $dest,
							    $account = 0, $create = false ) {
								
		if( $source === $dest ) {
			throw new InvalidArgumentException( 
				"Link cannot point to itself." );
		}
		
		$ordered1 = $source;
		$ordered2 = $dest;
		
		// order the thoughts for the db query
		Thought::Order( $ordered1, $ordered2 );
		
		$db = \SQLW::Get();
		$result = 0;
		if( $account != 0 ) {
			$result = $db->RunQuery( 
				"SELECT goods, bads, L.time AS time, creator, vote 
				FROM Links L LEFT JOIN AccountVotes V
				ON V.thought1=L.thought1
				AND V.thought2=L.thought2
				AND V.account=$account
				WHERE L.thought1=$ordered1->id AND L.thought2=$ordered2->id" );
		} else {
			$mip = User::GetMip();
			$aid = User::GetAid();
			$result = $db->RunQuery(
				"SELECT goods, bads, L.time AS time, creator, vote FROM Links L
				LEFT JOIN RealVotes V
				ON V.thought1=L.thought1 AND V.thought2=L.thought2
				AND V.mip = $mip AND V.aid = $aid
				WHERE L.thought1=$ordered1->id AND L.thought2=$ordered2->id" );
		}
		
		$row = $result->fetch_assoc();
		
		if( $row === NULL ) {
			if( $create ) {
				
				// create a new link.
				return self::Create( $source, $dest, $account );
			}
			else return FALSE;
		}
		
		$vote = null;
		if( !is_null($row['vote']) ) {
			$vote = $row['vote'] ? TRUE : FALSE; 
		}
		
		// return existing link.  
		$link = new self( $source, $dest, 
						  $row['time'], $row['creator'], 
						  $row['goods'], $row['bads'], $vote ); 
		
		return $link;
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
		if( $total == 0 ) return self::BASE_SCORE;
		$r = (float)Config::$SCORERAMPCONST;
		
		$a = min( $total / $r, 1.0 );
		
		$sc = round( (float)self::BASE_SCORE * (1.0-$a) + ($goods*99.0/$total) * $a );
		
		if( $sc == 99 ) { 
			// legendary always needs at least 100 votes.
			if( $total < 100 ) {
				return 98;
			}
		}
		return $sc;
	}
	
	/** -----------------------------------------------------------------------
	 * Compute the score tier
	 *
	 * @param int $score Score of link.
	 * @return int Score tier.
	 */
	public static function GetTier( $score ) {
		if( $score < 60 ) return 0;
		if( $score < 75 ) return 1;
		if( $score < 90 ) return 2;
		if( $score < 99 ) return 3;
		return 4;
	}
	
	/** -----------------------------------------------------------------------
	 * Compute a score, and apply a voting bias to it.
	 *
	 * This adds or subtracts 1 according to the vote given.
	 *
	 * @param int $goods Number of upvotes.
	 * @param int $bads  Number of downvotes.
	 * $param bool|null  TRUE for upvote, FALSE for downvote, or null to 
	 *                   behave just like normal ComputeScore()
	 */
	public static function ComputeScoreWithBias( $goods, $bads, $vote ) {
		$score = self::ComputeScore( $goods, $bads );
		
		if( $vote === TRUE ) {
			// only add 1 if it wont make it 99 ("perfect")
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
	 * @param Thought $source, $dest Different thoughts that form the
	 *                               link.
	 * @param int $creator      Account ID to set as the creator. 0 to assume
	 *                          server/admin. This also creates an upvote for
	 *                          the link by this user.
	 * @return ThoughtLink|false Created ThoughtLink or FALSE if the link 
	 *                           already exists.
	 */
	public static function Create( $source, $dest, $creator = 0 ) { 
	
		if( $source === $dest ) {
			throw new InvalidArgumentException( 
				"Link cannot point to itself." );
		}
		
		$ordered1 = $source;
		$ordered2 = $dest;
		Thought::Order( $ordered1, $ordered2 );
		
		$time = time();
		$db = \SQLW::Get();
		
		$db->RunQuery( 'START TRANSACTION' );
		
		// try to insert, quit on duplicate.
		try {
			$db->RunQuery(
				"INSERT INTO Links (thought1, thought2, time, creator )
				VALUES ( $ordered1->id, $ordered2->id, $time, $creator )" );
		} catch( \SQLException $e ) {
			if( $e->code == 2601 ) { // 2601: duplicate key.
				$db->RunQuery( 'ROLLBACK' );
				return FALSE;
			}
			throw $e;
		}
		
		$vote = $creator == 0 ? null : TRUE;
		
		// add an upvote.
		if( !self::Vote( $source, $dest, $creator, true ) ) {
			$vote = null;
		}
			
		if( $creator != 0 ) {

			
			User::AddLinkStat( $creator, 0 );
		} else {
			$mip = User::GetMip();
			$aid = User::GetAid();
			$db->RunQuery( "
				INSERT INTO AnonymousLinks (thought1, thought2, mip, aid, time)
				VALUES ($ordered1->id, $ordered2->id, $mip, $aid, $time )" );
		}
		
		Stats::Increment( 'TLINKS' );
		
		$db->RunQuery( 'COMMIT' );
		
		if( $creator == User::AccountID() ) {	
			$username = User::GetUsername();
			if( $username === FALSE ) $username = "Unknown";
		} else {
			$username = "Unknown";
		}
		Logger::Info( Logger::FormatUser( $username, $creator ) . " created a new link: \"$source->phrase\" -> \"$dest->phrase\"" );
		
		$link = new self( $source, $dest, 
						  $time, $creator, $vote === TRUE ? 1:0, 0, 
						  $vote );
		$link->created = true;
		
		return $link;
	}
	 
	
	/** -----------------------------------------------------------------------
	 * Create or update a vote for a user.
	 *
	 * @param Thought $thought1, $thought2 Thoughts in the link.
	 * @param int $accountid   Account ID that is voting. 0 = Anonymous vote.
	 * @param bool $vote       TRUE to upvote, FALSE to downvote.
	 * @return bool            TRUE if the vote was inserted or updated, 
	 *                         FALSE if something strange happened.
	 */
	public static function Vote( $source, $dest, $accountid, $vote ) {
	
		
		Thought::Order( $source, $dest );
		$db = \SQLW::Get();
		
		$result = $db->DoTransaction( function( $db ) 
									  use( $source, $dest, 
									       $accountid, $vote ) {
										   
			$voteval = $vote ? 1 : 0;
			$mip = User::GetMip();
			$aid = User::GetAid();
			
			$time = time();	
			$db->RunQuery( 'START TRANSACTION' );
			
			// get the current scores of the link
			$result = $db->RunQuery( 
				"SELECT goods, bads, rank FROM Links 
				WHERE thought1=$source->id AND thought2=$dest->id
				FOR UPDATE" );
			
			$row = $result->fetch_row();
			if( $row === NULL ) {
				// catch: link doesn't exist.
				$db->RunQuery( 'ROLLBACK' );
				throw new InvalidArgumentException( "Link doesn't exist." );
			}
			
			$goods = $row[0];
			$bads  = $row[1];
			$linkrank = $row[2];
			
			// add the vote
			if( $vote ) {
				$goods++;
			} else {
				$bads++;
			}
			
			// check if there is already a vote from this user.
			$result = $db->RunQuery(
				"SELECT vote, aid FROM RealVotes 
				WHERE thought1=$source->id AND thought2=$dest->id 
				AND mip=$mip FOR UPDATE" );
			
			$row = $result->fetch_assoc();
			$scorechange = true;
			
			if( $row !== null ) {
				// a vote already exists:
				
				// reverse original vote, 
				// or quit if the vote in the database already
				// matches the current request.
	
				if( $row['vote'] == $voteval ) {
					$scorechange = false;
					
					/*
					if( $row['aid'] != $aid ) {
						
						$db->RunQuery( 
							"UPDATE RealVotes SET aid=$aid, time=$time
							WHERE thought1=$source->id AND thought2->$dest->id
							AND mip=$mip" );
					}
					
					self::UpdateAccountVote( $source, $dest, $accountid, $time, $voteval );
					
					$db->RunQuery( 'COMMIT' );
					return TRUE;
					*/
				} else {
				
					if( $row['vote'] == 1 ) {
						$goods--;
					} else {
						$bads--;
					}
					
				}
	//			$score = self::ComputeScore( $goods, $bads );
				
				// update the user's vote.
				$db->RunQuery(
					"UPDATE RealVotes SET vote=$voteval, aid=$aid, time=$time
					WHERE thought1=$source->id AND thought2=$dest->id
					AND mip=$mip" );
		

		
				// update the link score
		//		$db->RunQuery(
			//		"UPDATE Links SET goods=$goods, bads=$bads, score=$score
		//			WHERE thought1=$source->id AND thought2=$dest->id" );
		/*		
				UpdateAccountVote( $source, $dest, $account, $time, $voteval );
				if( $accountid != 0 ) {
					$db->RunQuery(
						"INSERT INTO AccountVotes (thought1, thought2, account, time, vote)
						VALUES( $source->id, $dest->id, $accountid, $time, $voteval )
						ON DUPLICATE KEY UPDATE time=$time, vote=$voteval" );
				}
			*/	
			} else {
				
				$db->RunQuery( 
					"INSERT INTO RealVotes 
					(thought1, thought2, mip, time, aid, vote )
					VALUES ($source->id, $dest->id, $mip, $time, $aid, $voteval)" 
				);
				
				// check if there is a lock for this iP.
		//		$iphex = GetIPHex();
		//		$time = time();
		//		$result = $db->RunQuery( 
		//			"SELECT 1 FROM VoteLocks
		//			WHERE thought1=$source->id AND thought2=$dest->id
		//			AND ip=x'$iphex' AND expires > $time " );
		//		
		//		$fakevote = $result->num_rows != 0 ? 1 : 0;
		/*		
				try {
					$db->RunQuery( 
						"INSERT INTO Votes (thought1, thought2, account, time, vote, fake )
						VALUES ($source->id, $dest->id, $accountid, $time, $voteval, $fakevote )" );
				} catch( \SQLException $e ) { 
					if( $e->code == SQL_ER_DUP_KEY ) {
						$db->RunQuery( 'ROLLBACK' );
						return FALSE;
					}
				}
				
				if( !$fakevote ) {
					// save vote lock
					$expires = time() + Config::$VOTELOCK_TIME;
					$db->RunQuery( 
						"INSERT INTO VoteLocks (thought1, thought2, ip, expires )
						VALUES ($source->id, $dest->id, x'$iphex', $expires )" );
				}
				
		*/		
				 
			}
			
			if( $accountid != 0 ) {
				$db->RunQuery(
					"INSERT INTO AccountVotes (thought1, thought2, account, time, vote)
					VALUES( $source->id, $dest->id, $accountid, $time, $voteval )
					ON DUPLICATE KEY UPDATE time=$time, vote=$voteval" 
				);
			}
			
			if( $scorechange ) {
				$score = self::ComputeScore( $goods, $bads );
				
				if( $linkrank == 0 && $score >= self::LINKRANK_GOOD ) {
					$linkrank++;
					User::AddLinkStat( $accountid, 1 );
					Stats::Increment( 'GLINKS' );
				}
				if( $linkrank == 1 && $score >= self::LINKRANK_STRONG ) {
					$linkrank++;
					User::AddLinkStat( $accountid, 2 );
					Stats::Increment( 'SLINKS' );
				}
				if( $linkrank == 2 && $score >= self::LINKRANK_PERFECT ) {
					$linkrank++;
					User::AddLinkStat( $accountid, 3 );
					
					Stats::Increment( 'PLINKS' );
					Logger::Info( "A PERFECT link was discovered! \"$source->phrase\" -> \"$dest->phrase\"" );
				}
				
				// update score
				$db->RunQuery( 
					"UPDATE Links 
					SET goods=$goods, bads=$bads, rank=$linkrank, score=$score
					WHERE thought1=$source->id AND thought2=$dest->id" );
			}
			
			$db->RunQuery( 'COMMIT' );
			return TRUE;
		});
		
		return $result; 
	}
	
	/** -----------------------------------------------------------------------
	 * Upvote or downvote a link. These functions must only be used on links
	 * that were looked up using the same account ID as the person logged in.
	 *
	 * and the user must be logged in. this function might randomly fail, but
	 * it fails silently.
	 *
	 * Called via Upvote() or Downvote().
	 */
	private function Ivote( $vote ) {
		if( $this->vote === $vote ) {
			return; // already done.
		}
		
		// and update database.
		try {
			self::Vote( $this->source, $this->dest, User::AccountID(), $vote );
		} catch( \SQLException $e ) {
			Logger::PrintException( $e );
			return;
		}
		
		// reverse vote
		if( $this->vote === true ) {
			$this->goods--;
		} else if( $this->vote === false ) {
			$this->bads--;
		}
		
		$this->vote = $vote;
		
		// add vote
		if( $vote ) {
			$this->goods++;
		} else {
			$this->bads++;
		}
		
		// update $score
		$this->UpdateScore();
		
	}
	
	public function Upvote() { $this->Ivote( true ); }
	public function Downvote() { $this->Ivote( false ); }
	
	/** -----------------------------------------------------------------------
	 * Find links that are connected to a thought.
	 *
	 * @param Thought $thought   Thought to search for.
	 * @param int     $accountid Account ID to use to get the VOTE field.
	 *                           0=NONE/ADMIN.
	 * @param bool    $arrange   Arrange the result set. Sorts by score tiers
	 *                           and randomizes.
	 *
	 * @return array           Array of ThoughtLink instances that are linked
	 *                         to the thought given.
	 */
	public static function FindLinks( $thought, $accountid = 0, 
									  $arrange = true ) {
		$db = \SQLW::Get();
		
		// method 1, not sure if this is the right way to do a query like this
		// and can't properly test unless the table has data in it.
		// (this method is no longer working.)
		
		/*
		$result = $db->RunQuery( 
			"SELECT thought1, thought2 goods, bads, Links.time, creator, vote 
			FROM Links LEFT JOIN Votes ON Links.thought1 = Votes.thought1
			AND Links.thought2 = Votes.thought2
			AND Votes.account = $accountid
			WHERE Links.thought1=$thought->id 
			OR    Links.thought2=$thought->id" );
		*/
	
		// method 2, union the two key queries. safer but may be slower.
		if( $accountid != 0 ) {
			$result = $db->RunQuery( 
				"(SELECT Links.thought2 AS dest, T2.phrase AS dest_phrase,
						 goods, bads, Links.time AS time, Links.creator AS creator, vote
				FROM Links 
				LEFT JOIN AccountVotes AV 
				ON Links.thought1 = AV.thought1
				AND Links.thought2 = AV.thought2
				AND AV.account = $accountid
				LEFT JOIN Thoughts T2 ON T2.id=Links.thought2
				WHERE Links.thought1 = $thought->id)
				UNION ALL
				(SELECT Links.thought1 AS dest, T1.phrase AS dest_phrase,
						goods, bads, Links.time AS time, Links.creator AS creator, vote
				FROM Links 
				LEFT JOIN AccountVotes AV
				ON Links.thought1 = AV.thought1
				AND Links.thought2 = AV.thought2
				AND AV.account = $accountid
				LEFT JOIN Thoughts T1 ON T1.id=Links.thought1
				WHERE Links.thought2 = $thought->id)" 
			);
		} else {
			$aid = User::GetAid();
			$mip = User::GetMip();
			$result = $db->RunQuery( 
				"(SELECT Links.thought2 AS dest, T2.phrase AS dest_phrase,
						 goods, bads, Links.time AS time, Links.creator AS creator, vote
				FROM Links
				LEFT JOIN RealVotes RV
				ON Links.thought1 = RV.thought1
				AND Links.thought2 = RV.thought2
				AND RV.aid = $aid AND RV.mip = $mip
				LEFT JOIN Thoughts T2 
				ON T2.id=Links.thought2
				WHERE Links.thought1 = $thought->id)
				UNION ALL
				(SELECT Links.thought1 AS dest, T1.phrase AS dest_phrase,
						goods, bads, Links.time AS time, Links.creator AS creator, vote
				FROM Links 
				LEFT JOIN RealVotes RV
				ON Links.thought1 = RV.thought1
				AND Links.thought2 = RV.thought2
				AND RV.aid = $aid AND RV.mip = $mip
				LEFT JOIN Thoughts T1
				ON T1.id=Links.thought1
				WHERE Links.thought2 = $thought->id)" 
			);
		}
		$list = [];
			
		// populate the $list with links created from the query result.
		while( $row = $result->fetch_assoc() ) {
			$vote = $row['vote'];
			if( !is_null($vote) ) $vote = $vote ? TRUE:FALSE;
			
			$dest = new Thought( $row['dest'], $row['dest_phrase'] );
			
			$link = new self( $thought, $dest, $row['time'], $row['creator'],
							  $row['goods'], $row['bads'], $vote );
			$list[] = $link;
		}
		
		// if $arrange is set, randomize the links
		// and sort them by their tiers
		if( $arrange ) {
			shuffle( $list );
			usort( $list, function( $a, $b ) {
				if( $a->tier == $b->tier ) return 0;
				if( $a->tier < $b->tier ) return 1;
				return -1;
			});
		}
		
		return $list;
	}
}

?>
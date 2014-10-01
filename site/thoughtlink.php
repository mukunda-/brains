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
	
	/** -----------------------------------------------------------------------
	 * Get a thought link.
	 * 
	 * @param Thought thought1 First thought in the link.
	 * @param Thought thought2 Second thought in the link.
	 * @param int [$account] Account ID to associate with the query
	 *                     which is used to get the vote bias.
	 * @return ThoughtLink instance or FALSE if the link doesn't exist.
	 */
	public static function Get( $thought1, $thought2, $account = 0 ) {
		Thought::Order( $thought1, $thought2 );
		
		$result = new self;
		$result->thought1_id = $thought1->id;
		$result->thought2_id = $thought2->id;
		
		$db = GetSQL();
		$result=0;
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
		if( $row === FALSE ) return FALSE;
		
		$result->goods = $row[0];
		$result->bads = $row[1];
		$result->time = $row[2];
		$result->creator = $row[3];
		if( $account != 0 && !is_null($row[4]) ) {
			$result->vote = $row[4] ? TRUE : FALSE;
		} else {
			$result->vote = null;
		}
		
		$result->score = self::ComputeScoreWithBias( 
			$result->goods, $result->bads, $result->vote );
		
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
		$score = ComputeScore( $goods, $bads );
		
		if( $vote === TRUE ) {
			if( $score != 99 ) {
				$score = min( $result+1, 98 );
			}
		} else if( $vote === FALSE ) {
			$score = max( $score-1, 0 );
		}
	}
}

?>
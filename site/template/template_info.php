
<div class="welcome" id="welcome_page">
	<div class="biglogo">
		<?php
		$svg = new \SVG( 'img/logo1.svg' );
		$svg->SetID( 'biglogo' );
		$svg->Output();?>
	</div>
	<h1>Type in any word or phrase to begin.</h1>
	
	<?php include "template/template_newlink_raw.php" ?>
	
	<p>
    The Wordex is a creative resource that's built from human input. 
	  Every <i>thought</i> you type in helps to build the database.
  </p>

  <p>
    Over time, the Wordex will grow into a massive reference of relations between
    thoughts. It's like a thesaurus, except we aren't only looking for direct synonyms or antonyms.
    For example, <i>baby</i> and <i>crib</i> 
    are definitely not the same thing, but cribs are for babies, so ideally <i>baby</i>
    and <i>crib</i> should form a <i>strong link</i> here.
  </p>

  <p>
    When you type in a thought, it
    either creates a new link or strengthens an existing link. You can also vote
    on links by clicking the arrows on them.
    Upvote links you like, and downvote links that you dislike or contain nonsense.
    Links with a low score sink to the bottom and may be removed later. The system only 
    works if a lot of people contribute, so you should tell your friends to put in a few words too!
  </p>
 
  <p>You can also explore the Wordex core at the <i><a href="nebula/">Word Nebula</a><sup>(BETA)</sup></i>.</p>
	
	<h3>"A crowdsourced brainstorm"!</h3>
	
	<div class="stats">
		<div class="linksfound" id="info_tlinks">Total links discovered: <span></span></div>
		<div class="linksfound" id="info_glinks">Good links discovered: <span></span></div>
		<div class="linksfound" id="info_slinks">Strong links discovered: <span></span></div>
	</div>
	
</div>



<div class="welcome" id="welcome_page">
	<div class="biglogo">
		<?php
		$svg = new \SVG( 'img/logo1.svg' );
		$svg->SetID( 'biglogo' );
		$svg->Output();?>
	</div>
	<h1>Type in the first thing that comes to your mind.</h1>
	
	<?php include "template/template_newlink_raw.php" ?>
	
	<p>
    The Wordex is a creative resource that's built from human input. 
	  Every <i>thought</i> you type in helps to expand the database.
  </p>

  <p>
    The Wordex is a self growing reference of relations between
    thoughts. It's like a thesaurus, except it doesn't only contain synonyms or antonyms.
    For example, <i>baby</i> and <i>crib</i> 
    aren't the same thing, but cribs are for babies, so <i>baby</i>
    and <i>crib</i> should form a <i>strong link</i> in the Wordex.
  </p>

  <p>
	To satisfy the Wordex, you need to tell your friends to input some words too. 
	The Wordex is designed to cross reference
	many data sources (human brains) to determine which links are interesting.
	You can also vote on links to help it out.
  </p>
 
  <p>You can explore the Wordex core at the <i><a href="nebula/">Word Nebula</a><sup>(BETA)</sup></i>.</p>
	
  <h3>"A crowdsourced brainstorm"!</h3>

  <div class="stats">
    <div class="linksfound" id="info_tlinks">Total links discovered: <span></span></div>
    <div class="linksfound" id="info_glinks">Good links discovered: <span></span></div>
    <div class="linksfound" id="info_slinks">Strong links discovered: <span></span></div>
  </div>
	
</div>


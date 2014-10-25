
<div class="welcome" id="welcome_page">
	<div class="biglogo">
		<?php
		$svg = new \SVG( 'img/logo1.svg' );
		$svg->SetID( 'biglogo' );
		$svg->Output();?>
	</div>
	<h1>Type in a word or phrase to begin.</h1>
	
	<?php include "template/template_newlink_raw.php" ?>
	
	<p>The Wordex is a creative resource that is built from human thoughts. 
	Since you're a human, you can contribute to the project! 
	Every <i>thought</i> you type in helps to build the database.</p>
	
	<p>To help out more, you can vote on existing <i>links</i>. 
	When you search for a thought, it might already have links associated with it. 
	If you can see a relation between a link's thought and the current thought
	you are on, you should give it an upvote. If you don't see a relation, or if you just dislike a link, 
	you should downvote it. Links with a low score sink 
	to the bottom and may be removed later. You also put votes into the system just by using it normally;
	if you type in the same thing as someone else, or click on a link, then an upvote is given.
	
	<p>Eventually, the Wordex will grow into a massive database of relations between
	thoughts. It's kind of like a thesaurus, except with more than just synonyms. Actually, we aren't
	looking for synonyms—that's what a thesaurus is for. For an example of what we <i>are</i> looking for: 
	<i>baby</i> and <i>crib</i> are definitely not the same thing, but cribs are for babies! So, ideally, <i>baby </i>
	and <i>crib</i> should form a <i>strong link</i>.</p>
	
	<p>This only works if a lot of people contribute, so you should tell your friends to put in a few words too!</p>
	
	<p>Want to explore the Wordex core? Visit the <i><a href="nebula/">Word Nebula</a></i>.</p>
	
	<h3>"A crowdsourced brainstorm"!</h3>
	
	<div class="stats">
		<div class="linksfound" id="info_tlinks">Total links discovered: <span></span></div>
		<div class="linksfound" id="info_glinks">Good links discovered: <span></span></div>
		<div class="linksfound" id="info_slinks">Strong links discovered: <span></span></div>
	</div>
	
</div>


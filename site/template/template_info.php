﻿
<div class="welcome">
	<div class="biglogo">
		<?php
		$svg = new \SVG( 'img/logo1.svg' );
		$svg->SetID( 'biglogo' );
		$svg->Output();?>
	</div>
	<h1>Type in a word or phrase to begin your query.</h1>
	
		{{querybox}}
		
	<p>The Wordweb is a creative resource that is built from human thoughts. 
	Since you're a human, you're able to contribute to the project! Simply type 
	in a word or phrase (a <i>thought</i>) in the above space, and then continue from there.
	Every thought you type in helps to build the database!</p>
	
	<p>To help even more, you can vote on existing <i>links</i>. 
	When you search for a thought, it might already have links associated with it. 
	If you can see a relation between a link's thought and the current thought
	you are on, you should give it an upvote. If you don't see a relation, then you should
	downvote it. Clicking on a link to follow it also gives it an upvote.</p>
	
	<p>Eventually, the Wordweb will grow into a massive database of relations between
	thoughts. It's kind of like a thesaurus, except with more than just synonyms. Actually, we aren't
	looking for synonyms—that's what a thesaurus is for! For an example of what we <i>are</i> looking for: 
	<i>baby</i> and <i>crib</i> are definitely not the same thing, but cribs are for babies! So, ideally, <i>baby </i>
	and <i>crib</i> should form a <i>strong link</i>!</p>
	
	<p>This only works if a lot of people contribute, so you should tell your friends to put in a few words too!</p>
	
	<h3><i>"A crowdsourced brainstorm"!</i></h3>
	
	<div class="stats">
		<div class="linksfound" id="info_tlinks">Total links discovered: <span></span></div>
		<div class="linksfound" id="info_glinks">Good links discovered: <span></span></div>
		<div class="linksfound" id="info_slinks">Strong links discovered: <span></span></div>
	</div>
</div>
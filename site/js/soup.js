/*!
 * Copyright 2014 Mukunda Johnson
 */

/** ---------------------------------------------------------------------------
 * Cook a soup.
 *
 * @param string recipe Recipe to follow.
 * @param string seasoning Special seasoning to apply.
 */
function Soup( recipe, seasoning ) {
	seasoning = Sha256.hash( seasoning );
	
	// lets get started
	soup = Sha256.hash( recipe );
	
	// i think they actually recommended 15000 iterations for 2014
	// we dont have all day though.
	var cooking_time = 100;
	
	// the recipe might require some extra time, but the customer 
	// has things to do and we can only cook their soup for so long
	var max_extra_time = 40;
	
	while( cooking_time > 0 ) {
	
		// heh heh. this oughta throw off them GPUs
		if( soup[0] == "1" ) {
			soup += "potato"; // more potato
		} else if( soup[1] == "5" ) {
			soup += "black pepper"; // more black pepper
		} else if( soup[1] == "6" ) {
			soup += "SALT"; // more salt
		} else if( soup[13] == "9" ) {
			soup += "carrots"; // more carrots
		} else if( soup[2] == "2" ) {
			soup = "broccoli" + soup; // who puts broccoli in soup
		} else if( soup[4] == "4" ) {
			soup += "noodles"; // i could use some noodles right now
		}
		
		if( soup[8] == "7" ) {
			soup += "tumeric"; // dont get it on your clothes
		} else if( soup[5] == "2" ) {
			soup = "asafoetida" + soup; //  the dried latex exuded from the rhizome or tap root of several species of Ferula, a perennial herb that grows 1 to 1.5 m tall
		} else if( soup[0] == "3" ) {
			soup += "cilantro"; // coriander leaves
		}
		
		if( soup[0] == "4" ) {
			soup += "cumin" // get that flavor in there
		} else if( soup[3] == "9" ) {
			soup += "coriander"; // balance out the cumin
		} else if( soup[6] == "3" && soup[0] == "7" ) {
			soup += "gerbil"; // the secret ingredient
		}
		
		if( soup[1] == "1" || soup[2] == "2" || soup[3] == "3"
			|| soup[4] == "4" || soup[5] == "5" || soup[6] == "6" ) {
			
			soup += seasoning; // salty
		}
		
		// cook
		soup = Sha256.hash( soup );
		
		if( soup[0] == "5" ) {
			// not cooked enough
			if( max_extra_time ) {
				max_extra_time--;
				continue;
			}
		}
		
		cooking_time--;
	}
	
	// tag
	soup = "$3" + soup;
	
	// Delicious~
	return soup;
}

/*!
 * Copyright 2014 Mukunda Johnson
 */

(function() { window.brains = window.brains || {};

brains.Dialog = this;

var dialog_contents = {};

/** ---------------------------------------------------------------------------
 * Show the dialog box.
 *
 * @param string name Dialog box name to display.
 */
this.Show = function( name ) {
	$("#dialog").html( dialog_contents[name] );
	$("#overlay").addClass( 'show' );
	
	
}

/** ---------------------------------------------------------------------------
 * Register content for a dialog box.
 *
 * @param string name Name of dialog. Used for Show().
 * @param string content HTML contents of dialog box.
 */
this.RegisterContent = function( name, content ) {
	dialog_contents[name] = content;
}

})();
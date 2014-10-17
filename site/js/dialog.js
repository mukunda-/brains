/*!
 * Copyright 2014 Mukunda Johnson
 */
 
window.brains = window.brains || {};

brains.Dialog = new function() { 
  
var m_locked = false;

var m_locked_selection;
  
/** ---------------------------------------------------------------------------
 * Show the dialog box.
 *
 * @param string   name        Dialog box name to display.
 * @param function initializer Optional function to call after the dialog is
 *                             loaded.
 */
function Show( name, initializer ) {
	
	m_locked = false;
	//m_init_function = null;
	$("#dialog").html( $("#dialog_" + name).html() );
	$("#overlay").addClass( 'show' );
	if( initializer ) {
		initializer();
	}
	// hook error highlighter
	$("#dialog").find( ".textinput" ).keyup( function() {
		$(this).removeClass( "error" );
	} );
	
	$("#query").attr( "disabled", "disabled" );
	$("#newlink").attr( "disabled", "disabled" );
} 

/** ---------------------------------------------------------------------------
 * Close the dialog box.
 */
function Close() {
	if( m_locked ) return; // can't close a locked dialog.
	$("#overlay").removeClass( 'show' );
	$("#dialog").html( "" );
	
	$("#query").removeAttr( "disabled" );
	$("#newlink").removeAttr( "disabled" );
} 

/** ---------------------------------------------------------------------------
 * Set the function to execute after the dialog contents are loaded.
 *
 * This must be done in a script inside the dialog template.
 */
 /*
function SetInit( f ) {
	m_init_function = f;
} */


/** ---------------------------------------------------------------------------
 * Lock the dialog box, preventing interaction until a process has completed.
 *
 * Must be unlocked later with Unlock().
 */ 
function Lock() {
	if( m_locked ) return;
	m_locked = true;
	dialog = $("#dialog");
	m_locked_selection = dialog.find( 
		"input:enabled, textarea:enabled, button:enabled" )
		.attr( "disabled", "disabled" );
		
	//.attr( "disabled", "disabled" );
} 

/** ---------------------------------------------------------------------------
 * Unlock the dialog box, allowing interaction or closing.
 */
function Unlock() {
	if( !m_locked ) return;
	m_locked = false;
	
	m_locked_selection.removeAttr( "disabled" );
	
} 

/** ---------------------------------------------------------------------------
 * Display an error, #dialog_error must be defined.
 *
 * @param string error The error text to display.
 */
function ShowError( error ) {
	var div = $("#dialog_error");
	div.text( error )
		.removeClass( "visible" )
	setTimeout( function() {
		div.addClass("visible");
	}, 50 );
}

/** ---------------------------------------------------------------------------
 * Mark a field as errornous.
 *
 * @param string id ID of input element.
 */
function MarkErrorField( id ) {
	$("#"+id).addClass( "error" )
		.focus();
}

//-----------------------------------------------------------------------------
// exposure:

this.Show    = Show;
this.Close   = Close;
this.Lock    = Lock;
this.Unlock  = Unlock;
this.MarkErrorField = MarkErrorField;
this.ShowError = ShowError;

};

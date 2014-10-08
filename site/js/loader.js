 /*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { window.brains = window.brains || {};

// Loader
// module for loading pages in place
 
brains.Loader = this;

var FADE_OUT_TIME = 500; // not the actual fadeout time (set in css)
var FADE_IN_TIME = 500;  // only used to control timeout delays

var m_loading = false;  // loading is set while a new page is being loaded
						// this includes the time between the call to Load
						// until the loaded content is initialized and
						// fading in
						
var m_fading_out = false;  // used to coordinate fadeout and ajax result
var m_page_content = null; //

var m_ag = AsyncGroup.Create();

var m_icontimeout = AsyncGroup.Create();

// error content when the ajax fails:
var PAGE_LOAD_FAILED_CONTENT = 
	'<div class="error">'+
		'something messed up.'+
	'</div><!-- (the page failed to load.) -->';
	 
/** ---------------------------------------------------------------------------
 * Set the page content and fade in.
 *
 * @param content Content to insert into #content.
 *
 */
function FadeIn( content ) {
	m_fading_out = false;
	HideLoadingIcon();
	$(window).scrollTop(0);
	
	// global initialization here:
	brains.InitializePreLoad();
	
	output = $('#content');
	$('#content').html( content );
	brains.InitializePostLoad();
	m_loading = false;
	
	$(window).scrollTop( 0 );
	output.addClass( 'visible' ); // fade in
}

//-----------------------------------------------------------------------------
function ShowLoadingIcon() {
	m_icontimeout.ClearAll();
	$("#loader_window").removeClass( "hidden" );
	m_icontimeout.Set( function() {
		$("#loader_window").addClass( "fadein" );
	},100);
	
}

//-----------------------------------------------------------------------------
function HideLoadingIcon() {
	m_icontimeout.ClearAll();
	$("#loader_window").removeClass( "fadein" );
	m_icontimeout.Set( function() {
		$("#loader_window").addClass( "hidden" );
	}, 1000 );
}

/** ---------------------------------------------------------------------------
 * Load a content page.
 *
 * @param object info Information about request
 *                 "url": URL of page to load
 *                 [delay]: Used to control the Extra Dramatic Break Effect.
 *                          negated values are treated as negated absolute 
 *                          values positive values are added to the normal
 *                          fade constant.
 *                 [data]: Data to send with request.
 *                 [post]: Make a POST request, Default is GET
 *                 [process]: Function to process the data. This function
 *                            accepts the response as a parameter and
 *                            returns the new page content or FALSE to cancel
 *                            the page load.
 */
this.Load = function( info ) {
	if( m_loading ) return;
	
	//matbox.ResetIdleTime();
	if( !info.hasOwnProperty( "url" ) ) {
		throw "Must specify URL.";
	}
	
	if( !info.hasOwnProperty( "delay" ) ) {
		info.delay = 500;
	}	
	
	if( !info.hasOwnProperty( "process" ) ) {
		info.process = function( data ) { return data; };
	}
	 
	if( info.delay < 0 ) info.delay = -info.delay - FADE_OUT_TIME; 
	
	m_loading = true;
	
	//matbox.LiveRefresh.Reset(); 
	
	//output = $( '#content' );
	//output.removeClass( 'visible' ); // fade out
	
	m_fading_out = true;
	
	ShowLoadingIcon();
	//m_icontimeout.Set( ShowLoadingIcon, 2000 );
	
	/*
	m_ag.Set( 
		function() {
			m_fading_out = false; 
			if( m_page_content != null ) {
				FadeIn( m_page_content );
				m_page_content = null;
			} else {
				// we finished first, prime the output.
				output.html("");
			}
		}, FADE_OUT_TIME+delay );
	*/
	var ajax = post ? $.post( url, data ) : $.get( url_data );
	
	m_ag.AddAjax( ajax )
		.done( function(data) {
			data = info.process( data );
			if( data === false ) return; // page load cancelled.
										 // (usually because of an error.)
			m_page_content = data;
			output = $( '#content' );
			output.removeClass( 'visible' ); // fade out
			
			m_ag.Set(
				function() {
					FadeIn( m_page_content );
					m_page_content = null;
				}, FADE_OUT_TIME+delay );
		})
		.fail( function( handle ) {
			if( handle.ag_cancelled ) return;
			
			alert( "An error occurred. Please try again." );
		});
	
}

/** ---------------------------------------------------------------------------
 * Same as Load, but cancel an existing load first.
 *
 */
this.ForceLoad = function( url, delay, get ) {
	if( m_loading ) {
		
		m_ag.ClearAll();
		m_loading = false;
	}
	Load( url, delay, get );
}

/** ---------------------------------------------------------------------------
 * Check if a page is loading
 *
 * @return true if the page is fading out or otherwise busy loading.
 */
this.IsLoading = function() {
	return m_loading;
}

/** ---------------------------------------------------------------------------
 * Set the loading flag, to freeze the page for an imminent pageload. 
 */
this.SetLoading = function() {
	m_loading = true;
}

/** ---------------------------------------------------------------------------
 * Cancel any page load in progress.
 */
this.Cancel = function() {
	if( m_loading ) {
		
		m_ag.ClearAll();
		m_loading = false;
	}
}

})();

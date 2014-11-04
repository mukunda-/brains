 /*!
 * Copyright 2014 Mukunda Johnson
 */
 
window.brains = window.brains || {};
 
brains.Loader = new function() { 

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
//	HideLoadingIcon();
	ga('send', 'pageview', {
		'page': '/' + brains.GetCurrentTag()
	});
	SetContent( content );
	
}
 
/** ---------------------------------------------------------------------------
 * Set the page content.
 *
 * @param content Content to insert into #content
 */
function SetContent( content ) {
	Cancel(); // for when this is used directly.
	
	
	$(window).scrollTop(0);
	
	brains.InitializePreLoad();
	
	output = $('#content');
	$('#content').html( content );
	brains.InitializePostLoad();
	//m_loading = false;
	
	$(window).scrollTop( 0 );
	output.addClass( 'visible' ); // fade in
}
/*
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
}*/

/** ---------------------------------------------------------------------------
 * Load a content page.
 *
 * @param object info Information about request
 * {
 *    "url"      URL of page to load
 *    "process"  Function to process the data. This function
 *               accepts the response as a parameter and
 *               returns the new page content or FALSE to cancel
 *               the page load. null will be passed as the response
 *               if an error occurred with the request.
 *
 *    [data]     Data to send with request.
 *
 *    [post]     Make a POST request, Default is GET
 *
 *    [delay]    Used to control the Extra Dramatic Break Effect.
 *               negated values are treated as negated absolute 
 *               values positive values are added to the normal
 *               fade constant.
 *
 *    [...] params are optional.
 * }
 */
function Load( info ) {
	if( m_loading ) return;
	
	//matbox.ResetIdleTime();
	if( !info.hasOwnProperty( "url" ) ) {
		throw "Must specify URL.";
	}
	
	if( !info.hasOwnProperty( "delay" ) ) {
		info.delay = 100;
	}	
	
	if( !info.hasOwnProperty( "process" ) ) {
		throw "Must specify process.";
	}
	
	if( !info.hasOwnProperty( "post" ) ) {
		info.post = false;
	}
	
	info.data = info.data || {};
	if( info.delay < 0 ) info.delay = -info.delay - FADE_OUT_TIME; 
	
	m_loading = true;
	 
	//ShowLoadingIcon();
	 
	var ajax = info.post ? 
				$.post( info.url, info.data ) : 
				$.get( info.url, info.data );
				
	function call_failure() {
		info.process( null );
		m_loading = false;
		m_fading_out = false;
		brains.HideLoadingIcons();
	}
	
	
	m_ag.AddAjax( ajax )
		.done( function(data) { 
		
			if( data == "" ) {
				call_failure();
				return;
			}
			try {
				data = JSON.parse( data );
			} catch( err ) {
				call_failure();
				return;
			}
			
			data = info.process( data );
			if( data === false ) {
				m_loading = false;
				m_fading_out = false;
				return; // page load cancelled.
						// (usually because of an error.)
			}
			m_page_content = data;
			output = $( '#content' );
			output.removeClass( 'visible' ); // fade out
			
			m_fading_out = true;
			m_ag.Set(
				function() {
					FadeIn( m_page_content );
					m_page_content = null;
				}, FADE_OUT_TIME+info.delay );
		})
		.fail( function( handle ) {
			if( handle.ag_cancelled ) return;

			
			call_failure();
		});
	
}

/** ---------------------------------------------------------------------------
 * Same as Load, but cancel an existing load first.
 *
 */
function ForceLoad( url, delay, get ) {
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
function IsLoading() {
	return m_loading;
}

/** ---------------------------------------------------------------------------
 * Set the loading flag, to freeze the page for an imminent pageload. 
 */
function SetLoading() {
	m_loading = true;
}

/** ---------------------------------------------------------------------------
 * Cancel any page load in progress.
 */
function Cancel() {
	if( m_loading ) {
		
		m_ag.ClearAll();
		m_loading = false;
	}
}

this.SetContent = SetContent;
this.Load = Load;
this.ForceLoad = ForceLoad;
this.IsLoading = IsLoading;
this.SetLoading = SetLoading;
this.Cancel = Cancel;

};

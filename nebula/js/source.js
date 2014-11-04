// process the data set

window.Source = new function() {
	
var m_source;

var m_stack = [];
var m_found = {};

//var m_cells = {};
var m_phrases = {};

var m_elements = [];

var MAX_SHADE_DIST = 500;

var E_WORD = 1;
this.E_WORD = 1;
var E_LINE = 2;
this.E_LINE = 2;

var m_postload;

function Load( source, onload ) {
	// todo: double up links, remove that from tree.php
	m_source = source;
	
	// add reversed links
	var backlinks = {};

	for( var from in m_source.links ) {
		if( !m_source.links.hasOwnProperty( from ) ) continue;
		
		for( var i = 0; i < m_source.links[from].length; i++ ) {
			var to = m_source.links[from][i].t;
			
			if( !backlinks.hasOwnProperty( to ) ) {
				backlinks[to] = [];
			}
			backlinks[to].push({
				"t": from,
				"s": m_source.links[from][i].s,
				"b": m_source.links[from][i].b
			});
		}
		
	}
	
	for( var i in backlinks ) {
		if( !backlinks.hasOwnProperty( i ) ) continue;
		
		if( !m_source.links.hasOwnProperty( i ) ) {
			m_source.links[i] = [];
		}
		
		m_source.links[i] = m_source.links[i].concat( backlinks[i] );
	}
	// i hope that worked
	
	backlinks = null;
	
	m_stack.push( {
		from: 0,
		id: m_source.start, 
		progress: 0, 
		x:0, y:0, 
		level:0, 
		power: 100, 
		angle: 0.0,
		color: {
			r: 1.0,
			g: 1.0,
			b: 1.0
		}
	});
	setTimeout( DoProcess, 5 );
	
	m_postload = onload;
}

function GetElements() {
	return m_elements;
}

function GetPhrase( id ) {
	return m_source.phrases[id];
}

function GetCell( point, create ) {
	x = point.x >> 8;
	y = point.y >> 8;
	x = x < 0 ? -x*2+1 : x*2;
	y = y < 0 ? -y*2+1 : y*2;
	
	if( m_cells.hasOwnProperty( x ) && m_cells[x].hasOwnProperty(y) ) {
		return m_cells[x][y];
	} 
	if( !create ) return null;
	
	if( !m_cells.hasOwnProperty( x ) ) {
		m_cells[x] = {};
	}
	
	m_cells[x][y] = { lines: [], words: [] };
	return m_cells[x][y];
}
	
/** ---------------------------------------------------------------------------
 * Add an word to the element list.
 *
 * @param int phrase ID of phrase to use. 0 for a line-only element.
 * @param point point Destination point.
 * @param float opacity Opacity to render the element.
 */
function AddWord( phrase, point, opacity, level ) {
	var index = m_elements.push( {
		type: E_WORD,
		phrase: phrase,
		location: {
			x: point.x,
			y: point.y,
		},
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( point );
	//cell.push( index );
}

/** ---------------------------------------------------------------------------
 * Add a connection/line.
 *
 * @param point from,to Line coordinates.
 * @param float opacity Opacity to render the element.
 */
function AddLine( from, to, color, opacity, level ) {
	var index = m_elements.push( {
		type: E_LINE,
		from: {
			x: from.x,
			y: from.y
		}, 
		to: {
			x: to.x,
			y: to.y
		},
		color: color,
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( to );
	//cell.push( index );
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function Shuffle( o ) { //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function RndRange( min, max ) {
	return Math.random() * (max-min) + min;
}

function Distance2( a, b ) {
	return (b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y);
}

function ProcessItem() { 
	if( Math.random() < 0.1 ) {
		var item = m_stack.shift();
	} else {
		var item = m_stack.pop();
	}
		
	var found = m_found.hasOwnProperty(item.id);
	
	if( found ) {
		if( Distance2( 
				m_found[item.from], m_found[item.id].x ) 
				    < MAX_SHADE_DIST * MAX_SHADE_DIST ) {
					  
			AddLine( m_found[item.from], m_found[item.id], item.color, 0.5, item.level );
			 
			return 1;
		}
	}
	
	if( item.from != 0 ) {
		// draw line
		AddLine( m_found[item.from], item, m_found[item.from].color, found ? 0.5 : 1.0, item.level );
	}
	
	if( item.progress == 0 ) {
		AddWord( item.id, item, found ? 0.5 : 1.0, item.level  );
		item.progress = 1;
	}
	
	if( m_found.hasOwnProperty(item.id)  ) return 0;
	m_found[item.id] = { x: item.x, y: item.y,
		color: {
			r: item.color.r,
			g: item.color.g,
			b: item.color.b
		}
	};
	
	//item.color.r = ;
	//item.color.g = Math.clamp( item.color.g+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	//item.color.b = Math.clamp( item.color.b+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	
	
	Shuffle( m_source.links[item.id] );
	
	var length = m_source.links[item.id].length;
	//var dbase = -140.0;
	
	for( var i = 0; i < length; i++ ) {
		if( m_source.links[item.id][i].t == item.from ) continue;
		if( m_source.links[item.id][i].b != 0 ) continue;
		
		var distance_range = 1.0 + Math.max(1.0-(item.level / 10.0),0.0) * 2.0  + 1.0;// Math.max( Math.min( 1.0, length / 5.0 * 1.0 ), 0.2 ) * 3.0;+
		
		var angle_range = 0.1+Math.min( 1.0, length / 10.0 ) * 2.0 +  Math.max(1.0-(item.level / 3.0),0.0) * 6.0; 
		var angle = item.angle + RndRange(-angle_range,angle_range) - 0.02;
		  
		var distance = RndRange( 70.0 , 100.0 )* distance_range;// + dbase;
	 
		var x2 = Math.round(item.x + Math.cos( angle ) * distance);
		var y2 = Math.round(item.y + Math.sin( angle ) * distance);
	
		m_stack.push( {
			from: item.id,
			id: m_source.links[item.id][i].t,
			power: m_source.links[item.id][i].s,
			progress: 0,
			level: item.level+1,
			x: x2,
			y: y2,
			angle: angle,
			color: {
				r: Math.clamp( item.color.r + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				g: Math.clamp( item.color.g + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				b: Math.clamp( item.color.b + RndRange( -0.1, 0.1 ), 0.4, 1.0 )
			}} ); 
	}
	return 1;
}


function DoProcess() {
	
	var time = 0;
	while( time < 50 ) {// 4000 ) {
		if( m_stack.length == 0 ) {
			m_postload();
			return; // finished!
		}
		time += ProcessItem();
	}
	
	setTimeout( DoProcess, 5 );
}

this.GetCell = GetCell;
this.Load = Load;

this.GetElements = GetElements;
this.GetPhrase = GetPhrase;
	
};
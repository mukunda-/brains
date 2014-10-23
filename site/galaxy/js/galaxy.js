
(function() {

var m_source;

var m_svg = [];
var m_links = "";
var s_svg_text;
var s_svg_lines;
var s_magic;

var m_stack = [];
var m_found = {};
var m_pos = {};

var WIDTH = 8000;
var HEIGHT = 8000;

var STARTX = WIDTH/2;
var STARTY = HEIGHT/2;

var MAXSCALE = 50;
var MINSCALE = 0.01;

var m_scale = MAXSCALE;

var m_drag = {
	x:0,
	y:0,
	active: false
};

var camera = { x: 0, y: 0 };

$(function() {
	
	setTimeout( function() {
		s_magic = $("#magicbox");
		$.get( "../tree.php", {} )
			.done( function( data ) {
				m_source = data;
				Render();
			})
			.fail( function() {
				alert( "An error occurred." );
				m_source = {};
			});
	}, 100 );
});


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function Shuffle( o ) { //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function Output( id, x1, y1, x2, y2, angle, level ) {
	//m_svg += 
}

function MakeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs)
		el.setAttribute(k, attrs[k]);
		
	return el;
}

function DrawLine( x1, y1, x2, y2, shade ) {
	
	var style2 = shade ? ";opacity: 0.5" : "";
	content = MakeSVG( "line", {
			x1: x1 + STARTX,
			y1: y1 + STARTY,
			x2: x2 + STARTX,
			y2: y2 + STARTY,
			style: "stroke: white; stroke-width:1" + style2
		}
	);
	s_svg_lines.appendChild( content );
}

function DrawText( text, x, y, shade ) {
	var sx = x+STARTX;
	var sy = y+STARTY;
/*
	var content = '<text x="{x}" y="{y}" fill="black">{text}</text>'
		.replace( "{x}", x )
		.replace( "{y}", y )
		.replace( "{text}", text );*/
	
	s_magic.text( text ); 
	var width = s_magic.width();
	var height = s_magic.height();
	/*
	content = MakeSVG( "text", {
			x: sx - width/2,
			y: sy + height/4,
			fill: "white",
			style: "stroke: white; stroke-width:6"
		}
	);
	content.innerHTML = text;
	s_svg_text.appendChild( content );
	*/
	var style = "";
	if( shade ) style = "opacity: 0.5";
	
	
	content = MakeSVG( "rect", {
			x: sx - width/2-2,
			y: sy - height/2,
			width: width+4,
			height: height,
			fill: "white",
			title: text,
			style: style
		}
	);
	
	s_svg_text.appendChild( content );
	
	content = MakeSVG( "text", {
			x: sx - width/2,
			y: sy + height/4,
			fill: "black",
			title: text,
			style: style
		}
	);
		
	content.innerHTML = text;
	s_svg_text.appendChild( content );
	//m_svg.push( content );
	
	//s_svg_text
}

function Render() {
	$("#galaxy").append( '<svg id="svg_lines" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewbox="0 0 '+WIDTH+' '+HEIGHT+'""></svg>' );
	$("#galaxy").append( '<svg id="svg_text" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewbox="0 0 '+WIDTH+' '+HEIGHT+'""></svg>' );
	s_svg_text = document.getElementById("svg_text");//$("#svg_text");
	s_svg_lines = document.getElementById("svg_lines");//$("#svg_text");
	
	UpdateCamera();
	m_stack.push( {from:0,id:m_source.start, progress:0, x:0, y:0, level:0, power: 100, angle: 0.0} );
	setTimeout( DoRender, 5 );
}

function RndRange( min, max ) {
	return Math.random() * (max-min) + min;
}

function Distance2( x1, y1, x2, y2 ) {
	return (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
}

function RenderItem() {
	var item = m_stack.shift();
	
	var shade = m_found.hasOwnProperty(item.id);
	
	if( shade ) {
		if( Distance2( m_pos[item.from].x, m_pos[item.from].y, m_pos[item.id].x, m_pos[item.id].y ) < 500 * 500 ) {
			DrawLine( m_pos[item.from].x, m_pos[item.from].y, m_pos[item.id].x, m_pos[item.id].y, false );
			return 1;
		}
	}
	
	if( item.from != 0 ) {
		// draw line
		DrawLine( m_pos[item.from].x, m_pos[item.from].y, item.x, item.y, shade );
	}
	
	if( item.progress == 0 ) {
		DrawText( m_source.phrases[item.id], item.x, item.y,  shade );
		item.progress = 1;
	}
	
	if( m_found.hasOwnProperty(item.id)  ) return 0;
	m_found[item.id] = 1;
	m_pos[item.id] = { x: item.x, y: item.y };
	
	Shuffle( m_source.links[item.id] );
	
	var length = m_source.links[item.id].length;
	//var dbase = -140.0;
	//length = Math.min(3,length);
	for( var i = 0; i < length; i++ ) {
		var distance_range = 1.0 + Math.max(1.0-(item.level / 10.0),0.0) * 2.0  + 1.0;// Math.max( Math.min( 1.0, length / 5.0 * 1.0 ), 0.2 ) * 3.0;+
		
		var angle_range = 0.1+Math.min( 1.0, length / 20.0 ) * 2.0 +  Math.max(1.0-(item.level / 3.0),0.0) * 6.0; 
		var angle = item.angle + RndRange(-angle_range,angle_range) + 0.05;
		
		//var angle = Math.random() * 3.14159*2.0;
		
		//var distance = RndRange( 40.0 , 120.0 )* distance_range;
		var distance = RndRange( 70.0 , 100.0 )* distance_range;// + dbase;
		//dbase += 5.0;
		var x2 = item.x + Math.cos( angle ) * distance;
		var y2 = item.y + Math.sin( angle ) * distance;
	
		// todo: catch going back to previous id.
		m_stack.push( {
			from: item.id,
			id: m_source.links[item.id][i].to,
			power: m_source.links[item.id][i].score,
			progress: 0,
			level: item.level+1,
			x: x2,
			y: y2,
			angle: angle } ); 
	}
	return 1;
}

function DoRender() {
	
	var time = 0;
	while( time < 4 ) {
		if( m_stack.length == 0 ) {
			
			return; // finished!
		}
		time += RenderItem();
	}
	
	setTimeout( DoRender, 5 );
}

$(window).bind( "mousewheel", function( ev, delta ) {
	
	var ww = $(window).width();
	var wh = $(window).height();
	var left, top;
	left = camera.x - ww * m_scale/2 + STARTX;
	top = camera.y - wh * m_scale/2 + STARTY;
	
	var mousex = ev.pageX * m_scale + left;
	var mousey = ev.pageY * m_scale + top;
	
	if( delta > 0 ) {
		m_scale /= Math.pow(1.1,delta);
	} else {
		m_scale *= Math.pow(1.1,-delta);
	}
	m_scale = Math.max( MINSCALE, m_scale );
	m_scale = Math.min( MAXSCALE, m_scale );
	
	left = camera.x - ww * m_scale/2 + STARTX;
	top = camera.y - wh * m_scale/2 + STARTY;
	var mousex2 = ev.pageX * m_scale + left;
	var mousey2 = ev.pageY * m_scale + top;
	
	camera.x += (mousex - mousex2) * 1.25;
	camera.y += (mousey - mousey2) * 1.25;
	
	UpdateCamera();
	
	//$("svg").css( "width", WIDTH * m_scale + "px" );
	//$("svg").css( "height", HEIGHT * m_scale + "px" );
	
	
}); 


$(window).mousedown( function(ev ) {

	if( ev.which == 1 ) {
		m_drag.active = true;
		m_drag.x = ev.screenX;
		m_drag.y = ev.screenY;
	}
}); 

$(window).resize( function() {
	UpdateCamera();
});

$(window).mouseup( function(ev ) {

	if( ev.which == 1 ) {
		m_drag.active = false;
	}
}); 

$(window).mousemove( function( ev ) {
	if( m_drag.active ) {
		camera.x -= (ev.screenX - m_drag.x) * m_scale;
		camera.y -= (ev.screenY - m_drag.y) * m_scale;
		m_drag.x = ev.screenX;
		m_drag.y = ev.screenY;
		UpdateCamera();
	}
});

function UpdateCamera() {
	var ww = $(window).width();
	var wh = $(window).height();
	
	var left, top, right ,bottom;
	left = camera.x - ww * m_scale/2 + STARTX;
	top = camera.y - wh * m_scale/2 + STARTY;
	width = ww * m_scale ;
	height = wh * m_scale ;
	
	var svg = document.getElementsByTagName("svg");
	for( var i = 0; i < svg.length; i++ ) {
		svg[i].setAttribute( "viewBox", left + " " + top + " " + width + " " + height );
	}
}
	
})();
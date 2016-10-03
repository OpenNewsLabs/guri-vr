
/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {}

EventDispatcher.prototype = {

	constructor: EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = EventDispatcher.prototype.addEventListener;
		object.hasEventListener = EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

	},

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};

var PANOMNOM = {}

PANOMNOM.GOOGLEMAPSAPI = 'http://maps.google.com/maps/api/js?sensor=false';

PANOMNOM.GoogleStreetViewService = null;
PANOMNOM.GoogleGeoCoder = null;

PANOMNOM.Utils = {

	loadAsync: function( src,c  ) {

		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;
		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
		s.addEventListener( 'load', c );

	},

	getGoogleStreetViewService: function() {

		if( PANOMNOM.GoogleStreetViewService ) return PANOMNOM.GoogleStreetViewService;

		PANOMNOM.GoogleStreetViewService = new google.maps.StreetViewService();
		return PANOMNOM.GoogleStreetViewService;

	},

	getGoogleGeoCoder: function() {

		if( PANOMNOM.GoogleGeoCoder ) return PANOMNOM.GoogleGeoCoder;

		PANOMNOM.GoogleGeoCoder = new google.maps.Geocoder();
		return PANOMNOM.GoogleGeoCoder;

	},

	resolveAddress: function( address, callback ) {

		var geocoder = this.getGoogleGeoCoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
			if( status == google.maps.GeocoderStatus.OK ) {
				callback( results[ 0 ].geometry.location );
			} else {
				//showError("Geocode was not successful for the following reason: " + status);
				//showProgress( false );
			}
		} );

	}

};

PANOMNOM.Stitcher = function( canvas ) {

	this.canvas = canvas;
	this.ctx = this.canvas.getContext( '2d' );
	this.queue = [];
	this.toLoad = 0;
	this.loaded = 0;

}

PANOMNOM.Stitcher.prototype.reset = function() {

	this.toLoad = 0;
	this.loaded = 0;

}

PANOMNOM.Stitcher.prototype.addTileTask = function( task ) {

	this.queue.push( task );
	this.toLoad++;

}

PANOMNOM.Stitcher.prototype.updateProgress = function() {

	var p = this.loaded * 100 / this.toLoad;
	this.dispatchEvent( { type: 'progress', message: p } );

}

PANOMNOM.Stitcher.prototype.processQueue = function() {

	this.updateProgress();

	if( this.queue.length === 0 ) {
		this.dispatchEvent( { type: 'finished' } );
		return;
	}

	var task = this.queue.shift();

	var img = new Image();
	img.addEventListener( 'load', function() {

		this.loaded++;

		this.ctx.drawImage( img, 0, 0, img.naturalWidth, img.naturalHeight, task.x, task.y, 512, 512 );
		this.processQueue();

		img = null;

	}.bind( this ) );

	img.addEventListener( 'error', function() {

		this.dispatchEvent( { type: 'error', message: 'images missing' } );
		this.processQueue();

		img = null;

	}.bind( this ) );

	img.crossOrigin = '';
	img.src = task.url;

}

EventDispatcher.prototype.apply( PANOMNOM.Stitcher.prototype );

PANOMNOM.Loader = function() {

	this.canvas = document.createElement( 'canvas' );
	this.ctx = this.canvas.getContext( '2d' );

	this.stitcher = new PANOMNOM.Stitcher( this.canvas );
	this.stitcher.addEventListener( 'finished', function() {
		this.dispatchEvent( { type: 'load', message: 'Panorama loaded' } );
	}.bind( this ) );

	this.stitcher.addEventListener( 'progress', function( e ) {
		this.dispatchEvent( { type: 'progress', message: e.message } );
	}.bind( this ) );

}

PANOMNOM.Loader.prototype.load = function() {

}

PANOMNOM.Loader.prototype.error = function( msg ) {

	this.dispatchEvent( { type: 'error', message: msg } );

}

EventDispatcher.prototype.apply( PANOMNOM.Loader.prototype );

PANOMNOM.GoogleStreetViewLoader = function() {

	PANOMNOM.Loader.call( this );

	this.service = PANOMNOM.Utils.getGoogleStreetViewService();

	this.levelsW = [ 1, 2, 4, 7, 13, 26 ];
	this.levelsH = [ 1, 1, 2, 4, 7, 13 ];
	this.tileSize = 416;

	this.widths = [ 416, 832, 1664, 3328, 6656, 13312 ];
	this.heights = [ 416, 416, 832, 1664, 3328, 6656 ];

	this.zoom = 1;

	this.metadata = {};

}

PANOMNOM.GoogleStreetViewLoader.prototype = Object.create( PANOMNOM.Loader.prototype );

PANOMNOM.GoogleStreetViewLoader.prototype.load = function( id, zoom ) {

	//console.log( 'Loading ' + id + ' ' + zoom );

	if( zoom === undefined ) {
		console.warn( 'No zoom provided, assuming 1' );
		zoom = 1;
	}

	this.zoom = zoom;
	this.panoId = id;

	this.canvas.width = this.widths[ zoom ];
	this.canvas.height = this.heights[ zoom ];

	var w = this.levelsW[ zoom ];
	var h = this.levelsH[ zoom ];

	for( var y = 0; y < h; y++ ) {
		for( var x = 0; x < w; x++ ) {

			var url = 'https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + id + '&output=tile&x=' + x + '&y=' + y + '&zoom=' + zoom + '&nbt&fover=2';
			//var url = 'https://cbks2.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + id + '&output=tile&zoom=' + zoom + '&x=' + x + '&y=' + y + '&' + Date.now();

			this.stitcher.addTileTask( {

				url: url,
				x: x * 512,
				y: y * 512,

			} );
		}
	}

	url = "http://maps.google.com/cbk?output=json&hl=x-local&cb_client=maps_sv&v=4&dm=1&pm=1&ph=1&hl=en&panoid=" + id

	/*var http_request = new XMLHttpRequest();
	http_request.open( 'GET', url, true );
	http_request.onreadystatechange = function () {
		if ( http_request.readyState == 4 && http_request.status == 200 ) {
			var data = JSON.parse( http_request.responseText );
			this.metadata = data;
		}
	}.bind( this );
	http_request.send(null);*/

	/*var l = this;
	$.ajax( {
                url: url,
                dataType: 'jsonp'
            } ) .done(function(data, textStatus, xhr) {
                var decoded, depthMap;

                l.extractDepthData( data.model.depth_map );

            }); */

	this.service.getPanoramaById( id, function( result, status) {

		if( result === null ) {
			this.error( 'Can\'t load panorama information' );
			return;
		}

		this.metadata = result;
		this.dispatchEvent( { type: 'data', message: result } );

		this.stitcher.processQueue();
		//console.log( result );

	}.bind( this ) );
}

PANOMNOM.GoogleStreetViewLoader.prototype.loadFromLocation = function( location, zoom ) {

	this.getIdByLocation(
		location,
		function( id ) {
			this.load( id, zoom );
		}.bind( this )
	);

}

function getQueryVariable( query, variable) {

	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	//console.log('Query variable %s not found', variable);
}


PANOMNOM.GoogleStreetViewLoader.prototype.loadFromURL = function( url, zoom ) {

	if( url.indexOf( 'panoid' ) != -1 ) {
		// https://maps.google.com/?ll=40.741352,-73.986096&spn=0.002248,0.004372&t=m&z=18&layer=c&cbll=40.741825,-73.986315&panoid=NOMYgwQ4YfVqMJogsbMcrg&cbp=12,208.53,,0,6.03
		var panoId = getQueryVariable( url, 'panoid' );
		this.load( panoId, 2 );
	} else if( url.indexOf( '!1s' ) != -1 ) {
		var pos = url.indexOf( '!1s' ) + 3;
		var npos = url.substr( pos ).indexOf( '!' );
		var panoId = url.substr( pos, npos );
		this.load( panoId, zoom );
		// https://www.google.com/maps/preview?authuser=0#!q=Eleanor+Roosevelt+Playground&data=!1m8!1m3!1d3!2d-73.935845!3d40.693159!2m2!1f170.65!2f90!4f75!2m4!1e1!2m2!1s0Zn7rPD9Q4KOhRyEugT1qA!2e0!4m15!2m14!1m13!1s0x0%3A0x63459d24c457bec7!3m8!1m3!1d11440!2d-73.9085059!3d40.6833656!3m2!1i1329!2i726!4f13.1!4m2!3d40.6929389!4d-73.9357996&fid=5
	} else {
		this.dispatchEvent( { type: 'error', message: 'can\'t find panorama id in specified URL' } );
	}

}

PANOMNOM.GoogleStreetViewLoader.prototype.getIdByLocation = function( location, callback ){

	/*PANOMNOM.GoogleStreetViewService.getPanoramaByLocation( location, 50, function( result, status ) {

		if( status === google.maps.StreetViewStatus.OK ) {

			console.log( result );
			c( result.location.pano );
		}

	} );
	return;*/

	var url = 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll=' + location.lat() + ',' + location.lng() + '&radius=50';

	var http_request = new XMLHttpRequest();
	http_request.open( 'GET', url, true );
	http_request.onreadystatechange = function () {
		if ( http_request.readyState == 4 && http_request.status == 200 ) {
			var data = JSON.parse( http_request.responseText );
			//console.log( data );
			if( !data || !data.result || data.result.length === 0 ) {
				this.error( 'No panoramas around location' );
			} else {
				callback( data.result[ 0 ].id );
			}
		}
	}.bind( this );
	http_request.send(null);

}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

PANOMNOM.GoogleStreetViewLoader.prototype.extractDepthData = function( map ) {

	var rawDepthMap = map;

	while(rawDepthMap.length %4 != 0)
		rawDepthMap += '=';

	// Replace '-' by '+' and '_' by '/'
	rawDepthMap = rawDepthMap.replace(/-/g,'+');
	rawDepthMap = rawDepthMap.replace(/_/g,'/');

	document.body.textContent = rawDepthMap;

	var decompressed = zpipe.inflate( $.base64.decode( rawDepthMap ) );

	var depthMap = new Uint8Array(decompressed.length);
	for(i=0; i<decompressed.length; ++i)
		depthMap[i] = decompressed.charCodeAt(i);
	console.log( depthMap );

}

PANOMNOM.GooglePhotoSphereLoader = function() {

	PANOMNOM.Loader.call( this );

	this.service = PANOMNOM.Utils.getGoogleStreetViewService();

}

PANOMNOM.GooglePhotoSphereLoader.prototype = Object.create( PANOMNOM.Loader.prototype );

PANOMNOM.GooglePhotoSphereLoader.prototype.loadFromURL = function( url, zoom ) {

	if( url.indexOf( '!1s' ) != -1 ) {
		var pos = url.indexOf( '!1s' ) + 3;
		var npos = url.substr( pos ).indexOf( '!' );
		var panoId = url.substr( pos, npos );
		this.load( panoId, zoom );
		// https://www.google.com/maps/preview?authuser=0#!q=Eleanor+Roosevelt+Playground&data=!1m8!1m3!1d3!2d-73.935845!3d40.693159!2m2!1f170.65!2f90!4f75!2m4!1e1!2m2!1s0Zn7rPD9Q4KOhRyEugT1qA!2e0!4m15!2m14!1m13!1s0x0%3A0x63459d24c457bec7!3m8!1m3!1d11440!2d-73.9085059!3d40.6833656!3m2!1i1329!2i726!4f13.1!4m2!3d40.6929389!4d-73.9357996&fid=5
	}

};

PANOMNOM.GooglePhotoSphereLoader.prototype.load = function( id, zoom ) {

	//console.log( 'Loading ' + id + ' ' + zoom );

	this.zoom = zoom;
	this.panoId = id;

	this.service.getPanoramaById( id, function( result, status) {

		if( result === null ) {
			this.error( 'Can\'t load panorama information' );
			return;
		}

		var nearestZoom = Math.floor( Math.log( result.tiles.worldSize.width / result.tiles.tileSize.width ) / Math.log( 2 ) );

		this.canvas.width = result.tiles.worldSize.width * Math.pow( 2, zoom - 1 ) / Math.pow( 2, nearestZoom );
		this.canvas.height = result.tiles.worldSize.height * Math.pow( 2, zoom - 1 ) / Math.pow( 2, nearestZoom );

		var w = this.canvas.width / result.tiles.tileSize.width,
			h = this.canvas.height / result.tiles.tileSize.height;

		//console.log(nearestZoom, w, h, result.tiles.worldSize.width, result.tiles.worldSize.height, this.canvas.width, this.canvas.height );

		for( var y = 0; y < h; y++ ) {
			for( var x = 0; x < w; x++ ) {

				var url = 'https://geo1.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + id + '&output=tile&x=' + x + '&y=' + y + '&zoom=' + zoom + '&nbt&fover=2';

				this.stitcher.addTileTask( {

					url: url,
					x: x * result.tiles.tileSize.width,
					y: y * result.tiles.tileSize.height,

				} );
			}
		}

		this.stitcher.processQueue();

		//console.log( result );

	}.bind( this ) );


}

export default () => new PANOMNOM.GoogleStreetViewLoader()

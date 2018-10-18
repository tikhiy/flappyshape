'use strict';

var { request } = require( 'http' );
var { URL }     = require( 'url' );

var server      = require( './core/server' );
var app         = require( './core/app' );

if ( typeof process.env.PORT === 'undefined' ) {
  throw Error( ' - The FlappyShape Server was started without a port. "PORT" must be exported before starting the server: "PORT=3000 node .".' );
}

app
  .use( require( './core/middleware/winston' ) )
  .use( require( './core/middleware/compression' ) )
  .use( require( './core/middleware/helmet' ) )
  .use( require( './core/middleware/send_static' ) )
  .use( require( './core/middleware/parse_body' ) )
  .use( require( './core/route/index' ) )
  .use( require( './core/route/404' ) )
  .use( require( './core/route/500' ) );

server.listen( process.env.PORT, function ()
{
  console.log( ' - The FlappyShape Server is running.' );

  if ( process.env.NODE_ENV === 'production' ) {
    console.log( ' - The address: "http://flappyshape.herokuapp.com/".' );
  } else {
    console.log( ' - The address: "http://localhost:' + process.env.PORT + '/".' );
  }
} );

if ( process.env.NODE_ENV === 'production' ) {
  // Make a request to our free dyno every 10 minutes.
  setInterval( request, 1000 * 60 * 10, new URL( 'http://flappyshape.herokuapp.com/' ) );
}

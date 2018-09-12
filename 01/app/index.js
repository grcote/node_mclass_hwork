/*
* Node Master Class: Homework Assignment #1 
* Description: "Hello World" RESTful JSON API
* Author: Gerard Cote (grcote@gmail.com)
* Date: 11-Sep-18
*/

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Configuration
var serverPort = 3000;

// Server Instantiation
var server = http.createServer(function(req, res){
    
    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the URL and parse it
 	// The 'true' parameter calls Node 'querystring' library on req.url object (works in tandem with 'url' module)
 	var parsedUrl = url.parse(req.url,true);

    // Get the path of the URL from parsedUrl object and trimming extra slashes using a RegEx
 	var path = parsedUrl.pathname;
 	var trimmedPath = path.replace(/^\/+|\/+$/g,'')

 	// Get the payload, if any (need 'string_decoder' -- in Dependencies above -- library to create a decoder object expecting utf-8 format)
 	// payloads come in streams; need to be gathered as bits come in and aggregated into a single object we use buffer to capture the pieces of data as it comes in
 	// when 'on' event 'data' emitted by 'req' object, a callback is called which adds 'decoder' 'data' to 'buffer'
 	// this process is the standard way to handle streams in NodeJS, i.e., we don't just grab an object, we have to build an object from a stream
 	var decoder = new StringDecoder('utf-8');
 	var buffer = '';
 	req.on('data', function(data){
 		buffer += decoder.write(data)
 	});

 	// when 'on' event 'end' emitted by 'req' object, a callback is called that handles the specific request
 	req.on('end', function(){

 		// Choose handler the request should be routed to (i.e. is it a key in the router object?); if none found, use notFound handler
 		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		chosenHandler(method,function(payload){

			// Convert the payload to a string
 			payloadString = JSON.stringify(payload);

 			// setHeader allows us to write metadata to response header (modifying the original metadata)
 			res.setHeader('Content-Type','application/json');

 			// Return and send the response
			res.end(payloadString);

			// Log to the console the relevant request/response information
		 	console.log('Request Information');
		 	console.log('  - received on path: '+trimmedPath);
		 	console.log('  - method: '+method);
		 	console.log('  - response string: ',payloadString);
		});
 	});
});

// Starting server
server.listen(serverPort,function(){
    console.log("The server is listening on port "+serverPort+" currently.");
});

// Defining handlers
var handlers = {};

// Hello handler
handlers.hello = function(method,callback){
	var payload = method == 'post' ? {'welcome_message': 'Thank you for visiting my RESTful JSON API'} : {};

	callback(payload);
};

// Not found handler
handlers.notFound = function(method,callback){
	callback({});
};

// Defining a request router
var router = {
	'hello': handlers.hello
};

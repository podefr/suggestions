/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
var urlParse = require("url"),
	app = require('http').createServer(function (req, res) {
		
	var url = urlParse.parse(req.url),
		file = url.pathname != "/" ? url.pathname : '/index.html',
		filetype = file.split(".").pop(),
		types = {"html" : "html",
				 "js" : "javascript",
				 "css": "css"};

  fs.readFile(__dirname + file,
		  function (err, data) {
		    if (err) {
		      res.writeHead(500);
		      return res.end('Error loading index.html');
		    }

		    res.writeHead(200, { 'Content-Type': 'text/' + types[filetype] });
		    res.end(data);
		  });
		}
).listen(8000),
io = require('socket.io').listen(app),
fs = require('fs'),
http = require('http');

http.globalAgent.maxSockets = Infinity;

// require olives. should be require("olives") once the npm is published
var olives = require("olives");
// Register the instance of socket.io
// This API will change until the final release
olives.registerSocketIO(io);
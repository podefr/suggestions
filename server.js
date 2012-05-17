/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */

// Required middleware
var Connect = require("connect"),
	http = require("http"),
	io = require("socket.io"),
	olives = require("olives"),
	browserID = require("olives-browserid-handler");

// Configuring the middleware
var connect = Connect()
	.use(Connect.static(__dirname + "/"));

var app = http.createServer(connect).listen(8000);

olives.registerSocketIO(io.listen(app));

olives.handlers.set("BrowserID", browserID.handler);
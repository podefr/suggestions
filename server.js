/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */

// Required middleware
var connect = require("connect"),
	http = require("http"),
	io = require("socket.io"),
	olives = require("olives"),
	browserID = require("olives-browserid-handler"),
	passport = require("passport");


http.globalAgent.maxSockets = Infinity;

olives.registerSocketIO(io.listen(http.createServer(connect()
		.use(connect.static(__dirname + "/public"))
		.use(connect.responseTime())
		.use(connect.cookieParser('si'))
		.use(connect.session({ secret: "not so secret when it's on github" }))
		.use(passport.initialize())
		.use(passport.session()))
	.listen(8000)));
		

olives.handlers.set("BrowserID", browserID.handler);
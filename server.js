/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */

// Required middleware
var connect = require("connect"),
	requirejs = require("requirejs"),
	http = require("http"),
	socketIO = require("socket.io"),
	olives = require("olives"),
	browserID = require("olives-browserid-handler"),
	parseCookie = connect.utils.parseCookie,
	sessionStore;

requirejs(["Store"], function (Store) {
	
	sessionStore = new Store;
	
});


var io = socketIO.listen(http.createServer(connect()
	.use(connect.responseTime())
	.use(function (req, res, next) {
		res.setHeader("Server", "node.js/" + process.versions.node);
		res.setHeader("X-Powered-By", "OlivesJS + Connect + Passport + Socket.io")
		next();
	})
	.use(connect.cookieParser('si'))
	.use(connect.session({ secret: "not so secret when it's on github", key: "suggestions.sid" }))
/*	.use(function (req, res, next) {
		  var cookie = parseCookie(req.headers.cookie);
		  console.log(cookie, "connect cookie")
		next();
	})*/
	.use(connect.static(__dirname + "/public"))
).listen(8000));

http.globalAgent.maxSockets = Infinity;

olives.registerSocketIO(io);

/*io.configure(function (){
  io.set('authorization', function (handshakeData, callback) {
	  var cookie = parseCookie(handshakeData.headers.cookie);
	  console.log(cookie, "socketio cookie")
	  callback(null, true);
  });
});*/
		

olives.handlers.set("BrowserID", browserID.handler);
olives.config.update("BrowserID", "sessionStore", sessionStore);
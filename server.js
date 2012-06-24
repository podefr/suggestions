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
	cookie = require("cookie"),
	RedisStore = require("connect-redis")(connect),
	sessionStore = new RedisStore;

var io = socketIO.listen(http.createServer(connect()
	.use(connect.responseTime())
	.use(function (req, res, next) {
		res.setHeader("Server", "node.js/" + process.versions.node);
		res.setHeader("X-Powered-By", "OlivesJS + Connect + Socket.io")
		next();
	})
	.use(connect.cookieParser())
	.use(connect.session({ 
		secret: "not so secret when it's on github",
		key: "suggestions.sid",
		store: sessionStore,
		cookie: {
			maxAge: null,
			httpOnly: true,
			path: "/"
		}
	}))
	.use(function (req, res, next) {
/*
		 sessionStore.get(req.sessionID, function (err, session) {
				if (err) {
					throw new Error(err);
				} else {
					session.auth = JSON.parse(data);
					sessionStore.set(req.sessionID, session);
				}
			});			 
*/
		next();
	})
	.use(connect.static(__dirname + "/public"))
).listen(8000), {log:false});

http.globalAgent.maxSockets = Infinity;

olives.registerSocketIO(io);

olives.handlers.set("BrowserID", browserID.handler);

olives.config.update("CouchDB", "secure", function (reqData) {

	var cookieJSON = cookie.parse(reqData.handshake.headers.cookie);

	// I don't like the split but is there a better solution?
	sessionStore.get(cookieJSON["suggestions.sid"].split("s:")[1].split(".")[0], function (err, data) {
		if (err) {
			throw new Error(err);
		} else {
			if (data.auth) console.log(data.auth.email, "is logged in")
		}
	});
});

olives.handlers.set("Login", function (data) {
	console.log(data);
});
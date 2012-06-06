/**
 * Suggestions
 * Copyright(c) 2012 Ta�aut
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
	sessionStore = new connect.session.MemoryStore;

var io = socketIO.listen(http.createServer(connect()
	.use(connect.responseTime())
	.use(function (req, res, next) {
		res.setHeader("Server", "node.js/" + process.versions.node);
		res.setHeader("X-Powered-By", "OlivesJS + Connect + Passport + Socket.io")
		next();
	})
	.use(connect.cookieParser('si'))
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
		// This should be generated by the identification method
		 //req.session.auth="guest:guest";
		 browserID.config.getUserLogin = function (user) {
			 
			 sessionStore.get(req.sessionID, function (err, session) {
					if (err) {
						throw Error(err);
					} else {
						session.auth = user;
					}
				});
			 
		 };
		next();
	})
	.use(connect.static(__dirname + "/public"))
).listen(8000));

http.globalAgent.maxSockets = Infinity;

olives.registerSocketIO(io);

olives.handlers.set("BrowserID", browserID.handler);

olives.config.update("CouchDB", "secure", function (reqData) {
	
	// SI pas de data.auth: on utilise guest
	// Si handshake on utilise le auth de la session
	
	var cookie = parseCookie(reqData.handshake.headers.cookie);

	// I don't like the split but is there a better solution?
	sessionStore.get(cookie["suggestions.sid"].split(".")[0], function (err, session) {
		if (err) {
			throw Error(err);
		} else {
			console.log("we should now add ", session, " auth to ", reqData);
		}
	});
});
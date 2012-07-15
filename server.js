/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */

// Required middleware
var connect = require("connect"),
	http = require("http"),
	socketIO = require("socket.io"),
	olives = require("olives"),
	CouchDBTools = require("couchdb-emily-tools"),
	cookie = require("cookie"),
	RedisStore = require("connect-redis")(connect),
	sessionStore = new RedisStore;

CouchDBTools.requirejs(["CouchDBUsers", "CouchDBUsers", "Transport"], function (CouchDBUsers, CouchDBUser, Transport) {
	
	var Users = new CouchDBUsers;
	Users.setTransport(new Transport(olives.handlers));
	
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
			.use(connect.static(__dirname + "/public"))
		).listen(8000), {log:true});

		http.globalAgent.maxSockets = Infinity;

		olives.registerSocketIO(io);
		
		olives.config.update("CouchDB", "sessionStore", sessionStore);
		
		olives.handlers.set("Login", function (json, onEnd) {

			Users.login(json.name, json.password).then(function (result) {
				var result = JSON.parse(result);

				if (!result.error) {		
					var cookieJSON = cookie.parse(json.handshake.headers.cookie),
						sessionID = cookieJSON["suggestions.sid"].split("s:")[1].split(".")[0];
	
					sessionStore.get(sessionID, function (err, session) {
						if (err) {
							throw new Error(err);
						} else {
							session.auth = json.name+":"+json.password;
							sessionStore.set(sessionID, session);
							onEnd({login:"okay", name:json.name});
						}
					});
					
				} else {
					onEnd({login:"failed", reason:"name or password invalid"});
				}
			}, function (result) {
				console.log(result)
			});
		});

});

process.on('uncaughtException', function (error) {
	   console.log(error.stack);
	});
	

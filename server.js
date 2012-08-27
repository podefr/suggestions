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

CouchDBTools.requirejs(["CouchDBUser", "Transport"], function (CouchDBUser, Transport) {

	var transport = new Transport(olives.handlers);

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

		olives.handlers.set("CreateAccount", function (json, onEnd) {
			var user = new CouchDBUser;

			user.setTransport(transport);

			user.set("password", json.password);
			user.set("name", json.name);

			user.create().then(function (si) {
				console.log("yes", si);
				user.unsync();
			}, function (si) {
				console.log("no", si);
				user.unsync();
			});
		});

		olives.handlers.set("Login", function (json, onEnd) {
			var user = new CouchDBUser;

			user.setTransport(transport);

			user.set("password", json.password);
			user.set("name", json.name);

			user.login().then(function (result) {
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

				user.unsync();
			}, function (result) {
				console.log(result);
				user.unsync();
			});
		});

});

process.on('uncaughtException', function (error) {
	   console.log(error.stack);
	});


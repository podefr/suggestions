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

	function log(type) {
		return console[type].apply(console[type], [].call.slice(arguments, 1));
	}

CouchDBTools.configuration.sessionStore = sessionStore;
CouchDBTools.configuration.cookieID = "suggestions.sid";

olives.handlers.set("CouchDB", CouchDBTools.handler);

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

		olives.handlers.set("CreateAccount", function (json, onEnd) {
			var user = new CouchDBUser;

			user.setTransport(transport);

			user.set("password", json.password);
			user.set("name", json.name);

			user.create().then(function (si) {
				onEnd({
					status: "okay",
					message: "The account was successfully created."
				})
				user.unsync();
			}, function (json) {
				if (json.error == "conflict") {
					onEnd({
						status: "failed",
						message: "An account with this user name already exists."
					});
				}
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

							session.auth = json.name + ":" + json.password;
							sessionStore.set(sessionID, session);
							onEnd({
								status: "okay",
								message: json.name + " is logged-in"
							});
						}
					});

				} else {
					onEnd({
						status: "failed",
						message: "name or password incorrect"
					});
				}

				user.unsync();
			}, function (result) {
				var error = JSON.stringify(result);
				onEnd({
						status: "failed",
						message: "Unexpected error" + error
					});
				log("error", error);
				user.unsync();
			});
		});

});

process.on('uncaughtException', function (error) {
	log("error", error.stack);
});


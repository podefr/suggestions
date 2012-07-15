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
		).listen(8000), {log:true});

		http.globalAgent.maxSockets = Infinity;

		olives.registerSocketIO(io);

		olives.config.update("CouchDB", "secure", function (reqData, callback) {
			//var cookieJSON = cookie.parse(reqData.handshake.headers.cookie);

			/*// I don't like the split but is there a better solution?
			sessionStore.get(cookieJSON["suggestions.sid"].split("s:")[1].split(".")[0], function (err, data) {
				if (err) {
					throw new Error(err);
				} else {
					if (data.auth) {
						reqData.auth = data.auth;
						callback(reqData);
					} else {
						return false;
					}
				}
			});*/
		});

		olives.handlers.set("Login", function (json, onEnd) {
			
			Users.login(json.name, json.password).then(function (result) {
				console.log(result)
			});
			
			/*if (json.name == "couchdb" && json.password == "couchdb") {
				
				var cookieJSON = cookie.parse(json.handshake.headers.cookie),
					sessionID = cookieJSON["suggestions.sid"].split("s:")[1].split(".")[0];

				sessionStore.get(sessionID, function (err, session) {
					if (err) {
						throw new Error(err);
					} else {
						session.auth = json.name+":"+json.password;
						sessionStore.set(sessionID, session);
						onEnd({login:"okay", name:"guest"});
					}
				});
			} else {
				onEnd({login:"failed", reason:"name or password invalid"});
			}*/
		});
		
});

process.on('uncaughtException', function (error) {
	   console.log(error.stack);
	});
	

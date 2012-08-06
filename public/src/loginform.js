/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("LoginForm", ["Olives/OObject", "Config", "Services", "Olives/Event-plugin", "Olives/Model-plugin", "Store"],

function (OObject, Config, Services, EventPlugin, ModelPlugin, Store) {
	
	var loginForm = new OObject(new Store({name:"", password:""})),
		transport = Config.get("Transport");
	
	loginForm.plugins.addAll({
		"event": new EventPlugin(loginForm),
		"model": new ModelPlugin(loginForm.model)
	});
	
	loginForm.login = function login() {
		transport.request("Login", {
			name: loginForm.model.get("name"),
			password: loginForm.model.get("password")
		}, function (result) {
			if (result.login == "okay") {
				console.log("logged in as", result.name);
			} else {
				console.log("login failed");
			}
		});
	};
	
	loginForm.create = function create(event) {
		console.log("create")
		/**
		transport.request("CreateAccount", {
			name: loginForm.model.get("name"),
			password: loginForm.model.get("password")
		}, function (result) {
			console.log(result);
		});*/
	};

	loginForm.alive(Config.get("loginFormUI"));
	
	Services.screens.add("login", loginForm);
	
	Services.routing.set("login", function () {
		
		Services.screens.show("login");
	});
	
});
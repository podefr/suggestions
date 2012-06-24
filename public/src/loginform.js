/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("LoginForm", ["Olives/OObject", "Config", "Services", "Olives/Event-plugin", "Olives/Model-plugin"],

function (OObject, Config, Services, EventPlugin, ModelPlugin) {
	
	var loginForm = new OObject;
	
	loginForm.plugins.addAll({
		"event": new EventPlugin(loginForm),
		"model": new ModelPlugin(loginForm.model)
	});
	
	loginForm.login = function login() {
		console.log(loginForm.model.toJSON())
	};
	
	loginForm.alive(Config.get("loginFormUI"));
	
	Services.screens.add("login", loginForm);
	
	Services.routing.set("login", function () {
		
		Services.screens.show("login");
	});
	
});
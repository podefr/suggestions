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
		"model": new ModelPlugin(loginForm.model, {
			addClass: function (value, className) {
				value ? this.classList.add(className) : this.classList.remove(className);
			},
			removeClass: function (value, className) {
				!value ? this.classList.add(className) : this.classList.remove(className);
			}
		})
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
	
	loginForm.toggleCreateMode = function toggleCreateMode(event) {
		var current = this.model.get("mode");
		this.model.set("mode", !current);
		this.model.set("createBtnTxt", current ? "Create account" : "Cancel");
		this.model.set("loginBtnTxt", current ? "Login" : "Create");	
	};

	loginForm.alive(Config.get("loginFormUI"));
	
	Services.screens.add("login", loginForm);
	
	Services.routing.set("login", function () {
		
		Services.screens.show("login");
	});
	
});
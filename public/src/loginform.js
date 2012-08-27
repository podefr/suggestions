/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("LoginForm", ["Olives/OObject", "Config", "Services", "Olives/Event-plugin", "Olives/Model-plugin", "Store"],

function (OObject, Config, Services, EventPlugin, ModelPlugin, Store) {

	var loginForm = new OObject(new Store({name:"", password:"", confirmPassword: ""})),
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
		var name = this.model.get("name"),
			password = this.model.get("password"),
			confirmPassword = this.model.get("confirmPassword"),
			mode = this.model.get("mode");

		if ( mode
			 && ((password != confirmPassword)
			    || !password)) {

			console.log("password pas bon", this.model.get("password"), this.model.toJSON())
			return false;
		} else {

			transport.request(mode ? "CreateAccount" : "Login", {
				name: name,
				password: password
			}, function (result) {
				if (result.login == "okay") {
					console.log("logged in as", result.name);
				} else {
					console.log("login failed");
				}
			});
			return true;
		}
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

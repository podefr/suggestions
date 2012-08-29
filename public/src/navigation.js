/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("Navigation", ["Olives/Event-plugin", "Olives/OObject", "Config", "Services", "Olives/Model-plugin"],

function (EventPlugin, OObject, Config, Services, ModelPlugin) {

	/**
	 * Defines the navigation bar UI
	 * The template is taken from the dom and given by the main app
	 */
	return function NavigationConstructor() {

		// An OObject based UI
		var navigation = new OObject;

		// The function called by the navigation bar when a menu is clicked
		navigation.show = function (event, node) {
			Services.routing.get(node.href.split("#").pop());
		};

		// The function that messes with the .active class, triggered on location change
		Services.routing.watch(function (menu) {
			var toActivate = this.template.querySelector("li a[href='#" + menu + "']"),
				activated = this.template.querySelector("li.active");

			activated && activated.classList.remove("active");
			toActivate && toActivate.parentNode.classList.add("active");
		}, navigation);

		// The dom requires an EventPlugin to handle clicks
		navigation.plugins.addAll({
			"event": new EventPlugin(navigation),
			"model": new ModelPlugin(navigation.model)
		});

		Config.get("LoginForm").watchValue("login", function (value) {
			this.model.set("login", value ? value : "login");
		}, navigation);

		// And finally create the UI from the dom
		navigation.alive(Config.get("navbarUI"));

		return navigation;

	};

});

/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("Navigation", ["Olives/Event-plugin", "Olives/OObject", "Observable"],
		
function (EventPlugin, OObject, Observable) {
	
	/**
	 * Defines the navigation bar UI
	 * The template is taken from the dom and given by the main app
	 */
	return function NavigationConstructor(dom) {
		
		// An OObject based UI
		var navigation = new OObject,
		
		// The observable to publish events when a new screen is displayed
		observable = new Observable;
		
		// The function called by the navigation bar when a menu is clicked
		navigation.show = function (event, node) {
			this.activate(node.href.split("#").pop());
		};
		
		// The function that messes with the .active class
		navigation.activate = function (menu) {
			var selected = this.template.querySelector("li a[href='#" + menu + "']");
			this.template.querySelector("li.active").classList.remove("active");
			selected && selected.parentNode.classList.add("active");
			observable.notify("show", menu);
		};
		
		// A function to subscribe to notifications
		navigation.onActivate = function (func, scope) {
			return observable.watch("show", func, scope);
		};
		
		// The dom requires an EventPlugin to handle clicks
		navigation.plugins.add("event", new EventPlugin(navigation));
		
		// And finally create the UI from the dom
		navigation.alive(document.querySelector("body > div.navbar"));
		
		return navigation;
		
	};
	
});
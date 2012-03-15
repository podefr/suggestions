/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("Screens", ["Store", "Config"], 
		
/**
 * A Store to save and place UIs in the screen
 */
function ScreensConstructor(Store, Config) {

	// Screens are stored in a Store
	var _screens = new Store,
	// The current screen
	_currentScreen = null,
	// The dom where to place the UI
	_place = Config.get("container");

	return {

		add: function (name, UI) {
			UI.place(document.createDocumentFragment());
			return _screens.set(name, UI);
		},
			
		show: function (name) {
			var UI = _screens.get(name);
			
			_currentScreen && _currentScreen.place(document.createDocumentFragment());
			_currentScreen = UI;
	
			_currentScreen.place(_place);
		}
	};
	
});

define("Routing", 

/**
 * The Magic is in the illusion 
 * Where we go we do need routes
 */
["Observable"],
		
function (Observable) {

	// The observable for the routes
	var _routes = new Observable,
	// The one for the associated events
	_events = new Observable;
	
	return {
		
		// Set a new route
		set: _routes.watch,
		
		// Route
		get: function (path, params) {
			_routes.notify(path, params);
			// There's a notification when changing route
			_events.notify("route", path);
		},
		
		// Be notified on route change
		watch: function (func, scope) {
			_events.watch("route", func, scope);
		}
	};
	
});
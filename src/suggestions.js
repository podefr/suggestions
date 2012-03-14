/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("Screens", ["Store"], 
		
/**
 * A Store to save and place UIs in the screen
 */
function ScreensConstructor(Store) {

	// Screens are stored in a Store
	var _screens = new Store,
	// The current screen
	_currentScreen = null,
	// The dom where to place the UI
	_place = null;

	return {
		
		setPlace: function (dom) {
			_place = dom;
		},

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

require(["ListSuggestions", "SuggestionForm", "Navigation", "Screens", "Olives/Transport"],

/**
 * The application itself.
 * It creates each UI and makes them play together
 */
function (ListSuggestions, SuggestionForm, Navigation, Screens, Transport) {

	// transport is the link between the client and the server.
	// It requires an instance of socket.io
	var transport = new Transport(io, location.href),
	// The navigation UI
	navigation = Navigation(),
	// The suggestion form UI
	suggestionForm = SuggestionForm(transport),
	// The suggestions list
	list = ListSuggestions(transport);
	
	// Set Screens with the UIs and where to display them
	Screens.add("list", list);
	// Notice that edit and save use the same UI
	Screens.add("edit", suggestionForm);
	Screens.add("new", suggestionForm);
	Screens.setPlace(document.querySelector("#screens"));

	// Get notified when the user requires the display of a new screen through the navbar
	navigation.onActivate(function (screen) {
		Screens.show(screen);
	});
	
	// Init the application at the place given by the url 
	navigation.activate(location.hash.substring(1) || "list");

});
/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("SuggestionForm", ["Olives/OObject", "CouchDBStore", "Olives/Event-plugin", "Screens", "Routing", "Config"], 
		
function (OObject, CouchDBStore, EventPlugin, Screens, Routing, Config) {
	
	/**
	 * Defines the suggestion form. 
	 * It can be used to create a new suggestion, or edit one.
	 */
	return function SuggestionFormConstructor() {
			
		// This couchDBStore will be used as the model of the UI
		var couchDBStore = new CouchDBStore,
		
		// Create a newSuggestion UI, based on an OObject that will have the couchDBStore as Model
		suggestionForm = new OObject(couchDBStore);
		
		// Specify the transport that the couchDBStore should use
		couchDBStore.setTransport(Config.get("Transport"));
		
		// Declare the plugins
		suggestionForm.plugins.addAll({
			"event": new EventPlugin(suggestionForm)
		});
		
		// Add a synchronize method to specify which suggestion to connect to/create
		suggestionForm.sync = function (name) {
			// Synchronize with suggestions. Name is the document's id
			this.model.sync("suggestions", name);
		};
		
		// Add a method to upload the document
		suggestionForm.upload = function () {
			this.model.upload();
		};
		
		// The action on the cancel
		suggestionForm.cancel = function () {
			Routing.get("list");
		};

		// Make the dom alive
		suggestionForm.alive(Config.get("formUI"));
		
		// Declare the screen
		Screens.add("form", suggestionForm);
		
		// Declare the route new for creating a new suggestion
		Routing.set("new", function () {
			Screens.show("form");
		});
		
		// Declare the route edit for editing a suggestion
		Routing.set("edit", function (id) {
			Screens.show("form");
		});
		
		return suggestionForm;
		
	};
	
	
});
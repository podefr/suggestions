/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("SuggestionForm", ["Olives/OObject", "CouchDBStore", "Store", "Olives/Model-plugin", "Olives/Event-plugin", "Screens", "Routing", "Config"], 
		
function (OObject, CouchDBStore, Store, ModelPlugin, EventPlugin, Screens, Routing, Config) {
	
	/**
	 * Defines the suggestion form. 
	 * It can be used to create a new suggestion, or edit one.
	 */
	return function SuggestionFormConstructor() {
			
		// This couchDBStore will be used as the model of the UI
		var couchDBStore = new CouchDBStore,
		
		texts = new Store({
			legend: "New Suggestion",
			submit: "Suggest"
		}),
		
		// Create a newSuggestion UI, based on an OObject that will have the couchDBStore as Model
		suggestionForm = new OObject(couchDBStore);
		
		// Specify the transport that the couchDBStore should use
		couchDBStore.setTransport(Config.get("Transport"));
		
		// Declare the plugins
		suggestionForm.plugins.addAll({
			"model": new ModelPlugin(couchDBStore),
			"event": new EventPlugin(suggestionForm),
			"texts": new ModelPlugin(texts)
		});
		
		// Add a synchronize method to specify which suggestion to connect to/create
		suggestionForm.sync = function (name) {
			// Synchronize with suggestions. Name is the document's id
			this.model.sync("suggestions", name);
		};
		
		// The action on the cancel
		suggestionForm.cancel = function () {
			couchDBStore.unsync();
			Routing.get("list");
			event.preventDefault();
		};
		
		suggestionForm.upload = function (event) {
			couchDBStore.upload();
			couchDBStore.unsync();
			Routing.get("list");
			event.preventDefault();
		};

		// Make the dom alive
		suggestionForm.alive(Config.get("formUI"));
		
		// Declare the screen
		Screens.add("form", suggestionForm);
		
		// Declare the route new for creating a new suggestion
		Routing.set("new", function () {
			var date = new Date();
			texts.set("legend", "New Suggestion");
			texts.set("submit", "Suggest");
			couchDBStore.unsync();
			couchDBStore.reset({
				author: "", 
				desc: "",
				date:[
				      date.getFullYear(),
				      date.getMonth(),
				      date.getDay(),
				      date.getHours(),
				      date.getMinutes(),
				      date.getSeconds()
				     ]
			});
			// The document id is the time: self incrementing unique id!
			// This id could be base62 encode to reduce it by 5 chars to save important bytes in couchdb
			couchDBStore.sync("suggestions", date.getTime()+"");
			Screens.show("form");
		});
		
		// Declare the route edit for editing a suggestion
		Routing.set("edit", function (id) {
			texts.set("legend", "Edit Suggestion");
			texts.set("submit", "Save");
			couchDBStore.sync("suggestions", id);
			Screens.show("form");
		});

		return suggestionForm;
		
	};
	
	
});
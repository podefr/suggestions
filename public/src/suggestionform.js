/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("SuggestionForm", ["Olives/OObject", "CouchDBStore", "Store", "Olives/Model-plugin", "Olives/Event-plugin", "Config", "Services"],

function (OObject, CouchDBStore, Store, ModelPlugin, EventPlugin, Config, Services) {

	/**
	 * Defines the suggestion form.
	 * It can be used to create a new suggestion, or edit one.
	 */
	return function SuggestionFormConstructor() {

		// This couchDBStore will be used as the model of the UI
		var couchDBStore = new CouchDBStore,

		texts = new Store({
			legend: "New Suggestion",
			submit: "Suggest",
			errorAuthor: false,
			errorDesc: false
		}),

		// Create a newSuggestion UI, based on an OObject that will have the couchDBStore as Model
		suggestionForm = new OObject(couchDBStore);

		// Specify the transport that the couchDBStore should use
		couchDBStore.setTransport(Config.get("Transport"));

		// Declare the plugins
		suggestionForm.plugins.addAll({
			"model": new ModelPlugin(couchDBStore),
			"event": new EventPlugin(suggestionForm),
			"texts": new ModelPlugin(texts, {
				addClass: function (value, className) {
					value ? this.classList.add(className) : this.classList.remove(className);
				},
				removeClass: function (value, className) {
					!value ? this.classList.add(className) : this.classList.remove(className);
				}
			})
		});

		// Add a synchronize method to specify which suggestion to connect to/create
		suggestionForm.sync = function (name) {
			// Synchronize with suggestions. Name is the document's id
			this.model.sync("suggestions", name);
		};

		// The action on the cancel
		suggestionForm.cancel = function () {
			couchDBStore.unsync();
			Services.routing.get("list");
			event.preventDefault();
		};

		suggestionForm.upload = function (event) {
			if (!couchDBStore.get("desc") || !couchDBStore.get("author")) {
				texts.set("errorDesc", !couchDBStore.get("desc"));
				texts.set("errorAuthor", !couchDBStore.get("author"));
				texts.set("error", true);
			} else {
				couchDBStore.upload();
				couchDBStore.unsync();
				Services.routing.get("list");
			}
		};

		Config.get("LoginForm").watchValue("login", function (value) {
			suggestionForm.model.set("author", value);
		});


		// Make the dom alive
		suggestionForm.alive(Config.get("newSuggestionFormUI"));

		// Declare the screen
		Services.screens.add("form", suggestionForm);

		// Declare the route new for creating a new suggestion
		Services.routing.set("new", function () {
			var date = new Date();
			texts.reset({
				"legend": "New Suggestion",
				"submit": "Suggest",
				"errorAuthor": false,
				"errorDesc": false,
				"error": false
			});
			couchDBStore.unsync();
			couchDBStore.reset({
				author: Config.get("LoginForm").get("login") || "",
				desc: "",
				date:[
				      date.getFullYear(),
				      date.getMonth(),
				      date.getDate(),
				      date.getHours(),
				      date.getMinutes(),
				      date.getSeconds()
				     ]
			});
			// The document id is the time: self incrementing unique id!
			// This id could be base62 encode to reduce it by 5 chars to save important bytes in couchdb
			couchDBStore.sync("suggestions", date.getTime()+"");
			Services.screens.show("form");
		});

		// Declare the route edit for editing a suggestion
		Services.routing.set("edit", function (id) {
			texts.reset({
				"legend": "Edit Suggestion",
				"submit": "Save",
				"errorAuthor": false,
				"errorDesc": false,
				"error": false
			});
			couchDBStore.unsync();
			couchDBStore.sync("suggestions", id);
			Services.screens.show("form");
		});

		return suggestionForm;

	};


});

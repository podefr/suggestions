/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("ListSuggestions", ["Olives/OObject", "CouchDBStore", "Olives/Model-plugin", "Olives/Event-plugin", "Routing", "Screens", "Config"], 
		
function (OObject, CouchDBStore, ModelPlugin, EventPlugin, Routing, Screens, Config) {
	
	/**
	 * Defines the list of suggestions UI.
	 * It can be resynchronized to display different suggestions
	 */
	return function ListSuggestionsConstructor() {
		
		// The UI's model
		var couchDBStore = new CouchDBStore(),
		
		// A listSuggestions UI that is based on a OObject
		// The OObject will have the couchDBStore as model
		listSuggestions = new OObject(couchDBStore);
		
		// Adding a Model plugin to listSuggestion UI to bind it's dom with it's model
		listSuggestions.plugins.addAll({
			"model": new ModelPlugin(listSuggestions.model, {
				formatDate: function (date) {
					this.innerHTML = new Date(date[0], date[1] , date[2]).toLocaleDateString();	
				}
			}),
			"event": new EventPlugin(listSuggestions)
		});

		// Set couchDBStore's transport
		couchDBStore.setTransport(Config.get("Transport"));
		
		// Synchronize the store with the "id" view
		listSuggestions.model.sync("suggestions", "list", "id", {
			descending: true
		});
		
		// Make the dom alive
		listSuggestions.alive(Config.get("listUI"));
		
		// Declare a list route for displaying the list
		Routing.set("list", function () {
			Screens.show("list");
		});
		
		// Declare the list UI
		Screens.add("list", listSuggestions);
		
		// The edit action for editing a suggestion
		listSuggestions.edit = function (event, node) {
			Routing.get("edit", couchDBStore.get(node.dataset["model_id"]).id);
		};

		cdb = couchDBStore
		// And return the new UI
		return listSuggestions;
	};
	
	
});
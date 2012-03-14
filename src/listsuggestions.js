/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("ListSuggestions", ["Olives/OObject", "CouchDBStore", "Olives/Model-plugin"], 
		
function (OObject, CouchDBStore, ModelPlugin) {
	
	/**
	 * Defines the list of suggestions UI.
	 * It can be resynchronized to display different suggestions
	 */
	return function ListSuggestionsConstructor(transport) {
		
		// The UI's model
		var couchDBStore = new CouchDBStore(),
		
		// A listSuggestions UI that is based on a OObject
		// The OObject will have the couchDBStore as model
		listSuggestions = new OObject(couchDBStore);
		
		// Adding a Model plugin to listSuggestion UI to bind it's dom with it's model
		listSuggestions.plugins.add("model", new ModelPlugin(listSuggestions.model));

		// Set couchDBStore's transport
		couchDBStore.setTransport(transport);
		
		// Synchronize the store with the "id" view
		listSuggestions.model.sync("suggestions", "list", "id");
		
		// Make the dom alive
		listSuggestions.alive(document.querySelector("div.suggestions"));
		
		// And return the new UI
		return listSuggestions;
	};
	
	
});
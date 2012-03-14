/**
 * Suggestions
 * Copyright(c) 2012 Ta•aut
 * MIT Licensed
 */
define("SuggestionForm", ["Olives/OObject", "CouchDBStore", "Olives/Transport"], 
		
function (OObject, CouchDBStore, Transport) {
	
	/**
	 * Defines the suggestion form. 
	 * It can be used to create a new suggestion, or edit one.
	 */
	return function SuggestionFormConstructor(transport) {
			
		// This couchDBStore will be used as the model of the UI
		var couchDBStore = new CouchDBStore,
		
		// Create a newSuggestion UI, based on an OObject that will have the couchDBStore as Model
		suggestionForm = new OObject(couchDBStore);
		
		// Specify the transport that the couchDBStore should use
		couchDBStore.setTransport(transport);
		
		// Add a synchronize method to specify wich suggestion to connect to/create
		suggestionForm.sync = function (name) {
			// Synchronize with suggestions. Name is the document's id
			this.model.sync("suggestions", name);
		};
		
		// Add a method to upload the document
		suggestionForm.upload = function () {
			this.model.upload();
		};

		// Make the dom alive
		suggestionForm.alive(document.querySelector("form.form-horizontal"));
		
		// Return the UI
		return suggestionForm;
		
	};
	
	
});
/*
 BrowserID-handler https://github.com/flams/browserid-handler
 The MIT License (MIT)
 Copyright (c) 2012 Olivier Scherrer <pode.fr@gmail.com>
*/
define("Olives/BrowserID",function(){return function(){var b=navigator,c=null;this.setNavigator=function(a){return a instanceof Object?(b=a,true):false};this.getNavigator=function(){return b};this.setTransport=function(a){return a&&a.request instanceof Function?(c=a,true):false};this.getTransport=function(){return c};this.login=function(a,c,d){var e=this;if(a instanceof Function){if(b&&b.id)b.id.get(function(b){e.verify(b,a,c)},d);else throw Error("navigator seems to be missing, check out https://developer.mozilla.org/en/BrowserID/Quick_Setup");
return true}else return false};this.verify=function(a,b,d){if(c)c.request("BrowserID",{assertion:a},function(a){b.call(this,JSON.parse(a))},d);else throw Error("a transport must be given to BrowserID before calling its login() function");}}});

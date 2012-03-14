/*
 Emily

 The MIT License (MIT)

 Copyright (c) 2012 Olivier Scherrer <pode.fr@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial 
 portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
*/
define("CouchDBStore",["Store","StateMachine","Tools","Promise"],function(a,d,g,b){function c(){var a=null,f={},e=new b,c={getView:function(){a.request("CouchDB",{method:"GET",path:"/"+f.database+"/_design/"+f.design+"/_view/"+f.view+"?update_seq=true"},function(e){e=JSON.parse(e);this.reset(e.rows);g.event("subscribeToViewChanges",e.update_seq)},this)},getDocument:function(){a.request("CouchDB",{method:"GET",path:"/"+f.database+"/"+f.document},function(a){a=JSON.parse(a);a._id?(this.reset(a),g.event("subscribeToDocumentChanges")):
e.reject(this)},this)},createDocument:function(){a.request("CouchDB",{method:"PUT",path:"/"+f.database+"/"+f.document,headers:{"Content-Type":"application/json"},data:this.toJSON()},function(){g.event("subscribeToDocumentChanges")})},subscribeToViewChanges:function(e){a.listen("CouchDB","/"+f.database+"/_changes?feed=continuous&heartbeat=20000&since="+e,function(e){if(e=="\n")return false;var e=JSON.parse(e),a;a=e.deleted?"delete":e.changes[0].rev.search("1-")==0?"add":"change";g.event(a,e.id)},this)},
subscribeToDocumentChanges:function(){a.listen("CouchDB","/"+f.database+"/_changes?feed=continuous&heartbeat=20000",function(e){if(e=="\n")return false;e=JSON.parse(e);e.id==f.document&&e.changes.pop().rev!=this.get("_rev")&&(e.deleted?g.event("deleteDoc"):g.event("updateDoc"))},this)},updateDocInStore:function(e){a.request("CouchDB",{method:"GET",path:"/"+f.database+"/_design/"+f.design+"/_view/"+f.view},function(a){JSON.parse(a).rows.some(function(a,b){a.id==e&&this.set(b,a)},this)},this)},removeDocInStore:function(e){this.loop(function(a,
b){a.id==e&&this.del(b)},this)},addDocInStore:function(e){a.request("CouchDB",{method:"GET",path:"/"+f.database+"/_design/"+f.design+"/_view/"+f.view},function(a){JSON.parse(a).rows.some(function(a,b){a.id==e&&this.alter("splice",b,0,a)},this)},this)},updateDoc:function(){a.request("CouchDB",{method:"GET",path:"/"+f.database+"/"+f.document},function(e){this.reset(JSON.parse(e))},this)},deleteDoc:function(){this.reset({})},updateDatabase:function(){a.request("CouchDB",{method:"PUT",path:"/"+f.database+
"/"+f.document,headers:{"Content-Type":"application/json"},data:this.toJSON()})},removeFromDatabase:function(){a.request("CouchDB",{method:"DELETE",path:"/"+f.database+"/"+f.document+"?rev="+this.get("_rev")})},resolve:function(){e.resolve(this)}},g=new d("Unsynched",{Unsynched:[["getView",c.getView,this,"Synched"],["getDocument",c.getDocument,this,"Synched"]],Synched:[["updateDatabase",c.createDocument,this],["subscribeToViewChanges",c.subscribeToViewChanges,this,"Listening"],["subscribeToDocumentChanges",
c.subscribeToDocumentChanges,this,"Listening"]],Listening:[["entry",c.resolve,this],["change",c.updateDocInStore,this],["delete",c.removeDocInStore,this],["add",c.addDocInStore,this],["updateDoc",c.updateDoc,this],["deleteDoc",c.deleteDoc,this],["updateDatabase",c.updateDatabase,this],["removeFromDatabase",c.removeFromDatabase,this]]});this.sync=function(a,b,c){if(typeof a=="string"&&typeof b=="string"&&typeof c=="string")return this.setSyncInfo(a,b,c),g.event("getView"),e;else if(typeof a=="string"&&
typeof b=="string"&&typeof c=="undefined")return this.setSyncInfo(a,b),g.event("getDocument"),e;return false};this.setSyncInfo=function(e,a,b){if(typeof e=="string"&&typeof a=="string"&&typeof b=="string")return f.database=e,f.design=a,f.view=b,true;else if(typeof e=="string"&&typeof a=="string"&&typeof b=="undefined")return f.database=e,f.document=a,true;return false};this.getSyncInfo=function(){return f};this.upload=function(){return g.event("updateDatabase")};this.remove=function(){return g.event("removeFromDatabase")};
this.setTransport=function(e){return e&&typeof e.listen=="function"&&typeof e.request=="function"?(a=e,true):false};this.getStateMachine=function(){return g};this.getTransport=function(){return a};this.actions=c}return function(){c.prototype=new a;return new c}});
define("Observable",["Tools"],function(a){return function(){var d={};this.watch=function(a,b,c){if(typeof b=="function"){var h=d[a]=d[a]||[];observer=[b,c];h.push(observer);return[a,h.indexOf(observer)]}else return false};this.unwatch=function(a){var b=a[0],a=a[1];return d[b]&&d[b][a]?(delete d[b][a],d[b].some(function(a){return!!a})||delete d[b],true):false};this.notify=function(g){var b=d[g],c;if(b){for(c=b.length;c--;)b[c]&&b[c][0].apply(b[c][1]||null,a.toArray(arguments).slice(1));return true}else return false};
this.hasObserver=function(a){return!(!a||!d[a[0]]||!d[a[0]][a[1]])};this.hasTopic=function(a){return!!d[a]};this.unwatchAll=function(a){d[a]?delete d[a]:d={};return true}}});
define("Promise",["Observable","StateMachine"],function(a,d){return function(){var g,b,c=new d("Unresolved",{Unresolved:[["resolve",function(a){g=a;h.notify("success",a)},"Resolved"],["reject",function(a){b=a;h.notify("fail",a)},"Rejected"],["addSuccess",function(a,e){h.watch("success",a,e)}],["addFail",function(a,e){h.watch("fail",a,e)}]],Resolved:[["addSuccess",function(a,e){a.call(e,g)}]],Rejected:[["addFail",function(a,e){a.call(e,b)}]]}),h=new a;this.resolve=function(a){return c.event("resolve",
a)};this.reject=function(a){return c.event("reject",a)};this.then=function(a,e,b,d){a instanceof Function&&(e instanceof Function?c.event("addSuccess",a):c.event("addSuccess",a,e));e instanceof Function&&c.event("addFail",e,b);b instanceof Function&&c.event("addFail",b,d);return this};this.getObservable=function(){return h};this.getStateMachine=function(){return c}}});
define("StateMachine",["Tools"],function(a){function d(){var d={};this.add=function(a,c,h,f){var e=[];if(d[a])return false;return typeof a=="string"&&typeof c=="function"?(e[0]=c,typeof h=="object"&&(e[1]=h),typeof h=="string"&&(e[2]=h),typeof f=="string"&&(e[2]=f),d[a]=e,true):false};this.has=function(a){return!!d[a]};this.get=function(a){return d[a]||false};this.event=function c(c){var h=d[c];return h?(h[0].apply(h[1],a.toArray(arguments).slice(1)),h[2]):false}}return function(g,b){var c={},h="";
this.init=function(a){return c[a]?(h=a,true):false};this.add=function(a){return c[a]?false:c[a]=new d};this.get=function(a){return c[a]};this.getCurrent=function(){return h};this.event=function(b){var e;e=c[h].event.apply(c[h].event,a.toArray(arguments));return e===false?false:(e&&(c[h].event("exit"),h=e,c[h].event("entry")),true)};a.loop(b,function(a,e){var b=this.add(e);a.forEach(function(a){b.add.apply(null,a)})},this);this.init(g)}});
define("Store",["Observable","Tools"],function(a,d){return function(g){var b=d.clone(g)||{},c=new a,h=new a,f=function(a){var f=d.objectsDiffs(a,b);["updated","deleted","added"].forEach(function(a){f[a].forEach(function(e){c.notify(a,e,b[e]);h.notify(e,b[e],a)})})};this.getNbItems=function(){return b instanceof Array?b.length:d.count(b)};this.get=function(a){return b[a]};this.has=function(a){return b.hasOwnProperty(a)};this.set=function(a,d){var f;return typeof a!="undefined"?(f=this.has(a),b[a]=
d,f=f?"updated":"added",c.notify(f,a,b[a]),h.notify(a,b[a],f),true):false};this.update=function(a,b,f){var g;return this.has(a)?(g=this.get(a),d.setNestedProperty(g,b,f),c.notify("updated",b,f),h.notify(a,g,"updated"),true):false};this.del=function(a){return this.has(a)?(this.alter("splice",a,1)||(delete b[a],c.notify("deleted",a),h.notify(a,b[a],"deleted")),true):false};this.delAll=function(a){return a instanceof Array?(a.sort(d.compareNumbers).reverse().forEach(this.del,this),true):false};this.alter=
function(a){var c,g;return b[a]?(g=d.clone(b),c=b[a].apply(b,Array.prototype.slice.call(arguments,1)),f(g),c):false};this.watch=function(a,b,d){return c.watch(a,b,d)};this.unwatch=function(a){return c.unwatch(a)};this.getStoreObservable=function(){return c};this.watchValue=function(a,b,c){return h.watch(a,b,c)};this.unwatchValue=function(a){return h.unwatch(a)};this.getValueObservable=function(){return h};this.loop=function(a,c){d.loop(b,a,c)};this.reset=function(a){if(a instanceof Object){var c=
d.clone(b);b=d.clone(a)||{};f(c);return true}else return false};this.toJSON=function(){return JSON.stringify(b)}}});
define("Tools",function(){return{getGlobal:function(){return function(){return this}.call(null)},mixin:function(a,d,g){this.loop(a,function(b,c){if(!d[c]||!g)d[c]=a[c]});return d},count:function(a){var d=0;this.loop(a,function(){d++});return d},compareObjects:function(a,d){return Object.getOwnPropertyNames(a).sort().join("")==Object.getOwnPropertyNames(d).sort().join("")},compareNumbers:function(a,d){return a>d?1:a<d?-1:0},toArray:function(a){return Array.prototype.slice.call(a)},loop:function(a,
d,g){var b,c;if(a instanceof Object&&typeof d=="function"){if(c=a.length)for(b=0;b<c;b++)d.call(g,a[b],b,a);else for(b in a)a.hasOwnProperty(b)&&d.call(g,a[b],b,a);return true}else return false},objectsDiffs:function(a,d){if(a instanceof Object&&d instanceof Object){var g=[],b=[],c=[],h=[];this.loop(d,function(c,e){typeof a[e]=="undefined"?h.push(e):c!==a[e]?b.push(e):c===a[e]&&g.push(e)});this.loop(a,function(a,b){typeof d[b]=="undefined"&&c.push(b)});return{updated:b,unchanged:g,added:h,deleted:c}}else return false},
jsonify:function(a){return a instanceof Object?JSON.parse(JSON.stringify(a)):false},clone:function(a){return a instanceof Array?a.slice(0):typeof a=="object"&&a!==null&&!(a instanceof RegExp)?this.mixin(a,{}):false},getNestedProperty:function(a,d){return a&&a instanceof Object?typeof d=="string"&&d!=""?d.split(".").reduce(function(a,b){return a[b]},a):typeof d=="number"?a[d]:a:a},setNestedProperty:function(a,d,g){if(a&&a instanceof Object)if(typeof d=="string"&&d!=""){var b=d.split(".");return b.reduce(function(a,
d,f){b.length==f+1&&(a[d]=g);return a[d]},a)}else return typeof d=="number"?(a[d]=g,a[d]):a;else return a}}});
define("Transport",["Store"],function(a){return function(d){var g=null;this.setReqHandlers=function(b){return b instanceof a?(g=b,true):false};this.getReqHandlers=function(){return g};this.request=function(a,c,d,f){return g.has(a)&&typeof c=="object"?(g.get(a)(c,function(){d.apply(f,arguments)}),true):false};this.listen=function(a,c,d,f){if(g.has(a)&&typeof c=="string"&&typeof d=="function"){var e=function(){d.apply(f,arguments)},c={keptAlive:true,method:"get",path:c},i=g.get(a)(c,e,e);return function(){i.func.call(i.scope)}}else return false};
this.setReqHandlers(d)}});
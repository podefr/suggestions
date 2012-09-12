A live demo is available here: http://www.taiaut.net:8000

###An application for gathering a team's suggestions

Suggestions is based on:

 * bootstrap-responsive by Twitter
 * socket.io and nodeJS
 * connect for the middleware
 * CouchDB
 * Emily + Olives
 * Redis for storing sessions 
 
![screenshot](https://github.com/podefr/suggestions/raw/master/docs/snapshot.png)

###Do try this at 127.0.0.1!

You need:

 * a couchdb up and running
 * a git clone of this repo
 * a redis-server up and running
 * node installed

```bash
git clone git@github.com:podefr/suggestions.git
```

If your database is located at 127.0.0.1, launch futon

```bash
open http://127.0.0.1:5984/_utils
```

Then create a database called suggestion with the following design document: https://github.com/podefr/suggestions/blob/master/docs/design_document.json
When you're ready, go into the cloned suggestion dir, then:

```bash
node server.js
```

and connect your browser:

```bash
open http://127.0.0.1:8000
```


# HELGO DB
Create a simple, offline/sync management system for a small educational NGO.


## Install
You can simply clone this repository and install the dependencies through [npm](https://www.npmjs.org/) and [bower](http://bower.io):

```
npm install
```

If you need more detailed instructions, please follow the steps from [angular-seed][ng-seed].


## Architecture

### Overview of Frameworks and Libraries
- JavaScript Web App based on [AngularJS][ng]
  - Started using [Angular Seed project][ng-seed]
- Themed using [Bootstrap][bootstrap]
  - using [angular-ui][angular-ui] as AngularJS integrated Bootstrap library
  - symbols using [Font Awesome][font-awesome]
  - Design originally based on theme [SB Admin 2][bootstrap-sb-admin]
- Local (offline enabled) database through [PouchDB][pouchdb]
  - using [angular-pouchdb][pouchdb-ng] as AngularJS integrated PouchDB library
  - Authentication (username/password) through [pouchdb-authentication plugin][pouchdb-auth]
- Server-side database (automatically synced by PouchDB) running [CouchDB][couchdb]


[ng]: https://docs.angularjs.org/api
[ng-seed]: https://github.com/angular/angular-seed
[pouchdb]: http://pouchdb.com/api.html
[pouchdb-ng]: https://github.com/angular-pouchdb/angular-pouchdb
[pouchdb-auth]: https://github.com/nolanlawson/pouchdb-authentication
[couchdb]: http://docs.couchdb.org/en/1.6.1/
[bootstrap]: http://getbootstrap.com/
[bootstrap-sb-admin]: http://startbootstrap.com/template-overviews/sb-admin-2/
[font-awesome]: http://fortawesome.github.io/Font-Awesome/icons/
[angular-ui]: https://angular-ui.github.io/bootstrap/

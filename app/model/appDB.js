angular.module('myApp.appDB', [
    'pouchdb',
])

    .config(function (pouchDBProvider, POUCHDB_METHODS) {
        // nolanlawson/pouchdb-authentication
        var authMethods = {
            login: 'qify',
            logout: 'qify',
            getUser: 'qify'
        };
        pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
    })

    .service('appDB', function ($log, pouchDB) {
        var user = {
            name: 'admin',
            password: 'DKtVM2i7ajhj'
        };

        var remoteDB = pouchDB(DB_REMOTE + '/hdb', {skipSetup: true});
        var ajaxOpts = {
            ajax: {
                headers: {
                    Authorization: 'Basic ' + window.btoa(user.name + ':' + user.password)
                }
            }
        };
        remoteDB.login(user.name, user.password, ajaxOpts).then(function () {
            db.replicate.sync(remoteDB, {
                live: true,
                retry: true
            });
            db._loggedIn = true;
        }).catch(function (error) {
            console.error("Could not log in to the remote database.");
            console.error(error);
            db._loggedIn = false;
        });

        var db = pouchDB('hdb');
        db.remoteDB = remoteDB;
        db.isLoggedIn = function () {
            console.log("isLoggedIn?");
            console.log(db);
            console.log(db._loggedIn);

            db.remoteDB.getSession()
                .then(function (session) {
                    if (session.ok) {
                        db._loggedIn = true;
                    }
                    else {
                        db._loggedIn = false;
                    }
                })
                .catch(function (err) {
                    $log.error(err);
                    db._loggedIn = false;
                });

            // return previous known status immediately
            return db._loggedIn;
        };

        return db;
    });
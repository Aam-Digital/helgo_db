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
        }).catch(function (error) {
            console.error("Could not log in to the remote database.");
            console.error(error);
        });

        db = pouchDB('hdb');

        return db;
    });
angular.module('myApp.appDB', [
    'pouchdb',
])

    .factory('appDB', function (pouchDB) {
        var remoteDB = pouchDB(DB_REMOTE + '/hdb', {skipSetup: true});
        var db = pouchDB('hdb');
        db.replicate.sync(remoteDB, {
            live: true,
            retry: true
        });

        return db;
    });
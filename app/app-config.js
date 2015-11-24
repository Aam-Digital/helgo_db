angular.module('myApp.config', [])
    .factory('appConfig', function () {
        return {
            'version': "1.0.0",
            'github': {
                'user': "sebastian-leidig",
                'repository': "helgo_db"
            },
            'database': {
                'name': "dev",
                'remote_url': "http://demo-db.sinnfragen.org/db/"
            }
        };
    });


angular.module('myApp.child', [
    'myApp.appDB',
])

    .factory('Child', ['appDB', function ($log, appDB) {
        function Child(childData) {
            if (childData) {
                this.setData(childData);
                this._id = childData.pn;
            }
        };

        Child.prototype = {
            setData: function (childData) {
                angular.extend(this, childData);
                return this;
            },
            delete: function () {
                appDB.delete(this);
            },
            update: function () {
                appDB.put(this);
            },
        };

        Child.load = function (pn) {
            return appDB.get(pn)
                .then(function (data) {
                    return new Child(data);
                },
                $log.error);
        };

        return Child;
    }])


    .factory('childrenManager', ['appDB', '$q', 'Child', function (appDB, $q, Child) {
        var childrenManager = {
            _pool: {},
            _retrieveInstance: function (pn, data) {
                var instance = this._pool[pn];

                if (instance) {
                    instance.setData(data);
                } else {
                    instance = new Child(data);
                    this._pool[pn] = instance;
                }

                return instance;
            },
            _search: function (pn) {
                return this._pool[pn];
            },
            _load: function (pn, deferred) {
                var scope = this;
                appDB.get(pn)
                    .then(
                    function (data) {
                        var child = scope._retrieveInstance(data.pn, data);
                        deferred.resolve(child);
                    },
                    function () {
                        deferred.reject();
                    });
            },

            /* Public Methods */
            get: function (pn) {
                var deferred = $q.defer();
                var o = this._search(pn);
                if (o) {
                    deferred.resolve(o);
                } else {
                    this._load(pn, deferred);
                }
                return deferred.promise;
            },

            getAll: function () {
                var deferred = $q.defer();
                var scope = this;
                appDB.allDocs({include_docs: true, descending: true})
                    .then(function (dataArray) {
                        var items = [];
                        dataArray.rows.forEach(function (row) {
                            var data = row.doc;
                            var o = scope._retrieveInstance(data._id, data);
                            items.push(o);
                        });

                        deferred.resolve(items);
                    },
                    function () {
                        deferred.reject();
                    });
                return deferred.promise;
            },
        };
        return childrenManager;
    }]);

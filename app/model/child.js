PREFIX_CHILD = "child:";

angular.module('myApp.child', [
    'myApp.appDB',
])

    .factory('Child', ['$log', 'appDB', function ($log, appDB) {
        function Child(childData) {
            if (childData) {
                this.setData(childData);
                this._id = PREFIX_CHILD+childData.pn;
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

            age: function () {
                var now = new Date();
                var diff = now.getTime() - this.dateOfBirth.getTime();
                return Math.ceil(diff / (1000 * 3600 * 24 * 365));
            },
        };

        return Child;
    }])


    .factory('childrenManager', ['DbManager', 'Child', function (DbManager, Child) {
        var manager = new DbManager(PREFIX_CHILD, Child);

        angular.extend(manager, {
            // add functions/fields to extend baseManager here
        });

        return manager;
    }]);

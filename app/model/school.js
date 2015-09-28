angular.module('myApp.school', [
    'myApp.appDB',
])

    .factory('School', ['AbstractModel', function (AbstractModel) {
        var prefix = "school:";

        function School(data) {
            if (data) {
                this.setData(data);
                this._id = prefix + data.name;
            }
        };

        School.prefix = prefix;

        School.prototype = angular.extend({}, AbstractModel, {
            toString: function () {
                var extMedium = "";
                if (this.medium) {
                    extMedium = " (" + this.medium + " Medium)";
                }
                return this.name + extMedium;
            },
        });

        return School;
    }])


    .factory('schoolManager', ['DbManager', 'School', function (DbManager, School) {
        var manager = new DbManager(School);

        angular.extend(manager, {
            // add functions/fields to extend baseManager here
        });

        return manager;
    }]);

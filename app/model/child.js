
angular.module('myApp.child', [
    'myApp.appDB',
])

    .factory('Child', ['AbstractModel', function (AbstractModel) {
        var prefix = "child:";

        function Child(childData) {
            if (childData) {
                this.setData(childData);
                this._id = prefix + childData.pn;
            }
        };

        Child.prefix = prefix;

        Child.prototype = angular.extend(AbstractModel.prototype, {
            age: function () {
                var now = new Date();
                var birth = new Date(this.dateOfBirth);
                var diff = now.getTime() - birth.getTime();
                return Math.ceil(diff / (1000 * 3600 * 24 * 365));
            },
        });

        return Child;
    }])


    .factory('childrenManager', ['DbManager', 'Child', function (DbManager, Child) {
        var manager = new DbManager(Child);

        angular.extend(manager, {
            // add functions/fields to extend baseManager here
        });

        return manager;
    }]);

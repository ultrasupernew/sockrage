angular.module("sockRage", []);

/**
 * ANGULAR SOCKRAGE FACTORY
 */
angular.module('sockRage').factory('$AngularSockr', ['$q',
    function($q) {

        var array = new Array();
        var listenerInitialized = false;
        var ref;

        /**
         * LISTEN FOR DATA FROM SOCKRAGE SERVER
         * @param ref
         */
        function listenSockrageServer(ref) {

            if (!listenerInitialized) {

                ref.listen(function(data) {

                    asyncHandler(data); //we will send this data to promise

                });

                listenerInitialized = true;

            }

        }

        /**
         * EMPTY THE SYNCHRONIZED ARRAY
         */
        function emptyArray() {

            //empty this array
            for (var i = array.length - 1; i >= 0; i--) {

                array.pop();
            }

        }

        /**
         * COPY A JAVASCRIPT OBJECT
         * @param object
         * @returns {*}
         */
        function copyObject(object) {

            return JSON.parse(JSON.stringify(object));

        }

        /**
         * GET DATA TO DEFER IT WITH PROMISE
         * @param data
         */
        function asyncHandler(data) {

            var deferred = $q.defer();

            var promise = deferred.promise;

            deferred.resolve(data);

            promise.then(function(data) {

                if (data.operation == "create") {

                    console.log(data);

                    array.push(copyObject(data.objects));
                }

                else if(data.operation == "update") {

                    //element updated. Re list everything
                    ref.list();
                }

                else if(data.operation == "delete") {

                    //element updated. Re list everything
                    ref.list();
                }

                else if (data.operation == "getAll") {

                    emptyArray();

                    //push new object in array
                    for (var i = data.objects.length - 1; i >= 0; i--) {

                        array.push(data.objects[i]);
                    }

                }

            }, function(reason) {

                console.log(reason);
            });

        }

        /**
         * MAIN OBJECT
         * @param _ref
         * @returns {AngularSockr}
         * @constructor
         */
        function AngularSockr(_ref) { //this is a constrictor when SockRageAngular is called.

            ref = _ref;

            array.$set = function(data) {

                ref.set(data);
            }

            array.$delete = function(_id) {

                ref.delete(_id);
            }

            array.$update = function(_id, data) {

                ref.update(_id, data);
            }

            listenSockrageServer(ref);

            this.$asArray = function() {

                ref.list(); //new array = we want all data

                return array;
            }

            if (!(this instanceof AngularSockr))
                return new AngularSockr(ref);
        }

        /**
         * RETURN THE MAIN OBJECT
         */
        return AngularSockr;

    }]);
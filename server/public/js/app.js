/**
 * BUILT WITH ANGULAR JS
 * SOCKRAGE CLIENT
 */

var sockRage = angular.module('sockRage', [
    'ngRoute',
    'sockRageControllers',
    'sockRageServices',
    'sockRageFilters'
]);

sockRage.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

sockRage.factory("authService", function($window){
    return {
        isAuthenticated: function(){

            if($window.sessionStorage["is_connected"] == "false" || $window.sessionStorage["is_connected"] == null) {
                $window.location.href= "#/login";
            }

        }
    };
});

sockRage.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'login.html',
                controller: 'loginController'
            }).
            when('/projects', {
                templateUrl: 'projects.html',
                controller: 'projectsController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/references', {
                templateUrl: 'references.html',
                controller: 'referencesController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).            
            when('/login', {
                templateUrl: 'login.html',
                controller: 'loginController'
            }).
            when('/newReference/:project_id', {
                templateUrl: 'newReference.html',
                controller: 'newReferenceController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/statistics', {
                templateUrl: 'statistics.html',
                controller: 'statisticsController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/references', {
                templateUrl: 'references.html',
                controller: 'referencesController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/logout', {
                templateUrl: 'logout.html',
                controller: 'logoutController'
            }).
            when('/projects', {
                templateUrl: 'projects.html',
                controller: 'projectsController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/newProject', {
                templateUrl: 'newProject.html',
                controller: 'newProjectController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/project/:project_id', {
                templateUrl: 'project.html',
                controller: 'projectController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/project/edit/:project_id', {
                templateUrl: 'projectEdit.html',
                controller: 'projectEditController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/project/delete/:project_id', {
                templateUrl: 'projectDelete.html',
                controller: 'projectDeleteController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/project/references/:project_id', {
                templateUrl: 'projectReferences.html',
                controller: 'projectReferencesController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/reference/:reference_id', {
                templateUrl: 'reference.html',
                controller: 'referenceController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/reference/edit/:reference_id', {
                templateUrl: 'referenceEdit.html',
                controller: 'referenceEditController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            when('/reference/delete/:reference_id', {
                templateUrl: 'referenceDelete.html',
                controller: 'referenceDeleteController',
                resolve: {
                    auth: function(authService){
                        return authService.isAuthenticated();
                    }
                }
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);
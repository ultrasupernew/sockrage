var sockRage = angular.module('sockRage', [
  'ngRoute',
  'sockRageControllers',
  'sockRageServices',
  'sockRageFilters'
]);

sockRage.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

sockRage.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'projects.html',
        controller: 'projectsController'
      }).
      when('/about', {
        templateUrl: 'about.html',
        controller: 'aboutController'
      }).
      when('/newReference/:project_id', {
        templateUrl: 'newReference.html',
        controller: 'newReferenceController'
      }).
      when('/statistics', {
        templateUrl: 'statistics.html',
        controller: 'statisticsController'
      }).
      when('/references', {
        templateUrl: 'references.html',
        controller: 'referencesController'
      }).
      when('/logout', {
        templateUrl: 'logout.html',
        controller: 'logoutController'
      }).
      when('/projects', {
        templateUrl: 'projects.html',
        controller: 'projectsController'
      }).
      when('/newProject', {
        templateUrl: 'newProject.html',
        controller: 'newProjectController'
      }).
      when('/project/:project_id', {
        templateUrl: 'project.html',
        controller: 'projectController'
      }).
      when('/project/edit/:project_id', {
        templateUrl: 'projectEdit.html',
        controller: 'projectEditController'
      }).
      when('/project/delete/:project_id', {
        templateUrl: 'projectDelete.html',
        controller: 'projectDeleteController'
      }).
      when('/project/references/:project_id', {
        templateUrl: 'projectReferences.html',
        controller: 'projectReferencesController'
      }).
      when('/reference/:reference_id', {
        templateUrl: 'reference.html',
        controller: 'referenceController'
      }).
      when('/reference/edit/:reference_id', {
        templateUrl: 'referenceEdit.html',
        controller: 'referenceEditController'
      }).
      when('/reference/delete/:reference_id', {
        templateUrl: 'referenceDelete.html',
        controller: 'referenceDeleteController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
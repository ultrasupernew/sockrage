var sockRageServices = angular.module('sockRageServices', ['ngResource']);

sockRageServices.factory('Projects', ['$resource',

	function($resource){

		return $resource('/internal/api/projects/:project_id', {}, 
		{
			'query': { method: 'GET', isArray: true },
			'update': { method:'PUT' }
		});

	}]);

sockRageServices.factory('References', ['$resource',

	function($resource){

		return $resource('/internal/api/references/:reference_id', {}, 
		{
			'query': { method: 'GET', isArray: true },
			'update': { method:'PUT' }
		});

	}]);
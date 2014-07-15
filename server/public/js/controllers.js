var sockRageControllers = angular.module('sockRageControllers', []);

sockRageControllers.controller('aboutController', ['$scope', '$http',
	function ($scope, $http) {

	}]
);

sockRageControllers.controller('dashboardController', ['$scope', '$http',
	function ($scope, $http) {

	}]
);

sockRageControllers.controller('projectEditController', ['$scope', '$http', 'Projects', '$routeParams',
	function ($scope, $http, Projects, $routeParams) {

	    $scope.project = Projects.get({ project_id: $routeParams.project_id });

	    console.log($scope.project);

	    $scope.updateProject = function(project) {

	    	console.log(project);

	    	if(project != null) {
			    
		        Projects.update({ project_id : project._id }, project, function (res) {

		        	console.log(res);

		        	if (res.message == "success") {

		        		toastr.success("Project updated");
		        	}
		        	else if(res.message == "project.name.format.error") {

		        		toastr.error("Project name is not well formatted");
		        	}
		        	else {

		        		toastr.error("Error while trying to update project.");
		        	}

		        });
	    	}

	    };

	}]
);

sockRageControllers.controller('newReferenceController', ['$scope', '$http', '$routeParams', 'Projects', 'References',
	function ($scope, $http, $routeParams, Projects, References) {

	    $scope.project = Projects.get({ project_id: $routeParams.project_id });


		$scope.fields = [{id: 'field1'}];

		$scope.addNewField = function() {
		  var newItemNo = $scope.fields.length + 1;
		  $scope.fields.push({'id' : 'field' + newItemNo});
		};

		$scope.removeField = function(index) {
		
			if ($scope.fields.length > 1) {
				$scope.fields.splice(index, 1);
			}
		  
		};

		$scope.showAddField = function(field) {
  			return true;
		};

	    $scope.createReference = function(reference, fields) {

	    	console.log(reference);
	    	console.log("called");

	    	if(reference != null) {

		      	//ok we have our fields. let's save it !

			    $scope.reference = new References();
			    $scope.reference.reference_name = reference.reference_name;
			    $scope.reference.reference_description = reference.reference_description;
			    $scope.reference.is_active = reference.is_active;
			    $scope.reference.project_id = $scope.project._id;
				$scope.reference.project_identifier = $scope.project.project_name; //can be another value than simply the project name...

		        References.save({}, $scope.reference, function (res) {

		        	if (res.message == "success") {

		        		toastr.success("Reference created");
		        	}
		        	else if(res.message == "reference.name.format.error") {

		        		toastr.error("Reference name is not well formatted");
		        	}
		        	else {

		        		toastr.error("Error while trying to create reference.");
		        	}

		        	$scope.reference = null;
		        	$scope.fields = [{id: 'field1'}];
		        });

		    }

	    };

	}]
);

sockRageControllers.controller('statisticsController', ['$scope', '$http',
	function ($scope, $http) {

	}]
);

sockRageControllers.controller('referencesController', ['$scope', '$http', 'Projects',
	function ($scope, $http, Projects) {

	}]
);

sockRageControllers.controller('logoutController', ['$scope', '$http',
	function ($scope, $http) {

	}]
);

sockRageControllers.controller('projectsController', ['$scope', '$http', 'Projects',
	function ($scope, $http, Projects) {

		$scope.projects = Projects.query();

	}]
);

sockRageControllers.controller('projectController', ['$scope', '$http', '$routeParams', 'Projects',
	function ($scope, $http, $routeParams, Projects) {

	    $scope.project = Projects.get({ project_id: $routeParams.project_id });

	}]
);

sockRageControllers.controller('newProjectController', ['$scope', '$http', 'Projects',
	function ($scope, $http, Projects) {

	    $scope.createProject = function(project) {

	    	if(project != null) {

		      	$scope.project = angular.copy(project);

		      	//save it into DB

			    $scope.projects = new Projects();
			    $scope.projects.project_name = project.project_name;
			    $scope.projects.project_description = project.project_description;
			    
		        Projects.save({}, $scope.projects, function (res) {

		        	if (res.message == "success") {

		        		toastr.success("Project created");
		        	}
		        	else if(res.message == "project.name.format.error") {

		        		toastr.error("Project name is not well formatted");
		        	}
		        	else {

		        		toastr.error("Error while trying to create project.");
		        	}

		        	$scope.project = null;
		        });
	    	}

	    };

	}]
);

sockRageControllers.controller('projectDeleteController', ['$scope', '$http', '$routeParams', 'Projects', '$window',
	function ($scope, $http, $routeParams, Projects, $window) {

	    $scope.project = Projects.get({ project_id: $routeParams.project_id });

	    $scope.deleteProject = function(project, configuration) {

		  $http({method: 'GET', url: '/internal/api/configuration'}).
		    success(function(data, status, headers, config) {
		      
		    	console.log(data);

		      	if (configuration.super_admin_password == data.super_admin_password) {

			      	//we can now delete project
			        Projects.delete({ project_id : project._id }, project, function (res) {

			        	if (res.message == "success") {

			        		$window.location.href= "#/projects";

			        		toastr.success("Project removed");
			        	}
			        	else {

			        		toastr.error("Error while trying to remove project.");
			        	}

			        });

		      	}
		      	else {
		      		toastr.error("Password is not correct");
		      	}

		    });
	    }

	}]
);

sockRageControllers.controller('projectReferencesController', ['$scope', '$http', '$routeParams', 'Projects', 'References',
	function ($scope, $http, $routeParams, Projects, References) {

	      $scope.project = Projects.get({ project_id: $routeParams.project_id });

		  $http({method: 'GET', url: '/internal/api/references/' + $routeParams.project_id + '/getByProjectId'}).
		    success(function(data, status, headers, config) {
		      
		    	console.log(data);

		      	$scope.references = data;

		    });

	}]
);

sockRageControllers.controller('referenceController', ['$scope', '$http', '$routeParams', 'References', '$window',
	function ($scope, $http, $routeParams, References, $window) {

	    References.get({ reference_id: $routeParams.reference_id }, function(reference) {

	    	$scope.reference = reference;

	    });

	}]
);

sockRageControllers.controller('referenceEditController', ['$scope', '$http', '$routeParams', 'References',
	function ($scope, $http, $routeParams, References) {

	    References.get({ reference_id: $routeParams.reference_id }, function(reference) {

	    	$scope.reference = reference;

		    $scope.updateReference = function(reference, fields) {

		    	if(reference != null) {

				    $scope.reference = new References();
				    $scope.reference._id = reference._id;
				    $scope.reference.reference_name = reference.reference_name;
				    $scope.reference.reference_description = reference.reference_description;
				    $scope.reference.is_active = reference.is_active;
				    $scope.reference.project_id = reference.project_id;
				    $scope.reference.project_identifier = reference.project_identifier;

				    console.log("trying to update " + reference._id);

			        References.update({ reference_id : reference._id }, $scope.reference, function (res) {

			        	if (res.message == "success") {

			        		toastr.success("Reference updated");
			        	}
			        	else if(res.message == "reference.name.format.error") {

			        		toastr.error("Reference name is not well formatted");
			        	}
			        	else {

			        		toastr.error("Error while trying to update reference.");
			        	}
			        	
			        });

			    }

		    };


	    });

	}]
);


sockRageControllers.controller('referenceDeleteController', ['$scope', '$http', '$routeParams', 'References', '$window',
	function ($scope, $http, $routeParams, References, $window) {

	    $scope.reference = References.get({ reference_id: $routeParams.reference_id });

	    $scope.deleteProject = function(reference, configuration) {

		  $http({method: 'GET', url: '/internal/api/configuration'}).
		    success(function(data, status, headers, config) {
		      
		    	console.log(data);

		      	if (configuration.super_admin_password == data.super_admin_password) {

			      	//we can now delete reference
			        References.delete({ reference_id : reference._id }, reference, function (res) {

			        	if (res.message == "success") {

			        		$window.location.href= "#/projects";

			        		toastr.success("Reference removed");
			        	}
			        	else {

			        		toastr.error("Error while trying to reference project.");
			        	}

			        });

		      	}
		      	else {
		      		toastr.error("Password is not correct");
		      	}

		    });
	    }

	}]
);

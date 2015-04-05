//Controller for the main page
var app = angular.module('main', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('MainController', function($scope, $modal, $http, $window, toastr) {

	//Refresh function to reload everything on the page
	var refresh = function() {
		$http.get('/getUser').success(function(response) {
			$scope.username = response.name;
			$scope.location = response.preferences.location;
			$scope.interests = response.preferences.interests;
		});
		$http.get('/getUserProjects').success(function(response) {
			$scope.userProjects = response;
		});
		$http.get('/getOtherProjects').success(function(response) {
			$scope.otherProjects = response;
		});
	};

	//Refresh as we load the page for the first time to get our data
	refresh();

	//Allows users to setup their profile to join a community
	$scope.profileSetup = function() {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_setup.html',
			controller: 'SetupModalController'
		});

		modalInstance.result.then(function(response) {
			$http.post('/setupProfile', response).success(function(response) {
				if (response) {
					toastr.success('Profile set up', 'Hooray');
				} else {
					toastr.error('something went wrong');
				}
				$window.location.href = '/';
			});
		});		
	}

	$scope.logout = function() {
		$http.post('/logout').success(function(response) {
			$window.location.href = '/';
		});
	}

	$scope.view = function(id) {
		$window.location.href = '/view/' + id;
	}

	$scope.create = function() {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_project.html',
			controller: 'MainModalController',
			resolve: {
				input: function() {
					return {
						title: '',
						description: '',
						category: '',
						tags: [],
						pagetext: 'Creating'
					};
				}
			}
		});

		modalInstance.result.then(function(result) {
			var str = "{ title: '" + result.title + "', description: '" + result.description + "', category: '" + result.category + "', tags: ['";
			var i;
			for (i = 0; i < result.tags.length; i++ ){
				str += result.tags[i] + "', '";
			}
			str = str.substring(0, str.length - 4) + "'] }";
			var data = JSON.stringify(eval("(" + str + ")"));
			$scope.update(null, data);		
		});
	}

	$scope.edit = function(id, title, description, category, tags, likes, dislikes) {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_idea.html',
			controller: 'MainModalController',
			resolve: {
				input: function() {
					return {
						title: title,
						description: description,
						category: category,
						tags: tags,
						pagetext: 'Editing'
					};
				}
			}
		});

		modalInstance.result.then(function(result) {
			var str = "{ title: '" + result.title + "', description: '" + result.description + "', category: '" + result.category + "', tags: ['";
			var i;
			for (i = 0; i < result.tags.length; i++ ){
				str += result.tags[i] + "', '";
			}
			str = str.substring(0, str.length - 4) + "'], likes: 0, dislikes: 0 }";
			var data = JSON.stringify(eval("(" + str + ")"));
			$scope.update(id, data);
		});
	}

	$scope.remove = function(id, title, description, category, tags) {
		$http.delete('/idea/' + id).success(function(response) {
			if (response) {
				refresh();
			} else {
				console.log("Fail");
			}
		});
	}

	$scope.update = function(id, data) {
		if (id == null) {
			$http.post('/createIdea', data).success(function(response) {
				if (response) {
					refresh();
				} else {
					console.log("Fail");
				}
			});			
		} else {
			$http.put('/idea/' + id, data).success(function(response) {
				if (response) {
					refresh();
				} else {
					console.log("Fail");
				}
			});
		}
	}

	$scope.like = function(id, title, description, category, tags) {
		$http.get('/findRating/' + id).success(function(response) {
			if (response == 1) {
				$http.put('/user/1', {
					id: id,
					flag: -1
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: -1,
						dislikes: 0
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			} else if (response == 0) {
				$http.put('/user/1', {
					id: id,
					flag: 1
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: 1,
						dislikes: 0
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			} else if (response == -1) {
				$http.put('/user/1', {
					id: id,
					flag: 0
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: 1,
						dislikes: -1
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			}
		});
	}

	$scope.dislike = function(id, title, description, category, tags) {
		$http.get('/findRating/' + id).success(function(response) {
			if (response == -1) {
				$http.put('/user/0', {
					id: id,
					flag: -1
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: 0,
						dislikes: -1
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			} else if (response == 0) {
				$http.put('/user/0', {
					id: id,
					flag: 1
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: 0,
						dislikes: 1
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			} else if (response == 1) {
				$http.put('/user/0', {
					id: id,
					flag: 0
				}).success(function(response) {
					$http.put('/idea/' + id, {
						title: title,
						description: description,
						category: category,
						tags: tags,
						likes: -1,
						dislikes: 1
					}).success(function(response) {
						if (response) {
							refresh();
						} else {
							console.log("error");
						}
					});
				});
			}
		});
	}
});

app.controller('SetupModalController', function($scope, $modalInstance, toastr) {
	$scope.checkbox_interests = {
		art: false,
		design: false,
		fashion: false,
		film: false,
		food: false,
		games: false,
		music: false,
		photography: false,
		technology: false
	};
	$scope.checkbox_location = {
		paloalto: false,
		sanjose: false,
		toronto: false,
		vancouver: false
	}
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	$scope.checkError = function(object) {
		return (object === undefined || object === '' || (object[0] == '' && object.length == 1));
	}

	$scope.submit = function() {
		if ($scope.checkbox_interests.art == false &&
			$scope.checkbox_interests.design == false &&
			$scope.checkbox_interests.fashion == false &&
			$scope.checkbox_interests.film == false &&
			$scope.checkbox_interests.food == false &&
			$scope.checkbox_interests.games == false &&
			$scope.checkbox_interests.music == false &&
			$scope.checkbox_interests.photography == false &&
			$scope.checkbox_interests.technology == false) {
			toastr.error('Please select your interests', 'Error');
		} else if ($scope.checkbox_location.paloalto == false &&
			$scope.checkbox_location.sanjose == false &&
			$scope.checkbox_location.toronto == false &&
			$scope.checkbox_location.vancouver == false) {
			toastr.error('Please select your locations', 'Error');
		} else {
			$modalInstance.close({
				interests: $scope.checkbox_interests,
				location: $scope.checkbox_location
			});
		}
	}
});

app.controller('MainModalController', function($scope, $modalInstance, toastr) {
	$scope.checkError = function(object) {
		return (object === undefined || object === '' || (object[0] == '' && object.length == 1));
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}


	$scope.submit = function() {
		var correctTags = ($scope.tags.replace(/;+/g, ";")).replace(/'/g, "\\'");

		if (correctTags.charAt(correctTags.length - 1) == ';') {
			correctTags = correctTags.substring(0, correctTags.length - 1)
		}

		if (correctTags.charAt(0) == ';') {
			correctTags = correctTags.substring(1, correctTags.length)
		}

		correctTags = correctTags.split(';');

		var tags = $scope.removeDuplicates(correctTags);
		tags = tags.substring(0, tags.length - 1).split(';');

		if ($scope.checkError($scope.title)) {
			toastr.error('Please specify a title', 'Error');
		} else if ($scope.checkError($scope.description)) {
			toastr.error('Please enter a desciption for your idea', 'Error');
		} else if ($scope.checkError($scope.category)) {
			toastr.error('Please select a category for this idea', 'Error');
		} else if ($scope.checkError(tags)) {
			toastr.error('Please enter some keywords/tags for your idea', 'Error');
		} else {
			$modalInstance.close({
				title: $scope.title,
				description: $scope.description,
				category: $scope.category,
				tags: tags
			});
		}
	};
});

app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		closeButton: true,
		maxOpened: 1,
		timeOut: 2500
	});
});
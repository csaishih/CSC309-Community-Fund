//Controller for the main page
var app = angular.module('main', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('MainController', function($scope, $modal, $http, $window, toastr) {

	//Refresh function to reload everything on the page
	var refresh = function() {
		$http.get('/getUser').success(function(response) {
			$scope.username = response.name;
			$scope.location = response.preferences.location;
			$scope.interests = response.preferences.interests;
			$scope.ratedLikes = response.rated.likes;
			$scope.ratedDislikes = response.rated.dislikes;
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

	//Log out function
	$scope.logout = function() {
		$http.post('/logout').success(function(response) {
			$window.location.href = '/';
		});
	}

	//View a project in detail
	$scope.view = function(id) {
		$window.location.href = '/view/' + id;
	}

	//Setup user profile to join a community
	$scope.profileSetup = function() {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_setup.html',
			controller: 'SetupModalController',
			size: 'lg'
		});
		modalInstance.result.then(function(response) {
			$http.post('/setupProfile', response).success(function(response) {
				if (response) {
					toastr.success('Profile set up', 'Hooray');
				} else {
					toastr.error('Something went wrong');
				}
				refresh();
			});
		});
	}

	//Create a project
	$scope.create = function() {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_project.html',
			controller: 'MainModalController',
			size: 'lg',
			resolve: {
				input: function() {
					return {
						id: null,
						title: '',
						description: '',
						fundgoal: '',
						pagetext: 'Creating'
					};
				}
			}
		});
		modalInstance.result.then(function(response) {
			console.log(response);
			$http.post('/createProject', response).success(function(response) {
				if (response) {
					toastr.success('Project created', 'Success');
					refresh();
				} else {
					toastr.error('Something went wrong');
				}
			});
		});
	}

	$scope.edit = function(id, title, description, fundgoal) {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_project.html',
			controller: 'MainModalController',
			size: 'lg',
			resolve: {
				input: function() {
					return {
						id: id,
						title: title,
						description: description,
						fundgoal: fundgoal,
						pagetext: 'Editing'
					};
				}
			}
		});

		modalInstance.result.then(function(response) {
			$http.post('/editProject', response).success(function(response) {
				if (response) {
					toastr.success('Project changed', 'Success');
					refresh();
				} else {
					toastr.error('Something went wrong');
				}
			});
		});
	}

	$scope.remove = function(id) {
		$http.delete('/project/' + id).success(function(response) {
			if (response) {
				refresh();
			} else {
				toastr.error('Something went wrong', 'Error');
			}
		});
	}

	$scope.like = function(id, title, description, category, tags) {
		$http.get('/findRating/' + id).success(function(response) {
			if (response == 1) {
				$http.put('/user/1', {
					id: id,
					flag: -1
				}).success(function(response) {
					$http.put('/project/' + id, {
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
					$http.put('/project/' + id, {
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
					$http.put('/project/' + id, {
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
					$http.put('/project/' + id, {
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
					$http.put('/project/' + id, {
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
					$http.put('/project/' + id, {
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

app.controller('MainModalController', function($scope, $modalInstance, toastr, input) {
	$scope.pagetext = input.pagetext;
	$scope.title = input.title;
	$scope.description = input.description;
	$scope.fundgoal = input.fundgoal;
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

	$scope.checkError = function(object) {
		return (object === undefined || object === '' || (object[0] == '' && object.length == 1));
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	$scope.submit = function() {
		if ($scope.checkError($scope.title)) {
			toastr.error('Please enter a title for your project', 'Error');
		} else if ($scope.checkError($scope.description)) {
			toastr.error('Please enter a desciption for your project', 'Error');
		} else if ($scope.checkError($scope.fundgoal)) {
			toastr.error('Please specify a funding goal for your project', 'Error');
		} else if (!/^[0-9]*$/.test($scope.fundgoal)) {
			toastr.error('Please enter a valid number for fund goal', 'Error');
		} else if ($scope.checkbox_interests.art == false &&
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
				title: $scope.title,
				description: $scope.description,
				fundgoal: $scope.fundgoal,
				category: $scope.checkbox_interests,
				location: $scope.checkbox_location
			});
		}
	}
});

app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		closeButton: true,
		maxOpened: 1,
		timeOut: 2500
	});
});
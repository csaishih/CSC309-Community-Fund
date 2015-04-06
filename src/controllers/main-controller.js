//Controller for the main page
var app = angular.module('main', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('MainController', function($scope, $modal, $http, $window, toastr) {

	//Refresh function to reload everything on the page
	var refresh = function() {
		$http.get('/getUser').success(function(response) {
			$scope.userID = response._id;
			$scope.email = response.login.email;
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
		$http.get('/getCommunity'). success(function(response) {
			$scope.community = response;
		});
	};

	//Refresh as we load the page for the first time to get our data
	refresh();

	//View a user's profile
	$scope.viewProfile = function(id) {
		console.log(id);
		if (id == 0) {
			id = $scope.userID
		}
		$window.location.href = '/viewProfile/' + id;
	}

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
					toastr.success('Profile set up', 'Success');
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

	//Edit a project
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

	//Remove a project
	$scope.remove = function(id) {
		$http.delete('/project/' + id).success(function(response) {
			if (response) {
				refresh();
			} else {
				toastr.error('Something went wrong', 'Error');
			}
		});
	}

	//flag = 0 -> like project
	//flag = 1 -> like user
	$scope.like = function(id, flag) {
		$http.get('/findRating/' + id).success(function(response) {
			if (response == 1) {
				$http.put('/user/1', {
					id: id,
					flag: -1
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: -1,
							dislikes: 0
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			} else if (response == 0) {
				$http.put('/user/1', {
					id: id,
					flag: 1
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: 1,
							dislikes: 0
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			} else if (response == -1) {
				$http.put('/user/1', {
					id: id,
					flag: 0
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: 1,
							dislikes: -1
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			}
		});
	}

	$scope.dislike = function(id, flag) {
		$http.get('/findRating/' + id).success(function(response) {
			if (response == -1) {
				$http.put('/user/0', {
					id: id,
					flag: -1
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: 0,
							dislikes: -1
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			} else if (response == 0) {
				$http.put('/user/0', {
					id: id,
					flag: 1
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: 0,
							dislikes: 1
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			} else if (response == 1) {
				$http.put('/user/0', {
					id: id,
					flag: 0
				}).success(function(response) {
					if (flag == 0) {
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
					} else if (flag == 1) {
						$http.put('/rateUser/' + id, {
							likes: -1,
							dislikes: 1
						}).success(function(response) {
							if (response) {
								refresh();
							} else {
								console.log("error");
							}
						});
					}
				});
			}
		});
	}

	//Open admin modal
	$scope.admin = function() {
		$http.get('/allProjects').success(function(response) {
			var totalFund = 0;
			var i;
			for (i = 0; i < response.length; i++) {
				totalFund += response[i].funds.raised;
			}
			var modalInstance = $modal.open({
				templateUrl: '/src/html/modal_admin.html',
				controller: 'AdminModalController',
				size: 'lg',
				resolve: {
					input: function() {
						return {
							numAllProjects: response.length,
							totalFund: totalFund
						};
					}
				}
			});
			modalInstance.result.then(function(response) {
			});
		});
	}

	//Open funding modal
	$scope.fund = function(id, title) {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_fund.html',
			controller: 'FundModalController',
			size: 'lg',
			resolve: {
				input: function() {
					return {
						id: id,
						title: title
					};
				}
			}
		});
		modalInstance.result.then(function(response) {
			var r = response
			$http.put('/fundProject/' + id, response).success(function(response) {
				if (response) {
					toastr.success('Thank you for your funding', 'Success');
					$http.put('/comment/' + id, {
						comment: r.comment
					}).success(function(response) {
						refresh();
					});	
				} else {
					toastr.error('Something went wrong');
				}
			});
		});
	}
});

app.controller('AdminModalController', function($scope, $modalInstance, toastr, input) {
	$scope.numAllProjects = input.numAllProjects;
	$scope.totalFund = input.totalFund;
});

app.controller('FundModalController', function($scope, $modalInstance, toastr, input) {
	$scope.title = input.title;

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	$scope.checkError = function(object) {
		return (object === undefined || object === '' || (object[0] == '' && object.length == 1));
	}

	$scope.submit = function() {
		if ($scope.checkError($scope.fund)) {
			toastr.error('Please specify an amount', 'Error');
		} else if (!/^[0-9]*$/.test($scope.fund)) {
			toastr.error('Please enter a valid number for fund', 'Error');
		} else {
			$modalInstance.close({
				fund: $scope.fund,
				comment: $scope.comment
			});
		}
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
				id: input.id,
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
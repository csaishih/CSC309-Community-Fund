var app = angular.module('view', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('ViewProfileController', function($scope, $modal, $http, $window) {
	var refresh = function() {
		var location = $window.location.href;
		$http.get('/getUser').success(function(response) {
			$scope.currentUser = response.login.email;
		});
		$http.get('/findUser/' + location.substring(location.length - 24, location.length)).success(function(response) {
			$scope.id = response._id;
			$scope.name = response.name;
			$scope.email = response.login.email;
			$scope.category = response.preferences.interests;
			$scope.location = response.preferences.location;
			$scope.ratingLikes = response.rating.likes;
			$scope.ratingDislikes = response.rating.dislikes;
			$scope.date = response.date.dateObj;
			$scope.parsedDate = response.date.parsedDate;
			$scope.comments = response.comments;

			var total = $scope.ratingLikes + $scope.ratingDislikes;
			if (total > 0) {
				$scope.likes = (100 * $scope.ratingLikes) / total;
				$scope.dislikes = (100 * $scope.ratingDislikes) / total;
			}			
		});
	};
	refresh();

	//View a user's profile
	$scope.viewProfile = function(id) {
		console.log(id);
		if (id == 0) {
			id = $scope.userID
		}
		$window.location.href = '/viewProfile/' + id;
	}
	
	$scope.edit = function(id, name, email) {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_profile.html',
			controller: 'ViewEditModalController',
			size: 'lg',
			resolve: {
				input: function() {
					return {
						id: id,
						name: name,
						email: email,
						pagetext: 'Editing'
					};
				}
			}
		});
		modalInstance.result.then(function(response) {
			$http.post('/editUser', response).success(function(response) {
				if (response) {
					toastr.success('Your info has been updated', 'Success');
					refresh();
				} else {
					toastr.error('Something went wrong');
				}
			});
		});
	}

	$scope.removeComment = function(comment) {
		$http.post('/commentUser/' + $scope.id, {
			comment: comment
		}).success(function(response) {
			refresh();
		});
	}

	$scope.comment = function(id) {
		$http.put('/commentUser/' + id, {
			comment: $scope.com
		}).success(function(response) {
			refresh();
			$scope.com = "";
		});
	}
	
	$scope.goBack = function() {
		$window.location.href = '/';
	}

	$scope.logout = function() {
		$http.post('/logout').success(function(response) {
			$window.location.href = '/';
		});
	}
});

app.controller('ViewEditModalController', function($scope, $modalInstance, toastr, input) {
	$scope.pagetext = input.pagetext;
	$scope.name = input.name
	$scope.email = input.email
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

	//Places constraints on the password
	$scope.validatePassword = function(password, repassword) {
		if (/^[a-zA-Z0-9- ]*$/.test(password)) {
			toastr.error('You password must contain at least one special character such as !@#$%^&*', 'Error');
		} else if (password.length < 8) {
			toastr.error('You password must be at least 8 characters long', 'Error');
		} else if (password != repassword) {
			toastr.error('Passwords do not match!', 'Error');
		} else {
			return password == repassword;
		}
	}

	//Regex to check for validity of an email address
	$scope.validateEmail = function(email) {
		if (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email)) {
			return true;
		} else {
			toastr.error('Please enter a valid email address', 'Error');
		}
	}

	$scope.submit = function() {
		if ($scope.checkError($scope.name)) {
			toastr.error('Please enter your full name', 'Error');
		} else if ($scope.checkError($scope.password)) {
			toastr.error('Please enter your password', 'Error');
		} else if ($scope.checkError($scope.repassword)) {
			toastr.error('Please re-enter your password', 'Error');
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
		} else if ($scope.validateEmail($scope.email) && $scope.validatePassword($scope.password, $scope.repassword)) {
			$modalInstance.close({
				id: input.id,
				name: $scope.name,
				email: $scope.email,
				password: $scope.password,
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
var app = angular.module('view', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('ViewController', function($scope, $modal, $http, $window) {
	var refresh = function() {
		var location = $window.location.href;
		$http.get('/getUser').success(function(response) {
			$scope.currentUser = response.login.email;
		});
		$http.get('/findProject/' + location.substring(location.length - 24, location.length)).success(function(response) {
			$scope.id = response._id;
			$scope.title = response.title;
			$scope.description = response.description;
			$scope.category = response.category;
			$scope.location = response.location;
			$scope.fundgoal = response.funds.goal;
			$scope.fundsraised = response.funds.raised;
			$scope.ratingLikes = response.rating.likes;
			$scope.ratingDislikes = response.rating.dislikes;
			$scope.authorName = response.author.name;
			$scope.authorEmail = response.author.email;
			$scope.date = response.date.dateObj;
			$scope.parsedDate = response.date.parsedDate;
			$scope.comments = response.comments;

			var total = $scope.ratingLikes + $scope.ratingDislikes;
			if (total > 0) {
				$scope.likes = (100 * $scope.ratingLikes) / total;
				$scope.dislikes = (100 * $scope.ratingDislikes) / total;
			}
			
			if ($scope.fundsraised > $scope.fundgoal) {
				$scope.amountFunded = 100;
			} else {
				$scope.amountFunded = (100 * $scope.fundsraised) / $scope.fundgoal;
			}
			
		});
	};
	refresh();

	$scope.edit = function(id, title, description, fundgoal) {
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_project.html',
			controller: 'ViewEditModalController',
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
			console.log(response);
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

	$scope.removeComment = function(comment) {
		$http.post('/comment/' + $scope.id, {
			comment: comment
		}).success(function(response) {
			refresh();
		});
	}

	$scope.comment = function(id) {
		$http.put('/comment/' + id, {
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
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
		});
	};
	refresh();

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
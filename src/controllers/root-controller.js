//Controls the behaviour of the root page
var app = angular.module('root', ['ui.bootstrap', 'ngAnimate', 'toastr']);
app.controller('RootController', function($scope, $modal, $http, $window) {

	//Signup/Login functions
	//Creates a modal on the page where use can input information
	$scope.login = function() {

		//Create an instance of the login modal
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_login.html',
			controller: 'LoginModalController'
		});

		//Actions to take after the data in the modal is submitted by the user
		modalInstance.result.then(function(result) {
			var data = JSON.stringify(eval("({ email: '" + result.email + "', password: '" + result.password + "' })"));
			$http.post('/login', data).success(function(response) {
				if (response) {
					$window.location.href = '/';
				} else {
					toastr.error('Invalid email or password', 'Error');
					$scope.login();
				}
			});
		});
	};

	$scope.signup = function() {

		//Create an instance of the signup modal
		var modalInstance = $modal.open({
			templateUrl: '/src/html/modal_signup.html',
			controller: 'SignupModalController'
		});

		//Actions to take after the data in the modal is submitted by the user
		modalInstance.result.then(function(result) {
			var data = JSON.stringify(eval("({ name: '" + result.name + "', email: '" + result.email + "', password: '" + result.password + "' })"));
			$http.post('signup', data).success(function(response) {
				if (response) {
					$scope.login();
					toastr.success('You have successfully signed up', 'Success');
				} else {
					$scope.signup();
					toastr.error('The email address you entered is already taken', 'Error');
				}
			});
		});	
	};
});

//Controller for the login modal
app.controller('LoginModalController', function($scope, $modalInstance, toastr) {

	//Checks that all fields are properly filled in
	//Sends data back to the root controller
	$scope.submit = function() {
		if ($scope.checkError($scope.email)) {
			toastr.error('Please enter a valid email', 'Error');
		} else if ($scope.checkError($scope.password)) {
			toastr.error('Please enter your password', 'Error');
		} else {
			$modalInstance.close({
				email: $scope.email,
				password: $scope.password
			});
		}
	};

	$scope.checkError = function(object){
		return (object === undefined || object === '');
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

//Controller for the signup modal
app.controller('SignupModalController', function($scope, $modalInstance, toastr) {

	//Checks that all fields are properly filled in
	//Sends data back to the root controller
	$scope.submit = function() {
		if ($scope.checkError($scope.name)) {
			toastr.error('Please enter your full name', 'Error');
		} else if ($scope.checkError($scope.password)) {
			toastr.error('Please enter your password', 'Error');
		} else if ($scope.checkError($scope.repassword)) {
			toastr.error('Please re-enter your password', 'Error');
		} else if ($scope.validateEmail($scope.email) && $scope.validatePassword($scope.password, $scope.repassword)) {
			$modalInstance.close({
				name: $scope.name,
				email: $scope.email,
				password: $scope.password,
				repassword: $scope.repassword
			});
		}
	};

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

	$scope.checkError = function(object){
		return (object === undefined || object === '');
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

//Configure settings for the notification system
app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		closeButton: true,
		maxOpened: 1,
		timeOut: 2500
	});
});
var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app.config(function($routeProvider) {
    $routeProvider
   .when("/quiz/:username", {
		controller: 'QuizController',
        templateUrl : "tmp/quiz.html",
		controllerAs: 'vm'
    })
    .when("/login", {
		controller: 'LoginController',
        templateUrl : "tmp/login.html",
		controllerAs: 'vm'
    })
    .when("/register", {
		controller: 'RegisterController',
        templateUrl : "tmp/register.html",
		controllerAs: 'vm'
    })
	.when("/dashboard/:username", {
		controller: 'DashboardController',
        templateUrl : "tmp/dashboard.html",
		controllerAs: 'vm'
    })
	.otherwise({ redirectTo: '/login' });
});
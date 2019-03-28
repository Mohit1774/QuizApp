(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('DashboardController', DashboardController);
		
	DashboardController.$inject = ['UserService', '$location', '$routeParams'];	
    function DashboardController(UserService, $location, $routeParams ) {
        var vm = this;
		
		if($routeParams.username == null || $routeParams.username == undefined || $routeParams.username == ""){
			$location.path('/login');
		}
		
		var username = $routeParams.username;
		UserService.GetByUsername(username).then(function (user) {
			if(user.attemptedQuizs !== undefined){
				vm.attemptedQuizs = user.attemptedQuizs.reverse();
			}
			else{
				vm.attemptedQuizs = [];
			}
			
		});
		
		vm.redirectQuiz = function (){
			$location.path('/quiz/' + username);
		}
		
		
    }

})();
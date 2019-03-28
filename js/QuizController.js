(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('QuizController', QuizController);
		
	QuizController.$inject = ['UserService', '$location', '$timeout', '$interval', '$routeParams', '$rootScope', 'FlashService'];	
    function QuizController(UserService, $location, $timeout, $interval, $routeParams) {
        var vm = this;
		if($routeParams.username == null || $routeParams.username == undefined || $routeParams.username == ""){
			$location.path('/login');
		}
		
		var username = $routeParams.username;
		
		vm.selectedAnswers = [];
		vm.submitVisibility = false;
		
		vm.currentIndex = 0;
		vm.timeRem = [];
		vm.timeRem[vm.currentIndex] = 60;
		vm.totalTime = vm.timeRem[vm.currentIndex];
		vm.correctAnswers = 0;
		
		vm.QuizQuestions = [{'question': 'Which of these are client side libraries?', 'options': ['AngularJs', 'VueJs', 'Aurelia'], 'correctOptions': ['AngularJs', 'VueJs'], 'visibility': false, 'selectedAnswers': []}, {'question': 'Which of these are animals?', 'options': ['Cat', 'Dog', 'Carrot'], 'correctOptions': ['Cat', 'Dog'], 'visibility': false, 'selectedAnswers': []}, {'question': 'Which of these are fruits?', 'options': ['Carrot', 'Orange', 'Apple'], 'correctOptions': ['Orange', 'Apple'], 'visibility': false, 'selectedAnswers': []}
		]
		
		function sort(array) {
			return array.sort(function() {
				return .5 - Math.random();
			});
		}
		
		
		vm.QuizQuestions = sort(vm.QuizQuestions);
		
		vm.pushOption = function (index, seloption, el) {
			if(vm.QuizQuestions[index].selectedAnswers.indexOf(seloption) == -1){
				vm.QuizQuestions[index].selectedAnswers.push(seloption);
				$(el).addClass("btn-info");
			}
			else{
				vm.QuizQuestions[index].selectedAnswers.splice(vm.QuizQuestions[index].selectedAnswers.indexOf(seloption), 1);
				$(el).removeClass("btn-info");
			}
		}
		var firstInterval;
		var firstTimeout;
		
		vm.next = function(){
			$interval.cancel(firstInterval);
			$timeout.cancel(firstTimeout);
			
			vm.currentIndex++;
			if(vm.currentIndex == vm.QuizQuestions.length){
				vm.submitVisibility = true;
			}
			else{
				firstInterval = null;
				firstTimeout = null;
				vm.timeRem[vm.currentIndex] = vm.totalTime;
				firstTimeout = $timeout(function () {
					vm.next();
				}, vm.totalTime * 1000); 
				firstInterval = $interval(function () {
					vm.timeRem[vm.currentIndex]--;
				}, 1000, vm.totalTime);
			}
		}
		
		vm.save = function(){
			if(vm.QuizQuestions[vm.currentIndex].correctOptions.sort().toString() == vm.QuizQuestions[vm.currentIndex].selectedAnswers.sort().toString()){
				vm.correctAnswers = vm.correctAnswers + 1 ;
			}
			vm.next();
		}
		
		firstTimeout = $timeout(function () {
				vm.next();
			}, vm.totalTime * 1000);
			
		firstInterval = $interval(function () {
			vm.timeRem[vm.currentIndex]--;
		}, 1000, vm.totalTime); 
		
		
		vm.submit = function (){
			UserService.GetByUsername(username).then(function (user) {
				if(user.attemptedQuizs !== undefined){
					user.attemptedQuizs.push({'score': vm.correctAnswers, 'time': new Date()});
				}
				else{
					user.attemptedQuizs = [];
					user.attemptedQuizs.push({'score': vm.correctAnswers, 'time': new Date()});
				}
				
				UserService.Update(user).then(function () {
					alert("Quiz submitted successfully. You scored " + vm.correctAnswers + " out of " + vm.QuizQuestions.length);
					$location.path('/dashboard/' + username);
				});
			});
		}
		
    }

})();
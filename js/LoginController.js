(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

	LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = function (){
			vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/dashboard/' + vm.username);
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
		};
    }

})();
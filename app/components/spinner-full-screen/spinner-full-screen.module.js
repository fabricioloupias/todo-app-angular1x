angular.module('SpinnerFullScreen.modules', [])
    .directive('spinnerFullScreenComponent', function () {
        return {
            restrict: 'E',
            templateUrl: './components/spinner-full-screen/spinner-full-screen.html',
        }
    })

angular.module('Spinner.modules', [])
    .directive('spinnerComponent', function () {
        return {
            restrict: 'E',
            templateUrl: './components/spinner/spinner.html',
        }
    })

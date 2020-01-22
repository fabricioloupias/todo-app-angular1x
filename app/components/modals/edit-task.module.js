angular.module('EditTask.modules', [])

    .directive('editTaskModal', function () {
        return {
            restrict: 'EA',
            templateUrl: './components/modals/edit-task.html',
        };
    })
    .controller('EditTaskModalController', function () {
        
    })